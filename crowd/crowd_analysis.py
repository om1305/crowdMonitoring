# crowd_analysis.py
# Professional crowd analysis with multi-zone support and advanced metrics.

import numpy as np
from typing import List, Dict, Tuple, Any


class CrowdAnalyzer:
    """
    Professional crowd analysis engine for detecting and analyzing human crowds.
    Provides comprehensive metrics including density, congestion, and risk assessment.
    """
    
    def __init__(self, frame_width: int, frame_height: int, max_capacity: int = 50):
        """
        Initialize the CrowdAnalyzer.
        
        Args:
            frame_width (int): Width of the video frame
            frame_height (int): Height of the video frame
            max_capacity (int): Maximum safe capacity for risk calculation
        """
        self.frame_width = frame_width
        self.frame_height = frame_height
        self.max_capacity = max_capacity
        
        # Define default zones as percentage of frame
        self.zones = {
            "Entrance": {"y_range": (0, 0.33), "color": (0, 255, 0)},      # Green
            "Main Area": {"y_range": (0.33, 0.66), "color": (0, 165, 255)},  # Orange
            "Exit": {"y_range": (0.66, 1.0), "color": (0, 0, 255)},          # Red
            "Ground": {"y_range": (0, 1.0), "color": (128, 128, 128)}        # Gray
        }
    
    def assign_detection_to_zone(self, center_y: int) -> str:
        """
        Assign a detection to a zone based on its center Y coordinate.
        
        Args:
            center_y (int): Y coordinate of detection center
        
        Returns:
            str: Zone name
        """
        normalized_y = center_y / self.frame_height
        
        for zone_name, zone_data in self.zones.items():
            if zone_name == "Ground":
                continue  # Skip ground, it's a fallback
            
            y_min, y_max = zone_data["y_range"]
            if y_min <= normalized_y <= y_max:
                return zone_name
        
        return "Ground"  # Fallback
    
    def analyze_crowd(self, detections: List[Dict]) -> Dict[str, Any]:
        """
        Analyze crowd metrics from detections.
        
        Args:
            detections (list): List of detection dictionaries from model
        
        Returns:
            dict: Comprehensive crowd analysis including zones breakdown
        """
        total_crowd = len(detections)
        zone_data = {zone: [] for zone in self.zones.keys()}
        
        # Assign detections to zones
        for detection in detections:
            center_y = detection.get("center", (0, 0))[1]
            zone = self.assign_detection_to_zone(center_y)
            zone_data[zone].append(detection)
        
        # Calculate per-zone metrics
        zones_analysis = []
        for zone_name, zone_detections in zone_data.items():
            crowd_count = len(zone_detections)
            
            # Calculate density
            density = self._calculate_density(crowd_count, zone_name)
            
            # Calculate risk score
            risk_score = self._calculate_risk_score(crowd_count, zone_detections)
            
            # Detect congestion
            congestion = self._detect_congestion(zone_detections) if zone_detections else False
            
            zones_analysis.append({
                "zone": zone_name,
                "crowdCount": crowd_count,
                "density": density,
                "riskScore": risk_score,
                "congestion": congestion,
                "detections": zone_detections
            })
        
        # Overall analysis
        overall_analysis = {
            "totalCrowd": total_crowd,
            "averageDensity": self._get_average_density(zones_analysis),
            "overallRiskScore": self._calculate_overall_risk(total_crowd),
            "zones": zones_analysis
        }
        
        return overall_analysis
    
    def _calculate_density(self, crowd_count: int, zone_name: str = None) -> str:
        """
        Calculate density level based on crowd count.
        
        Args:
            crowd_count (int): Number of people
            zone_name (str): Zone name for zone-specific thresholds
        
        Returns:
            str: Density level (LOW, MEDIUM, HIGH, CRITICAL)
        """
        if crowd_count <= 5:
            return "LOW"
        elif crowd_count <= 15:
            return "MEDIUM"
        elif crowd_count <= 30:
            return "HIGH"
        else:
            return "CRITICAL"
    
    def _calculate_risk_score(self, crowd_count: int, detections: List[Dict]) -> float:
        """
        Calculate risk score based on crowd count and congestion.
        
        Args:
            crowd_count (int): Number of people
            detections (list): Detection data
        
        Returns:
            float: Risk score (0-100)
        """
        # Base risk from crowd count
        base_risk = (crowd_count / self.max_capacity) * 100
        
        # Add congestion factor
        if detections:
            congestion_factor = 1.2 if self._detect_congestion(detections) else 1.0
            base_risk = base_risk * congestion_factor
        
        # Cap at 100
        return min(100.0, base_risk)
    
    def _calculate_overall_risk(self, total_crowd: int) -> float:
        """
        Calculate overall system risk.
        
        Args:
            total_crowd (int): Total crowd across all zones
        
        Returns:
            float: Overall risk score
        """
        return (total_crowd / (self.max_capacity * 2)) * 100
    
    def _get_average_density(self, zones_analysis: List[Dict]) -> str:
        """
        Calculate average density across all zones.
        
        Args:
            zones_analysis (list): Zone analysis data
        
        Returns:
            str: Average density level
        """
        if not zones_analysis:
            return "LOW"
        
        total_crowd = sum(z["crowdCount"] for z in zones_analysis if z["zone"] != "Ground")
        avg_risk = sum(z["riskScore"] for z in zones_analysis if z["zone"] != "Ground") / len([z for z in zones_analysis if z["zone"] != "Ground"])
        
        if avg_risk > 70:
            return "CRITICAL"
        elif avg_risk > 40:
            return "HIGH"
        elif avg_risk > 20:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _detect_congestion(self, detections: List[Dict], iou_threshold: float = 0.3) -> bool:
        """
        Detect congestion based on bounding box overlap.
        
        Args:
            detections (list): Detection data
            iou_threshold (float): Intersection over Union threshold
        
        Returns:
            bool: Whether congestion is detected
        """
        if len(detections) < 2:
            return False
        
        for i, det1 in enumerate(detections):
            for det2 in detections[i + 1:]:
                if self._calculate_iou(det1["bbox"], det2["bbox"]) > iou_threshold:
                    return True
        
        return False
    
    def _calculate_iou(self, box1: Tuple, box2: Tuple) -> float:
        """
        Calculate Intersection over Union between two bounding boxes.
        
        Args:
            box1 (tuple): First box (x1, y1, x2, y2)
            box2 (tuple): Second box (x1, y1, x2, y2)
        
        Returns:
            float: IOU value between 0 and 1
        """
        x1_1, y1_1, x2_1, y2_1 = box1
        x1_2, y1_2, x2_2, y2_2 = box2
        
        # Calculate intersection
        xi1 = max(x1_1, x1_2)
        yi1 = max(y1_1, y1_2)
        xi2 = min(x2_1, x2_2)
        yi2 = min(y2_1, y2_2)
        
        inter_area = max(0, xi2 - xi1) * max(0, yi2 - yi1)
        
        # Calculate union
        box1_area = (x2_1 - x1_1) * (y2_1 - y1_1)
        box2_area = (x2_2 - x1_2) * (y2_2 - y1_2)
        union_area = box1_area + box2_area - inter_area
        
        return inter_area / union_area if union_area > 0 else 0


