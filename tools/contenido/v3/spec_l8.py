# Nivel 8 — Los números del juego.
D = 'diamond'; F9 = 'field9'; B = 'board'; Z = 'zone'; LSN = 'linescore'; M = 'mound'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d
LS = {'innings': 6, 'rows': [
  {'team': 'away', 'runs': [1, 0, 2, 0, 2, 0], 'R': 5, 'H': 8, 'E': 1},
  {'team': 'home', 'runs': [0, 1, 0, 2, 0, 0], 'R': 3, 'H': 9, 'E': 0}]}

SPEC = {
 'lessons': {
  '8.1': {
   'gloss': ['hit', 'error'],
   'demo': [
     seg(D, ['run-first'], fx={'runners': ['first']}),
     seg(F9, ['first'], fx={'ball': {'to': 'hole56', 'kind': 'ground'}, 'runners': ['first']}),
     seg(F9, ['posLF'], fx={'ball': {'to': 'lf', 'kind': 'drop'}}),
     seg(F9, ['posSS']),
     seg(F9, [], fx={'ball': {'to': 'hole56', 'kind': 'ground'}}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 2}, 4: {'seg': 2, 'images': ['dropFly', 'cleanHit', 'hrFence']}, 5: {'seg': 3}, 6: {'seg': 3}},
  },
  '8.2': {
   'gloss': ['rbi'],
   'demo': [
     seg(D, ['run-second'], fx={'runners': ['second']}),
     seg(D, ['home'], fx={'ball': {'to': 'lf', 'kind': 'ground'}}, run=['second', 'third', 'home'], call='run'),
     seg(D, ['home'], fx={'ball': {'to': 'hole34', 'kind': 'ground'}}, run=['second', 'third', 'home']),
     seg(D, ['run-first', 'run-second', 'home'], fx={'runners': ['first', 'second'], 'ball': {'to': 'overL', 'kind': 'out'}}),
     seg(B, ['runs'], board={'inning': 4, 'half': 'top', 'outs': 1, 'away': 3, 'home': 1}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 3}, 4: {'seg': 3}, 5: {'seg': 1}, 6: {'seg': 2, 'target': 'home', 'fx': {'runners': ['second']}}},
  },
  '8.3': {
   'gloss': ['hittersCount', 'pitchersCount', 'pitchCount'],
   'demo': [
     seg(Z, ['count'], count=[1, 1]),
     seg(Z, ['count'], count=[2, 0], showZone=True, pitch='mid'),
     seg(Z, ['count'], count=[0, 2], showZone=True),
     seg(Z, [], count=[2, 2]),
     seg(M, [], pose='release'),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 3}, 4: {'seg': 1}, 5: {'seg': 2}, 6: {'seg': 0}},
  },
  '8.4': {
   'gloss': ['strikeoutK'],
   'demo': [
     seg(F9, [], numbers=True),
     seg(F9, [], numbers=True),
     seg(F9, ['posSS', 'pos2b', 'pos1b'], numbers=True, fx={'throws': ['posSS', 'pos2b', 'pos1b']}),
     seg(Z, ['count'], count=[0, 3], call='k'),
     seg(F9, ['posSS'], numbers=True, fx={'ball': {'to': 'hole56', 'kind': 'drop'}}),
     seg(F9, [], numbers=True),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 2}, 3: {'seg': 3}, 4: {'seg': 4}, 5: {'seg': 2, 'route': ['pos2b', 'pos1b'], 'from': 'posSS'}, 6: {'seg': 3}},
  },
  '8.5': {
   'gloss': ['rhe', 'error'],
   'demo': [
     seg(LSN, [], linescore=LS),
     seg(LSN, ['0-0', '1-0', '2-0', '3-0', '4-0', '5-0', '0-1', '1-1', '2-1', '3-1', '4-1', '5-1'], linescore=LS),
     seg(LSN, ['R', 'H', 'E'], linescore=LS),
     seg(LSN, ['R', 'H'], linescore=LS),
     seg(LSN, ['E'], linescore=LS),
     seg(LSN, ['R', 'H', 'E'], linescore=LS),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 2}, 3: {'seg': 3}, 4: {'seg': 2}, 5: {'seg': 3, 'images': ['lsR', 'lsH', 'lsTie']},
            6: {'seg': 5, 'target': 'ls-R0', 'scene': LSN, 'linescore': LS}},
  },
 },
 'exam': {3: {'target': 'posLF', 'scene': 'field9', 'fx': {'ball': {'to': 'lf', 'kind': 'drop'}}}},
 'examLessons': ['8.1', '8.1', '8.1', '8.1', '8.2', '8.2', '8.3', '8.3', '8.4', '8.4', '8.5', '8.5'],
}
