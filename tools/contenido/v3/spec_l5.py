# Escenas, toques, arrastres e imágenes del Nivel 5 — Batear y correr.
D = 'diamond'; F9 = 'field9'; Z = 'zone'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}
    d.update(kw)
    return d

SPEC = {
 'lessons': {
  '5.1': {
   'gloss': ['hit', 'safe'],
   'demo': [
     seg(D, ['home']),
     seg(D, ['first'], fx={'ball': {'to': 'gapL', 'kind': 'fly'}}, run=['home', 'first']),
     seg(F9, [], fx={'ball': {'to': 'hole56', 'kind': 'ground'}}),
     seg(D, ['first'], fx={'runners': ['first']}, call='safe'),
     seg(D, ['run-first'], fx={'runners': ['first']}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 2, 'images': ['hitOF', 'caughtAir', 'swingMiss']},
            4: {'seg': 3}, 5: {'seg': 4, 'target': 'first'}, 6: {'seg': 4}},
  },
  '5.2': {
   'gloss': ['single', 'double', 'triple'],
   'demo': [
     seg(D, ['first', 'second', 'third']),
     seg(D, ['first'], fx={'ball': {'to': 'hole34', 'kind': 'ground'}}, run=['home', 'first']),
     seg(D, ['second'], fx={'ball': {'to': 'gapR', 'kind': 'fly'}}, run=['home', 'first', 'second']),
     seg(D, ['third'], fx={'ball': {'to': 'rf', 'kind': 'fly'}}, run=['home', 'first', 'second', 'third']),
     seg(D, ['third'], fx={'runners': ['third']}),
     seg(F9, ['run-mid23'], fx={'runners': ['mid23'], 'ball': {'to': 'lf', 'kind': 'fly'}}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 3},
            4: {'seg': 0, 'place': {'single': 'first', 'double': 'second', 'triple': 'third'}, 'board': 'diamond'},
            5: {'seg': 4}, 6: {'seg': 5}},
  },
  '5.3': {
   'gloss': ['homeRun', 'groundRuleDouble'],
   'demo': [
     seg(D, [], fx={'ball': {'to': 'overC', 'kind': 'out'}}),
     seg(D, ['home'], fx={'ball': {'to': 'overL', 'kind': 'out'}}, run=['home', 'first', 'second', 'third', 'home']),
     seg(D, ['outfield'], fx={'ball': {'to': 'overR', 'kind': 'bounceOut'}}),
     seg(D, ['second'], fx={'ball': {'to': 'overR', 'kind': 'bounceOut'}}, run=['home', 'first', 'second']),
     seg(D, [], fx={'ball': {'to': 'overC', 'kind': 'bounceOut'}}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 3}, 4: {'seg': 3}, 5: {'seg': 1},
            6: {'seg': 4, 'place': {'air': 'hr', 'bounce': 'grd'}, 'board': 'match'}},
  },
  '5.4': {
   'gloss': ['safe'],
   'demo': [
     seg(D, ['first'], run=['home', 'first'], call='safe'),
     seg(D, ['first', 'run-past1'], fx={'runners': ['past1']}),
     seg(D, ['second', 'third']),
     seg(F9, ['run-past2'], fx={'runners': ['past2']}, call='out'),
     seg(D, ['first']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 1}, 4: {'seg': 1, 'target': 'first'},
            5: {'seg': 3, 'images': ['overrun2', 'overrun1back', 'onBase']}, 6: {'seg': 1}},
  },
  '5.5': {
   'gloss': ['bunt'],
   'demo': [
     seg(Z, [], count=[0, 0]),
     seg(D, ['home'], fx={'ball': {'to': 'bunt', 'kind': 'bunt'}}),
     seg(D, ['first'], fx={'ball': {'to': 'bunt', 'kind': 'bunt'}, 'runners': ['lead1']}),
     seg(Z, ['count'], count=[1, 2], call='k'),
     seg(Z, ['count'], count=[1, 2]),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 1}, 3: {'seg': 3}, 4: {'seg': 1, 'images': ['buntPose', 'swingFull', 'batFloor']},
            5: {'seg': 3}, 6: {'seg': 2}},
  },
 },
 'exam': {4: {'target': 'first'}},
 'examLessons': ['5.1', '5.1', '5.1', '5.1', '5.1', '5.2', '5.3', '5.3', '5.4', '5.4', '5.5', '5.5'],
}
