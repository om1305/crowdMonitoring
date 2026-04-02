# # main.py
# import cv2
# import threading
# import time
# import logging
# from datetime import datetime
# import requests

# from model import PeopleDetector
# from stats import CrowdStats
# from api import app  # Removed set_stats
# import uvicorn

# # ==================== CONFIG ====================
# VIDEO_SOURCE = "crowd.mp4"  # 0 for webcam or RTSP URL
# MODEL_PATH = "yolov8n.pt"
# FPS_TARGET = 30
# DISPLAY_VIDEO = True
# MAX_CAPACITY = 50  # maximum safe people in the zone
# API_CCTV_UPDATE = "http://127.0.0.1:8000/update/cctv"

# # ==================== GLOBALS ====================
# detector = None
# stats = None
# running = True

# logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
# logger = logging.getLogger(__name__)

# # ==================== API ====================
# def start_api():
#     """Run FastAPI in a background thread"""
#     uvicorn.run(app, host="0.0.0.0", port=8000, log_level="error", access_log=False)

# # ==================== INITIALIZATION ====================
# def initialize_system():
#     global detector, stats
#     try:
#         logger.info("🎬 Initializing Smart Crowd Monitoring System...")

#         # Load YOLOv8 model
#         logger.info("📦 Loading YOLOv8 model...")
#         detector = PeopleDetector(MODEL_PATH)
#         logger.info("✓ Model loaded successfully")

#         # Stats tracker
#         logger.info("📊 Initializing stats tracker...")
#         stats = CrowdStats()
#         logger.info("✓ Stats tracker ready")

#         logger.info("✓ System initialization complete\n")
#         return True
#     except Exception as e:
#         logger.error(f"✗ Initialization failed: {e}")
#         return False

# # ==================== VIDEO CAPTURE ====================
# def get_video_capture(source):
#     cap = cv2.VideoCapture(source)
#     if not cap.isOpened():
#         logger.error(f"✗ Cannot open video source: {source}")
#         return None
#     logger.info(f"✓ Video source connected: {source}")
#     return cap

# # ==================== CROWD ANALYZER ====================
# def analyze_crowd(detections):
#     crowd_count = len(detections)
#     risk_score = min((crowd_count / MAX_CAPACITY) * 100, 100)

#     if risk_score < 60:
#         status = "SAFE"
#     elif risk_score < 85:
#         status = "MODERATE"
#     else:
#         status = "UNSAFE"

#     return {
#         "zone": "Main Area",
#         "crowdCount": crowd_count,
#         "riskScore": risk_score,
#         "status": status
#     }

# # ==================== DRAWING ====================
# def draw_detections(frame, detections):
#     for det in detections:
#         x1, y1, x2, y2 = det["bbox"]
#         conf = det["confidence"]
#         cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#         label = f"Person: {conf:.2f}"
#         cv2.putText(frame, label, (x1, y1-5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1)
#     return frame

# def draw_zone_info(frame, zone_data):
#     h, w = frame.shape[:2]
#     status_colors = {"SAFE": (0, 255, 0), "MODERATE": (0, 165, 255), "UNSAFE": (0, 0, 255)}

#     name = zone_data["zone"]
#     crowd = zone_data["crowdCount"]
#     risk = zone_data["riskScore"]
#     status = zone_data["status"]
#     color = status_colors.get(status, (128,128,128))

#     # Full-frame rectangle
#     cv2.rectangle(frame, (0,0), (w,h), color, 3)

#     # Overlay text background
#     cv2.rectangle(frame, (0,0), (w,50), (0,0,0), -1)
#     info = f"{name} | Crowd: {crowd} | Risk: {risk:.1f}% | Status: {status}"
#     cv2.putText(frame, info, (10,30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

#     # Bottom overlay: FPS and total people
#     cv2.rectangle(frame, (0,h-30), (w,h), (0,0,0), -1)
#     return frame

# # ==================== SEND CCTV DATA TO API ====================
# def send_cctv_to_api(count):
#     try:
#         requests.post(API_CCTV_UPDATE, json={"Main Area": count})
#     except Exception as e:
#         logger.error(f"Error sending CCTV data to API: {e}")

# # ==================== VIDEO LOOP ====================
# def process_video():
#     global running
#     cap = get_video_capture(VIDEO_SOURCE)
#     if cap is None: return

#     prev_time = time.time()

#     while running and cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
#             continue

#         h, w = frame.shape[:2]
#         if w > 1280:
#             scale = 1280 / w
#             frame = cv2.resize(frame, (int(w*scale), int(h*scale)))

#         # Detect people
#         detections = detector.detect_people(frame)

