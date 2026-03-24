from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import users_col, policies_col, claims_col
from models import UserRequest, PolicyRequest, EventTriggerRequest
from datetime import datetime, timedelta
import uuid

app = FastAPI(title="Worker Protection System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Backend is running!"}

@app.post("/register")
async def register_user(user: UserRequest):
    user_dict = user.model_dump()
    user_dict["_id"] = str(uuid.uuid4())
    user_dict["created_at"] = datetime.utcnow()
    
    await users_col.insert_one(user_dict)
    return {"message": "User registered successfully", "user_id": user_dict["_id"], "user": user_dict}

@app.post("/policy")
async def activate_policy(policy_req: PolicyRequest):
    user = await users_col.find_one({"_id": policy_req.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    base_premium = 10
    if policy_req.risk_factor == "rain":
        base_premium += 5
    elif policy_req.risk_factor == "safe_zone":
        base_premium -= 2
        
    policy = {
        "_id": str(uuid.uuid4()),
        "user_id": policy_req.user_id,
        "status": "active",
        "premium_paid": max(base_premium, 5),
        "coverage_hours": "00:00 - 23:59",
        "start_date": datetime.utcnow(),
        "end_date": datetime.utcnow() + timedelta(days=7)
    }
    
    # deactivate old policies
    await policies_col.update_many({"user_id": policy_req.user_id}, {"$set": {"status": "expired"}})
    await policies_col.insert_one(policy)
    return {"message": "Policy activated", "policy": policy}

@app.get("/calculate-premium")
async def calculate_premium(risk_factor: str = "none"):
    # Mock dynamic calculation
    base_premium = 10
    if risk_factor == "rain":
        base_premium += 5
    elif risk_factor == "safe_zone":
        base_premium -= 2
    return {"premium": max(base_premium, 5)}

@app.post("/trigger-event")
async def trigger_event(req: EventTriggerRequest):
    policy = await policies_col.find_one({"user_id": req.user_id, "status": "active"})
    if not policy:
        return {"status": "skipped", "message": "No active policy to process claim"}
        
    payout = 0
    if req.event_type == "rain":
        payout = 150
    elif req.event_type == "road_blockage":
        payout = 200
    elif req.event_type == "low_orders":
        payout = 100
    elif req.event_type == "accident":
        payout = 500
    else:
        payout = 50
        
    claim = {
        "_id": str(uuid.uuid4()),
        "user_id": req.user_id,
        "policy_id": policy["_id"],
        "reason": f"Auto-detected {req.event_type}",
        "status": "approved",
        "payout": payout,
        "timestamp": datetime.utcnow()
    }
    await claims_col.insert_one(claim)
    
    return {
        "status": "claim_generated", 
        "message": f"₹{payout} credited due to {req.event_type}",
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
    
    return {"user": user, "active_policy": policy}
