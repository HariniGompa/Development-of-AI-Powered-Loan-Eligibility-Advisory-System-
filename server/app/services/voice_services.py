import os
from pydub import AudioSegment
import speech_recognition as sr
from flask import current_app

def save_audio(file_storage, filename):
    upload_folder = current_app.config.get("UPLOAD_FOLDER", "./uploads/voice")
    os.makedirs(upload_folder, exist_ok=True)
    path = os.path.join(upload_folder, filename)
    file_storage.save(path)
    return path

def transcribe_audio(path):
    try:
        # Normalize to WAV for SpeechRecognition
        if not path.lower().endswith(".wav"):
            sound = AudioSegment.from_file(path)
            wav_path = path + ".wav"
            sound.export(wav_path, format="wav")
            path = wav_path
        r = sr.Recognizer()
        with sr.AudioFile(path) as source:
            audio = r.record(source)
        # Uses Google Web Speech API (requires internet) — quick dev option
        text = r.recognize_google(audio)
        return text
    except Exception as e:
        current_app.logger.warning("Audio transcription failed: %s", e)
        return None
