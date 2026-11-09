# Copia las pistas de voz grabadas (Kokoro, voz em_alex) a assets/voice/es y genera src/content/voiceEs.ts,
# que dice en qué pista y en qué segundo empieza cada frase. Uso: python3 voice_manifest.py CARPETA_DE_PISTAS
import json, os, shutil, sys
SRC = sys.argv[1]; ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DST = os.path.join(ROOT, 'assets', 'voice', 'es'); os.makedirs(DST, exist_ok=True)
files = sorted(f[:-5] for f in os.listdir(SRC) if f.endswith('.json') and os.path.exists(os.path.join(SRC, f[:-5] + '.mp3')))
index = {}
for i, fid in enumerate(files):
    shutil.copy(os.path.join(SRC, fid + '.mp3'), os.path.join(DST, fid + '.mp3'))
    for text, (start, dur) in json.load(open(os.path.join(SRC, fid + '.json'))).items():
        index.setdefault(text, [i, start, dur])
lines = ['// Generado por tools/contenido/voice_manifest.py: no editar a mano.',
         '// Voz grabada en español (Kokoro, voz em_alex; términos de béisbol en inglés con pronunciación inglesa).',
         '/* eslint-disable */',
         'export const VOICE_ES_FILES: number[] = [']
lines += [f"  require('../../assets/voice/es/{fid}.mp3')," for fid in files]
lines += ['];', '', '// texto → [pista, inicio (s), duración (s)]',
          'export const VOICE_ES_INDEX: Record<string, [number, number, number]> = ' + json.dumps(index, ensure_ascii=False) + ';', '']
open(os.path.join(ROOT, 'src', 'content', 'voiceEs.ts'), 'w').write('\n'.join(lines))
print(len(files), 'pistas,', len(index), 'frases')
