# model.py
# Loads YOLO model and performs person detection with comprehensive detection capabilities.

from ultralytics import YOLO
import cv2
import numpy as np


class PeopleDetector:
    """
    Professional people detection class using YOLOv8.
    Handles model loading and efficient detection with structured output.
    """
    
    def __init__(self, model_path="yolov8n.pt"):
        """
        Initialize the PeopleDetector with a pre-trained YOLO model.
        
        Args:
            model_path (str): Path to the YOLO model file.
        """
        try:
            self.model = YOLO(model_path)
            print(f"✓ Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            raise
    
    def detect_people(self, frame, confidence_threshold=0.5):
        """
        Detect people in a given video frame with structured output.
        
        Args:
            frame (numpy.ndarray): Input video frame.
            confidence_threshold (float): Minimum confidence score for detections.
        
        Returns:
            list: List of detection dictionaries with bbox, confidence, and center coordinates.
        """
        try:
            results = self.model(frame, classes=[0], conf=confidence_threshold, imgsz=640)
            detections = []
            
            if results[0].boxes is not None:
                boxes = results[0].boxes.data.cpu().numpy()
                
                for box in boxes:
                    x1, y1, x2, y2, confidence, class_id = box[:6]
                    if int(class_id) == 0:  # Person class
                        cx = int((x1 + x2) / 2)
                        cy = int((y1 + y2) / 2)
                        
                        detections.append({
                            'bbox': (int(x1), int(y1), int(x2), int(y2)),
                            'confidence': float(confidence),
                            'center': (cx, cy),
                            'width': int(x2 - x1),
                            'height': int(y2 - y1)
                        })
            
            return detections
        except Exception as e:
            print(f"✗ Error during detection: {e}")
            return []


# Legacy function support for backward compatibility
def load_model(model_path="yolov8n.pt"):
    """
    Legacy function: Load YOLO model for person detection.
    
    Args:
        model_path (str): Path to YOLO model file.
    
    Returns:
        PeopleDetector: Detector object
    """
    return PeopleDetector(model_path)


def detect_people(model, frame):
    """
    Legacy function: Perform person detection on a frame.
    
    Args:
        model: PeopleDetector object or YOLO model object.
        frame (numpy.ndarray): Input frame.
    
    Returns:
        list: List of detections
    """
    if isinstance(model, PeopleDetector):
        return model.detect_people(frame)
    else:
        # Fallback for raw YOLO model
        results = model(frame, classes=[0])
        return results[0].boxes.data.cpu().numpy()