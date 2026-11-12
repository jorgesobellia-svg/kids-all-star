# Borra las pistas grabadas cuyas frases ya no coinciden con el texto actual (para regrabarlas).
import json, os, re
src = open('gen_en.py').read()
jobsrc = src.split('only=sys.argv')[0]
jobsrc = re.sub(r"k=Kokoro\(.*\n", "", jobsrc)
jobsrc = re.sub(r"from kokoro_onnx import Kokoro\n", "", jobsrc)
ns = {}; exec(jobsrc, ns)
n = 0
for jid, items in ns['jobs']:
    p = f'en_echo/{jid}.json'
    if os.path.exists(p) and set(json.load(open(p))) != set(dict.fromkeys(items)):
        os.remove(p); os.remove(f'en_echo/{jid}.mp3'); n += 1; print('stale', jid)
print(n, 'stale')
