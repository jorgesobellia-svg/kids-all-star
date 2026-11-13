import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, useWindowDimensions, View, type GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, G, Line, LinearGradient, Pattern, Polygon, Polyline, Rect, Stop } from 'react-native-svg';
import { Ball, Board, CallText, Fans, GameHeader, GameIntro, GameOver, rand, RIVAL, useAmbience, useTimers } from '@/components/GameKit';
import PelotinBody, { BODY_H, BODY_W } from '@/components/PelotinBody';
import { FLY } from '@/content/minigames';
import { playSfx } from '@/services/sfx';
import { speak, stopSpeaking } from '@/services/speech';
import { avatarOf, type GameReward, useStore } from '@/state/store';
import { C } from '@/theme';

// ¡Atrapa la elevada! (minijuego del nivel 16). La cámara está en el jardín central, un poco alta,
// mirando hacia el home: el cuadro al fondo, las rayas de foul abriéndose hacia los lados y Pelotín
// de espaldas en el jardín. Todo se dibuja en perspectiva de verdad (medidas en pies, home en (0,0),
// X positivo = lado de primera, que desde aquí queda a la izquierda). Batean un elevado: la sombra en el
// pasto marca dónde va a caer; el niño toca el campo y Pelotín corre hasta ahí. Tres que se caen y se acaba.

const VB = { w: 360, h: 560 };
const CAM = { y: 320, h: 70, hy: 96, f: 360 };

/** De un punto del campo (pies) a la pantalla (unidades del dibujo). k = qué tan grande se ve. */
function P(X: number, Y: number, Z = 0) {
  const d = Math.max(4, CAM.y - Y);
  return { x: VB.w / 2 - (CAM.f * X) / d, y: CAM.hy + (CAM.f * (CAM.h - Z)) / d, k: 300 / d };
}
/** De la pantalla al pasto (lo contrario de P, con Z = 0). */
function toField(x: number, y: number) {
  const d = (CAM.f * CAM.h) / Math.max(1, y - CAM.hy);
  return { X: ((VB.w / 2 - x) * d) / CAM.f, Y: CAM.y - d };
}
const pp = (a: { x: number; y: number }[]) => a.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ');

/** Parte del jardín donde se puede correr y donde caen las bolas (en pies). */
const RUN = { yMin: 180, yMax: 263 };
const START = { X: 0, Y: 244 };
const S2 = 63.64;
const MOUND = 60.5;
/** Alto de un jugador (en unidades del dibujo) según qué tan cerca está. */
const tall = (k: number) => Math.min(130, 27 * k);

// Gradas en arco detrás del home.
const BACK = Array.from({ length: 31 }, (_, i) => ((-75 + i * 5) * Math.PI) / 180);
const STAND_TOP = BACK.map((a) => P(208 * Math.sin(a), -65 * Math.cos(a) - 40, 55));
const STAND_BOT = BACK.map((a) => P(208 * Math.sin(a), -65 * Math.cos(a) - 40, 0));
const FANS_BOX = { x: 0, y: Math.min(...STAND_TOP.map((q) => q.y)) + 3, w: VB.w, h: Math.max(...STAND_BOT.map((q) => q.y)) - Math.min(...STAND_TOP.map((q) => q.y)) - 8 };

/** Compañeros de equipo (pies): 1ª, 2ª, campocorto, 3ª, pitcher, catcher. */
const TEAM = [
  { X: 72, Y: 92 },
  { X: 32, Y: 138 },
  { X: -32, Y: 138 },
  { X: -72, Y: 92 },
  { X: 0, Y: MOUND },
  { X: 0, Y: -6 },
].sort((a, b) => a.Y - b.Y);

type Phase = 'intro' | 'wait' | 'fly' | 'call' | 'over';

function speckles(n: number, seed: number, w: number, h: number) {
  let x = seed;
  const r = () => (x = (x * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: n }, () => [r() * w, r() * h, r()] as const);
}
const GRASS_DOTS = speckles(40, 5, 18, 18);

