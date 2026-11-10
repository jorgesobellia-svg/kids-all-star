// Vestidor de Pelotín: lo que el niño compra con las pelotas que gana jugando.
// Nada se compra con dinero real y no hay sorpresas: cada cosa muestra su precio.
// Los colores son inventados (sin logos ni colores de equipos reales a propósito).
// Algunas cosas se abren al aprobar cierto nivel ("unlock"), para tener metas a largo plazo.

export type ShopKind = 'cap' | 'uniform' | 'bat';

export interface CapLook {
  cap: string;
  star: string;
}
export interface UniformLook {
  jersey: string;
  trim: string;
  pants: string;
  number: string;
  shoes: string;
  /** Rayas finas verticales en la camiseta. */
  stripes?: string;
}
export interface BatLook {
  wood: string;
  edge: string;
  grip: string;
}

export interface ShopItem {
  id: string;
  kind: ShopKind;
  price: number;
  /** Nivel que hay que aprobar para poder comprarlo. */
  unlock?: number;
  /** No se compra: se gana gratis al aprobar ese nivel (uniformes de cada etapa). */
  reward?: number;
  look: CapLook | UniformLook | BatLook;
}

const cap = (id: string, price: number, c: string, star: string, unlock?: number): ShopItem => ({ id, kind: 'cap', price, unlock, look: { cap: c, star } });
const uni = (id: string, price: number, look: UniformLook, unlock?: number): ShopItem => ({ id, kind: 'uniform', price, unlock, look });
const bat = (id: string, price: number, wood: string, edge: string, grip: string, unlock?: number): ShopItem => ({ id, kind: 'bat', price, unlock, look: { wood, edge, grip } });

export const SHOP: ShopItem[] = [
  cap('cap-red', 0, '#C8102E', '#FFB81C'),
  cap('cap-blue', 30, '#1D4ED8', '#FFB81C'),
  cap('cap-green', 40, '#15803D', '#FFFFFF'),
  cap('cap-black', 50, '#111827', '#FFB81C'),
  cap('cap-orange', 50, '#EA580C', '#FFFFFF'),
  cap('cap-purple', 60, '#7C3AED', '#FDE68A'),
  cap('cap-gold', 150, '#FFB81C', '#C8102E', 5),

  uni('uni-home', 0, { jersey: '#FFFFFF', trim: '#0C2340', pants: '#F1F5F9', number: '#C8102E', shoes: '#0C2340' }),
  uni('uni-road', 100, { jersey: '#CBD5E1', trim: '#0C2340', pants: '#CBD5E1', number: '#0C2340', shoes: '#0C2340' }),
  uni('uni-blue', 120, { jersey: '#1D4ED8', trim: '#0B1F4D', pants: '#E2E8F0', number: '#FFB81C', shoes: '#111827' }),
  uni('uni-red', 120, { jersey: '#C8102E', trim: '#7F0A1C', pants: '#F8FAFC', number: '#FFFFFF', shoes: '#111827' }),
  uni('uni-green', 150, { jersey: '#15803D', trim: '#0B3D20', pants: '#F1F5F9', number: '#FDE68A', shoes: '#111827' }),
  uni('uni-black', 150, { jersey: '#1F2937', trim: '#000000', pants: '#9CA3AF', number: '#FFB81C', shoes: '#000000' }, 3),
  // Uniformes de etapa: se ganan al terminar cada etapa (no se compran).
  { id: 'uni-prospect', kind: 'uniform', price: 0, reward: 8, look: { jersey: '#0C2340', trim: '#FFB81C', pants: '#E2E8F0', number: '#FFB81C', shoes: '#0C2340' } },
  { id: 'uni-allstar', kind: 'uniform', price: 0, reward: 12, look: { jersey: '#FFFFFF', trim: '#B45309', pants: '#FFFFFF', number: '#C8102E', shoes: '#B45309', stripes: '#FDE68A' } },
  { id: 'uni-legend', kind: 'uniform', price: 0, reward: 16, look: { jersey: '#5B21B6', trim: '#FFB81C', pants: '#EDE9FE', number: '#FFB81C', shoes: '#2E1065' } },
  { id: 'uni-hall', kind: 'uniform', price: 0, reward: 20, look: { jersey: '#FFB81C', trim: '#7C2D12', pants: '#FFFBEB', number: '#0C2340', shoes: '#7C2D12' } },
  uni('uni-stripes', 250, { jersey: '#FFFFFF', trim: '#0C2340', pants: '#FFFFFF', number: '#0C2340', shoes: '#0C2340', stripes: '#93C5FD' }, 10),

  bat('bat-wood', 0, '#D9A066', '#8B5A2B', '#5B3A1E'),
  bat('bat-dark', 60, '#7C4A24', '#4A2A12', '#1F2937'),
  bat('bat-metal', 80, '#CBD5E1', '#64748B', '#111827'),
  bat('bat-red', 90, '#DC2626', '#7F1D1D', '#111827'),
  bat('bat-black', 100, '#1F2937', '#000000', '#DC2626', 8),
  bat('bat-gold', 500, '#FFC93C', '#B45309', '#7C2D12', 15),
];

export const SHOP_BY_ID: Record<string, ShopItem> = Object.fromEntries(SHOP.map((i) => [i.id, i]));

/** Lo que trae Pelotín al empezar (gratis). */
export const DEFAULT_OWNED = ['cap-red', 'uni-home', 'bat-wood'];
/** Gorra que regala el tutorial. */
export const GIFT_CAP = 'cap-blue';

export interface Avatar {
  cap: string;
  uniform: string;
  bat: string;
  number: number;
}
export const DEFAULT_AVATAR: Avatar = { cap: 'cap-red', uniform: 'uni-home', bat: 'bat-wood', number: 1 };

export function capLook(a: Avatar): CapLook {
  return (SHOP_BY_ID[a.cap]?.look ?? SHOP_BY_ID['cap-red'].look) as CapLook;
}
export function uniformLook(a: Avatar): UniformLook {
  return (SHOP_BY_ID[a.uniform]?.look ?? SHOP_BY_ID['uni-home'].look) as UniformLook;
}
export function batLook(a: Avatar): BatLook {
  return (SHOP_BY_ID[a.bat]?.look ?? SHOP_BY_ID['bat-wood'].look) as BatLook;
}
