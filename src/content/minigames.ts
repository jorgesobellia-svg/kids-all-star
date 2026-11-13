// Minijuegos: uno al final de cada etapa; se abre al aprobar el examen del nivel `after`
// y aparece en el camino justo debajo de ese nivel.
export interface MiniGame {
  id: string;
  /** Nivel cuyo examen lo desbloquea. */
  after: number;
  /** Clave del título en ui.json. */
  title: string;
  /** Clave del texto del récord en ui.json (con {n}). */
  best: string;
}

export const MINIGAMES: MiniGame[] = [
  { id: 'batear', after: 4, title: 'game.batTitle', best: 'game.best' },
  { id: 'pichar', after: 8, title: 'game.pitchTitle', best: 'game.bestK' },
  { id: 'umpire', after: 12, title: 'game.umpTitle', best: 'game.bestCalls' },
  { id: 'elevada', after: 16, title: 'game.flyTitle', best: 'game.bestCatches' },
];

export const gameAfter = (level: number): MiniGame | undefined => MINIGAMES.find((g) => g.after === level);

// ---------------------------------------------------------------- ¡A batear! (nivel 4)
/** Ventanas de tiempo (ms) alrededor del momento en que la bola llega al home. */
export const BAT = {
  /** Diferencia máxima para jonrón. */
  hr: 55,
  /** Diferencia máxima para hit. */
  hit: 120,
  /** Diferencia máxima para foul; más allá es abanicar (strike). */
  foul: 210,
  /** Duración del primer lanzamiento (ms) desde que suelta la bola hasta el home. */
  startMs: 1500,
  /** Cuánto más rápido viene tras cada hit (ms), sin bajar de `minMs`. */
  stepMs: 70,
  minMs: 600,
  /** Con cada hit las ventanas de tiempo se achican este tanto (proporción), hasta `minWindow`. */
  windowStep: 0.04,
  minWindow: 0.6,
  /** Parte de los lanzamientos que vienen fuera de la zona (bolas). */
  ballRate: 0.28,
  /** Outs para terminar (un ponche y se acaba, para que sea corto). */
  outs: 1,
  coinsHit: 1,
  coinsHr: 2,
};

// ---------------------------------------------------------------- ¡A pichar! (nivel 8)
export const PITCH = {
  /** Tiempo (ms) que tarda la mira en ir y volver de lado a lado al principio, y el mínimo. */
  sweepMs: 1700,
  minSweepMs: 800,
  /** Cuánto se acelera tras cada ponche (ms). */
  stepMs: 120,
  /** Si la bola cae a esta distancia del centro de la zona (en proporción, 0–1) es "por el centro". */
  middle: 0.45,
  /** Probabilidad de que el bateador le pegue a una por el centro y a una en la orilla. */
  hitMiddle: 0.65,
  hitEdge: 0.15,
  /** Con cada ponche el rival le pega un poco más (se suma a las probabilidades), hasta `maxBetter`. */
  betterStep: 0.04,
  maxBetter: 0.2,
  outs: 3,
  coinsK: 1,
};

// ---------------------------------------------------------------- Umpire por un día (nivel 12)
export const UMP = {
  /** Duración del lanzamiento (ms) al principio y mínima. */
  startMs: 1400,
  minMs: 700,
  stepMs: 40,
  /** Errores para terminar. */
  lives: 3,
  /** Parte de los lanzamientos que pasan rozando la orilla de la zona. */
  edgeRate: 0.45,
  /** Con los lanzamientos suben las bolas en la orilla hasta `maxEdgeRate` (en `hardAfter` lanzamientos). */
  maxEdgeRate: 0.7,
  hardAfter: 20,
  /** Pelotas por cada cuántas bien cantadas. */
  callsPerCoin: 2,
};

// ---------------------------------------------------------------- ¡Atrapa la elevada! (nivel 16)
export const FLY = {
  /** Tiempo (ms) que la bola está en el aire al principio y mínimo. */
  startMs: 2600,
  minMs: 1500,
  stepMs: 90,
  /** Velocidad de Pelotín corriendo (pies por segundo). */
  runSpeed: 34,
  /** Distancia (pies) a la que Pelotín la atrapa. */
  reach: 9,
  /** Con cada atrapada hay que llegar un poco más justo, hasta `minReach`. */
  reachStep: 0.35,
  minReach: 5.5,
  /** Bolas que se pueden caer antes de terminar. */
  lives: 3,
  coinsCatch: 1,
};
