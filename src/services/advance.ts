// Avance en el diamante: al terminar una lección la app vuelve al camino, Pelotín corre
// a la siguiente base mientras el público aplaude, y entra sola a la siguiente lección
// (o al examen cuando llega al dugout).
export interface Advance {
  level: number;
  from: number; // índice del nodo de salida: 0-4 lecciones
  to: number; // índice del nodo de llegada: 1-4 lecciones, 5 = examen (dugout)
  next: { kind: 'lesson'; id: string } | { kind: 'exam'; level: number };
}

let pending: Advance | null = null;

export function setAdvance(a: Advance): void {
  pending = a;
}

/** Devuelve el avance pendiente y lo borra (se anima una sola vez). */
export function takeAdvance(): Advance | null {
  const a = pending;
  pending = null;
  return a;
}
