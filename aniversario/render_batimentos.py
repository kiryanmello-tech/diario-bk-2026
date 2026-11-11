"""Aniversário v2 — "o coração do treino".
A curva REAL de batimentos do relógio (53 min) é comprimida no vídeo e dirige tudo:
cada batida (na frequência real daquele minuto) dá o pulso, o monitor de ECG varre a tela
e revela a próxima foto, a cor/calor da imagem segue a intensidade, e o pico de 163 bpm
congela o tempo e explode no cartão.

Uso:
  python3 render_batimentos.py                    -> vídeo com efeitos sonoros (batimento/impactos)
  MUSIC=musica.mp3 python3 render_batimentos.py   -> mistura a música por baixo dos efeitos
  FRAMES=30,200,500 python3 render_batimentos.py  -> só prévias
"""
import math, os, random, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "aniversario-batimentos.mp4")
W, H, FPS = 1080, 1920, 30

# ------------------------------------------------------------------ curva real
def extract_hr():
    a = np.asarray(Image.open(os.path.join(HERE, "relogio-batimentos.jpg")).convert("RGB")).astype(int)
    m = (a[..., 0] > 200) & (a[..., 1] < 130) & (a[..., 2] > 50)
    mins, bpm = [], []
    for x in range(203, 1160):
        col = np.where(m[280:850, x])[0]
        if len(col):
            mins.append((x - 205) * 50 / 898)
            bpm.append(173 - (280 + col.min() - 315) * 104 / 525)
    mins, bpm = np.array(mins), np.array(bpm)
    k = np.ones(5) / 5
    bpm = np.convolve(np.pad(bpm, 2, mode="edge"), k, mode="valid")
    return mins, bpm

HR_MIN, HR_BPM = extract_hr()
PEAK_MIN = float(HR_MIN[np.argmax(HR_BPM)])
def hr_at_min(m): return float(np.interp(m, HR_MIN, HR_BPM))

# linha do tempo (s)
T_INTRO = 3.0
T_PEAK = 24.6                     # pico de 163 bpm
T_FREEZE = 0.75
T_CARD = T_PEAK + T_FREEZE        # explosão
T_END = T_CARD + 7.2
T_TOTAL = T_END + 0.6
NF = int(T_TOTAL * FPS)

def workout_min(t):
    if t < T_INTRO: return 0.0
    if t < T_PEAK: return (t - T_INTRO) / (T_PEAK - T_INTRO) * PEAK_MIN
    if t < T_CARD: return PEAK_MIN
    return min(PEAK_MIN + (t - T_CARD) / 2.5 * (HR_MIN[-1] - PEAK_MIN), HR_MIN[-1])

def hr(t):
    if t < T_INTRO: return 69 + 6 * t / T_INTRO
    if t < T_CARD: return hr_at_min(workout_min(t))
    base = hr_at_min(workout_min(t))
    return base - max(0, t - T_CARD - 2.5) * 6       # desaquecimento

# fase cardíaca integrada (batidas acumuladas) na frequência real
DT = 1 / (FPS * 8)
_ts = np.arange(0, T_TOTAL + 1, DT)
_rate = np.array([0 if T_PEAK <= t < T_CARD else hr(t) / 60 for t in _ts])
_phi = np.concatenate([[0], np.cumsum(_rate[:-1] * DT)])
BEATS_PER_SWEEP = 3
_off = BEATS_PER_SWEEP * math.ceil(np.interp(T_INTRO, _ts, _phi) / BEATS_PER_SWEEP) - np.interp(T_INTRO, _ts, _phi)
_phi = _phi + _off
def phi(t): return float(np.interp(t, _ts, _phi))
S0 = int(round(phi(T_INTRO) / BEATS_PER_SWEEP))

# instantes das batidas (pico R = fase .25)
BEAT_TIMES = []
for n in range(int(_phi[-1]) + 1):
    target = n + 0.25
    i = np.searchsorted(_phi, target)
    if 0 < i < len(_ts) and _ts[i] < T_TOTAL: BEAT_TIMES.append(float(_ts[i]))

def since_beat(t):
    i = np.searchsorted(BEAT_TIMES, t) - 1
    return t - BEAT_TIMES[i] if i >= 0 else 9.0

