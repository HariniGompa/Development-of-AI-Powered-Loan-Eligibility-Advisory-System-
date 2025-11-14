from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.services_ml import predict
from app.extensions import db
from app.models import PredictionHistory, User, ChatLog

def register_routes(app):
    @app.route("/api/predict", methods=["POST"])
    @jwt_required(optional=True)
    def api_predict():
        try:
            user_id = get_jwt_identity()
        except Exception:
            user_id = None

        data = request.get_json() or {}
        merged = {}

        # If user logged in, merge profile fields
        if user_id:
            user = User.query.get(user_id)
            if user:
                profile = {c.name: getattr(user, c.name) for c in user.__table__.columns if c.name not in ("password_hash",)}
                merged.update(profile)

        # incoming data may be nested under 'data' or at top level
        if "data" in data and isinstance(data["data"], dict):
            merged.update(data["data"])
        else:
            merged.update(data)

        # call ML service
        result = predict(merged)

        # store prediction history
        try:
            ph = PredictionHistory(
                user_id=user_id,
                input_snapshot=merged,
                output=result.get("decision") or result.get("loan_decision"),
                probability=result.get("probability"),
                reason=result.get("reason"),
                shap=result.get("shap_top3"),
                model_version=result.get("model_version")
            )
            db.session.add(ph)
            db.session.commit()
        except Exception as e:
            current_app.logger.warning("Failed to save prediction history: %s", e)

        return jsonify({
            "loan_decision": result.get("decision"),
            "approval_probability": result.get("probability"),
            "rejection_reason": result.get("reason"),
            "shap_top3": result.get("shap_top3"),
            "model_version": result.get("model_version")
        }), 200

    @app.route("/api/update_profile", methods=["POST"])
    @jwt_required()
    def update_profile():
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "user_not_found"}), 404

        allowed = [
            "gender","marital_status","dependents","education","age","job_title",
            "annual_salary","collateral_value","savings_balance","employment_type",
            "contract_years","previous_loan","previous_loan_status","previous_loan_amount",
            "total_emi_per_month","loan_purpose","loan_amount","repayment_term_months",
            "additional_income_name","additional_income_amount","num_credit_cards",
            "avg_credit_util_percent","late_payment_history","loan_insurance","credit_score"
        ]
        for k in allowed:
            if k in data:
                setattr(user, k, data.get(k))
        db.session.commit()

        # Auto-trigger prediction after profile update
        merged = {c.name: getattr(user, c.name) for c in user.__table__.columns if c.name not in ("password_hash",)}
        result = predict(merged)

        try:
            ph = PredictionHistory(
                user_id=user_id,
                input_snapshot=merged,
                output=result.get("decision"),
                probability=result.get("probability"),
                reason=result.get("reason"),
                shap=result.get("shap_top3"),
                model_version=result.get("model_version")
            )
            db.session.add(ph)
            db.session.commit()
        except Exception as e:
            current_app.logger.warning("Failed to save prediction after profile update: %s", e)

        return jsonify({"status": "ok", "prediction": result}), 200

    @app.route("/api/chat", methods=["POST"])
    @jwt_required(optional=True)
    def chat():
        data = request.get_json() or {}
        user_id = get_jwt_identity()
        message = data.get("message")
        if not message:
            return jsonify({"error": "no_message"}), 400

        # store chat log (user)
        try:
            cl = ChatLog(user_id=user_id, message=message, from_user=True, metadata={})
            db.session.add(cl)
            db.session.commit()
        except Exception as e:
            current_app.logger.warning("Failed to save chat log: %s", e)

        # placeholder bot reply (replace with your chatbot later)
        bot_reply = f"Echo: {message}"

        try:
            cl2 = ChatLog(user_id=user_id, message=bot_reply, from_user=False, metadata={})
            db.session.add(cl2)
            db.session.commit()
        except Exception:
            pass

        return jsonify({"reply": bot_reply}), 200
