import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G, Path, Polygon, Rect } from 'react-native-svg';
import type { OptionImage } from '@/content/types';
import { C, F } from '@/theme';
import { BallShape, BatShape, GloveShape, HelmetShape } from './Gear';

/** Ícono de la app: estrella con costuras de pelota (opción B del diseño). */
export function AppIcon({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 220 220">
      <Rect width={220} height={220} rx={50} fill={C.red} />
      <Polygon points="110,34 130,84.5 184.2,87.9 142.3,122.5 155.8,175.1 110,146 64.2,175.1 77.7,122.5 35.8,87.9 90,84.5" fill={C.white} stroke={C.navy} strokeWidth={6} strokeLinejoin="round" />
      <Path d="M88 96 Q100 120 88 144" fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="5 4" strokeLinecap="round" />
      <Path d="M132 96 Q120 120 132 144" fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="5 4" strokeLinecap="round" />
    </Svg>
  );
}

/** Pelotín, la mascota (arte original). */
export function Mascot({ size = 96, mood = 'happy', cap = C.red }: { size?: number; mood?: 'happy' | 'cheer' | 'think'; cap?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={56} r={34} fill={C.white} stroke={C.gold} strokeWidth={3} />
      <Path d="M26 34q12 22 0 44M74 34q-12 22 0 44" fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="4 3" />
      <Path d="M18 42a32 28 0 0 1 64 0z" fill={cap} />
      <Path d="M60 42h28a4 4 0 0 1 0 8H60z" fill={cap} />
      <Polygon points="50,20 52.6,25.6 58.6,26.2 54,30.2 55.4,36 50,33 44.6,36 46,30.2 41.4,26.2 47.4,25.6" fill={C.gold} />
      {mood === 'cheer' ? (
        <>
          <Path d="M36 58q4 -6 8 0M56 58q4 -6 8 0" fill="none" stroke={C.navy} strokeWidth={3} strokeLinecap="round" />
          <Path d="M38 68q12 12 24 0z" fill={C.navy} />
        </>
      ) : (
        <>
          <Circle cx={40} cy={58} r={5} fill={C.navy} />
          <Circle cx={60} cy={58} r={5} fill={C.navy} />
          <Circle cx={41.5} cy={56.5} r={1.6} fill={C.white} />
          <Circle cx={61.5} cy={56.5} r={1.6} fill={C.white} />
          {mood === 'think' ? (
            <Path d="M42 72q8 -4 16 0" fill="none" stroke={C.navy} strokeWidth={3} strokeLinecap="round" />
          ) : (
            <Path d="M40 70q10 9 20 0" fill="none" stroke={C.navy} strokeWidth={3} strokeLinecap="round" />
          )}
        </>
      )}
    </Svg>
  );
}

/** Pelota de béisbol con letras (códigos de idioma e iniciales del alias). */
export function BallBadge({ text, size = 48, ink = C.navy, ring = C.lineDark, ringWidth = 2, fontSize }: { text: string; size?: number; ink?: string; ring?: string; ringWidth?: number; fontSize?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 50 50" style={{ position: 'absolute' }}>
        <Circle cx={25} cy={25} r={23} fill={C.white} stroke={ring} strokeWidth={ringWidth} />
        <Path d="M10 7 Q14.5 25 10 43" fill="none" stroke={C.red} strokeWidth={1.8} />
        <Path d="M40 7 Q35.5 25 40 43" fill="none" stroke={C.red} strokeWidth={1.8} />
        <Path d="M10.6 11l-3.4 -1.2M11.6 17l-3.6 -0.6M12.2 23l-3.6 0M12.2 28l-3.6 0M11.6 33l-3.6 0.6M10.6 39l-3.4 1.2" stroke={C.red} strokeWidth={1.4} strokeLinecap="round" />
        <Path d="M39.4 11l3.4 -1.2M38.4 17l3.6 -0.6M37.8 23l3.6 0M37.8 28l3.6 0M38.4 33l3.6 0.6M39.4 39l3.4 1.2" stroke={C.red} strokeWidth={1.4} strokeLinecap="round" />
      </Svg>
      <Text style={{ color: ink, fontFamily: F.bodyHeavy, fontSize: fontSize ?? Math.round(size * 0.27) }}>{text}</Text>
    </View>
  );
}

