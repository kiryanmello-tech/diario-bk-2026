"""Vídeo de aniversário — motion puro em código (sem texto).
Gera trilha sintetizada + quadros 1080x1920 @30fps e junta com ffmpeg.
Uso: python3 render.py [saida.mp4]
"""
import math, random, subprocess, sys, wave, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "aniversario-kiryan.mp4")
W, H, FPS = 1080, 1920, 30
BPM = 128
B = 60 / BPM
END_BEAT = 37.5
T = END_BEAT * B
NF = int(T * FPS)

# ---------------------------------------------------------------- imagens
def load(name):
    return Image.open(os.path.join(HERE, name)).convert("RGB")

card_full = load("cartao-tonus.jpg")                     # 1500x2000
card = card_full.crop((35, 170, 1490, 1560)).convert("RGBA")
watch = load("relogio-calorias.jpg").convert("RGBA")      # 1276x891
heart = load("relogio-batimentos.jpg").convert("RGBA")    # 1276x951

def cover_bg(img, dark=0.45, blur=28, tint=None):
    img = img.convert("RGB")
    s = max(W / img.width, H / img.height) * 1.25
    im = img.resize((int(img.width * s), int(img.height * s)), Image.LANCZOS)
    x, y = (im.width - W) // 2, (im.height - H) // 2
    im = im.crop((x, y, x + W, y + H)).filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(im).astype(np.float32) * dark
    if tint is not None:
        a = a * 0.6 + np.array(tint, np.float32) * 0.4 * dark
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA")

BG_CARD = cover_bg(card, 0.55)
BG_WATCH = cover_bg(watch, 0.9, 40, tint=(40, 200, 160))
BG_HEART = cover_bg(heart, 0.9, 40, tint=(255, 40, 90))

# ---------------------------------------------------------------- utilidades
def ease_out(x):  x = min(max(x, 0), 1); return 1 - (1 - x) ** 3
def ease_in(x):   x = min(max(x, 0), 1); return x ** 3
def ease_back(x):
    x = min(max(x, 0), 1); c = 2.2
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2
def pulse(b, decay=6.0):
    """impulso que decai a partir de cada batida"""
    return math.exp(-decay * (b % 1.0))
def lerp(a, b, t): return a + (b - a) * t

def place(canvas, img, cx, cy, scale, angle_deg=0.0, src=None, alpha=1.0):
    """desenha img com centro de origem src em (cx,cy), escala e rotação"""
    if src is None: src = (img.width / 2, img.height / 2)
    th = math.radians(angle_deg); c, s = math.cos(th), math.sin(th)
    a, b_ = c / scale, s / scale
    d, e = -s / scale, c / scale
    cc = src[0] - a * cx - b_ * cy
    f = src[1] - d * cx - e * cy
    layer = img.transform((W, H), Image.AFFINE, (a, b_, cc, d, e, f),
                          resample=Image.BILINEAR, fillcolor=(0, 0, 0, 0))
    if alpha < 1.0:
        al = layer.getchannel("A").point(lambda v: int(v * alpha))
        layer.putalpha(al)
    canvas.alpha_composite(layer)

def rgb_split(arr, d):
    d = int(d)
    if d == 0: return arr
    out = arr.copy()
    out[:, :, 0] = np.roll(arr[:, :, 0], -d, axis=1)
    out[:, :, 2] = np.roll(arr[:, :, 2], d, axis=1)
    return out

def glitch(arr, amount, seed):
    rng = random.Random(seed); out = arr.copy()
    for _ in range(int(6 + 10 * amount)):
        y = rng.randrange(0, H - 10); h = rng.randrange(8, 120)
        out[y:y + h] = np.roll(out[y:y + h], rng.randint(-int(200 * amount), int(200 * amount)) or 1, axis=1)
    return out

def flash(arr, k, col=(255, 255, 255)):
    if k <= 0: return arr
    return (arr * (1 - k) + np.array(col, np.float32) * k).astype(np.uint8)

VIG = None
def vignette(arr, strength, col=(0, 0, 0)):
    global VIG
    if VIG is None:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
        VIG = np.clip((r - 0.55) / 0.85, 0, 1)[..., None]
    k = VIG * strength
    return (arr * (1 - k) + np.array(col, np.float32) * k).astype(np.uint8)

