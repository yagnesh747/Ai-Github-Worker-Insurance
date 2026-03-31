from fastapi import APIRouter, HTTPException
from ..models.schemas import RegisterRequest, SimulateResponse
from ..core.config import JOB_RISK, BASE_PREMIUM, COVERAGE, EVENT_RULES
from ..core.engine import compute_risk_score, risk_label, compute_premium
import uuid
from datetime import datetime

router = APIRouter()

# ─── IN-MEMORY STORE ─────────────────────────────────────────────────────────
users_db: dict = {}       # user_id → user info
policies_db: dict = {}    # user_id → policy info
claims_db: dict = {}      # user_id → list of claims

@router.post("/register")
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


@router.get("/dashboard/{user_id}")
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


@router.post("/simulate/{user_id}/{event}", response_model=SimulateResponse)
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


@router.get("/claims/{user_id}")
def get_claims(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"claims": claims_db[user_id]}


@router.get("/jobs")
def get_jobs():
    return {"jobs": list(JOB_RISK.keys())}


@router.get("/health")
def health():
    return {"status": "ok", "users": len(users_db)}
