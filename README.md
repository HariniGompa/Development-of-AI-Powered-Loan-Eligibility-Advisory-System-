# AI Loan System - Full Stack Application

🏦 **An intelligent loan eligibility platform with AI chat, voice interaction, document verification, and PDF report generation.**

This project is a **free-tier version** that replicates cloud-style loan processing systems (chat, OCR, ML scoring, reporting) using **open-source alternatives** and **local services** that run entirely on your machine.

---
## Demo📷




## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Frontend Features](#frontend-features)
9. [Testing Guide](#testing-guide)
10. [Project Structure](#project-structure)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The AI Loan System automates the loan application process by:

- **Chat Interface**: Users interact with an AI agent (powered by Ollama/Llama3) to discuss loan options
- **Voice Input/Output**: Speech-to-text (Whisper) and text-to-speech (gTTS) for accessibility
- **Document Verification**: OCR-based (Tesseract) document extraction and validation
- **ML Prediction**: XGBoost model predicts loan eligibility based on applicant data
- **PDF Reports**: Jinja2 + WeasyPrint generates professional loan application reports
- **Manager Dashboard**: Review applications, make decisions, and download reports
- **JWT Authentication**: Secure user authentication with bcrypt password hashing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)               │
│  ┌────────────┐  ┌──────────┐  ┌────────────────┐          │
│  │  Chatbot   │  │  Voice   │  │ Document Upload│          │
│  │   (AI)     │  │ Input/Out│  │   & Verify     │          │
│  └────────────┘  └──────────┘  └────────────────┘          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │        Manager Dashboard & Decision Making         │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────┴──────────────────────────────────┐
│           FastAPI Backend (Port 8000)                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Chat API   │  │  Voice API   │  │   OCR API    │      │
│  │  (Ollama)    │  │  (Whisper)   │  │ (Tesseract)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Loan API    │  │ Report API   │  │ Manager API  │      │
│  │  (XGBoost)   │  │(WeasyPrint)  │  │   (Admin)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │    SQLite Database (SQLAlchemy ORM)                │   │
│  │    Users | Applications | Chat Sessions            │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼─────┐  ┌────────▼────────┐  ┌──────▼────────┐
│   Ollama     │  │    Whisper      │  │  Tesseract    │
│  (LLM Chat)  │  │  (STT & TTS)    │  │  (OCR)        │
└──────────────┘  └─────────────────┘  └───────────────┘
```

---

## 💻 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (default) or Postgres/Supabase via SQLAlchemy
- **Authentication**: JWT (python-jose) + bcrypt
- **LLM Chat**: Pluggable via `LLM_PROVIDER` (`ollama`, `gemini`, `openrouter`)
- **Voice (batch, local)**: Whisper CLI (STT) + FFmpeg + gTTS (TTS) over REST in `voice_routes` (`/api/voice/transcribe`, `/api/voice/synthesize`, `/api/voice/voice_agent`)
- **Voice (real-time, cloud)**: Deepgram Nova‑2 streaming STT + Groq Llama 3 (`AsyncGroq`) + Deepgram Aura streaming TTS in `voice_realtime_v2` (WebSocket `/voice/stream` mounted under the voice realtime v2 API)
- **Voice (real-time, local alternative)**: Vosk STT + Piper TTS via WebSocket in `voice_realtime.py`, with environment/health checks exposed from `voice_health.py`
- **Document OCR**: Tesseract (with graceful mock fallback)
- **ML Model**: XGBoost + Scikit-learn via `MLModelService`
- **PDF Generation**: Jinja2 + WeasyPrint via `ReportService`
- **Notifications & OTP**: Email-based OTP and WebSocket manager notifications

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS + custom design system
- **HTTP Client**: Axios wrappers in `src/utils/api.js`
- **Routing**: React Router v6 (see `src/App.js`)
- **State/UX**: Toasts (`react-toastify`), framer-motion animations

### Local / External Services
- **Ollama**: Local LLM inference server (default provider)
- **Tesseract**: Open-source OCR engine
- **Whisper**: OpenAI's CLI speech recogniser for file-based STT in the batch voice agent
- **Vosk**: Offline streaming STT backend used by the local WebSocket agent (`voice_realtime.py`)
- **Piper**: Offline low-latency TTS used by the local WebSocket agent (`voice_realtime.py`)
- **Deepgram**: Cloud STT + TTS (Nova‑2 + Aura) used by the default real-time voice agent (`voice_realtime_v2.py`)
- **Groq**: Cloud LLM (Llama 3) used by the default real-time voice agent (`voice_realtime_v2.py`)

---

## 📦 Prerequisites

### System Requirements
- **OS**: macOS (M1/M2 preferred, or Intel)
- **Node.js**: 18.x or higher
- **Python**: 3.11 or higher
- **RAM**: 8GB+ recommended
- **Disk**: 5GB+ for models and dependencies

### Required Software

#### 1. **Ollama** (LLM Chat)
```bash
# Install Ollama from https://ollama.ai
# Or via Homebrew:
brew install ollama

# Pull llama3 model (2.7GB)
ollama pull llama3

# Run Ollama server (default port 11434)
ollama serve
```

#### 2. **Tesseract** (OCR)
```bash
# Install via Homebrew
brew install tesseract

# Verify installation
tesseract --version
```

#### 3. **Whisper** (Speech Recognition)
```bash
# Will be installed via pip (openai-whisper)
# First time usage will download model (~2.7GB for base model)
```

#### 4. **Node.js & npm**
```bash
# Check version
node --version  # Should be 18+
npm --version   # Should be 9+
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
cd ~/Documents/Machine_Learning_Projects/Infosys_Project
# If using git:
# git clone <repo-url>
# Or navigate to existing folder:
cd ai-loan-system
```

### 2. Backend Setup (API + default users)

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (if you don't have one yet)
cp .env.example .env  # or create backend/.env manually

# Edit .env with your settings (local defaults shown below)
```

### 3. Train ML Model (optional but recommended)

**⚠️ IMPORTANT**: You must provide your own trained ML model, or adapt `ml/loan_training.py` to your dataset. The repo ships a template only.

```bash
# From project root
cd ml

# Edit loan_training.py to load your own dataset
# Implement load_your_dataset() with your data source
$EDITOR loan_training.py

# Run the training script (will error until you implement loading)
python3 loan_training.py

# By default this saves a model to:
#   ml/app/models/loan_model.pkl
```

**Default template dataset requirements (if you follow `loan_training.py` as-is):**
- Tabular data with columns: `annual_income`, `credit_score`, `loan_amount`, `loan_term_months`, `num_dependents`, `employment_status`, `eligible`
- `eligible` column should be 0 (ineligible) or 1 (eligible)
- At least 1000+ samples recommended for a stable model

### 3b. Using your own pre-trained model (no training step)

If you already have trained artifacts, place them in the models directory and the backend will auto-detect them at startup.

Supported filenames and locations:

- Directory: `ml/app/models/`
- Model file (any of): `loan_model.pkl`, `loan_xgboost_model.pkl`, or `model.pkl`
- Optional pre-processing files in the same directory:
  - `scaler.pkl` or `feature_scaler.pkl` (StandardScaler)
  - `label_encoders.pkl` (dict of sklearn LabelEncoder per categorical feature)

Alternatively, you can configure a custom directory via environment variable in `backend/.env`:

```
ML_MODEL_DIR=/absolute/path/to/ai-loan-system/ml/app/models
```

`MLModelService` will look for artifacts in this order:
1) `ML_MODEL_DIR` env variable (absolute or relative to backend)
2) The parent directory of an explicitly provided model path (internal use)
3) `ml/app/models` relative to the repo root
4) Fallback to `backend/app/models`

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
```

---

## ▶️ Running the Application

### Terminal 1: Start Ollama Server
```bash
ollama serve
# Output: Listening on 127.0.0.1:11434
```

### Terminal 2: Start Backend
```bash
cd backend
source venv/bin/activate
python main.py
# Or with uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at**: `http://localhost:8000`
**API Documentation**: `http://localhost:8000/docs` (Swagger UI)