#         # Analyze crowd
#         zone_data = analyze_crowd(detections)

#         # Update stats
#         stats.update_stats(zone_data["crowdCount"], [zone_data])

#         # Send CCTV counts to API
#         send_cctv_to_api(zone_data["crowdCount"])

#         # Draw detections
#         frame = draw_detections(frame, detections)
#         frame = draw_zone_info(frame, zone_data)

#         # Calculate FPS
#         curr_time = time.time()
#         fps = 1 / (curr_time - prev_time)
#         prev_time = curr_time

#         # Display FPS and total crowd
#         cv2.putText(frame, f"FPS: {fps:.1f}", (10,h-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,255), 2)
#         cv2.putText(frame, f"Total People: {zone_data['crowdCount']}", (200,h-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,255), 2)

#         if DISPLAY_VIDEO:
#             cv2.imshow("Smart Crowd Monitoring", frame)
#             if cv2.waitKey(1) & 0xFF == ord('q'):
#                 running = False
#                 break

#         time.sleep(1 / FPS_TARGET)

#     cap.release()
#     cv2.destroyAllWindows()
#     logger.info("✓ Video processing stopped")

# # ==================== MAIN ====================
# def main():
#     global running
#     if not initialize_system(): return

#     # Start API in background
#     api_thread = threading.Thread(target=start_api, daemon=True)
#     api_thread.start()
#     logger.info("🌐 API running at http://127.0.0.1:8000/docs")
#     time.sleep(2)  # give API time to start

#     try:
#         process_video()
#     except KeyboardInterrupt:
#         running = False
#     finally:
#         logger.info("✓ Smart Crowd Monitoring System shutdown complete")

# if __name__=="__main__":
#     main()
# main.py
# import cv2
# import threading
# import time
# import logging
# import requests
# from model import PeopleDetector
# from stats import CrowdStats
# from api import app
# import uvicorn

# VIDEO_SOURCE = "crowd.mp4"
# MODEL_PATH = "yolov8n.pt"
# FPS_TARGET = 30
# DISPLAY_VIDEO = True
# MAX_CAPACITY = 50
# API_CCTV_UPDATE = "http://127.0.0.1:8000/update/cctv"

# ZONES = ["Ground A", "Gate A", "Stage", "Food Court"]
# ZONE_BBOX = {  # x1,y1,x2,y2 for demo purposes (split video frame)
#     "Ground A": (0,0,320,240),
#     "Gate A": (320,0,640,240),
#     "Stage": (0,240,320,480),
#     "Food Court": (320,240,640,480)
# }

# detector = None
# stats = None
# running = True

# logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
# logger = logging.getLogger(__name__)

# # ==================== API ====================
# def start_api():
#     uvicorn.run(app, host="0.0.0.0", port=8000, log_level="error", access_log=False)

# # ==================== SYSTEM INIT ====================
# def initialize_system():
#     global detector, stats
#     try:
#         logger.info("Initializing system...")
#         detector = PeopleDetector(MODEL_PATH)
#         stats = CrowdStats()
#         logger.info("System ready")
#         return True
#     except Exception as e:
#         logger.error(f"Initialization failed: {e}")
#         return False

# # ==================== VIDEO ====================
# def get_video_capture(source):
#     cap = cv2.VideoCapture(source)
#     if not cap.isOpened():
#         logger.error(f"Cannot open video source: {source}")
#         return None
#     return cap

# # ==================== SEND CCTV ====================
# def send_cctv_to_api(zone_counts):
#     try:
#         requests.post(API_CCTV_UPDATE, json=zone_counts)
#     except Exception as e:
#         logger.error(f"Error sending CCTV to API: {e}")

# # ==================== VIDEO LOOP ====================
# def process_video():
#     global running
#     cap = get_video_capture(VIDEO_SOURCE)
#     if cap is None: return
#     prev_time = time.time()

#     while running and cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
#             continue

#         h, w = frame.shape[:2]
#         if w > 640:
#             scale = 640 / w
#             frame = cv2.resize(frame, (int(w*scale), int(h*scale)))

#         zone_counts = {}
#         for zone, bbox in ZONE_BBOX.items():
#             x1, y1, x2, y2 = bbox
#             roi = frame[y1:y2, x1:x2]
#             detections = detector.detect_people(roi)
#             zone_counts[zone] = len(detections)
#             # Draw rectangle per zone
#             cv2.rectangle(frame, (x1,y1), (x2,y2), (0,255,0), 2)
#             cv2.putText(frame, f"{zone}: {len(detections)}", (x1, y1-5),
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)

#         send_cctv_to_api(zone_counts)

