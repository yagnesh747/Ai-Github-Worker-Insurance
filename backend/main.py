from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uuid
import random
from datetime import datetime

app = FastAPI(title="Zero-Touch AI Insurance System", version="1.0.0")

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── IN-MEMORY STORE ─────────────────────────────────────────────────────────
users_db: dict = {}       # user_id → user info
policies_db: dict = {}    # user_id → policy info
claims_db: dict = {}      # user_id → list of claims

# ─── CONSTANTS ────────────────────────────────────────────────────────────────
JOB_RISK = {
    "Construction Worker": 35,
    "Delivery Driver": 28,
    "Street Vendor": 22,
    "Farmer": 30,
    "Domestic Helper": 15,
    "Rickshaw Driver": 25,
    "Factory Worker": 20,
}

BASE_PREMIUM = {
    "Construction Worker": 220,
    "Delivery Driver": 180,
    "Street Vendor": 140,
    "Farmer": 160,
    "Domestic Helper": 100,
    "Rickshaw Driver": 150,
    "Factory Worker": 130,
}

COVERAGE = {
    "Construction Worker": 12000,
    "Delivery Driver": 10000,
    "Street Vendor": 8000,
    "Farmer": 9000,
    "Domestic Helper": 6000,
    "Rickshaw Driver": 8500,
    "Factory Worker": 7500,
}

EVENT_RULES = {
    "heavy_rain": {
        "label": "Heavy Rain Alert",
        "risk_add": 30,
        "premium_multiplier": 1.4,
        "payout": 500,
        "icon": "🌧️",
        "explanation": "AI sensors detected rainfall > 15mm/hr in your GPS vicinity. Mobility score reduced by 45%.",
    },
    "no_work_day": {
        "label": "No Work Day Detected",
        "risk_add": 15,
        "premium_multiplier": 1.2,
        "payout": 300,
        "icon": "🚫",
        "explanation": "Platform activity pattern shows 0 bookings in the last 6 hours. Passive income loss detected.",
    },
    "flood_alert": {
        "label": "Flood Alert",
        "risk_add": 55,
        "premium_multiplier": 1.85,
        "payout": 1200,
        "icon": "🌊",
        "explanation": "Public telemetry indicates localized flooding. Risk to life and assets exceeds safety threshold.",
    },
}

LOCATION_BONUS = {
    "rural": -10,
    "urban": 5,
    "coastal": 20,
    "hill station": 10,
}

# ─── MODELS ──────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    job_type: str
    location: str

class SimulateResponse(BaseModel):
    event: str
    risk_score: int
    risk_level: str
    claim_id: str
    payout: int
    premium: float
    message: str
    explanation: str
    timestamp: str

# ─── HELPERS ─────────────────────────────────────────────────────────────────
def compute_risk_score(job_type: str, location: str, event: Optional[str] = None) -> int:
    score = JOB_RISK.get(job_type, 20)
    loc_lower = location.lower()
    for key, val in LOCATION_BONUS.items():
        if key in loc_lower:
            score += val
            break
    if event and event in EVENT_RULES:
        score += EVENT_RULES[event]["risk_add"]
    score = max(0, min(score, 100))
    return score

def risk_label(score: int) -> str:
    if score < 30:
        return "Low"
    elif score < 60:
        return "Medium"
    return "High"

def compute_premium(job_type: str, location: str, event: Optional[str] = None) -> float:
    base = BASE_PREMIUM.get(job_type, 150)
    multiplier = 1.0
    loc_lower = location.lower()
    if "coastal" in loc_lower:
        multiplier += 0.2
    if "urban" in loc_lower:
        multiplier += 0.05
    if "rural" in loc_lower:
        multiplier -= 0.1
    if event and event in EVENT_RULES:
        multiplier *= EVENT_RULES[event]["premium_multiplier"]
    return round(base * multiplier, 2)

# ─── ROUTES ──────────────────────────────────────────────────────────────────

@app.post("/register")
def register(req: RegisterRequest):
    if req.job_type not in JOB_RISK:
        raise HTTPException(status_code=400, detail="Unknown job type.")

    user_id = str(uuid.uuid4())[:8]
    policy_id = f"POL-{user_id.upper()}"

    risk_score = compute_risk_score(req.job_type, req.location)
    premium = compute_premium(req.job_type, req.location)
    coverage = COVERAGE.get(req.job_type, 8000)

    users_db[user_id] = {
        "name": req.name,
        "job_type": req.job_type,
        "location": req.location,
    }

    policies_db[user_id] = {
        "policy_id": policy_id,
        "user_id": user_id,
        "job_type": req.job_type,
        "location": req.location,
        "weekly_premium": premium,
        "coverage": coverage,
        "risk_score": risk_score,
        "risk_level": risk_label(risk_score),
        "active": True,
        "created_at": datetime.utcnow().isoformat(),
    }

    claims_db[user_id] = []

    return {
        "user_id": user_id,
        "policy_id": policy_id,
        "message": f"Welcome, {req.name}! Your policy {policy_id} is active.",
    }


@app.get("/dashboard/{user_id}")
def dashboard(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found.")
    user = users_db[user_id]
    policy = policies_db[user_id]
    claims = claims_db[user_id]

    return {
        "user": user,
        "policy": policy,
        "claims": claims,
        "total_claims": len(claims),
        "total_payout": sum(c["payout"] for c in claims),
    }


@app.post("/simulate/{user_id}/{event}")
def simulate(user_id: str, event: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found.")
    if event not in EVENT_RULES:
        raise HTTPException(status_code=400, detail="Unknown event type.")

    user = users_db[user_id]
    policy = policies_db[user_id]
    rule = EVENT_RULES[event]

    risk_score = compute_risk_score(user["job_type"], user["location"], event)
    new_premium = compute_premium(user["job_type"], user["location"], event)
    rl = risk_label(risk_score)

    # Auto-update premium in policy
    policies_db[user_id]["weekly_premium"] = new_premium
    policies_db[user_id]["risk_score"] = risk_score
    policies_db[user_id]["risk_level"] = rl

    claim_id = f"CLM-{str(uuid.uuid4())[:6].upper()}"
    timestamp = datetime.utcnow().isoformat()
    payout = rule["payout"]

    claim_entry = {
        "claim_id": claim_id,
        "event": rule["label"],
        "icon": rule["icon"],
        "risk_score": risk_score,
        "risk_level": rl,
        "payout": payout,
        "explanation": rule["explanation"],
        "status": "Approved",
        "timestamp": timestamp,
    }

    claims_db[user_id].append(claim_entry)

    return {
        "event": rule["label"],
        "icon": rule["icon"],
        "risk_score": risk_score,
        "risk_level": rl,
        "claim_id": claim_id,
        "payout": payout,
        "premium": new_premium,
        "explanation": rule["explanation"],
        "message": f"Claim {claim_id} auto-approved. ₹{payout} credited.",
        "timestamp": timestamp,
    }


@app.get("/claims/{user_id}")
def get_claims(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"claims": claims_db[user_id]}


@app.get("/jobs")
def get_jobs():
    return {"jobs": list(JOB_RISK.keys())}


@app.get("/health")
def health():
    return {"status": "ok", "users": len(users_db)}
