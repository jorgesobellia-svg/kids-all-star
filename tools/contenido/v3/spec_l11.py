# Nivel 11 — El brazo del pitcher. Sin números de lanzamientos, descansos ni distancias.
D = 'diamond'; F9 = 'field9'; M = 'mound'; Z = 'zone'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d

SPEC = {
 'lessons': {
  '11.1': {
   'gloss': ['mound', 'rubber'],
   'demo': [
     seg(M, ['rubber'], pose='set'),
     seg(M, ['rubber'], pose='set'),
     seg(F9, ['mound', 'posC']),
     seg(M, ['distance'], pose='release'),
     seg(M, ['distance'], pose='release'),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 3}, 3: {'seg': 1}, 4: {'seg': 0, 'target': 'mound'}, 5: {'seg': 2}, 6: {'seg': 5}},
  },
  '11.2': {
   'gloss': ['windup', 'setPosition'],
   'demo': [
     seg(M, [], pose='set'),
     seg(M, [], pose='windup'),
     seg(M, [], pose='set'),
     seg(D, [], fx={'runners': ['first']}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 2}, 4: {'seg': 2, 'images': ['setPose', 'windupPose', 'pitcherBatting']}, 5: {'seg': 2}, 6: {'seg': 3}},
  },
  '11.3': {
   'gloss': ['fastball', 'changeup'],
   'demo': [
     seg(M, [], pose='release'),
     seg(M, [], pose='fastball'),
     seg(M, [], pose='changeup'),
     seg(M, [], pose='rest'),
     seg(M, [], pose='rest'),
     seg(M, [], pose='fastball'),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 4}, 4: {'seg': 6}, 5: {'seg': 2}, 6: {'seg': 5, 'images': ['gripFast', 'curveTwist', 'eyesClosed']}},
  },
  '11.4': {
   'gloss': ['pitchCount', 'restDays'],
   'demo': [
     seg(M, [], pose='warm'),
     seg(M, [], pose='rest'),
     seg(D, ['dugout']),
     seg(M, [], pose='warm'),
     seg(M, [], pose='rest'),
     seg(M, [], pose='rest'),
   ],
   'acts': {1: {'seg': 3}, 2: {'seg': 2}, 3: {'seg': 1}, 4: {'seg': 3}, 5: {'seg': 2}, 6: {'seg': 4, 'images': ['restDugout', 'throwDaily', 'armBandage']}},
  },
  '11.5': {
   'gloss': ['reliever'],
   'demo': [
     seg(M, [], pose='rest'),
     seg(F9, ['mound']),
     seg(F9, ['bullpen'], fx={'bullpen': True}),
     seg(M, [], pose='warm'),
     seg(F9, ['mound', 'bullpen'], fx={'bullpen': True}),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 1}, 3: {'seg': 2}, 4: {'seg': 0}, 5: {'seg': 3},
            6: {'seg': 2, 'target': 'bullpen', 'scene': F9, 'fx': {'bullpen': True}}},
  },
 },
 'exam': {4: {'target': 'mound'}},
 'examLessons': ['11.1', '11.1', '11.1', '11.1', '11.2', '11.2', '11.3', '11.3', '11.4', '11.4', '11.5', '11.5'],
}