### Terminal 3: Start Frontend
```bash
cd frontend
npm start
# Will open http://localhost:3000 in browser
```

<<<<<<< HEAD
### 4. Default Login Credentials

**Admin (Manager)**
- **Email**: `admin@example.com`
- **Password**: `admin123`

**Applicant**
- **Email**: `user@example.com`
- **Password**: `user123`

=======
>>>>>>> origin/main
## 🔑 Environment Variables

- Backend: copy `backend/.env.example` to `backend/.env` and adjust.
- Frontend: copy `frontend/.env.example` to `frontend/.env` and adjust.

Backend keys (most important):
- SECRET_KEY: JWT signing secret (set a strong value in prod).
- DATABASE_URL: DB connection string (SQLite default, Postgres optional).
- DB_SCHEMA: Postgres schema (default `public`).
- SUPABASE_HOSTADDR: Optional IP to bypass DNS for Supabase Postgres.
- LLM_PROVIDER: `ollama` | `gemini` | `openrouter`.
- OLLAMA_API_URL, OLLAMA_MODEL: Local LLM server URL and model tag.
- GEMINI_API_KEY, GEMINI_MODEL: Google Gemini key and model.
  - Get a key from Google AI Studio: https://makersuite.google.com/app/apikey
- OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_BASE_URL, OPENROUTER_SITE_URL, OPENROUTER_APP_NAME: OpenRouter config.
  - Get a key at https://openrouter.ai/ and set a default model.
