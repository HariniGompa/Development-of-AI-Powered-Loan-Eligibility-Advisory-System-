import os 
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.isotonic import IsotonicRegression
import lightgbm as lgb
import shap

# -----------------------------
# Paths according to your project structure
# -----------------------------
PROJECT_ROOT = os.path.abspath(".")      # adjust if running from subfolder
# You used an absolute path earlier; keep DATASET_PATH if you want to use relative path
# DATASET_PATH = os.path.join(PROJECT_ROOT, "dataset.csv")
DATASET_PATH = r"C:\Users\harin\OneDrive\Desktop\server\loan_train_20000.csv"
ARTIFACTS_DIR = os.path.join(PROJECT_ROOT, "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

# -----------------------------
# Load dataset
# -----------------------------
df = pd.read_csv(DATASET_PATH)

# ---- CHANGED: support your loan_decision target ----
TARGET = "loan_decision"

if TARGET not in df.columns:
    raise ValueError(f"❌ Target column '{TARGET}' not found in dataset. Columns: {df.columns.tolist()}")

# Convert "Approved"/"Rejected" (and some common variants) → numeric 1/0
df[TARGET] = df[TARGET].map({
    "Approved": 1,
    "Rejected": 0,
    "approved": 1,
    "rejected": 0,
    "Approved ": 1,   # trim/common extra versions
    " Rejected": 0,
    "Yes": 1,
    "No": 0,
    "Y": 1,
    "N": 0,
}).fillna(df[TARGET])

# If still string-like (rare), try a final normalization (e.g., "Approved"/"Rejected")
if df[TARGET].dtype == object:
    df[TARGET] = df[TARGET].str.strip().map({"Approved": 1, "Rejected": 0}).astype(int)

# Ensure numeric type
df[TARGET] = df[TARGET].astype(int)

y = df[TARGET]
X = df.drop(columns=[TARGET])

# -----------------------------
# Identify categorical and numeric features
# -----------------------------
categorical_features = X.select_dtypes(include=['object']).columns.tolist()
numeric_features = X.select_dtypes(include=['int64','float64']).columns.tolist()

# -----------------------------
# Preprocessing pipeline
# -----------------------------
preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
])

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

X_train_t = preprocessor.fit_transform(X_train)
X_test_t = preprocessor.transform(X_test)

# -----------------------------
# Train Logistic Regression + Isotonic Calibration
# -----------------------------
lr_model = LogisticRegression(max_iter=1000)
lr_model.fit(X_train_t, y_train)

y_lr_train = lr_model.predict_proba(X_train_t)[:,1]
iso_model = IsotonicRegression(out_of_bounds='clip')
iso_model.fit(y_lr_train, y_train)

# -----------------------------
# Train LightGBM
# -----------------------------
lgb_train = lgb.Dataset(X_train_t, label=y_train)
lgb_model = lgb.train(
    params={'objective':'binary','metric':'auc','verbose':-1},
    train_set=lgb_train,
    num_boost_round=200
)

# -----------------------------
# Save artifacts in /artifacts
# -----------------------------
joblib.dump(preprocessor, os.path.join(ARTIFACTS_DIR, "transformer.joblib"))
joblib.dump(lr_model, os.path.join(ARTIFACTS_DIR, "logistic.pkl"))
joblib.dump(iso_model, os.path.join(ARTIFACTS_DIR, "isotonic.joblib"))
lgb_model.save_model(os.path.join(ARTIFACTS_DIR, "lightgbm.txt"))
print("✅ Models trained and saved in 'artifacts' folder.")

# -----------------------------
# SHAP explainer + sample plot
# -----------------------------
# Ensure dense input for SHAP (OneHotEncoder may give sparse matrix)
if hasattr(X_test_t, "toarray"):
    X_test_dense = X_test_t.toarray()
else:
    X_test_dense = X_test_t

explainer = shap.TreeExplainer(lgb_model)
shap_values = explainer.shap_values(X_test_dense)

# Handle LightGBM binary case where shap_values is a list [class0, class1]
if isinstance(shap_values, list) and len(shap_values) == 2:
    shap_values_class1 = shap_values[1]
else:
    shap_values_class1 = np.array(shap_values)

joblib.dump(explainer, os.path.join(ARTIFACTS_DIR, "shap_explainer.joblib"))
print("✅ SHAP explainer saved.")

# Generate sample SHAP summary plot
# Build feature names safely
if categorical_features:
    cat_feature_names = list(preprocessor.named_transformers_['cat'].get_feature_names_out(categorical_features))
else:
    cat_feature_names = []

feature_names = numeric_features + cat_feature_names

plt.figure(figsize=(8,6))
# pass dense array to summary_plot
shap.summary_plot(shap_values_class1, X_test_dense, feature_names=feature_names, show=False)
plt.tight_layout()
plt.savefig(os.path.join(ARTIFACTS_DIR, "shap_summary.png"), dpi=150)
plt.close()
print("✅ Sample SHAP summary plot saved as 'shap_summary.png'.")
