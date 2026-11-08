import type { Level, Lesson } from './types';

// Nivel 1 — Bienvenido al diamante.
// Fuente: "Kids All Star - Contenido Niveles 1-4", Versión 2.
// Las respuestas correctas están copiadas del guion; no se cambian aquí sin aprobación.

const L1: Lesson[] = [
  {
    id: '1.1',
    level: 1,
    glossary: ['diamond', 'infield', 'outfield', 'foulLine'],
    demo: [
      { scene: 'diamond', highlight: ['all'] },
      { scene: 'diamond', highlight: ['infield'] },
      { scene: 'diamond', highlight: ['outfield'] },
      { scene: 'diamond', highlight: ['foulLine'] },
    ],
    activities: [
      { n: 1, type: 'tap', scene: 'diamond', target: 'infield', seg: 1 },
      {
        n: 2, type: 'choiceImg', options: ['outfield', 'dugout', 'home'], correct: 'outfield', seg: 2,
        images: { outfield: 'zone-outfield', dugout: 'zone-dugout', home: 'zone-home' },
      },
      { n: 3, type: 'tf', correct: 'true', seg: 3 },
      { n: 4, type: 'tap', scene: 'diamond', target: 'foulLine', seg: 3 },
      { n: 5, type: 'choice', options: ['shape', 'money', 'glass'], correct: 'shape', seg: 0 },
      {
        n: 6, type: 'choiceImg', options: ['outfield', 'dugout', 'home'], correct: 'outfield', seg: 2,
        images: { outfield: 'zone-outfield', dugout: 'zone-dugout', home: 'zone-home' },
      },
    ],
  },
  {
    id: '1.2',
    level: 1,
    glossary: ['first', 'second', 'third'],
    demo: [
      { scene: 'diamond', highlight: ['home'] },
      { scene: 'diamond', highlight: ['first'] },
      { scene: 'diamond', highlight: ['second'] },
      { scene: 'diamond', highlight: ['third'] },
      { scene: 'diamond', highlight: ['first', 'second', 'third'], run: ['home', 'first', 'second', 'third'] },
    ],
    activities: [
      { n: 1, type: 'tap', scene: 'diamond', target: 'first', seg: 1 },
      { n: 2, type: 'choice', options: ['second', 'third', 'home'], correct: 'second', seg: 2 },
      { n: 3, type: 'drag', route: ['first', 'second', 'third'], seg: 4 },
      { n: 4, type: 'tf', correct: 'false', seg: 4 },
      {
        n: 5, type: 'choiceImg', options: ['square', 'circle', 'triangle'], correct: 'square', seg: 4,
        images: { square: 'shape-square', circle: 'shape-circle', triangle: 'shape-triangle' },
      },
      { n: 6, type: 'tap', scene: 'diamond', target: 'third', seg: 3 },
    ],
  },
  {
    id: '1.3',
    level: 1,
    glossary: ['home', 'run'],
    demo: [
      { scene: 'diamond', highlight: ['home'] },
      { scene: 'diamond', highlight: ['home'] },
      { scene: 'diamond', highlight: ['home'], run: ['home', 'first', 'second', 'third', 'home'] },
    ],
    activities: [
      { n: 1, type: 'tap', scene: 'diamond', target: 'home', seg: 0 },
      { n: 2, type: 'choice', options: ['bat', 'pitch', 'wait'], correct: 'bat', seg: 1 },
      { n: 3, type: 'choice', options: ['lap', 'second', 'hit'], correct: 'lap', seg: 2 },
      { n: 4, type: 'tf', correct: 'false', seg: 0 },
      { n: 5, type: 'umpire', options: ['run', 'out', 'strike'], correct: 'run', seg: 2 },
      {
        n: 6, type: 'choiceImg', options: ['runs', 'goals', 'baskets'], correct: 'runs', seg: 2,
        images: { runs: 'sport-run', goals: 'sport-goal', baskets: 'sport-basket' },
      },
    ],
  },
  {
    id: '1.4',
    level: 1,
    glossary: ['dugout', 'onDeck'],
    demo: [
      { scene: 'diamond', highlight: ['dugout'] },
      { scene: 'diamond', highlight: ['dugout'] },
      { scene: 'diamond', highlight: ['onDeck'] },
    ],
    activities: [
      { n: 1, type: 'tap', scene: 'diamond', target: 'dugout', seg: 0 },
      { n: 2, type: 'choice', options: ['batting', 'defending', 'umps'], correct: 'batting', seg: 1 },
      { n: 3, type: 'tf', correct: 'false', seg: 1 },
      {
        n: 4, type: 'choiceImg', options: ['next', 'pitcher', 'catcher'], correct: 'next', seg: 2,
        images: { next: 'player-batter', pitcher: 'player-pitcher', catcher: 'player-catcher' },
      },
      { n: 5, type: 'choice', options: ['gear', 'snack', 'phone'], correct: 'gear', seg: 1 },
      { n: 6, type: 'umpire', options: ['defend', 'home', 'keep'], correct: 'defend', seg: 1 },
    ],
  },
  {
    id: '1.5',
    level: 1,
    glossary: ['bat', 'glove', 'helmet', 'ball'],
    demo: [
      { scene: 'gear', highlight: ['bat', 'glove', 'helmet', 'ball'] },
      { scene: 'gear', highlight: ['bat'] },
      { scene: 'gear', highlight: ['glove'] },
      { scene: 'gear', highlight: ['ball'] },
      { scene: 'gear', highlight: ['helmet'] },
    ],
    activities: [
      {
        n: 1, type: 'choiceImg', options: ['bat', 'glove', 'helmet'], correct: 'bat', seg: 1,
        images: { bat: 'gear-bat', glove: 'gear-glove', helmet: 'gear-helmet' },
      },
      {
        n: 2, type: 'choiceImg', options: ['glove', 'bat', 'home'], correct: 'glove', seg: 2,
        images: { glove: 'gear-glove', bat: 'gear-bat', home: 'zone-home' },
      },
      { n: 3, type: 'tf', correct: 'true', seg: 4 },
      { n: 4, type: 'choice', options: ['ask', 'anyway', 'cap'], correct: 'ask', seg: 4 },
      { n: 5, type: 'tap', scene: 'gear', target: 'ball', seg: 3 },
      { n: 6, type: 'choice', options: ['left', 'right', 'both'], correct: 'left', seg: 2 },
    ],
  },
];


