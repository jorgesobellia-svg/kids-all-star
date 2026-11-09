# Nivel 15 — Los jardines.
D = 'diamond'; F9 = 'field9'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d
OF = ['posLF', 'posCF', 'posRF']

SPEC = {
 'lessons': {
  '15.1': {
   'gloss': ['firstStepBack'],
   'demo': [
     seg(F9, ['posCF'], fx={'ball': {'to': 'overC', 'kind': 'fly'}}),
     seg(F9, ['posCF'], fx={'ball': {'to': 'overC', 'kind': 'drop'}}),
     seg(F9, ['posCF'], fx={'ball': {'to': 'cf', 'kind': 'caught'}}),
     seg(F9, ['posCF']),
     seg(F9, ['posCF'], fx={'ball': {'to': 'cf', 'kind': 'caught'}}),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 1}, 3: {'seg': 2}, 4: {'seg': 0, 'images': ['dropStep', 'runIn', 'standStill']}, 5: {'seg': 0}, 6: {'seg': 3}},
  },
  '15.2': {
   'gloss': ['centerFielder', 'priority'],
   'demo': [
     seg(F9, ['posSS', 'pos3b'], fx={'ball': {'to': 'popIF', 'kind': 'fly'}}),
     seg(F9, ['posLF', 'posCF'], fx={'ball': {'to': 'gapL', 'kind': 'fly'}}),
     seg(F9, ['posCF']),
     seg(F9, ['posCF', 'posLF', 'posRF'], fx={'ball': {'to': 'gapL', 'kind': 'caught'}}),
     seg(F9, ['posCF']),
     seg(F9, ['posCF']),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 3}, 3: {'seg': 4}, 4: {'seg': 2}, 5: {'seg': 5, 'target': 'posCF', 'scene': F9}, 6: {'seg': 1}},
  },
  '15.3': {
   'gloss': ['catch15', 'trap'],
   'demo': [
     seg(F9, ['posLF'], fx={'ball': {'to': 'lf', 'kind': 'drop'}}),
     seg(F9, ['posLF']),
     seg(F9, ['posLF'], fx={'ball': {'to': 'lf', 'kind': 'caught'}}, call='out'),
     seg(F9, ['posLF'], fx={'ball': {'to': 'lf', 'kind': 'drop'}}, call='safe'),
     seg(F9, ['posLF']),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 3}, 3: {'seg': 3}, 4: {'seg': 3}, 5: {'seg': 3}, 6: {'seg': 4}},
  },
  '15.4': {
   'gloss': ['ballInFront', 'warningTrack'],
   'demo': [
     seg(F9, OF),
     seg(F9, ['posCF'], fx={'ball': {'to': 'cf', 'kind': 'ground'}}),
     seg(F9, ['posRF'], fx={'ball': {'to': 'overR', 'kind': 'ground'}, 'runners': ['mid12']}),
     seg(F9, OF),
     seg(F9, ['track'], fx={'track': True}),
     seg(F9, ['track', 'posCF'], fx={'track': True, 'ball': {'to': 'overC', 'kind': 'caught'}}),
   ],
   'acts': {1: {'seg': 3}, 2: {'seg': 4}, 3: {'seg': 4}, 4: {'seg': 5}, 5: {'seg': 5}, 6: {'seg': 4, 'target': 'track', 'scene': F9, 'fx': {'track': True}}},
  },
  '15.5': {
   'gloss': ['gloveVisor'],
   'demo': [
     seg(F9, ['posRF'], fx={'ball': {'to': 'rf', 'kind': 'fly'}}),
     seg(F9, ['posRF']),
     seg(F9, ['posRF']),
     seg(F9, ['posRF', 'posCF']),
     seg(F9, ['posRF']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 2}, 4: {'seg': 1, 'images': ['sunVisor', 'coverFace', 'backToBall']}, 5: {'seg': 1}, 6: {'seg': 3}},
  },
 },
 'exam': {},
 'examLessons': ['15.1', '15.1', '15.2', '15.2', '15.3', '15.3', '15.4', '15.4', '15.4', '15.5', '15.5', '15.2'],
}