# ------------------------------------------------------------------ imagens
def L(n): return Image.open(os.path.join(HERE, n)).convert("RGB")
IM = {
    "selfie": L("treino-selfie-bike.jpg"), "espelho": L("treino-espelho-neon.jpg"),
    "bikes": L("treino-bikes.jpg"), "dupla": L("treino-dupla-bike.jpg"),
    "pesos": L("treino-pesos.jpg"), "relogio": L("relogio-calorias.jpg"),
    "grafico": L("relogio-batimentos.jpg"),
}
card = L("cartao-tonus.jpg").crop((35, 170, 1490, 1560))
# ordem dos cortes (cada varredura do ECG revela a próxima); foco (fx,fy) relativo
SEQ = [("selfie", .55, .45), ("espelho", .3, .35), ("bikes", .3, .3), ("dupla", .55, .5),
       ("pesos", .45, .4), ("relogio", .5, .3), ("espelho", .55, .55), ("grafico", .5, .55),
       ("bikes", .65, .6), ("selfie", .62, .38), ("dupla", .35, .4), ("pesos", .45, .65),
       ("relogio", .4, .28), ("espelho", .2, .2), ("bikes", .25, .25), ("dupla", .6, .45),
       ("selfie", .35, .3), ("grafico", .85, .45), ("pesos", .4, .3), ("espelho", .3, .3)]

def cover(img, zoom, fx, fy, t_drift=0.0):
    """recorta img cobrindo W×H com zoom em torno do foco (fx,fy)"""
    s = max(W / img.width, H / img.height) * zoom
    cw, ch = W / s, H / s
    cx = min(max(fx * img.width + 40 * math.sin(t_drift) / s, cw / 2), img.width - cw / 2)
    cy = min(max(fy * img.height + 40 * math.cos(t_drift * 0.7) / s, ch / 2), img.height - ch / 2)
    box = (cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2)
    return img.resize((W, H), Image.BILINEAR, box=box)

