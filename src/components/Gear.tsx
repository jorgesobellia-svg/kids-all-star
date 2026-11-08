import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import type { GearTarget } from '@/content/types';
import { C } from '@/theme';

// Escena "Mi equipo para jugar": bate, guante, casco y pelota, cada uno se puede tocar.
const VB = { w: 360, h: 230 };

interface Props {
  width: number;
  highlight?: GearTarget[];
  good?: GearTarget | null;
  bad?: GearTarget | null;
  onTap?: (t: GearTarget) => void;
}

export function BatShape({ color = '#C9813E' }: { color?: string }) {
  return (
    <G>
      <Path d="M8 52 L14 46 L50 10 Q56 4 60 8 Q64 12 58 18 L22 54 L16 60 Z" fill={color} stroke="#7A4A1E" strokeWidth={2} strokeLinejoin="round" />
      <Circle cx={11} cy={57} r={5} fill="#7A4A1E" />
    </G>
  );
}

export function GloveShape() {
  return (
    <G>
      <Path d="M14 58 Q8 40 12 26 Q14 18 20 20 L22 34 L24 12 Q26 6 31 8 L32 30 L35 8 Q38 3 42 7 L42 31 L46 12 Q50 8 53 12 L51 36 Q58 30 61 36 Q56 50 46 60 Q32 66 14 58 Z" fill={C.brown} stroke="#6B3A0F" strokeWidth={2} strokeLinejoin="round" />
      <Path d="M22 46 Q32 52 44 46" fill="none" stroke="#F5D08A" strokeWidth={2} />
    </G>
  );
}

export function HelmetShape() {
  return (
    <G>
      <Path d="M8 44 Q8 12 36 12 Q62 12 62 40 L62 46 L8 46 Z" fill={C.navy} />
      <Path d="M44 40 L64 40 Q66 46 60 48 L40 48 Z" fill={C.navy} />
      <Circle cx={26} cy={34} r={8} fill="#24406B" />
      <Path d="M20 20 Q30 15 42 18" fill="none" stroke="#3B5B8C" strokeWidth={3} strokeLinecap="round" />
    </G>
  );
}

export function BallShape() {
  return (
    <G>
      <Circle cx={34} cy={34} r={24} fill={C.white} stroke={C.lineDark} strokeWidth={2} />
      <Path d="M20 14 Q28 34 20 54" fill="none" stroke={C.red} strokeWidth={2} strokeDasharray="3 2.5" />
      <Path d="M48 14 Q40 34 48 54" fill="none" stroke={C.red} strokeWidth={2} strokeDasharray="3 2.5" />
    </G>
  );
}

const ITEMS: { id: GearTarget; x: number; y: number; scale: number; el: React.ReactNode }[] = [
  { id: 'bat', x: 30, y: 16, scale: 1.55, el: <BatShape /> },
  { id: 'glove', x: 214, y: 14, scale: 1.5, el: <GloveShape /> },
  { id: 'helmet', x: 36, y: 132, scale: 1.25, el: <HelmetShape /> },
  { id: 'ball', x: 238, y: 134, scale: 1.12, el: <BallShape /> },
];

export default function Gear({ width, highlight = [], good, bad, onTap }: Props) {
  const s = width / VB.w;
  return (
    <View style={{ width, height: VB.h * s }}>
      <Svg width={width} height={VB.h * s} viewBox={`0 0 ${VB.w} ${VB.h}`}>
        <Rect x={0} y={0} width={VB.w} height={VB.h} rx={22} fill="#E8EEF7" />
        <Ellipse cx={180} cy={214} rx={160} ry={10} fill="#D5DEEA" />
        {ITEMS.map((it) => {
          const ring = good === it.id ? C.green : bad === it.id ? C.wrong : highlight.includes(it.id) ? C.gold : null;
          return (
            <G key={it.id} onPress={onTap ? () => onTap(it.id) : undefined}>
              <Rect x={it.x - 10} y={it.y - 10} width={70 * it.scale + 20} height={70 * it.scale + 20} rx={18} fill={ring ?? '#000'} fillOpacity={ring ? 0.18 : 0.001} stroke={ring ?? 'none'} strokeWidth={ring ? 4 : 0} />
              <G transform={`translate(${it.x} ${it.y}) scale(${it.scale})`}>{it.el}</G>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
