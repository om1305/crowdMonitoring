# heatmap.py
# Generates real-time heatmap for crowd density visualization.

import numpy as np
import cv2

def generate_heatmap(frame, detections, frame_shape):
    """
    Generate a heatmap based on detections.
    :param frame: Original video frame.
    :param detections: List of bounding boxes for detected persons.
    :param frame_shape: Shape of the video frame (height, width).
    :return: Heatmap image.
    """
    heatmap = np.zeros(frame_shape[:2], dtype=np.float32)

    for box in detections:
        x1, y1, x2, y2 = map(int, box[:4])
        heatmap[y1:y2, x1:x2] += 1

    # Apply Gaussian blur for smoothing
    heatmap = cv2.GaussianBlur(heatmap, (25, 25), 0)

    # Normalize heatmap to range [0, 255]
    heatmap = np.uint8(255 * heatmap / np.max(heatmap)) if np.max(heatmap) > 0 else heatmap

    # Apply color map
    heatmap_colored = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Overlay heatmap on the original frame
    overlay = cv2.addWeighted(frame, 0.6, heatmap_colored, 0.4, 0)

    return overlay, heatmap_colored