def rays(canvas, t, cols, n=14, alpha=60, cx=W / 2, cy=H / 2):
    d = ImageDraw.Draw(canvas, "RGBA"); R = 2400
    for i in range(n):
        a0 = t * 0.6 + i * 2 * math.pi / n; a1 = a0 + math.pi / n * 0.55
        c = cols[i % len(cols)]
        d.polygon([(cx, cy), (cx + R * math.cos(a0), cy + R * math.sin(a0)),
                   (cx + R * math.cos(a1), cy + R * math.sin(a1))], fill=c + (alpha,))

def rings(canvas, phase, cols, alpha=150):
    d = ImageDraw.Draw(canvas, "RGBA")
    for i in range(6):
        r = ((phase + i / 6) % 1.0) ** 2 * 1500
        w = int(4 + r / 40)
        d.ellipse([W / 2 - r, H / 2 - r, W / 2 + r, H / 2 + r],
                  outline=cols[i % len(cols)] + (int(alpha * (1 - r / 1500)),), width=w)

# ---------------------------------------------------------------- confete
PAL = [(255, 214, 40), (40, 120, 255), (90, 200, 255), (255, 70, 120),
       (255, 255, 255), (255, 140, 30), (60, 220, 160)]

class P:
    __slots__ = "t0 x y vx vy col sz spin ph kind life drag".split()

PARTS = []
def burst(beat, x, y, n, speed, ang=-90, spread=60, kind="rect", seed=0, life=3.5):
    rng = random.Random(seed)
    for _ in range(n):
        p = P(); p.t0 = beat * B; p.x, p.y = x, y
        a = math.radians(ang + rng.uniform(-spread, spread)); v = speed * rng.uniform(0.35, 1.0)
        p.vx, p.vy = v * math.cos(a), v * math.sin(a)
        p.col = rng.choice(PAL); p.sz = rng.uniform(10, 26); p.spin = rng.uniform(4, 14)
        p.ph = rng.uniform(0, 6.28); p.kind = kind if kind != "mix" else rng.choice(["rect", "rect", "dot", "heart"])
        p.life = life * rng.uniform(0.7, 1.2); p.drag = rng.uniform(1.2, 2.4)
        PARTS.append(p)

def rain(b0, b1, rate, seed=7):
    rng = random.Random(seed); t = b0
    while t < b1:
        p = P(); p.t0 = t * B; p.x = rng.uniform(-50, W + 50); p.y = -40
        p.vx = rng.uniform(-120, 120); p.vy = rng.uniform(150, 450)
        p.col = rng.choice(PAL); p.sz = rng.uniform(10, 22); p.spin = rng.uniform(3, 9)
        p.ph = rng.uniform(0, 6.28); p.kind = rng.choice(["rect", "rect", "dot", "heart"])
        p.life = 9; p.drag = 0.3
        PARTS.append(p); t += 1 / rate

def heart_poly(x, y, s, rot):
    pts = []
    for i in range(24):
        u = i / 24 * 2 * math.pi
        hx = 16 * math.sin(u) ** 3
        hy = -(13 * math.cos(u) - 5 * math.cos(2 * u) - 2 * math.cos(3 * u) - math.cos(4 * u))
        c, s_ = math.cos(rot), math.sin(rot)
        pts.append((x + (hx * c - hy * s_) * s / 16, y + (hx * s_ + hy * c) * s / 16))
    return pts

def draw_parts(canvas, t):
    d = ImageDraw.Draw(canvas, "RGBA"); G = 900
    for p in PARTS:
        dt = t - p.t0
        if dt < 0 or dt > p.life: continue
        k = p.drag; fx = (1 - math.exp(-k * dt)) / k
        x = p.x + p.vx * fx + 25 * math.sin(p.ph + dt * 3)
        y = p.y + p.vy * fx + 0.5 * G * dt * dt * 0.55
        if y > H + 60 or x < -80 or x > W + 80: continue
        fade = min(1.0, (p.life - dt) / 0.6); al = int(255 * max(fade, 0))
        rot = p.ph + p.spin * dt; s = p.sz
        if p.kind == "dot":
            r = s * 0.45; d.ellipse([x - r, y - r, x + r, y + r], fill=p.col + (al,))
        elif p.kind == "heart":
            d.polygon(heart_poly(x, y, s * 1.1, rot * 0.3), fill=p.col + (al,))
        else:
            w = s * 0.5 * abs(math.cos(rot * 1.3)) + 2; h = s * 0.28
            c, sn = math.cos(rot), math.sin(rot)
            pts = [(x + dx * c - dy * sn, y + dx * sn + dy * c) for dx, dy in ((-w, -h), (w, -h), (w, h), (-w, h))]
            d.polygon(pts, fill=p.col + (al,))

