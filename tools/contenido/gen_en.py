# Graba con Kokoro (voz am_echo) todo lo que la app dice en inglés: una pista por lección y por examen.
# Kokoro ya entona solo las preguntas y exclamaciones en inglés. Reanudable: salta lo ya hecho.
import json, os, subprocess, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
OUT='en_echo'; GAP=0.6
k=Kokoro('kokoro.onnx','voices.bin'); st=k.get_voice_style('am_echo')
c=json.load(open('/home/claude/kids-all-star/src/i18n/locales/en/content.json'))
UI=json.load(open('/home/claude/kids-all-star/src/i18n/locales/en/ui.json'))
LV=json.load(open('../levels.json'))
def key(x): return [int(p) for p in x.split('.')]
jobs=[('common',['Hi!']+[UI['shop'][k] for k in ('tut1','tut2','tut3','tut4')]+[UI['exam'][k] for k in ('out1','out2','out3')])]
for lv in sorted({l.split('.')[0] for l in c['lessons']}, key=int):
    for lid in sorted([l for l in c['lessons'] if l.split('.')[0]==lv], key=key):
        L=c['lessons'][lid]; items=list(L['demo'])
        for n in sorted(L['acts'], key=int):
            a=L['acts'][n]; items += [a['q']] + [a[x] for x in ('ok','ko') if a.get(x)]
        jobs.append((lid, items))
    if lv in c['exams']:
        ex=[]
        for q in LV[int(lv)-1]['exam']:
            qt=c['exams'][lv][str(q['n'])]; ex.append(qt['q'])
            lab = qt.get('answer') if q['type']=='tap' else (UI['common']['true'] if q.get('correct')=='true' else UI['common']['false']) if q['type']=='tf' else qt.get('opts',{}).get(q.get('correct',''))
            if lab: ex.append(UI['exam']['correctWas'].replace('{a}', lab))
        jobs.append(('exam'+lv, ex))
# Minijuegos: la explicación que dice Pelotín antes de jugar.
jobs.append(('games', [UI['game'][g+'Intro']+' '+UI['game'][g+'Rule'] for g in ('bat','pitch','ump','fly')]))
only=sys.argv[1:]  # niveles a grabar (vacío = todos)
for jid, items in jobs:
    lv = jid.replace('exam','').split('.')[0]
    if only and jid!='common' and lv not in only: continue
    if os.path.exists(f'{OUT}/{jid}.json'): continue
    parts=[]; idx={}; t=0.0; sr=24000
    for s in dict.fromkeys(items):
        a,sr=k.create(s,voice=st,speed=1.0,lang='en-us')
        idx[s]=[round(t,3), round(len(a)/sr,3)]
        parts += [a, np.zeros(int(sr*GAP),dtype=np.float32)]; t += len(a)/sr + GAP
    sf.write(f'{OUT}/{jid}.wav', np.concatenate(parts), sr)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'{OUT}/{jid}.wav','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ar','24000','-ac','1','-b:a','32k',f'{OUT}/{jid}.mp3'],check=True)
    os.remove(f'{OUT}/{jid}.wav')
    json.dump(idx, open(f'{OUT}/{jid}.json','w'), ensure_ascii=False)
    print(jid, round(t,1), 's', flush=True)
