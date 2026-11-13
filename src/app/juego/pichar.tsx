import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line } from 'react-native-svg';
import FieldScene from '@/components/FieldScene';
import { ActionBtn, Ball, Board, CallText, GameHeader, GameIntro, GameOver, rand, RIVAL, useAmbience, useTimers } from '@/components/GameKit';
import { HF, stageOf } from '@/components/HighField';
import PelotinBody from '@/components/PelotinBody';
import type { BatPose } from '@/components/PelotinBat';
import { tapFeedback } from '@/components/ui';
import { PITCH } from '@/content/minigames';
import { playSfx } from '@/services/sfx';
import { speak, stopSpeaking } from '@/services/speech';
import { avatarOf, type GameReward, useStore } from '@/state/store';
import { C } from '@/theme';

// ¡A pichar! (minijuego del nivel 8). Misma cámara que el bateo, pero Pelotín está en el montículo
// y batea el rival. La mira amarilla se mueve sola sobre la zona; el niño toca PICHA cuando está adentro.
// Por el centro es fácil de batear; en las orillas, difícil. Conteo de verdad; se acaba con 3 outs.

const ZONE = HF.zone;
const REL = HF.release;
const BALL_R = 5.5;
/** Cámara más cerca del home, para ver bien la zona y la mira. */
const CAM = { x: 90, y: 262, w: 180 };
const ZC = { x: (ZONE.l + ZONE.r) / 2, y: (ZONE.t + ZONE.b) / 2 };
const HALF = { x: (ZONE.r - ZONE.l) / 2, y: (ZONE.b - ZONE.t) / 2 };
/** Hasta dónde llega la mira: de lado a lado se sale un poco de la zona; de arriba abajo casi no. */
const AIM = { x: HALF.x + 12, y: HALF.y * 0.85 };
const N = 24;
const SIN = Array.from({ length: N + 1 }, (_, i) => Math.sin((2 * Math.PI * i) / N));
const STEPS = Array.from({ length: N + 1 }, (_, i) => i / N);
/** La mira se mueve en un ocho (curva de Lissajous): en x da una vuelta y en y otra, a distinto ritmo. */
const Y_RATIO = 1.37;

type Phase = 'intro' | 'aim' | 'throw' | 'call' | 'over';
type Call = 'strike' | 'swingMiss' | 'ball' | 'foul' | 'groundOut' | 'flyOut' | 'hitAllowed' | 'walk' | 'k';
type Tip = 'middle' | 'edge' | 'missed' | null;
const ZERO = { count: { b: 0, s: 0, o: 0 }, stats: { ks: 0, hits: 0, walks: 0 } };