# bursts sincronizados com a trilha
burst(4, -20, H + 20, 160, 2600, ang=-65, spread=18, kind="mix", seed=1)
burst(4, W + 20, H + 20, 160, 2600, ang=-115, spread=18, kind="mix", seed=2)
burst(8, W / 2, H / 2, 140, 2200, ang=0, spread=180, kind="mix", seed=3)
burst(12, W / 2, H / 2, 90, 2400, ang=0, spread=180, kind="dot", seed=4, life=1.5)
burst(18, W / 2, H / 2, 90, 2400, ang=0, spread=180, kind="heart", seed=5, life=1.8)
for i, b in enumerate([26, 27, 28, 29]):
    burst(b, W * (0.2 + 0.6 * (i % 2)), H * 0.5, 70, 2300, ang=0, spread=180, kind="mix", seed=10 + i, life=2)
burst(30, -20, H + 20, 140, 2700, ang=-62, spread=16, kind="mix", seed=20, life=5)
burst(30, W + 20, H + 20, 140, 2700, ang=-118, spread=16, kind="mix", seed=21, life=5)
rain(30.5, 36.5, 22)
burst(34, W / 2, H * 0.45, 220, 2600, ang=0, spread=180, kind="heart", seed=30, life=4)

# ---------------------------------------------------------------- cenas
CARD_FIT = 1000 / card.width
WATCH_FIT = 1040 / watch.width
HEART_FIT = 1040 / heart.width

def sc_intro(b, t):
    cv = Image.new("RGBA", (W, H), (6, 6, 14, 255))
    rings(cv, b * 0.5 + ease_in(b / 4) * 2, [(255, 214, 40), (40, 120, 255), (255, 70, 120)], alpha=90 + int(100 * b / 4))
    # vislumbres estroboscópicos acelerando
    sub = 2 if b < 3 else 4
    if b >= 1:
        k = int(b * sub); ph = (b * sub) % 1.0
        if ph < 0.55:
            img = [card, watch, heart][k % 3]
            rng = random.Random(k)
            sc = (CARD_FIT if img is card else WATCH_FIT) * rng.uniform(0.9, 1.6) * (1 + 0.15 * ph)
            place(cv, img, W / 2 + rng.uniform(-120, 120), H / 2 + rng.uniform(-200, 200), sc,
                  rng.uniform(-25, 25), alpha=min(1, 0.35 + b / 5))
    # sugada final
    if b > 3.4:
        z = ease_in((b - 3.4) / 0.6)
        place(cv, card, W / 2, H / 2, CARD_FIT * lerp(0.05, 0.6, z), 720 * (1 - z), alpha=z)
    arr = np.asarray(cv.convert("RGB")).astype(np.float32)
    arr = rgb_split(arr, 18 * pulse(b * sub, 5)).astype(np.uint8)
    arr = flash(arr, ease_in((b - 3.7) / 0.3) if b > 3.7 else 0)
    return arr

def sc_card(b, t):
    u = b - 4
    cv = BG_CARD.copy()
    rays(cv, t, [(255, 214, 40), (40, 120, 255)], alpha=int(40 + 50 * pulse(u)))
    slam = ease_back(u / 0.35)
    s = CARD_FIT * lerp(3.2, 1.0, slam) * (1 + 0.07 * pulse(u, 7))
    ang = 5 * math.sin(u * math.pi) * (1 if int(u) % 2 else -1) * (0.3 + 0.7 * pulse(u, 3))
    shake = 40 * math.exp(-3 * u) + 10 * pulse(u, 9)
    rng = random.Random(int(t * FPS))
    cx, cy = W / 2 + rng.uniform(-shake, shake), H / 2 + rng.uniform(-shake, shake)
    out = 0.0
    if u > 7.4:  # chicote giratório de saída
        out = ease_in((u - 7.4) / 0.6); ang += 540 * out; s *= 1 + 2.5 * out
    place(cv, card, cx, cy, s, ang)
    draw_parts(cv, t)
    arr = np.asarray(cv.convert("RGB")).astype(np.float32)
    arr = rgb_split(arr, 26 * pulse(u, 5) + 60 * out)
    arr = vignette(arr, 0.7)
    arr = flash(arr, max(0, 1 - u / 0.3) * 0.9 + 0.25 * pulse(u, 14) * (u > 1))
    return arr

