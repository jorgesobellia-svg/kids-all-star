# Cambio de nombre aprobado por Jorge (14-nov-2026): la app pasa de «Kids All Star» a «Pelotín»
# y la palabra «All Star» de las lecciones pasa a «estrella» («pensar como estrella»).
# Se aplica a las fuentes (guion, documentos del guion, traducciones y textos de la interfaz)
# y a las traducciones de italiano y portugués. Después hay que volver a armar todo:
#   python3 tools/contenido/v3/build.py && python3 tools/contenido/content_src.py src/i18n/locales
#   python3 tools/contenido/ui_src.py src/i18n/locales && python3 tools/contenido/extra/build_extra.py
# Cada idioma se dice como se diría en ese idioma: italiano «campione», portugués «craque».
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
TOOLS = os.path.dirname(HERE)

# Español (las 9 frases con el nombre de la app y las de «All Star» en las lecciones).
ES = [
    ('Kids All Star se termina aquí, pero', 'Las lecciones de Pelotín terminan aquí, pero'),
    ('Cierre de todo Kids All Star', 'Cierre de todo Pelotín'),
    ('las etapas de Kids All Star', 'las etapas de Pelotín'),
    ('Al terminar Kids All Star', 'Al terminar Pelotín'),
    ('en todo Kids All Star', 'en todo Pelotín'),
    ('los 20 niveles de Kids All Star', 'los 20 niveles de Pelotín'),
    ('los 20 exámenes de Kids All Star', 'los 20 exámenes de Pelotín'),
    ('Kids All Star Plus', 'Pelotín Plus'),
    ('Insignia: All Star.', 'Insignia: Estrella.'),
    ('Insignia del nivel: All Star.', 'Insignia del nivel: Estrella.'),
    ('insignia All Star', 'insignia Estrella'),
    ('Uniforme All Star', 'Uniforme de estrella'),
    ('uniforme All Star', 'uniforme de estrella'),
    ('Pensar como All Star', 'Pensar como estrella'),
    ('pensar como All Star', 'pensar como estrella'),
    ('como un All Star', 'como una estrella'),
    ('El gran cierre All Star', 'El gran cierre estelar'),
    ('así se porta un All Star', 'así se porta una estrella'),
    ('El All Star responde', 'La estrella responde'),
    ('de un All Star', 'de una estrella'),
    ('El All Star llega', 'La estrella llega'),
    ('es de All Star', 'es de estrella'),
    ('conducta del All Star', 'conducta de una estrella'),
    ('Un All Star no es solo el que batea', 'Una estrella no es solo quien batea'),
    ('hace un All Star?', 'hace una estrella?'),
    ('¡Eso es un All Star!', '¡Eso es ser estrella!'),
    ('el All Star levanta', 'la estrella levanta'),
    ('un All Star:', 'una estrella:'),
]
# Inglés, chino y japonés (en las traducciones de los niveles 12 y 20 y en la interfaz).
TR = [
    ("'badge': ('All Star', '全明星', 'オールスター')", "'badge': ('Star', '明星', 'スター')"),
    ("'allStar': ('All Star', 'All-Star', '全明星', 'オールスター')", "'allStar': ('Estrella', 'Star', '明星', 'スター')"),
    ("Kids All Star ends here, but", "Pelotín's lessons end here, but"),
    ("Closing of all Kids All Star", "Closing of all of Pelotín"),
    ("the Kids All Star stages", "the Pelotín stages"),
    ("When you finish Kids All Star", "When you finish Pelotín"),
    ("in all of Kids All Star", "in all of Pelotín"),
    ("20 levels of Kids All Star", "20 levels of Pelotín"),
    ("20 exams of Kids All Star", "20 exams of Pelotín"),
    ("'All Star uniform'", "'Star uniform'"),
    ("All Star uniform", "star uniform"),
    ("Think like an All Star", "Think like a star"),
    ("think like an All Star", "think like a star"),
    ("The big All Star finale", "The big star finale"),
    ("how an All Star behaves", "how a star behaves"),
    ("The All Star answers", "The star answers"),
    ("a player from an All Star", "any player from a star"),
    ("The All Star arrives", "The star arrives"),
    ("what an All Star does", "what a star does"),
    ("the All Star's behavior", "a star's behavior"),
    ("An All Star isn't", "A star isn't"),
    ("like an All Star", "like a star"),
    ("does an All Star do", "does a star do"),
    ("That's an All Star!", "That's a star!"),
    ("the All Star lifts", "the star lifts"),
    ("belongs to an All Star", "belongs to a star"),
    ("an All Star:", "a star:"),
    # chino
    ('Kids All Star 到这里结束了', 'Pelotín 的课程到这里结束了'),
    ('名人堂 · KIDS ALL STAR', '名人堂 · PELOTÍN'),
    ('全明星', '明星'),
    # japonés (la marca queda en letras latinas)
    ('Kids All Star はここで終わり', 'Pelotín のレッスンはここで終わり'),
    ('Kids All Starの', 'Pelotínの'),
    ('Kids All Star 全部の', 'Pelotín 全部の'),
    ('Kids All Star の', 'Pelotín の'),
    ('Kids All Star を', 'Pelotín を'),
    ('Kids All Star で', 'Pelotín で'),
    ('オールスター', 'スター'),
    # lo que queda (chino y el título del Plus)
    ('Kids All Star', 'Pelotín'),
]
IT = [
    ('Kids All Star finisce qui', 'Le lezioni di Pelotín finiscono qui'),
    ('Kids All Star', 'Pelotín'),
    ("dell'All Star", 'del campione'),
    ("L'All Star", 'Il campione'),
    ("l'All Star", 'il campione'),
    ('Divisa All Star', 'Divisa da campione'),
    ('divisa All Star', 'divisa da campione'),
    ('grande finale All Star', 'grande finale da campioni'),
    ('un All Star', 'un campione'),
    ('da All Star', 'da campione'),
    ('All Star', 'Campione'),
]
PT = [
    ('O Kids All Star termina aqui', 'As lições do Pelotín terminam aqui'),
    ('Kids All Star', 'Pelotín'),
    ('Uniforme All Star', 'Uniforme de craque'),
    ('uniforme All Star', 'uniforme de craque'),
    ('Pensar como All Star', 'Pensar como craque'),
    ('pensar como All Star', 'pensar como craque'),
    ('grande final All Star', 'grande final de craque'),
    ('O All Star', 'O craque'),
    ('o All Star', 'o craque'),
    ('do All Star', 'do craque'),
    ('um All Star', 'um craque'),
    ('de All Star', 'de craque'),
    ('All Star', 'Craque'),
]
# Interfaz: logo de bienvenida y textos con el nombre en mayúsculas.
UI = [
    ("'appName1': T('KIDS', 'KIDS', 'KIDS', 'KIDS')", "'appName1': T('PELOTÍN', 'PELOTÍN', 'PELOTÍN', 'PELOTÍN')"),
    ("'appName2': T('ALL STAR', 'ALL STAR', 'ALL STAR', 'ALL STAR')", "'appName2': T('BÉISBOL', 'BASEBALL', '棒球', 'ベースボール')"),
    ('KIDS ALL STAR', 'PELOTÍN'),
]


