# evacuation.py
# Computes evacuation routes and identifies safe exits.

import numpy as np

def find_safe_exit(heatmap):
    """
    Identify the safest low-density area in the heatmap.
    :param heatmap: Heatmap image (grayscale).
    :return: Coordinates of the safe exit.
    """
    min_density = np.min(heatmap)
    safe_coords = np.unravel_index(np.argmin(heatmap), heatmap.shape)
    return safe_coords

def draw_evacuation_path(frame, safe_coords):
    """
    Draw evacuation path on the video frame.
    :param frame: Original video frame.
    :param safe_coords: Coordinates of the safe exit.
    :return: Frame with evacuation path drawn.
    """
    height, width = frame.shape[:2]
    center = (width // 2, height // 2)
    safe_point = (safe_coords[1], safe_coords[0])

    # Draw arrow toward the safe exit
    cv2.arrowedLine(frame, center, safe_point, (0, 255, 0), 3, tipLength=0.05)
    cv2.putText(frame, "SAFE EXIT", (safe_point[0] - 50, safe_point[1] - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    return frame