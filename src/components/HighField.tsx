import React from 'react';
import { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Pattern, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';
import { C } from '@/theme';

// Campo visto con la cámara alta detrás del home (como los juegos clásicos de béisbol infantil):
// el cuadro en perspectiva, el pitcher en el medio, los fildeadores y las cajas de bateo abajo.
// Dibujo de 360×560; va dentro de un <Svg viewBox="0 0 360 560">.

export const HF = {
  w: 360,
  h: 560,
  /** Mano del pitcher al soltar la bola. */
  release: { x: 180, y: 300 },
  /** Zona de strike (sobre el home, de las rodillas al pecho de Pelotín). */
  zone: { l: 167, r: 195, t: 426, b: 460 },
  /** Pies de Pelotín en la caja de bateo de la izquierda (bateador derecho). */
  batter: { x: 140, y: 504, h: 134 },
  /** Gradas del fondo, donde va el público. */
  stands: { x: 0, y: 20, w: 360, h: 52 },
};

/** Radio de la bola cuando pasa por el home (la animación la agranda 1.2 veces). */
export const BALL_R_PLATE = 5.5 * 1.2;
/** Mitad del grosor de la línea punteada de la zona: la línea también es zona. */
export const ZONE_LINE = 1;

/**
 * Regla de los tres minijuegos: si la bola toca la zona de strike, aunque sea rozando la
 * línea punteada con la costura, es STRIKE. Es BOLA solo si no toca ni la línea.
 */
export function touchesZone(x: number, y: number, r = BALL_R_PLATE): boolean {
  const Z = HF.zone;
  const l = Z.l - ZONE_LINE;
  const rr = Z.r + ZONE_LINE;
  const t = Z.t - ZONE_LINE;
  const b = Z.b + ZONE_LINE;
  const cx = Math.max(l, Math.min(x, rr));
  const cy = Math.max(t, Math.min(y, b));
  return Math.hypot(x - cx, y - cy) <= r;
}
const VB = { w: HF.w, h: HF.h };

// Puntitos fijos (siempre iguales) para dar textura de tierra y de pasto.
function speckles(n: number, seed: number, w: number, h: number) {
  let x = seed;
  const r = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, () => [r() * w, r() * h, r()] as const);
}
const DIRT_DOTS = speckles(70, 7, 24, 24);
const GRASS_DOTS = speckles(40, 3, 18, 18);

// Bases cuadradas: cada lado va paralelo a las líneas de base, así que en perspectiva se ven como un cuadrado acostado.
function baseSquare(c: [number, number], u: [number, number], v: [number, number], size: number): [number, number][] {
  const n = (p: [number, number]) => {
    const l = Math.hypot(p[0], p[1]);
    return [(p[0] / l) * size, (p[1] / l) * size] as [number, number];
  };
  const a = n(u);
  const b = n(v);
  const o: [number, number] = [c[0] - (a[0] + b[0]) / 2, c[1] - (a[1] + b[1]) / 2];
  return [o, [o[0] + a[0], o[1] + a[1]], [o[0] + a[0] + b[0], o[1] + a[1] + b[1]], [o[0] + b[0], o[1] + b[1]]];
}
const HOME_P: [number, number] = [180, 480];
const B1: [number, number] = [302, 338];
const B2: [number, number] = [180, 252];
const B3: [number, number] = [58, 338];
const d = (p: [number, number], q: [number, number]): [number, number] => [q[0] - p[0], q[1] - p[1]];
// Primera y tercera: la esquina de atrás en el vértice del diamante, un lado pegado a la raya de foul (hacia el home)
// y el otro hacia segunda, así quedan completas en territorio fair. Segunda va centrada en su vértice.
function cornerBase(corner: [number, number], toHome: [number, number], toSecond: [number, number], size: number): [number, number][] {
  const n = (p: [number, number]) => {
    const l = Math.hypot(p[0], p[1]);
    return [(p[0] / l) * size, (p[1] / l) * size] as [number, number];
  };
  const a = n(toHome);
  const b = n(toSecond);
  return [corner, [corner[0] + a[0], corner[1] + a[1]], [corner[0] + a[0] + b[0], corner[1] + a[1] + b[1]], [corner[0] + b[0], corner[1] + b[1]]];
}
const BASES = [cornerBase(B1, d(B1, HOME_P), d(B1, B2), 14), baseSquare(B2, d(B1, B2), d(B2, B3), 11), cornerBase(B3, d(B3, HOME_P), d(B3, B2), 14)];