- WHISPER_MODEL, WHISPER_LANGUAGE: STT model size and language hint.
- VOSK_MODEL_PATH, PIPER_MODEL: Optional local streaming STT/TTS models for the legacy Vosk+Piper WebSocket agent.
- GROQ_API_KEY, GROQ_MODEL: Groq cloud LLM settings used by the default real-time voice agent in `voice_realtime_v2.py`.
- DEEPGRAM_API_KEY: Deepgram cloud key used for both streaming STT and Aura TTS in `voice_realtime_v2.py`.
- SMTP_SERVER, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD: Email for OTP/notifications.
- OTP_SECRET: Secret seed used for generating OTPs (dev-friendly default provided).
- ML_MODEL_DIR: Optional path to trained model artifacts.
- ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM: JWT token config.

Example `backend/.env` (minimal local):
```env
SECRET_KEY=change-me
DATABASE_URL=sqlite:///./ai_loan_system.db
LLM_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434/api
OLLAMA_MODEL=llama3.2
WHISPER_MODEL=tiny
WHISPER_LANGUAGE=en
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

Example `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```

{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
}

Response: { access_token, token_type, user }
```

#### Login
```
POST /api/auth/login
{
  "email": "user@example.com",
}

```

### Chat Endpoints
POST /api/chat/message
{
  "message": "What is the loan eligibility criteria?",
  "application_id": 1  // optional
}

Response: {
  "message": "AI response text...",
  "suggested_next_steps": ["Upload document", "Check eligibility"]
}
```

### Voice Endpoints

#### Transcribe Audio
```
POST /api/voice/transcribe
Content-Type: multipart/form-data

Body: audio file (mp3, wav, m4a, etc.)

Response: { "transcribed_text": "..." }
```

#### Synthesize Speech
```
POST /api/voice/synthesize
{ "text": "Your eligibility score is 85%" }

Response: { "audio_base64": "...", "format": "mp3" }
```

### Document Verification

#### Verify Document
```
POST /api/verify/document/{application_id}
Content-Type: multipart/form-data

Body: document file (image or PDF)

Response: {
  "extracted_data": { ... },
  "confidence_scores": { ... },
  "verification_status": "success"
}
```

### Loan Prediction

#### Predict Eligibility
```
POST /api/loan/predict
{
  "annual_income": 75000,
  "credit_score": 720,
  "loan_amount": 50000,
  "loan_term_months": 60,
  "num_dependents": 2,
  "employment_status": "employed"
}

Response: {
  "eligibility_score": 0.82,
  "eligibility_status": "eligible",
  "risk_level": "low_risk",
  "recommendations": [...]
}
```

### Report Generation

#### Generate PDF Report
```
POST /api/report/generate/{application_id}

Response: {
  "report_path": "/path/to/report.pdf",
  "report_url": "/static/reports/report.pdf",
  "generated_at": "2024-01-15T10:30:00"
}
```

#### Download Report
```
GET /api/report/download/{application_id}

Response: PDF file (binary)
```

### Manager Dashboard

#### Get Statistics
```
GET /api/manager/stats

