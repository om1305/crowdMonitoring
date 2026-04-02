# stats.py
# Professional statistics management for crowd monitoring with multi-zone support.

from collections import deque
import time
from typing import Dict, List, Any


class CrowdStats:
    """
    Comprehensive crowd statistics tracker supporting multiple zones.
    Maintains real-time analytics including averages, peaks, trends, and per-zone metrics.
    """
    
    def __init__(self, zone_names=None):
        """
        Initialize CrowdStats with optional predefined zones.
        
        Args:
            zone_names (list): List of zone names. Default: ["Entrance", "Main Area", "Exit", "Ground"]
        """
        self.zone_names = zone_names or ["Entrance", "Main Area", "Exit", "Ground"]
        
        # Initialize zones data
        self.zones: Dict[str, Dict[str, Any]] = {}
        for zone in self.zone_names:
            self.zones[zone] = {
                "zone": zone,
                "crowdCount": 0,
                "density": "LOW",
                "riskScore": 0.0,
                "congestion": False,
                "status": "SAFE",
                "timestamp": time.strftime("%H:%M:%S")
            }
        
        # Global statistics
        self.history = deque(maxlen=300)  # Keep 300 frames history
        self.zone_history = {zone: deque(maxlen=300) for zone in self.zone_names}
        
        self.live_stats = {
            "avgCrowd": 0.0,
            "peakCrowd": 0,
            "trend": "stable",
            "timestamp": time.strftime("%H:%M:%S"),
            "totalCrowd": 0
        }
    
    def update_zone_stats(self, zone_name: str, crowd_count: int, density: str, 
                         risk_score: float, congestion: bool = False):
        """
        Update statistics for a specific zone.
        
        Args:
            zone_name (str): Name of the zone
            crowd_count (int): Number of people in the zone
            density (str): Density level (LOW, MEDIUM, HIGH)
            risk_score (float): Risk score (0-100)
            congestion (bool): Whether congestion is detected
        """
        if zone_name not in self.zones:
            return  # Skip unknown zones
        
        # Determine status based on risk score
        if risk_score > 70:
            status = "UNSAFE"
        elif risk_score > 40:
            status = "MODERATE"
        else:
            status = "SAFE"
        
        # Update zone data
        self.zones[zone_name].update({
            "crowdCount": crowd_count,
            "density": density,
            "riskScore": round(risk_score, 2),
            "congestion": congestion,
            "status": status,
            "timestamp": time.strftime("%H:%M:%S")
        })
        
        # Track history
        self.zone_history[zone_name].append(crowd_count)
    
    def update_stats(self, total_crowd_count: int, zones_data: List[Dict] = None):
        """
        Update global statistics and optionally zone-specific stats.
        
        Args:
            total_crowd_count (int): Total crowd count across all zones
            zones_data (list): Optional list of zone dictionaries with stats
        """
        # Update zone data if provided
        if zones_data:
            for zone_data in zones_data:
                zone_name = zone_data.get("zone")
                if zone_name:
                    self.update_zone_stats(
                        zone_name,
                        zone_data.get("crowdCount", 0),
                        zone_data.get("density", "LOW"),
                        zone_data.get("riskScore", 0.0),
                        zone_data.get("congestion", False)
                    )
        
        # Update global history
        self.history.append(total_crowd_count)
        timestamp = time.strftime("%H:%M:%S")
        
        # Calculate statistics
        if len(self.history) > 0:
            avg_crowd = sum(self.history) / len(self.history)
            peak_crowd = max(self.history)
            
            # Determine trend
            if len(self.history) > 1:
                if self.history[-1] > self.history[-2]:
                    trend = "increasing"
                elif self.history[-1] < self.history[-2]:
                    trend = "decreasing"
                else:
                    trend = "stable"
            else:
                trend = "stable"
        else:
            avg_crowd = 0
            peak_crowd = 0
            trend = "stable"
        
        # Update live stats
        self.live_stats.update({
            "avgCrowd": round(avg_crowd, 2),
            "peakCrowd": int(peak_crowd),
            "trend": trend,
            "timestamp": timestamp,
            "totalCrowd": int(total_crowd_count)
        })
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get comprehensive statistics including all zones.
        
        Returns:
            dict: Complete statistics with timestamp, trends, and all zones
        """
        return {
            "timestamp": self.live_stats["timestamp"],
            "avgCrowd": self.live_stats["avgCrowd"],
            "peakCrowd": self.live_stats["peakCrowd"],
            "trend": self.live_stats["trend"],
            "totalCrowd": self.live_stats["totalCrowd"],
            "zones": [self.zones[zone] for zone in self.zone_names]
        }
    
    def get_zone_stats(self, zone_name: str) -> Dict[str, Any]:
        """
        Get statistics for a specific zone.
        
        Args:
            zone_name (str): Name of the zone
        
        Returns:
            dict: Zone-specific statistics
        """
        return self.zones.get(zone_name, {})
    
    def get_safest_zone(self) -> str:
        """
        Get the safest zone based on risk score and density.
        
        Returns:
            str: Name of the safest zone
        """
        safest = min(
            self.zones.items(),
            key=lambda x: (x[1]["riskScore"], x[1]["crowdCount"])
        )
        return safest[0]
    
    def get_recommendations(self) -> Dict[str, str]:
        """
        Get entry/exit recommendations based on crowd metrics.
        
        Returns:
            dict: Recommended entry and exit zones
        """
        safe_zones = [z for z, v in self.zones.items() if v["status"] == "SAFE"]
        moderate_zones = [z for z, v in self.zones.items() if v["status"] == "MODERATE"]
        
        if "Entrance" in safe_zones:
            recommended_entry = "Entrance"
        elif "Entrance" in moderate_zones:
            recommended_entry = "Entrance (Moderate)"
        else:
            recommended_entry = "No Safe Entry Available"
        
        if "Exit" in safe_zones:
            recommended_exit = "Exit"
        elif "Exit" in moderate_zones:
            recommended_exit = "Exit (Moderate)"
        else:
            recommended_exit = "No Safe Exit Available"
        
        return {
            "recommendedEntry": recommended_entry,
            "recommendedExit": recommended_exit,
            "safestZone": self.get_safest_zone()
        }