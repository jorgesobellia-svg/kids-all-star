# Nivel 9 — Robo de base y el pitcher.
D = 'diamond'; F9 = 'field9'; M = 'mound'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d

SPEC = {
 'lessons': {
  '9.1': {
   'gloss': ['stolenBase', 'sbScoring', 'caughtStealing'],
   'demo': [
     seg(F9, ['run-first', 'second'], fx={'runners': ['first']}),
     seg(F9, ['second'], run=['first', 'second']),
     seg(F9, ['posC', 'second'], fx={'throws': ['posC', 'second']}, run=['first', 'second'], call='safe'),
     seg(D, [], fx={'runners': ['first']}),
     seg(D, ['dugout'], fx={'runners': ['first']}),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 3}, 3: {'seg': 2}, 4: {'seg': 2}, 5: {'seg': 0, 'target': 'second', 'fx': {'runners': ['first']}}, 6: {'seg': 4}},
  },
  '9.2': {
   'gloss': ['lead'],
   'demo': [
     seg(D, ['run-lead1'], fx={'runners': ['lead1']}),
     seg(D, ['run-lead1'], fx={'runners': ['lead1']}),
     seg(D, ['run-lead1', 'path12'], fx={'runners': ['lead1'], 'path12': True}),
     seg(F9, ['first'], fx={'runners': ['lead1'], 'throws': ['mound', 'first']}),
     seg(D, ['home'], fx={'runners': ['first']}),
     seg(D, ['dugout'], fx={'runners': ['first']}),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 2}, 3: {'seg': 3}, 4: {'seg': 2, 'target': 'path12', 'fx': {'path12': True}}, 5: {'seg': 4}, 6: {'seg': 3}},
  },
  '9.3': {
   'gloss': ['pickoff'],
   'demo': [
     seg(M, [], pose='set'),
     seg(M, [], pose='pickoff'),
     seg(F9, ['first', 'run-lead1'], fx={'runners': ['lead1'], 'throws': ['mound', 'pos1b']}, call='out'),
     seg(D, ['run-lead1'], fx={'runners': ['lead1']}),
     seg(F9, ['second'], fx={'runners': ['lead1'], 'throws': ['mound', 'foulL']}, run=['first', 'second']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 4}, 4: {'seg': 2, 'target': 'first', 'fx': {'runners': ['lead1']}}, 5: {'seg': 2}, 6: {'seg': 3}},
  },
  '9.4': {
   'gloss': ['balk'],
   'demo': [
     seg(M, [], pose='set'),
     seg(M, [], pose='balk'),
     seg(D, ['second'], fx={'runners': ['first']}, run=['first', 'second'], call='balk'),
     seg(M, [], pose='balk'),
     seg(D, ['dugout'], fx={'runners': ['first']}),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 1}, 4: {'seg': 1, 'images': ['pitchStop', 'pitchNormal', 'pickoffLegal']}, 5: {'seg': 2}, 6: {'seg': 4}},
  },
  '9.5': {
   'gloss': ['wildPitch', 'passedBall'],
   'demo': [
     seg(D, ['backstop'], fx={'runners': ['third'], 'backstop': True, 'ball': {'to': 'backstop', 'kind': 'ground'}}),
     seg(D, ['posC'], fx={'backstop': True}),
     seg(F9, ['mound'], fx={'backstop': True, 'ball': {'to': 'backstop', 'kind': 'ground'}}),
     seg(F9, ['posC'], fx={'backstop': True, 'ball': {'to': 'backstop', 'kind': 'ground'}}),
     seg(F9, ['home', 'backstop'], fx={'backstop': True, 'ball': {'to': 'backstop', 'kind': 'ground'}}, run=['third', 'home']),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 3}, 3: {'seg': 4}, 4: {'seg': 1}, 5: {'seg': 4},
            6: {'seg': 4, 'target': 'backstop', 'scene': F9, 'fx': {'backstop': True, 'ball': {'to': 'backstop', 'kind': 'ground'}}}},
  },
 },
 'exam': {7: {'target': 'second', 'fx': {'runners': ['first']}}},
 'examLessons': ['9.1'] * 12,
}
