import React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { batLook, capLook, uniformLook, type Avatar } from '@/content/shop';

// Pelotín de perfil, bateador derecho, mirando hacia la derecha (hacia el pitcher), con las mismas
// proporciones que PelotinBody (cabeza de pelota grande, cuerpo corto). Dos poses:
//  - 'stance': parado en la caja, rodillas un poco dobladas, manos atrás a la altura del hombro y el bate arriba.
//  - 'swing': paso adelante, brazos estirados y el bate plano por la zona.
// El dibujo mide 300×220 (sobra espacio a la derecha para el bate en el swing); los pies van en y=206.

export const BAT_W = 300;
export const BAT_H = 220;
/** Dónde quedan los pies (centro) dentro del dibujo, para colocarlo en la escena. */
export const BAT_FEET = { x: 110, y: 206 };

type Pt = [number, number];

function Limb({ pts, w, fill, edge }: { pts: Pt[]; w: number; fill: string; edge: string }) {
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
  return (
    <G>
      <Path d={d} stroke={edge} strokeWidth={w + 3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d={d} stroke={fill} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </G>
  );
}

function Bat({ at, angle, wood, edge, grip }: { at: Pt; angle: number; wood: string; edge: string; grip: string }) {
  const L = 92;
  return (
    <G transform={`translate(${at[0]} ${at[1]}) rotate(${angle})`}>
      <Path d={`M0 -2.4 L${L * 0.45} -2.4 Q${L * 0.62} -6.8 ${L * 0.9} -6.8 Q${L} -6.8 ${L} 0 Q${L} 6.8 ${L * 0.9} 6.8 Q${L * 0.62} 6.8 ${L * 0.45} 2.4 L0 2.4 Z`} fill={wood} stroke={edge} strokeWidth={2} />
      <Rect x={-2} y={-3.2} width={15} height={6.4} rx={2} fill={grip} />
      <Ellipse cx={-2} cy={0} rx={3} ry={5} fill={grip} />
    </G>
  );
}

const POSES = {
  // Para la cámara alta detrás del home: un pie detrás del otro, en línea con la raya de la caja
  // (el de adelante, hacia el pitcher, queda más arriba y un poco más chico).
  box: {
    torso: -4,
    backLeg: [[118, 168], [121, 178], [121, 184]] as Pt[],
    frontLeg: [[98, 170], [96, 190], [96, 208]] as Pt[],
    backShoe: [124, 185] as Pt,
    frontShoe: [97, 210] as Pt,
    backArm: [[98, 124], [84, 106], [78, 96]] as Pt[],
    frontArm: [[122, 126], [104, 112], [84, 98]] as Pt[],
    hands: [80, 96] as Pt,
    bat: -112,
    head: [112, 70] as Pt,
  },
  // Swing en la caja (mismos pies): primero las manos vienen adelante, luego el bate pasa plano por la zona.
  boxMid: {
    torso: 0,
    backLeg: [[118, 168], [121, 178], [121, 184]] as Pt[],
    frontLeg: [[98, 170], [96, 190], [96, 208]] as Pt[],
    backShoe: [124, 185] as Pt,
    frontShoe: [97, 210] as Pt,
    backArm: [[100, 124], [104, 112], [112, 110]] as Pt[],
    frontArm: [[122, 126], [118, 116], [114, 110]] as Pt[],
    hands: [114, 110] as Pt,
    bat: -170,
    head: [114, 70] as Pt,
  },
  boxSwing: {
    torso: 6,
    backLeg: [[118, 168], [121, 178], [121, 184]] as Pt[],
    frontLeg: [[98, 170], [96, 190], [96, 208]] as Pt[],
    backShoe: [124, 185] as Pt,
    frontShoe: [97, 210] as Pt,
    backArm: [[104, 126], [132, 138], [156, 140]] as Pt[],
    frontArm: [[126, 128], [146, 136], [160, 140]] as Pt[],
    hands: [160, 140] as Pt,
    bat: -4,
    head: [118, 72] as Pt,
  },
  stance: {
    torso: -6,
    backLeg: [[98, 170], [92, 188], [93, 204]] as Pt[],
    frontLeg: [[120, 170], [129, 187], [128, 204]] as Pt[],
    backShoe: [89, 206] as Pt,
    frontShoe: [132, 206] as Pt,
    backArm: [[98, 124], [84, 106], [78, 96]] as Pt[],
    frontArm: [[122, 126], [104, 112], [84, 98]] as Pt[],
    hands: [80, 96] as Pt,
    bat: -112,
    head: [112, 70] as Pt,
  },
  swing: {
    torso: 6,
    backLeg: [[100, 170], [92, 188], [88, 204]] as Pt[],
    frontLeg: [[124, 170], [148, 186], [160, 204]] as Pt[],
    backShoe: [86, 206] as Pt,
    frontShoe: [166, 206] as Pt,
    backArm: [[104, 126], [132, 138], [156, 140]] as Pt[],
    frontArm: [[126, 128], [146, 136], [160, 140]] as Pt[],
    hands: [160, 140] as Pt,
    bat: -6,
    head: [118, 72] as Pt,
  },
};

export type BatPose = keyof typeof POSES;
const BAT_IN_FRONT: BatPose[] = ['swing', 'boxSwing'];

export default function PelotinBat({ avatar, height = 200, pose = 'stance', mood = 'happy' }: { avatar: Avatar; height?: number; pose?: BatPose; mood?: 'happy' | 'cheer' | 'think' }) {
  const u = uniformLook(avatar);
  const c = capLook(avatar);
  const b = batLook(avatar);
  const P = POSES[pose];
  const [hx, hy] = P.head;
  const R = 38;
  return (
    <Svg width={(height * BAT_W) / BAT_H} height={height} viewBox={`0 0 ${BAT_W} ${BAT_H}`}>
      {/* brazo de atrás y pierna de atrás, detrás del cuerpo */}
      <Limb pts={P.backLeg} w={15} fill={u.pants} edge={u.trim} />
      <Ellipse cx={P.backShoe[0]} cy={P.backShoe[1]} rx={13} ry={6.5} fill={u.shoes} />
      {!BAT_IN_FRONT.includes(pose) ? <Bat at={P.hands} angle={P.bat} {...b} /> : null}
      <Limb pts={P.backArm} w={13} fill={u.jersey} edge={u.trim} />
      {/* cuerpo de lado */}
      <G transform={`rotate(${P.torso} 110 150)`}>
        <Rect x={90} y={112} width={42} height={62} rx={15} fill={u.jersey} stroke={u.trim} strokeWidth={3} />
        {u.stripes ? [98, 106, 114, 122].map((x) => <Line key={x} x1={x} y1={116} x2={x} y2={170} stroke={u.stripes} strokeWidth={2} />) : null}
        <Rect x={90} y={164} width={42} height={8} rx={3} fill={u.trim} />
      </G>
      <Limb pts={P.frontLeg} w={15} fill={u.pants} edge={u.trim} />
      <Ellipse cx={P.frontShoe[0] + 3} cy={P.frontShoe[1]} rx={14} ry={6.5} fill={u.shoes} />
      <Rect x={P.frontShoe[0] - 10} y={P.frontShoe[1] + 3} width={26} height={3} rx={1.5} fill="#FFFFFF" opacity={0.8} />
      {BAT_IN_FRONT.includes(pose) ? <Bat at={P.hands} angle={P.bat} {...b} /> : null}
      <Limb pts={P.frontArm} w={13} fill={u.jersey} edge={u.trim} />
      <Circle cx={P.hands[0]} cy={P.hands[1]} r={8} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth={2} />
      {/* cabeza: la pelota de perfil, con la gorra mirando al pitcher */}
      <Circle cx={hx} cy={hy} r={R} fill="#FFFFFF" stroke={C_GOLD} strokeWidth={3} />
      <Path d={`M${hx - 22} ${hy - 26} q-14 26 0 52`} fill="none" stroke="#C8102E" strokeWidth={3} strokeDasharray="4 3" />
      <Path d={`M${hx - R + 1} ${hy - 8} a${R - 1} ${R - 3} 0 0 1 ${2 * R - 4} -2 z`} fill={c.cap} />
      <Path d={`M${hx + R - 8} ${hy - 12} L${hx + R + 20} ${hy - 6} Q${hx + R + 22} ${hy - 1} ${hx + R + 16} ${hy} L${hx + R - 8} ${hy - 2} Z`} fill={c.cap} />
      <Circle cx={hx - 4} cy={hy - 38} r={3.5} fill={c.cap} />
      <Path d={`M${hx - 6} ${hy - 30} l3 6 6 1 -5 4 1 6 -5 -3 -5 3 1 -6 -5 -4 6 -1z`} fill={c.star} />
      {/* ojo mirando adelante y sonrisa */}
      {mood === 'cheer' ? (
        <Path d={`M${hx + 17} ${hy + 6} q6 -7 12 0`} fill="none" stroke="#0C2340" strokeWidth={3.5} strokeLinecap="round" />
      ) : (
        <G>
          <Ellipse cx={hx + 22} cy={hy + 4} rx={5} ry={6.5} fill="#0C2340" />
          <Circle cx={hx + 24} cy={hy + 1.5} r={1.8} fill="#FFFFFF" />
        </G>
      )}
      {mood === 'think' ? (
        <Path d={`M${hx + 16} ${hy + 22} h14`} stroke="#0C2340" strokeWidth={3} strokeLinecap="round" />
      ) : (
        <Path d={`M${hx + 12} ${hy + 18} q10 9 22 0`} fill="none" stroke="#0C2340" strokeWidth={3} strokeLinecap="round" />
      )}
    </Svg>
  );
}

const C_GOLD = '#FFB81C';
