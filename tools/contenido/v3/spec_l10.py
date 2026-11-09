# Nivel 10 — Reglas especiales.
D = 'diamond'; F9 = 'field9'; Z = 'zone'; B = 'board'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d
DROP = {'backstop': True, 'ball': {'to': 'backstop', 'kind': 'drop'}}

SPEC = {
 'lessons': {
  '10.1': {
   'gloss': ['droppedThird'],
   'demo': [
     seg(Z, ['count'], count=[1, 3], call='k'),
     seg(F9, ['posC', 'first'], fx=DROP, run=['home', 'first']),
     seg(F9, ['posC'], fx=DROP),
     seg(B, ['outs'], board={'inning': 3, 'half': 'top', 'outs': 2, 'away': 1, 'home': 1}),
     seg(F9, ['posC', 'pos1b'], fx={'throws': ['posC', 'pos1b']}, run=['home', 'first']),
     seg(D, ['dugout']),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 3}, 4: {'seg': 3}, 5: {'seg': 4}, 6: {'seg': 6}},
  },
  '10.2': {
   'gloss': ['infieldFly'],
   'demo': [
     seg(D, [], fx={'runners': ['first', 'second']}),
     seg(F9, ['run-first', 'run-second'], fx={'runners': ['first', 'second'], 'ball': {'to': 'popIF', 'kind': 'fly'}}),
     seg(F9, ['run-lead1', 'run-lead2'], fx={'runners': ['lead1', 'lead2'], 'ball': {'to': 'popIF', 'kind': 'drop'}, 'throws': ['posSS', 'third']}),
     seg(F9, ['posSS'], fx={'runners': ['first', 'second'], 'ball': {'to': 'popIF', 'kind': 'fly'}}, call='out'),
     seg(F9, ['run-first', 'run-second'], fx={'runners': ['first', 'second'], 'ball': {'to': 'popIF', 'kind': 'drop'}}),
     seg(D, [], fx={'runners': ['first', 'second']}),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 1}, 3: {'seg': 3}, 4: {'seg': 3}, 5: {'seg': 4}, 6: {'seg': 1, 'images': ['popIF', 'lineOF', 'deepFly']}},
  },
  '10.3': {
   'gloss': ['liveBall', 'deadBall', 'hbp'],
   'demo': [
     seg(D, []),
     seg(D, ['second'], fx={'runners': ['first']}, run=['first', 'second']),
     seg(D, ['run-mid12'], fx={'runners': ['mid12']}, call='time'),
     seg(D, ['foulLine'], foulHit='ground', call='foul'),
     seg(D, [], call='time'),
     seg(Z, [], call='hbp'),
     seg(D, ['run-first'], fx={'runners': ['first']}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 2}, 4: {'seg': 4}, 5: {'seg': 5},
            6: {'seg': 3, 'target': 'first', 'fx': {'runners': ['mid12']}}},
  },
  '10.4': {
   'gloss': ['interference', 'obstruction'],
   'demo': [
     seg(F9, []),
     seg(F9, ['posSS', 'run-hole56'], fx={'runners': ['hole56'], 'ball': {'to': 'hole56', 'kind': 'ground'}}, call='out'),
     seg(D, ['fld-mid12', 'run-past1'], fx={'runners': ['past1'], 'fielders': ['mid12']}, run=['first', 'second'], call='safe'),
     seg(F9, ['posSS', 'run-hole56'], fx={'runners': ['hole56'], 'ball': {'to': 'hole56', 'kind': 'ground'}}),
     seg(D, ['fld-mid12'], fx={'runners': ['past1'], 'fielders': ['mid12']}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 2}, 4: {'seg': 1}, 5: {'seg': 4},
            6: {'seg': 4, 'target': 'fld-mid12', 'fx': {'runners': ['past1'], 'fielders': ['mid12']}}},
  },
  '10.5': {
   'gloss': ['appeal'],
   'demo': [
     seg(D, ['first', 'second', 'third', 'home'], run=['home', 'first', 'second', 'third', 'home']),
     seg(D, ['second'], fx={'runners': ['mid23']}),
     seg(F9, ['second', 'pos2b'], fx={'runners': ['third'], 'throws': ['posCF', 'pos2b']}),
     seg(F9, ['second'], fx={'runners': ['third']}, call='out'),
     seg(D, ['run-third'], fx={'runners': ['third']}),
     seg(F9, []),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 4}, 3: {'seg': 2}, 4: {'seg': 3}, 5: {'seg': 1},
            6: {'seg': 1, 'target': 'third', 'fx': {'runners': ['mid3h']}}},
  },
 },
 'exam': {9: {'target': 'first'}},
 'examLessons': ['10.1'] * 12,
}