// Nivel 2 — Las posiciones (Prompt 2). Respuestas correctas copiadas del guion.
const F9 = 'field9' as const;
const L2: Lesson[] = [
  {
    id: '2.1',
    level: 2,
    glossary: ['pitcher', 'catcher', 'battery', 'mound'],
    demo: [
      { scene: F9, highlight: ['mound'] },
      { scene: F9, highlight: ['posC'] },
      { scene: F9, highlight: ['mound', 'posC'] },
    ],
    activities: [
      { n: 1, type: 'tap', scene: F9, target: 'mound', seg: 0 },
      {
        n: 2, type: 'choiceImg', options: ['behind', 'first', 'outfield'], correct: 'behind', seg: 1,
        images: { behind: 'zone-behindhome', first: 'zone-first', outfield: 'zone-outfield' },
      },
      { n: 3, type: 'choice', options: ['pitcher', 'catcher', 'umpire'], correct: 'pitcher', seg: 0 },
      { n: 4, type: 'tf', correct: 'true', seg: 2 },
      { n: 5, type: 'choice', options: ['gear', 'bigbat', 'gloves'], correct: 'gear', seg: 1 },
      { n: 6, type: 'umpire', options: ['strike', 'run', 'foul'], correct: 'strike', seg: 1 },
    ],
  },
  {
    id: '2.2',
    level: 2,
    glossary: ['firstBaseman', 'thirdBaseman'],
    demo: [
      { scene: F9, highlight: ['pos1b', 'pos3b'] },
      { scene: F9, highlight: ['pos1b'] },
      { scene: F9, highlight: ['pos3b'] },
      { scene: F9, highlight: ['pos3b'] },
    ],
    activities: [
      { n: 1, type: 'tap', scene: F9, target: 'pos1b', seg: 1 },
      { n: 2, type: 'tap', scene: F9, target: 'pos3b', seg: 2 },
      { n: 3, type: 'choice', options: ['out', 'tall', 'throws'], correct: 'out', seg: 1 },
      { n: 4, type: 'choice', options: ['hard', 'sun', 'dugout'], correct: 'hard', seg: 3 },
      { n: 5, type: 'tf', correct: 'true', seg: 1 },
      { n: 6, type: 'drag', board: 'diamond', place: { t1b: 'pos1b', t3b: 'pos3b' }, seg: 0 },
    ],
  },
  {
    id: '2.3',
    level: 2,
    glossary: ['secondBaseman', 'shortstop'],
    demo: [
      { scene: F9, highlight: ['pos2b', 'posSS'] },
      { scene: F9, highlight: ['pos2b', 'posSS', 'second'] },
      { scene: F9, highlight: ['pos2b', 'posSS'] },
    ],
    activities: [
      { n: 1, type: 'tap', scene: F9, target: 'posSS', seg: 0 },
      { n: 2, type: 'tap', scene: F9, target: 'pos2b', seg: 0 },
      { n: 3, type: 'choice', options: ['nobody', 'biggest', 'bat'], correct: 'nobody', seg: 1 },
      { n: 4, type: 'tf', correct: 'true', seg: 0 },
      {
        n: 5, type: 'choiceImg', options: ['middle', 'catcher', 'rf'], correct: 'middle', seg: 1,
        images: { middle: 'pos-middle', catcher: 'pos-catcher', rf: 'pos-rf' },
      },
      { n: 6, type: 'drag', board: 'diamond', place: { tss: 'posSS', t2b: 'pos2b' }, seg: 0 },
    ],
  },
  {
    id: '2.4',
    level: 2,
    glossary: ['leftFielder', 'centerFielder', 'rightFielder'],
    demo: [
      { scene: F9, highlight: ['posLF', 'posCF', 'posRF'] },
      { scene: F9, highlight: ['outfield'] },
      { scene: F9, highlight: ['posCF'] },
      { scene: F9, highlight: ['home', 'posLF', 'posRF'] },
    ],
    activities: [
      { n: 1, type: 'tap', scene: F9, target: 'posCF', seg: 2 },
      { n: 2, type: 'choice', options: ['three', 'two', 'four'], correct: 'three', seg: 0 },
      { n: 3, type: 'tf', correct: 'true', seg: 3 },
      { n: 4, type: 'choice', options: ['center', 'right', 'none'], correct: 'center', seg: 2 },
      {
        n: 5, type: 'choiceImg', options: ['outfielder', 'catcher', 'first'], correct: 'outfielder', seg: 1,
        images: { outfielder: 'pos-outfielder', catcher: 'pos-catcher', first: 'pos-1b' },
      },
      { n: 6, type: 'drag', board: 'diamond', place: { tlf: 'posLF', tcf: 'posCF', trf: 'posRF' }, seg: 3 },
    ],
  },
  {
    id: '2.5',
    level: 2,
    glossary: ['pitcher', 'catcher', 'shortstop', 'centerFielder'],
    demo: [
      { scene: F9, highlight: [] },
      { scene: F9, highlight: ['mound'], numbers: true },
      { scene: F9, highlight: ['posC'], numbers: true },
      { scene: F9, highlight: ['pos1b'], numbers: true },
      { scene: F9, highlight: ['pos2b'], numbers: true },
      { scene: F9, highlight: ['pos3b'], numbers: true },
      { scene: F9, highlight: ['posSS'], numbers: true },
      { scene: F9, highlight: ['posLF'], numbers: true },
      { scene: F9, highlight: ['posCF'], numbers: true },
      { scene: F9, highlight: ['posRF'], numbers: true },
      { scene: F9, highlight: [], numbers: true },
    ],
    activities: [
      { n: 1, type: 'choice', options: ['n1', 'n2', 'n9'], correct: 'n1', seg: 1 },
      { n: 2, type: 'choice', options: ['n2', 'n5', 'n7'], correct: 'n2', seg: 2 },
      { n: 3, type: 'tap', scene: F9, target: 'posSS', seg: 6 },
      { n: 4, type: 'choice', options: ['cf', 'first', 'third'], correct: 'cf', seg: 8 },
      { n: 5, type: 'tf', correct: 'false', seg: 0 },
      { n: 6, type: 'drag', board: 'order', place: { pitcher: '1', catcher: '2', first: '3', second: '4' }, seg: 1 },
    ],
  },
];

