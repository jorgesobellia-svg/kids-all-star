# Entonación para la voz de Kokoro en español: Kokoro dice igual una pregunta que una
# afirmación. Aquí se graba cada oración por separado y se le da la tónica con el vocoder
# WORLD (sube el tono al final de las preguntas y le da más energía a las exclamaciones).
import re
import numpy as np
import pyworld as pw

WH = r'^((a|de|en|con|para|por|hacia|desde|hasta) )?(qu[eé]|cu[aá]l|cu[aá]les|c[oó]mo|d[oó]nde|ad[oó]nde|cu[aá]ndo|qui[eé]n|qui[eé]nes|cu[aá]nt[oa]s?|por qu[eé]|para qu[eé])\b'


def sentences(text):
    """Parte el texto en oraciones, guardando su signo final."""
    parts = re.split(r'(?<=[.!?…])\s+', text)
    out = []
    for p in parts:
        p = p.strip()
        if p:
            out.append(p)
    return out or [text]


def kind_of(s):
    core = s.split('¿')[-1] if '¿' in s else s
    core = core.strip().lstrip('¡"«').lower()
    if s.rstrip('"»').endswith('?'):
        return 'q_wh' if re.match(WH, core) else 'q_yn'
    if s.rstrip('"»').endswith('!'):
        return 'excl'
    return 'dec'


def _ease(n):
    x = np.linspace(0, 1, n)
    return x * x * (3 - 2 * x)


def shape(a, sr, kind):
    if kind == 'dec' or len(a) < sr * 0.25:
        return a
    x = a.astype(np.float64)
    f0, sp, ap = pw.wav2world(x, sr, frame_period=5.0)
    v = np.where(f0 > 0)[0]
    if len(v) < 10:
        return a
    st = np.zeros_like(f0)  # semitonos a sumar en cada cuadro
    first, last = v[0], v[-1]
    span = last - first + 1
    if kind == 'q_yn':
        n = max(8, int(span * 0.35))
        st[last - n + 1:last + 1] += 9.0 * _ease(n)
    elif kind == 'q_wh':
        n0 = max(6, int(span * 0.28))
        st[first:first + n0] += 2.0 * (1 - _ease(n0))
        n = max(8, int(span * 0.28))
        st[last - n + 1:last + 1] += 5.0 * _ease(n)
    elif kind == 'excl':
        st[first:last + 1] += 2.0
        n0 = max(6, int(span * 0.35))
        bump = np.sin(np.linspace(0, np.pi, n0))
        st[first:first + n0] += 1.5 * bump
        # más rango: lo alto más alto y lo bajo más bajo
        med = np.median(f0[v])
        f0 = np.where(f0 > 0, med * (f0 / med) ** 1.3, 0)
    f1 = np.where(f0 > 0, f0 * 2 ** (st / 12), 0)
    y = pw.synthesize(f1, sp, ap, sr, frame_period=5.0)[: len(a)]
    if kind == 'excl':
        y *= 10 ** (1.5 / 20)
    peak = np.max(np.abs(y)) or 1
    if peak > 0.98:
        y *= 0.98 / peak
    return y.astype(np.float32)


def speak(k, voice, phonemes, text, speed=1.0, gap=0.12):
    """Kokoro + entonación, oración por oración."""
    sr = 24000
    pieces = []
    for s in sentences(text):
        a, sr = k.create(phonemes(k.tokenizer, s), voice=voice, speed=speed, is_phonemes=True)
        pieces += [shape(a, sr, kind_of(s)), np.zeros(int(sr * gap), dtype=np.float32)]
    return np.concatenate(pieces[:-1]), sr
