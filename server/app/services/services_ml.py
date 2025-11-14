import os, joblib, numpy as np
from collections import OrderedDict
import lightgbm as lgb
from flask import current_app

MODEL = None
TRANSFORMER = None
ISO = None
SHAP_EXPLAINER = None

def load_artifacts():
    global MODEL, TRANSFORMER, ISO, SHAP_EXPLAINER
    cfg = current_app.config
    tpath = cfg.get("TRANSFORMER_PATH")
    mpath = cfg.get("MODEL_PATH")
    isopath = cfg.get("ISO_PATH")
    shap_path = cfg.get("SHAP_EXPLAINER_PATH")

    if tpath and os.path.exists(tpath):
        TRANSFORMER = joblib.load(tpath)
    if mpath and os.path.exists(mpath):
        try:
            MODEL = lgb.Booster(model_file=mpath)
        except Exception:
            MODEL = joblib.load(mpath)
    if isopath and os.path.exists(isopath):
        ISO = joblib.load(isopath)
    if shap_path and os.path.exists(shap_path):
        SHAP_EXPLAINER = joblib.load(shap_path)
    return TRANSFORMER, MODEL, ISO, SHAP_EXPLAINER

def predict(input_dict):
    # Load artifacts lazily
    global MODEL, TRANSFORMER, ISO, SHAP_EXPLAINER
    if MODEL is None or TRANSFORMER is None:
        try:
            load_artifacts()
        except Exception:
            pass

    # If no real model, return a deterministic heuristic (useful for dev)
    if MODEL is None or TRANSFORMER is None:
        credit = int(input_dict.get("credit_score") or 600)
        loan_amount = float(input_dict.get("loan_amount") or 0)
        salary = float(input_dict.get("annual_salary") or 1)
        monthly = salary / 12.0
        projected = loan_amount / max(int(input_dict.get("repayment_term_months") or 1), 1)
        dti = projected / max(monthly, 1)
        reason = ""
        if credit < 580:
            decision = "Rejected"; reason = "Low credit score"
        elif dti > 1.0:
            decision = "Rejected"; reason = "High DTI"
        else:
            decision = "Approved"
        shap_stub = OrderedDict([("credit_score", 0.5), ("dti", -0.3), ("loan_amount", -0.2)])
        prob = 0.6 if decision == "Approved" else 0.3
        return {"decision": decision, "probability": prob, "reason": reason, "shap_top3": list(shap_stub.items()), "model_version": "stub"}

    # Real model path: transform -> predict -> calibrate -> shap
    try:
        import pandas as pd
        X_df = pd.DataFrame([input_dict])
        X_t = TRANSFORMER.transform(X_df)
        raw = float(MODEL.predict(X_t)[0])
        prob = float(ISO.predict([raw])[0]) if ISO is not None else raw
        decision = "Approved" if prob >= 0.5 else "Rejected"

        shap_top3 = []
        if SHAP_EXPLAINER is not None:
            try:
                sv = SHAP_EXPLAINER.shap_values(X_t)
                if isinstance(sv, list) and len(sv) == 2:
                    arr = sv[1][0]
                else:
                    arr = np.array(sv)[0]
                idx = np.argsort(-np.abs(arr))[:3]
                for i in idx:
                    shap_top3.append((f"f{i}", float(arr[i])))
            except Exception:
                shap_top3 = []

        return {"decision": decision, "probability": prob, "reason": "", "shap_top3": shap_top3, "model_version": "lgb"}
    except Exception as e:
        return {"decision": "Rejected", "probability": 0.0, "reason": f"predict_error:{e}", "shap_top3": [], "model_version": "error"}
