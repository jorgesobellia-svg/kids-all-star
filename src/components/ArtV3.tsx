import React from 'react';
import { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import { C } from '@/theme';

// Dibujos de las opciones con imagen de los niveles 5 a 12 (clave "x:nombre").
// Todos usan el mismo lienzo de 72×60 que los dibujos de los niveles 1 a 4.

const SKIN = '#F2C29B';

/** Campo pequeño con jardines, cuadro y cerca. Home abajo. */
function Park({ children }: { children?: React.ReactNode }) {
  return (
    <G>
      <Rect x={0} y={0} width={72} height={60} rx={10} fill="#2A6E2D" />
      <Path d="M36 58 L2 24 A 48 48 0 0 1 70 24 Z" fill={C.grass} />
      <Path d="M2 24 A 48 48 0 0 1 70 24" fill="none" stroke="#8a6a44" strokeWidth={2.5} />
      <Polygon points="36,58 50,44 36,30 22,44" fill={C.dirt} />
      <Polygon points="36,53 45,44 36,35 27,44" fill={C.grass} />
      {[
        [50, 44],
        [36, 30],
        [22, 44],
      ].map(([x, y]) => (
        <Rect key={`${x}`} x={x - 2.2} y={y - 2.2} width={4.4} height={4.4} fill={C.white} transform={`rotate(45 ${x} ${y})`} />
      ))}
      <Polygon points="33,56 39,56 39,58 36,60 33,58" fill={C.white} />
      {children}
    </G>
  );
}

/** Diamante grande (solo el cuadro), para corredores. */
function Dia({ children }: { children?: React.ReactNode }) {
  return (
    <G>
      <Rect x={0} y={0} width={72} height={60} rx={10} fill="#2A6E2D" />
      <Polygon points="36,56 62,32 36,8 10,32" fill={C.dirt} />
      <Polygon points="36,48 54,32 36,16 18,32" fill={C.grass} />
      {[
        [62, 32],
        [36, 8],
        [10, 32],
      ].map(([x, y]) => (
        <Rect key={`${x}`} x={x - 3} y={y - 3} width={6} height={6} fill={C.white} transform={`rotate(45 ${x} ${y})`} />
      ))}
      <Polygon points="32,53 40,53 40,56 36,59 32,56" fill={C.white} />
      {children}
    </G>
  );
}

const Ball = ({ x, y, r = 3.4 }: { x: number; y: number; r?: number }) => <Circle cx={x} cy={y} r={r} fill={C.white} stroke={C.red} strokeWidth={1} />;
const Runner = ({ x, y }: { x: number; y: number }) => (
  <G>
    <Circle cx={x} cy={y} r={4.6} fill={C.red} stroke={C.white} strokeWidth={1.4} />
    <Path d={`M${x - 3.6} ${y - 1} a 3.6 3 0 0 1 7.2 0 z`} fill={C.navy} />
  </G>
);
const Arrow = ({ d, color = C.gold }: { d: string; color?: string }) => <Path d={d} fill="none" stroke={color} strokeWidth={2.2} strokeDasharray="3 2" strokeLinecap="round" />;
const Bad = ({ x, y }: { x: number; y: number }) => <Circle cx={x} cy={y} r={8} fill="none" stroke={C.wrong} strokeWidth={2.4} />;

type Pose = 'stand' | 'swing' | 'bunt' | 'batDown' | 'run' | 'glove' | 'throw' | 'sit' | 'angry' | 'tease' | 'arms' | 'set' | 'stop' | 'bandage';

/** Jugador de cuerpo entero. (x, y) = pies. */
function Kid({ x, y, pose = 'stand', color = C.red, flip = false }: { x: number; y: number; pose?: Pose; color?: string; flip?: boolean }) {
  const f = flip ? -1 : 1;
  const top = y - 30;
  const body = (
    <G>
      <Path d={`M${x - 3} ${y - 12} L${x - 5} ${y}`} stroke="#E2E8F0" strokeWidth={3.4} strokeLinecap="round" />
      <Path d={`M${x + 3} ${y - 12} L${x + 5} ${y}`} stroke="#E2E8F0" strokeWidth={3.4} strokeLinecap="round" />
      <Rect x={x - 6} y={top + 8} width={12} height={12} rx={4} fill={color} />
      <Circle cx={x} cy={top + 4} r={5} fill={SKIN} />
      <Path d={`M${x - 5.4} ${top + 3.6} Q${x - 5.4} ${top - 2} ${x} ${top - 2} Q${x + 5.4} ${top - 2} ${x + 5.4} ${top + 3.2} Z`} fill={C.navy} />
    </G>
  );
  let extra: React.ReactNode = null;
  switch (pose) {
    case 'swing':
      extra = (
        <G>
          <Path d={`M${x} ${top + 12} L${x + 8 * f} ${top + 13}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
          <Line x1={x + 6 * f} y1={top + 13} x2={x + 26 * f} y2={top + 10} stroke={C.brown} strokeWidth={3} strokeLinecap="round" />
          <Path d={`M${x + 14 * f} ${top + 3} q ${8 * f} -2 ${12 * f} 2`} fill="none" stroke={C.white} strokeWidth={1.2} />
        </G>
      );
      break;
    case 'bunt':
      extra = (
        <G>
          <Path d={`M${x} ${top + 12} L${x + 8 * f} ${top + 12}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
          <Line x1={x + 4 * f} y1={top + 16} x2={x + 18 * f} y2={top + 8} stroke={C.brown} strokeWidth={3} strokeLinecap="round" />
        </G>
      );
      break;
    case 'batDown':
      extra = <Line x1={x + 8} y1={y - 1} x2={x + 26} y2={y - 1} stroke={C.brown} strokeWidth={3} strokeLinecap="round" />;
      break;
    case 'glove':
      extra = (
        <G>
          <Path d={`M${x + 4 * f} ${top + 11} L${x + 11 * f} ${top + 4}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
          <Circle cx={x + 12 * f} cy={top + 2} r={4} fill={C.brown} />
        </G>
      );
      break;
    case 'throw':
    case 'arms':
      extra = (
        <G>
          <Path d={`M${x - 4} ${top + 10} L${x - 8} ${top - 2}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
          <Path d={`M${x + 4} ${top + 10} L${x + 8} ${top - 2}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
        </G>
      );
      break;
    case 'set':
      extra = <Circle cx={x} cy={top + 14} r={3.6} fill={C.brown} />;
      break;
    case 'stop':
      extra = (
        <G>
          <Path d={`M${x + 4 * f} ${top + 10} L${x + 12 * f} ${top + 2}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
          <Circle cx={x + 22 * f} cy={top + 4} r={6} fill={C.wrong} />
          <Line x1={x + 19 * f} y1={top + 1} x2={x + 25 * f} y2={top + 7} stroke={C.white} strokeWidth={1.8} />
          <Line x1={x + 25 * f} y1={top + 1} x2={x + 19 * f} y2={top + 7} stroke={C.white} strokeWidth={1.8} />
        </G>
      );
      break;
    case 'angry':
      extra = (
        <G>
          <Path d={`M${x + 5} ${top + 10} L${x + 12} ${top}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
          <Path d={`M${x + 14} ${top - 8} a 6 5 0 0 1 12 0 z`} fill={C.navy} />
          <Path d={`M${x - 10} ${top - 4} l3 3 m0 -3 l-3 3`} stroke={C.wrong} strokeWidth={1.6} />
        </G>
      );
      break;
    case 'tease':
      extra = (
        <G>
          <Path d={`M${x + 4} ${top + 10} L${x + 6} ${top + 2}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
          <Ellipse cx={x + 9} cy={top - 6} rx={7} ry={4.5} fill={C.white} stroke={C.wrong} strokeWidth={1.2} />
          <Path d={`M${x + 5} ${top - 6} h8`} stroke={C.wrong} strokeWidth={1.4} />
        </G>
      );
      break;
    case 'bandage':
      extra = (
        <G>
          <Path d={`M${x + 4} ${top + 10} L${x + 12} ${top + 2}`} stroke={SKIN} strokeWidth={2.6} strokeLinecap="round" />
          <Rect x={x + 6} y={top + 2} width={6} height={5} fill={C.white} stroke="#CBD5E1" strokeWidth={0.8} transform={`rotate(-45 ${x + 9} ${top + 4})`} />
          <Path d={`M${x + 16} ${top - 2} l3 -3 m-1 6 l4 -1`} stroke={C.wrong} strokeWidth={1.6} strokeLinecap="round" />
        </G>
      );
      break;
    default:
      break;
  }
  if (pose === 'sit') {
    return (
      <G>
        <Rect x={x - 6} y={top + 12} width={12} height={10} rx={4} fill={color} />
        <Path d={`M${x - 3} ${top + 22} l8 0 l0 7`} fill="none" stroke="#E2E8F0" strokeWidth={3.4} strokeLinecap="round" />
        <Circle cx={x} cy={top + 8} r={5} fill={SKIN} />
        <Path d={`M${x - 5.4} ${top + 7.6} Q${x - 5.4} ${top + 2} ${x} ${top + 2} Q${x + 5.4} ${top + 2} ${x + 5.4} ${top + 7.2} Z`} fill={C.navy} />
        <Rect x={x + 6} y={top + 12} width={7} height={6} rx={2} fill="#93C5FD" />
      </G>
    );
  }
  return (
    <G>
      {body}
      {extra}
    </G>
  );
}

/** Marcador mínimo R H E de dos filas, con una columna resaltada. */
function MiniLS({ hot }: { hot: 'R' | 'H' | 'tie' }) {
  const col = (i: number) => 26 + i * 15;
  return (
    <G>
      <Rect x={2} y={6} width={68} height={48} rx={8} fill={C.navy} />
      {['R', 'H', 'E'].map((k, i) => (
        <Rect key={k} x={col(i) - 6} y={10} width={12} height={40} rx={3} fill={hot === k ? C.gold : 'transparent'} fillOpacity={0.9} />
      ))}
      <Rect x={8} y={24} width={12} height={4} rx={2} fill="#CBD5E1" />
      <Rect x={8} y={40} width={12} height={4} rx={2} fill="#CBD5E1" />
      {[
        [5, 8, 1],
        [3, 9, 0],
      ].map((row, ri) =>
        row.map((n, ci) => (
          <G key={`${ri}-${ci}`}>
            {Array.from({ length: Math.min(n, 4) }, (_, k) => (
              <Circle key={k} cx={col(ci) - 3 + (k % 2) * 6} cy={23 + ri * 16 + Math.floor(k / 2) * 5} r={1.8} fill={hot === ['R', 'H', 'E'][ci] ? C.navy : C.white} />
            ))}
          </G>
        )),
      )}
      {hot === 'tie' ? <Path d="M28 28 h16 M28 34 h16" stroke={C.gold} strokeWidth={3} /> : null}
    </G>
  );
}

export function XArt({ name }: { name: string }) {
  switch (name) {
    // 5.1 ¿Cuál imagen muestra un hit?
    case 'hitOF':
      return (
        <Park>
          <Arrow d="M36 56 Q20 20 16 18" />
          <Ball x={16} y={18} />
          <Runner x={50} y={44} />
        </Park>
      );
    case 'caughtAir':
      return (
        <Park>
          <Arrow d="M36 56 Q40 14 46 16" color={C.white} />
          <Circle cx={47} cy={16} r={5} fill={C.brown} />
          <Ball x={47} y={15} r={2.6} />
        </Park>
      );
    case 'swingMiss':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Rect x={0} y={44} width={72} height={16} fill={C.dirt} />
          <Kid x={24} y={54} pose="swing" />
          <Ball x={56} y={46} />
          <Path d="M64 14 l-10 10 m0 -10 l10 10" stroke={C.wrong} strokeWidth={2.4} />
        </G>
      );
    // 5.4 ¿Cuál corredor está en peligro?
    case 'overrun2':
      return (
        <Dia>
          <Runner x={30} y={6} />
          <Bad x={30} y={6} />
          <Arrow d="M36 9 L28 6" />
        </Dia>
      );
    case 'overrun1back':
      return (
        <Dia>
          <Runner x={68} y={36} />
          <Arrow d="M66 38 Q66 30 62 30" color={C.green} />
        </Dia>
      );
    case 'onBase':
      return (
        <Dia>
          <Runner x={62} y={32} />
        </Dia>
      );
    // 5.5 ¿Cuál imagen muestra un toque?
    case 'buntPose':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Rect x={0} y={46} width={72} height={14} fill={C.dirt} />
          <Kid x={28} y={56} pose="bunt" />
          <Ball x={52} y={30} />
        </G>
      );
    case 'swingFull':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Rect x={0} y={46} width={72} height={14} fill={C.dirt} />
          <Kid x={24} y={56} pose="swing" />
          <Path d="M50 20 q10 6 4 16" fill="none" stroke={C.white} strokeWidth={1.4} />
        </G>
      );
    case 'batFloor':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Rect x={0} y={46} width={72} height={14} fill={C.dirt} />
          <Kid x={22} y={56} pose="batDown" />
        </G>
      );
    // 6.1 ¿Cuál batazo es out seguro si se atrapa?
    case 'flyOF':
      return (
        <Park>
          <Arrow d="M36 56 Q34 0 36 14" color={C.white} />
          <Ball x={36} y={14} />
        </Park>
      );
    case 'rollGround':
      return (
        <Park>
          <Arrow d="M36 56 L24 34" />
          <Ball x={24} y={34} />
        </Park>
      );
    case 'softBunt':
      return (
        <Park>
          <Arrow d="M36 56 L42 50" />
          <Ball x={42} y={50} />
        </Park>
      );
    // 6.3 ¿Cuál toque vale para out?
    case 'tagBall':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill={C.dirt} />
          <Kid x={20} y={54} pose="glove" color={C.navy} />
          <Ball x={32} y={24} r={2.4} />
          <Runner x={40} y={26} />
          <Circle cx={36} cy={25} r={10} fill="none" stroke={C.green} strokeWidth={2} />
        </G>
      );
    case 'tagEmpty':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill={C.dirt} />
          <Kid x={20} y={54} pose="glove" color={C.navy} />
          <Runner x={40} y={26} />
          <Ball x={10} y={52} />
        </G>
      );
    case 'handNoBall':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill={C.dirt} />
          <Kid x={20} y={54} pose="arms" color={C.navy} />
          <Runner x={36} y={22} />
          <Ball x={62} y={52} />
        </G>
      );
    // 7.4 ¿Cuál imagen muestra la fila correcta?
    case 'rowGood':
      return (
        <Dia>
          <Runner x={46} y={18} />
          <Runner x={56} y={28} />
          <Arrow d="M42 14 L38 10" color={C.green} />
        </Dia>
      );
    case 'passing':
      return (
        <Dia>
          <Runner x={52} y={24} />
          <Runner x={44} y={17} />
          <Arrow d="M58 30 Q60 16 44 12" color={C.wrong} />
        </Dia>
      );
    case 'backwards':
      return (
        <Dia>
          <Runner x={22} y={20} />
          <Arrow d="M20 18 L32 10" color={C.wrong} />
        </Dia>
      );
    // 8.1 ¿Cuál imagen muestra un error?
    case 'dropFly':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill={C.grass} />
          <Kid x={30} y={54} pose="glove" color={C.navy} />
          <Ball x={48} y={52} />
          <Path d="M44 20 Q48 34 48 46" fill="none" stroke={C.white} strokeWidth={1.4} strokeDasharray="2 2" />
          <Bad x={48} y={52} />
        </G>
      );
    case 'cleanHit':
      return (
        <Park>
          <Arrow d="M36 56 L54 18" />
          <Ball x={54} y={18} />
        </Park>
      );
    case 'hrFence':
      return (
        <Park>
          <Arrow d="M36 56 Q30 -6 22 4" color={C.white} />
          <Ball x={22} y={4} />
        </Park>
      );
    // 8.5 Un marcador… ¿quién ganó?
    case 'lsR':
      return <MiniLS hot="R" />;
    case 'lsH':
      return <MiniLS hot="H" />;
    case 'lsTie':
      return <MiniLS hot="tie" />;
    // 9.4 ¿Cuál imagen muestra un balk?
    case 'pitchStop':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Path d="M8 58 Q36 40 64 58 Z" fill={C.dirt} />
          <Kid x={30} y={52} pose="stop" />
        </G>
      );
    case 'pitchNormal':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Path d="M8 58 Q36 40 64 58 Z" fill={C.dirt} />
          <Kid x={40} y={52} pose="throw" />
          <Arrow d="M30 22 L6 30" color={C.white} />
          <Ball x={6} y={30} />
        </G>
      );
    case 'pickoffLegal':
      return (
        <Dia>
          <Kid x={36} y={40} pose="throw" color={C.navy} />
          <Arrow d="M40 22 L60 30" color={C.green} />
          <Ball x={60} y={30} />
          <Runner x={56} y={38} />
        </Dia>
      );
    // 10.2 ¿Cuál elevado puede ser infield fly?
    case 'popIF':
      return (
        <Park>
          <Arrow d="M36 56 Q34 10 40 38" color={C.white} />
          <Ball x={40} y={38} />
        </Park>
      );
    case 'lineOF':
      return (
        <Park>
          <Path d="M36 56 L60 20" stroke={C.white} strokeWidth={2.2} />
          <Ball x={60} y={20} />
        </Park>
      );
    case 'deepFly':
      return (
        <Park>
          <Arrow d="M36 56 Q30 -4 30 8" color={C.white} />
          <Ball x={30} y={8} />
        </Park>
      );
    // 11.2 ¿Cuál imagen muestra el set?
    case 'setPose':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Path d="M8 58 Q36 40 64 58 Z" fill={C.dirt} />
          <Kid x={36} y={52} pose="set" />
        </G>
      );
    case 'windupPose':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Path d="M8 58 Q36 40 64 58 Z" fill={C.dirt} />
          <Kid x={36} y={52} pose="arms" />
        </G>
      );
    case 'pitcherBatting':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Rect x={0} y={46} width={72} height={14} fill={C.dirt} />
          <Kid x={24} y={56} pose="swing" />
        </G>
      );
    // 11.3 ¿Cuál agarre y lanzamiento aprendes primero?
    case 'gripFast':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#E8EEF7" />
          <Circle cx={36} cy={32} r={18} fill={C.white} stroke="#CBD5E1" />
          <Path d="M24 22 Q36 32 24 42 M48 22 Q36 32 48 42" fill="none" stroke={C.red} strokeWidth={1.4} strokeDasharray="2 2" />
          <Rect x={29} y={6} width={6} height={26} rx={3} fill={SKIN} />
          <Rect x={37} y={6} width={6} height={26} rx={3} fill={SKIN} />
        </G>
      );
    case 'curveTwist':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#E8EEF7" />
          <Circle cx={36} cy={32} r={18} fill={C.white} stroke="#CBD5E1" />
          <Path d="M20 50 Q8 30 22 14" fill="none" stroke={C.wrong} strokeWidth={2.4} />
          <Path d="M18 12 l4 2 l-1 4" fill="none" stroke={C.wrong} strokeWidth={2.4} />
          <Path d="M28 24 q8 -6 16 0" fill="none" stroke={SKIN} strokeWidth={6} strokeLinecap="round" />
        </G>
      );
    case 'eyesClosed':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#E8EEF7" />
          <Circle cx={36} cy={30} r={18} fill={SKIN} />
          <Path d="M24 28 q5 4 10 0 M38 28 q5 4 10 0" fill="none" stroke={C.navy} strokeWidth={2} />
          <Path d="M28 40 q8 4 16 0" fill="none" stroke={C.navy} strokeWidth={2} />
        </G>
      );
    // 11.4 ¿Cuál imagen muestra cuidar el brazo?
    case 'restDugout':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#5B4636" />
          <Rect x={8} y={44} width={56} height={5} rx={2} fill="#C9A27A" />
          <Kid x={34} y={52} pose="sit" />
        </G>
      );
    case 'throwDaily':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Rect x={0} y={46} width={72} height={14} fill={C.grass} />
          <Kid x={18} y={56} pose="throw" />
          {[0, 1, 2, 3, 4].map((i) => (
            <Rect key={i} x={34 + i * 7} y={10} width={5} height={5} fill={C.wrong} />
          ))}
        </G>
      );
    case 'armBandage':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill="#BFDBFE" />
          <Rect x={0} y={46} width={72} height={14} fill={C.grass} />
          <Kid x={30} y={56} pose="bandage" />
        </G>
      );
    // 12.5 ¿Cuál imagen muestra deportividad?
    case 'handshake':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill={C.grass} />
          <Kid x={22} y={56} color={C.red} />
          <Kid x={50} y={56} color={C.blue} />
          <Path d="M27 37 L45 37" stroke={SKIN} strokeWidth={3} strokeLinecap="round" />
        </G>
      );
    case 'helmetThrow':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill={C.grass} />
          <Kid x={26} y={56} pose="angry" />
        </G>
      );
    case 'teasing':
      return (
        <G>
          <Rect x={0} y={0} width={72} height={60} rx={10} fill={C.grass} />
          <Kid x={22} y={56} pose="tease" />
          <Kid x={54} y={56} color={C.blue} />
        </G>
      );
    default:
      return null;
  }
}