function MiniField({ zone }: { zone: 'outfield' | 'dugout' | 'home' | 'ondeck' }) {
  const hl = C.gold;
  return (
    <G>
      <Rect x={0} y={0} width={72} height={60} rx={10} fill="#2A6E2D" />
      <Path d="M36 54 L4 20 A 48 48 0 0 1 68 20 Z" fill={zone === 'outfield' ? hl : C.grass} />
      <Polygon points="36,56 52,40 36,24 20,40" fill={C.dirt} />
      <Rect x={2} y={46} width={14} height={8} rx={2} fill={zone === 'dugout' ? hl : '#5B4636'} />
      <Rect x={56} y={46} width={14} height={8} rx={2} fill={zone === 'dugout' ? hl : '#5B4636'} />
      <Circle cx={47} cy={56} r={3} fill="none" stroke={zone === 'ondeck' ? hl : C.white} strokeWidth={zone === 'ondeck' ? 2.5 : 1} />
      <Polygon points="33,51 39,51 39,54 36,57 33,54" fill={zone === 'home' ? hl : C.white} />
      {zone === 'home' ? <Circle cx={36} cy={53} r={7} fill="none" stroke={hl} strokeWidth={2.5} /> : null}
    </G>
  );
}

// Campo en miniatura con los 9 jugadores; los de "on" se marcan en dorado.
const MINI_POS: Record<string, [number, number]> = {
  mound: [36, 38.8], posC: [36, 56.8], pos1b: [48.8, 33.2], pos2b: [43.2, 28], posSS: [28.8, 28],
  pos3b: [23.2, 33.2], posLF: [16.4, 19.2], posCF: [36, 10.8], posRF: [55.6, 19.2],
};
function MiniPositions({ on, base }: { on: string[]; base?: 'first' | 'behind' }) {
  return (
    <G>
      <Rect x={0} y={0} width={72} height={60} rx={10} fill="#2A6E2D" />
      <Path d="M36 52.4 L2.8 19.2 A 47 47 0 0 1 69.2 19.2 Z" fill={C.grass} />
      <Polygon points="36,56 53.6,38.4 36,20.8 18.4,38.4" fill={C.dirt} />
      <Rect x={47} y={36.4} width={4} height={4} fill={base === 'first' ? C.gold : C.white} transform="rotate(45 49 38.4)" />
      {base === 'first' ? <Circle cx={49} cy={38.4} r={5.5} fill="none" stroke={C.gold} strokeWidth={2} /> : null}
      {base === 'behind' ? <Circle cx={36} cy={56.8} r={5.5} fill="none" stroke={C.gold} strokeWidth={2.5} /> : null}
      {Object.entries(MINI_POS).map(([id, [x, y]]) => (
        <Circle key={id} cx={x} cy={y} r={on.includes(id) ? 3.6 : 2.4} fill={on.includes(id) ? C.gold : C.navy} stroke={C.white} strokeWidth={0.8} />
      ))}
    </G>
  );
}

function Person({ hold }: { hold: 'bat' | 'ball' | 'mitt' }) {
  return (
    <G>
      <Circle cx={36} cy={16} r={9} fill="#F2C29B" />
      <Path d="M27 14 Q36 2 45 14 Z" fill={C.navy} />
      <Rect x={27} y={26} width={18} height={20} rx={5} fill={C.red} />
      <Rect x={28} y={46} width={7} height={12} rx={2} fill={C.navy} />
      <Rect x={37} y={46} width={7} height={12} rx={2} fill={C.navy} />
      {hold === 'bat' ? <Rect x={44} y={6} width={5} height={30} rx={2} fill="#C9813E" transform="rotate(25 46 20)" /> : null}
      {hold === 'ball' ? <Circle cx={52} cy={24} r={5} fill={C.white} stroke={C.red} strokeWidth={1} /> : null}
      {hold === 'mitt' ? <Circle cx={50} cy={34} r={7} fill={C.brown} /> : null}
      {hold === 'mitt' ? <Rect x={28} y={9} width={16} height={9} rx={3} fill="#475569" fillOpacity={0.8} /> : null}
    </G>
  );
}

