# Nivel 20 — El gran cierre estelar (todo repaso + ceremonia).
D = 'diamond'; F9 = 'field9'; Z = 'zone'; M = 'mound'; B = 'board'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d

SPEC = {
 'lessons': {
  '20.1': {
   'gloss': ['finalReview'],
   'demo': [
     seg(D, ['all']),
     seg(F9, ['first', 'second', 'third', 'home'], numbers=True),
     seg(Z, [], showZone=True, pitch='mid', call='strike', count=[0, 1]),
     seg(Z, ['count'], count=[3, 2]),
     seg(D, ['all']),
     seg(D, ['all']),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 1}, 3: {'seg': 1, 'target': 'third'}, 4: {'seg': 2}, 5: {'seg': 3},
            6: {'seg': 2, 'place': {'zone': 'strikeSlot', 'fourth': 'walkSlot', 'deflect': 'foulSlot'}, 'board': 'match'}},
  },
  '20.2': {
   'gloss': ['finalReview'],
   'demo': [
     seg(D, []),
     seg(D, ['second'], fx={'ball': {'to': 'lf', 'kind': 'ground'}}, run=['home', 'first', 'second']),
     seg(F9, ['second', 'first', 'pos2b', 'pos1b'], fx={'runners': ['first']}),
     seg(F9, ['posCF', 'third'], fx={'runners': ['third']}),
     seg(B, ['runs'], board={'inning': 3, 'half': 'top', 'outs': 1, 'away': 2, 'home': 1}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 4}, 4: {'seg': 3}, 5: {'seg': 2, 'target': 'second', 'fx': {'runners': ['first']}}, 6: {'seg': 2}},
  },
  '20.3': {
   'gloss': ['finalReview'],
   'demo': [
     seg(D, []),
     seg(D, ['second'], run=['first', 'second']),
     seg(M, [], pose='release'),
     seg(D, ['all']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 1}, 3: {'seg': 2}, 4: {'seg': 1}, 5: {'seg': 2},
            6: {'seg': 2, 'target': 'bullpen', 'scene': F9, 'fx': {'bullpen': True}}},
  },
  '20.4': {
   'gloss': ['foulTip', 'walkOff'],
   'demo': [
     seg(D, ['all']),
     seg(F9, ['posC', 'posCF', 'posLF']),
     seg(D, ['dugout']),
     seg(D, ['all']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 1}, 3: {'seg': 2}, 4: {'seg': 1},
            5: {'seg': 3, 'target': 'third', 'fx': {'runners': ['first', 'third']}}, 6: {'seg': 2}},
  },
  '20.5': {
   'gloss': ['hallOfFame', 'graduation', 'playBall'],
   'demo': [
     seg(D, ['all']),
     seg(D, ['home'], run=['home', 'first', 'second', 'third', 'home']),
     seg(D, ['all']),
     seg(D, ['home']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 2}, 4: {'seg': 2, 'images': ['teamField', 'tvAlone', 'trophyShelf']}, 5: {'seg': 3},
            6: {'seg': 2, 'place': {'body': 'bodySlot', 'mate': 'mateSlot'}, 'board': 'match'}},
  },
 },
 'exam': {},
 'examLessons': ['20.1', '20.1', '20.2', '20.2', '20.3', '20.3', '20.3', '20.4', '20.4', '20.4', '20.4', '20.5'],
}
