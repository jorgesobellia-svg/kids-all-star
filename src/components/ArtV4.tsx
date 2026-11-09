import React from 'react';
import { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import { C } from '@/theme';
import { Arrow, Ball, Kid, Park, SKIN } from './ArtV3';

// Dibujos de las opciones con imagen de los niveles 13 a 20 (clave "x:nombre").
// Mismo lienzo de 72×60 que el resto. Las opciones incorrectas no se marcan:
// el niño tiene que mirar el dibujo, no buscar una cruz roja.

const NAVY = C.navy;

function Bg({ color = C.grass, children }: { color?: string; children?: React.ReactNode }) {
  return (
    <G>
      <Rect x={0} y={0} width={72} height={60} rx={10} fill={color} />
      {children}
    </G>
  );
}

const Plate = ({ x = 36, y = 54 }: { x?: number; y?: number }) => <Polygon points={`${x - 5},${y - 3} ${x + 5},${y - 3} ${x + 5},${y} ${x},${y + 3} ${x - 5},${y}`} fill={C.white} />;
const Dirt = () => <Ellipse cx={36} cy={52} rx={30} ry={9} fill={C.dirt} />;
const Sun = ({ x = 60, y = 11 }: { x?: number; y?: number }) => (
  <G>
    <Circle cx={x} cy={y} r={6} fill="#FDE047" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
      const r = (a * Math.PI) / 180;
      return <Line key={a} x1={x + Math.cos(r) * 8} y1={y + Math.sin(r) * 8} x2={x + Math.cos(r) * 11} y2={y + Math.sin(r) * 11} stroke="#FDE047" strokeWidth={1.6} strokeLinecap="round" />;
    })}
  </G>
);
const Bubble = ({ x, y, text }: { x: number; y: number; text: '!' | '?' }) => (
  <G>
    <Ellipse cx={x} cy={y} rx={7} ry={5} fill={C.white} />
    <Path d={`M${x - 2} ${y + 4} l-3 4 l6 -3 z`} fill={C.white} />
    {text === '!' ? (
      <G>
        <Line x1={x} y1={y - 3} x2={x} y2={y + 1} stroke={C.red} strokeWidth={1.8} strokeLinecap="round" />
        <Circle cx={x} cy={y + 2.8} r={0.9} fill={C.red} />
      </G>
    ) : (
      <Path d={`M${x - 2} ${y - 1.5} q0 -2.5 2 -2.5 q2 0 2 2 q0 1.5 -2 2.3 v1`} fill="none" stroke={NAVY} strokeWidth={1.4} strokeLinecap="round" />
    )}
  </G>
);
const Burst = ({ x, y }: { x: number; y: number }) => (
  <Polygon points={`${x},${y - 7} ${x + 2},${y - 2} ${x + 7},${y - 3} ${x + 3},${y + 1} ${x + 6},${y + 6} ${x},${y + 3} ${x - 6},${y + 6} ${x - 3},${y + 1} ${x - 7},${y - 3} ${x - 2},${y - 2}`} fill="#FDE047" stroke={C.wrong} strokeWidth={0.8} />
);
const Helmet = ({ x, y }: { x: number; y: number }) => <Path d={`M${x - 6} ${y + 1} Q${x - 6} ${y - 6} ${x} ${y - 6} Q${x + 6} ${y - 6} ${x + 6} ${y + 1} h3 v2 h-15 z`} fill={NAVY} />;

