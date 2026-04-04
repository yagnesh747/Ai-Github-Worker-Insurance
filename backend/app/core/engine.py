from typing import Optional
from .config import JOB_RISK, LOCATION_BONUS, BASE_PREMIUM, EVENT_RULES

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
