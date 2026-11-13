// Video de entrada (solo la primera vez): estadio de noche, un bateador a contraluz pega un
// jonrón, la cámara sigue la bola al cielo y la bola resulta ser Pelotín, que se convierte en
// el logo del juego justo antes de elegir el idioma. Todo es animación (sin archivo de video).
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';
import { MascotFace } from '@/components/Art';
import { startGameAmbience, stopGameAmbience } from '@/services/music';
import { playSfx } from '@/services/sfx';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

const W = 390;
const H = 844;
const RIM = '#FFE9B0';
/** Duración total (s). */
const END = 7.4;
/** Momento del batazo (s). */
const HIT = 1.75;

// ------------------------------------------------------------------ utilidades de tiempo
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
/** Avance 0→1 entre los segundos a y b. */
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const easeIn = (x: number) => x ** 3;
const easeInOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

// ------------------------------------------------------------------ el bateador
type P = [number, number];
interface Rig {
  head: P;
  hips: P;
  rKnee: P;
  rAnkle: P;
  fKnee: P;
  fAnkle: P;
  rShoulder: P;
  rElbow: P;
  fShoulder: P;
  fElbow: P;
  hands: P;
  batEnd: P;
}
const KEYS: (keyof Rig)[] = ['head', 'hips', 'rKnee', 'rAnkle', 'fKnee', 'fAnkle', 'rShoulder', 'rElbow', 'fShoulder', 'fElbow', 'hands', 'batEnd'];

// Postura de bateo (de lado, mirando al pitcher a la derecha).
const STANCE: Rig = {
  head: [110, 40], hips: [94, 176], rKnee: [72, 246], rAnkle: [70, 318], fKnee: [140, 244], fAnkle: [150, 318],
  rShoulder: [90, 82], rElbow: [62, 86], fShoulder: [118, 84], fElbow: [112, 110], hands: [84, 60], batEnd: [36, -30],
};
// Carga: levanta un poco la pierna de adelante y lleva las manos atrás.
const LOAD: Rig = {
  head: [106, 42], hips: [90, 176], rKnee: [68, 248], rAnkle: [70, 318], fKnee: [128, 232], fAnkle: [140, 300],
  rShoulder: [86, 84], rElbow: [56, 84], fShoulder: [114, 86], fElbow: [104, 110], hands: [76, 58], batEnd: [22, -26],
};
// Contacto: cadera abierta, brazos extendidos, bate nivelado.
const SWING: Rig = {
  head: [114, 46], hips: [100, 178], rKnee: [90, 250], rAnkle: [72, 318], fKnee: [144, 246], fAnkle: [156, 318],
  rShoulder: [98, 88], rElbow: [126, 120], fShoulder: [124, 90], fElbow: [150, 110], hands: [164, 118], batEnd: [262, 108],
};
// Final del swing: el bate da la vuelta por encima del hombro.
const FOLLOW: Rig = {
  head: [116, 44], hips: [102, 178], rKnee: [96, 252], rAnkle: [76, 316], fKnee: [146, 246], fAnkle: [156, 318],
  rShoulder: [104, 86], rElbow: [132, 96], fShoulder: [126, 88], fElbow: [146, 76], hands: [128, 56], batEnd: [40, 20],
};

const lerpRig = (a: Rig, b: Rig, k: number): Rig => {
  const out = {} as Rig;
  for (const key of KEYS) out[key] = [mix(a[key][0], b[key][0], k), mix(a[key][1], b[key][1], k)];
  return out;
};

function rigAt(t: number): Rig {
  if (t < 1.15) return lerpRig(STANCE, LOAD, easeInOut(span(t, 0.75, 1.15)) * 0.25 + 0.05 * Math.sin(t * 6));
  if (t < 1.5) return lerpRig(STANCE, LOAD, easeInOut(span(t, 1.15, 1.5)));
  if (t < HIT) return lerpRig(LOAD, SWING, easeIn(span(t, 1.5, HIT)));
  return lerpRig(SWING, FOLLOW, easeOut(span(t, HIT, HIT + 0.35)));
}

