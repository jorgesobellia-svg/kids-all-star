# Arma los idiomas agregados después (italiano y portugués de Brasil) a partir de
# tools/contenido/extra/<idioma>.json, que guarda por cada ruta el texto español de origen y su traducción.
#
#   python3 tools/contenido/extra/build_extra.py          → escribe src/i18n/locales/<idioma>/{ui,content,glossary}.json
#   python3 tools/contenido/extra/build_extra.py --check  → solo informa textos nuevos o cambiados en español
#
# Si el español cambió (o hay textos nuevos), esos textos salen en el informe y, mientras tanto,
# se usa el inglés para no dejar huecos. Los nombres de idioma y sus códigos son iguales en todos los idiomas.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from flat import LOC, FILES, load, rebuild

EXTRA = ['it', 'pt-BR']
SAME_EVERYWHERE = ('ui/language/name_', 'ui/language/code_')


def build(lang, write=True):
    src = json.load(open(os.path.join(HERE, f'{lang}.json')))
    es, en = load('es'), load('en')
    missing, stale = [], []
    out = {}
    for f in FILES:
        flat = {}
        for k, s in es[f].items():
            path = f'{f}/' + k.replace('\x1f', '/')
            e = src.get(path)
            if path.startswith(SAME_EVERYWHERE):
                flat[k] = s
            elif e is None:
                missing.append(path); flat[k] = en[f].get(k, s)
            elif e['es'] != s:
                stale.append(path); flat[k] = en[f].get(k, s)
            else:
                flat[k] = e['t']
        shape = json.load(open(os.path.join(LOC, 'es', f + '.json')))
        out[f] = rebuild(shape, flat)
    if write:
        d = os.path.join(LOC, lang)
        os.makedirs(d, exist_ok=True)
        for f, obj in out.items():
            json.dump(obj, open(os.path.join(d, f + '.json'), 'w'), ensure_ascii=False, indent=2)
    print(f'{lang}: {len(missing)} sin traducir, {len(stale)} con el español cambiado')
    for p in missing[:40]: print('  falta  ', p)
    for p in stale[:40]: print('  cambió ', p)
    return missing, stale


if __name__ == '__main__':
    check = '--check' in sys.argv
    for lang in EXTRA:
        build(lang, write=not check)
