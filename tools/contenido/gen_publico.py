# Genera assets/sfx/publico.wav: el público del estadio celebrando (gritos "¡eeeh!" y aplausos).
# Sonido sintetizado aquí mismo (sin grabaciones de terceros), así no hay licencias que revisar.
# Uso: python3 tools/contenido/gen_publico.py
import os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 24000
DUR = 2.6
rng = np.random.default_rng(7)
t = np.arange(int(SR * DUR)) / SR
out = np.zeros_like(t)


def band(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)


def env(start, attack, hold, release):
    e = np.zeros_like(t)
    a = (t >= start) & (t < start + attack)
    e[a] = (t[a] - start) / attack
    h = (t >= start + attack) & (t < start + attack + hold)
    e[h] = 1
    r = (t >= start + attack + hold) & (t < start + attack + hold + release)
    e[r] = 1 - (t[r] - start - attack - hold) / release
    return e


# Voces: diente de sierra con vibrato, pasado por dos formantes de vocal abierta ("eeeh"/"aaah").
for i in range(46):
    f0 = rng.uniform(170, 420)
    vib = 1 + 0.03 * np.sin(2 * np.pi * rng.uniform(4, 7) * t + rng.uniform(0, 6)) + 0.04 * (t / DUR) * rng.choice([-1, 1])
    ph = np.cumsum(f0 * vib) / SR
    saw = 2 * (ph % 1) - 1
    f1, f2 = rng.uniform(550, 800), rng.uniform(1100, 1900)
    v = band(saw, f1 * 0.8, f1 * 1.25) + 0.6 * band(saw, f2 * 0.85, f2 * 1.2)
    st = rng.uniform(0.0, 0.35)
    out += v * env(st, rng.uniform(0.08, 0.25), rng.uniform(0.6, 1.4), rng.uniform(0.5, 1.0)) * rng.uniform(0.4, 1.0)

# Rumor de fondo: ruido rosado filtrado que sube y baja.
white = rng.standard_normal(len(t))
pink = np.cumsum(white)
pink = pink - np.convolve(pink, np.ones(400) / 400, mode='same')
roar = band(pink, 250, 2600)
roar /= np.max(np.abs(roar)) + 1e-9
out = out / (np.max(np.abs(out)) + 1e-9) + 0.55 * roar * env(0, 0.25, 1.3, 1.0)

# Aplausos: golpecitos cortos de ruido brillante, muchos y desordenados.
claps = np.zeros_like(t)
for _ in range(260):
    c = rng.uniform(0.1, 2.2)
    n = int(SR * 0.018)
    i = int(c * SR)
    if i + n < len(t):
        burst = band(rng.standard_normal(n), 900, 5000) * np.exp(-np.linspace(0, 6, n))
        claps[i : i + n] += burst * rng.uniform(0.3, 1.0)
claps /= np.max(np.abs(claps)) + 1e-9
out += 0.45 * claps * env(0.1, 0.2, 1.4, 0.8)

# Final suave y volumen parejo.
out *= env(0, 0.05, DUR - 0.65, 0.6)
out /= np.max(np.abs(out)) + 1e-9
out *= 0.85
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
dst = os.path.join(root, 'assets', 'sfx', 'publico.wav')
sf.write(dst, out.astype(np.float32), SR, subtype='PCM_16')
print('ok', dst, round(DUR, 2), 's')
