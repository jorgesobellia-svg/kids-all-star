import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, useWindowDimensions, View, type GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, G, LinearGradient, Path, Pattern, Polygon, Rect, Stop, Line, Circle, Text as SvgText } from 'react-native-svg';
import { Ball, Board, CallText, Fans, GameHeader, GameIntro, GameOver, rand, useTimers } from '@/components/GameKit';
import PelotinBody, { BODY_H, BODY_W } from '@/components/PelotinBody';
import { FLY } from '@/content/minigames';
import { playSfx } from '@/services/sfx';
import { speak, stopSpeaking } from '@/services/speech';
import { avatarOf, type GameReward, useStore } from '@/state/store';
import { C, F } from '@/theme';

// ¡Atrapa la elevada! (minijuego del nivel 16). Cámara detrás de Pelotín, que juega en el jardín
// mirando hacia el home. Batean un elevado: la sombra en el pasto marca dónde va a caer. El niño toca
// el campo y Pelotín corre hasta ahí; si llega antes que la bola, la atrapa. Tres que se caen y se acaba.

const VB = { w: 360, h: 560 };
const HOME = { x: 180, y: 206 };
/** Parte del pasto donde se puede correr y donde caen las bolas. */
const FIELD = { l: 24, r: 336, t: 262, b: 520 };
const START = { x: 180, y: 430 };
const BALL_R = 6;

/** Qué tan grande se ve algo parado en esa altura de la pantalla (perspectiva). */
const depth = (y: number) => 0.45 + ((y - FIELD.t) / (FIELD.b - FIELD.t)) * 0.75;
const PH = 120; // alto de Pelotín cuando está más cerca (depth = 1)

type Phase = 'intro' | 'wait' | 'fly' | 'call' | 'over';

function speckles(n: number, seed: number, w: number, h: number) {
  let x = seed;
  const r = () => (x = (x * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: n }, () => [r() * w, r() * h, r()] as const);
}
const GRASS_DOTS = speckles(40, 5, 18, 18);

