# Nivel 16 — El turno al bate inteligente.
D = 'diamond'; F9 = 'field9'; Z = 'zone'; M = 'mound'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d
LANE = {'lane': True}

SPEC = {
 'lessons': {
  '16.1': {
   'gloss': ['battersBox', 'stance', 'grip'],
   'demo': [
     seg(Z, []),
     seg(Z, []),
     seg(Z, []),
     seg(Z, []),
     seg(Z, []),
     seg(Z, [], showZone=True, pitch='mid'),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 1}, 4: {'seg': 4, 'images': ['stanceGood', 'outOfBox', 'lookDugout']}, 5: {'seg': 1}, 6: {'seg': 1}},
  },
  '16.2': {
   'gloss': ['checkedSwing'],
   'demo': [
     seg(M, [], pose='release'),
     seg(Z, [], showZone=True, pitch='mid'),
     seg(Z, []),
     seg(Z, []),
     seg(Z, ['count'], count=[1, 0], call='ball'),
     seg(Z, [], showZone=True),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 4}, 4: {'seg': 3}, 5: {'seg': 0}, 6: {'seg': 4}},
  },
  '16.3': {
   'gloss': ['foulTip'],
   'demo': [
     seg(Z, []),
     seg(F9, ['posC']),
     seg(F9, ['posC']),
     seg(Z, ['count'], count=[0, 1], call='strike'),
     seg(Z, ['count'], count=[1, 3], call='k'),
     seg(D, [], foulHit='ground', call='foul'),
     seg(F9, ['posC']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 5}, 4: {'seg': 3}, 5: {'seg': 4}, 6: {'seg': 5}},
  },
  '16.4': {
   'gloss': ['sacBunt', 'runnersLane'],
   'demo': [
     seg(D, ['home'], fx={'ball': {'to': 'bunt', 'kind': 'bunt'}}),
     seg(D, ['home'], fx={'ball': {'to': 'bunt', 'kind': 'bunt'}, 'runners': ['first']}),
     seg(D, ['second'], fx={'ball': {'to': 'bunt', 'kind': 'bunt'}}, run=['first', 'second']),
     seg(D, ['second'], fx={'runners': ['second']}),
     seg(D, ['lane'], fx=LANE),
     seg(D, ['lane', 'first'], fx=LANE, run=['home', 'first']),
     seg(D, ['lane'], fx={'lane': True, 'runners': ['second']}),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 4}, 3: {'seg': 3}, 4: {'seg': 5}, 5: {'seg': 4, 'target': 'lane', 'fx': LANE}, 6: {'seg': 3}},
  },
  '16.5': {
   'gloss': ['helmet'],
   'demo': [
     seg(D, [], fx={'ball': {'to': 'lf', 'kind': 'ground'}}),
     seg(D, ['home']),
     seg(D, ['home']),
     seg(F9, ['posC', 'home']),
     seg(D, ['first'], run=['home', 'first']),
     seg(D, ['lane', 'first'], fx=LANE, run=['home', 'first']),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 4}, 3: {'seg': 4}, 4: {'seg': 3}, 5: {'seg': 4}, 6: {'seg': 5, 'images': ['batDrop', 'batFly', 'noHelmet']}},
  },
 },
 'exam': {},
 'examLessons': ['16.1', '16.1', '16.2', '16.2', '16.3', '16.3', '16.4', '16.4', '16.4', '16.5', '16.5', '16.5'],
}