#         # Display frame
#         if DISPLAY_VIDEO:
#             cv2.imshow("Smart Crowd Monitoring", frame)
#             if cv2.waitKey(1) & 0xFF == ord('q'):
#                 running = False
#                 break

#         time.sleep(1/FPS_TARGET)

#     cap.release()
#     cv2.destroyAllWindows()
#     logger.info("Video processing stopped")

# # ==================== MAIN ====================
# def main():
#     global running
#     if not initialize_system(): return

#     # Start API
#     api_thread = threading.Thread(target=start_api, daemon=True)
#     api_thread.start()
#     logger.info("API running at http://127.0.0.1:8000/docs")
#     time.sleep(2)

#     try:
#         process_video()
#     except KeyboardInterrupt:
#         running = False
#     finally:
#         logger.info("System shutdown complete")

# if __name__=="__main__":
#     main()
# main.py
# import cv2
# import threading
# import time
# import logging
# from datetime import datetime
# import random
# import requests

# from model import PeopleDetector
# from stats import CrowdStats
# from api import app, set_stats
# import uvicorn

# # ==================== CONFIG ====================
# FPS_TARGET = 30
# DISPLAY_VIDEO = True
# MAX_CAPACITY = 50  # maximum safe people in a zone

# # ==================== LOGGING ====================
# logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
# logger = logging.getLogger(__name__)

# # ==================== ZONES & VIDEOS ====================
# # List of zones
# ZONES = ["Ground A", "Gate A", "Stage", "Food Court"]

# # Video sources per zone
# VIDEO_SOURCES = {
#     "Ground A": "crowd.mp4",  # your current footage
#     # Add more zones later:
#     # "Gate A": "gate_a.mp4",
#     # "Stage": "stage.mp4"
# }

# # ==================== GLOBALS ====================
# detector = None
# stats = None
# running = True
# caps = {}  # store VideoCapture objects per zone

# # ==================== API ====================
# def start_api():
#     """Run FastAPI in background thread"""
#     uvicorn.run(app, host="0.0.0.0", port=8000, log_level="error", access_log=False)

# # ==================== INITIALIZATION ====================
# def initialize_system():
#     global detector, stats
#     try:
#         logger.info("🎬 Initializing Smart Crowd Monitoring System...")

#         # Load YOLOv8 model
#         logger.info("📦 Loading YOLOv8 model...")
#         detector = PeopleDetector("yolov8n.pt")
#         logger.info("✓ Model loaded successfully")

#         # Stats tracker
#         logger.info("📊 Initializing stats tracker...")
#         stats = CrowdStats()
#         set_stats(stats)
#         logger.info("✓ Stats tracker ready")

#         # Open video sources
#         for zone, source in VIDEO_SOURCES.items():
#             cap = cv2.VideoCapture(source)
#             if not cap.isOpened():
#                 logger.error(f"✗ Cannot open video for {zone}: {source}")
#                 continue
#             caps[zone] = cap
#             logger.info(f"✓ Video connected for zone {zone}")

#         logger.info("✓ System initialization complete\n")
#         return True
#     except Exception as e:
#         logger.error(f"✗ Initialization failed: {e}")
#         return False

# # ==================== VIDEO PROCESSING ====================
# def process_videos():
#     global running
#     prev_time = time.time()

#     while running:
#         zone_counts = {}

#         for zone in ZONES:
#             if zone in caps:
#                 cap = caps[zone]
#                 ret, frame = cap.read()
#                 if not ret:
#                     cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
#                     ret, frame = cap.read()
#                 if not ret:
#                     zone_counts[zone] = 0
#                     continue

#                 # Optional: resize large frames
#                 h, w = frame.shape[:2]
#                 if w > 1280:
#                     scale = 1280 / w
#                     frame = cv2.resize(frame, (int(w*scale), int(h*scale)))

#                 # Detect people
#                 detections = detector.detect_people(frame)
#                 count = len(detections)
#                 zone_counts[zone] = count

#                 # Analyze and draw
#                 zone_data = analyze_crowd(count, zone)
#                 stats.update_stats(count, [zone_data])

#                 # Clean frame drawing
#                 frame_copy = frame.copy()
#                 frame_copy = draw_detections(frame_copy, detections)
#                 frame_copy = draw_zone_info(frame_copy, zone_data)

#                 # FPS
#                 curr_time = time.time()
#                 fps = 1 / (curr_time - prev_time)
#                 prev_time = curr_time
#                 cv2.putText(frame_copy, f"FPS: {fps:.1f}", (10,h-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,255), 2)
#                 cv2.putText(frame_copy, f"People: {count}", (200,h-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,255), 2)

