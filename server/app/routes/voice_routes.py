from flask import request, jsonify, current_app
from app.services.voice_services import save_audio, transcribe_audio
from app.extensions import db
from app.models import VoiceInput
from flask_jwt_extended import jwt_required, get_jwt_identity

def register_routes(app):
    @app.route("/api/upload_audio", methods=["POST"])
    @jwt_required(optional=True)
    def upload_audio():
        user_id = get_jwt_identity()
        f = request.files.get("file")
        if not f:
            return jsonify({"error": "no_file"}), 400
        filename = f.filename
        path = save_audio(f, filename)
        transcript = transcribe_audio(path)
        try:
            vi = VoiceInput(user_id=user_id, filename=filename, transcript=transcript)
            db.session.add(vi)
            db.session.commit()
        except Exception as e:
            current_app.logger.warning("Failed to save voice input: %s", e)
        return jsonify({"transcript": transcript}), 200
