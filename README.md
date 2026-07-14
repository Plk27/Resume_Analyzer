# AI Resume Analyzer

A polished, full-stack resume analysis experience designed to help job seekers evaluate how well their resume aligns with a target role. This project combines a modern React frontend with a FastAPI backend to deliver a smooth, interactive analysis workflow with ATS-style insights and actionable recommendations.

## Project Overview

AI Resume Analyzer is a portfolio-ready application that demonstrates:
- a modern, user-friendly interface for resume review
- structured analysis of skills, keywords, and sections
- intelligent recommendations for improving resume alignment
- a lightweight backend API for analysis and document processing

## Key Features

- Resume and job description input through text or file upload
- ATS-style scoring and sub-score breakdowns
- Skill gap and keyword match analysis
- Strengths, weaknesses, and improvement suggestions
- Personalized roadmap for resume enhancement
- Responsive, polished UI built with React and Tailwind-inspired styling

## Tech Stack

- Frontend: React, TypeScript, Vite
- UI: Tailwind CSS, motion animations, Lucide icons
- Backend: FastAPI, Python
- Document processing: PyMuPDF, python-docx

## Project Structure

- frontend/: React application and UI components
- backend/app/: FastAPI application and analysis logic
- tests/: validation and analysis tests

## Local Development

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173.

### 2. Backend
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

The API will be available at http://127.0.0.1:8000.

## Deployment Notes

The frontend is configured to call the backend through a configurable API base URL, making it suitable for deployment in a split frontend/backend setup.

## Why This Project Matters

This project reflects a strong blend of product thinking, UI design, and backend engineering. It showcases the ability to build a practical AI-assisted experience that feels polished, intuitive, and production-ready.
