from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User

def register_routes(app):
    @app.route("/api/admin/users", methods=["GET"])
    @jwt_required()
    def admin_list_users():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != "admin":
            return jsonify({"error": "forbidden"}), 403
        users = User.query.limit(200).all()
        out = [{"id": u.id, "username": u.username, "email": u.email, "role": u.role} for u in users]
        return jsonify({"users": out}), 200
