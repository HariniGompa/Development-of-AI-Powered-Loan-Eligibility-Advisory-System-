import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'change-me')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///loan_ai.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './uploads/voice')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 10*1024*1024))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    MODEL_PATH = os.getenv('MODEL_PATH', './models/lightgbm.txt')
    TRANSFORMER_PATH = os.getenv('TRANSFORMER_PATH', './models/transformer.joblib')
    ISO_PATH = os.getenv('ISO_PATH', './models/isotonic.joblib')
    SHAP_EXPLAINER_PATH = os.getenv('SHAP_EXPLAINER_PATH', './models/shap_explainer.joblib')