const OutfieldField = React.memo(function OutfieldField() {
  const ring = (cx: number, cy: number, r: number, n = 36) => Array.from({ length: n }, (_, i) => P(cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)));
  // La tierra del cuadro termina en las rayas de foul: el arco (radio 95 desde el montículo) las corta en (±90.2, 90.2).
  const TA = 71.7;
  const arc = Array.from({ length: 37 }, (_, i) => TA - (i * 2 * TA) / 36).map((t) => P(95 * Math.sin((t * Math.PI) / 180), MOUND + 95 * Math.cos((t * Math.PI) / 180)));
  const dirt = [P(0, 0), P(90.2, 90.2), ...arc, P(-90.2, 90.2)];
  const gi = 12;
  const grassIn = [P(0, gi * 1.4), P(S2 - gi, S2), P(0, 2 * S2 - gi * 1.4), P(-S2 + gi, S2)];
  const stripes = Array.from({ length: 14 }, (_, i) => {
    const y0 = 20 + i * 20;
    return [P(-400, y0), P(400, y0), P(400, y0 + 10), P(-400, y0 + 10)];
  });
  const base = (bx: number, by: number) => {
    const r = 1.6;
    return [P(bx, by - r), P(bx + r, by), P(bx, by + r), P(bx - r, by)];
  };
  return (
    <G>
      <Defs>
        <LinearGradient id="osky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#5BB4EE" />
          <Stop offset="1" stopColor="#BFE6FF" />
        </LinearGradient>
        <Pattern id="ogtex" width={18} height={18} patternUnits="userSpaceOnUse">
          {GRASS_DOTS.map(([x, y, k], i) => (
            <Line key={i} x1={x} y1={y} x2={x + (k - 0.5) * 2} y2={y - 2 - k * 2} stroke={k > 0.5 ? '#2F6B2A' : '#6BBF5F'} strokeWidth={0.8} opacity={0.5} />
          ))}
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width={VB.w} height={VB.h} fill="url(#osky)" />
      <Circle cx={300} cy={40} r={16} fill="#FDE68A" />
      {/* gradas detrás del home (el público va aparte, para que brinque) */}
      <Polygon points={pp([...STAND_TOP, ...STAND_BOT.slice().reverse()])} fill="#1E3A5F" />
      <Polygon points={pp([...STAND_BOT, { x: -10, y: VB.h }, { x: VB.w + 10, y: VB.h }])} fill="#3E9A42" />
      <Polyline points={pp(STAND_BOT)} fill="none" stroke="#0F5132" strokeWidth={3} />
      {stripes.map((q, i) => (
        <Polygon key={i} points={pp(q)} fill="#4FA347" opacity={0.75} />
      ))}
      <Polygon points={pp([...STAND_BOT, { x: -10, y: VB.h }, { x: VB.w + 10, y: VB.h }])} fill="url(#ogtex)" />
      <Polygon points={pp(dirt)} fill="#C98B4F" />
      <Polygon points={pp(grassIn)} fill="#48A64C" />
      <Polygon points={pp(ring(0, 0, 13))} fill="#C98B4F" />
      <Polygon points={pp(ring(0, MOUND, 9))} fill="#C98B4F" stroke="#A86F3C" strokeWidth={1} />
      {[1, -1].map((sx) => {
        const a = P(0, 0);
        const b = P(sx * 300, 300);
        return <Line key={sx} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#FFFFFF" strokeWidth={2.2} />;
      })}
      {[base(S2, S2), base(0, 2 * S2), base(-S2, S2)].map((q, i) => (
        <Polygon key={i} points={pp(q)} fill="#FFFFFF" />
      ))}
      <Polygon points={pp([P(-1.4, 0.6), P(1.4, 0.6), P(1.4, -0.4), P(0, -1.6), P(-1.4, -0.4)])} fill="#FFFFFF" />
    </G>
  );
});

