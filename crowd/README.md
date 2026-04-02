# 🎯 Smart Crowd Monitoring System

A professional real-time crowd monitoring system using CCTV video input with AI-powered people detection, dynamic zone analysis, and REST API for live statistics.

## ✨ Features

### 🎥 Real-Time Detection
- **YOLOv8-based Detection**: Pre-trained model for accurate person detection
- **Multi-Zone Analysis**: Automatically divides frame into zones (Entrance, Main Area, Exit, Ground)
- **Per-Zone Metrics**: Crowd count, density, congestion, and risk score for each zone

### 📊 Analytics & Statistics
- **Live Statistics**: Average crowd, peak crowd, crowd trend (increasing/decreasing/stable)
- **Density Classification**: LOW, MEDIUM, HIGH, CRITICAL
- **Risk Assessment**: 0-100 risk score with automatic safety status (SAFE/MODERATE/UNSAFE)
- **Historical Tracking**: 300-frame history for trend analysis

### 🌐 REST API (FastAPI)
- `/api/crowd` - Complete crowd data with all zones
- `/api/stats` - Overall system statistics
- `/api/recommendations` - Smart entry/exit recommendations
- `/api/health` - System health check
- `/api/zones` - Zone-specific summary
- `/docs` - Interactive Swagger UI for testing

### 🎨 Professional Visualization
- **Color-Coded Zones**: Green (SAFE), Orange (MODERATE), Red (UNSAFE)
- **Real-Time Overlays**: Zone divisions, crowd info, bounding boxes
- **FPS Display**: Frame rate and processing metrics
- **Entry/Exit Guidance**: Recommended safest zones for evacuation

## 📋 Requirements

### System Requirements
- Python 3.8+
- OpenCV 4.8+
- 4GB RAM minimum
- CPU with SIMD support (for optimal YOLO performance)

### Installation

1. **Clone/Download the project**
```bash
cd crowd
```

2. **Create Virtual Environment** (Recommended)
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Linux/Mac
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Download YOLOv8 Model**
The model (`yolov8n.pt`) will be automatically downloaded on first run. If manual download is needed:
```bash
pip install ultralytics
yolo detect predict model=yolov8n.pt source=0 conf=0.25
```

## 🚀 Quick Start

### 1. Run the System
```bash
python main.py
```

**Expected Output:**
```
============================================================
🎬 Smart Crowd Monitoring System - Initialization
============================================================
📦 Loading YOLOv8 detection model...
✓ Model loaded successfully

📊 Initializing statistics tracker...
✓ Statistics tracker ready

🔍 Initializing crowd analyzer...
✓ Crowd analyzer ready

============================================================
✓ System initialization complete!
============================================================

🌐 API Server started. Access at http://127.0.0.1:8000
📊 API Documentation at http://127.0.0.1:8000/docs
```

### 2. Access API in Browser
- **API Endpoint**: http://127.0.0.1:8000/api/crowd
- **Swagger UI**: http://127.0.0.1:8000/docs
- **Health Check**: http://127.0.0.1:8000/api/health

### 3. Video Display
A window will open showing:
- Real-time video with person detection boxes
- Zone divisions (horizontal lines)
- Live crowd information overlays
- FPS and frame counter

Press **'q'** to quit the video window.

## 📚 Configuration

Edit `main.py` to customize:

```python
# Video source (file path, 0 for webcam, or RTSP URL)
VIDEO_SOURCE = "crowd.mp4"

# Model to use
MODEL_PATH = "yolov8n.pt"

# Target FPS for frame processing
FPS_TARGET = 30

# Display video window
DISPLAY_VIDEO = True

# Maximum capacity for risk calculation
MAX_CAPACITY = 50
```

## 🔌 API Endpoints

### 1. `/api/crowd` - Get Crowd Data
Returns all live crowd statistics and zone information.

**Response Example:**
```json
{
  "timestamp": "12:30:45",
  "avgCrowd": 10.5,
  "peakCrowd": 15,
  "trend": "increasing",
  "totalCrowd": 12,
  "zones": [
    {
      "zone": "Entrance",
      "crowdCount": 5,
      "density": "LOW",
      "riskScore": 10.0,
      "status": "SAFE",
      "congestion": false,
      "timestamp": "12:30:45"
    },
    {
      "zone": "Main Area",
      "crowdCount": 7,
      "density": "MEDIUM",
      "riskScore": 14.0,
      "status": "SAFE",
      "congestion": false,
      "timestamp": "12:30:45"
    }
  ]
}
```

### 2. `/api/stats` - Get Statistics
Returns overall system statistics (same format as `/api/crowd`).

### 3. `/api/recommendations` - Get Recommendations
Returns smart entry/exit recommendations based on crowd density.

**Response Example:**
```json
{
  "recommendedEntry": "Entrance",
  "recommendedExit": "Exit",
  "safestZone": "Ground",
  "reason": "Based on crowd density and risk assessment"
}
```

### 4. `/api/zones` - Zone Summary
Returns quick summary of all zones with status indicators.

