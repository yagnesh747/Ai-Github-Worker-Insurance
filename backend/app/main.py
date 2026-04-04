from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.api import router as api_router

app = FastAPI(
    title="Zero-Touch AI Insurance System",
    description="Automated income loss protection for gig workers.",
    version="1.0.0"
)

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ROUTES ──────────────────────────────────────────────────────────────────
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Zero-Touch AI Insurance API is live", "docs": "/docs"}
