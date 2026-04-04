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
