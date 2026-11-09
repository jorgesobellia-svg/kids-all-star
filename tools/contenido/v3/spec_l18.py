# Nivel 18 — Reglas de la liga y del partido. Sin marcadores con números (la app no fija diferencias ni entradas).
D = 'diamond'; F9 = 'field9'; LU = 'lineup'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d

SPEC = {
 'lessons': {
  '18.1': {
   'gloss': ['slide'],
   'demo': [
     seg(D, ['second'], run=['first', 'second']),
     seg(D, ['second'], run=['first', 'second'], call='safe'),
     seg(D, ['second'], fx={'runners': ['second']}),
     seg(F9, ['pos2b', 'second']),
     seg(D, ['second']),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 2}, 3: {'seg': 3}, 4: {'seg': 5}, 5: {'seg': 1}, 6: {'seg': 2, 'images': ['slideFeet', 'slideHead', 'slideCrash']}},
  },
  '18.2': {
   'gloss': ['mercyRule'],
   'demo': [
     seg(D, ['home'], run=['third', 'home'], call='run'),
     seg(D, ['dugout']),
     seg(D, ['home', 'dugout']),
     seg(D, ['dugout']),
     seg(D, []),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 3}, 3: {'seg': 3}, 4: {'seg': 2}, 5: {'seg': 1}, 6: {'seg': 2}},
  },
  '18.3': {
   'gloss': ['officialGame', 'suspendedGame', 'extraInning'],
   'demo': [
     seg(D, []),
     seg(D, ['home']),
     seg(D, ['dugout'], call='time'),
     seg(D, ['home'], run=['home', 'first']),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 2}, 4: {'seg': 3}, 5: {'seg': 4}, 6: {'seg': 2}},
  },
  '18.4': {
   'gloss': ['substitution', 'reentry'],
   'demo': [
     seg(D, ['dugout']),
     seg(LU, [], batter=4, marked=[1, 2, 3]),
     seg(D, ['dugout']),
     seg(D, ['dugout']),
     seg(LU, [], batter=6, marked=[1, 2, 3, 4]),
     seg(LU, [], batter=5, marked=[1, 2, 3, 4]),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 4}, 4: {'seg': 5}, 5: {'seg': 1}, 6: {'seg': 5}},
  },
  '18.5': {
   'gloss': ['courtesyRunner'],
   'demo': [
     seg(F9, ['posC']),
     seg(D, ['first', 'dugout'], run=['home', 'first'], fx={'runners': ['first']}),
     seg(F9, ['mound']),
     seg(D, ['dugout']),
     seg(D, ['dugout']),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 1}, 3: {'seg': 3}, 4: {'seg': 1}, 5: {'seg': 2}, 6: {'seg': 4}},
  },
 },
 'exam': {},
 'examLessons': ['18.1', '18.1', '18.2', '18.2', '18.3', '18.3', '18.3', '18.4', '18.4', '18.4', '18.5', '18.5'],
}