Response: {
  "total_applications": 50,
  "pending_applications": 10,
  "approved_applications": 35,
  "rejected_applications": 5
}
```

#### Get All Applications
```
GET /api/manager/applications?status_filter=pending&skip=0&limit=20

Response: [ { id, full_name, loan_amount, eligibility_score, ... }, ... ]
```

#### Make Decision
```
POST /api/manager/applications/{application_id}/decision
{
  "decision": "approved",  // or "rejected"
  "notes": "Good credit score and income ratio"
}

Response: { "success": true, "approval_status": "approved" }
```

---

## 🎨 Frontend Features

### 1. **Login/Registration**
- User registration (Applicant or Manager role)
- Secure JWT-based login
- Session management

### 2. **Applicant Dashboard**
- **Chatbot**: Interact with AI loan advisor
- **Voice Input**: Record and transcribe voice questions
- **Document Upload**: Upload ID, paystubs, bank statements
- **Eligibility Check**: View loan eligibility score

### 3. **Manager Dashboard**
- **Statistics**: Total, pending, approved, rejected applications
- **Application List**: Filter by status
- **Decision Making**: Approve or reject applications
- **Report Download**: Get PDF reports for applications

---

## 🧪 Testing Guide

### Test 1: User Registration & Login

```bash
# Using curl or Postman:

# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "full_name": "Test User",
    "role": "applicant"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Test 2: Chat Interaction

```bash
# Send a message
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is your loan eligibility criteria?",
    "application_id": 1
  }'
```

### Test 3: Loan Eligibility Prediction

```bash
curl -X POST http://localhost:8000/api/loan/predict \
  -H "Content-Type: application/json" \
  -d '{
    "annual_income": 75000,
    "credit_score": 720,
    "loan_amount": 50000,
    "loan_term_months": 60,
    "num_dependents": 2,
    "employment_status": "employed"
  }'
```

### Test 4: Document Upload & Verification

```bash
curl -X POST http://localhost:8000/api/verify/document/1 \
  -F "file=@/path/to/document.jpg"
```

### Test 5: PDF Report Generation

```bash
curl -X POST http://localhost:8000/api/report/generate/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📂 Project Structure

```
ai-loan-system/
├── backend/
│   ├── main.py                          # FastAPI entry point
│   ├── requirements.txt                 # Python dependencies
│   ├── .env.example                     # Environment variables template
│   ├── ai_loan_system.db               # SQLite database (auto-created)
│   └── app/
│       ├── routes/
│       │   ├── auth_routes.py          # Authentication endpoints
│       │   ├── chat_routes.py          # Chat/AI endpoints
│       │   ├── voice_routes.py         # Voice I/O endpoints
│       │   ├── ocr_routes.py           # Document verification
│       │   ├── loan_routes.py          # Loan prediction
│       │   ├── report_routes.py        # PDF report generation
│       │   └── manager_routes.py       # Manager dashboard
│       ├── services/
│       │   ├── ollama_service.py       # Ollama LLM integration
│       │   ├── voice_service.py        # Whisper & gTTS
│       │   ├── ocr_service.py          # Tesseract OCR
│       │   ├── ml_model_service.py     # XGBoost predictions
│       │   └── report_service.py       # PDF generation
│       ├── models/
│       │   ├── database.py             # SQLAlchemy models
│       │   ├── schemas.py              # Pydantic schemas
│       │   └── loan_model.pkl          # Trained ML model
│       ├── utils/
│       │   ├── security.py             # JWT & password hashing
│       │   └── logger.py               # Logging setup
│       ├── templates/
│       │   └── report_template.html    # HTML report template
│       └── static/
│           ├── uploads/                # Uploaded documents
│           ├── voices/                 # Generated audio files
│           └── reports/                # Generated PDF reports
├── frontend/
│   ├── package.json                    # Node dependencies
│   ├── .env                            # Environment variables
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js                      # Main component
│       ├── App.css
│       ├── index.js
│       ├── index.css
│       ├── components/
│       │   ├── Chatbot.jsx             # AI chatbot component
│       │   ├── LoginForm.jsx           # Auth form
│       │   ├── DocumentVerification.jsx # Upload & verify
│       │   └── ManagerDashboard.jsx    # Manager UI
│       ├── pages/
│       │   ├── Home.jsx
│       │   └── Manager.jsx
│       └── utils/
│           └── api.js                  # API client
├── ml/
│   ├── loan_training.py                # Model training script
│   └── loan_applicants_dataset.csv     # Training dataset
└── README.md                           # This file
```

---

## 🔧 Troubleshooting

### Issue 1: Ollama Connection Error
```
Error: Cannot connect to Ollama. Make sure it's running on localhost:11434
```

**Solution:**
```bash
# Terminal 1: Start Ollama
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags
```

### Issue 2: Tesseract Not Found
```
Error: Tesseract is not installed or not found in PATH
```

**Solution:**
```bash
# Install Tesseract
brew install tesseract

