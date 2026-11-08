// Revisión del apodo en el teléfono (primera barrera). El servidor debe volver a revisarlo
// antes de mostrarlo a otros jugadores (ver firebase/README del proyecto).

export type NickCheck = 'empty' | 'chars' | 'short' | 'blocked' | 'ok';

const ALLOWED = /^[A-Za-z0-9_ÁÉÍÓÚÜÑáéíóúüñ]*$/;

// Palabras que no pueden aparecer en un apodo (español, inglés y formas comunes con números).
// Lista base; ampliarla con la revisión del servidor.
const BLOCK = [
  'puta', 'puto', 'mierda', 'pendej', 'verga', 'coño', 'joder', 'cabron', 'cabrón', 'marica', 'chinga', 'pinche', 'mamaguevo', 'mmg', 'carajo', 'idiota', 'estupid', 'imbecil', 'imbécil', 'zorra', 'perra', 'vagina', 'sexo', 'porno', 'nazi', 'hitler',
  'fuck', 'fuk', 'shit', 'bitch', 'pussy', 'cunt', 'asshole', 'bastard', 'slut', 'whore', 'nigg', 'retard', 'porn',
  'f4ck', 'sh1t', 'b1tch', 'p0rn', 's3x', 'fck', 'wtf', 'kkk',
  'admin', 'moderator', 'moderador', 'oficial', 'official', 'mlb', 'allstar',
];

export function checkNickname(raw: string): NickCheck {
  const name = raw.trim();
  if (!name) return 'empty';
  if (!ALLOWED.test(name)) return 'chars';
  if (name.length < 3) return 'short';
  if (name.length > 15) return 'chars';
  const low = name.toLowerCase().replace(/_/g, '');
  if (BLOCK.some((w) => low.includes(w))) return 'blocked';
  // Nada que parezca un teléfono u otro dato personal (6 dígitos seguidos o más).
  if (/\d{6,}/.test(name)) return 'blocked';
  return 'ok';
}

export function initials(name: string): string {
  return name.replace(/[^A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ]/g, '').slice(0, 2).toUpperCase() || '??';
}
