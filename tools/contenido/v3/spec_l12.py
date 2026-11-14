# Nivel 12 — Pensar como estrella.
D = 'diamond'; F9 = 'field9'; M = 'mound'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d

SPEC = {
 'lessons': {
  '12.1': {
   'gloss': ['leadRunner', 'sureOut'],
   'demo': [
     seg(F9, ['posSS'], fx={'runners': ['mid12', 'mid3h'], 'ball': {'to': 'hole56', 'kind': 'ground'}}),
     seg(F9, ['first', 'second', 'third', 'home'], fx={'runners': ['mid12']}),
     seg(F9, [], fx={'runners': ['first']}),
     seg(F9, ['second', 'run-mid12'], fx={'runners': ['mid12'], 'throws': ['posSS', 'second']}),
     seg(F9, ['first'], fx={'throws': ['pos3b', 'pos1b']}, call='out'),
     seg(F9, []),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 4}, 3: {'seg': 4}, 4: {'seg': 3, 'target': 'second', 'scene': F9, 'fx': {'runners': ['first'], 'ball': {'to': 'hole56', 'kind': 'ground'}}},
            5: {'seg': 3}, 6: {'seg': 4}},
  },
  '12.2': {
   'gloss': ['cutoff'],
   'demo': [
     seg(F9, ['posCF', 'home'], fx={'throws': ['posCF', 'home'], 'runners': ['mid3h']}),
     seg(F9, ['cutoff', 'posCF'], fx={'throws': ['posCF', 'cutoff'], 'runners': ['mid3h'], 'fielders': ['cutoff']}),
     seg(F9, ['cutoff', 'home'], fx={'throws': ['posCF', 'cutoff', 'home'], 'runners': ['mid3h'], 'fielders': ['cutoff']}),
     seg(F9, ['cutoff'], fx={'fielders': ['cutoff']}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 2, 'route': ['cutoff', 'home'], 'from': 'posCF', 'fx': {'fielders': ['cutoff']}}, 4: {'seg': 1}, 5: {'seg': 1}, 6: {'seg': 3}},
  },
  '12.3': {
   'gloss': ['coverBase', 'backUp'],
   'demo': [
     seg(F9, []),
     seg(F9, ['pos1b', 'mound', 'first'], fx={'ball': {'to': 'gapR', 'kind': 'ground'}, 'throws': ['mound', 'first']}),
     seg(F9, ['second', 'posCF'], fx={'runners': ['mid12'], 'throws': ['posC', 'second']}),
     seg(F9, ['first', 'posCF'], fx={'throws': ['mound', 'first']}),
     seg(F9, []),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 0}, 4: {'seg': 2, 'target': 'posCF', 'scene': F9, 'fx': {'runners': ['mid12'], 'throws': ['posC', 'second']}},
            5: {'seg': 2}, 6: {'seg': 2}},
  },
  '12.4': {
   'gloss': ['baseCoach', 'signs'],
   'demo': [
     seg(D, ['first', 'third']),
     seg(D, ['third'], fx={'runners': ['mid23']}),
     seg(D, ['dugout']),
     seg(M, [], pose='balk'),
     seg(D, [], fx={'runners': ['third']}),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 1}, 3: {'seg': 2}, 4: {'seg': 3}, 5: {'seg': 3}, 6: {'seg': 2}},
  },
  '12.5': {
   'gloss': ['sportsmanship'],
   'demo': [
     seg(D, []),
     seg(D, ['home'], call='strike'),
     seg(D, ['dugout']),
     seg(D, ['home', 'dugout']),
     seg(F9, []),
     seg(D, []),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 1}, 3: {'seg': 1}, 4: {'seg': 3}, 5: {'seg': 1, 'images': ['handshake', 'helmetThrow', 'teasing']}, 6: {'seg': 2}},
  },
 },
 'exam': {4: {'target': 'first'}},
 'examLessons': ['12.1', '12.1', '12.1', '12.1', '12.2', '12.2', '12.3', '12.3', '12.4', '12.4', '12.5', '12.5'],
}