/** Segmento que se afina (muslo, brazo…) con articulaciones redondas. */
function seg(a: P, b: P, w1: number, w2: number) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2;
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const r1 = w1 / 2;
  const r2 = w2 / 2;
  const circ = (x: number, y: number, r: number) => `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  return `M${a[0] + c * r1} ${a[1] + s * r1} L${b[0] + c * r2} ${b[1] + s * r2} L${b[0] - c * r2} ${b[1] - s * r2} L${a[0] - c * r1} ${a[1] - s * r1} Z ${circ(a[0], a[1], r1)} ${circ(b[0], b[1], r2)}`;
}

function Body({ r, fill, grow = 0 }: { r: Rig; fill: string; grow?: number }) {
  const S = (a: P, b: P, w1: number, w2: number) => <Path d={seg(a, b, w1 + grow, w2 + grow)} fill={fill} />;
  const [hx, hy] = r.head;
  const sh: P = [(r.rShoulder[0] + r.fShoulder[0]) / 2, (r.rShoulder[1] + r.fShoulder[1]) / 2 + 6];
  const waist: P = [r.hips[0] + 2, r.hips[1] - 34];
  const foot = (a: P) => <Path d={`M${a[0] - 13} ${a[1] + 16} Q${a[0] - 13} ${a[1]} ${a[0]} ${a[1]} L${a[0] + 22} ${a[1] + 10} Q${a[0] + 26} ${a[1] + 16} ${a[0] + 20} ${a[1] + 17} Z`} fill={fill} stroke={fill} strokeWidth={grow} />;
  return (
    <G>
      {S(r.hips, r.rKnee, 40, 24)}
      {S(r.rKnee, r.rAnkle, 24, 15)}
      {S(r.hips, r.fKnee, 40, 24)}
      {S(r.fKnee, r.fAnkle, 24, 15)}
      {foot(r.rAnkle)}
      {foot(r.fAnkle)}
      {S(sh, waist, 50, 36)}
      {S(waist, r.hips, 36, 42)}
      {S([hx - 4, hy + 14], [sh[0], sh[1] - 2], 15, 20)}
      <Circle cx={hx} cy={hy} r={19 + grow / 2} fill={fill} />
      <Path
        d={`M${hx - 22} ${hy + 4} Q${hx - 24} ${hy - 26} ${hx + 2} ${hy - 26} Q${hx + 24} ${hy - 26} ${hx + 22} ${hy - 2} L${hx + 38} ${hy + 1} Q${hx + 38} ${hy + 6} ${hx + 22} ${hy + 6} L${hx - 10} ${hy + 6} L${hx - 14} ${hy + 20} L${hx - 22} ${hy + 14} Z`}
        fill={fill}
        stroke={fill}
        strokeWidth={grow}
      />
      {S(r.rShoulder, r.rElbow, 17, 13)}
      {S(r.rElbow, r.hands, 13, 11)}
      {S(r.fShoulder, r.fElbow, 17, 13)}
      {S(r.fElbow, r.hands, 13, 11)}
      <Circle cx={r.hands[0]} cy={r.hands[1]} r={8 + grow / 2} fill={fill} />
      {S(r.hands, r.batEnd, 5, 11)}
    </G>
  );
}

/** Silueta a contraluz: los reflectores de atrás le encienden el borde. */
function Batter({ r, x, y }: { r: Rig; x: number; y: number }) {
  return (
    <G transform={`translate(${x} ${y})`}>
      <G opacity={0.16} transform="translate(-1 -2)">
        <Body r={r} fill={RIM} grow={7} />
      </G>
      <G opacity={0.9} transform="translate(-1.8 -2.4)">
        <Body r={r} fill={RIM} grow={1} />
      </G>
      <Body r={r} fill="#04060C" grow={2} />
    </G>
  );
}

/** Pitcher a lo lejos, en el montículo: brazo arriba y lanza. */
function Pitcher({ t }: { t: number }) {
  const k = span(t, 0.55, 0.95);
  const arm = k < 0.6 ? mix(-60, -150, k / 0.6) : mix(-150, 40, (k - 0.6) / 0.4);
  const a = (arm * Math.PI) / 180;
  return (
    <G transform="translate(322 556) scale(0.34)">
      <Circle cx={20} cy={16} r={15} fill="#05070D" />
      <Path d="M6 32 L34 32 L38 108 L2 108 Z" fill="#05070D" />
      <Path d={`M8 106 L${-4 + k * 6} 196 M32 106 L${46 - k * 10} 196`} stroke="#05070D" strokeWidth={15} strokeLinecap="round" />
      <Path d={`M30 40 L${30 + Math.cos(a) * 50} ${40 + Math.sin(a) * 50}`} stroke="#05070D" strokeWidth={12} strokeLinecap="round" />
      <Path d="M10 40 L-14 76" stroke="#05070D" strokeWidth={12} strokeLinecap="round" />
    </G>
  );
}

function Lights({ y }: { y: number }) {
  return (
    <G>
      {[70, 320].map((x) => (
        <G key={x}>
          <Rect x={x - 2} y={y} width={4} height={330} fill="#0B1222" />
          <Circle cx={x} cy={y - 7} r={95} fill="url(#inLight)" />
          <Rect x={x - 26} y={y - 18} width={52} height={22} rx={3} fill="#FFF7D6" />
        </G>
      ))}
      <Path d={`M0 ${y + 300} Q195 ${y + 250} 390 ${y + 300} L390 ${y + 340} L0 ${y + 340} Z`} fill="#070B16" />
      {Array.from({ length: 60 }, (_, i) => (
        <Circle key={i} cx={(i * 6.6) % 390} cy={y + 292 + ((i * 7) % 22)} r={2.4} fill="#111827" />
      ))}
    </G>
  );
}

const STARS = Array.from({ length: 70 }, (_, i) => ({ x: (i * 97) % W, y: (i * 53) % 1400, r: i % 4 === 0 ? 1.4 : 0.8 }));

/** La bola con sus costuras; `spin` la gira (las costuras se desplazan). */
function Ball({ x, y, r, spin }: { x: number; y: number; r: number; spin: number }) {
  const off = Math.sin(spin) * r * 0.25;
  return (
    <G transform={`translate(${x} ${y})`}>
      <Circle r={r} fill="#F5F1EA" />
      <Path d={`M${-r * 0.58 + off} ${-r * 0.78} Q${-r * 0.25 + off} 0 ${-r * 0.58 + off} ${r * 0.78} M${r * 0.58 + off} ${-r * 0.78} Q${r * 0.25 + off} 0 ${r * 0.58 + off} ${r * 0.78}`} stroke={C.red} strokeWidth={Math.max(1, r * 0.07)} strokeDasharray={`${r * 0.13} ${r * 0.1}`} fill="none" />
    </G>
  );
}

/** El logo del juego (el mismo de la pantalla de idioma). */
function Logo({ x, y, size }: { x: number; y: number; size: number }) {
  const s = size / 220;
  return (
    <G transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`}>
      <Rect width={220} height={220} rx={50} fill={C.red} />
      <Polygon points="110,34 130,84.5 184.2,87.9 142.3,122.5 155.8,175.1 110,146 64.2,175.1 77.7,122.5 35.8,87.9 90,84.5" fill={C.white} stroke={C.navy} strokeWidth={6} strokeLinejoin="round" />
      <Path d="M88 96 Q100 120 88 144" fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="5 4" strokeLinecap="round" />
      <Path d="M132 96 Q120 120 132 144" fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="5 4" strokeLinecap="round" />
    </G>
  );
}