def apply(path, pairs):
    s = open(path).read(); s0 = s
    for old, new in pairs:
        s = s.replace(old, new)
    if s != s0:
        open(path, 'w').write(s)


SRC = [os.path.join(HERE, f) for f in ('guion.json', 'trans_l12.py', 'trans_l20.py', 'exams_nuevos.py', 'spec_l12.py', 'spec_l20.py')]
SRC += [os.path.join(APP, 'docs', f) for f in ('guion-v3-niveles-5-12.md', 'guion-v4-niveles-13-20.md')]
SRC += [os.path.join(TOOLS, 'ui_src.py')]
for p in SRC:
    apply(p, ES)
for p in SRC[1:6] + [os.path.join(TOOLS, 'ui_src.py')]:
    apply(p, TR)
apply(os.path.join(TOOLS, 'ui_src.py'), UI)

# Italiano y portugués: se cambia el texto español de origen y la traducción.
for lang, pairs in (('it', IT), ('pt-BR', PT)):
    p = os.path.join(TOOLS, 'extra', f'{lang}.json')
    d = json.load(open(p))
    for k, e in d.items():
        if 'All Star' in e['es'] or 'ALL STAR' in e['es'] or 'All Star' in e['t'] or 'ALL STAR' in e['t']:
            es = e['es']
            for old, new in ES + UI:
                es = es.replace(old, new)
            t = e['t']
            for old, new in UI + pairs:
                t = t.replace(old, new)
            e['es'], e['t'] = es, t
    d['ui/welcome/appName1'] = {'es': 'PELOTÍN', 't': 'PELOTÍN'}
    d['ui/welcome/appName2'] = {'es': 'BÉISBOL', 't': {'it': 'BASEBALL', 'pt-BR': 'BEISEBOL'}[lang]}
    json.dump(d, open(p, 'w'), ensure_ascii=False, indent=1)
print('listo')