def sc_watch(b, t):
    u = b - 12
    cv = BG_WATCH.copy()
    rings(cv, u * 0.5, [(40, 220, 170), (255, 120, 60), (255, 255, 255)], alpha=70)
    enter = ease_out(u / 0.5)
    focus = (500, 252)
    steps = [1.0, 1.0, 1.25, 1.6, 2.1, 2.7]
    i = min(int(u), 5); z0 = steps[max(i - 1, 0)] if i else 1.0
    z = lerp(z0, steps[i], ease_back(min((u % 1) / 0.25, 1)))
    fx = lerp(watch.width / 2, focus[0], min(u / 4, 1)); fy = lerp(watch.height / 2, focus[1], min(u / 4, 1))
    s = WATCH_FIT * z * lerp(0.3, 1, enter)
    ang = -120 * (1 - enter) + 3 * math.sin(u * 3.1)
    if u > 5.4:  # mergulho dentro do zero
        k = ease_in((u - 5.4) / 0.6); s *= lerp(1, 14, k); fx, fy = lerp(fx, focus[0], k), lerp(fy, focus[1], k)
    rng = random.Random(int(t * FPS)); sh = 22 * pulse(u, 8)
    place(cv, watch, W / 2 + rng.uniform(-sh, sh), H / 2 + rng.uniform(-sh, sh), s, ang, src=(fx, fy))
    draw_parts(cv, t)
    arr = np.asarray(cv.convert("RGB"))
    if (u * 2) % 1 < 0.18 and u > 0.5:
        arr = glitch(arr, 1.0, int(u * 2))
    arr = rgb_split(arr.astype(np.float32), 30 * pulse(u, 6))
    if 3.0 <= u < 3.07 or 4.5 <= u < 4.57:
        arr = 255 - arr.astype(np.uint8)
    arr = vignette(np.asarray(arr, np.float32), 0.6)
    if u > 5.75: arr = flash(arr, ease_in((u - 5.75) / 0.25) * 0.8, (40, 0, 20))
    return arr

def sc_heart(b, t):
    u = b - 18
    cv = BG_HEART.copy()
    enter = ease_out(u / 0.6)
    thump = 0.06 * pulse(u, 10) + 0.035 * pulse(u - 0.25, 10) * ((u % 1) > 0.25)
    s = HEART_FIT * lerp(7, 1.0, enter) * (1 + thump) * (1 + 0.25 * ease_in((u - 7.3) / 0.7) if u > 7.3 else 1)
    # revelação da linha
    rev = lerp(115, 1170, min(max((u - 0.5) / 5.5, 0), 1))
    img = heart.copy()
    a = np.asarray(img).copy()
    a[:, int(rev):, :3] = (a[:, int(rev):, :3] * 0.18).astype(np.uint8)
    img = Image.fromarray(a, "RGBA")
    dr = ImageDraw.Draw(img, "RGBA")
    if u < 6.2:
        dr.rectangle([rev - 3, 290, rev + 3, 840], fill=(255, 80, 120, 230))
        dr.ellipse([rev - 16, 290, rev + 16, 322], fill=(255, 255, 255, 200))
    ang = 2.5 * math.sin(u * 2.2)
    spin = 0
    if u > 7.3: spin = 360 * ease_in((u - 7.3) / 0.7)
    peak = 5.8 <= u < 6.4
    rng = random.Random(int(t * FPS)); sh = 14 * pulse(u, 8) + (50 if peak else 0) * (1 - (u - 5.8) / 0.6 if peak else 0)
    place(cv, img, W / 2 + rng.uniform(-sh, sh), H / 2 + rng.uniform(-sh, sh), s, ang + spin)
    draw_parts(cv, t)
    arr = np.asarray(cv.convert("RGB")).astype(np.float32)
    arr = vignette(arr, 0.5 + 0.5 * pulse(u, 6), (120, 0, 30))
    arr = rgb_split(arr.astype(np.float32), 16 * pulse(u, 7) + (40 if peak else 0))
    if peak: arr = flash(np.asarray(arr), 0.6 * max(0, 1 - (u - 5.8) / 0.4), (255, 60, 110))
    arr = flash(np.asarray(arr, np.float32), max(0, 1 - u / 0.2) * 0.7)
    return np.asarray(arr)

