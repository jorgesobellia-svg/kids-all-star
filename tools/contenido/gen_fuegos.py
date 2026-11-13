# Genera assets/sfx/fuegos.wav: un fuego artificial que estalla (boom grave y chisporroteo).
# Sonido sintetizado aquí mismo (sin grabaciones de terceros), así no hay licencias que revisar.
# Uso: python3 tools/contenido/gen_fuegos.py
import os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 24000
DUR = 1.6
rng = np.random.default_rng(3)
t = np.arange(int(SR * DUR)) / SR


def lp(x, f, order=4):
    return sosfilt(butter(order, f, btype='low', fs=SR, output='sos'), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)


# Boom: ruido grave con golpe rápido y cola que se apaga, más un "tum" de 55 Hz.
boom = lp(rng.standard_normal(t.size), 180) * np.exp(-t / 0.28) * 3.0
boom += np.sin(2 * np.pi * 55 * t * (1 - 0.3 * t)) * np.exp(-t / 0.18) * 0.8
att = np.minimum(1, t / 0.004)
boom *= att

# Chisporroteo: chasquidos cortos y brillantes repartidos después del estallido.
crackle = np.zeros_like(t)
for _ in range(70):
    s = rng.uniform(0.18, 1.35)
    i = int(s * SR)
    n = int(SR * rng.uniform(0.004, 0.012))
    if i + n >= t.size:
        continue
    crackle[i:i + n] += rng.standard_normal(n) * np.exp(-np.arange(n) / (n / 4)) * rng.uniform(0.3, 1.0)
crackle = bp(crackle, 2500, 9000) * np.exp(-(t - 0.2).clip(0) / 0.7) * 1.6

out = boom + crackle
out *= np.minimum(1, (DUR - t) / 0.08)  # sin corte brusco al final
out = out / np.max(np.abs(out)) * 0.85
dst = os.path.join(os.path.dirname(__file__), '..', '..', 'assets', 'sfx', 'fuegos.wav')
sf.write(dst, out.astype(np.float32), SR, subtype='PCM_16')
print('ok', dst)
