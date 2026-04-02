# wifi_probe.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random
import logging

# --------------------------
# Logging setup
# --------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --------------------------
# FastAPI app
# --------------------------
app = FastAPI(
    title="Wi-Fi Probe Simulator",
    description="Simulated Wi-Fi probe API (in-memory, no DB)",
    version="1.0.0"
)

# Enable CORS for browser access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# Function to generate Wi-Fi data
# --------------------------
def generate_wifi_data():
    """
    Simulate Wi-Fi probe data for multiple zones.
    """
    zones = ["Ground", "Gate A", "Stage", "Food Court"]
    data = []

    for zone in zones:
        data.append({
            "zone": zone,
            "wifiCount": random.randint(30, 150),      # Random devices count
            "avgRSSI": random.randint(-90, -40),       # Random signal strength
            "timestamp": datetime.utcnow().isoformat() + "Z"  # ISO format UTC
        })

    return data

# --------------------------
# API endpoint
# --------------------------
@app.get("/wifi-probe")
def wifi_probe():
    """
    Returns simulated Wi-Fi probe data.
    """
    try:
        data = generate_wifi_data()
        return {"status": "success", "data": data}
    except Exception as e:
        logger.error(f"Error in /wifi-probe: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

# --------------------------
# Health check endpoint
# --------------------------
@app.get("/")
def root():
    return {"message": "Wi-Fi Probe Simulator API is running", "endpoint": "/wifi-probe"}