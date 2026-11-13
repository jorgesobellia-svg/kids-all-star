# Nivel 7 — El corredor en base.
D = 'diamond'; F9 = 'field9'; B = 'board'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d

SPEC = {
 'lessons': {
  '7.1': {
   'gloss': ['safe', 'runner'],
   'demo': [
     seg(D, ['run-second'], fx={'runners': ['second']}),
     seg(F9, ['run-second'], fx={'runners': ['second']}, call='safe'),
     seg(D, ['second'], fx={'runners': ['second', 'mid12']}),
     seg(D, ['run-mid12'], fx={'runners': ['second', 'mid12']}),
     seg(D, [], fx={'runners': ['first', 'second', 'third']}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 3}, 4: {'seg': 0, 'target': 'third', 'fx': {'runners': ['third']}}, 5: {'seg': 1}, 6: {'seg': 3}},
  },
  '7.2': {
   'gloss': ['tagUp'],
   'demo': [
     seg(F9, ['run-third'], fx={'runners': ['third'], 'ball': {'to': 'cf', 'kind': 'fly'}}),
     seg(F9, ['run-lead3'], fx={'runners': ['lead3']}),
     seg(F9, ['third'], fx={'runners': ['lead3'], 'ball': {'to': 'cf', 'kind': 'caught'}, 'throws': ['posCF', 'third']}, call='out'),
     seg(F9, ['third', 'posCF'], fx={'ball': {'to': 'cf', 'kind': 'caught'}}, run=['third', 'home']),
     seg(D, ['home'], run=['third', 'home'], call='safe'),
   ],
   'acts': {1: {'seg': 3}, 2: {'seg': 1}, 3: {'seg': 2}, 4: {'seg': 3, 'target': 'third', 'fx': {'runners': ['third']}}, 5: {'seg': 4}, 6: {'seg': 3}},
  },
  '7.3': {
   'gloss': ['runner', 'deadBall'],
   'demo': [
     seg(F9, ['run-mid12'], fx={'runners': ['mid12'], 'ball': {'to': 'mid12', 'kind': 'hitRunner'}}),
     seg(F9, ['run-mid12'], fx={'runners': ['mid12'], 'ball': {'to': 'mid12', 'kind': 'hitRunner'}}, call='out'),
     seg(F9, ['pos2b'], fx={'runners': ['mid12'], 'ball': {'to': 'gapR', 'kind': 'ground'}}),
     seg(F9, ['run-mid12'], fx={'runners': ['mid12'], 'ball': {'to': 'mid12', 'kind': 'hitRunner'}}, call='out'),
     seg(F9, ['outfield'], fx={'runners': ['mid12'], 'ball': {'to': 'gapR', 'kind': 'ground'}}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 2}, 4: {'seg': 2}, 5: {'seg': 1},
            6: {'seg': 4, 'target': 'outfield', 'scene': F9, 'fx': {'ball': {'to': 'gapR', 'kind': 'ground'}}}},
  },
  '7.4': {
   'gloss': ['runner', 'passingRunner'],
   'demo': [
     seg(D, [], fx={'runners': ['first', 'second']}),
     seg(D, ['run-mid23'], fx={'runners': ['mid12', 'mid23']}),
     seg(F9, ['run-lead3'], fx={'runners': ['lead3', 'mid23']}, call='out'),
     seg(D, ['run-third'], fx={'runners': ['third', 'mid23']}),
     seg(D, [], fx={'runners': ['first', 'second']}),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 1}, 3: {'seg': 3}, 4: {'seg': 4, 'target': 'run-second', 'fx': {'runners': ['first', 'second']}}, 5: {'seg': 2},
            6: {'seg': 4, 'images': ['rowGood', 'passing', 'backwards']}},
  },
  '7.5': {
   'gloss': ['dependingOnOuts'],
   'demo': [
     seg(B, ['outs'], board={'inning': 5, 'half': 'top', 'outs': 2, 'away': 2, 'home': 1}),
     seg(D, ['home'], fx={'ball': {'to': 'lf', 'kind': 'ground'}}, run=['second', 'third', 'home']),
     seg(F9, ['second'], fx={'runners': ['lead2'], 'ball': {'to': 'cf', 'kind': 'caught'}, 'throws': ['posCF', 'second']}, call='out'),
     seg(B, ['outs'], board={'inning': 5, 'half': 'top', 'outs': 1, 'away': 2, 'home': 1}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 1}, 4: {'seg': 1}, 5: {'seg': 1, 'target': 'home', 'fx': {'runners': ['second'], 'ball': {'to': 'lf', 'kind': 'ground'}}}, 6: {'seg': 3}},
  },
 },
 'exam': {4: {'target': 'first', 'fx': {'runners': ['first']}}},
 'examLessons': ['7.1', '7.1', '7.1', '7.1', '7.2', '7.2', '7.3', '7.3', '7.4', '7.4', '7.5', '7.5'],
}
