# # db.py
# from pymongo import MongoClient, errors
# import logging

# # --------------------------
# # Logging setup
# # --------------------------
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # --------------------------
# # MongoDB connection
# # --------------------------
# def get_mongo_client(uri="mongodb://127.0.0.1:27017/", timeout_ms=2000):
#     """
#     Returns a MongoClient if MongoDB is reachable, else None
#     """
#     try:
#         client = MongoClient(uri, serverSelectionTimeoutMS=timeout_ms)
#         # Test connection
#         client.server_info()
#         logger.info("✓ Connected to MongoDB successfully")
#         return client
#     except errors.ServerSelectionTimeoutError as e:
#         logger.error(f"❌ MongoDB connection failed: {e}")
#         return None

# # Initialize client
# client = get_mongo_client()

# # --------------------------
# # Database and Collection
# # --------------------------
# if client:
#     db = client["crowd_db"]           # Database name
#     collection = db["wifi_data"]      # Collection for Wi-Fi probe
#     logger.info("✓ MongoDB collection ready for use")
# else:
#     db = None
#     collection = None
#     logger.warning("⚠ MongoDB client not initialized. Collection is None")

# # --------------------------
# # Usage helper functions (optional)
# # --------------------------
# def insert_wifi_data(zone, wifiCount, avgRSSI):
#     """
#     Insert Wi-Fi data into MongoDB
#     """
#     if collection is None:
#         logger.warning("Cannot insert: MongoDB collection not available")
#         return None
#     from datetime import datetime
#     data = {
#         "zone": zone,
#         "wifiCount": wifiCount,
#         "avgRSSI": avgRSSI,
#         "timestamp": datetime.utcnow()
#     }
#     result = collection.insert_one(data)
#     logger.info(f"Inserted Wi-Fi data for zone {zone}")
#     return str(result.inserted_id)

# def get_wifi_data():
#     """
#     Get all Wi-Fi data from MongoDB
#     """
#     if collection is None:
#         logger.warning("Cannot read: MongoDB collection not available")
#         return []
#     return list(collection.find({}, {"_id": 0}))  # Exclude MongoDB _id
# db.py
import logging
from datetime import datetime
import random

# --------------------------
# Logging setup
# --------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --------------------------
# In-memory Wi-Fi data storage (optional)
# --------------------------
# This will store only the latest generated Wi-Fi data in memory
wifi_data_store = []

# --------------------------
# Generate Wi-Fi data
# --------------------------
def generate_wifi_data():
    """
    Simulate Wi-Fi probe data for multiple zones
    """
    zones = ["Ground", "Gate A", "Stage", "Food Court"]
    data = []

    for zone in zones:
        entry = {
            "zone": zone,
            "wifiCount": random.randint(30, 150),
            "avgRSSI": random.randint(-90, -40),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        data.append(entry)

    # Update in-memory store
    global wifi_data_store
    wifi_data_store = data

    return data

# --------------------------
# Get latest Wi-Fi data
# --------------------------
def get_wifi_data():
    """
    Returns the latest Wi-Fi data
    """
    if not wifi_data_store:
        logger.info("No Wi-Fi data yet. Generating new data.")
        return generate_wifi_data()
    return wifi_data_store