# Verify
tesseract --version

# If still not found, update PATH
echo 'export PATH="/usr/local/opt/tesseract/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Issue 3: Port Already in Use
```
Error: Address already in use: ('127.0.0.1', 8000)
```

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>

# Or use different port
uvicorn main:app --port 8001
```

### Issue 4: React Module Not Found
```
Error: Module not found: 'axios'
```

**Solution:**
```bash
cd frontend
npm install
npm start
```

### Issue 5: Database Locked Error
```
Error: database is locked
```

**Solution:**
```bash
# Delete and recreate database
rm backend/ai_loan_system.db
# Restart backend
```

---

## 📊 Model Performance

The XGBoost model is trained on synthetic loan applicant data with the following features:

| Feature | Range | Impact |
|---------|-------|--------|
| Annual Income | $20K - $150K | 30% |
| Credit Score | 300 - 850 | 40% |
| Loan Amount | $5K - $500K | 20% |
| Loan Term | 12 - 60 months | 5% |
| Employment Status | Employed/Self/Unemployed | 30% |
| Dependents | 0 - 4 | 10% |

**Test Accuracy**: ~85%

---

## 🔐 Security Considerations

1. **JWT Tokens**: 30-minute expiration by default (configurable)
2. **Password Hashing**: bcrypt with 12 rounds
3. **CORS**: Configured for localhost; update for production
4. **Environment Variables**: Use `.env` file for sensitive data
5. **SQL Injection**: Protected via SQLAlchemy ORM
6. **Rate Limiting**: Implement in production

---

## 🚀 Deployment (Production)

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Create account on Render.com
3. Connect repository and deploy
4. Set environment variables in platform

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set `REACT_APP_API_URL` to production API URL

### Database

For production, use:
- **PostgreSQL** (AWS RDS Free Tier)
- **MongoDB Atlas** (Free tier)
- Update `DATABASE_URL` in `.env`

---

## 📞 Support & Documentation

- **FastAPI Docs**: http://localhost:8000/docs
- **Ollama Docs**: https://ollama.ai
- **Whisper Docs**: https://github.com/openai/whisper
- **Tesseract Docs**: https://github.com/UB-Mannheim/tesseract/wiki

---

## 📝 License

This project is open-source and available for educational purposes.

---

## ✅ Checklist for First Run

## 🔊 Voice (Vosk + Piper) Setup

Vosk (offline STT) and Piper (local TTS) are used for the real-time voice assistant.

1. Install Piper into the backend virtualenv and download a voice:

```bash
cd backend
source venv/bin/activate   # if you use a venv created by setup.sh
python -m pip install piper-tts
python -m piper.download_voices en_US-amy-medium --download-dir ./piper_voices
```

2. Download a small Vosk model (setup script tries this automatically):

```bash
curl -L -o /tmp/vosk-small.zip https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
unzip -q /tmp/vosk-small.zip -d backend/models
rm /tmp/vosk-small.zip
```

3. Set environment variables (or copy `.env.example`):

```env
VOSK_MODEL_PATH=./models/vosk-model-small-en-us-0.15
PIPER_MODEL=./piper_voices/en_US-amy-medium.onnx
```

4. Start the backend and check the voice health endpoint:

```bash
python main.py
curl http://localhost:8000/api/voice/health
```


- [ ] Python 3.11+ installed
- [ ] Node.js 18+ installed
- [ ] Ollama installed and running (`ollama serve`)
- [ ] Tesseract installed (`brew install tesseract`)
- [ ] Backend virtual environment created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] ML model trained with your own data (`python ml/loan_training.py`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Can login at frontend and interact with AI

---

**Happy Lending! 🏦💰**
