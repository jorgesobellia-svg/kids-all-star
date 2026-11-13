# Rehace el examen de un nivel (5 a 12) para que pregunte de las 5 lecciones (punto C de la revisión).
# Uso: python3 new_exam.py <nivel>   — lee EXAMS[nivel] de exams_nuevos.py.
# Cada pregunta es ('keep', n_viejo) o un dict con lesson, q, opts, correct, tr (en/zh/ja) y, si es de tocar, target.
# Actualiza guion.json, spec_lN.py (lecciones de cada pregunta y objetivos de toque), trans_lN.py y el guion en docs.
import ast, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
lv = int(sys.argv[1])
ns = {}
exec(open(os.path.join(HERE, 'exams_nuevos.py')).read(), ns)
NEW = ns['EXAMS'][lv]
assert len(NEW) == 12, len(NEW)

G = json.load(open(os.path.join(HERE, 'guion.json')))
old = {e['n']: e for e in G[str(lv)]['exam']}
trp = os.path.join(HERE, f'trans_l{lv}.py')
spp = os.path.join(HERE, f'spec_l{lv}.py')
trs = open(trp).read()
sps = open(spp).read()
tns, sns = {}, {}
exec(trs, tns)
exec(sps, sns)
TR_EX = tns['TR']['exam']
SP = sns['SPEC']

exam, tr_ex, lessons, sp_ex = [], {}, [], {}
for i, item in enumerate(NEW, start=1):
    if isinstance(item, tuple) and item[0] == 'keep':
        k = item[1]
        e = dict(old[k]); e['n'] = i
        exam.append(e)
        tr_ex[i] = TR_EX[k]
        lessons.append(SP['examLessons'][k - 1])
        if k in SP.get('exam', {}):
            sp_ex[i] = SP['exam'][k]
    else:
        e = {'n': i, 'q': item['q'], 'opts': item['opts'], 'correct': item['correct']}
        assert item['opts'][0].startswith('—') or item['correct'] in item['opts'], item
        exam.append(e)
        tr_ex[i] = item['tr']
        lessons.append(item['lesson'])
        if 'target' in item:
            sp_ex[i] = {'target': item['target']}
G[str(lv)]['exam'] = exam
json.dump(G, open(os.path.join(HERE, 'guion.json'), 'w'), ensure_ascii=False, indent=1)


def block(src, key, new_text):
    """Reemplaza el valor de `key` (un dict o lista literal) dentro de un archivo de Python."""
    m = re.search(r"\n( *)'" + key + r"': ", src)
    assert m, key
    start = m.end()
    depth, j = 0, start
    in_str = None
    while True:
        c = src[j]
        if in_str:
            if c == '\\': j += 2; continue
            if c == in_str: in_str = None
        elif c in '\'"': in_str = c
        elif c in '{[(': depth += 1
        elif c in '}])':
            depth -= 1
            if depth == 0: j += 1; break
        j += 1
    return src[:start] + new_text + src[j:]


lines = ['{']
for k, v in tr_ex.items():
    lines.append(f'  {k}: {v!r},')
lines.append(' }')
trs = block(trs, 'exam', '\n'.join(lines))
open(trp, 'w').write(trs)

sps = block(sps, 'examLessons', repr(lessons))
if "'exam':" in sps:
    sps = block(sps, 'exam', repr(sp_ex))
else:
    sps = sps.replace("'examLessons':", f"'exam': {sp_ex!r},\n 'examLessons':", 1)
open(spp, 'w').write(sps)

# Tabla del examen en el guion (docs).
doc = os.path.join(APP, 'docs', 'guion-v3-niveles-5-12.md' if lv <= 12 else 'guion-v4-niveles-13-20.md')
d = open(doc).read()
h = re.search(r'### Examen del Nivel ' + str(lv) + r' .*?\n(\| \*\*\\#\*\*.*?\n\|[-| ]+\n)((?:\|[^\n]*\n)+)', d, re.S)
assert h, 'tabla del examen'
rows = ''.join(f"| {e['n']} | {e['q']} | {' / '.join(e['opts'])} | {e['correct']} |\n" for e in exam)
d = d[:h.start(2)] + rows + d[h.end(2):]
open(doc, 'w').write(d)
print('ok', lv, lessons)