**Response Example:**
```json
{
  "timestamp": "12:30:45",
  "zones": [
    {
      "zone": "Entrance",
      "crowdCount": 5,
      "status": "SAFE",
      "riskScore": 10.0,
      "density": "LOW"
    }
  ]
}
```

### 5. `/api/health` - Health Check
Returns system status and API version.

## 📊 Zone Safety Thresholds

- **SAFE**: Risk Score ≤ 40%
- **MODERATE**: 40% < Risk Score ≤ 70%
- **UNSAFE**: Risk Score > 70%

## 🎯 Video Sources

The system supports:
- **Video Files**: `"path/to/video.mp4"` - MP4, AVI, MOV, FLV
- **Webcam**: `0` - Default webcam
- **IP Camera**: `"rtsp://..."` - RTSP stream URL
- **Screen Recording**: Use any screen capture tool

## 🔧 Troubleshooting

### Model Not Loading
```bash
# Force redownload model
pip install ultralytics --upgrade
yolo detect predict model=yolov8n.pt source=0 conf=0.25
```

### API Not Accessible
1. Ensure port 8000 is not in use:
```bash
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :8000
```

2. Check firewall settings allow localhost access

### Video Window Not Displaying
- Ensure GUI support is available
- Check if X11 display is set (for remote systems)
- Try with `DISPLAY_VIDEO = True` in main.py

### Slow Processing
- Reduce video resolution
- Lower FPS_TARGET value
- Use GPU acceleration (requires CUDA)
- Use `yolov8s.pt` instead of `yolov8n.pt`

## 📁 Project Structure

```
crowd/
├── main.py                 # Main entry point with video processing
├── model.py               # YOLO model loading and detection
├── crowd_analysis.py      # Crowd metrics calculation
├── stats.py               # Statistics tracking and analytics
├── api.py                 # FastAPI REST endpoints
├── cctv_stream.py         # Video stream handling
├── requirements.txt       # Python dependencies
├── yolov8n.pt            # Pre-trained YOLOv8 model
└── README.md             # This file
```

## 🏗️ Module Description

### `main.py`
- Orchestrates video processing loop
- Initializes all components
- Manages API server startup
- Handles frame overlay rendering
- Controls system lifecycle

### `model.py`
- `PeopleDetector` class: Wraps YOLOv8 for consistent interface
- `detect_people()`: Detects persons in frames
- Returns structured detection data with confidence scores

### `crowd_analysis.py`
- `CrowdAnalyzer` class: Multi-zone analysis engine
- Zone assignment logic based on Y-coordinates
- Density, risk, and congestion calculations
- IOU-based overlap detection

### `stats.py`
- `CrowdStats` class: Statistics management
- Multi-zone tracking
- Historical data maintained
- Recommendation generation

### `api.py`
- FastAPI application setup
- CORS middleware configuration
- All REST endpoints
- Error handling and logging

## 🚀 Performance Tips

1. **GPU Acceleration**: Install CUDA-compatible PyTorch for faster inference
   ```bash
   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
   ```

2. **Smaller Model**: Use `yolov8s.pt` or `yolov8m.pt` for real-time performance on lower-end hardware

3. **Frame Skipping**: Process every N frames
   ```python
   if frame_count % 2 == 0:  # Process every 2nd frame
       detections = detector.detect_people(frame)
   ```

4. **Resolution Reduction**: Lower input resolution
   ```python
   if w > 640:
       scale = 640 / w
       frame = cv2.resize(frame, (640, int(h * scale)))
   ```

## 📝 Console Output Example

```
====================================================================================================
⏰ Timestamp: 12:30:46 | Total Crowd: 12
====================================================================================================
🟢 Entrance:
   Count: 5 | Density: LOW | Risk Score: 10.00% | Congestion: False | Status: SAFE
🟢 Main Area:
   Count: 7 | Density: MEDIUM | Risk Score: 14.00% | Congestion: False | Status: SAFE
🟢 Exit:
   Count: 0 | Density: LOW | Risk Score: 0.00% | Congestion: False | Status: SAFE

📍 Recommended Entry: Entrance
📍 Recommended Exit: Exit
📍 Safest Zone: Entrance
```

## 🎓 Understanding the Output

### Density Levels
- **LOW**: 1-5 people
- **MEDIUM**: 6-15 people
- **HIGH**: 16-30 people
- **CRITICAL**: 31+ people

### Risk Score Calculation
- Based on crowd count ratio to max capacity
- Increased by 1.2x if congestion detected
- Ranges from 0-100%

### Congestion Detection
- Uses Intersection over Union (IOU) algorithm
- Detects overlapping bounding boxes
- Threshold set to 0.3 (30% overlap)

## 🔐 Security Notes

- API runs on `0.0.0.0:8000` (accessible from any network interface)
- For production, use firewall rules or proxy
- Consider authentication for sensitive deployments
- Use HTTPS in production environments

## 📜 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For issues or improvements:
1. Check the Troubleshooting section
2. Verify all dependencies are installed
3. Review console logs for error details
4. Check API documentation at `/docs`

---

**Built with ❤️ using YOLOv8, FastAPI, and OpenCV**

**Version**: 1.0.0  
**Last Updated**: 2024
