from pydantic import BaseModel, Field

class UserRequest(BaseModel):
    name: str = Field(..., description="Name of the gig worker")
    phone: str = Field(..., description="Phone number")
    work_type: str = Field(..., description="E.g., Delivery, Driver")
    location: str = Field(..., description="GPS coordinates or area name")

class PolicyRequest(BaseModel):
    user_id: str
    risk_factor: str = Field("none", description="Risk factor passed from UI to reflect premium")

class EventTriggerRequest(BaseModel):
    user_id: str
    event_type: str = Field(..., description="E.g., rain, road_blockage, low_orders")
    severity: str = Field(default="high")
    
class AutoClaimRequest(BaseModel):
    user_id: str
    event_type: str