MONT_FX = ["kaleido", "grid", "invert", "flip", "zoom", "swap", "kaleido4", "split"]

def sc_montage(b, t):
    u = b - 26
    k = int(u * 2); ph = (u * 2) % 1.0
    rng = random.Random(100 + k)
    img = [card, watch, heart][k % 3]
    bg = [BG_CARD, BG_WATCH, BG_HEART][k % 3]
    fx = MONT_FX[k % len(MONT_FX)]
    cv = bg.copy()
    rays(cv, t * 3, [(255, 214, 40), (255, 70, 120), (40, 120, 255)], n=10, alpha=55)
    fit = CARD_FIT if img is card else WATCH_FIT
    s = fit * (1.15 + 0.25 * ease_out(ph)) * (2.4 if fx == "zoom" else 1)
    src = None
    if fx == "zoom": src = (rng.uniform(0.3, 0.7) * img.width, rng.uniform(0.3, 0.7) * img.height)
    ang = rng.uniform(-14, 14) + (180 if fx == "flip" else 0) + 30 * ph * rng.choice([-1, 1])
    if fx == "grid":
        for gy in range(3):
            for gx in range(3):
                place(cv, img, W * (gx + 0.5) / 3, H * (gy + 0.5) / 3, fit / 3 * 1.05 * (1 + 0.2 * pulse(ph, 5)),
                      ((gx + gy) % 2 * 2 - 1) * 12 * ph)
    else:
        place(cv, img, W / 2, H / 2, s, ang, src=src)
    draw_parts(cv, t)
    arr = np.asarray(cv.convert("RGB")).copy()
    if fx == "kaleido":
        arr[:, W // 2:] = arr[:, :W // 2][:, ::-1][:, :W - W // 2]
    elif fx == "kaleido4":
        arr[:, W // 2:] = arr[:, :W // 2][:, ::-1][:, :W - W // 2]
        arr[H // 2:] = arr[:H // 2][::-1][:H - H // 2]
    elif fx == "invert":
        arr = 255 - arr
    elif fx == "swap":
        arr = arr[:, :, ::-1].copy()
    elif fx == "split":
        arr = glitch(arr, 1.5, k)
    arr = rgb_split(arr.astype(np.float32), 22 * pulse(ph, 4))
    arr = vignette(np.asarray(arr), 0.6)
    arr = flash(arr, 0.75 * max(0, 1 - ph / 0.25) if k % 2 == 0 else 0)
    if u > 3.6: arr = flash(arr, ease_in((u - 3.6) / 0.4))
    return arr

def sc_outro(b, t):
    u = b - 30
    cv = BG_CARD.copy()
    rays(cv, t * 0.4, [(255, 214, 40), (90, 200, 255)], n=18, alpha=int(35 + 25 * math.sin(u * 2)))
    s = CARD_FIT * lerp(0.86, 1.02, ease_out(u / 6)) * (1 + 0.05 * pulse(u - 4, 4) * (u > 4))
    ang = 2.0 * math.sin(u * 1.6)
    place(cv, card, W / 2, H / 2 + 10 * math.sin(u * 1.3), s, ang)
    draw_parts(cv, t)
    arr = np.asarray(cv.convert("RGB")).astype(np.float32)
    arr = vignette(arr, 0.75)
    arr = flash(arr, max(0, 1 - u / 0.4))
    if 4 <= u < 4.6: arr = flash(arr, 0.55 * (1 - (u - 4) / 0.6), (255, 200, 220))
    if u > 6.4: arr = flash(arr, ease_out((u - 6.4) / 1.0), (0, 0, 0))
    return arr

def frame_at(t):
    b = t / B
    if b < 4: return sc_intro(b, t)
    if b < 12: return sc_card(b, t)
    if b < 18: return sc_watch(b, t)
    if b < 26: return sc_heart(b, t)
    if b < 30: return sc_montage(b, t)
    return sc_outro(b, t)

def blurry(b):
    return (11.4 < b < 12.3) or (17.4 < b < 18.5) or (25.3 < b < 26.1) or (3.4 < b < 4)

# ---------------------------------------------------------------- trilha
SR = 44100
N = int((T + 1.5) * SR)
mix = np.zeros(N, np.float32)
rs = np.random.RandomState(1)

def mf(m): return 440 * 2 ** ((m - 69) / 12)
def at(beat): return int(beat * B * SR)
def add(sig, beat, g=1.0):
    i = at(beat); j = min(N, i + len(sig))
    if i < N: mix[i:j] += sig[:j - i] * g
def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(t / max(a, 1e-4), 1) * np.exp(-t / d)
def lp(x, k=8):
    return np.convolve(x, np.ones(k) / k, mode="same").astype(np.float32)

def kick(g=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 7) + 0.3 * rs.randn(n) * np.exp(-t * 300)).astype(np.float32) * g
def clap():
    n = int(0.25 * SR); t = np.arange(n) / SR; x = np.diff(rs.randn(n + 1)).astype(np.float32)
    e = np.exp(-t * 22) + sum(np.exp(-(t - d) * 120) * (t >= d) for d in (0, 0.012, 0.024))
    return x * e * 0.25
def hat(d=0.04):
    n = int(0.12 * SR); t = np.arange(n) / SR
    return np.diff(np.diff(rs.randn(n + 2))).astype(np.float32) * np.exp(-t / d) * 0.06
def saw(f, n, det=(0,)):
    t = np.arange(n) / SR
    return sum(2 * ((t * f * 2 ** (c / 1200) + i * 0.13) % 1) - 1 for i, c in enumerate(det)).astype(np.float32) / len(det)
def crash():
    n = int(2.5 * SR); t = np.arange(n) / SR
    return np.diff(rs.randn(n + 1)).astype(np.float32) * np.exp(-t * 1.6) * 0.22
def whoosh(dur):
    n = int(dur * SR); t = np.arange(n) / SR; x = rs.randn(n).astype(np.float32)
    k = (t / dur) ** 2
    return (lp(x, 24) * (1 - k) + x * k) * k * 0.45
def bell(f, dur=1.6):
    n = int(dur * SR); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6)
         + 0.25 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 12))
    return (s * np.exp(-t * 2.2) * np.minimum(t / 0.003, 1)).astype(np.float32)

