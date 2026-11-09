# Nivel 19 — Cuerpo y mente de un jugador. Sin números de lanzamientos ni de descanso.
D = 'diamond'; F9 = 'field9'; Z = 'zone'; M = 'mound'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d

SPEC = {
 'lessons': {
  '19.1': {
   'gloss': ['warmUp'],
   'demo': [
     seg(D, []),
     seg(D, ['first'], run=['home', 'first']),
     seg(M, [], pose='release'),
     seg(D, ['dugout']),
     seg(D, ['all']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 1}, 3: {'seg': 3}, 4: {'seg': 1}, 5: {'seg': 4}, 6: {'seg': 1, 'images': ['warmSoft', 'warmHard', 'sitting']}},
  },
  '19.2': {
   'gloss': ['hydration', 'shade', 'rest'],
   'demo': [
     seg(D, ['all']),
     seg(D, ['dugout']),
     seg(D, ['dugout']),
     seg(D, ['dugout']),
     seg(D, ['dugout']),
     seg(D, ['dugout']),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 2}, 3: {'seg': 4}, 4: {'seg': 3}, 5: {'seg': 5}, 6: {'seg': 3, 'images': ['waterShade', 'noWater', 'jackets']}},
  },
  '19.3': {
   'gloss': ['resetBreathing'],
   'demo': [
     seg(Z, []),
     seg(Z, []),
     seg(Z, [], showZone=True),
     seg(Z, []),
     seg(Z, [], showZone=True, pitch='mid'),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 2}, 3: {'seg': 1}, 4: {'seg': 2},
            5: {'seg': 2, 'place': {'breathe': '1', 'look': '2', 'phrase': '3', 'next': '4'}, 'board': 'order'}, 6: {'seg': 2}},
  },
  '19.4': {
   'gloss': ['letItGo', 'leader'],
   'demo': [
     seg(Z, [], showZone=True, pitch='mid', swing=True, call='strike', count=[0, 1]),
     seg(Z, []),
     seg(D, ['all']),
     seg(F9, ['posCF'], fx={'ball': {'to': 'cf', 'kind': 'drop'}}),
     seg(D, ['dugout']),
     seg(D, ['all']),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 3}, 3: {'seg': 4}, 4: {'seg': 0}, 5: {'seg': 2}, 6: {'seg': 4}},
  },
  '19.5': {
   'gloss': ['safetyLimits'],
   'demo': [
     seg(D, []),
     seg(D, []),
     seg(D, []),
     seg(M, [], pose='set'),
     seg(M, [], pose='release'),
     seg(M, [], pose='set'),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 4}, 3: {'seg': 6}, 4: {'seg': 6}, 5: {'seg': 1}, 6: {'seg': 4}},
  },
 },
 'exam': {},
 'examLessons': ['19.1', '19.1', '19.2', '19.2', '19.2', '19.3', '19.3', '19.4', '19.4', '19.4', '19.5', '19.5'],
}
