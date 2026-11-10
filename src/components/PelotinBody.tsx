import React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { MascotFace, type FaceProps } from '@/components/Art';
import { batLook, capLook, uniformLook, type Avatar } from '@/content/shop';
import { C, F } from '@/theme';

// Pelotín de cuerpo completo (modelo A, "cabezón"): la pelota con gorra es la cabeza y debajo
// lleva un cuerpo corto con uniforme, número, guantes de bateo blancos y zapatos.
//  - view 'front': de frente (vestidor, esperando en el mapa).
//  - view 'back': de espaldas, con el número grande (corriendo hacia el fondo del estadio).
//  - pose 'run' con frame 0/1: piernas y brazos alternados para correr.
// Medidas en un cuadro de 200×220; la altura real la pone "height".

export const BODY_W = 200;
export const BODY_H = 220;

type Pt = [number, number];
interface Limbs {
  legs: [Pt, Pt][];
  shoes: Pt[];
  arms: [Pt, Pt][];
  hands: Pt[];
}

const STAND: Limbs = {
  legs: [
    [[88, 166], [84, 194]],
    [[112, 166], [116, 194]],
  ],
  shoes: [[78, 198], [122, 198]],
  arms: [
    [[72, 122], [58, 150]],
    [[128, 122], [142, 148]],
  ],
  hands: [[56, 154], [144, 150]],
};
const RUN: Limbs[] = [
  {
    legs: [
      [[92, 164], [74, 190]],
      [[108, 164], [126, 182]],
    ],
    shoes: [[70, 194], [130, 186]],
    arms: [
      [[74, 124], [56, 108]],
      [[126, 124], [146, 142]],
    ],
    hands: [[54, 104], [148, 146]],
  },
  {
    legs: [
      [[92, 164], [74, 182]],
      [[108, 164], [126, 190]],
    ],
    shoes: [[70, 186], [130, 194]],
    arms: [
      [[74, 124], [54, 142]],
      [[126, 124], [146, 108]],
    ],
    hands: [[52, 146], [148, 104]],
  },
];

function Limb({ a, b, w, fill, edge }: { a: Pt; b: Pt; w: number; fill: string; edge: string }) {
  return (
    <G>
      <Line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={edge} strokeWidth={w + 3} strokeLinecap="round" />
      <Line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={fill} strokeWidth={w} strokeLinecap="round" />
    </G>
  );
}

function Shoe({ at, color, left }: { at: Pt; color: string; left: boolean }) {
  const x = at[0] + (left ? -2 : 2);
  return (
    <G>
      <Ellipse cx={x} cy={at[1]} rx={12} ry={7} fill={color} />
      <Rect x={x - 11} y={at[1] + 3} width={22} height={3} rx={1.5} fill="#FFFFFF" opacity={0.8} />
    </G>
  );
}

/** El bate en la mano derecha (solo de frente y de pie). */
function Bat({ avatar }: { avatar: Avatar }) {
  const b = batLook(avatar);
  const L = 78;
  return (
    <G transform="translate(140 152) rotate(25)">
      <Path
        d={`M-2.2 0 L-2.2 ${-L * 0.42} Q-6.5 ${-L * 0.6} -6.5 ${-L * 0.9} Q-6.5 ${-L} 0 ${-L} Q6.5 ${-L} 6.5 ${-L * 0.9} Q6.5 ${-L * 0.6} 2.2 ${-L * 0.42} L2.2 0 Z`}
        fill={b.wood}
        stroke={b.edge}
        strokeWidth={2}
      />
      <Rect x={-3} y={-14} width={6} height={13} rx={2} fill={b.grip} />
      <Ellipse cx={0} cy={1} rx={5} ry={3} fill={b.grip} />
    </G>
  );
}

/** Cabeza vista por detrás: la pelota con sus costuras y la gorra (sin cara). */
function HeadBack({ cap }: { cap: string }) {
  return (
    <G>
      <Circle cx={50} cy={56} r={34} fill={C.white} stroke={C.gold} strokeWidth={3} />
      <Path d="M26 34q12 22 0 44M74 34q-12 22 0 44" fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="4 3" />
      <Path d="M17 47a33 31 0 0 1 66 0z" fill={cap} />
      <Path d="M36 47h28v5H36z" fill={cap} opacity={0.75} />
      <Circle cx={50} cy={16.5} r={3} fill={cap} />
    </G>
  );
}

export default function PelotinBody({
  avatar,
  height = 160,
  view = 'front',
  pose = 'stand',
  frame = 0,
  holdBat = false,
  face,
}: {
  avatar: Avatar;
  height?: number;
  view?: 'front' | 'back';
  pose?: 'stand' | 'run';
  frame?: 0 | 1;
  holdBat?: boolean;
  face?: FaceProps;
}) {
  const u = uniformLook(avatar);
  const c = capLook(avatar);
  const L = pose === 'run' ? RUN[frame] : STAND;
  const num = String(avatar.number);
  const back = view === 'back';
  return (
    <Svg width={(height * BODY_W) / BODY_H} height={height} viewBox={`0 0 ${BODY_W} ${BODY_H}`}>
      {L.legs.map(([a, b], i) => (
        <Limb key={`l${i}`} a={a} b={b} w={15} fill={u.pants} edge={u.trim} />
      ))}
      {L.shoes.map((s, i) => (
        <Shoe key={`s${i}`} at={s} color={u.shoes} left={i === 0} />
      ))}
      {!back && holdBat && pose === 'stand' ? <Bat avatar={avatar} /> : null}
      {L.arms.map(([a, b], i) => (
        <Limb key={`a${i}`} a={a} b={b} w={13} fill={u.jersey} edge={u.trim} />
      ))}
      <Rect x={70} y={110} width={60} height={62} rx={17} fill={u.jersey} stroke={u.trim} strokeWidth={3} />
      {u.stripes ? [80, 90, 100, 110, 120].map((x) => <Line key={x} x1={x} y1={114} x2={x} y2={168} stroke={u.stripes} strokeWidth={2} />) : null}
      {back ? (
        <SvgText x={100} y={158} fontFamily={F.display} fontSize={num.length > 1 ? 30 : 34} fill={u.number} stroke={u.trim} strokeWidth={1} textAnchor="middle">
          {num}
        </SvgText>
      ) : (
        <>
          <Line x1={100} y1={113} x2={100} y2={168} stroke={u.trim} strokeWidth={2} strokeDasharray="1 5" strokeLinecap="round" />
          <SvgText x={115} y={150} fontFamily={F.display} fontSize={num.length > 1 ? 19 : 24} fill={u.number} textAnchor="middle">
            {num}
          </SvgText>
        </>
      )}
      {L.hands.map((h, i) => (
        <Circle key={`h${i}`} cx={h[0]} cy={h[1]} r={7.5} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth={2} />
      ))}
      <G transform="translate(42 8) scale(1.16)">{back ? <HeadBack cap={c.cap} /> : <MascotFace {...face} cap={c.cap} star={c.star} />}</G>
    </Svg>
  );
}
