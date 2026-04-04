from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from database import users_col, policies_col, claims_col
from models import UserRequest, PolicyRequest, EventTriggerRequest
from datetime import datetime, timedelta
import uuid
import random

app = FastAPI(title="Zero-Touch AI Insurance System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper for income prediction
def predict_income(work_type: str):
    base_incomes = {
        "Delivery": 4000,
        "Driver": 6000,
        "Cleaning": 3500,
        "Freelance": 5000
    }
    base = base_incomes.get(work_type, 3000)
    # Add some random variation for "past activity" feel
    return base + random.randint(-500, 500)

async def calculate_trust_score(user_id: str):
    claims_count = await claims_col.count_documents({"user_id": user_id})
    # Simple logic: start at 100, drop by 10 for each claim (mock behavior)
    # In a real app, this would be based on claim consistency vs activity
    score = max(60, 100 - (claims_count * 8))
    return score

@app.get("/")
def read_root():
    return {"status": "Zero-Touch AI Insurance System is online!"}

@app.post("/register")
async def register_user(user: UserRequest):
    user_dict = user.model_dump()
    user_dict["_id"] = str(uuid.uuid4())
    user_dict["created_at"] = datetime.utcnow()
    
    await users_col.insert_one(user_dict)
    return {"message": "User registered successfully", "user_id": user_dict["_id"], "user": user_dict}

@app.get("/calculate-premium")
async def calculate_premium(user_id: str = None, risk_factor: str = "none"):
    base_premium = 10
    trust_multiplier = 1.0
    
    if user_id:
        trust_score = await calculate_trust_score(user_id)
        if trust_score > 90:
            trust_multiplier = 0.9 # 10% discount for high trust
        elif trust_score < 70:
            trust_multiplier = 1.2 # 20% surcharge for low trust
            
    if risk_factor == "rain":
        base_premium += 5
    elif risk_factor == "high_risk":
        base_premium += 10
        
    final_premium = max(5, int(base_premium * trust_multiplier))
    return {"premium": final_premium, "trust_score_impact": trust_multiplier}

@app.post("/policy")
async def activate_policy(policy_req: PolicyRequest):
    user = await users_col.find_one({"_id": policy_req.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    premium_data = await calculate_premium(policy_req.user_id, policy_req.risk_factor)
    
    policy = {
        "_id": str(uuid.uuid4()),
        "user_id": policy_req.user_id,
        "status": "active",
        "premium_paid": premium_data["premium"],
        "coverage_hours": "00:00 - 23:59",
        "start_date": datetime.utcnow(),
        "end_date": datetime.utcnow() + timedelta(days=7)
    }
    
    await policies_col.update_many({"user_id": policy_req.user_id}, {"$set": {"status": "expired"}})
    await policies_col.insert_one(policy)
    return {"message": "Policy activated", "policy": policy}

@app.post("/trigger-event")
async def trigger_event(req: EventTriggerRequest):
    policy = await policies_col.find_one({"user_id": req.user_id, "status": "active"})
    if not policy:
        return {"status": "skipped", "message": "No active policy to process claim"}
        
    user = await users_col.find_one({"_id": req.user_id})
    predicted_weekly = predict_income(user["work_type"])
    predicted_daily = predicted_weekly / 7
    
    # AI Reasoning Logic
    rain_prob = random.randint(70, 95) if req.event_type == "rain" else random.randint(10, 30)
    flood_risk = "High" if req.event_type == "rain" and req.severity == "high" else "Medium" if req.event_type == "rain" else "Low"
    ai_confidence = random.randint(85, 99)
    
    # Calculate compensation based on income loss formula
    # compensation = predicted_income - actual_income
    # Mocking actual income as a drop
    loss_percentage = 0.8 # 80% loss during "high" severity
    if req.severity == "medium": loss_percentage = 0.5
    
    actual_daily = predicted_daily * (1 - loss_percentage)
    payout = int(predicted_daily - actual_daily)
    
    claim = {
        "_id": str(uuid.uuid4()),
        "user_id": req.user_id,
        "policy_id": policy["_id"],
        "reason": f"AI-Detected {req.event_type} disruption",
        "status": "approved",
        "payout": payout,
        "timestamp": datetime.utcnow(),
        "ai_metadata": {
            "predicted_income": predicted_daily,
            "actual_income": actual_daily,
            "rain_probability": rain_prob,
            "flood_risk": flood_risk,
            "ai_confidence": ai_confidence,
            "job_risk_score": random.randint(60, 90),
            "explanation": f"Disruption caused by {req.event_type} led to {int(loss_percentage*100)}% income drop. Compensation covers calculated loss."
        }
    }
    await claims_col.insert_one(claim)
    
    return {
        "status": "claim_generated", 
        "message": f"₹{payout} credited automatically based on income prediction loss.",
        "claim": claim
    }

@app.get("/claims")
async def get_claims(user_id: str):
    cursor = claims_col.find({"user_id": user_id}).sort("timestamp", -1)
    claims = await cursor.to_list(length=100)
    
    total = sum(c["payout"] for c in claims)
    return {"claims": claims, "total_payout": total}

@app.get("/user/{user_id}")
async def get_user(user_id: str):
    user = await users_col.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    policy = await policies_col.find_one({"user_id": user_id, "status": "active"})
    trust_score = await calculate_trust_score(user_id)
    predicted_income = predict_income(user["work_type"])
    
    return {
        "user": user, 
        "active_policy": policy,
        "trust_score": trust_score,
        "predicted_weekly_income": predicted_income
    }