/** Fildeadores rivales: x, y de los pies y alto, en unidades del dibujo. El último es el pitcher. */
export const FIELDERS: [number, number, number][] = [[84, 150, 34], [180, 128, 32], [276, 150, 34], [62, 300, 44], [126, 252, 42], [238, 252, 42], [300, 300, 44], [180, 328, 58]];

export default function HighField() {
  return (
    <G>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#93C5FD" />
          <Stop offset="1" stopColor="#DBEAFE" />
        </LinearGradient>
        <LinearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3F8F3A" />
          <Stop offset="1" stopColor="#4FA347" />
        </LinearGradient>
        <LinearGradient id="dirt" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C98E58" />
          <Stop offset="1" stopColor="#D9A46C" />
        </LinearGradient>
        <RadialGradient id="mound" cx="0.5" cy="0.4" r="0.6">
          <Stop offset="0" stopColor="#DDAA72" />
          <Stop offset="1" stopColor="#B98049" />
        </RadialGradient>
        <Pattern id="dirtTex" width={24} height={24} patternUnits="userSpaceOnUse">
          {DIRT_DOTS.map(([x, y, k], i) => (
            <Circle key={i} cx={x} cy={y} r={0.5 + k * 0.9} fill={k > 0.5 ? '#8A5A2B' : '#F1C893'} opacity={0.45} />
          ))}
        </Pattern>
        <Pattern id="grassTex" width={18} height={18} patternUnits="userSpaceOnUse">
          {GRASS_DOTS.map(([x, y, k], i) => (
            <Line key={i} x1={x} y1={y} x2={x + (k - 0.5) * 2} y2={y - 2 - k * 2} stroke={k > 0.5 ? '#2F6B2A' : '#6BBF5F'} strokeWidth={0.8} opacity={0.5} />
          ))}
        </Pattern>
      </Defs>
      {/* cielo y gradas (el público va aparte, para que brinque) */}
      <Rect x={0} y={0} width={VB.w} height={72} fill="url(#sky)" />
      <Path d={`M0 22 Q180 6 360 22 L360 76 L0 76 Z`} fill="#1E3A5F" />
      <Path d={`M0 22 Q180 6 360 22`} fill="none" stroke="#2B4A6F" strokeWidth={3} />
      {/* cerca del jardín, verde oscura como en el camino, con su raya amarilla */}
      <Rect x={0} y={74} width={VB.w} height={20} fill="#0F5132" />
      <Rect x={0} y={74} width={VB.w} height={2.5} fill="#FFD43B" />
      {/* pasto con franjas de cortadora (más anchas al acercarse) */}
      <Rect x={0} y={94} width={VB.w} height={VB.h - 94} fill="url(#grass)" />
      {Array.from({ length: 10 }, (_, i) => {
        const y = 94 + i * i * 4.6 + i * 10;
        const h = 6 + i * 4.5;
        return <Rect key={i} x={0} y={y} width={VB.w} height={h} fill="#FFFFFF" opacity={0.07} />;
      })}
      <Rect x={0} y={94} width={VB.w} height={VB.h - 94} fill="url(#grassTex)" />
      {/* pista de tierra al pie de la cerca */}
      <Rect x={0} y={94} width={VB.w} height={10} fill="url(#dirt)" />
      <Rect x={0} y={94} width={VB.w} height={10} fill="url(#dirtTex)" />
      {/* cuadro de tierra: arco grande detrás de las bases */}
      <Path d="M-20 350 Q180 140 380 350 L380 560 L-20 560 Z" fill="url(#dirt)" />
      <Path d="M-20 350 Q180 140 380 350 L380 560 L-20 560 Z" fill="url(#dirtTex)" />
      <Path d="M-20 350 Q180 140 380 350" fill="none" stroke="#9C6A3A" strokeWidth={2} opacity={0.6} />
      {/* pasto del cuadro */}
      <Polygon points="180,256 292,338 180,446 68,338" fill="url(#grass)" />
      <Polygon points="180,256 292,338 180,446 68,338" fill="url(#grassTex)" />
      <Polygon points="180,256 292,338 180,446 68,338" fill="none" stroke="#9C6A3A" strokeWidth={1.5} opacity={0.5} />
      {/* rayas de foul con cal */}
      <Line x1={180} y1={480} x2={-143} y2={104} stroke="#F8FAFC" strokeWidth={3} />
      <Line x1={180} y1={480} x2={503} y2={104} stroke="#F8FAFC" strokeWidth={3} />
      {/* montículo con su sombra */}
      <Ellipse cx={180} cy={326} rx={38} ry={13} fill="#000" opacity={0.08} />
      <Ellipse cx={180} cy={322} rx={36} ry={12} fill="url(#mound)" />
      <Ellipse cx={180} cy={322} rx={36} ry={12} fill="url(#dirtTex)" />
      <Rect x={172} y={317} width={16} height={3} fill={C.white} />
      {/* bases */}
      {BASES.map((pts, i) => (
        <G key={i}>
          <Polygon points={pts.map(([x, y]) => `${x + 1.5},${y + 2.5}`).join(' ')} fill="#000" opacity={0.15} />
          <Polygon points={pts.map(([x, y]) => `${x},${y}`).join(' ')} fill={C.white} stroke="#CBD5E1" strokeWidth={0.8} strokeLinejoin="round" />
        </G>
      ))}
      {/* sombras de los fildeadores */}
      {FIELDERS.map(([x, y, h]) => (
        <Ellipse key={`${x}${y}`} cx={x} cy={y - 1} rx={h * 0.32} ry={h * 0.08} fill="#000" opacity={0.18} />
      ))}
      {/* círculo de tierra del home, cajas de bateo y el home */}
      <Ellipse cx={180} cy={494} rx={156} ry={60} fill="url(#dirt)" />
      <Ellipse cx={180} cy={494} rx={156} ry={60} fill="url(#dirtTex)" />
      <Ellipse cx={180} cy={494} rx={156} ry={60} fill="none" stroke="#9C6A3A" strokeWidth={1.5} opacity={0.5} />
      <Polygon points="100,446 160,446 158,520 84,520" fill="none" stroke="#F8FAFC" strokeWidth={3.5} strokeLinejoin="round" />
      <Polygon points="200,446 260,446 276,520 202,520" fill="none" stroke="#F8FAFC" strokeWidth={3.5} strokeLinejoin="round" />
      <Polygon points="164,470 196,470 198,479 180,489 162,479" fill="#E5E7EB" />
      <Polygon points="164,467 196,467 198,476 180,486 162,476" fill={C.white} />
      {/* sombra de Pelotín */}
      <Ellipse cx={142} cy={500} rx={20} ry={10} fill="#000" opacity={0.2} />
    </G>
  );
}


/** Cámara: qué parte del dibujo se ve (x, y de la esquina y ancho). Sin cámara se ve todo. */
export interface Cam {
  x: number;
  y: number;
  w: number;
}
export const FULL: Cam = { x: 0, y: 0, w: HF.w };

/** Escala y conversiones del dibujo a píxeles para un ancho de pantalla y una cámara. */
export function stageOf(W: number, cam: Cam = FULL) {
  const s = W / cam.w;
  const vh = (cam.w * HF.h) / HF.w;
  return { s, W, H: vh * s, cam, viewBox: `${cam.x} ${cam.y} ${cam.w} ${vh}`, X: (v: number) => (v - cam.x) * s, Y: (v: number) => (v - cam.y) * s };
}
export type Stage = ReturnType<typeof stageOf>;
