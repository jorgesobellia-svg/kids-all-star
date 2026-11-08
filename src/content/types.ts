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
  | 'posRF';

export type GearTarget = 'bat' | 'glove' | 'helmet' | 'ball';

/** 'field9' = el diamante con los 9 jugadores de la defensa. */
export type Scene = 'diamond' | 'field9' | 'gear';

/** Un pedazo del guion de la demostración y lo que se resalta mientras se narra. */
export interface DemoSegment {
  scene: Scene;
  highlight: (Target | GearTarget)[];
  /** Si está, la mascota corre esta ruta sobre el diamante mientras se narra. */
  run?: Target[];
  /** Muestra el número oficial (1-9) sobre cada jugador. */
  numbers?: boolean;
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
  | 'pos-1b';

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
