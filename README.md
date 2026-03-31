# 🛡️ Zero-Touch AI Insurance System

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

A professional, hackathon-ready insurance automation platform for gig workers. This system **automatically detects income loss events** (weather, work-stoppage) and triggers **zero-touch claims** with AI-driven reasoning—eliminating paperwork and delays.

---

## 🌟 Key Features

- **Automated Claims Engine**: Zero-form submission. Claims are detected via telemetry and auto-approved instantly.
- **AI Risk Scoring**: Dynamic premium adjustment based on real-time environmental factors, location, and job type.
- **Transparent Reasoning**: Every claim includes an "AI Reasoning" log explaining the logic behind the approval.
- **Modern UI/UX**: Professional dark-theme dashboard with glassmorphism, animated risk meters, and live claim history.
- **Simulation Suite**: Built-in event simulators to demonstrate heavy rain, flood alerts, and work-stoppage scenarios.

---

## 🏗️ Project Structure

```text
zero-touch-insurance/
├── backend/               # FastAPI Backend
│   ├── app/
│   │   ├── core/          # Risk Engine & Constants
│   │   ├── models/        # Pydantic Schemas
│   │   ├── routes/        # API Endpoints
│   │   └── main.py        # App Entry Point
│   ├── .env.example
│   ├── .gitignore
│   └── requirements.txt
└── frontend/              # React (Vite) Frontend
    ├── src/
    │   ├── components/    # Reusable UI Components
    │   ├── pages/         # Dashboard & Register Pages
    │   ├── services/      # Axios API Layer
    │   └── App.jsx        # Routing Logic
    ├── .env.example
    ├── .gitignore
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+ 
- Node.js 18+

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Unix/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
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

1. **Register**: Navigate to the registration page and create a profile (try "Construction Worker" in a "Coastal Area" for higher initial risk).
2. **Dashboard**: View your policy status, dynamic premium, and AI risk score.
3. **Simulate**: Click any of the simulator buttons in the "Demo Simulation Controls" panel.
4. **Watch**: 
   - **Step 1**: "Analyzing Risk..." appears while the AI engine evaluates the event.
   - **Step 2**: "Claim Approved" overlay shows the payout and the **AI Reasoning**.
   - **Step 3**: Dashboard stats (Premium, Risk Score) update automatically.
   - **Step 4**: The claim is added to the live history table.

---

## 🛡️ Hackathon Focus
This project demonstrates **Zero-Touch Insurance**, a core concept in modern InsurTech that leverages IoT and AI to provide instant relief to vulnerable workers without the friction of traditional insurance bureaucracy.

---

## 🗺️ Future Roadmap
- **Live IoT Integration**: Connect to real-time weather stations and GPS trackers to verify labor presence.
- **Predictive Analytics**: Machine learning models to predict risk *before* the event occurs (e.g., proactive work shifts).
- **Blockchain Payouts**: Instant, smart-contract-driven settlements via Ethereum or Polygon.
- **Micro-Insurance Pools**: Community-driven insurance pools for gig worker cooperatives.

---

## 📝 Initial Setup Commands (Git)
If you are uploading this to a new GitHub repository, run:

```bash
git init
git add .
git commit -m "Initial commit - Zero Touch AI Insurance System"
git branch -M main
git remote add origin https://github.com/yagnesh747/Ai-Github-Worker-Insurance.git
git push -u origin main
```
