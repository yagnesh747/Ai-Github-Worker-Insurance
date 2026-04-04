# 🛡️ Zero-Touch AI Insurance System

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

A professional, hackathon-ready insurance automation platform for gig workers. This system **automatically detects income loss events** (weather, work-stoppage) and triggers **zero-touch claims** with AI-driven reasoning—eliminating paperwork and delays.

> **🔗 Live Backend API**: [https://zero-touch-insurance-api.onrender.com](https://zero-touch-insurance-api.onrender.com)

---

## 🌟 Key Features

- **Automated Claims Engine**: Zero-form submission. Claims are detected via telemetry and auto-approved instantly.
- **Income Prediction Engine**: (NEW) AI models predict weekly income based on job type and past activity to calculate precise disruption payouts.
- **Worker Trust Score**: (NEW) A dynamic 0–100% score that rewards consistent workers with lower premiums and faster processing.
- **Explainable AI (XAI) Matrix**: (ENHANCED) Every claim includes a deep-dive "AI Reasoning" panel showing rain probability, flood risk, and AI confidence levels.
- **Modern UI/UX**: Professional dark-theme dashboard with glassmorphism, trust badges, and income projection cards.
- **Simulation Suite**: Enhanced simulators for "Heavy Rain" and "Market Drop" that demonstrate real-time income loss and automated recovery.

---

## 🏗️ Project Structure

```text
zero-touch-insurance/
├── backend/               # FastAPI Backend
│   ├── database.py        # MongoDB Connection
│   ├── models.py          # Pydantic Schemas
│   ├── main.py            # AI Risk & Prediction Logic
│   └── requirements.txt
└── frontend/              # React (Vite) Frontend
    ├── src/
    │   ├── pages/         # Dashboard, Claims, Policy Hub
    │   ├── api.js         # API Integration Layer
    │   └── App.jsx        # Routing Logic
    ├── index.css          # Glassmorphic Design System
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+ 
- Node.js 18+
- MongoDB (Running locally at `mongodb://localhost:27017`)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Unix/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*API will be available at [http://localhost:8000](http://localhost:8000)*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*App will be available at [http://localhost:5173](http://localhost:5173)*

---

## 🎮 How to Demo

1. **Register**: Create a profile (e.g., "Delivery Partner" or "Driver").
2. **Dashboard**: Observe your **Predicted Weekly Income** and **Worker Trust Score**.
3. **Smart Policy**: Activate a policy to see how trust scores affect your weekly premium.
4. **Auto-Claim Simulation**: Navigate to the "AI Auto-Claims" tab.
   - Click **"Heavy Rain"**: The system detects an 80% income drop.
   - **XAI Matrix**: Expand the claim to see the raw AI reasoning (Rain Prob, Flood Risk, Confidence).
5. **Impact**: Watch your Earnings Protected status update as the AI automatically credits the loss.

---

## 🛡️ Hackathon Focus
This project demonstrates **Zero-Touch Insurance**, leveraging AI and Big Data to provide instant financial relief to gig workers. It solves the "Disruption Gap" by using income prediction to replace lost earnings without manual claim filing.

---

## 🗺️ Future Roadmap
- **Live IoT Integration**: Connect to real-time weather stations and GPS trackers.
- **Blockchain Payouts**: Instant, smart-contract-driven settlements via Ethereum or Polygon.
- **Micro-Insurance Pools**: Community-driven insurance pools for gig worker cooperatives.
- **Global Deployment**: Multi-currency and multi-region risk profiles.



