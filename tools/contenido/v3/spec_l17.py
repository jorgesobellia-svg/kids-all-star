# Nivel 17 — Estrategia del equipo.
D = 'diamond'; F9 = 'field9'; B = 'board'; Z = 'zone'
def seg(scene=D, hl=(), **kw):
    d = {'scene': scene, 'highlight': list(hl)}; d.update(kw); return d
IF = ['pos1b', 'pos2b', 'posSS', 'pos3b']
OF = ['posLF', 'posCF', 'posRF']

SPEC = {
 'lessons': {
  '17.1': {
   'gloss': ['intentionalWalk'],
   'demo': [
     seg(D, ['first', 'home']),
     seg(D, ['first'], run=['home', 'first']),
     seg(D, ['first'], run=['home', 'first'], call='walk'),
     seg(D, ['first', 'second'], fx={'runners': ['first']}),
     seg(Z, ['count'], count=[0, 0]),
     seg(D, ['dugout']),
   ],
   'acts': {1: {'seg': 2}, 2: {'seg': 3}, 3: {'seg': 3}, 4: {'seg': 5}, 5: {'seg': 3}, 6: {'seg': 2}},
  },
  '17.2': {
   'gloss': ['hitAndRun'],
   'demo': [
     seg(D, ['dugout'], fx={'runners': ['first']}),
     seg(F9, ['run-lead1', 'pos2b'], fx={'runners': ['lead1']}, run=['first', 'second']),
     seg(F9, ['hole34'], fx={'ball': {'to': 'hole34', 'kind': 'ground'}, 'runners': ['mid12']}),
     seg(D, ['third'], run=['first', 'second', 'third']),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 1}, 3: {'seg': 1}, 4: {'seg': 2}, 5: {'seg': 0}, 6: {'seg': 1}},
  },
  '17.3': {
   'gloss': ['squeeze', 'suicideSqueeze'],
   'demo': [
     seg(D, ['run-third'], fx={'runners': ['third']}),
     seg(D, ['home'], fx={'ball': {'to': 'bunt', 'kind': 'bunt'}}, run=['third', 'home']),
     seg(D, ['run-lead3'], fx={'runners': ['lead3']}, run=['third', 'home']),
     seg(D, ['run-mid3h'], fx={'runners': ['mid3h']}),
     seg(D, ['dugout'], fx={'runners': ['third']}),
   ],
   'acts': {1: {'seg': 1}, 2: {'seg': 1}, 3: {'seg': 2}, 4: {'seg': 3}, 5: {'seg': 4}, 6: {'seg': 0, 'target': 'third', 'fx': {'runners': ['third']}}},
  },
  '17.4': {
   'gloss': ['defensivePositioning', 'infieldIn'],
   'demo': [
     seg(F9, IF + OF),
     seg(F9, IF + ['home'], fx={'runners': ['third']}),
     seg(F9, IF, fx={'runners': ['first']}),
     seg(F9, OF),
     seg(F9, ['dugout']),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 1}, 3: {'seg': 2}, 4: {'seg': 3}, 5: {'seg': 4}, 6: {'seg': 0}},
  },
  '17.5': {
   'gloss': ['score', 'walkOff'],
   'demo': [
     seg(B, ['runs', 'innings', 'outs'], board={'inning': 6, 'half': 'bottom', 'outs': 1, 'away': 3, 'home': 3}),
     seg(D, ['run-second'], fx={'runners': ['second']}),
     seg(D, ['home'], fx={'ball': {'to': 'lf', 'kind': 'ground'}}, run=['second', 'third', 'home'], call='safe'),
     seg(B, ['runs'], board={'inning': 6, 'half': 'top', 'outs': 3, 'away': 2, 'home': 5}),
     seg(B, ['runs', 'innings', 'outs'], board={'inning': 6, 'half': 'bottom', 'outs': 2, 'away': 4, 'home': 4}),
   ],
   'acts': {1: {'seg': 0}, 2: {'seg': 2}, 3: {'seg': 2}, 4: {'seg': 3}, 5: {'seg': 4}, 6: {'seg': 2}},
  },
 },
 'exam': {},
 'examLessons': ['17.1', '17.1', '17.2', '17.2', '17.3', '17.3', '17.4', '17.4', '17.5', '17.5', '17.5', '17.4'],
}