export default function PitchGame() {
  const { t, p, locale, finishGame } = useStore();
  const avatar = avatarOf(p);
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const W = Math.min(winW, 520);
  const [areaH, setAreaH] = useState(0);
  const st = stageOf(W, CAM);

  const [phase, setPhase] = useState<Phase>('intro');
  const [count, setCount] = useState(ZERO.count);
  const [stats, setStats] = useState(ZERO.stats);
  const [call, setCall] = useState<{ c: Call; tip: Tip } | null>(null);
  const [pose, setPose] = useState<BatPose>('box');
  const [throwing, setThrowing] = useState(false);
  const [cheer, setCheer] = useState(false);
  const [reward, setReward] = useState<GameReward | null>(null);
  const [ax] = useState(() => new Animated.Value(0));
  const [ay] = useState(() => new Animated.Value(0));
  const [prog] = useState(() => new Animated.Value(0));
  const [fly] = useState(() => new Animated.Value(0));
  const [target, setTarget] = useState({ x: ZC.x, y: ZC.y });
  const [flyTo, setFlyTo] = useState<{ x: number; y: number } | null>(null);
  const aimStart = useRef(0);
  const sweep = useRef(PITCH.sweepMs);
  const game = useRef(ZERO);
  const loops = useRef<Animated.CompositeAnimation[]>([]);
  const tm = useTimers();
  // El público suena en toda la sesión del minijuego (inicio, juego y pantalla final).
  useAmbience(true);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    if (phase !== 'intro') return;
    const id = setTimeout(() => speak(`${t('game.pitchIntro')} ${t('game.pitchRule')}`, locale), 500);
    return () => clearTimeout(id);
  }, [phase, t, locale]);

  function stopAim() {
    loops.current.forEach((l) => l.stop());
    loops.current = [];
  }

  function startAim() {
    stopAim();
    const T = Math.max(PITCH.minSweepMs, PITCH.sweepMs - game.current.stats.ks * PITCH.stepMs);
    sweep.current = T;
    ax.setValue(0);
    ay.setValue(0);
    aimStart.current = Date.now();
    loops.current = [
      Animated.loop(Animated.timing(ax, { toValue: 1, duration: T, easing: Easing.linear, useNativeDriver: true })),
      Animated.loop(Animated.timing(ay, { toValue: 1, duration: T * Y_RATIO, easing: Easing.linear, useNativeDriver: true })),
    ];
    loops.current.forEach((l) => l.start());
    setFlyTo(null);
    setPose('box');
    setPhase('aim');
  }

  /** Dónde está la mira ahora (se calcula con el reloj, igual que la animación). */
  function aimNow() {
    const e = Date.now() - aimStart.current;
    const T = sweep.current;
    return { x: ZC.x + AIM.x * Math.sin((2 * Math.PI * e) / T), y: ZC.y + AIM.y * Math.sin((2 * Math.PI * e) / (T * Y_RATIO)) };
  }

  function throwBall() {
    if (phase !== 'aim' || loops.current.length === 0) return;
    tapFeedback();
    const a = aimNow();
    stopAim();
    setTarget(a);
    setThrowing(true);
    setPhase('throw');
    prog.setValue(0);
    Animated.timing(prog, { toValue: 1, duration: 650, easing: Easing.linear, useNativeDriver: true }).start();
    tm.later(() => {
      setThrowing(false);
      resolve(a);
    }, 650);
  }

  function resolve(a: { x: number; y: number }) {
    const dx = Math.abs(a.x - ZC.x) / HALF.x;
    const dy = Math.abs(a.y - ZC.y) / HALF.y;
    const inZone = a.x >= ZONE.l - 2 && a.x <= ZONE.r + 2 && a.y >= ZONE.t - 2 && a.y <= ZONE.b + 2;
    if (!inZone) return settle('ball', 'missed');
    const middle = Math.max(dx, dy) < PITCH.middle;
    const tip: Tip = middle ? 'middle' : 'edge';
    const swings = middle || rand(0, 1) < 0.55;
    if (!swings) return settle('strike', tip);
    setPose('boxMid');
    tm.later(() => setPose('boxSwing'), 70);
    tm.later(() => setPose('box'), 650);
    if (rand(0, 1) >= (middle ? PITCH.hitMiddle : PITCH.hitEdge)) return settle('swingMiss', tip);
    // Le pegó: foul, out o hit.
    playSfx('bat');
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const r = rand(0, 1);
    const c: Call = r < 0.35 ? 'foul' : r < 0.55 ? 'groundOut' : r < 0.72 ? 'flyOut' : 'hitAllowed';
    const dest =
      c === 'foul'
        ? { x: rand(0, 1) < 0.5 ? -30 : HF.w + 30, y: rand(380, 450) }
        : c === 'groundOut'
          ? { x: rand(120, 240), y: 262 }
          : c === 'flyOut'
            ? [
                { x: 84, y: 128 },
                { x: 180, y: 108 },
                { x: 276, y: 128 },
              ][Math.floor(rand(0, 1) * 3)]
            : { x: rand(0, 1) < 0.5 ? rand(30, 120) : rand(240, 330), y: rand(160, 230) };
    setFlyTo(dest);
    fly.setValue(0);
    Animated.timing(fly, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    settle(c, tip);
  }

  function settle(c: Call, tip: Tip) {
    const { count: k, stats: sx } = game.current;
    let { b, s, o } = k;
    let shown: Call = c;
    const nx = { ...sx };
    if (c === 'strike' || c === 'swingMiss') {
      s += 1;
      if (s >= 3) {
        shown = 'k';
        nx.ks += 1;
        o += 1;
        b = 0;
        s = 0;
        playSfx('out');
        // El público celebra cada ponche.
        setCheer(true);
        tm.later(() => setCheer(false), 1600);
      }
    } else if (c === 'foul') {
      if (s < 2) s += 1;
    } else if (c === 'ball') {
      b += 1;
      if (b >= 4) {
        shown = 'walk';
        nx.walks += 1;
        b = 0;
        s = 0;
      }
    } else if (c === 'groundOut' || c === 'flyOut') {
      o += 1;
      b = 0;
      s = 0;
      tm.later(() => playSfx('out'), 500);
    } else {
      nx.hits += 1;
      b = 0;
      s = 0;
    }
    game.current = { count: { b, s, o }, stats: nx };
    setCount({ b, s, o });
    setStats(nx);
    setCall({ c: shown, tip: shown === 'walk' || shown === 'k' ? null : tip });
    setPhase('call');
    tm.later(() => {
      setCall(null);
      if (o >= PITCH.outs) {
        setReward(finishGame('pichar', nx.ks, nx.ks * PITCH.coinsK));
        setPhase('over');
      } else startAim();
    }, 1600);
  }

  function restart() {
    tm.clear();
    game.current = ZERO;
    setCount(ZERO.count);
    setStats(ZERO.stats);
    setReward(null);
    setCall(null);
    setCheer(false);
    stopSpeaking();
    tm.later(startAim, 500);
    setPhase('call');
  }

  function exit() {
    tm.clear();
    stopAim();
    stopSpeaking();
    router.back();
  }

  const best = p.games?.pichar?.best ?? 0;
  if (phase === 'intro') {
    return (
      <GameIntro
        label={t('game.label')}
        title={t('game.pitchTitle')}
        intro={t('game.pitchIntro')}
        rule={t('game.pitchRule')}
        art={<PelotinBody avatar={avatar} height={190} face={{ mood: 'cheer' }} />}
        best={best ? t('game.bestK', { n: best }) : undefined}
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
          [t('game.ks'), stats.ks],
          [t('game.hitsAllowed'), stats.hits],
          [t('game.walksAllowed'), stats.walks],
        ]}
        reward={reward}
        newBest={t('game.newBest')}
        capText={t('game.capReached')}
        coinsText={t('result.coinsWon', { n: reward?.coins ?? 0 })}
        bestText={t('game.bestK', { n: Math.max(stats.ks, best) })}
        again={t('game.again')}
        toPath={t('exam.toPath')}
        onAgain={restart}
        onExit={exit}
      />
    );
  }

  const X = (v: number) => st.X(v - BALL_R);
  const Y = (v: number) => st.Y(v - BALL_R);
  const R = 9; // radio de la mira (unidades del dibujo)
  const mx = ax.interpolate({ inputRange: STEPS, outputRange: SIN.map((v) => st.X(ZC.x + AIM.x * v - R)) });
  const my = ay.interpolate({ inputRange: STEPS, outputRange: SIN.map((v) => st.Y(ZC.y + AIM.y * v - R)) });
  const bx = prog.interpolate({ inputRange: [0, 1], outputRange: [X(REL.x), X(target.x)] });
  const by = prog.interpolate({ inputRange: [0, 1], outputRange: [Y(REL.y), Y(target.y)] });
  const bs = prog.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.2] });
  const fx = flyTo ? fly.interpolate({ inputRange: [0, 1], outputRange: [X(target.x), X(flyTo.x)] }) : 0;
  const fy = flyTo ? fly.interpolate({ inputRange: [0, 0.5, 1], outputRange: [Y(target.y), Y((target.y + flyTo.y) / 2 - 100), Y(flyTo.y)] }) : 0;
  const fs = flyTo ? fly.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1.2, 1.4, 0.7] }) : 1;
  const good = !!call && (call.c === 'k' || call.c === 'strike' || call.c === 'swingMiss' || call.c === 'groundOut' || call.c === 'flyOut');

  return (
    <View style={{ flex: 1, backgroundColor: C.navy, paddingTop: insets.top + 6, paddingBottom: insets.bottom + 16 }}>
      <GameHeader
        title={t('game.pitchTitle')}
        back={t('common.back')}
        onBack={exit}
        right={
          <Board
            rows={[
              { k: 'B', n: count.b, of: 3, color: C.green },
              { k: 'S', n: count.s, of: 2, color: C.gold },
              { k: 'O', n: count.o, of: 2, color: C.red },
            ]}
            label="K"
            n={stats.ks}
          />
        }
      />
      <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#93C5FD' }} onLayout={(e) => setAreaH(e.nativeEvent.layout.height)}>
        {areaH ? (
          <View style={{ position: 'absolute', left: (winW - W) / 2, top: areaH - st.H, width: W, height: st.H }}>
            <FieldScene st={st} team={avatar} pitcher={avatar} pitcherUp={throwing} batter={RIVAL} batterPose={pose} batterMood={call ? (good ? 'think' : 'cheer') : 'happy'} cheering={cheer}>
              {phase === 'aim' ? (
                <Animated.View testID="pitch-aim" pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: mx }, { translateY: my }] }}>
                  <Svg width={2 * R * st.s} height={2 * R * st.s} viewBox={`0 0 ${2 * R} ${2 * R}`}>
                    <Circle cx={R} cy={R} r={R - 1.5} fill="none" stroke={C.gold} strokeWidth={2.2} />
                    <Line x1={R} y1={0} x2={R} y2={2 * R} stroke={C.gold} strokeWidth={1.6} />
                    <Line x1={0} y1={R} x2={2 * R} y2={R} stroke={C.gold} strokeWidth={1.6} />
                  </Svg>
                </Animated.View>
              ) : null}
              {phase === 'throw' || (phase === 'call' && !flyTo && call) ? (
                <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: bx }, { translateY: by }, { scale: bs }] }}>
                  <Ball size={BALL_R * 2 * st.s} />
                </Animated.View>
              ) : null}
              {flyTo && phase === 'call' ? (
                <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: fx }, { translateY: fy }, { scale: fs }] }}>
                  <Ball size={BALL_R * 2 * st.s} />
                </Animated.View>
              ) : null}
              {call ? <CallText text={t(`game.${call.c}`)} tip={call.tip ? t(`game.${call.tip}`) : null} big={good} top={st.Y(335)} /> : null}
            </FieldScene>
          </View>
        ) : null}
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <ActionBtn testID="game-pitch" label={t('game.pitch')} onPress={throwBall} active={phase === 'aim'} color={C.blue} shadow="#1E3A8A" dim="#1E3A6E" />
      </View>
    </View>
  );
}
