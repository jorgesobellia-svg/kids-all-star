// Minijuegos: uno cada dos niveles, se abre al aprobar el examen del nivel `after`.
// Por ahora solo está "¡A batear!" (después del nivel 4).
export interface MiniGame {
  id: string;
  /** Nivel cuyo examen lo desbloquea. Aparece en el camino justo después de ese nivel. */
  after: number;
  /** Clave del título en ui.json. */
  title: string;
}

export const MINIGAMES: MiniGame[] = [{ id: 'batear', after: 4, title: 'game.batTitle' }];

export const gameAfter = (level: number): MiniGame | undefined => MINIGAMES.find((g) => g.after === level);

// ---------------------------------------------------------------- ¡A batear!
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
  minMs: 650,
  /** Parte de los lanzamientos que vienen fuera de la zona (bolas). */
  ballRate: 0.28,
  coinsHit: 1,
  coinsHr: 2,
};