/** Dibujo de cada opción en "Selección con imágenes". */
export function OptionArt({ image, size = 64 }: { image: OptionImage; size?: number }) {
  let el: React.ReactNode = null;
  switch (image) {
    case 'zone-outfield': el = <MiniField zone="outfield" />; break;
    case 'zone-dugout': el = <MiniField zone="dugout" />; break;
    case 'zone-home': el = <MiniField zone="home" />; break;
    case 'zone-ondeck': el = <MiniField zone="ondeck" />; break;
    case 'shape-square': el = <Rect x={18} y={12} width={36} height={36} fill="none" stroke={C.navy} strokeWidth={4} transform="rotate(45 36 30)" />; break;
    case 'shape-circle': el = <Circle cx={36} cy={30} r={22} fill="none" stroke={C.navy} strokeWidth={4} />; break;
    case 'shape-triangle': el = <Polygon points="36,6 62,52 10,52" fill="none" stroke={C.navy} strokeWidth={4} strokeLinejoin="round" />; break;
    case 'sport-run': el = <G transform="translate(4 -2) scale(0.95)"><BallShape /></G>; break;
    case 'sport-goal':
      el = (
        <G>
          <Rect x={8} y={10} width={56} height={36} fill="none" stroke={C.navy} strokeWidth={4} />
          <Path d="M8 22H64M8 34H64M22 10V46M36 10V46M50 10V46" stroke={C.faint} strokeWidth={1} />
          <Circle cx={50} cy={52} r={7} fill={C.white} stroke={C.navy} strokeWidth={2} />
        </G>
      );
      break;
    case 'sport-basket':
      el = (
        <G>
          <Rect x={18} y={4} width={36} height={22} fill="none" stroke={C.navy} strokeWidth={3} />
          <Rect x={24} y={26} width={24} height={4} fill={C.orange} />
          <Path d="M26 30 L30 46 L42 46 L46 30" fill="none" stroke={C.faint} strokeWidth={2} />
          <Circle cx={54} cy={48} r={8} fill={C.orange} />
        </G>
      );
      break;
    case 'gear-bat': el = <G transform="translate(4 -2)"><BatShape /></G>; break;
    case 'gear-glove': el = <G transform="translate(2 -4)"><GloveShape /></G>; break;
    case 'gear-helmet': el = <G transform="translate(1 0)"><HelmetShape /></G>; break;
    case 'player-batter': el = <Person hold="bat" />; break;
    case 'player-pitcher': el = <Person hold="ball" />; break;
    case 'player-catcher': el = <Person hold="mitt" />; break;
    case 'zone-behindhome': el = <MiniPositions on={[]} base="behind" />; break;
    case 'zone-first': el = <MiniPositions on={[]} base="first" />; break;
    case 'pos-middle': el = <MiniPositions on={['pos2b', 'posSS']} />; break;
    case 'pos-catcher': el = <MiniPositions on={['posC']} />; break;
    case 'pos-rf': el = <MiniPositions on={['posRF']} />; break;
    case 'pos-outfielder': el = <MiniPositions on={['posLF', 'posCF', 'posRF']} />; break;
    case 'pos-1b': el = <MiniPositions on={['pos1b']} />; break;
  }
  return (
    <Svg width={size * 1.2} height={size} viewBox="0 0 72 60">
      {el}
    </Svg>
  );
}

export function Flame({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 3 3 5 1-2 1-5 0-9z" fill={C.orange} />
    </Svg>
  );
}

export function CoinBall({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} fill={C.white} stroke={C.navy} strokeWidth={1.5} />
      <Path d="M7 5q3 7 0 14M17 5q-3 7 0 14" fill="none" stroke={C.red} strokeWidth={1.5} strokeDasharray="2 1.5" />
    </Svg>
  );
}

export function StarIcon({ size = 24, color = C.white, stroke = C.navy }: { size?: number; color?: string; stroke?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Polygon points="12,2 14.9,8.6 22,9.2 16.6,13.8 18.2,21 12,17.3 5.8,21 7.4,13.8 2,9.2 9.1,8.6" fill={color} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

export function LockIcon({ size = 24, color = C.faint }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={5} y={11} width={14} height={10} rx={2} fill={color} />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke={color} strokeWidth={2.5} />
    </Svg>
  );
}

export function CheckIcon({ size = 24, color = C.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 12l5 5 9-10" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TrophyIcon({ size = 24, color = C.faint }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M7 4h10v5a5 5 0 0 1-10 0z" fill={color} />
      <Path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" fill="none" stroke={color} strokeWidth={2} />
      <Path d="M10 14h4v3h-4zM8 18h8v2H8z" fill={color} />
    </Svg>
  );
}

export function SpeakerIcon({ size = 22, color = C.navy }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 9h4l5-4v14l-5-4H4z" fill={color} />
      <Path d="M16 8q3 4 0 8M18.5 5.5q5 6.5 0 13" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function BadgeMedal({ size = 56, earned, level }: { size?: number; earned: boolean; level: number }) {
  const fills = [C.gold, C.red, C.blue, C.teal];
  const f = earned ? fills[(level - 1) % 4] : '#E2E8F0';
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56">
      <Circle cx={28} cy={28} r={26} fill={f} stroke={earned ? C.navy : C.faint} strokeWidth={earned ? 2 : 1.5} strokeDasharray={earned ? undefined : '4 3'} />
      {earned ? (
        <Polygon points="28,12 32.6,22.4 44,23.4 35.4,30.8 38,42 28,36 18,42 20.6,30.8 12,23.4 23.4,22.4" fill={C.white} />
      ) : null}
    </Svg>
  );
}
