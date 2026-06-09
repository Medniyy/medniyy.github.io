"""
Refined screen detection:
- lower threshold to catch full panel (incl. glare gradient edges)
- filter out frame tubes (extreme aspect ratios) and tiny specs
- outputs final JSON-ready values AND renders a verification PNG
"""
from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage
import json

DESKTOP_PATH = "assets/canvas-desktop.png"
MOBILE_PATH  = "assets/canvas-mobile.png"

def find_screens(path, threshold=100, min_area_frac=0.003, pad_px=0):
    img = Image.open(path).convert("L")
    w, h = img.size
    arr = np.array(img)
    bright = (arr >= threshold).astype(np.uint8)

    labeled, n = ndimage.label(bright)
    candidates = []
    for lbl in range(1, n + 1):
        ys, xs = np.where(labeled == lbl)
        area = len(xs)
        if area < min_area_frac * w * h:
            continue
        x1, y1, x2, y2 = xs.min(), ys.min(), xs.max(), ys.max()
        bw = x2 - x1
        bh = y2 - y1
        ar = bw / max(bh, 1)
        # Skip very thin strips (frame tubes) - aspect ratio > 12 or < 0.08
        if ar > 12 or ar < 0.08:
            continue
        # Skip very large blobs that cover most of the canvas
        if area > 0.25 * w * h:
            continue
        # Apply padding
        x1 = max(0, x1 - pad_px)
        y1 = max(0, y1 - pad_px)
        x2 = min(w - 1, x2 + pad_px)
        y2 = min(h - 1, y2 + pad_px)
        candidates.append({
            "x1": x1, "y1": y1, "x2": x2, "y2": y2,
            "area": area, "ar": round(ar, 2)
        })

    # Sort by area descending, pick top N
    candidates.sort(key=lambda c: -c["area"])
    return candidates, w, h


def to_pct(v, total):
    return round(v / total * 100, 2)


def render(img_path, rects_pct, out_path):
    img = Image.open(img_path).convert("RGB")
    draw = ImageDraw.Draw(img)
    W, H = img.size
    colors = ["#ff3333", "#33ff99", "#3399ff", "#ffcc00"]
    for i, r in enumerate(rects_pct):
        x1 = int(W * r["left"] / 100)
        y1 = int(H * r["top"] / 100)
        x2 = int(W * (r["left"] + r["width"]) / 100)
        y2 = int(H * (r["top"] + r["height"]) / 100)
        c = colors[i % len(colors)]
        draw.rectangle([x1, y1, x2, y2], outline=c, width=6)
        draw.text((x1 + 6, y1 + 6), r.get("id", str(i)), fill=c)
    img.save(out_path)
    print(f"  preview saved: {out_path}")


def process(path, n_screens, out_preview):
    candidates, W, H = find_screens(path, threshold=100, min_area_frac=0.003, pad_px=4)
    print(f"\n{path}  ({W}x{H})")
    print(f"  top {n_screens} candidates (by area):")
    rects_pct = []
    for c in candidates[:n_screens]:
        l  = to_pct(c["x1"], W)
        t  = to_pct(c["y1"], H)
        rw = to_pct(c["x2"] - c["x1"], W)
        rh = to_pct(c["y2"] - c["y1"], H)
        print(f"    ar={c['ar']:.2f}  left={l}%  top={t}%  width={rw}%  height={rh}%")
        rects_pct.append({"left": l, "top": t, "width": rw, "height": rh})
    render(path, rects_pct, out_preview)
    return rects_pct


if __name__ == "__main__":
    d = process(DESKTOP_PATH, 3, "assets/_detect-desktop.png")
    m = process(MOBILE_PATH,  3, "assets/_detect-mobile.png")
