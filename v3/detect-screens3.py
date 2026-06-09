"""
Two-pass screen detection:
  Pass 1 (threshold=170): find distinct screen cores (bright white only)
  Pass 2 (threshold=90):  expand each core's bounding box to catch dark edges
Renders coloured overlays for visual verification.
"""
from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage

DESKTOP_PATH = "assets/canvas-desktop.png"
MOBILE_PATH  = "assets/canvas-mobile.png"


def labeled_rects(arr, threshold, min_area_frac, W, H):
    bright = (arr >= threshold).astype(np.uint8)
    labeled, n = ndimage.label(bright)
    rects = []
    for lbl in range(1, n + 1):
        ys, xs = np.where(labeled == lbl)
        area = len(xs)
        if area < min_area_frac * W * H:
            continue
        x1, y1, x2, y2 = int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())
        bw, bh = x2 - x1, y2 - y1
        ar = bw / max(bh, 1)
        rects.append(dict(x1=x1, y1=y1, x2=x2, y2=y2, area=area, ar=ar))
    return rects


def find_screens(path, n_screens, margin_frac=0.01):
    img = Image.open(path).convert("L")
    W, H = img.size
    arr = np.array(img)

    # Pass 1: bright cores (screen panels only, frame tubes excluded by ar)
    cores = labeled_rects(arr, threshold=170, min_area_frac=0.0015, W=W, H=H)
    # Remove extreme aspect ratios (frame tubes) and huge blobs
    cores = [c for c in cores
             if 0.12 < c["ar"] < 8
             and c["area"] < 0.20 * W * H]
    cores.sort(key=lambda c: -c["area"])
    cores = cores[:n_screens]

    margin = int(min(W, H) * margin_frac)
    low_arr = (arr >= 90).astype(np.uint8)
    labeled_low, _ = ndimage.label(low_arr)

    results = []
    for core in cores:
        # centre pixel of core
        cx = (core["x1"] + core["x2"]) // 2
        cy = (core["y1"] + core["y2"]) // 2
        lbl = labeled_low[cy, cx]
        if lbl == 0:
            # fall back to core bbox
            ys, xs = np.where(labeled_low == 0)
            r = core
        else:
            ys, xs = np.where(labeled_low == lbl)
            # Clamp to core's rough zone (avoid merging into frame)
            pad = max(core["x2"] - core["x1"], core["y2"] - core["y1"])
            mask = (
                (xs >= max(0, core["x1"] - pad)) &
                (xs <= min(W - 1, core["x2"] + pad)) &
                (ys >= max(0, core["y1"] - pad)) &
                (ys <= min(H - 1, core["y2"] + pad))
            )
            xs, ys = xs[mask], ys[mask]
            if len(xs) == 0:
                xs_r, ys_r = np.array([core["x1"], core["x2"]]), np.array([core["y1"], core["y2"]])
            else:
                xs_r, ys_r = xs, ys
            r = dict(
                x1=max(0, int(xs_r.min()) - margin),
                y1=max(0, int(ys_r.min()) - margin),
                x2=min(W - 1, int(xs_r.max()) + margin),
                y2=min(H - 1, int(ys_r.max()) + margin),
            )
        r["core_ar"] = round(core["ar"], 2)
        results.append(r)

    return results, W, H


def p(v, total):
    return round(v / total * 100, 1)


def render(img_path, screens, out_path):
    img = Image.open(img_path).convert("RGB")
    draw = ImageDraw.Draw(img)
    W, H = img.size
    colors = ["#ff3333", "#33ff99", "#3399ff"]
    for i, r in enumerate(screens):
        c = colors[i % len(colors)]
        draw.rectangle([r["x1"], r["y1"], r["x2"], r["y2"]], outline=c, width=6)
        label = f"{i}: {p(r['x1'],W)}% {p(r['y1'],H)}% w={p(r['x2']-r['x1'],W)}% h={p(r['y2']-r['y1'],H)}%"
        draw.text((r["x1"] + 6, r["y1"] + 6), label, fill=c)
    img.save(out_path)
    print(f"  saved: {out_path}")


def analyse(path, n, out):
    screens, W, H = find_screens(path, n_screens=n)
    print(f"\n{path} ({W}x{H})  -- {n} screens found:")
    for i, r in enumerate(screens):
        l  = p(r["x1"], W)
        t  = p(r["y1"], H)
        rw = p(r["x2"] - r["x1"], W)
        rh = p(r["y2"] - r["y1"], H)
        ar = r["core_ar"]
        orient = "portrait" if ar < 0.85 else "landscape"
        print(f"  [{i}] {orient}  left={l}%  top={t}%  width={rw}%  height={rh}%   (core ar={ar})")
    render(path, screens, out)
    return screens, W, H


if __name__ == "__main__":
    analyse(DESKTOP_PATH, 3, "assets/_detect-desktop.png")
    analyse(MOBILE_PATH,  3, "assets/_detect-mobile.png")