// ------------------------------------------------------------------ escena completa en el segundo t
function Scene({ t, logoY }: { t: number; logoY: number }) {
  const fadeIn = span(t, 0, 0.6);
  // Escena 1–2: el bateador. La bola del pitcher viaja al home.
  const pitchK = span(t, 0.95, HIT);
  const contact: P = [70 + 236, 330 + 112];
  const ballIn: P = [mix(330, contact[0], easeIn(pitchK)), mix(570, contact[1], pitchK) - Math.sin(pitchK * Math.PI) * 18];
  const flash = t >= HIT ? 1 - span(t, HIT, HIT + 0.3) : 0;
  const shake = t >= HIT && t < HIT + 0.25 ? Math.sin(t * 90) * 4 * (1 - span(t, HIT, HIT + 0.25)) : 0;
  const outK = span(t, HIT, HIT + 0.55);
  const ballOut: P = [mix(contact[0], 420, easeOut(outK)), mix(contact[1], -40, easeOut(outK))];
  // Escena 3: la cámara sube siguiendo la bola (el estadio baja y sale por abajo).
  const up = easeInOut(span(t, 2.35, 3.3));
  const sky = span(t, 2.35, 2.75);
  const fly = span(t, 2.6, 5.0);
  const ballR = mix(10, 120, easeIn(fly));
  const ballY = mix(560, 400, easeOut(span(t, 2.6, 3.6)));
  // Escena 4: la bola gira hacia la cámara y es Pelotín.
  const turn = span(t, 4.75, 5.25);
  const squeeze = turn < 0.5 ? 1 - turn * 2 : (turn - 0.5) * 2;
  const isFace = turn >= 0.5;
  // Escena 5: Pelotín se encoge y sube al lugar del logo; el fondo pasa a azul.
  const toLogo = easeInOut(span(t, 5.9, 6.8));
  const navy = span(t, 6.0, 6.8);
  const faceSize = mix(300, 104, toLogo);
  const faceY = mix(400, logoY, toLogo);
  const logoK = span(t, 6.55, 6.95);
  const bounce = t > 5.25 && t < 5.9 ? Math.sin(span(t, 5.25, 5.9) * Math.PI) * 0.06 : 0;

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="inSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#01030A" />
          <Stop offset="0.6" stopColor="#0A1630" />
          <Stop offset="1" stopColor="#02040A" />
        </LinearGradient>
        <RadialGradient id="inLight" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFF7D6" stopOpacity={0.95} />
          <Stop offset="0.25" stopColor="#FFE9B0" stopOpacity={0.45} />
          <Stop offset="1" stopColor="#FFE9B0" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="inFlash" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#02040A" />
      <Rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#inSky)" />
      {/* Estrellas (se ven más al subir la cámara) */}
      <G opacity={0.25 + sky * 0.6} transform={`translate(0 ${-500 + up * 500})`}>
        {STARS.map((s, i) => (
          <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFFFFF" />
        ))}
      </G>
      {/* Estadio: baja cuando la cámara sigue a la bola */}
      <G transform={`translate(${shake} ${up * 900})`}>
        <Lights y={110} />
        <Rect x={-200} y={630} width={W + 400} height={500} fill="#0B1A0E" />
        <Ellipse cx={170} cy={668} rx={190} ry={34} fill="#2A1A10" opacity={0.9} />
        <Polygon points="196,660 222,660 228,668 209,676 190,668" fill="#9CA3AF" opacity={0.5} />
        <Pitcher t={t} />
        <Batter r={rigAt(t)} x={70} y={330} />
        {t > 0.95 && t < HIT ? <Circle cx={ballIn[0]} cy={ballIn[1]} r={mix(1.5, 5, pitchK)} fill="#F5F1EA" /> : null}
        {t >= HIT && t < HIT + 0.55 ? (
          <G>
            <Path d={`M${contact[0]} ${contact[1]} L${ballOut[0]} ${ballOut[1]}`} stroke="#FFFFFF" strokeWidth={3} opacity={0.45 * (1 - outK)} />
            <Circle cx={ballOut[0]} cy={ballOut[1]} r={5} fill="#FFFFFF" />
          </G>
        ) : null}
        {flash > 0 ? <Circle cx={contact[0]} cy={contact[1]} r={40 + 80 * (1 - flash)} fill="url(#inFlash)" opacity={flash} /> : null}
      </G>
      {/* La bola en el cielo, cada vez más cerca */}
      {t >= 2.6 && t < 5.25 && !isFace ? (
        <G>
          <Path d={`M${195 - 40} ${ballY + 420} Q${195 - 10} ${ballY + 200} 195 ${ballY}`} stroke="#FFFFFF" strokeWidth={ballR * 0.5} opacity={0.06} fill="none" strokeLinecap="round" />
          <G transform={`translate(195 ${ballY}) scale(${squeeze} 1) translate(-195 ${-ballY})`}>
            <Ball x={195} y={ballY} r={ballR} spin={t * 9} />
          </G>
        </G>
      ) : null}
      {/* Fondo azul de la pantalla de idioma */}
      <Rect x={-200} y={-200} width={W + 400} height={H + 400} fill={C.navy} opacity={navy} />
      {/* Pelotín */}
      {isFace && logoK < 1 ? (
        <G opacity={1 - logoK} transform={`translate(195 ${faceY}) scale(${(faceSize / 100) * (t < 5.25 ? squeeze : 1) * (1 + bounce)} ${(faceSize / 100) * (1 + bounce)}) translate(-50 -56)`}>
          <MascotFace mood="cheer" />
        </G>
      ) : null}
      {logoK > 0 ? (
        <G opacity={logoK}>
          <Logo x={195} y={logoY} size={96} />
        </G>
      ) : null}
      {/* Entrada desde negro */}
      <Rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#000" opacity={1 - fadeIn} />
    </Svg>
  );
}