// Nivel 3 — Cómo se juega (Prompt 3). No se fija un número de entradas como regla:
// la lección 3.5 dice que muchas ligas de niños juegan 6, el profesional 9, y que lo confirma el coach.
const B = 'board' as const;
const LU = 'lineup' as const;
const L3: Lesson[] = [
  {
    id: '3.1',
    level: 3,
    glossary: ['inning', 'topHalf', 'bottomHalf'],
    demo: [
      { scene: B, highlight: ['innings'], board: { inning: 1, half: 'top', outs: 0, away: 0, home: 0 } },
      { scene: B, highlight: ['half'], board: { inning: 1, half: 'both', outs: 0, away: 0, home: 0 } },
      { scene: B, highlight: ['half', 'batting'], board: { inning: 1, half: 'top', outs: 0, away: 0, home: 0 } },
      { scene: B, highlight: ['half', 'batting'], board: { inning: 1, half: 'bottom', outs: 0, away: 0, home: 0 } },
      { scene: B, highlight: ['half'], board: { inning: 2, half: 'top', outs: 0, away: 0, home: 0 } },
    ],
    activities: [
      { n: 1, type: 'choice', options: ['inning', 'run', 'strike'], correct: 'inning', seg: 0 },
      { n: 2, type: 'choice', options: ['two', 'one', 'three'], correct: 'two', seg: 1 },
      { n: 3, type: 'choice', options: ['away', 'home', 'ump'], correct: 'away', seg: 2 },
      { n: 4, type: 'choice', options: ['home', 'away', 'nobody'], correct: 'home', seg: 3 },
      { n: 5, type: 'tf', correct: 'false', seg: 4 },
      { n: 6, type: 'umpire', options: ['bottom3', 'first', 'over'], correct: 'bottom3', seg: 3 },
    ],
  },
  {
    id: '3.2',
    level: 3,
    glossary: ['out'],
    demo: [
      { scene: B, highlight: ['outs'], board: { inning: 3, half: 'top', outs: 0, away: 1, home: 0 } },
      { scene: B, highlight: ['outs'], board: { inning: 3, half: 'top', outs: 1, away: 1, home: 0 } },
      { scene: B, highlight: ['outs'], board: { inning: 3, half: 'top', outs: 2, away: 1, home: 0 } },
      { scene: B, highlight: ['outs'], board: { inning: 3, half: 'top', outs: 3, away: 1, home: 0 } },
      { scene: B, highlight: ['half', 'batting'], board: { inning: 3, half: 'bottom', outs: 0, away: 1, home: 0 } },
      { scene: B, highlight: ['batting'], board: { inning: 3, half: 'bottom', outs: 0, away: 1, home: 0 } },
    ],
    activities: [
      { n: 1, type: 'choice', options: ['three', 'one', 'five'], correct: 'three', seg: 3 },
      { n: 2, type: 'choice', options: ['switch', 'keep', 'run'], correct: 'switch', seg: 4 },
      { n: 3, type: 'tf', correct: 'true', seg: 4 },
      {
        n: 4, type: 'choiceImg', options: ['dugout', 'house', 'outfield'], correct: 'dugout', seg: 4,
        images: { dugout: 'zone-dugout', house: 'house', outfield: 'zone-outfield' },
      },
      { n: 5, type: 'choice', options: ['untilThree', 'oneMore', 'none'], correct: 'untilThree', seg: 0 },
      { n: 6, type: 'umpire', options: ['change', 'hr', 'walk'], correct: 'change', seg: 3 },
    ],
  },
  {
    id: '3.3',
    level: 3,
    glossary: ['run'],
    demo: [
      { scene: 'diamond', highlight: ['home'] },
      { scene: 'diamond', highlight: ['first', 'second', 'third', 'home'], run: ['home', 'first', 'second', 'third', 'home'] },
      { scene: 'diamond', highlight: ['third', 'home'], run: ['third', 'home'] },
      { scene: B, highlight: ['runs'], board: { inning: 4, half: 'top', outs: 1, away: 1, home: 0 }, call: 'run' },
    ],
    activities: [
      { n: 1, type: 'choice', options: ['all', 'third', 'hard'], correct: 'all', seg: 1 },
      { n: 2, type: 'tf', correct: 'false', seg: 2 },
      { n: 3, type: 'drag', route: ['first', 'second', 'third', 'home'], seg: 1 },
      { n: 4, type: 'choice', options: ['home', 'back', 'helmet'], correct: 'home', seg: 1 },
      {
        n: 5, type: 'choiceImg', options: ['runners', 'batter', 'first'], correct: 'runners', seg: 1,
        images: { runners: 'runners-home', batter: 'player-batter', first: 'leadoff' },
      },
      { n: 6, type: 'choice', options: ['s52', 's43', 's62'], correct: 's52', seg: 3 },
    ],
  },
  {
    id: '3.4',
    level: 3,
    glossary: ['lineup'],
    demo: [
      { scene: LU, highlight: [] },
      { scene: LU, highlight: [], batter: 3, marked: [1, 2] },
      { scene: LU, highlight: [], batter: 5, marked: [4] },
      { scene: LU, highlight: [], batter: 1, marked: [9] },
    ],
    activities: [
      { n: 1, type: 'choice', options: ['lineup', 'dugout', 'zone'], correct: 'lineup', seg: 0 },
      { n: 2, type: 'tf', correct: 'false', seg: 3 },
      { n: 3, type: 'choice', options: ['b5', 'b1', 'coach'], correct: 'b5', seg: 2 },
      {
        n: 4, type: 'choiceImg', options: ['n8', 'n1', 'n6'], correct: 'n8', seg: 1,
        images: { n8: 'jersey-8', n1: 'jersey-1', n6: 'jersey-6' },
      },
      { n: 5, type: 'choice', options: ['restart', 'over', 'pitcher'], correct: 'restart', seg: 3 },
      { n: 6, type: 'umpire', options: ['skipped', 'ok', 'run'], correct: 'skipped', seg: 3 },
    ],
  },
  {
    id: '3.5',
    level: 3,
    glossary: ['run', 'extraInning'],
    demo: [
      { scene: B, highlight: ['runs'], board: { inning: 6, half: 'bottom', outs: 3, away: 4, home: 6, final: true } },
      { scene: B, highlight: ['innings'], board: { inning: 1, half: 'top', outs: 0, away: 0, home: 0, innings: 6 } },
      { scene: B, highlight: ['innings'], board: { inning: 6, half: 'top', outs: 0, away: 0, home: 0, innings: 6 } },
      { scene: B, highlight: ['innings'], board: { inning: 9, half: 'top', outs: 0, away: 0, home: 0, innings: 9 } },
      { scene: B, highlight: [], board: { inning: 1, half: 'top', outs: 0, away: 0, home: 0 } },
      { scene: B, highlight: ['innings', 'runs'], board: { inning: 7, half: 'top', outs: 0, away: 3, home: 3, innings: 6, extra: true } },
    ],
    activities: [
      { n: 1, type: 'choice', options: ['moreRuns', 'moreOuts', 'morePlayers'], correct: 'moreRuns', seg: 0 },
      { n: 2, type: 'tf', correct: 'false', seg: 2 },
      { n: 3, type: 'choice', options: ['six', 'four', 'tie'], correct: 'six', seg: 0 },
      {
        n: 4, type: 'choiceImg', options: ['extra', 'allbat', 'repeat'], correct: 'extra', seg: 5,
        images: { extra: 'inning-extra', allbat: 'bats-all', repeat: 'calendar' },
      },
      { n: 5, type: 'choice', options: ['coach', 'rival', 'batter'], correct: 'coach', seg: 4 },
      { n: 6, type: 'umpire', options: ['over', 'untilTie', 'cancel'], correct: 'over', seg: 0 },
    ],
  },
];