CH = {"C": [60, 64, 67, 72], "G": [59, 62, 67, 71], "Am": [57, 60, 64, 69], "F": [57, 60, 65, 69]}
BASS = {"C": 36, "G": 43, "Am": 45, "F": 41}
prog = [(4, "C"), (8, "G"), (12, "Am"), (16, "F"), (20, "C"), (24, "G"), (28, "F"), (30, "C"), (32, "F"), (34, "C")]
def chord(b):
    c = "C"
    for s, n in prog:
        if b >= s: c = n
    return c

# intro: pad crescendo, riser, rufada
n = at(4); t = np.arange(n) / SR
pad = sum(saw(mf(m), n, (-9, 0, 9)) for m in CH["C"]) / 4
mix[:n] += lp(pad, 30) * (t / t[-1]) ** 2 * 0.35
mix[:n] += np.sin(2 * np.pi * np.cumsum(200 + 1000 * (t / t[-1]) ** 3) / SR).astype(np.float32) * (t / t[-1]) ** 2 * 0.12
mix[:n] += rs.randn(n).astype(np.float32) * (t / t[-1]) ** 3 * 0.12
for b in np.arange(1, 4, 0.5): add(clap(), b, 0.4 + 0.1 * b)
for b in np.arange(3, 4, 0.125): add(clap(), b, 0.9)
add(whoosh(0.6 * B), 3.4)