const OutfieldField = React.memo(function OutfieldField() {
  return (
    <G>
      <Defs>
        <LinearGradient id="osky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#5BB4EE" />
          <Stop offset="1" stopColor="#BFE6FF" />
        </LinearGradient>
        <LinearGradient id="ograss" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3F8F3A" />
          <Stop offset="1" stopColor="#52A84A" />
        </LinearGradient>
        <Pattern id="ogtex" width={18} height={18} patternUnits="userSpaceOnUse">
          {GRASS_DOTS.map(([x, y, k], i) => (
            <Line key={i} x1={x} y1={y} x2={x + (k - 0.5) * 2} y2={y - 2 - k * 2} stroke={k > 0.5 ? '#2F6B2A' : '#6BBF5F'} strokeWidth={0.8} opacity={0.5} />
          ))}
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width={VB.w} height={150} fill="url(#osky)" />
      <Circle cx={300} cy={44} r={18} fill="#FDE68A" />
      <Ellipse cx={80} cy={48} rx={36} ry={10} fill="#FFFFFF" opacity={0.85} />
      {/* gradas detrás del home (el público va aparte) */}
      <Path d="M0 120 Q180 96 360 120 L360 176 L0 176 Z" fill="#1E3A5F" />
      <Rect x={0} y={172} width={VB.w} height={8} fill="#0F5132" />
      {/* pasto, con franjas que se ensanchan al acercarse */}
      <Rect x={0} y={180} width={VB.w} height={VB.h - 180} fill="url(#ograss)" />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 180 + i * i * 3.6 + i * 12;
        return <Rect key={i} x={0} y={y} width={VB.w} height={5 + i * 4} fill="#FFFFFF" opacity={0.07} />;
      })}
      <Rect x={0} y={180} width={VB.w} height={VB.h - 180} fill="url(#ogtex)" />
      {/* el cuadro al fondo, chiquito */}
      <Path d="M110 214 Q180 160 250 214 L180 236 Z" fill="#C98E58" />
      <Polygon points="180,190 214,206 180,222 146,206" fill="#4FA347" />
      <Ellipse cx={180} cy={206} rx={7} ry={2.5} fill="#B9844F" />
      <Polygon points={`${HOME.x - 3},${HOME.y + 26} ${HOME.x + 3},${HOME.y + 26} ${HOME.x},${HOME.y + 29}`} fill="#FFFFFF" />
      <Line x1={180} y1={236} x2={-30} y2={300} stroke="#F8FAFC" strokeWidth={2} />
      <Line x1={180} y1={236} x2={390} y2={300} stroke="#F8FAFC" strokeWidth={2} />
      {/* pista de advertencia, al pie de la cerca de atrás de Pelotín */}
      <Rect x={0} y={528} width={VB.w} height={32} fill="#C98E58" />
      <SvgText x={180} y={549} fontFamily={F.bodyHeavy} fontSize={11} fill="#7C4A1E" textAnchor="middle" opacity={0.7}>
        ★ ★ ★
      </SvgText>
    </G>
  );
});

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
  const [land, setLand] = useState({ x: 180, y: 360 });
  const [cheer, setCheer] = useState(false);
  const [running, setRunning] = useState(false);
  const [frame, setFrame] = useState<0 | 1>(0);
  const [hint, setHint] = useState(true);
  const [reward, setReward] = useState<GameReward | null>(null);
  const [pos] = useState(() => new Animated.ValueXY(START));
  const [air] = useState(() => new Animated.Value(0));
  const here = useRef({ ...START });
  const origin = useRef({ x: 0, y: 0 });
  const fieldRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const runAnim = useRef<Animated.CompositeAnimation | null>(null);
  const game = useRef({ catches: 0, drops: 0 });
  const tm = useTimers();

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    if (phase !== 'intro') return;
    const id = setTimeout(() => speak(`${t('game.flyIntro')} ${t('game.flyRule')}`, locale), 500);
    return () => clearTimeout(id);
  }, [phase, t, locale]);
  useEffect(() => {
    const id = pos.addListener((v) => (here.current = v));
    return () => pos.removeListener(id);
  }, [pos]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setFrame((f) => (f ? 0 : 1)), 130);
    return () => clearInterval(id);
  }, [running]);

  function launch() {
    const { catches } = game.current;
    // La próxima cae más lejos de donde está Pelotín, y el elevado dura menos en el aire.
    const dist = Math.min(210, 60 + catches * 14) * rand(0.85, 1.1);
    let L = { x: 180, y: 360 };
    for (let i = 0; i < 20; i++) {
      const a = rand(0, Math.PI * 2);
      const q = { x: here.current.x + Math.cos(a) * dist, y: here.current.y + Math.sin(a) * dist * 0.7 };
      if (q.x > FIELD.l + 10 && q.x < FIELD.r - 10 && q.y > FIELD.t + 10 && q.y < FIELD.b - 10) {
        L = q;
        break;
      }
    }
    setLand(L);
    setCall(null);
    air.setValue(0);
    setPhase('fly');
    playSfx('bat');
    const T = Math.max(FLY.minMs, FLY.startMs - catches * FLY.stepMs);
    Animated.timing(air, { toValue: 1, duration: T, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
      if (finished && tm.alive.current) landed(L);
    });
  }

  function landed(L: { x: number; y: number }) {
    const d = Math.hypot(here.current.x - L.x, (here.current.y - L.y) / 0.7);
    const caught = d <= FLY.reach;
    runAnim.current?.stop();
    setRunning(false);
    const g = game.current;
    const nx = caught ? { ...g, catches: g.catches + 1 } : { ...g, drops: g.drops + 1 };
    game.current = nx;
    setStats(nx);
    setCall(caught ? 'caught' : 'dropped');
    setPhase('call');
    if (caught) {
      playSfx('out');
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

  function runTo(e: GestureResponderEvent) {
    if (phase !== 'fly' && phase !== 'wait') return;
    setHint(false);
    // Se usa la posición en la pantalla menos dónde empieza el campo (locationX no es igual en todos los teléfonos).
    const x = Math.max(FIELD.l, Math.min(FIELD.r, (e.nativeEvent.pageX - origin.current.x) / s));
    const y = Math.max(FIELD.t, Math.min(FIELD.b, (e.nativeEvent.pageY - origin.current.y) / s));
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const d = Math.hypot(x - here.current.x, y - here.current.y);
    runAnim.current?.stop();
    setRunning(true);
    runAnim.current = Animated.timing(pos, { toValue: { x, y }, duration: (d / FLY.runSpeed) * 1000, easing: Easing.linear, useNativeDriver: false });
    runAnim.current.start(({ finished }) => finished && setRunning(false));
  }

  function restart() {
    tm.clear();
    game.current = { catches: 0, drops: 0 };
    setStats(game.current);
    setReward(null);
    setCall(null);
    setCheer(false);
    setHint(true);
    pos.setValue(START);
    here.current = { ...START };
    stopSpeaking();
    setPhase('wait');
    tm.later(launch, 900);
  }

  function exit() {
    tm.clear();
    runAnim.current?.stop();
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

  // Pelotín: se ve de espaldas, más chico cuanto más lejos (más arriba) está.
  const ys = [FIELD.t, FIELD.b];
  const sc = pos.y.interpolate({ inputRange: ys, outputRange: ys.map((y) => depth(y)) });
  const BW = (PH * s * BODY_W) / BODY_H;
  // La bola: sale del home, sube alto y baja en la sombra. Se ve más grande al acercarse.
  const N = 12;
  const steps = Array.from({ length: N + 1 }, (_, i) => i / N);
  const bx = air.interpolate({ inputRange: steps, outputRange: steps.map((k) => (HOME.x + (land.x - HOME.x) * k - BALL_R) * s) });
  const by = air.interpolate({ inputRange: steps, outputRange: steps.map((k) => (HOME.y + (land.y - HOME.y) * k - 240 * Math.sin(Math.PI * k) * (0.6 + 0.4 * k) - BALL_R) * s) });
  const bs = air.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1.2, depth(land.y) * 1.6] });
  // La sombra se pone más oscura y más chica justo antes de caer.
  const shO = air.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.12, 0.25, 0.45] });
  const d0 = depth(land.y);

  return (
    <View style={{ flex: 1, backgroundColor: C.navy, paddingTop: insets.top + 6, paddingBottom: insets.bottom + 16 }}>
      <GameHeader title={t('game.flyTitle')} back={t('common.back')} onBack={exit} right={<Board rows={[{ k: '✗', n: stats.drops, of: FLY.lives, color: C.red }]} label="OUT" n={stats.catches} />} />
      <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#5BB4EE' }} onLayout={(e) => setAreaH(e.nativeEvent.layout.height)}>
        {areaH ? (
          <Pressable ref={fieldRef} onLayout={() => fieldRef.current?.measureInWindow((x, y) => (origin.current = { x, y }))} testID="fly-field" onPressIn={runTo} onPress={runTo} unstable_pressDelay={0} style={{ position: 'absolute', left: (winW - W) / 2, top: areaH - H, width: W, height: H }} accessible={false}>
            <Svg width={W} height={H} viewBox={`0 0 ${VB.w} ${VB.h}`} style={{ position: 'absolute' }} pointerEvents="none">
              <OutfieldField />
            </Svg>
            <Fans box={{ x: 0, y: 112, w: 360, h: 56 }} s={s} cheering={cheer} />
            {/* sombra donde va a caer */}
            {phase === 'fly' ? (
              <Animated.View pointerEvents="none" style={{ position: 'absolute', left: (land.x - 22 * d0) * s, top: (land.y - 8 * d0) * s, opacity: shO }}>
                <Svg width={44 * d0 * s} height={16 * d0 * s} viewBox="0 0 44 16">
                  <Ellipse cx={22} cy={8} rx={20} ry={7} fill="#000000" />
                </Svg>
              </Animated.View>
            ) : null}
            {/* Pelotín */}
            <Animated.View
              pointerEvents="none"
              testID="fly-pelotin"
              style={{ position: 'absolute', left: 0, top: 0, width: BW, height: PH * s, transform: [{ translateX: Animated.subtract(Animated.multiply(pos.x, s), BW / 2) }, { translateY: Animated.subtract(Animated.multiply(pos.y, s), PH * s) }] }}
            >
              <Animated.View style={{ position: 'absolute', left: 0, bottom: 0, width: BW, height: PH * s, transform: [{ translateY: Animated.multiply(Animated.subtract(1, sc), (PH * s) / 2) }, { scale: sc }] }}>
                <PelotinBody avatar={avatar} height={PH * s} view={call === 'caught' ? 'front' : 'back'} pose={running ? 'run' : 'stand'} frame={frame} face={{ mood: 'cheer' }} />
              </Animated.View>
            </Animated.View>
            {/* la bola en el aire */}
            {phase === 'fly' || call === 'dropped' ? (
              <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: bx }, { translateY: by }, { scale: bs }] }}>
                <Ball size={BALL_R * 2 * s} />
              </Animated.View>
            ) : null}
            {hint && phase !== 'call' ? <CallText text="" tip={t('game.tapToRun')} top={250 * s} /> : null}
            {call ? <CallText text={t(`game.${call}`)} big={call === 'caught'} top={225 * s} /> : null}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
