# # api.py
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from datetime import datetime
# import random
# import logging

# # --------------------------
# # Logging setup
# # --------------------------
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # --------------------------
# # FastAPI app
# # --------------------------
# app = FastAPI(
#     title="Smart Crowd Monitoring System",
#     description="Real-time crowd monitoring and analysis API (CCTV + Wi-Fi)",
#     version="1.0.0"
# )

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --------------------------
# # Shared Stats (CCTV)
# # --------------------------
# stats = None

# def set_stats(stats_obj):
#     """
#     Set global stats object from main.py (CCTV data)
#     """
#     global stats
#     stats = stats_obj
#     logger.info("✓ Stats object connected to API")

# # --------------------------
# # Root Endpoint
# # --------------------------
# # @app.get("/")
# # def read_root():
# #     return {
# #         "message": "Smart Crowd Monitoring System API",
# #         "documentation": "http://127.0.0.1:8000/docs",
# #         "endpoints": {
# #             "crowd_data": "/api/crowd",
# #             "statistics": "/api/stats",
# #             "health": "/api/health",
# #             "recommendations": "/api/recommendations",
# #             "wifi_probe": "/wifi-probe"
# #         }
# #     }
# from db import get_wifi_data

# @app.get("/")
# def read_root():
#     wifi_data = get_wifi_data()  # Get latest Wi-Fi data
#     return {
#         "message": "Smart Crowd Monitoring System API",
#         "documentation": "http://127.0.0.1:8000/docs",
#         "endpoints": {
#             "crowd_data": "/api/crowd",
#             "statistics": "/api/stats",
#             "health": "/api/health",
#             "recommendations": "/api/recommendations",
#             "wifi_probe": "/wifi-probe"
#         },
#         "wifi_data": wifi_data   # <- This will show live Wi-Fi data in root
#     }
# # --------------------------
# # CCTV Endpoints
# # --------------------------
# @app.get("/api/crowd")
# def get_crowd_data():
#     try:
#         if stats is None:
#             return JSONResponse(status_code=503, content={"error": "Crowd monitoring system not initialized"})
#         return stats.get_stats()
#     except Exception as e:
#         logger.error(f"Error in /api/crowd: {str(e)}")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# @app.get("/api/stats")
# def get_stats_data():
#     try:
#         if stats is None:
#             return JSONResponse(status_code=503, content={"error": "Statistics not available yet"})
#         return stats.get_stats()
#     except Exception as e:
#         logger.error(f"Error in /api/stats: {str(e)}")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# @app.get("/api/recommendations")
# def get_recommendations():
#     try:
#         if stats is None:
#             return JSONResponse(status_code=503, content={"error": "Recommendations not available yet"})
#         recommendations = stats.get_recommendations()
#         recommendations["reason"] = "Based on crowd density and risk assessment"
#         return recommendations
#     except Exception as e:
#         logger.error(f"Error in /api/recommendations: {str(e)}")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# @app.get("/api/health")
# def health_check():
#     status = "online" if stats is not None else "initializing"
#     return {"status": status, "message": "Smart Crowd Monitoring System is running", "api_version": "1.0.0"}

# @app.get("/api/zones")
# def get_zones_summary():
#     try:
#         if stats is None:
#             return JSONResponse(status_code=503, content={"error": "Zone data not available yet"})
#         zones_summary = []
#         for zone_name in stats.zone_names:
#             zone_data = stats.get_zone_stats(zone_name)
#             zones_summary.append({
#                 "zone": zone_name,
#                 "crowdCount": zone_data.get("crowdCount", 0),
#                 "status": zone_data.get("status", "SAFE"),
#                 "riskScore": zone_data.get("riskScore", 0),
#                 "density": zone_data.get("density", "LOW")
#             })
#         return {"timestamp": stats.live_stats["timestamp"], "zones": zones_summary}
#     except Exception as e:
#         logger.error(f"Error in /api/zones: {str(e)}")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# @app.get("/api/{path:path}")
# def catch_all(path: str):
#     return JSONResponse(status_code=404, content={"error": f"Endpoint /api/{path} not found. Visit /docs for available endpoints"})

# # --------------------------
# # Wi-Fi Probe Endpoint (Simulated)
# # --------------------------
# @app.get("/wifi-probe")
# def wifi_probe():
#     """
#     Returns simulated Wi-Fi probe data for multiple zones.
#     """
#     try:
#         zones = ["Ground", "Gate A", "Stage", "Food Court"]
#         data = []