# Legacy function support
def analyze_crowd(detections, max_capacity=50):
    """
    Legacy function: Analyze crowd based on detections.
    
    Args:
        detections (list): List of detected bounding boxes
        max_capacity (int): Maximum capacity
    
    Returns:
        dict: Crowd analysis
    """
    crowd_count = len(detections)
    
    # Calculate density
    if crowd_count <= 10:
        density = "LOW"
    elif crowd_count <= 25:
        density = "MEDIUM"
    else:
        density = "HIGH"
    
    # Calculate risk score
    risk_score = (crowd_count / max_capacity) * 100
    
    # Detect congestion
    congestion = any_overlap(detections)
    
    return {
        "crowdCount": crowd_count,
        "density": density,
        "riskScore": risk_score,
        "congestion": congestion
    }


def any_overlap(detections: List) -> bool:
    """
    Check if any bounding boxes overlap significantly.
    
    Args:
        detections (list): List of bounding boxes
    
    Returns:
        bool: Whether overlap detected
    """
    for i, box1 in enumerate(detections):
        for j, box2 in enumerate(detections):
            if i >= j:
                continue
            if iou(box1, box2) > 0.5:
                return True
    return False


def iou(box1: Tuple, box2: Tuple) -> float:
    """
    Calculate Intersection over Union of two bounding boxes.
    
    Args:
        box1: First bounding box
        box2: Second bounding box
    
    Returns:
        float: IOU value
    """
    x1, y1, x2, y2 = box1[:4]
    x1_, y1_, x2_, y2_ = box2[:4]
    
    xi1, yi1 = max(x1, x1_), max(y1, y1_)
    xi2, yi2 = min(x2, x2_), min(y2, y2_)
    inter_area = max(0, xi2 - xi1) * max(0, yi2 - yi1)
    
    box1_area = (x2 - x1) * (y2 - y1)
    box2_area = (x2_ - x1_) * (y2_ - y1_)
    
    union_area = box1_area + box2_area - inter_area
    
    return inter_area / union_area if union_area > 0 else 0