LAND = {"relogio", "grafico"}
def frame_photo(key, fx, fy, t, punch):
    img = IM[key]
    if key in LAND:   # paisagem: fundo desfocado + imagem inteira por cima
        bg = cover(img, 1.6, fx, fy, t).filter(ImageFilter.GaussianBlur(25))
        bg = Image.eval(bg, lambda v: int(v * 0.45))
        sc = W * (1.0 + 0.35 * min(1, (t % 3) / 3)) * (1 + punch * 0.06) / img.width
        fg = img.resize((int(img.width * sc), int(img.height * sc)), Image.BILINEAR)
        bg.paste(fg, ((W - fg.width) // 2 + int((0.5 - fx) * 300), (H - fg.height) // 2))
        return bg
    return cover(img, 1.12 + 0.05 * math.sin(t * 0.8) + punch * 0.07, fx, fy, t)

# ------------------------------------------------------------------ cor por intensidade
def hr_color(b):
    k = min(max((b - 70) / 93, 0), 1)
    stops = [(0, (40, 210, 255)), (0.5, (255, 50, 210)), (0.8, (255, 40, 90)), (1, (255, 70, 30))]
    for (k0, c0), (k1, c1) in zip(stops, stops[1:]):
        if k <= k1:
            u = (k - k0) / (k1 - k0)
            return tuple(int(c0[i] + (c1[i] - c0[i]) * u) for i in range(3))
    return stops[-1][1]

def ecg(p):
    """forma PQRST para fase p em [0,1)"""
    p = p % 1.0
    v = 0.14 * math.exp(-((p - 0.08) / 0.03) ** 2)
    v -= 0.22 * math.exp(-((p - 0.19) / 0.018) ** 2)
    v += 1.00 * math.exp(-((p - 0.25) / 0.022) ** 2)
    v -= 0.42 * math.exp(-((p - 0.31) / 0.02) ** 2)
    v += 0.26 * math.exp(-((p - 0.50) / 0.05) ** 2)
    return v

# ------------------------------------------------------------------ efeitos
YY, XX = np.mgrid[0:H, 0:W]
R_VIG = np.sqrt(((XX - W / 2) / (W / 2)) ** 2 + ((YY - H / 2) / (H / 2)) ** 2).astype(np.float32)
VIG = np.clip((R_VIG - 0.5) / 0.9, 0, 1)[..., None]
GRAIN = [np.random.RandomState(i).normal(0, 7, (H // 2, W // 2, 1)).astype(np.float32) for i in range(6)]

def bloom(arr, k=0.55):
    small = Image.fromarray(arr.astype(np.uint8)).resize((W // 4, H // 4), Image.BILINEAR)
    a = np.asarray(small).astype(np.float32)
    a = np.clip(a - 150, 0, 255) * 1.6
    b = Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(10)).resize((W, H), Image.BILINEAR)
    return arr + np.asarray(b, np.float32) * k

def rgb_split(arr, d):
    d = int(d)
    if d <= 0: return arr
    out = arr.copy()
    out[:, :, 0] = np.roll(arr[:, :, 0], -d, 1)
    out[:, :, 2] = np.roll(arr[:, :, 2], d, 1)
    return out

def heat_haze(arr, amp, t):
    if amp < 0.5: return arr
    rows = np.arange(H)
    shift = (amp * np.sin(rows * 0.035 + t * 9) + amp * 0.5 * np.sin(rows * 0.11 - t * 13)).astype(int)
    idx = (np.arange(W)[None, :] + shift[:, None]) % W
    return np.take_along_axis(arr, idx[..., None].repeat(3, 2), 1)

def grade(arr, b):
    c = np.array(hr_color(b), np.float32)
    k = 0.12 + 0.18 * min(max((b - 70) / 93, 0), 1)
    lum = arr.mean(2, keepdims=True)
    arr = arr * (1 - k) + (lum / 255) * c * k * 1.6
    arr = (arr - 128) * 1.12 + 128
    return arr

# ------------------------------------------------------------------ desenho de linhas com brilho
def glow_lines(canvas_arr, polys, col, width=6, glow=26, alpha=1.0):
    """polys: lista de listas de pontos. desenha neon (brilho borrado + núcleo branco)."""
    lay = Image.new("L", (W // 2, H // 2), 0); d = ImageDraw.Draw(lay)
    core = Image.new("L", (W, H), 0); dc = ImageDraw.Draw(core)
    for pts in polys:
        if len(pts) < 2: continue
        d.line([(x / 2, y / 2) for x, y in pts], fill=255, width=max(2, width), joint="curve")
        dc.line(pts, fill=255, width=width, joint="curve")
    g = np.asarray(lay.filter(ImageFilter.GaussianBlur(glow / 2)).resize((W, H), Image.BILINEAR), np.float32)[..., None] / 255
    c = np.asarray(core, np.float32)[..., None] / 255
    colv = np.array(col, np.float32)
    canvas_arr = canvas_arr + g * colv * 2.2 * alpha
    canvas_arr = canvas_arr * (1 - c * alpha) + (colv * 0.35 + 255 * 0.65) * c * alpha
    return canvas_arr

def ecg_polys(t, y0, amp, sweep_w=W):
    """monitor: varredura esquerda→direita, BEATS_PER_SWEEP batidas por tela"""
    ph = phi(t) / BEATS_PER_SWEEP
    head = (ph % 1.0) * sweep_w
    s = math.floor(ph)
    new, old = [], []
    for x in range(0, sweep_w + 1, 3):
        if x <= head:
            v = ecg((s + x / sweep_w) * BEATS_PER_SWEEP)
            new.append((x, y0 - amp * v))
        elif x > head + 40:
            v = ecg((s - 1 + x / sweep_w) * BEATS_PER_SWEEP)
            old.append((x, y0 - amp * v))
    return new, old, head

def heart_xy(u):
    return 16 * math.sin(u) ** 3, -(13 * math.cos(u) - 5 * math.cos(2 * u) - 2 * math.cos(3 * u) - math.cos(4 * u))

# partículas do coração
rng = np.random.RandomState(3)
NP_ = 900
_u = rng.uniform(0, 2 * math.pi, NP_)
_r = np.sqrt(rng.uniform(0.15, 1, NP_))
HP = np.array([heart_xy(u) for u in _u]) * _r[:, None]
HP_SEED = rng.uniform(0, 6.28, NP_)
HP_VEL = rng.normal(0, 1, (NP_, 2)) * 1500 + np.array([0, -500])
HP_COL = [(255, 214, 40), (40, 120, 255), (90, 200, 255), (255, 70, 120), (255, 255, 255), (255, 40, 90)]

def draw_heart_particles(img, t, cx, cy, scale, form=1.0, explode_t=None, alpha=255, col=None):
    d = ImageDraw.Draw(img, "RGBA")
    sb = since_beat(t)
    pul = 1 + 0.22 * math.exp(-sb * 9) + 0.08 * math.exp(-max(sb - 0.17, 0) * 9) * (sb > 0.17)
    for i in range(NP_):
        hx, hy = HP[i]
        sx = rng_scatter[i, 0] * (1 - form); sy = rng_scatter[i, 1] * (1 - form)
        x = cx + (hx * scale * pul) * form + sx + 3 * math.sin(t * 3 + HP_SEED[i])
        y = cy + (hy * scale * pul) * form + sy + 3 * math.cos(t * 2.6 + HP_SEED[i])
        if explode_t is not None and explode_t > 0:
            e = explode_t
            x += HP_VEL[i, 0] * e * 0.8; y += HP_VEL[i, 1] * e * 0.8 + 900 * e * e
        c = col or HP_COL[i % len(HP_COL)]
        r = 4.5 + 2.5 * (i % 3)
        d.ellipse([x - r, y - r, x + r, y + r], fill=c + (alpha,))

rng_scatter = np.random.RandomState(9).uniform(-1, 1, (NP_, 2)) * np.array([W, H])

# confete pós-explosão
CONF = []
def mk_confetti(t0, n, seed):
    r = random.Random(seed)
    for _ in range(n):
        a = r.uniform(0, 2 * math.pi); v = r.uniform(600, 2600)
        CONF.append((t0, W / 2, H * 0.45, v * math.cos(a), v * math.sin(a) - 600, r.choice(HP_COL),
                     r.uniform(10, 24), r.uniform(4, 12), r.uniform(0, 6.28), r.choice([0, 0, 1, 2])))
def rain_confetti(t0, t1, rate, seed):
    r = random.Random(seed); t = t0
    while t < t1:
        CONF.append((t, r.uniform(0, W), -30, r.uniform(-80, 80), r.uniform(100, 300), r.choice(HP_COL),
                     r.uniform(10, 20), r.uniform(3, 8), r.uniform(0, 6.28), r.choice([0, 0, 1, 2])))
        t += 1 / rate
mk_confetti(T_CARD, 380, 1)
rain_confetti(T_CARD + 1.0, T_END, 18, 2)

def draw_confetti(img, t):
    d = ImageDraw.Draw(img, "RGBA")
    for (t0, x0, y0, vx, vy, col, sz, spin, ph, kind) in CONF:
        dt = t - t0
        if dt < 0 or dt > 7: continue
        f = (1 - math.exp(-1.6 * dt)) / 1.6
        x = x0 + vx * f + 20 * math.sin(ph + dt * 3); y = y0 + vy * f + 260 * dt * dt
        if y > H + 40: continue
        rot = ph + spin * dt
        if kind == 1:
            r = sz * 0.4; d.ellipse([x - r, y - r, x + r, y + r], fill=col + (255,))
        elif kind == 2:
            pts = [(x + hx * sz / 26 * math.cos(rot * .3) , y + hy * sz / 26) for hx, hy in (heart_xy(u / 12 * 6.283) for u in range(12))]
            d.polygon(pts, fill=col + (255,))
        else:
            w = sz * 0.5 * abs(math.cos(rot)) + 2; h = sz * 0.25; c, s = math.cos(rot), math.sin(rot)
            d.polygon([(x + dx * c - dy * s, y + dx * s + dy * c) for dx, dy in ((-w, -h), (w, -h), (w, h), (-w, h))], fill=col + (255,))

# ------------------------------------------------------------------ curva macro (rodapé)
def macro_polys(m_now, y_top, y_bot, x0=70, x1=W - 70):
    pts = []
    for m, b in zip(HR_MIN[::3], HR_BPM[::3]):
        if m > m_now: break
        x = x0 + (x1 - x0) * m / HR_MIN[-1]
        y = y_bot - (y_bot - y_top) * (b - 65) / (170 - 65)
        pts.append((x, y))
    return pts

# ------------------------------------------------------------------ cenas
def scene_workout(t):
    b = hr(t); sb = since_beat(t)
    punch = math.exp(-sb * 8)
    ph = phi(t) / BEATS_PER_SWEEP
    s = math.floor(ph); head = (ph % 1.0) * W
    i_new, i_old = s - S0, s - S0 - 1
    def photo(i):
        if i < 0: return Image.new("RGB", (W, H), (4, 4, 10))
        k, fx, fy = SEQ[i % len(SEQ)]
        return frame_photo(k, fx, fy, t + i * 1.7, punch)
    new = np.asarray(photo(i_new), np.float32)
    old = np.asarray(photo(i_old), np.float32)
    hx = int(head)
    arr = old.copy()
    arr[:, :hx] = new[:, :hx]
    # borda da varredura: faixa luminosa
    col = np.array(hr_color(b), np.float32)
    band = np.clip(1 - np.abs(np.arange(W) - head) / 60, 0, 1)[None, :, None]
    arr = arr + band * col * 0.9
    arr = grade(arr, b)
    # coração de partículas na intro, desfaz quando a 1ª foto entra
    pil = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    if t < T_INTRO + 1.2:
        form = 1 - (1 - min(1, t / 1.1)) ** 3
        a = 255 if t < T_INTRO + 0.2 else int(255 * max(0, 1 - (t - T_INTRO - 0.2) / 1.0))
        draw_heart_particles(pil, t, W / 2, H * 0.40, 19, form=form, alpha=a,
                             explode_t=(t - T_INTRO - 0.2) * 0.7 if t > T_INTRO + 0.2 else None)
    arr = np.asarray(pil, np.float32)
    # ECG grande atravessando
    y0 = H * 0.66; amp = 300 + 200 * min(max((b - 70) / 93, 0), 1)
    newp, oldp, _ = ecg_polys(t, y0, amp)
    arr = glow_lines(arr, [oldp], col, width=4, glow=16, alpha=0.35)
    arr = glow_lines(arr, [newp], col, width=10, glow=40)
    # ponto da cabeça
    pil = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(pil, "RGBA")
    if newp:
        x, y = newp[-1]; r = 16 + 14 * punch
        d.ellipse([x - r * 2.2, y - r * 2.2, x + r * 2.2, y + r * 2.2], fill=tuple(col.astype(int)) + (70,))
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, 255))
    arr = np.asarray(pil, np.float32)
    # curva macro do treino no rodapé
    mp = macro_polys(workout_min(t), H * 0.86, H * 0.95)
    if len(mp) > 1:
        arr = glow_lines(arr, [mp], col, width=4, glow=14, alpha=0.9)
        x, y = mp[-1]
        pil = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(pil, "RGBA")
        r = 9 + 10 * punch; d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, 255)); arr = np.asarray(pil, np.float32)
    # interação com a batida
    arr = rgb_split(arr, 4 + 26 * punch * (b / 120))
    arr = heat_haze(arr, (b - 138) * 0.5 if b > 138 else 0, t)
    arr = arr * (1 - VIG * (0.55 + 0.3 * punch)) + VIG * col * 0.25 * punch
    arr = arr + punch * 40 * (b / 160)
    # aproximação do pico: estrobo
    if t > T_PEAK - 2.2:
        k = (t - (T_PEAK - 2.2)) / 2.2
        if sb < 0.06: arr = arr * (1 - 0.6 * k) + 255 * 0.6 * k
    return arr

FROZEN = {}
def scene_freeze(t):
    if "f" not in FROZEN:
        FROZEN["f"] = scene_workout(T_PEAK - 1e-3)
    u = (t - T_PEAK) / T_FREEZE
    base = FROZEN["f"]
    lum = base.mean(2, keepdims=True)
    k = min(1, u * 4)
    arr = base * (1 - k) + lum * np.array([0.55, 0.12, 0.2]) * k
    z = 1 + 0.08 * u
    pil = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    pil = pil.resize((int(W * z), int(H * z)), Image.BILINEAR).crop((int(W * (z - 1) / 2), int(H * (z - 1) / 2), int(W * (z - 1) / 2) + W, int(H * (z - 1) / 2) + H))
    # coração de partículas aparece e infla
    form = min(1, u * 2.2)
    draw_heart_particles(pil, t, W / 2, H * 0.45, 18 + 16 * u ** 3, form=form, alpha=255, col=(255, 70, 110))
    arr = np.asarray(pil, np.float32)
    arr = rgb_split(arr, 40 * u ** 4)
    if u > 0.9: arr = arr + (u - 0.9) / 0.1 * 255
    return arr

def place(canvas, img, cx, cy, scale, ang, alpha=255):
    th = math.radians(ang); c, s = math.cos(th), math.sin(th)
    a, b_ = c / scale, s / scale; d, e = -s / scale, c / scale
    src = (img.width / 2, img.height / 2)
    layer = img.convert("RGBA").transform((W, H), Image.AFFINE, (a, b_, src[0] - a * cx - b_ * cy, d, e, src[1] - d * cx - e * cy),
                                          resample=Image.BILINEAR, fillcolor=(0, 0, 0, 0))
    if alpha < 255: layer.putalpha(layer.getchannel("A").point(lambda v: v * alpha // 255))
    canvas.alpha_composite(layer)

def polaroid(img, w=300):
    im = ImageOps.fit(img, (w, int(w * 1.25)), Image.BILINEAR)
    p = Image.new("RGB", (w + 24, int(w * 1.25) + 70), (245, 242, 235)); p.paste(im, (12, 12)); return p
POLS = [polaroid(IM[k]) for k in ("selfie", "espelho", "bikes", "dupla", "pesos")]
BG_CARD = cover(card, 1.5, .5, .5).filter(ImageFilter.GaussianBlur(30))

def scene_card(t):
    u = t - T_CARD; b = hr(t); sb = since_beat(t); punch = math.exp(-sb * 8)
    col = hr_color(b)
    cv = Image.eval(BG_CARD, lambda v: int(v * 0.45)).convert("RGBA")
    # raios girando
    d = ImageDraw.Draw(cv, "RGBA"); R = 2400
    for i in range(16):
        a0 = u * 0.5 + i * 2 * math.pi / 16; a1 = a0 + math.pi / 16 * 0.5
        c = [(255, 214, 40), (40, 120, 255)][i % 2]
        d.polygon([(W / 2, H * .45), (W / 2 + R * math.cos(a0), H * .45 + R * math.sin(a0)), (W / 2 + R * math.cos(a1), H * .45 + R * math.sin(a1))], fill=c + (45,))
    slam = 1 - (1 - min(u / 0.45, 1)) ** 3
    s_card = 700 / card.width * (2.6 - 1.6 * slam) * (1 + 0.05 * punch)
    # polaroids em órbita 3D
    orb = []
    for i, p in enumerate(POLS):
        a = u * 1.1 + i * 2 * math.pi / len(POLS)
        z = math.sin(a)
        x = W / 2 + math.cos(a) * 400 * slam; y = H * 0.45 + z * 640 * slam
        orb.append((z, x, y, p, a))
    orb.sort(key=lambda o: o[0])
    for z, x, y, p, a in orb:
        if z < 0: place(cv, p, x, y, 0.4 + 0.15 * (z + 1) / 2, math.degrees(math.cos(a)) * 0.2 - 8 * z, alpha=int(255 * min(1, u * 2)))
    place(cv, card, W / 2, H * 0.45, s_card, 3 * math.sin(u * 1.7))
    for z, x, y, p, a in orb:
        if z >= 0: place(cv, p, x, y, 0.45 + 0.25 * (z + 1) / 2, -10 * math.cos(a), alpha=int(255 * min(1, u * 2)))
    draw_confetti(cv, t)
    arr = np.asarray(cv.convert("RGB"), np.float32)
    # ECG de desaquecimento + no fim vira um coração neon
    y0 = H * 0.86
    newp, oldp, _ = ecg_polys(t, y0, 150)
    k_end = min(max((u - 4.6) / 1.6, 0), 1)
    arr = glow_lines(arr, [oldp], col, width=4, glow=14, alpha=0.35 * (1 - k_end))
    arr = glow_lines(arr, [newp], col, width=6, glow=24, alpha=1 - k_end)
    if k_end > 0:
        n = int(120 * k_end)
        pts = [(W / 2 + heart_xy(j / 120 * 2 * math.pi)[0] * 33 * (1 + 0.05 * punch), H * 0.46 + heart_xy(j / 120 * 2 * math.pi)[1] * 33 * (1 + 0.05 * punch)) for j in range(n + 1)]
        arr = glow_lines(arr, [pts], (255, 50, 110), width=9, glow=40)
    arr = rgb_split(arr, 18 * punch * max(0, 1 - u / 3))
    arr = arr * (1 - VIG * 0.6)
    arr = arr + max(0, 1 - u / 0.35) * 255          # flash da explosão
    if t > T_END - 0.9: arr = arr * max(0, (T_TOTAL - t) / (T_TOTAL - (T_END - 0.9)))
    return arr

def frame_at(t):
    if t < T_PEAK: arr = scene_workout(t)
    elif t < T_CARD: arr = scene_freeze(t)
    else: arr = scene_card(t)
    arr = bloom(np.clip(arr, 0, 255))
    g = GRAIN[int(t * FPS) % len(GRAIN)]
    arr = arr + np.repeat(np.repeat(g, 2, 0), 2, 1)
    return np.clip(arr, 0, 255).astype(np.uint8)

# ------------------------------------------------------------------ áudio (só efeitos; música opcional)
SR = 44100; N = int((T_TOTAL + 1) * SR)
mix = np.zeros(N, np.float32); rs = np.random.RandomState(1)
def add(sig, t, g=1.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if 0 <= i < N: mix[i:j] += sig[:j - i] * g
def thump(f0=60, dur=0.22, g=1.0):
    n = int(dur * SR); tt = np.arange(n) / SR
    f = f0 + 40 * np.exp(-tt * 40)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 18) * np.minimum(tt / 0.004, 1)).astype(np.float32) * g
for bt in BEAT_TIMES:
    if T_PEAK <= bt < T_CARD: continue
    b = hr(bt); k = (b - 70) / 93
    add(thump(55, g=0.8 + 0.4 * k), bt)
    add(thump(48, g=0.5 + 0.3 * k), bt + min(0.18, 60 / b * 0.3))
# drone que sobe com a frequência cardíaca
tt = np.arange(N) / SR
hr_s = np.array([hr(x) for x in np.arange(0, T_TOTAL + 1, 0.01)])
hr_i = np.interp(tt, np.arange(0, T_TOTAL + 1, 0.01)[:len(hr_s)], hr_s)
fd = 40 + hr_i * 0.6
drone = np.sin(2 * np.pi * np.cumsum(fd) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(fd * 1.5) / SR)
noise = np.convolve(rs.randn(N), np.ones(30) / 30, mode="same")
mix += (drone * 0.05 + noise * 0.6) * ((hr_i - 60) / 110) ** 2 * 0.8
silence = (tt > T_PEAK) & (tt < T_CARD); mix[silence] *= 0.1
# zumbido no congelamento + impacto
n = int(T_FREEZE * SR); x = np.arange(n) / SR
add((np.sin(2 * np.pi * 1760 * x) * 0.08 * (x / T_FREEZE)).astype(np.float32), T_PEAK)
boom = thump(38, 1.6, 2.2); add(boom, T_CARD)
n = int(3 * SR); x = np.arange(n) / SR
add((np.diff(rs.randn(n + 1)) * np.exp(-x * 1.4) * 0.25).astype(np.float32), T_CARD)
# varreduras do monitor: bip suave a cada nova foto
for sidx in range(S0, int(_phi[-1] / BEATS_PER_SWEEP) + 1):
    ts = float(np.interp(sidx * BEATS_PER_SWEEP, _phi, _ts))
    if ts < T_PEAK:
        n = int(0.09 * SR); x = np.arange(n) / SR
        add((np.sin(2 * np.pi * 1320 * x) * np.exp(-x * 40) * 0.12).astype(np.float32), ts)
mix = np.tanh(mix * 1.2); mix = mix / np.max(np.abs(mix)) * 0.9
L_ = int(T_TOTAL * SR); mix = mix[:L_]
fade = int(0.8 * SR); mix[-fade:] *= np.linspace(1, 0, fade)
WAV = os.path.join(HERE, "_sfx.wav")
with wave.open(WAV, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    st = np.stack([mix, mix], 1); w.writeframes((st * 32767).astype(np.int16).tobytes())

if __name__ == "__main__":
    only = os.environ.get("FRAMES")
    if only:
        for f in map(int, only.split(",")):
            Image.fromarray(frame_at(f / FPS)).save(os.path.join(HERE, f"_prev_{f:04d}.jpg"), quality=80)
        sys.exit()
    music = os.environ.get("MUSIC")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-", "-i", WAV]
    if music:
        cmd += ["-i", music, "-filter_complex",
                f"[2:a]atrim=0:{T_TOTAL},afade=t=out:st={T_TOTAL-1.2}:d=1.2,volume=0.8[m];[1:a]volume=0.9[s];[m][s]amix=inputs=2:normalize=0[a]",
                "-map", "0:v", "-map", "[a]"]
    cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(NF):
        ff.stdin.write(frame_at(f / FPS).tobytes())
        if f % 90 == 0: print(f"{f}/{NF}", flush=True)
    ff.stdin.close(); ff.wait(); os.remove(WAV)
    print("ok", OUT)