// Nivel 4 — El conteo (Prompt 4). La zona de strike es un rectángulo sobre home,
// del ancho de home y de las rodillas al pecho. El conteo siempre se muestra bolas primero.
const Z = 'zone' as const;
const L4: Lesson[] = [
  {
    id: '4.1',
    level: 4,
    glossary: ['strike', 'ballPitch', 'umpire'],
    demo: [
      { scene: Z, highlight: [], count: [0, 0] },
      { scene: Z, highlight: [], showZone: true, pitch: 'mid', call: 'strike', count: [0, 1] },
      { scene: Z, highlight: [], showZone: true, pitch: 'high', call: 'ball', count: [1, 1] },
      { scene: Z, highlight: ['count'], count: [1, 1] },
      { scene: Z, highlight: ['count'], count: [1, 1] },
    ],
    activities: [
      { n: 1, type: 'umpire', options: ['strike', 'ball', 'foul'], correct: 'strike', seg: 1 },
      { n: 2, type: 'umpire', options: ['ball', 'strike', 'out'], correct: 'ball', seg: 2 },
      { n: 3, type: 'umpire', options: ['strike', 'ball', 'run'], correct: 'strike', seg: 1 },
      { n: 4, type: 'tf', correct: 'false', seg: 1 },
      { n: 5, type: 'choice', options: ['ump', 'coach', 'catcher'], correct: 'ump', seg: 0 },
      {
        n: 6, type: 'choiceImg', options: ['ball', 'strike', 'foul'], correct: 'ball', seg: 2,
        images: { ball: 'pitch-ground', strike: 'pitch-strike', foul: 'pitch-foul' },
      },
    ],
  },
  {
    id: '4.2',
    level: 4,
    glossary: ['strikeZone', 'strike'],
    demo: [
      { scene: Z, highlight: ['zone'], showZone: true },
      { scene: Z, highlight: ['plate'], showZone: true },
      { scene: Z, highlight: ['height'], showZone: true },
      { scene: Z, highlight: [], showZone: true, pitch: 'mid', call: 'strike' },
      { scene: Z, highlight: [], showZone: true, pitch: 'outside', call: 'ball' },
      { scene: Z, highlight: ['zone'], showZone: true },
    ],
    activities: [
      { n: 1, type: 'tap', scene: Z, target: 'zone', seg: 0 },
      { n: 2, type: 'choice', options: ['plate', 'field', 'meters'], correct: 'plate', seg: 1 },
      { n: 3, type: 'choice', options: ['kneesChest', 'groundHead', 'feetKnees'], correct: 'kneesChest', seg: 2 },
      { n: 4, type: 'umpire', options: ['strike', 'ball', 'foul'], correct: 'strike', seg: 3 },
      { n: 5, type: 'umpire', options: ['ball', 'strike', 'out'], correct: 'ball', seg: 4 },
      { n: 6, type: 'tf', correct: 'true', seg: 2 },
    ],
  },
  {
    id: '4.3',
    level: 4,
    glossary: ['foulBall', 'strike'],
    demo: [
      { scene: 'diamond', highlight: ['foulLine'], foulHit: 'ground', call: 'foul' },
      { scene: Z, highlight: ['count'], count: [1, 1], call: 'foul' },
      { scene: Z, highlight: ['count'], count: [1, 2], call: 'foul' },
      { scene: Z, highlight: ['count'], count: [1, 2] },
      { scene: 'field9', highlight: ['pos3b'], foulHit: 'caught', call: 'out' },
    ],
    activities: [
      { n: 1, type: 'choice', options: ['outside', 'high', 'run'], correct: 'outside', seg: 0 },
      { n: 2, type: 'umpire', options: ['foul', 'hr', 'ball'], correct: 'foul', seg: 0 },
      { n: 3, type: 'choice', options: ['strike', 'ball', 'nothing'], correct: 'strike', seg: 1 },
      { n: 4, type: 'tf', correct: 'false', seg: 2 },
      { n: 5, type: 'choice', options: ['out', 'strikeOnly', 'none'], correct: 'out', seg: 4 },
      {
        n: 6, type: 'choiceImg', options: ['still32', 'k', 'walk'], correct: 'still32', seg: 2,
        images: { still32: 'count-32', k: 'strikeout-k', walk: 'walk-first' },
      },
    ],
  },
  {
    id: '4.4',
    level: 4,
    glossary: ['strikeout', 'walk'],
    demo: [
      { scene: Z, highlight: ['count'], count: [0, 0] },
      { scene: Z, highlight: ['count'], showZone: true, pitch: 'mid', count: [0, 3], call: 'k' },
      { scene: Z, highlight: ['count'], showZone: true, pitch: 'outside', count: [4, 0], call: 'walk' },
      { scene: 'diamond', highlight: ['first'], run: ['home', 'first'], call: 'walk' },
      { scene: Z, highlight: ['count'], count: [3, 2] },
    ],
    activities: [
      { n: 1, type: 'choice', options: ['n3', 'n4', 'n2'], correct: 'n3', seg: 1 },
      { n: 2, type: 'choice', options: ['n4', 'n3', 'n5'], correct: 'n4', seg: 2 },
      {
        n: 3, type: 'choiceImg', options: ['walk', 'k', 'foul'], correct: 'walk', seg: 2,
        images: { walk: 'walk-first', k: 'strikeout-k', foul: 'pitch-foul' },
      },
      {
        n: 4, type: 'choiceImg', options: ['k', 'walk', 'keep'], correct: 'k', seg: 1,
        images: { k: 'strikeout-k', walk: 'walk-first', keep: 'player-batter' },
      },
      { n: 5, type: 'tf', correct: 'false', seg: 4 },
      { n: 6, type: 'umpire', options: ['walk', 'dugout', 'again'], correct: 'walk', seg: 2 },
    ],
  },
  {
    id: '4.5',
    level: 4,
    glossary: ['hbp', 'fullCount'],
    demo: [
      { scene: Z, highlight: [], count: [3, 2] },
      { scene: Z, highlight: [], pitch: 'body', call: 'hbp' },
      { scene: 'diamond', highlight: ['first'], run: ['home', 'first'], call: 'hbp' },
      { scene: Z, highlight: ['count'], count: [3, 2] },
      { scene: Z, highlight: ['count'], showZone: true, count: [3, 2] },
    ],
    activities: [
      { n: 1, type: 'choice', options: ['first', 'out', 'strike'], correct: 'first', seg: 1 },
      { n: 2, type: 'tf', correct: 'true', seg: 1 },
      { n: 3, type: 'choice', options: ['full', 'empty', 'new'], correct: 'full', seg: 3 },
      { n: 4, type: 'umpire', options: ['walk', 'k', 'foul'], correct: 'walk', seg: 4 },
      { n: 5, type: 'umpire', options: ['k', 'walk', 'keep'], correct: 'k', seg: 4 },
      { n: 6, type: 'umpire', options: ['keep', 'k', 'walk'], correct: 'keep', seg: 4 },
    ],
  },
];