/** Catcher agachado de frente. (x, y) = pies. */
function Catcher({ x, y, mask = true, cap = false, mitt = true, chest = true, shins = true }: { x: number; y: number; mask?: boolean; cap?: boolean; mitt?: boolean; chest?: boolean; shins?: boolean }) {
  const hy = y - 22;
  return (
    <G>
      {/* piernas dobladas */}
      <Path d={`M${x - 4} ${y - 9} L${x - 9} ${y - 4} L${x - 7} ${y}`} fill="none" stroke={shins ? NAVY : '#E2E8F0'} strokeWidth={shins ? 4.4 : 3.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d={`M${x + 4} ${y - 9} L${x + 9} ${y - 4} L${x + 7} ${y}`} fill="none" stroke={shins ? NAVY : '#E2E8F0'} strokeWidth={shins ? 4.4 : 3.4} strokeLinecap="round" strokeLinejoin="round" />
      {/* cuerpo */}
      <Rect x={x - 6} y={y - 18} width={12} height={10} rx={4} fill={C.red} />
      {chest ? <Rect x={x - 5} y={y - 17.5} width={10} height={9} rx={3} fill={NAVY} /> : null}
      {/* cabeza */}
      <Circle cx={x} cy={hy} r={5} fill={SKIN} />
      {cap ? (
        <Path d={`M${x - 5.4} ${hy - 0.4} Q${x - 5.4} ${hy - 6} ${x} ${hy - 6} Q${x + 5.4} ${hy - 6} ${x + 5.4} ${hy - 0.8} h3 v1.4 h-8.8 Z`} fill={C.red} />
      ) : (
        <Path d={`M${x - 5.6} ${hy} Q${x - 5.6} ${hy - 6.2} ${x} ${hy - 6.2} Q${x + 5.6} ${hy - 6.2} ${x + 5.6} ${hy} Z`} fill={NAVY} />
      )}
      {mask ? (
        <G>
          <Rect x={x - 4.6} y={hy - 2.4} width={9.2} height={8} rx={2.4} fill="none" stroke="#1F2937" strokeWidth={1.2} />
          <Line x1={x - 4.6} y1={hy + 0.8} x2={x + 4.6} y2={hy + 0.8} stroke="#1F2937" strokeWidth={0.9} />
          <Line x1={x - 4.6} y1={hy + 3.4} x2={x + 4.6} y2={hy + 3.4} stroke="#1F2937" strokeWidth={0.9} />
        </G>
      ) : null}
      {/* brazo y mascota */}
      <Path d={`M${x - 5} ${y - 15} L${x - 11} ${y - 13}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
      {mitt ? <Circle cx={x - 13} cy={y - 13} r={4.6} fill={C.brown} /> : <Circle cx={x - 12} cy={y - 13} r={1.8} fill={SKIN} />}
    </G>
  );
}

/** Jugador agachado en posición de listo. (x, y) = pies. */
function Ready({ x, y, color = C.red }: { x: number; y: number; color?: string }) {
  return (
    <G>
      <Path d={`M${x - 3} ${y - 10} L${x - 8} ${y}`} stroke="#E2E8F0" strokeWidth={3.4} strokeLinecap="round" />
      <Path d={`M${x + 3} ${y - 10} L${x + 8} ${y}`} stroke="#E2E8F0" strokeWidth={3.4} strokeLinecap="round" />
      <Rect x={x - 6} y={y - 20} width={12} height={11} rx={4} fill={color} transform={`rotate(-12 ${x} ${y - 14})`} />
      <Circle cx={x + 2} cy={y - 24} r={5} fill={SKIN} />
      <Path d={`M${x - 3.4} ${y - 24.4} Q${x - 3.4} ${y - 30} ${x + 2} ${y - 30} Q${x + 7.4} ${y - 30} ${x + 7.4} ${y - 24.8} Z`} fill={NAVY} />
      <Path d={`M${x + 3} ${y - 16} L${x + 7} ${y - 5}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
      <Circle cx={x + 8} cy={y - 3} r={4} fill={C.brown} />
    </G>
  );
}

/** Jugador de espaldas (gorra tapando la nuca, sin cara). */
function Back({ x, y, color = C.red }: { x: number; y: number; color?: string }) {
  const top = y - 30;
  return (
    <G>
      <Path d={`M${x - 3} ${y - 12} L${x - 5} ${y}`} stroke="#E2E8F0" strokeWidth={3.4} strokeLinecap="round" />
      <Path d={`M${x + 3} ${y - 12} L${x + 5} ${y}`} stroke="#E2E8F0" strokeWidth={3.4} strokeLinecap="round" />
      <Rect x={x - 6} y={top + 8} width={12} height={12} rx={4} fill={color} />
      <Circle cx={x} cy={top + 4} r={5} fill={NAVY} />
      <Rect x={x - 2} y={top + 11} width={4} height={6} rx={1} fill={C.white} />
    </G>
  );
}

/** Corredor deslizándose con los pies primero hacia la derecha. */
function SlideFeet({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Path d={`M${x} ${y - 3} L${x + 16} ${y - 1}`} stroke="#E2E8F0" strokeWidth={3.6} strokeLinecap="round" />
      <Path d={`M${x + 2} ${y - 4} L${x + 8} ${y - 8} L${x + 12} ${y - 4}`} fill="none" stroke="#E2E8F0" strokeWidth={3.2} strokeLinecap="round" />
      <Rect x={x - 12} y={y - 9} width={13} height={8} rx={4} fill={C.red} transform={`rotate(-20 ${x - 6} ${y - 5})`} />
      <Circle cx={x - 15} cy={y - 12} r={4.6} fill={SKIN} />
      <Helmet x={x - 15} y={y - 12} />
      <Path d={`M${x - 10} ${y - 9} L${x - 12} ${y - 20}`} stroke={SKIN} strokeWidth={2.4} strokeLinecap="round" />
      <Path d={`M${x - 6} ${y - 9} L${x - 6} ${y - 19}`} stroke={SKIN} strokeWidth={2.4} strokeLinecap="round" />
    </G>
  );
}

export function XArt4({ name }: { name: string }) {
  switch (name) {
    // 13.1 catcher listo / con gorra sin careta / sin guante
    case 'catcherReady':
      return (
        <Bg>
          <Dirt />
          <Plate />
          <Catcher x={36} y={46} />
        </Bg>
      );
    case 'catcherCap':
      return (
        <Bg>
          <Dirt />
          <Plate />
          <Catcher x={36} y={46} mask={false} cap chest={false} shins={false} />
        </Bg>
      );
    case 'catcherNoGlove':
      return (
        <Bg>
          <Dirt />
          <Plate />
          <Catcher x={36} y={46} mitt={false} />
        </Bg>
      );
    // 13.3 bloqueo
    case 'blockGood':
      return (
        <Bg>
          <Dirt />
          <G>
            <Rect x={27} y={40} width={18} height={4} rx={2} fill="#E2E8F0" />
            <Rect x={30} y={27} width={12} height={13} rx={4} fill={NAVY} transform="rotate(10 36 33)" />
            <Circle cx={37} cy={22} r={5} fill={SKIN} />
            <Path d="M31.4 22 Q31.4 15.8 37 15.8 Q42.6 15.8 42.6 22 Z" fill={NAVY} />
            <Rect x={32.4} y={19.6} width={9.2} height={8} rx={2.4} fill="none" stroke="#1F2937" strokeWidth={1.2} />
            <Circle cx={36} cy={44} r={4.4} fill={C.brown} />
          </G>
          <Ball x={36} y={50} r={3} />
          <Arrow d="M36 8 L36 14" />
        </Bg>
      );
    case 'catcherSide':
      return (
        <Bg>
          <Dirt />
          <Kid x={30} y={52} pose="glove" color={NAVY} />
          <Ball x={56} y={50} r={3} />
          <Arrow d="M48 44 L60 52" />
        </Bg>
      );
    case 'catcherJump':
      return (
        <Bg>
          <Dirt />
          <Kid x={36} y={40} pose="arms" color={NAVY} />
          <Ball x={36} y={52} r={3} />
          <Arrow d="M20 52 L60 52" />
        </Bg>
      );
    // 14.1 listo / de espaldas / conversando
    case 'readyPos':
      return (
        <Bg>
          <Ready x={34} y={54} />
        </Bg>
      );
    case 'backTurned':
      return (
        <Bg>
          <Back x={36} y={54} />
        </Bg>
      );
    case 'chatting':
      return (
        <Bg>
          <Kid x={22} y={56} />
          <Kid x={50} y={56} color={C.blue} flip />
          <Bubble x={30} y={12} text="!" />
          <Bubble x={44} y={10} text="?" />
        </Bg>
      );
    // 14.5 comunicación
    case 'callMine':
      return (
        <Bg>
          <Ball x={30} y={8} />
          <Kid x={28} y={56} pose="arms" />
          <Bubble x={14} y={16} text="!" />
          <Kid x={56} y={56} color={C.blue} flip />
          <Arrow d="M50 48 L62 48" />
        </Bg>
      );
    case 'collide':
      return (
        <Bg>
          <Ball x={36} y={8} />
          <Kid x={30} y={56} pose="glove" />
          <Kid x={42} y={56} pose="glove" color={C.blue} flip />
          <Burst x={36} y={24} />
        </Bg>
      );
    case 'lookAway':
      return (
        <Bg>
          <Ball x={10} y={10} />
          <Kid x={40} y={56} />
          <Kid x={58} y={56} color={C.blue} />
          <Ball x={64} y={30} r={2.4} />
        </Bg>
      );
    // 15.1 primer paso
    case 'dropStep':
      return (
        <Bg>
          <Ball x={36} y={7} />
          <Arrow d="M36 12 Q38 18 36 24" />
          <Back x={36} y={56} />
          <Arrow d="M44 46 L58 36" />
        </Bg>
      );
    case 'runIn':
      return (
        <Bg>
          <Ball x={36} y={7} />
          <Kid x={36} y={50} pose="glove" />
          <Arrow d="M36 54 L36 59" />
          <Arrow d="M24 50 L24 58" />
        </Bg>
      );
    case 'standStill':
      return (
        <Bg>
          <Ball x={56} y={8} />
          <Arrow d="M20 14 Q40 2 56 8" />
          <Kid x={30} y={56} />
        </Bg>
      );
    // 15.5 sol
    case 'sunVisor':
      return (
        <Bg color="#7DD3FC">
          <Sun x={14} y={12} />
          <Ball x={26} y={16} r={2.6} />
          <Rect x={0} y={50} width={72} height={10} fill={C.grass} />
          <Kid x={46} y={58} pose="glove" flip />
        </Bg>
      );
    case 'coverFace':
      return (
        <Bg color="#7DD3FC">
          <Sun x={14} y={12} />
          <Rect x={0} y={50} width={72} height={10} fill={C.grass} />
          <Kid x={46} y={58} />
          <Ellipse cx={46} cy={32} rx={6} ry={4} fill={SKIN} />
        </Bg>
      );
    case 'backToBall':
      return (
        <Bg color="#7DD3FC">
          <Sun x={14} y={12} />
          <Ball x={24} y={18} r={2.6} />
          <Rect x={0} y={50} width={72} height={10} fill={C.grass} />
          <Back x={46} y={58} />
        </Bg>
      );
    // 16.1 postura
    case 'stanceGood':
      return (
        <Bg>
          <Dirt />
          <Rect x={14} y={30} width={18} height={26} fill="none" stroke={C.white} strokeWidth={1.4} />
          <Plate x={40} y={50} />
          <G>
            <Path d="M19 44 L17 55" stroke="#E2E8F0" strokeWidth={3.4} strokeLinecap="round" />
            <Path d="M26 44 L28 55" stroke="#E2E8F0" strokeWidth={3.4} strokeLinecap="round" />
            <Rect x={17} y={32} width={11} height={12} rx={4} fill={C.red} />
            <Circle cx={23} cy={27} r={5} fill={SKIN} />
            <Helmet x={23} y={27} />
            <Line x1={20} y1={32} x2={10} y2={18} stroke={C.brown} strokeWidth={3} strokeLinecap="round" />
          </G>
        </Bg>
      );
    case 'outOfBox':
      return (
        <Bg>
          <Dirt />
          <Rect x={30} y={30} width={18} height={26} fill="none" stroke={C.white} strokeWidth={1.4} />
          <Plate x={56} y={50} />
          <Kid x={18} y={56} pose="swing" />
        </Bg>
      );
    case 'lookDugout':
      return (
        <Bg>
          <Dirt />
          <Rect x={20} y={30} width={18} height={26} fill="none" stroke={C.white} strokeWidth={1.4} />
          <Rect x={50} y={8} width={20} height={10} rx={2} fill="#5B4636" />
          <Back x={29} y={56} />
          <Line x1={24} y1={36} x2={14} y2={24} stroke={C.brown} strokeWidth={3} strokeLinecap="round" />
        </Bg>
      );
    // 16.5 soltar el bate
    case 'batDrop':
      return (
        <Park>
          <Line x1={30} y1={56} x2={42} y2={54} stroke={C.brown} strokeWidth={2.6} strokeLinecap="round" />
          <G>
            <Circle cx={50} cy={40} r={4.6} fill={C.red} stroke={C.white} strokeWidth={1.4} />
            <Helmet x={50} y={38} />
          </G>
          <Arrow d="M44 50 L48 45" />
        </Park>
      );
    case 'batFly':
      return (
        <Park>
          <Line x1={20} y1={34} x2={30} y2={26} stroke={C.brown} strokeWidth={2.6} strokeLinecap="round" />
          <Path d="M18 24 q4 -6 10 -4" fill="none" stroke={C.white} strokeWidth={1.2} />
          <Path d="M32 36 q-4 4 -10 2" fill="none" stroke={C.white} strokeWidth={1.2} />
          <Circle cx={50} cy={40} r={4.6} fill={C.red} stroke={C.white} strokeWidth={1.4} />
        </Park>
      );
    case 'noHelmet':
      return (
        <Park>
          <Circle cx={50} cy={40} r={4.6} fill={SKIN} stroke={C.white} strokeWidth={1.4} />
          <Path d="M46 38 q4 -5 8 0" fill="#7C4A21" />
          <Arrow d="M40 50 L46 45" />
        </Park>
      );
    // 18.1 deslizamiento
    case 'slideFeet':
      return (
        <Bg>
          <Rect x={0} y={42} width={72} height={18} fill={C.dirt} />
          <Rect x={56} y={46} width={8} height={5} rx={1} fill={C.white} />
          <SlideFeet x={38} y={52} />
        </Bg>
      );
    case 'slideHead':
      return (
        <Bg>
          <Rect x={0} y={42} width={72} height={18} fill={C.dirt} />
          <Rect x={56} y={46} width={8} height={5} rx={1} fill={C.white} />
          <G>
            <Path d="M14 50 L26 49" stroke="#E2E8F0" strokeWidth={3.4} strokeLinecap="round" />
            <Rect x={26} y={44} width={14} height={8} rx={4} fill={C.red} />
            <Circle cx={45} cy={47} r={4.6} fill={SKIN} />
            <Helmet x={45} y={47} />
            <Path d="M40 46 L54 44" stroke={SKIN} strokeWidth={2.4} strokeLinecap="round" />
          </G>
        </Bg>
      );
    case 'slideCrash':
      return (
        <Bg>
          <Rect x={0} y={42} width={72} height={18} fill={C.dirt} />
          <Kid x={30} y={56} pose="throw" />
          <Kid x={44} y={56} pose="glove" color={C.blue} flip />
          <Burst x={37} y={34} />
        </Bg>
      );
    // 19.1 calentar (tocar al jugador correcto)
    case 'warmSoft':
      return (
        <Bg>
          <Kid x={18} y={56} pose="glove" />
          <Kid x={50} y={56} pose="glove" color={C.blue} flip />
          <Arrow d="M26 30 Q34 20 42 30" />
        </Bg>
      );
    case 'warmHard':
      return (
        <Bg>
          <Kid x={12} y={56} pose="throw" />
          <Ball x={60} y={26} />
          <Path d="M24 26 h28 M26 22 h20 M26 30 h20" stroke={C.white} strokeWidth={1.4} strokeLinecap="round" />
          <Path d="M6 20 l2 -3 m2 4 l3 -2" stroke={C.wrong} strokeWidth={1.4} strokeLinecap="round" />
        </Bg>
      );
    case 'sitting':
      return (
        <Bg>
          <Rect x={14} y={46} width={44} height={4} rx={2} fill="#8a6a44" />
          <Kid x={36} y={56} pose="sit" />
        </Bg>
      );
    // 19.2 calor
    case 'waterShade':
      return (
        <Bg>
          <Rect x={6} y={10} width={60} height={8} rx={2} fill="#5B4636" />
          <Rect x={6} y={18} width={60} height={34} fill="#1E5A22" opacity={0.6} />
          <Rect x={14} y={46} width={44} height={4} rx={2} fill="#8a6a44" />
          <Kid x={36} y={56} pose="sit" />
        </Bg>
      );
    case 'noWater':
      return (
        <Bg color="#FDBA74">
          <Sun x={58} y={12} />
          <Rect x={0} y={50} width={72} height={10} fill={C.grass} />
          <Kid x={30} y={58} pose="throw" />
          <Path d="M22 24 q-1 3 0 4 M40 22 q1 3 0 4" stroke="#60A5FA" strokeWidth={1.6} strokeLinecap="round" />
        </Bg>
      );
    case 'jackets':
      return (
        <Bg>
          <Sun x={60} y={10} />
          <Kid x={34} y={56} color="#7C3AED" />
          <Rect x={25} y={26} width={18} height={16} rx={6} fill="#B45309" />
          <Rect x={27} y={28} width={14} height={13} rx={5} fill="#2563EB" />
          <Rect x={29} y={24} width={10} height={5} rx={2} fill="#DC2626" />
        </Bg>
      );
    // 20.5 tu próxima temporada
    case 'teamField':
      return (
        <Park>
          {[20, 36, 52].map((x, i) => (
            <G key={x}>
              <Circle cx={x} cy={44} r={4.6} fill={SKIN} />
              <Helmet x={x} y={44} />
              <Path d={`M${x - 2} ${46} q2 1.6 4 0`} fill="none" stroke="#7C2D12" strokeWidth={0.9} />
              <Rect x={x - 5} y={49} width={10} height={9} rx={3} fill={i === 1 ? C.red : C.blue} />
            </G>
          ))}
        </Park>
      );
    case 'tvAlone':
      return (
        <Bg color="#E2E8F0">
          <Rect x={30} y={10} width={36} height={24} rx={3} fill="#1F2937" />
          <Rect x={33} y={13} width={30} height={18} rx={2} fill={C.grass} />
          <Polygon points="48,30 56,22 48,14 40,22" fill={C.dirt} opacity={0.8} />
          <Kid x={16} y={56} pose="sit" color="#64748B" />
        </Bg>
      );
    case 'trophyShelf':
      return (
        <Bg color="#E2E8F0">
          <Rect x={8} y={44} width={56} height={4} rx={1} fill="#8a6a44" />
          <Path d="M28 16 h16 v6 q0 10 -8 12 q-8 -2 -8 -12 z" fill="#EAB308" />
          <Rect x={33} y={34} width={6} height={5} fill="#EAB308" />
          <Rect x={28} y={39} width={16} height={5} rx={1} fill="#A16207" />
          <Path d="M28 18 q-6 0 -5 5 q1 4 5 4 M44 18 q6 0 5 5 q-1 4 -5 4" fill="none" stroke="#EAB308" strokeWidth={1.6} />
        </Bg>
      );
    default:
      return null;
  }
}