/** Jugador parado en un punto del campo, con su sombra. */
function Player({ X, Y, avatar, s, view = 'front', run = false, frame = 0, mood = 'happy' }: { X: number; Y: number; avatar: typeof RIVAL; s: number; view?: 'front' | 'back'; run?: boolean; frame?: 0 | 1; mood?: 'happy' | 'cheer' }) {
  const q = P(X, Y);
  const h = tall(q.k);
  const w = (h * BODY_W) / BODY_H;
  return (
    <>
      <View pointerEvents="none" style={{ position: 'absolute', left: (q.x - h * 0.22) * s, top: (q.y - h * 0.035) * s, width: h * 0.44 * s, height: h * 0.07 * s, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.18)' }} />
      <View pointerEvents="none" style={{ position: 'absolute', left: (q.x - w / 2) * s, top: (q.y - h) * s }}>
        <PelotinBody avatar={avatar} height={h * s} view={view} pose={run ? 'run' : 'stand'} frame={frame} face={{ mood }} />
      </View>
    </>
  );
}

export default function FlyGame() {
  const { t, p, locale, finishGame } = useStore();
  const avatar = avatarOf(p);
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const W = Math.min(winW, 520);
  const s = W / VB.w;
  const H = VB.h * s;
  const [areaH, setAreaH] = useState(0);

  const [phase, setPhase] = useState<Phase>('intro');
  const [stats, setStats] = useState({ catches: 0, drops: 0 });
  const [call, setCall] = useState<'caught' | 'dropped' | null>(null);
  const [cheer, setCheer] = useState(false);
  const [hint, setHint] = useState(true);
  const [reward, setReward] = useState<GameReward | null>(null);
  // Lo que se mueve cada cuadro (Pelotín y la bola) vive en un ref y se dibuja con un "tick".
  const [view, setView] = useState({ me: START, running: false, u: 0, L: { X: -30, Y: 210 }, flying: false, frame: 0 as 0 | 1 });
  const sim = useRef({ me: { ...START }, target: null as null | { X: number; Y: number }, flying: false, t0: 0, T: 2000, L: { X: -30, Y: 210 } });
  const origin = useRef({ x: 0, y: 0 });
  const fieldRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const game = useRef({ catches: 0, drops: 0 });
  const onLand = useRef<() => void>(() => {});
  const tm = useTimers();
  // El público suena en toda la sesión del minijuego (inicio, juego y pantalla final).
  useAmbience(true);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    if (phase !== 'intro') return;
    const id = setTimeout(() => speak(`${t('game.flyIntro')} ${t('game.flyRule')}`, locale), 500);
    return () => clearTimeout(id);
  }, [phase, t, locale]);

  // Bucle de animación: mueve a Pelotín hacia donde tocó el niño y lleva la bola por el aire.
  useEffect(() => {
    if (phase === 'intro' || phase === 'over') return;
    let raf = 0;
    let last = Date.now();
    const step = () => {
      const now = Date.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const S = sim.current;
      let running = false;
      if (S.target) {
        const dx = S.target.X - S.me.X;
        const dy = S.target.Y - S.me.Y;
        const dist = Math.hypot(dx, dy);
        const stepFt = FLY.runSpeed * dt;
        if (dist <= stepFt) {
          S.me = { ...S.target };
          S.target = null;
        } else {
          S.me = { X: S.me.X + (dx / dist) * stepFt, Y: S.me.Y + (dy / dist) * stepFt };
          running = true;
        }
      }
      const u = S.flying ? Math.min(1, (now - S.t0) / S.T) : 0;
      if (S.flying && u >= 1) {
        S.flying = false;
        onLand.current();
      }
      setView({ me: S.me, running, u, L: S.L, flying: S.flying, frame: (Math.floor(now / 130) % 2) as 0 | 1 });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  function launch() {
    const S = sim.current;
    const { catches } = game.current;
    // La próxima cae más lejos de donde está Pelotín, y el elevado dura menos en el aire.
    const dist = Math.min(78, 26 + catches * 5) * rand(0.85, 1.1);
    let L = { X: S.me.X + 20, Y: S.me.Y - 20 };
    for (let i = 0; i < 30; i++) {
      const a = rand(0, Math.PI * 2);
      const q = { X: S.me.X + Math.cos(a) * dist, Y: S.me.Y + Math.sin(a) * dist };
      const scr = P(q.X, q.Y);
      if (q.Y > RUN.yMin + 6 && q.Y < RUN.yMax - 4 && Math.abs(q.X) < q.Y * 0.9 && scr.x > 20 && scr.x < VB.w - 20) {
        L = q;
        break;
      }
    }
    S.L = L;
    S.T = Math.max(FLY.minMs, FLY.startMs - catches * FLY.stepMs);
    S.t0 = Date.now();
    S.flying = true;
    setCall(null);
    setPhase('fly');
    playSfx('bat');
  }

  function landed() {
    const S = sim.current;
    const caught = Math.hypot(S.me.X - S.L.X, S.me.Y - S.L.Y) <= FLY.reach;
    S.target = null;
    const g = game.current;
    const nx = caught ? { ...g, catches: g.catches + 1 } : { ...g, drops: g.drops + 1 };
    game.current = nx;
    setStats(nx);
    setCall(caught ? 'caught' : 'dropped');
    setPhase('call');
    if (caught) {
      playSfx('out');
      tm.later(() => playSfx('crowd'), 200);
      setCheer(true);
      tm.later(() => setCheer(false), 1500);
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    tm.later(() => {
      if (nx.drops >= FLY.lives) {
        setReward(finishGame('elevada', nx.catches, nx.catches * FLY.coinsCatch));
        setPhase('over');
      } else launch();
    }, 1700);
  }
  useEffect(() => {
    onLand.current = landed;
  });

  function runTo(e: GestureResponderEvent) {
    if (phase !== 'fly' && phase !== 'wait') return;
    // Se usa la posición en la pantalla menos dónde empieza el campo (locationX no es igual en todos los teléfonos).
    const x = (e.nativeEvent.pageX - origin.current.x) / s;
    const y = (e.nativeEvent.pageY - origin.current.y) / s;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    setHint(false);
    const q = toField(x, Math.max(y, CAM.hy + 20));
    const Y = Math.max(RUN.yMin, Math.min(RUN.yMax, q.Y));
    const X = Math.max(-Y * 0.95, Math.min(Y * 0.95, q.X));
    sim.current.target = { X, Y };
  }

  function restart() {
    tm.clear();
    game.current = { catches: 0, drops: 0 };
    sim.current = { me: { ...START }, target: null, flying: false, t0: 0, T: 2000, L: { X: -30, Y: 210 } };
    setStats(game.current);
    setReward(null);
    setCall(null);
    setCheer(false);
    setHint(true);
    stopSpeaking();
    setPhase('wait');
    tm.later(launch, 900);
  }

  function exit() {
    tm.clear();
    stopSpeaking();
    router.back();
  }

  const best = p.games?.elevada?.best ?? 0;
  if (phase === 'intro') {
    return (
      <GameIntro
        label={t('game.label')}
        title={t('game.flyTitle')}
        intro={t('game.flyIntro')}
        rule={t('game.flyRule')}
        art={<PelotinBody avatar={avatar} height={190} face={{ mood: 'cheer' }} />}
        best={best ? t('game.bestCatches', { n: best }) : undefined}
        play={t('game.play')}
        back={t('common.back')}
        onStart={restart}
        onBack={exit}
      />
    );
  }
  if (phase === 'over') {
    return (
      <GameOver
        title={t('game.over')}
        rows={[
          [t('game.catches'), stats.catches],
          [t('game.drops'), stats.drops],
        ]}
        reward={reward}
        newBest={t('game.newBest')}
        capText={t('game.capReached')}
        coinsText={t('result.coinsWon', { n: reward?.coins ?? 0 })}
        bestText={t('game.bestCatches', { n: Math.max(stats.catches, best) })}
        again={t('game.again')}
        toPath={t('exam.toPath')}
        onAgain={restart}
        onExit={exit}
      />
    );
  }

  // La bola: sale del home, sube alto y baja justo en la sombra.
  const { u, L } = view;
  const bq = P(L.X * u, L.Y * u, 3 + 4 * 95 * u * (1 - u));
  const br = Math.max(2.5, Math.min(8, 1.3 * bq.k));
  const lq = P(L.X, L.Y);
  const showBall = view.flying || call === 'dropped';
  const ballAt = view.flying ? bq : lq;
  const frame: 0 | 1 = view.running ? view.frame : 0;

  return (
    <View style={{ flex: 1, backgroundColor: C.navy, paddingTop: insets.top + 6, paddingBottom: insets.bottom + 16 }}>
      <GameHeader title={t('game.flyTitle')} back={t('common.back')} onBack={exit} right={<Board rows={[{ k: '✗', n: stats.drops, of: FLY.lives, color: C.red }]} label="OUT" n={stats.catches} />} />
      <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#5BB4EE' }} onLayout={(e) => setAreaH(e.nativeEvent.layout.height)}>
        {areaH ? (
          <Pressable
            ref={fieldRef}
            onLayout={() => fieldRef.current?.measureInWindow((x, y) => (origin.current = { x, y }))}
            testID="fly-field"
            onPressIn={runTo}
            onPress={runTo}
            unstable_pressDelay={0}
            style={{ position: 'absolute', left: (winW - W) / 2, top: areaH - H, width: W, height: H }}
            accessible={false}
          >
            <Svg width={W} height={H} viewBox={`0 0 ${VB.w} ${VB.h}`} style={{ position: 'absolute' }} pointerEvents="none">
              <OutfieldField />
            </Svg>
            <Fans box={FANS_BOX} s={s} cheering={cheer} />
            {/* compañeros: el bateador rival en el home y tu equipo en sus posiciones */}
            <Player X={-4} Y={2} avatar={RIVAL} s={s} />
            {TEAM.map((q, i) => (
              <Player key={i} X={q.X} Y={q.Y} avatar={avatar} s={s} />
            ))}
            {/* sombra donde va a caer la bola: más oscura justo antes de caer */}
            {view.flying ? (
              <View testID="fly-shadow" pointerEvents="none" style={{ position: 'absolute', left: (lq.x - lq.k * 4.5) * s, top: (lq.y - lq.k * 1.5) * s, width: lq.k * 9 * s, height: lq.k * 3 * s, borderRadius: 999, backgroundColor: `rgba(0,0,0,${(0.15 + 0.3 * u).toFixed(2)})` }} />
            ) : null}
            <Player X={view.me.X} Y={view.me.Y} avatar={avatar} s={s} view={call === 'caught' ? 'front' : 'back'} run={view.running} frame={frame} mood="cheer" />
            {showBall ? (
              <View testID="fly-ball" pointerEvents="none" style={{ position: 'absolute', left: (ballAt.x - br) * s, top: (ballAt.y - br * (view.flying ? 1 : 2)) * s }}>
                <Ball size={br * 2 * s} />
              </View>
            ) : null}
            {hint && phase !== 'call' ? <CallText text="" tip={t('game.tapToRun')} top={60 * s} /> : null}
            {call ? <CallText text={t(`game.${call}`)} big={call === 'caught'} top={30 * s} /> : null}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
