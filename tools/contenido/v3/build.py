# Construye los niveles 5 a 20 a partir del guion definitivo (Versión Fusionada).
#  - Español: sale tal cual de guion.json (leído del documento). Nunca se escribe a mano,
#    salvo la división de la narración en pedazos, que se comprueba contra el guion.
#  - en / zh-Hans / ja: trans_lN.py (traducciones).
#  - Escenas, toques, arrastres e imágenes: spec_lN.py.
# Salidas: src/content/levelsV3.ts y v3_content.py (lo ejecuta content_src.py).
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
APP = '/home/claude/kids-all-star'
G = json.load(open(os.path.join(HERE, 'guion.json')))
LEVELS = [int(a) for a in sys.argv[1:]] or list(range(5, 21))
TYPEMAP = {'choice': 'choice', 'tf': 'tf', 'choiceImg': 'choiceImg', 'tap': 'tap', 'umpire': 'umpire', 'drag': 'drag'}
IDS = 'abcdef'
errors = []

def norm(s):
    return re.sub(r'\s+', ' ', s.replace('«', '').replace('»', '').replace('*', '')).strip()

TR, SP = {}, {}
for n in LEVELS:
    ns = {}
    exec(open(os.path.join(HERE, f'trans_l{n}.py')).read(), ns)
    TR[n] = ns['TR']
    ns = {}
    exec(open(os.path.join(HERE, f'spec_l{n}.py')).read(), ns)
    SP[n] = ns['SPEC']

def tup(es, tr, where):
    if not isinstance(tr, tuple) or len(tr) != 3 or not all(isinstance(x, str) and x.strip() for x in tr):
        errors.append(f'{where}: falta traducción'); tr = (es, es, es)
    return (es, tr[0], tr[1], tr[2])

py = ['# Generado por v3/build.py — no editar a mano.']
ts_levels = []

