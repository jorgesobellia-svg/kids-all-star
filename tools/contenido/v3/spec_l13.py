# Nivel 13 — El catcher: el general del campo.
D = 'diamond'; F9 = 'field9'; Z = 'zone'; M = 'mound'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d

SPEC = {
 'lessons': {
  '13.1': {
   'gloss': ['catcher', 'catcherMitt', 'chestProtector', 'shinGuards'],
   'demo': [
     seg(F9, ['posC']),
     seg(F9, ['posC']),
     seg(F9, ['posC']),
     seg(M, [], pose='warm'),
     seg(F9, ['posC']),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 1, 'images': ['catcherReady', 'catcherCap', 'catcherNoGlove']}, 3: {'seg': 3}, 4: {'seg': 2},
            5: {'seg': 1, 'place': {'mask': 'face', 'chest': 'chestSlot', 'shins': 'legs'}, 'board': 'match'}, 6: {'seg': 4}},
  },
  '13.2': {
   'gloss': ['signs'],
   'demo': [
     seg(F9, ['posC', 'mound']),
     seg(F9, ['posC']),
     seg(F9, ['posC']),
     seg(F9, ['posC']),
     seg(M, [], pose='set'),
     seg(F9, ['dugout', 'posC']),
     seg(F9, ['posC', 'mound'], call='time'),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 1}, 3: {'seg': 6}, 4: {'seg': 5}, 5: {'seg': 5, 'target': 'posC', 'scene': F9}, 6: {'seg': 3}},
  },
  '13.3': {
   'gloss': ['block'],
   'demo': [
     seg(F9, ['posC'], fx={'ball': {'to': 'home', 'kind': 'ground'}}),
     seg(F9, ['posC']),
     seg(F9, ['posC']),
     seg(F9, ['posC'], fx={'runners': ['third']}),
     seg(F9, ['posC']),
     seg(F9, ['posC']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 1}, 4: {'seg': 2, 'images': ['blockGood', 'catcherSide', 'catcherJump']}, 5: {'seg': 4}, 6: {'seg': 5}},
  },
  '13.4': {
   'gloss': ['catcherInterference'],
   'demo': [
     seg(Z, []),
     seg(Z, []),
     seg(D, ['first'], run=['home', 'first']),
     seg(Z, []),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 1}, 4: {'seg': 3}, 5: {'seg': 2}, 6: {'seg': 2}},
  },
  '13.5': {
   'gloss': ['playAtPlate'],
   'demo': [
     seg(F9, ['home', 'posCF'], fx={'runners': ['mid3h'], 'throws': ['posCF', 'home']}),
     seg(F9, ['home'], fx={'runners': ['mid3h']}),
     seg(F9, ['home', 'posC'], fx={'runners': ['mid3h'], 'throws': ['posCF', 'posC']}),
     seg(F9, ['home'], fx={'runners': ['mid3h']}),
     seg(F9, ['home'], fx={'runners': ['mid3h']}),
     seg(F9, ['home'], fx={'runners': ['mid3h']}, call='out'),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 3}, 3: {'seg': 2}, 4: {'seg': 4}, 5: {'seg': 1, 'target': 'home', 'fx': {'runners': ['mid3h']}}, 6: {'seg': 5}},
  },
 },
 'exam': {},
 'examLessons': ['13.1', '13.1', '13.2', '13.2', '13.3', '13.3', '13.4', '13.4', '13.5', '13.5', '13.5', '13.1'],
}
