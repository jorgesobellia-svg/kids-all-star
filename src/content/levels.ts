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
  // Niveles 2 a 4: se muestran en el camino con el candado Plus.
  // Su contenido se construye después de la revisión del Nivel 1 (Prompt 5).
  { n: 2, free: false, lessons: [], lessonIds: ['2.1', '2.2', '2.3', '2.4', '2.5'], exam: [], passPercent: 80 },
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
