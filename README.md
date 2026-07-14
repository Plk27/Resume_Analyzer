# AI Resume Analyzer

A modern AI-powered resume analysis app with a React frontend and FastAPI backend.

## Features
- Resume text input and job description input
- ATS-style score and sub-scores
- Skill gap analysis and keywords analysis
- Strengths, weaknesses, suggestions, and roadmap
- Local backend endpoint for analysis

## Run locally

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

Open http://localhost:3000 to use the app.
