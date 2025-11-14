from flask import request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity
)
from datetime import timedelta
from app.extensions import db
from app.models import User
from app.utils import hash_password, verify_password

def register_routes(app):
    @app.route("/api/signup", methods=["POST"])
    def signup():
        data = request.get_json() or {}
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")
        if not username or not password:
            return jsonify({"error": "username_password_required"}), 400
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "username_exists"}), 400

        pw_hash = hash_password(password)
        user = User(username=username, email=email, password_hash=pw_hash)

        # Populate profile fields if provided
        profile_fields = [
            "gender","marital_status","dependents","education","age","job_title",
            "annual_salary","collateral_value","savings_balance","employment_type",
            "contract_years","previous_loan","previous_loan_status","previous_loan_amount",
            "total_emi_per_month","loan_purpose","loan_amount","repayment_term_months",
            "additional_income_name","additional_income_amount","num_credit_cards",
            "avg_credit_util_percent","late_payment_history","loan_insurance","credit_score"
        ]
        for k in profile_fields:
            if k in data:
                setattr(user, k, data.get(k))

        db.session.add(user)
        db.session.commit()

        access = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
        refresh = create_refresh_token(identity=user.id)
        return jsonify({"access_token": access, "refresh_token": refresh, "user_id": user.id}), 201

    @app.route("/api/login", methods=["POST"])
    def login():
        data = request.get_json() or {}
        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return jsonify({"error": "username_password_required"}), 400

        user = User.query.filter_by(username=username).first()
        if not user or not verify_password(user.password_hash, password):
            return jsonify({"error": "invalid_credentials"}), 401

        access = create_access_token(identity=user.id)
        refresh = create_refresh_token(identity=user.id)
        return jsonify({"access_token": access, "refresh_token": refresh, "user_id": user.id}), 200

    @app.route("/api/refresh", methods=["POST"])
    @jwt_required(refresh=True)
    def refresh_token():
        identity = get_jwt_identity()
        access = create_access_token(identity=identity)
        return jsonify({"access_token": access}), 200
