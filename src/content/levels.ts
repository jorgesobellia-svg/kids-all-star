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
  // Niveles 3 y 4: se muestran en el camino con el candado Plus; su contenido se construye después.
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
  { n: 3, free: false, lessons: [], lessonIds: ['3.1', '3.2', '3.3', '3.4', '3.5'], exam: [], passPercent: 80 },
  { n: 4, free: false, lessons: [], lessonIds: ['4.1', '4.2', '4.3', '4.4', '4.5'], exam: [], passPercent: 80 },
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
