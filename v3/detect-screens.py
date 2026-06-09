"""
Auto-detect the bright screen rectangles in each canvas PNG.
Outputs left/top/width/height as percentages, ready to paste into screens.json.
"""
from PIL import Image, ImageFilter
import numpy as np

def find_screen_rects(path, brightness_threshold=160, min_area_frac=0.002):
    img = Image.open(path).convert("L")  # grayscale
    w, h = img.size
    arr = np.array(img)

    bright = (arr >= brightness_threshold).astype(np.uint8)

    # Simple connected-components via scipy if available, else manual flood fill
    try:
        from scipy import ndimage
        labeled, n = ndimage.label(bright)
        rects = []
        for lbl in range(1, n + 1):
            ys, xs = np.where(labeled == lbl)
            area = len(xs)
            if area < min_area_frac * w * h:
                continue
            x1, y1, x2, y2 = xs.min(), ys.min(), xs.max(), ys.max()
            rects.append((x1, y1, x2 - x1, y2 - y1))
        return rects, w, h
    except ImportError:
        # fallback: row/col projection
        col_any = bright.max(axis=0)
        row_any = bright.max(axis=1)
        col_on = np.where(col_any)[0]
        row_on = np.where(row_any)[0]
        if len(col_on) == 0 or len(row_on) == 0:
            return [], w, h
        x1, x2 = col_on[0], col_on[-1]
        y1, y2 = row_on[0], row_on[-1]
        return [(x1, y1, x2 - x1, y2 - y1)], w, h


def pct(v, total):
    return round(v / total * 100, 1)


def analyse(path):
    print(f"\n=== {path} ===")
    rects, w, h = find_screen_rects(path)
    print(f"  canvas size: {w} x {h}")
    for i, (x, y, rw, rh) in enumerate(sorted(rects, key=lambda r: r[0])):
        print(f"  rect {i}: left={pct(x,w)}%  top={pct(y,h)}%  width={pct(rw,w)}%  height={pct(rh,h)}%   (px: x={x} y={y} w={rw} h={rh})")


if __name__ == "__main__":
    analyse("assets/canvas-desktop.png")
    analyse("assets/canvas-mobile.png")
