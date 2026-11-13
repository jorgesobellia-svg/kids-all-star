# Graba con Kokoro todo lo que Pelotín dice en italiano o portugués de Brasil: una pista por lección y por examen.
# Se corre dentro de la carpeta de Kokoro (kokoro.onnx, voices.bin, ../levels.json).
#   python3 gen_extra.py pt-BR            → voz pm_alex
#   python3 gen_extra.py it               → voz parecida a Alex hablando italiano (ver VOICE)
# Reanudable: salta lo ya hecho. Después: python3 voice_manifest.py <carpeta> <it|pt>
import json, os, subprocess, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
LANG = sys.argv[1]
REPO = '/home/claude/kids-all-star'
CFG = {
    'pt-BR': dict(out='pt_alex', kokoro='pt-br', hello='Oi!'),
    'it': dict(out='it_alex', kokoro='it', hello='Ciao!'),
}[LANG]
k = Kokoro('kokoro.onnx', 'voices.bin')
VOICE = {
    'pt-BR': k.get_voice_style('pm_alex'),
    # Italiano con el timbre de Alex: mezcla de Alex (es) con la voz italiana para que pronuncie bien.
    'it': 0.6 * k.get_voice_style('em_alex') + 0.4 * k.get_voice_style('im_nicola'),
}[LANG]
OUT = CFG['out']; GAP = 0.6
os.makedirs(OUT, exist_ok=True)
c = json.load(open(f'{REPO}/src/i18n/locales/{LANG}/content.json'))
UI = json.load(open(f'{REPO}/src/i18n/locales/{LANG}/ui.json'))
LV = json.load(open('../levels.json'))
def key(x): return [int(p) for p in x.split('.')]
jobs = [('common', [CFG['hello']] + [UI['shop'][x] for x in ('tut1', 'tut2', 'tut3', 'tut4')] + [UI['exam'][x] for x in ('out1', 'out2', 'out3')])]
for lv in sorted({l.split('.')[0] for l in c['lessons']}, key=int):
    for lid in sorted([l for l in c['lessons'] if l.split('.')[0] == lv], key=key):
        L = c['lessons'][lid]; items = list(L['demo'])
        for n in sorted(L['acts'], key=int):
            a = L['acts'][n]; items += [a['q']] + [a[x] for x in ('ok', 'ko') if a.get(x)]
        jobs.append((lid, items))
    if lv in c['exams']:
        ex = []
        for q in LV[int(lv) - 1]['exam']:
            qt = c['exams'][lv][str(q['n'])]; ex.append(qt['q'])
            lab = qt.get('answer') if q['type'] == 'tap' else (UI['common']['true'] if q.get('correct') == 'true' else UI['common']['false']) if q['type'] == 'tf' else qt.get('opts', {}).get(q.get('correct', ''))
            if lab: ex.append(UI['exam']['correctWas'].replace('{a}', lab))
        jobs.append(('exam' + lv, ex))
jobs.append(('games', [UI['game'][g + 'Intro'] + ' ' + UI['game'][g + 'Rule'] for g in ('bat', 'pitch', 'ump', 'fly')]))
only = sys.argv[2:]
for jid, items in jobs:
    lv = jid.replace('exam', '').split('.')[0]
    if only and jid != 'common' and lv not in only: continue
    if os.path.exists(f'{OUT}/{jid}.json'): continue
    parts = []; idx = {}; t = 0.0; sr = 24000
    for s in dict.fromkeys(items):
        a, sr = k.create(s, voice=VOICE, speed=1.0, lang=CFG['kokoro'])
        idx[s] = [round(t, 3), round(len(a) / sr, 3)]
        parts += [a, np.zeros(int(sr * GAP), dtype=np.float32)]; t += len(a) / sr + GAP
    sf.write(f'{OUT}/{jid}.wav', np.concatenate(parts), sr)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{OUT}/{jid}.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '24000', '-ac', '1', '-b:a', '32k', f'{OUT}/{jid}.mp3'], check=True)
    os.remove(f'{OUT}/{jid}.wav')
    json.dump(idx, open(f'{OUT}/{jid}.json', 'w'), ensure_ascii=False)
    print(jid, round(t, 1), 's', flush=True)