#         for zone in zones:
#             data.append({
#                 "zone": zone,
#                 "wifiCount": random.randint(30, 150),
#                 "avgRSSI": random.randint(-90, -40),
#                 "timestamp": datetime.utcnow().isoformat() + "Z"
#             })

#         return {"status": "success", "data": data}

#     except Exception as e:
#         logger.error(f"Error in /wifi-probe: {str(e)}")
#         return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
# api.py
# from fastapi import FastAPI
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime
# import random
# import logging

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI(
#     title="Smart Crowd Monitoring System",
#     description="Real-time CCTV + Wi-Fi monitoring API",
#     version="1.0.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --------------------------
# # Zones & Simulation Data
# # --------------------------
# ZONES = ["Ground A", "Gate A", "Stage", "Food Court"]

# def simulate_cctv_data():
#     """Simulate camera people count per zone"""
#     return {zone: random.randint(10, 60) for zone in ZONES}

# def simulate_wifi_data():
#     """Simulate Wi-Fi probe data per zone"""
#     return {zone: random.randint(20, 70) for zone in ZONES}

# # --------------------------
# # Endpoints
# # --------------------------
# @app.get("/wifi-probe")
# def wifi_probe():
#     """Return Wi-Fi counts per zone"""
#     try:
#         data = []
#         wifi_counts = simulate_wifi_data()
#         for zone, count in wifi_counts.items():
#             data.append({
#                 "zone": zone,
#                 "wifiCount": count,
#                 "timestamp": datetime.utcnow()
#             })
#         return data
#     except Exception as e:
#         logger.error(f"Error in /wifi-probe: {str(e)}")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# @app.get("/api/crowd")
# def crowd_camera():
#     """Return CCTV camera counts per zone"""
#     try:
#         data = []
#         camera_counts = simulate_cctv_data()
#         for zone, count in camera_counts.items():
#             data.append({
#                 "zone": zone,
#                 "cameraCount": count,
#                 "timestamp": datetime.utcnow()
#             })
#         return data
#     except Exception as e:
#         logger.error(f"Error in /api/crowd: {str(e)}")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# @app.get("/api/combined")
# def combined_endpoint():
#     """Return combined CCTV + Wi-Fi counts per zone with totalCrowd and avgRSSI"""
#     try:
#         combined = []
#         camera_counts = simulate_cctv_data()
#         wifi_counts = simulate_wifi_data()

#         for zone in ZONES:
#             camera_count = camera_counts[zone]
#             wifi_count = wifi_counts[zone]
#             total_crowd = camera_count + wifi_count
#             avg_rssi = random.randint(-90, -40)

#             combined.append({
#                 "zone": zone,
#                 "cameraCount": camera_count,
#                 "wifiCount": wifi_count,
#                 "totalCrowd": total_crowd,
#                 "avgRSSI": avg_rssi,
#                 "timestamp": datetime.utcnow()
#             })

#         return combined
#     except Exception as e:
#         logger.error(f"Error in /api/combined: {str(e)}")
#         return JSONResponse(status_code=500, content={"error": str(e)})
# api.py
# from fastapi import FastAPI, Body
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime
# import random
# import logging

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI(
#     title="Smart Crowd Monitoring System",
#     description="Real-time CCTV + Wi-Fi monitoring API",
#     version="1.0.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --------------------------
# # Zones & In-memory storage
# # --------------------------
# ZONES = ["Ground A", "Gate A", "Stage", "Food Court"]

# # Real-time storage for counts
# REALTIME_CCTV = {zone: 0 for zone in ZONES}
# REALTIME_WIFI = {zone: 0 for zone in ZONES}

# # --------------------------
# # Endpoints to update data
# # --------------------------
# @app.post("/update/cctv")
# def update_cctv(data: dict = Body(...)):
#     """
#     Update CCTV counts in real-time
#     Example JSON:
#     {
#       "Ground A": 42,
#       "Gate A": 30
#     }
#     """
#     for zone, count in data.items():
#         if zone in REALTIME_CCTV:
#             REALTIME_CCTV[zone] = count
#     return {"message": "CCTV data updated", "data": REALTIME_CCTV}


# @app.post("/update/wifi")
# def update_wifi(data: dict = Body(...)):
#     """
#     Update Wi-Fi probe counts in real-time
#     Example JSON:
#     {
#       "Ground A": 58,
#       "Gate A": 45
#     }
#     """
#     for zone, count in data.items():
#         if zone in REALTIME_WIFI:
#             REALTIME_WIFI[zone] = count
#     return {"message": "Wi-Fi data updated", "data": REALTIME_WIFI}

# # --------------------------
# # Endpoint to get combined data
# # --------------------------
# @app.get("/api/combined")
# def combined_endpoint():
#     """
#     Return combined CCTV + Wi-Fi counts per zone with totalCrowd and avgRSSI
#     """
#     try:
#         combined = []
#         for zone in ZONES:
#             camera_count = REALTIME_CCTV[zone]
#             wifi_count = REALTIME_WIFI[zone]
#             total_crowd = camera_count + wifi_count
#             avg_rssi = random.randint(-90, -40)  # optional: replace with real RSSI from Wi-Fi

#             combined.append({
#                 "zone": zone,
#                 "cameraCount": camera_count,
#                 "wifiCount": wifi_count,
#                 "totalCrowd": total_crowd,
#                 "avgRSSI": avg_rssi,
#                 "timestamp": datetime.utcnow()
#             })

#         return combined
#     except Exception as e:
#         logger.error(f"Error in /api/combined: {str(e)}")
#         return JSONResponse(status_code=500, content={"error": str(e)})


# # --------------------------
# # Optional separate endpoints
# # --------------------------
# @app.get("/wifi-probe")
# def wifi_probe():
#     """Return latest Wi-Fi counts per zone"""
#     return [{"zone": zone, "wifiCount": count, "timestamp": datetime.utcnow()} 
#             for zone, count in REALTIME_WIFI.items()]

# @app.get("/api/crowd")
# def crowd_camera():
#     """Return latest CCTV counts per zone"""
#     return [{"zone": zone, "cameraCount": count, "timestamp": datetime.utcnow()} 
#             for zone, count in REALTIME_CCTV.items()]



# from fastapi import FastAPI, Body
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime
# import random
# import logging
# import requests  # for sending updates from your model if needed

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI(
#     title="Smart Crowd Monitoring System",
#     description="Real-time CCTV + Wi-Fi monitoring API",
#     version="1.0.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --------------------------
# # Zones & In-memory storage
# # --------------------------
# ZONES = ["Ground A", "Gate A", "Stage", "Food Court"]

# # Real-time storage for counts
# REALTIME_CCTV = {zone: 0 for zone in ZONES}
# REALTIME_WIFI = {zone: 0 for zone in ZONES}

# # --------------------------
# # Endpoints to update data
# # --------------------------
# @app.post("/update/cctv")
# def update_cctv(data: dict = Body(...)):
#     """
#     Update CCTV counts in real-time.
#     Use this inside your existing model:
#     Example: {"Ground A": 42, "Gate A": 30, "Stage": 20}
#     """
#     for zone, count in data.items():
#         if zone in REALTIME_CCTV:
#             REALTIME_CCTV[zone] = count
#     return {"message": "CCTV data updated", "data": REALTIME_CCTV}


# @app.post("/update/wifi")
# def update_wifi(data: dict = Body(...)):
#     """
#     Update Wi-Fi probe counts in real-time.
#     Example: {"Ground A": 58, "Gate A": 45}
#     """
#     for zone, count in data.items():
#         if zone in REALTIME_WIFI:
#             REALTIME_WIFI[zone] = count
#     return {"message": "Wi-Fi data updated", "data": REALTIME_WIFI}

# # --------------------------
# # Endpoint to get combined data
# # --------------------------
# @app.get("/api/combined")
# def combined_endpoint():
#     """
#     Return combined CCTV + Wi-Fi counts per zone with totalCrowd and avgRSSI.
#     """
#     try:
#         combined = []
#         for zone in ZONES:
#             camera_count = REALTIME_CCTV[zone]
#             wifi_count = REALTIME_WIFI[zone]
#             total_crowd = camera_count + wifi_count
#             avg_rssi = random.randint(-90, -40)  # optional: replace with real RSSI

#             combined.append({
#                 "zone": zone,
#                 "cameraCount": camera_count,
#                 "wifiCount": wifi_count,
#                 "totalCrowd": total_crowd,
#                 "avgRSSI": avg_rssi,
#                 "timestamp": datetime.utcnow()
#             })

#         return combined
#     except Exception as e:
#         logger.error(f"Error in /api/combined: {str(e)}")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# # --------------------------
# # Optional endpoints for separate data
# # --------------------------
# @app.get("/wifi-probe")
# def wifi_probe():
#     """Return latest Wi-Fi counts per zone."""
#     return [{"zone": zone, "wifiCount": count, "timestamp": datetime.utcnow()} 
#             for zone, count in REALTIME_WIFI.items()]

# @app.get("/api/crowd")
# def crowd_camera():
#     """Return latest CCTV counts per zone."""
#     return [{"zone": zone, "cameraCount": count, "timestamp": datetime.utcnow()} 
#             for zone, count in REALTIME_CCTV.items()]

# # --------------------------
# # Helper function to send data from your model
# # --------------------------
# def send_cctv_to_api(counts: dict):
#     """
#     Call this from your running CCTV model after detecting counts.
#     Example:
#         send_cctv_to_api({"Ground A": 42, "Gate A": 30})
#     """
#     try:
#         requests.post("http://127.0.0.1:8000/update/cctv", json=counts)
#     except Exception as e:
#         logger.error(f"Error sending CCTV data to API: {e}")
# api.py
# from fastapi import FastAPI, Body
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime
# import random
# import logging

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI(
#     title="Smart Crowd Monitoring System",
#     description="Real-time CCTV + Wi-Fi monitoring API",
#     version="1.0.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --------------------------
# # Zones & In-memory storage
# # --------------------------
# ZONES = ["Ground A", "Gate A", "Stage", "Food Court"]

# REALTIME_CCTV = {zone: 0 for zone in ZONES}
# REALTIME_WIFI = {zone: 0 for zone in ZONES}

# # --------------------------
# # Update endpoints
# # --------------------------
# @app.post("/update/cctv")
# def update_cctv(data: dict = Body(...)):
#     for zone, count in data.items():
#         if zone in REALTIME_CCTV:
#             REALTIME_CCTV[zone] = count
#     return {"message": "CCTV data updated", "data": REALTIME_CCTV}

# @app.post("/update/wifi")
# def update_wifi(data: dict = Body(...)):
#     for zone, count in data.items():
#         if zone in REALTIME_WIFI:
#             REALTIME_WIFI[zone] = count
#     return {"message": "Wi-Fi data updated", "data": REALTIME_WIFI}

# # --------------------------
# # Combined endpoint
# # --------------------------
# @app.get("/api/combined")
# def combined_endpoint():
#     combined = []
#     try:
#         for zone in ZONES:
#             camera_count = REALTIME_CCTV[zone]
#             wifi_count = REALTIME_WIFI[zone]
#             total_crowd = camera_count + wifi_count
#             avg_rssi = random.randint(-90, -40)  # optional random Wi-Fi RSSI

#             combined.append({
#                 "zone": zone,
#                 "cameraCount": camera_count,
#                 "wifiCount": wifi_count,
#                 "totalCrowd": total_crowd,
#                 "avgRSSI": avg_rssi,
#                 "timestamp": datetime.utcnow()
#             })
#         return combined
#     except Exception as e:
#         logger.error(f"Error in /api/combined: {e}")
#         return JSONResponse(status_code=500, content={"error": str(e)})



from fastapi import FastAPI, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Smart Crowd Monitoring System",
    description="Real-time CCTV + Wi-Fi monitoring API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# Zones & In-memory storage
# --------------------------
ZONES = ["Ground A", "Gate A", "Stage", "Food Court"]

REALTIME_CCTV = {zone: None for zone in ZONES}  # None = unavailable
REALTIME_WIFI = {zone: None for zone in ZONES}  # None = unavailable

# --------------------------
# Update endpoints
# --------------------------
@app.post("/update/cctv")
def update_cctv(data: dict = Body(...)):
    for zone, count in data.items():
        if zone in REALTIME_CCTV:
            REALTIME_CCTV[zone] = count
    return {"message": "CCTV data updated", "data": REALTIME_CCTV}

@app.post("/update/wifi")
def update_wifi(data: dict = Body(...)):
    for zone, count in data.items():
        if zone in REALTIME_WIFI:
            REALTIME_WIFI[zone] = count
    return {"message": "Wi-Fi data updated", "data": REALTIME_WIFI}

# --------------------------
# Combined endpoint
# --------------------------
@app.get("/api/combined")
def combined_endpoint():
    combined = []
    try:
        for zone in ZONES:
            # Use real counts if available, else generate random
            camera_count = REALTIME_CCTV[zone] if REALTIME_CCTV[zone] is not None else random.randint(5, 50)
            wifi_count = REALTIME_WIFI[zone] if REALTIME_WIFI[zone] is not None else random.randint(5, 50)
            total_crowd = camera_count + wifi_count
            avg_rssi = random.randint(-90, -40)

            combined.append({
                "zone": zone,
                "cameraCount": camera_count,
                "wifiCount": wifi_count,
                "totalCrowd": total_crowd,
                "avgRSSI": avg_rssi,
                "timestamp": datetime.utcnow().isoformat()
            })
        return combined
    except Exception as e:
        logger.error(f"Error in /api/combined: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})