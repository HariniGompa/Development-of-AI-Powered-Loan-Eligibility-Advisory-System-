from .extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(256), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(32), default='user')
    # profile fields (see frontend mapping)
    gender = db.Column(db.String(32))
    marital_status = db.Column(db.String(32))
    dependents = db.Column(db.Integer)
    education = db.Column(db.String(64))
    age = db.Column(db.Integer)
    job_title = db.Column(db.String(128))
    annual_salary = db.Column(db.BigInteger)
    collateral_value = db.Column(db.BigInteger)
    savings_balance = db.Column(db.BigInteger)
    employment_type = db.Column(db.String(64))
    contract_years = db.Column(db.Integer)
    previous_loan = db.Column(db.Boolean, default=False)
    previous_loan_status = db.Column(db.String(64))
    previous_loan_amount = db.Column(db.BigInteger)
    total_emi_per_month = db.Column(db.Integer)
    loan_purpose = db.Column(db.String(64))
    loan_amount = db.Column(db.BigInteger)
    repayment_term_months = db.Column(db.Integer)
    additional_income_name = db.Column(db.String(64))
    additional_income_amount = db.Column(db.BigInteger)
    num_credit_cards = db.Column(db.Integer)
    avg_credit_util_percent = db.Column(db.Float)
    late_payment_history = db.Column(db.Boolean, default=False)
    loan_insurance = db.Column(db.Boolean, default=False)
    credit_score = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PredictionHistory(db.Model):
    __tablename__ = 'prediction_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    input_snapshot = db.Column(JSON)
    output = db.Column(db.String(64))
    probability = db.Column(db.Float)
    reason = db.Column(db.String(512))
    shap = db.Column(JSON)
    model_version = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatLog(db.Model):
    __tablename__ = 'chat_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    message = db.Column(db.Text)
    from_user = db.Column(db.Boolean, default=True)
    user_metadata = db.Column(JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class VoiceInput(db.Model):
    __tablename__ = 'voice_inputs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    filename = db.Column(db.String(512))
    transcript = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
