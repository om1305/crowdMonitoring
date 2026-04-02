# cctv_stream.py
# Handles input from RTSP, IP cameras, and video files using OpenCV.

import cv2

def get_video_stream(source):
    """
    Initialize video capture from a given source.
    :param source: RTSP URL, IP camera URL, or video file path.
    :return: OpenCV VideoCapture object
    """
    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        raise ValueError(f"Unable to open video source: {source}")
    return cap