export default function Intro() {
  const { t: tr, finishIntro } = useStore();
  const insets = useSafeAreaInsets();
  const [time, setTime] = useState(0);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    stopGameAmbience();
    finishIntro();
    router.replace('/idioma');
  };

  useEffect(() => {
    startGameAmbience();
    const start = Date.now();
    const cues: [number, () => void][] = [
      [HIT, () => playSfx('bat')],
      [HIT + 0.12, () => playSfx('crowd')],
      [5.0, () => playSfx('crowd')],
    ];
    let next = 0;
    let raf = 0;
    const tick = () => {
      const s = (Date.now() - start) / 1000;
      while (next < cues.length && s >= cues[next][0]) cues[next++][1]();
      setTime(s);
      if (s >= END) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      stopGameAmbience();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // El logo termina donde lo muestra la pantalla de idioma (arriba, centrado).
  const logoY = 40 + 48;
  return (
    <View testID="intro" style={{ flex: 1, backgroundColor: '#000' }}>
      <Scene t={time} logoY={logoY} />
      <Pressable
        testID="intro-skip"
        accessibilityRole="button"
        accessibilityLabel={tr('intro.skip')}
        onPress={finish}
        hitSlop={12}
        style={{ position: 'absolute', top: insets.top + 12, right: 16, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 8, opacity: time > 6.2 ? 0 : 1 }}
      >
        <Text style={{ color: C.white, fontFamily: F.bodyBold, fontSize: 15 }}>{tr('intro.skip')} ›</Text>
      </Pressable>
    </View>
  );
}
