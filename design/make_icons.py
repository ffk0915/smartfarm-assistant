from PIL import Image, ImageDraw
import math

GREEN = (47, 82, 51, 255)
SOIL = (181, 101, 29, 255)
CREAM = (241, 239, 228, 255)
GOLD = (201, 154, 46, 255)

def rot(x, y, deg):
    a = math.radians(deg)
    return (x * math.cos(a) - y * math.sin(a), x * math.sin(a) + y * math.cos(a))

def leaf_points(anchor, angle_deg, length, width, flip=1):
    """Leaf growing from anchor, pointing 'up' before rotation (negative y), then rotated by angle_deg."""
    ax, ay = anchor
    local = [
        (0, 0),
        (flip * width * 0.55, -length * 0.18),
        (flip * width * 0.75, -length * 0.5),
        (flip * width * 0.35, -length * 0.82),
        (0, -length),
        (flip * -width * 0.18, -length * 0.55),
        (flip * -width * 0.08, -length * 0.22),
    ]
    pts = []
    for (x, y) in local:
        rx, ry = rot(x, y, angle_deg)
        pts.append((ax + rx, ay + ry))
    return pts

def build_master(maskable=False):
    """Always draw on a fixed 512x512 canvas, then callers resize down. Avoids
    coordinate-scale bugs when generating smaller icon sizes."""
    size = 512
    canvas = Image.new("RGBA", (size, size), GREEN)
    d = ImageDraw.Draw(canvas)

    scale = 0.60 if maskable else 1.0
    off_x = size * (1 - scale) / 2
    off_y = size * (1 - scale) / 2 + (size * 0.02 if maskable else 0)

    def P(x, y):
        return (off_x + x * scale, off_y + y * scale)

    # soil mound
    soil_pts = [P(0, 420), P(128, 393), P(256, 383), P(384, 393), P(512, 420), P(512, 512), P(0, 512)]
    d.polygon(soil_pts, fill=SOIL)

    # sun (drawn before leaves so leaf can overlap it slightly)
    r = int(24 * scale)
    cx, cy = P(378, 128)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=GOLD)

    # stem
    stem_top = P(256, 195)
    d.line([P(256, 400), stem_top], fill=CREAM, width=max(3, int(15 * scale)))

    # left leaf (gold) growing from stem tip, leaning left
    left_pts = leaf_points(stem_top, -35, 150 * scale, 95 * scale, flip=-1)
    d.polygon(left_pts, fill=GOLD)

    # right leaf (cream) growing from a bit lower on the stem, leaning right, longer
    stem_mid = P(256, 260)
    right_pts = leaf_points(stem_mid, 40, 175 * scale, 100 * scale, flip=1)
    d.polygon(right_pts, fill=CREAM)

    return canvas

def build(size, maskable=False):
    master = build_master(maskable=maskable)
    if size == 512:
        return master
    return master.resize((size, size), Image.LANCZOS)

out = "/home/claude/smart-farm-pwa/public/icons/"
build(192).save(out + "icon-192.png")
build(512).save(out + "icon-512.png")
build(512, maskable=True).save(out + "icon-maskable-512.png")
build(180).save(out + "apple-touch-icon.png")
build(32).save(out + "favicon-32.png")
print("icons generated")