#                 if DISPLAY_VIDEO:
#                     cv2.imshow(f"Smart Crowd Monitoring - {zone}", frame_copy)
#                     if cv2.waitKey(1) & 0xFF == ord('q'):
#                         running = False
#                         break

#             else:
#                 # No video → simulate count
#                 zone_counts[zone] = random.randint(5, 20)

#         # Send real-time counts to API
#         send_cctv_to_api(zone_counts)

#         # Simulate Wi-Fi counts if desired
#         wifi_counts = {zone: random.randint(10,50) for zone in ZONES}
#         send_wifi_to_api(wifi_counts)

#         time.sleep(1 / FPS_TARGET)

#     # Release all videos
#     for cap in caps.values():
#         cap.release()
#     cv2.destroyAllWindows()
#     logger.info("✓ Video processing stopped")

# # ==================== CROWD ANALYZER ====================
# def analyze_crowd(count, zone):
#     risk_score = min((count / MAX_CAPACITY) * 100, 100)
#     if risk_score < 60:
#         status = "SAFE"
#     elif risk_score < 85:
#         status = "MODERATE"
#     else:
#         status = "UNSAFE"
#     return {
#         "zone": zone,
#         "crowdCount": count,
#         "riskScore": risk_score,
#         "status": status
#     }

# # ==================== DRAWING ====================
# def draw_detections(frame, detections):
#     for det in detections:
#         x1, y1, x2, y2 = det["bbox"]
#         conf = det["confidence"]
#         cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#         label = f"Person: {conf:.2f}"
#         cv2.putText(frame, label, (x1, y1-5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1)
#     return frame

# def draw_zone_info(frame, zone_data):
#     h, w = frame.shape[:2]
#     status_colors = {"SAFE": (0, 255, 0), "MODERATE": (0, 165, 255), "UNSAFE": (0, 0, 255)}

#     color = status_colors.get(zone_data["status"], (128,128,128))
#     # Full-frame rectangle
#     cv2.rectangle(frame, (0,0), (w,h), color, 3)

#     # Top overlay
#     cv2.rectangle(frame, (0,0), (w,50), (0,0,0), -1)
#     info = f"{zone_data['zone']} | Crowd: {zone_data['crowdCount']} | Risk: {zone_data['riskScore']:.1f}% | Status: {zone_data['status']}"
#     cv2.putText(frame, info, (10,30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)
#     return frame

# # ==================== API UPDATES ====================
# def send_cctv_to_api(data):
#     try:
#         requests.post("http://127.0.0.1:8000/update/cctv", json=data, timeout=1)
#     except:
#         pass

# def send_wifi_to_api(data):
#     try:
#         requests.post("http://127.0.0.1:8000/update/wifi", json=data, timeout=1)
#     except:
#         pass

# # ==================== MAIN ====================
# def main():
#     global running
#     if not initialize_system():
#         return

#     # Start API in background
#     api_thread = threading.Thread(target=start_api, daemon=True)
#     api_thread.start()
#     logger.info("🌐 API running at http://127.0.0.1:8000/docs")
#     time.sleep(2)  # give API time to start

#     try:
#         process_videos()
#     except KeyboardInterrupt:
#         running = False
#     finally:
#         logger.info("✓ Smart Crowd Monitoring System shutdown complete")

# if __name__=="__main__":
#     main()


# main.py
import cv2
import threading
import time
import logging
from datetime import datetime
import random
import requests

from model import PeopleDetector
from stats import CrowdStats
from api import app  # no set_stats needed
import uvicorn

# ==================== CONFIG ====================
FPS_TARGET = 30
DISPLAY_VIDEO = True
MAX_CAPACITY = 50  # maximum safe people in a zone

# ==================== LOGGING ====================
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ==================== ZONES & VIDEOS ====================
ZONES = ["Ground A", "Gate A", "Stage", "Food Court"]
VIDEO_SOURCES = {
    "Ground A": "crowd.mp4",  # your footage
    # Add more later:
    # "Gate A": "gate_a.mp4"
}

# ==================== GLOBALS ====================
detector = None
stats = None
running = True
caps = {}  # store VideoCapture objects per zone

# ==================== API ====================
def start_api():
    """Run FastAPI in background thread"""
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="error", access_log=False)

