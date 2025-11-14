from flask import Flask, jsonify
from .config import Config
from .extensions import db, jwt, migrate
from .routes import auth_routes, chatbot_routes, voice_routes, admin_routes
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    origins = [app.config.get('FRONTEND_URL'), 'http://localhost:3000']
    CORS(app, origins=origins, supports_credentials=True)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # register route groups
    auth_routes.register_routes(app)
    chatbot_routes.register_routes(app)
    voice_routes.register_routes(app)
    admin_routes.register_routes(app)

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'error': 'internal_server_error'}), 500

    return app
