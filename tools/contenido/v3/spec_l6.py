# Nivel 6 — Cómo se hacen outs.
D = 'diamond'; F9 = 'field9'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d

SPEC = {
 'lessons': {
  '6.1': {
   'gloss': ['flyBall', 'lineDrive'],
   'demo': [
     seg(F9, ['posCF'], fx={'ball': {'to': 'cf', 'kind': 'caught'}}, call='out'),
     seg(F9, ['posLF', 'posSS'], fx={'ball': {'to': 'lf', 'kind': 'caught'}}),
     seg(F9, ['pos3b'], foulHit='caught', call='out'),
     seg(F9, ['posRF'], fx={'ball': {'to': 'rf', 'kind': 'drop'}}),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 1}, 3: {'seg': 3}, 4: {'seg': 1, 'images': ['flyOF', 'rollGround', 'softBunt']}, 5: {'seg': 1}, 6: {'seg': 2}},
  },
  '6.2': {
   'gloss': ['forceOut'],
   'demo': [
     seg(D, ['run-first'], fx={'runners': ['first']}),
     seg(F9, ['second'], fx={'runners': ['first'], 'ball': {'to': 'hole56', 'kind': 'ground'}}, run=['home', 'first']),
     seg(D, ['run-mid12', 'second'], fx={'runners': ['mid12']}),
     seg(F9, ['second'], fx={'runners': ['mid12'], 'throws': ['posSS', 'second']}),
     seg(F9, ['second'], fx={'runners': ['mid12'], 'throws': ['posSS', 'second']}, call='out'),
   ],
   'acts': {1: {'seg': 4}, 2: {'seg': 3}, 3: {'seg': 4}, 4: {'seg': 4, 'target': 'second', 'fx': {'runners': ['mid12']}}, 5: {'seg': 4}, 6: {'seg': 1}},
  },
  '6.3': {
   'gloss': ['tagOut'],
   'demo': [
     seg(F9, ['third'], fx={'runners': ['mid23']}),
     seg(F9, ['run-mid23'], fx={'runners': ['mid23'], 'throws': ['posSS', 'mid23']}, call='out'),
     seg(F9, ['run-mid23'], fx={'runners': ['mid23']}),
     seg(D, ['run-lead2'], fx={'runners': ['lead2']}),
     seg(D, ['run-second'], fx={'runners': ['second']}, call='safe'),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 4}, 4: {'seg': 3, 'target': 'run-lead2', 'fx': {'runners': ['lead2']}},
            5: {'seg': 2, 'images': ['tagBall', 'tagEmpty', 'handNoBall']}, 6: {'seg': 1}},
  },
  '6.4': {
   'gloss': ['forceOut', 'tagOut'],
   'demo': [
     seg(D, [], fx={'runners': ['first', 'second']}),
     seg(D, ['first'], fx={'runners': ['second']}),
     seg(D, ['run-second', 'third'], fx={'runners': ['first', 'second']}),
     seg(D, ['run-second'], fx={'runners': ['second']}),
     seg(F9, ['run-mid23', 'first'], fx={'runners': ['mid23']}),
     seg(D, [], fx={'runners': ['first', 'second']}),
   ],
   'acts': {1: {'seg': 4}, 2: {'seg': 2}, 3: {'seg': 1}, 4: {'seg': 3}, 5: {'seg': 2, 'target': 'run-second', 'fx': {'runners': ['first', 'second']}}, 6: {'seg': 4}},
  },
  '6.5': {
   'gloss': ['doublePlay', 'fieldersChoice'],
   'demo': [
     seg(F9, [], fx={'runners': ['first']}),
     seg(F9, ['second', 'first'], fx={'runners': ['first'], 'ball': {'to': 'hole56', 'kind': 'ground'}, 'throws': ['posSS', 'second', 'first']}),
     seg(F9, ['posSS', 'pos2b', 'pos1b'], numbers=True, fx={'throws': ['posSS', 'pos2b', 'pos1b']}),
     seg(F9, ['second'], fx={'runners': ['mid12'], 'throws': ['posSS', 'second']}, run=['home', 'first']),
     seg(D, ['first'], fx={'runners': ['first']}),
     seg(F9, [], fx={'runners': ['first']}),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 1}, 3: {'seg': 3}, 4: {'seg': 1}, 5: {'seg': 1}, 6: {'seg': 4}},
  },
 },
 'exam': {7: {'target': 'anyOF', 'scene': F9}},
 'examLessons': ['6.1'] * 12,
}