# ==================== INITIALIZATION ====================
def initialize_system():
    global detector, stats
    try:
        logger.info("🎬 Initializing Smart Crowd Monitoring System...")

        # Load YOLOv8 model
        logger.info("📦 Loading YOLOv8 model...")
        detector = PeopleDetector("yolov8n.pt")
        logger.info("✓ Model loaded successfully")

        # Stats tracker
        logger.info("📊 Initializing stats tracker...")
        stats = CrowdStats()
        logger.info("✓ Stats tracker ready")

        # Open video sources
        for zone, source in VIDEO_SOURCES.items():
            cap = cv2.VideoCapture(source)
            if not cap.isOpened():
                logger.error(f"✗ Cannot open video for {zone}: {source}")
                continue
            caps[zone] = cap
            logger.info(f"✓ Video connected for zone {zone}")

        logger.info("✓ System initialization complete\n")
        return True
    except Exception as e:
        logger.error(f"✗ Initialization failed: {e}")
        return False

# ==================== VIDEO PROCESSING ====================
def process_videos():
    global running
    prev_time = time.time()

    while running:
        zone_counts = {}

        for zone in ZONES:
            if zone in caps:
                cap = caps[zone]
                ret, frame = cap.read()
                if not ret:
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    ret, frame = cap.read()
                if not ret:
                    zone_counts[zone] = 0
                    continue

                h, w = frame.shape[:2]
                if w > 1280:
                    scale = 1280 / w
                    frame = cv2.resize(frame, (int(w*scale), int(h*scale)))

                detections = detector.detect_people(frame)
                count = len(detections)
                zone_counts[zone] = count

                zone_data = analyze_crowd(count, zone)

                # Draw
                frame_copy = frame.copy()
                frame_copy = draw_detections(frame_copy, detections)
                frame_copy = draw_zone_info(frame_copy, zone_data)

                # FPS
                curr_time = time.time()
                fps = 1 / (curr_time - prev_time)
                prev_time = curr_time
                cv2.putText(frame_copy, f"FPS: {fps:.1f}", (10,h-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,255), 2)
                cv2.putText(frame_copy, f"People: {count}", (200,h-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,255), 2)

                if DISPLAY_VIDEO:
                    cv2.imshow(f"{zone}", frame_copy)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        running = False
                        break
            else:
                # No video: random data
                zone_counts[zone] = random.randint(5,20)

        send_cctv_to_api(zone_counts)
        wifi_counts = {zone: random.randint(10,50) for zone in ZONES}
        send_wifi_to_api(wifi_counts)

        time.sleep(1 / FPS_TARGET)

    for cap in caps.values():
        cap.release()
    cv2.destroyAllWindows()
    logger.info("✓ Video processing stopped")

# ==================== CROWD ANALYZER ====================
def analyze_crowd(count, zone):
    risk_score = min((count / MAX_CAPACITY) * 100, 100)
    if risk_score < 60:
        status = "SAFE"
    elif risk_score < 85:
        status = "MODERATE"
    else:
        status = "UNSAFE"
    return {"zone": zone, "crowdCount": count, "riskScore": risk_score, "status": status}

# ==================== DRAWING ====================
def draw_detections(frame, detections):
    for det in detections:
        x1, y1, x2, y2 = det["bbox"]
        conf = det["confidence"]
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)
        cv2.putText(frame, f"Person: {conf:.2f}", (x1,y1-5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1)
    return frame

def draw_zone_info(frame, zone_data):
    h, w = frame.shape[:2]
    status_colors = {"SAFE": (0,255,0), "MODERATE": (0,165,255), "UNSAFE": (0,0,255)}
    color = status_colors.get(zone_data["status"], (128,128,128))
    cv2.rectangle(frame, (0,0), (w,h), color, 3)
    cv2.rectangle(frame, (0,0), (w,50), (0,0,0), -1)
    info = f"{zone_data['zone']} | Crowd: {zone_data['crowdCount']} | Risk: {zone_data['riskScore']:.1f}% | Status: {zone_data['status']}"
    cv2.putText(frame, info, (10,30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)
    return frame

# ==================== API UPDATES ====================
def send_cctv_to_api(data):
    try:
        requests.post("http://127.0.0.1:8000/update/cctv", json=data, timeout=1)
    except:
        pass

def send_wifi_to_api(data):
    try:
        requests.post("http://127.0.0.1:8000/update/wifi", json=data, timeout=1)
    except:
        pass

# ==================== MAIN ====================
def main():
    global running
    if not initialize_system():
        return

    api_thread = threading.Thread(target=start_api, daemon=True)
    api_thread.start()
    logger.info("🌐 API running at http://127.0.0.1:8000/docs")
    time.sleep(2)

    try:
        process_videos()
    except KeyboardInterrupt:
        running = False
    finally:
        logger.info("✓ Smart Crowd Monitoring System shutdown complete")

if __name__=="__main__":
    main()