for n in LEVELS:
    g = G[str(n)]; tr = TR[n]; sp = SP[n]
    badge_es = re.search(r'Insignia(?: del nivel)?: ([^.]+)\.', g['intro']).group(1).strip()
    py.append(f"levels['{n}'] = dict(title={tup(g['title'], tr['title'], f'L{n} title')!r}, badge={tup(badge_es, tr['badge'], f'L{n} badge')!r})")
    lessons_ts = []
    for les in g['lessons']:
        lid = les['id']; lt = tr['lessons'].get(lid, {}); ls = sp['lessons'].get(lid, {})
        title = tup(les['title'], lt.get('title'), f'{lid} title')
        obj = tup(les['objective'], lt.get('obj'), f'{lid} obj')
        demo = lt.get('demo', [])
        joined = norm(' '.join(d[0] for d in demo))
        if joined != norm(les['demoRaw']):
            errors.append(f'{lid} demo: los pedazos en español no coinciden con el guion\n   guion: {norm(les["demoRaw"])}\n   app:   {joined}')
        demo_t = [tup(d[0], d[1:4] if len(d) == 4 else None, f'{lid} demo{i}') for i, d in enumerate(demo)]
        segspec = ls.get('demo', [])
        if len(segspec) != len(demo):
            errors.append(f'{lid}: {len(segspec)} escenas para {len(demo)} pedazos de narración')
        acts_py, acts_ts = {}, []
        for a in les['acts']:
            k = a['n']; at = lt.get('acts', {}).get(k, {}); asp = ls.get('acts', {}).get(k, {})
            q = tup(a['q'], at.get('q'), f'{lid}#{k} q')
            ok = tup(a['right'], at.get('ok'), f'{lid}#{k} ok')
            ko = tup(a['wrong'], at.get('ko'), f'{lid}#{k} ko')
            typ = TYPEMAP[a['type']]
            if typ == 'tap' and asp.get('images'): typ = 'choiceImg'  # «toca al jugador…» entre dibujos
            entry = {'q': q, 'ok': ok, 'ko': ko}
            ts = {'n': k, 'type': typ, 'seg': asp.get('seg', min(k - 1, max(len(demo) - 1, 0)))}
            if typ in ('choice', 'umpire', 'choiceImg'):
                ot = at.get('o') or [None] * len(a['opts'])
                if len(ot) != len(a['opts']): errors.append(f'{lid}#{k}: {len(ot)} opciones traducidas para {len(a["opts"])}'); ot = [None] * len(a['opts'])
                entry['opts'] = {IDS[i]: tup(o, ot[i], f'{lid}#{k} o{i}') for i, o in enumerate(a['opts'])}
                ts['options'] = [IDS[i] for i in range(len(a['opts']))]
                ts['correct'] = IDS[a['opts'].index(a['correct'])]
                if typ == 'choiceImg':
                    imgs = asp.get('images')
                    if not imgs or len(imgs) != len(a['opts']): errors.append(f'{lid}#{k}: faltan imágenes')
                    else: ts['images'] = {IDS[i]: f'x:{im}' for i, im in enumerate(imgs)}
            elif typ == 'tf':
                ts['correct'] = 'true' if a['correct'].lower().startswith('verdadero') else 'false'
            else:
                entry['answer'] = tup(a['correct'], at.get('ans'), f'{lid}#{k} ans')
                if typ == 'tap':
                    if 'target' not in asp: errors.append(f'{lid}#{k}: falta el objetivo del toque')
                    ts['target'] = asp.get('target', 'home'); ts['scene'] = asp.get('scene', 'diamond')
                    for key in ('fx', 'linescore'):
                        if key in asp: ts[key] = asp[key]
                else:
                    if 'route' in asp:
                        ts['route'] = asp['route']
                        if 'from' in asp: ts['from'] = asp['from']
                    elif 'place' in asp:
                        ts['place'] = asp['place']; ts['board'] = asp.get('board', 'diamond')
                        toks = at.get('tok', {})
                        entry['opts'] = {tid: (toks[tid] if tid in toks else (tid, tid, tid, tid)) for tid in list(asp['place'].keys()) + list(dict.fromkeys(asp['place'].values()))}
                        for tid, v in entry['opts'].items():
                            if v[0] == tid and asp.get('board', 'diamond') not in ('diamond', 'order'): errors.append(f'{lid}#{k}: falta el texto de la ficha {tid}')
                    else:
                        errors.append(f'{lid}#{k}: arrastre sin ruta ni fichas')
                    if 'fx' in asp: ts['fx'] = asp['fx']
            acts_py[str(k)] = entry
            acts_ts.append(ts)
        py.append(f"lesson('{lid}', {title!r}, {obj!r}, {demo_t!r}, {{" + ', '.join(f"'{k}': act({v['q']!r}, {v['ok']!r}, {v['ko']!r}" + (f", opts={v['opts']!r}" if 'opts' in v else '') + (f", answer={v['answer']!r}" if 'answer' in v else '') + ')' for k, v in acts_py.items()) + '})')
        py.append(f"map_titles['{lid}'] = {title!r}")
        lessons_ts.append({'id': lid, 'level': n, 'glossary': ls.get('gloss', []), 'demo': segspec, 'activities': acts_ts})
    # Examen
    ex_py, ex_ts = {}, []
    lmap = sp['examLessons']
    for e in g['exam']:
        k = e['n']; et = tr['exam'].get(k, {}); es_ = sp.get('exam', {}).get(k, {})
        q = tup(e['q'], et.get('q'), f'ex{n}#{k} q')
        d = {'q': q}
        tsq = {'n': k, 'lesson': lmap[k - 1]}
        if e['opts'][0].startswith('—'):
            d['answer'] = tup(e['correct'], et.get('ans'), f'ex{n}#{k} ans')
            tsq.update(type='tap', target=es_.get('target', 'home'), scene=es_.get('scene', 'diamond'))
            if 'fx' in es_: tsq['fx'] = es_['fx']
            if 'target' not in es_: errors.append(f'ex{n}#{k}: falta el objetivo del toque')
        elif e['correct'] in ('Verdadero', 'Falso') and set(e['opts']) == {'Verdadero', 'Falso'}:
            tsq.update(type='tf', correct='true' if e['correct'] == 'Verdadero' else 'false')
        else:
            ot = et.get('o') or [None] * len(e['opts'])
            d['opts'] = {IDS[i]: tup(o, ot[i] if i < len(ot) else None, f'ex{n}#{k} o{i}') for i, o in enumerate(e['opts'])}
            tsq.update(type='choice', options=[IDS[i] for i in range(len(e['opts']))], correct=IDS[e['opts'].index(e['correct'])])
        ex_py[str(k)] = d; ex_ts.append(tsq)
    py.append(f"exams_v3['{n}'] = {ex_py!r}")
    for key, v in tr.get('gloss', {}).items():
        py.append(f"glossary[{key!r}] = {tup(v[0], v[1:], f'gloss {key}')!r}")
    ts_levels.append({'n': n, 'free': False, 'lessons': lessons_ts, 'lessonIds': [l['id'] for l in g['lessons']], 'exam': ex_ts, 'passPercent': 80})

if errors:
    print('ERRORES:'); print('\n'.join(errors)); sys.exit(1)

open(os.path.join(HERE, 'v3_content.py'), 'w').write('\n'.join(py) + '\n')
ts = "// Generado por scratchpad v3/build.py a partir de docs/guion-v3-niveles-5-12.md y docs/guion-v4-niveles-13-20.md — no editar a mano.\nimport type { Level } from './types';\n\n"
ts += 'export const LEVELS_V3: Level[] = ' + json.dumps(ts_levels, ensure_ascii=False, indent=1) + ' as unknown as Level[];\n'
open(os.path.join(APP, 'src/content/levelsV3.ts'), 'w').write(ts)
print('ok', LEVELS)
