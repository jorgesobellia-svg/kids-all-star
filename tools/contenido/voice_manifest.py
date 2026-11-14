# Copia las pistas de voz grabadas (Kokoro) a assets/voice/<idioma> y genera src/content/voice<Idioma>.ts,
# que dice en qué pista y en qué segundo empieza cada frase.
# Uso: python3 voice_manifest.py CARPETA_DE_PISTAS [es|en|it|pt]
#   es = em_alex, en = am_echo, it = mezcla em_alex + im_nicola, pt = pm_alex (portugués de Brasil)
import json, os, shutil, sys
SRC = sys.argv[1]; LANG = sys.argv[2] if len(sys.argv) > 2 else 'es'
VOICE = {'es': 'em_alex; términos de béisbol en inglés con pronunciación inglesa', 'en': 'am_echo',
         'it': '0.6 em_alex + 0.4 im_nicola', 'pt': 'pm_alex (portugués de Brasil)'}[LANG]
U = LANG.upper(); Cap = LANG.capitalize()
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DST = os.path.join(ROOT, 'assets', 'voice', LANG); os.makedirs(DST, exist_ok=True)
files = sorted(f[:-5] for f in os.listdir(SRC) if f.endswith('.json') and os.path.exists(os.path.join(SRC, f[:-5] + '.mp3')))
index = {}
for i, fid in enumerate(files):
    shutil.copy(os.path.join(SRC, fid + '.mp3'), os.path.join(DST, fid + '.mp3'))
    for text, (start, dur) in json.load(open(os.path.join(SRC, fid + '.json'))).items():
        index.setdefault(text, [i, start, dur])
lines = ['// Generado por tools/contenido/voice_manifest.py: no editar a mano.',
         f'// Voz grabada ({LANG}): Kokoro, voz {VOICE}.',
         '/* eslint-disable */',
         f'export const VOICE_{U}_FILES: number[] = [']
lines += [f"  require('../../assets/voice/{LANG}/{fid}.mp3')," for fid in files]
lines += ['];', '', '// texto → [pista, inicio (s), duración (s)]',
          f'export const VOICE_{U}_INDEX: Record<string, [number, number, number]> = ' + json.dumps(index, ensure_ascii=False) + ';', '']
open(os.path.join(ROOT, 'src', 'content', f'voice{Cap}.ts'), 'w').write('\n'.join(lines))
print(len(files), 'pistas,', len(index), 'frases')
