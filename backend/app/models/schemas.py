from pydantic import BaseModel
from typing import Optional, List

class RegisterRequest(BaseModel):
    name: str
    job_type: str
    location: str

class ClaimEntry(BaseModel):
    claim_id: str
    event: str
    icon: str
    risk_score: int
    risk_level: str
    payout: int
    explanation: str
    status: str
    timestamp: str

class SimulateResponse(BaseModel):
    event: str
    icon: str
    risk_score: int
    risk_level: str
    claim_id: str
    payout: int
    premium: float
    explanation: str
    message: str
    timestamp: str

class UserPolicy(BaseModel):
    policy_id: str
    user_id: str
    job_type: str
    location: str
    weekly_premium: float
    coverage: int
    risk_score: int
    risk_level: str
    active: bool
    created_at: str

class DashboardResponse(BaseModel):
    user: dict
    policy: UserPolicy
    claims: List[ClaimEntry]
    total_claims: int
    total_payout: int
