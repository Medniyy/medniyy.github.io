"""
Creates canvas-*-overlay.png files with transparent holes cut at each screen position.
The overlay PNG is placed ON TOP of the video layer in the browser so the metal frame,
bezel, cables and glass effects all remain visible above the video content.
"""
from PIL import Image
import numpy as np

DESKTOP = [
    {"left": 31.9, "top": 32.5, "width":  9.6, "height": 26.7},   # left portrait
    {"left": 43.0, "top": 43.4, "width": 21.7, "height": 23.3},   # center landscape
    {"left": 53.2, "top": 25.6, "width": 15.4, "height": 17.5},   # right landscape
]
MOBILE = [
    {"left": 22.1, "top": 31.0, "width": 34.3, "height": 12.0},   # leftTop landscape
    {"left": 22.1, "top": 51.9, "width": 46.2, "height": 15.6},   # leftBottom landscape
    {"left": 58.1, "top": 34.0, "width": 20.2, "height": 17.2},   # right portrait
]


def make_overlay(src, screens, dst, feather=20):
    img = Image.open(src).convert("RGBA")
    W, H = img.size
    arr = np.array(img, dtype=np.float32)

    for s in screens:
        x1 = int(W * s["left"] / 100)
        y1 = int(H * s["top"] / 100)
        x2 = int(W * (s["left"] + s["width"]) / 100)
        y2 = int(H * (s["top"] + s["height"]) / 100)

        # Work on extended region so the feather can sample outside the rect
        ex1, ey1 = max(0, x1 - feather), max(0, y1 - feather)
        ex2, ey2 = min(W, x2 + feather), min(H, y2 + feather)

        yy, xx = np.mgrid[ey1:ey2, ex1:ex2].astype(np.float32)

        # Euclidean distance from the rectangle boundary (0 inside or on edge, >0 outside)
        dx = np.maximum(np.maximum(float(x1) - xx, xx - float(x2)), 0.0)
        dy = np.maximum(np.maximum(float(y1) - yy, yy - float(y2)), 0.0)
        dist_outside = np.sqrt(dx * dx + dy * dy)

        inside = (xx >= x1) & (xx < x2) & (yy >= y1) & (yy < y2)

        # 0 inside the screen (fully transparent) → ramps to 1 over `feather` px outside
        fade = np.where(inside, 0.0, np.clip(dist_outside / float(feather), 0.0, 1.0))

        arr[ey1:ey2, ex1:ex2, 3] *= fade

    result = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    result.save(dst)
    print(f"Saved {dst}  ({W}x{H})")


if __name__ == "__main__":
    make_overlay("assets/canvas-desktop.png", DESKTOP, "assets/canvas-desktop-overlay.png")
    make_overlay("assets/canvas-mobile.png",  MOBILE,  "assets/canvas-mobile-overlay.png")