# drop 4..30
for b in range(4, 30):
    add(kick(), b)
    if b % 2 == 1: add(clap(), b)
    add(hat(0.05), b + 0.5, 1.4)
    for q in (0.25, 0.75): add(hat(0.02), b + q, 0.7)
    c = chord(b)
    for e in (0.5,):
        nn = int(B * 0.45 * SR)
        bs = saw(mf(BASS[c]), nn, (-6, 6))
        add(lp(bs, 14) * env(nn, 0.005, 0.12) * 0.55, b + e)
    # stab sidechain
    nn = int(B * SR); tt = np.arange(nn) / SR
    duck = np.minimum(tt / (B * 0.45), 1) ** 1.5
    st = sum(saw(mf(m), nn, (-12, 0, 12)) for m in CH[c]) / 4
    add(lp(st, 6) * duck * 0.22, b)
    # arpejo 16
    notes = CH[c] + [CH[c][1] + 12]
    up = 12 if b >= 26 else 0
    for i in range(4):
        m = notes[(b * 4 + i) % len(notes)] + 12 + up
        nn = int(B / 4 * SR); tt = np.arange(nn) / SR
        sq = np.sign(np.sin(2 * np.pi * mf(m) * tt)).astype(np.float32)
        add(lp(sq, 4) * np.exp(-tt * 18) * 0.09, b + i / 4)
for b in (4, 12, 18, 26): add(crash(), b); add(kick(1.4), b)
for b in (11.4, 17.4, 25.3): add(whoosh(0.6 * B), b)
for b in np.arange(29, 30, 0.125): add(clap(), b, 0.6 + (b - 29) * 0.6)
add(whoosh(B), 29)

# outro: pad + caixinha de música "parabéns" (melodia tradicional, domínio público)
add(crash(), 30, 0.8); add(kick(1.3), 30)
for s, e in ((30, 32), (32, 34), (34, 38)):
    c = chord(s); nn = at(e) - at(s); tt = np.arange(nn) / SR
    pd = sum(saw(mf(m), nn, (-8, 0, 8)) for m in CH[c]) / 4
    add(lp(pd, 40) * np.minimum(tt / 0.3, 1) * np.minimum((nn - np.arange(nn)) / (0.3 * SR), 1) * 0.22, s)
mel = [(67, 0), (67, 0.75), (69, 1), (67, 2), (72, 3), (71, 4)]
for m, o in mel:
    add(bell(mf(m + 12)) * 0.32, 30 + o); add(bell(mf(m)) * 0.18, 30 + o)
add(bell(mf(72 + 12), 3) * 0.3, 36); add(bell(mf(60 + 12), 3) * 0.2, 36)
add(kick(0.7), 34); add(crash(), 34, 0.5)
for b in (31, 32, 33, 35): add(hat(0.03), b, 0.6)

mix = np.tanh(mix * 1.3)
mix = mix / np.max(np.abs(mix)) * 0.89
fade_n = int(1.2 * SR); L = int(T * SR) + int(0.3 * SR)
mix = mix[:L]; mix[-fade_n:] *= np.linspace(1, 0, fade_n)
stereo = np.stack([mix, np.roll(mix, 220) * 0.92 + mix * 0.08], 1)
wav_path = os.path.join(HERE, "_trilha.wav")
with wave.open(wav_path, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((stereo * 32767).astype(np.int16).tobytes())

# ---------------------------------------------------------------- render
if __name__ == "__main__":
    only = os.environ.get("FRAMES")  # ex: FRAMES=10,100,200 para prévias
    if only:
        for f in map(int, only.split(",")):
            Image.fromarray(np.asarray(frame_at(f / FPS), np.uint8)).save(os.path.join(HERE, f"_prev_{f:04d}.jpg"), quality=80)
        sys.exit()
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                           "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", wav_path,
                           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
                           "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT],
                          stdin=subprocess.PIPE)
    for f in range(NF):
        t = f / FPS
        if blurry(t / B):
            acc = sum(np.asarray(frame_at(t + (k - 1.5) / (FPS * 4)), np.float32) for k in range(4)) / 4
            fr = acc.astype(np.uint8)
        else:
            fr = np.asarray(frame_at(t), np.uint8)
        ff.stdin.write(np.ascontiguousarray(fr).tobytes())
        if f % 60 == 0: print(f"{f}/{NF}", flush=True)
    ff.stdin.close(); ff.wait()
    os.remove(wav_path)
    print("ok", OUT)
