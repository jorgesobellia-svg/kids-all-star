# Nivel 14 — El cuadro a fondo.
D = 'diamond'; F9 = 'field9'; M = 'mound'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d
IF = ['pos1b', 'pos2b', 'posSS', 'pos3b']

SPEC = {
 'lessons': {
  '14.1': {
   'gloss': ['readyPosition'],
   'demo': [
     seg(F9, IF),
     seg(F9, IF),
     seg(F9, ['posSS'], fx={'ball': {'to': 'hole56', 'kind': 'ground'}}),
     seg(M, [], pose='release'),
     seg(F9, IF),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 1}, 4: {'seg': 1, 'images': ['readyPos', 'backTurned', 'chatting']}, 5: {'seg': 3}, 6: {'seg': 4}},
  },
  '14.2': {
   'gloss': ['fieldBall'],
   'demo': [
     seg(F9, ['posSS'], fx={'ball': {'to': 'hole56', 'kind': 'ground'}}),
     seg(F9, ['posSS'], fx={'ball': {'to': 'posSS', 'kind': 'ground'}}),
     seg(F9, ['posSS']),
     seg(F9, ['posSS']),
     seg(F9, ['posSS', 'first'], fx={'throws': ['posSS', 'pos1b']}),
     seg(F9, ['posSS']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 3}, 4: {'seg': 5, 'place': {'front': '1', 'down': '2', 'two': '3', 'throw': '4'}, 'board': 'order'}, 5: {'seg': 2}, 6: {'seg': 2}},
  },
  '14.3': {
   'gloss': ['receiveThrow'],
   'demo': [
     seg(F9, ['pos1b'], fx={'throws': ['posSS', 'pos1b']}),
     seg(F9, ['pos1b', 'first']),
     seg(F9, ['pos1b']),
     seg(F9, ['second', 'first'], fx={'throws': ['posSS', 'pos2b', 'pos1b']}),
     seg(F9, ['pos1b']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 3}, 3: {'seg': 2}, 4: {'seg': 1, 'target': 'first', 'fx': {'runners': ['mid12']}}, 5: {'seg': 2}, 6: {'seg': 1}},
  },
  '14.4': {
   'gloss': ['doublePlay', 'coverBase14'],
   'demo': [
     seg(F9, ['second', 'first'], fx={'runners': ['first'], 'throws': ['posSS', 'pos2b', 'pos1b']}),
     seg(F9, ['second'], fx={'runners': ['first']}),
     seg(F9, ['posSS', 'pos2b'], fx={'runners': ['first']}),
     seg(F9, ['posSS', 'pos2b', 'second'], fx={'runners': ['first'], 'ball': {'to': 'hole56', 'kind': 'ground'}, 'throws': ['posSS', 'second']}),
     seg(F9, ['pos2b', 'posSS', 'second'], fx={'runners': ['first'], 'ball': {'to': 'hole34', 'kind': 'ground'}, 'throws': ['pos2b', 'second']}),
     seg(F9, ['second']),
     seg(F9, IF, fx={'runners': ['first']}),
   ],
   'acts': {1: {'seg': 3}, 2: {'seg': 4}, 3: {'seg': 5}, 4: {'seg': 6}, 5: {'seg': 0, 'target': 'second', 'fx': {'runners': ['first']}}, 6: {'seg': 0}},
  },
  '14.5': {
   'gloss': ['callBall', 'mine', 'backUp14'],
   'demo': [
     seg(F9, ['posSS', 'pos3b'], fx={'ball': {'to': 'popIF', 'kind': 'fly'}}),
     seg(F9, ['posSS', 'pos3b'], fx={'ball': {'to': 'popIF', 'kind': 'drop'}}),
     seg(F9, ['posSS']),
     seg(F9, ['posSS'], fx={'ball': {'to': 'popIF', 'kind': 'caught'}}),
     seg(F9, ['pos3b']),
     seg(F9, ['posSS']),
     seg(F9, IF),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 4}, 3: {'seg': 6}, 4: {'seg': 3}, 5: {'seg': 5}, 6: {'seg': 4, 'images': ['callMine', 'collide', 'lookAway']}},
  },
 },
 'exam': {},
 'examLessons': ['14.1', '14.2', '14.2', '14.2', '14.3', '14.3', '14.4', '14.4', '14.5', '14.5', '14.4', '14.5'],
}
