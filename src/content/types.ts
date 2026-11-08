// Estructura del contenido que NO depende del idioma.
// Los textos viven en src/i18n/locales/<idioma>/content.json, por clave.
// Las respuestas correctas viven aquí, así son las mismas en los 4 idiomas.

export type Target =
  | 'all'
  | 'infield'
  | 'outfield'
  | 'foulLine'
  | 'home'
  | 'first'
  | 'second'
  | 'third'
  | 'dugout'
  | 'onDeck'
  // Posiciones de los 9 jugadores (Nivel 2)
  | 'mound'
  | 'posC'
  | 'pos1b'
  | 'pos2b'
  | 'pos3b'
  | 'posSS'
  | 'posLF'
  | 'posCF'
  | 'posRF'
  // Zona de strike (Nivel 4)
  | 'zone';

export type GearTarget = 'bat' | 'glove' | 'helmet' | 'ball';

/**
 * 'field9' = el diamante con los 9 jugadores de la defensa.
 * 'board' = el marcador (Nivel 3), 'lineup' = la alineación (Nivel 3),
 * 'zone' = bateador, home y zona de strike vistos desde atrás del catcher (Nivel 4).
 */
export type Scene = 'diamond' | 'field9' | 'gear' | 'board' | 'lineup' | 'zone';

/** Partes del marcador o del conteo que se pueden resaltar. */
export type BoardTarget = 'half' | 'outs' | 'runs' | 'innings' | 'count' | 'batting' | 'plate' | 'height';

/** Estado del marcador en un pedazo de la demostración. */
export interface BoardState {
  inning: number;
  half: 'top' | 'bottom' | 'both';
  outs: number;
  away: number;
  home: number;
  /** Fila de entradas del juego (ej. 6 en ligas de niños, 9 en profesional). */
  innings?: number;
  final?: boolean;
  extra?: boolean;
}

/** Dónde pasa el lanzamiento respecto a la zona de strike. */
export type PitchSpot = 'mid' | 'high' | 'outside' | 'ground' | 'body';

/** Lo que canta el umpire en la escena. */
export type Call = 'strike' | 'ball' | 'foul' | 'out' | 'k' | 'walk' | 'hbp' | 'run';

/** Un pedazo del guion de la demostración y lo que se resalta mientras se narra. */
export interface DemoSegment {
  scene: Scene;
  highlight: (Target | GearTarget | BoardTarget)[];
  /** Si está, la mascota corre esta ruta sobre el diamante mientras se narra. */
  run?: Target[];
  /** Muestra el número oficial (1-9) sobre cada jugador. */
  numbers?: boolean;
  /** Marcador (escena 'board'). */
  board?: BoardState;
  /** Alineación: bateador al bate (1-9) y bateadores marcados. */
  batter?: number;
  marked?: number[];
  /** Escena 'zone': lanzamiento, swing, conteo (bolas primero) y canto del umpire. */
  pitch?: PitchSpot;
  swing?: boolean;
  count?: [number, number];
  call?: Call;
  /** Muestra la zona de strike dibujada. */
  showZone?: boolean;
  /** Diamante: batazo de foul por la línea de tercera (y si lo atrapan en el aire). */
  foulHit?: 'ground' | 'caught';
}

export type ActivityType =
  | 'tap' // Toca en el campo
  | 'choiceImg' // Selección con imágenes
  | 'tf' // Verdadero o falso
  | 'choice' // Selección simple
  | 'drag' // Arrastrar
  | 'umpire'; // ¿Qué cantaría el umpire?

/** Dibujo que acompaña a una opción de "Selección con imágenes". */
export type OptionImage =
  | 'zone-outfield'
  | 'zone-dugout'
  | 'zone-home'
  | 'zone-ondeck'
  | 'shape-square'
  | 'shape-circle'
  | 'shape-triangle'
  | 'sport-run'
  | 'sport-goal'
  | 'sport-basket'
  | 'gear-bat'
  | 'gear-glove'
  | 'gear-helmet'
  | 'player-batter'
  | 'player-pitcher'
  | 'player-catcher'
  | 'zone-behindhome'
  | 'zone-first'
  | 'pos-middle'
  | 'pos-catcher'
  | 'pos-rf'
  | 'pos-outfielder'
  | 'pos-1b'
  // Nivel 3
  | 'house'
  | 'runners-home'
  | 'leadoff'
  | 'jersey-8'
  | 'jersey-1'
  | 'jersey-6'
  | 'inning-extra'
  | 'bats-all'
  | 'calendar'
  // Nivel 4
  | 'pitch-ground'
  | 'pitch-strike'
  | 'pitch-foul'
  | 'count-32'
  | 'strikeout-k'
  | 'walk-first';

export interface Activity {
  /** Número de la actividad en el guion (1 a 6). */
  n: number;
  type: ActivityType;
  /** Ids de opciones, en el orden del guion. Se muestran mezcladas. */
  options?: string[];
  images?: Record<string, OptionImage>;
  /** Id de la opción correcta (choice, choiceImg, umpire) o 'true'/'false' (tf). */
  correct?: string;
  /** Dónde hay que tocar (tap). */
  scene?: Scene;
  target?: Target | GearTarget;
  /** Ruta correcta (drag de corredor). */
  route?: Target[];
  /** Colocar fichas (drag de jugadores o tarjetas): ficha -> lugar correcto. */
  place?: Record<string, string>;
  /** Tablero de las fichas: el diamante o una fila de casillas numeradas. */
  board?: 'diamond' | 'order';
  /** Pedazo de la demostración que se repite si el niño falla. */
  seg: number;
}

export interface Lesson {
  id: string; // "1.1"
  level: number;
  demo: DemoSegment[];
  activities: Activity[];
  /** Términos del glosario que esta lección usa (para la verificación de idiomas). */
  glossary: string[];
}

export interface ExamQuestion {
  n: number;
  type: 'choice' | 'tf' | 'tap';
  options?: string[];
  correct?: string;
  target?: Target;
  scene?: Scene;
  /** Lección que se recomienda repasar si esta pregunta falla. */
  lesson: string;
}

export interface Level {
  n: number;
  free: boolean;
  /** Lecciones con contenido construido. Vacío = nivel anunciado, aún no construido. */
  lessons: Lesson[];
  /** Ids de las 5 lecciones del mapa (para mostrar el camino aunque no estén construidas). */
  lessonIds: string[];
  exam: ExamQuestion[];
  passPercent: number;
}
