# Aplana los textos de un idioma (ui, content, glossary) a {ruta: texto}. Lo usan los idiomas
# agregados después (italiano, portugués): se traducen por ruta y se vuelven a armar con la forma del español.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
LOC = os.path.join(HERE, '..', '..', '..', 'src', 'i18n', 'locales')
FILES = ('ui', 'glossary', 'content')


def flatten(x, pre=''):
    out = {}
    if isinstance(x, dict):
        for k, v in x.items():
            out.update(flatten(v, f'{pre}{k}\x1f'))
    elif isinstance(x, list):
        for i, v in enumerate(x):
            out.update(flatten(v, f'{pre}#{i}\x1f'))
    elif isinstance(x, str):
        out[pre[:-1]] = x
    return out


def load(lang):
    return {f: flatten(json.load(open(os.path.join(LOC, lang, f + '.json')))) for f in FILES}


def rebuild(shape, flat, pre=''):
    """Arma un objeto con la forma de `shape` tomando los textos de `flat` (ruta → texto)."""
    if isinstance(shape, dict):
        return {k: rebuild(v, flat, f'{pre}{k}\x1f') for k, v in shape.items()}
    if isinstance(shape, list):
        return [rebuild(v, flat, f'{pre}#{i}\x1f') for i, v in enumerate(shape)]
    if isinstance(shape, str):
        return flat.get(pre[:-1], None)
    return shape
