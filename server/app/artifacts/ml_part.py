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
DATASET_PATH = os.path.join(PROJECT_ROOT, "dataset.csv")
ARTIFACTS_DIR = os.path.join(PROJECT_ROOT, "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

# -----------------------------
# Load dataset
# -----------------------------
df = pd.read_csv(DATASET_PATH)
if 'Loan_Status' in df.columns and 'approved' not in df.columns:
    df['Loan_Status'] = df['Loan_Status'].map({'Y':1,'N':0,'Yes':1,'No':0}).fillna(df['Loan_Status'])
    df.rename(columns={'Loan_Status':'approved'}, inplace=True)

X = df.drop(columns=['approved'])
y = df['approved']

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
explainer = shap.TreeExplainer(lgb_model)
shap_values = explainer.shap_values(X_test_t)

if isinstance(shap_values, list) and len(shap_values) == 2:
    shap_values_class1 = shap_values[1]
else:
    shap_values_class1 = shap_values

joblib.dump(explainer, os.path.join(ARTIFACTS_DIR, "shap_explainer.joblib"))
print("✅ SHAP explainer saved.")

# Generate sample SHAP summary plot
feature_names = numeric_features + list(preprocessor.named_transformers_['cat'].get_feature_names_out(categorical_features))
plt.figure(figsize=(8,6))
shap.summary_plot(shap_values_class1, X_test_t, feature_names=feature_names, show=False)
plt.tight_layout()
plt.savefig(os.path.join(ARTIFACTS_DIR, "shap_summary.png"), dpi=150)
plt.close()
print("✅ Sample SHAP summary plot saved as 'shap_summary.png'.")