export const LEVELS: Level[] = [
  {
    n: 1,
    free: true,
    lessons: L1,
    lessonIds: ['1.1', '1.2', '1.3', '1.4', '1.5'],
    passPercent: 80,
    exam: [
      { n: 1, type: 'choice', options: ['infield', 'outfield', 'dugout'], correct: 'infield', lesson: '1.1' },
      { n: 2, type: 'tap', target: 'home', lesson: '1.3' },
      { n: 3, type: 'choice', options: ['o123', 'o312', 'o213'], correct: 'o123', lesson: '1.2' },
      { n: 4, type: 'choice', options: ['dugout', 'outfield', 'behind'], correct: 'dugout', lesson: '1.4' },
      { n: 5, type: 'choice', options: ['run', 'strike', 'out'], correct: 'run', lesson: '1.3' },
      { n: 6, type: 'choice', options: ['outfield', 'infield', 'ondeck'], correct: 'outfield', lesson: '1.1' },
      { n: 7, type: 'tf', correct: 'true', lesson: '1.1' },
      { n: 8, type: 'choice', options: ['glove', 'bat', 'helmet'], correct: 'glove', lesson: '1.5' },
      { n: 9, type: 'choice', options: ['helmet', 'cap', 'nothing'], correct: 'helmet', lesson: '1.5' },
      { n: 10, type: 'choice', options: ['next', 'pitcher', 'ump'], correct: 'next', lesson: '1.4' },
      { n: 11, type: 'tap', target: 'second', lesson: '1.2' },
      { n: 12, type: 'choice', options: ['runs', 'goals', 'hoops'], correct: 'runs', lesson: '1.3' },
    ],
  },
  {
    n: 2,
    free: false,
    lessons: L2,
    lessonIds: ['2.1', '2.2', '2.3', '2.4', '2.5'],
    passPercent: 80,
    exam: [
      { n: 1, type: 'choice', options: ['mound', 'second', 'dugout'], correct: 'mound', lesson: '2.1' },
      { n: 2, type: 'choice', options: ['catcher', 'ss', 'rf'], correct: 'catcher', lesson: '2.5' },
      { n: 3, type: 'tap', target: 'pos3b', scene: 'field9', lesson: '2.2' },
      { n: 4, type: 'choice', options: ['pc', 'corners', 'ofs'], correct: 'pc', lesson: '2.1' },
      { n: 5, type: 'choice', options: ['ss', 'second', 'cf'], correct: 'ss', lesson: '2.5' },
      { n: 6, type: 'choice', options: ['three', 'one', 'five'], correct: 'three', lesson: '2.4' },
      { n: 7, type: 'tf', correct: 'true', lesson: '2.2' },
      { n: 8, type: 'choice', options: ['rf', 'pitcher', 'first'], correct: 'rf', lesson: '2.5' },
      { n: 9, type: 'choice', options: ['middle', 'cu', 'ofs'], correct: 'middle', lesson: '2.3' },
      { n: 10, type: 'tap', target: 'posCF', scene: 'field9', lesson: '2.4' },
      { n: 11, type: 'choice', options: ['first', 'lf', 'catcher'], correct: 'first', lesson: '2.2' },
      { n: 12, type: 'choice', options: ['n7', 'n4', 'n1'], correct: 'n7', lesson: '2.5' },
    ],
  },
  {
    n: 3,
    free: false,
    lessons: L3,
    lessonIds: ['3.1', '3.2', '3.3', '3.4', '3.5'],
    passPercent: 80,
    exam: [
      { n: 1, type: 'choice', options: ['two', 'one', 'four'], correct: 'two', lesson: '3.1' },
      { n: 2, type: 'choice', options: ['home', 'away', 'ump'], correct: 'home', lesson: '3.1' },
      { n: 3, type: 'choice', options: ['n3', 'n2', 'n4'], correct: 'n3', lesson: '3.2' },
      { n: 4, type: 'choice', options: ['home', 'goal', 'third'], correct: 'home', lesson: '3.3' },
      { n: 5, type: 'choice', options: ['lineup', 'battery', 'dugout'], correct: 'lineup', lesson: '3.4' },
      { n: 6, type: 'choice', options: ['b7', 'b1', 'b6'], correct: 'b7', lesson: '3.4' },
      { n: 7, type: 'tf', correct: 'true', lesson: '3.5' },
      { n: 8, type: 'choice', options: ['five', 'three', 'tie'], correct: 'five', lesson: '3.5' },
      { n: 9, type: 'choice', options: ['bottom', 'over', 'top'], correct: 'bottom', lesson: '3.2' },
      { n: 10, type: 'choice', options: ['no', 'coach', 'once'], correct: 'no', lesson: '3.4' },
      { n: 11, type: 'choice', options: ['run', 'out', 'foul'], correct: 'run', lesson: '3.3' },
      { n: 12, type: 'choice', options: ['inning', 'dugout', 'glove'], correct: 'inning', lesson: '3.1' },
    ],
  },
  {
    n: 4,
    free: false,
    lessons: L4,
    lessonIds: ['4.1', '4.2', '4.3', '4.4', '4.5'],
    passPercent: 80,
    exam: [
      { n: 1, type: 'choice', options: ['strike', 'ball', 'foul'], correct: 'strike', lesson: '4.1' },
      { n: 2, type: 'choice', options: ['ball', 'strike', 'out'], correct: 'ball', lesson: '4.1' },
      { n: 3, type: 'choice', options: ['plate', 'first', 'field'], correct: 'plate', lesson: '4.2' },
      { n: 4, type: 'choice', options: ['n3', 'n4', 'n2'], correct: 'n3', lesson: '4.4' },
      { n: 5, type: 'choice', options: ['n4', 'n3', 'n6'], correct: 'n4', lesson: '4.4' },
      { n: 6, type: 'choice', options: ['keep', 'k', 'walk'], correct: 'keep', lesson: '4.3' },
      { n: 7, type: 'tf', correct: 'true', lesson: '4.3' },
      { n: 8, type: 'choice', options: ['first', 'out', 'foul'], correct: 'first', lesson: '4.5' },
      { n: 9, type: 'choice', options: ['balls', 'strikes', 'whatever'], correct: 'balls', lesson: '4.4' },
      { n: 10, type: 'choice', options: ['full', 'closed', 'first'], correct: 'full', lesson: '4.5' },
      { n: 11, type: 'choice', options: ['strike', 'ball', 'nothing'], correct: 'strike', lesson: '4.1' },
      { n: 12, type: 'choice', options: ['ump', 'pitcher', 'crowd'], correct: 'ump', lesson: '4.1' },
    ],
  },
];

export const REWARDS = {
  xpPerCorrect: 10,
  xpPerfectBonus: 5,
  coinsPerCorrect: 1,
  coinsPerfectBonus: 3,
  examXp: 50,
  examCoins: 10,
  streakMilestones: [3, 7, 14, 30],
};

export function getLesson(id: string): Lesson | undefined {
  for (const lv of LEVELS) {
    const l = lv.lessons.find((x) => x.id === id);
    if (l) return l;
  }
  return undefined;
}

export function getLevel(n: number): Level | undefined {
  return LEVELS.find((l) => l.n === n);
}
