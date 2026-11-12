import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { CoinBall } from '@/components/Art';
import Pelotin from '@/components/Pelotin';
import HighField, { FIELDERS, HF } from '@/components/HighField';
import PelotinBat, { BAT_FEET, BAT_H, type BatPose } from '@/components/PelotinBat';
import PelotinBody, { BODY_H, BODY_W } from '@/components/PelotinBody';
import { Btn, tapFeedback } from '@/components/ui';
import type { Avatar } from '@/content/shop';
import { BAT } from '@/content/minigames';
import { playSfx } from '@/services/sfx';
import { speak, stopSpeaking } from '@/services/speech';
import { avatarOf, type GameReward, useStore } from '@/state/store';
import { C, F } from '@/theme';

// ¡A batear! (minijuego del nivel 4). Vista desde detrás del catcher: el pitcher tira, la bola
// crece al acercarse y el niño toca BATEA justo cuando llega al home. Bolas fuera de la zona: no batear.
// Se juega con el conteo de verdad (bolas, strikes, outs) y se acaba con 3 outs.

const VB = { w: HF.w, h: HF.h };
const ZONE = HF.zone;
const REL = HF.release;
const BALL_R = 5.5;
const RIVAL: Avatar = { cap: 'cap-blue', uniform: 'uni-blue', bat: 'bat-wood', number: 7 };

type Phase = 'intro' | 'ready' | 'pitch' | 'call' | 'over';
type Call = 'hr' | 'hit' | 'foul' | 'strike' | 'ball' | 'walk' | 'k';
type Tip = 'early' | 'late' | 'chased' | 'looking' | null;

interface Pitch {
  x: number;
  y: number;
  isBall: boolean;
  ms: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const FIRST_PITCH: Pitch = { x: 181, y: 443, isBall: false, ms: 1500 };

function newPitch(hits: number): Pitch {
  const ms = Math.max(BAT.minMs, BAT.startMs - hits * BAT.stepMs) * rand(0.92, 1.1);
  if (Math.random() < BAT.ballRate) {
    const side = Math.floor(Math.random() * 4);
    const p = [
      { x: rand(149, 157), y: rand(ZONE.t + 4, ZONE.b - 4) }, // pegada al bateador
      { x: rand(205, 213), y: rand(ZONE.t + 4, ZONE.b - 4) }, // afuera
      { x: rand(172, 190), y: rand(404, 414) }, // alta
      { x: rand(172, 190), y: rand(468, 476) }, // al suelo
    ][side];
    return { ...p, isBall: true, ms };
  }
  return {
    x: rand(ZONE.l + 4, ZONE.r - 4),
    y: rand(ZONE.t + 4, ZONE.b - 4),
    isBall: false,
    ms,
  };
}

export default function BatGame() {
  const { t, p, locale, finishGame } = useStore();
  const avatar = avatarOf(p);
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const W = Math.min(winW, 520);
  const [areaH, setAreaH] = useState(0);
  // El campo ocupa todo el ancho y va pegado abajo (cerca del botón). Si falta alto se recorta el cielo;
  // si sobra, arriba se ve más cielo.
  const s = W / VB.w;
  const H = VB.h * s;

  const [phase, setPhase] = useState<Phase>('intro');
  const [count, setCount] = useState({ b: 0, s: 0, o: 0 });
  const [stats, setStats] = useState({ hits: 0, hrs: 0, walks: 0 });
  const [call, setCall] = useState<{ c: Call; tip: Tip } | null>(null);
  const [pose, setPose] = useState<BatPose>('box');
  const [windup, setWindup] = useState(false);
  const [reward, setReward] = useState<GameReward | null>(null);

  const [prog] = useState(() => new Animated.Value(0));
  const [fly] = useState(() => new Animated.Value(0));
  const pitch = useRef<Pitch>(FIRST_PITCH);
  const [pitchView, setPitchView] = useState<Pitch>(FIRST_PITCH);
  const [flyTo, setFlyTo] = useState<{ x: number; y: number } | null>(null);
  const t0 = useRef(0);
  const swung = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const alive = useRef(true);
  const st = useRef({
    count: { b: 0, s: 0, o: 0 },
    stats: { hits: 0, hrs: 0, walks: 0 },
  });

  function later(fn: () => void, ms: number) {
    const id = setTimeout(() => alive.current && fn(), ms);
    timers.current.push(id);
  }
  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimers();
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (phase !== 'intro') return;
    const tm = setTimeout(() => speak(`${t('game.batIntro')} ${t('game.batRule')}`, locale), 500);
    return () => clearTimeout(tm);
  }, [phase, t, locale]);

  function throwPitch() {
    const pt = newPitch(st.current.stats.hits);
    pitch.current = pt;
    setPitchView(pt);
    setFlyTo(null);
    swung.current = false;
    prog.setValue(0);
    setWindup(true);
    setPhase('ready');
    // El pitcher se prepara un rato distinto cada vez, para que no se pueda adivinar.
    later(
      () => {
        setWindup(false);
        setPhase('pitch');
        t0.current = Date.now();
        Animated.timing(prog, {
          toValue: 1.3,
          duration: pt.ms * 1.3,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished && alive.current && !swung.current) settle(pt.isBall ? 'ball' : 'strike', pt.isBall ? null : 'looking');
        });
      },
      rand(700, 1400),
    );
  }

  function settle(c: Call, tip: Tip) {
    const { count: k, stats: sx } = st.current;
    let b = k.b;
    let sk = k.s;
    let o = k.o;
    let shown: Call = c;
    const nx = { ...sx };
    if (c === 'strike') {
      sk += 1;
      if (sk >= 3) {
        shown = 'k';
        o += 1;
        b = 0;
        sk = 0;
        playSfx('out');
      }
    } else if (c === 'foul') {
      if (sk < 2) sk += 1;
    } else if (c === 'ball') {
      b += 1;
      if (b >= 4) {
        shown = 'walk';
        nx.walks += 1;
        b = 0;
        sk = 0;
        playSfx('safe');
      }
    } else if (c === 'hit' || c === 'hr') {
      nx.hits += 1;
      if (c === 'hr') nx.hrs += 1;
      b = 0;
      sk = 0;
    }
    st.current = { count: { b, s: sk, o }, stats: nx };
    setCount({ b, s: sk, o });
    setStats(nx);
    setCall({ c: shown, tip });
    setPhase('call');
    later(
      () => {
        setCall(null);
        if (o >= 3) {
          const coins = (nx.hits - nx.hrs) * BAT.coinsHit + nx.hrs * BAT.coinsHr;
          setReward(finishGame('batear', nx.hits, coins));
          setPhase('over');
        } else throwPitch();
      },
      c === 'hr' ? 2000 : 1500,
    );
  }

  function swing() {
    if (phase !== 'pitch' || swung.current) return;
    swung.current = true;
    tapFeedback();
    // El swing en tres cuadros: manos adelante, bate plano por la zona, y de vuelta a esperar.
    setPose('boxMid');
    later(() => setPose('boxSwing'), 70);
    later(() => setPose('box'), 650);
    const pt = pitch.current;
    const dt = Date.now() - (t0.current + pt.ms);
    const a = Math.abs(dt);
    if (pt.isBall) {
      settle('strike', 'chased');
      return;
    }
    if (a > BAT.foul) {
      settle('strike', dt < 0 ? 'early' : 'late');
      return;
    }
    prog.stopAnimation();
    const c: Call = a <= BAT.hr ? 'hr' : a <= BAT.hit ? 'hit' : 'foul';
    playSfx('bat');
    if (c !== 'foul') later(() => playSfx('safe'), 350);
    if (Platform.OS !== 'web') Haptics.impactAsync(c === 'foul' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    // A dónde sale la bola: jonrón por encima de la cerca, hit al jardín, foul hacia las gradas de un lado.
    const left = dt < 0; // temprano = jalada (a la izquierda del bateador derecho visto desde atrás)
    const dest = c === 'hr' ? { x: rand(110, 250), y: 10 } : c === 'hit' ? { x: left ? rand(40, 130) : rand(230, 320), y: rand(150, 240) } : { x: left ? -30 : VB.w + 30, y: rand(380, 450) };
    setFlyTo(dest);
    fly.setValue(0);
    Animated.timing(fly, {
      toValue: 1,
      duration: c === 'hr' ? 1300 : 900,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
    settle(c, c === 'foul' ? (dt < 0 ? 'early' : 'late') : null);
  }

  function restart() {
    clearTimers();
    setCount({ b: 0, s: 0, o: 0 });
    setStats({ hits: 0, hrs: 0, walks: 0 });
    st.current = {
      count: { b: 0, s: 0, o: 0 },
      stats: { hits: 0, hrs: 0, walks: 0 },
    };
    setReward(null);
    setCall(null);
    stopSpeaking();
    throwPitch();
  }

  function exit() {
    clearTimers();
    stopSpeaking();
    prog.stopAnimation();
    router.back();
  }

  // ---------------------------------------------------------------- pantallas
  if (phase === 'intro') {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: C.navy }}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 20,
          gap: 16,
          alignItems: 'center',
          maxWidth: 560,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <View style={{ alignSelf: 'stretch' }}>
          <BackBtn onPress={exit} label={t('common.back')} light />
        </View>
        <Text
          style={{
            fontFamily: F.bodyHeavy,
            fontSize: 14,
            letterSpacing: 1.5,
            color: C.gold,
          }}
        >
          {t('game.label')}
        </Text>
        <Text
          style={{
            fontFamily: F.display,
            fontSize: 44,
            color: C.white,
            textAlign: 'center',
          }}
        >
          {t('game.batTitle')}
        </Text>
        <PelotinBody avatar={avatar} height={180} holdBat face={{ mood: 'cheer' }} />
        <View
          style={{
            backgroundColor: C.white,
            borderRadius: 20,
            padding: 18,
            gap: 10,
            alignSelf: 'stretch',
          }}
        >
          <Text
            style={{
              fontFamily: F.bodyBold,
              fontSize: 18,
              lineHeight: 25,
              color: C.ink,
            }}
          >
            {t('game.batIntro')}
          </Text>
          <Text
            style={{
              fontFamily: F.body,
              fontSize: 16,
              lineHeight: 22,
              color: C.muted,
            }}
          >
            {t('game.batRule')}
          </Text>
        </View>
        {p.games?.batear?.best ? <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.gold }}>{t('game.best', { n: p.games.batear.best })}</Text> : null}
        <Btn testID="game-start" label={t('game.play')} variant="gold" style={{ alignSelf: 'stretch' }} onPress={restart} />
      </ScrollView>
    );
  }

  if (phase === 'over') {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: C.navy }}
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 20,
          gap: 14,
          alignItems: 'center',
          maxWidth: 560,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <Pelotin size={120} mood="cheer" />
        <Text
          testID="game-over"
          style={{
            fontFamily: F.display,
            fontSize: 38,
            color: C.gold,
            textAlign: 'center',
          }}
        >
          {t('game.over')}
        </Text>
        {reward?.newBest ? <Text style={{ fontFamily: F.bodyHeavy, fontSize: 20, color: C.white }}>{t('game.newBest')}</Text> : null}
        <View
          style={{
            backgroundColor: C.white,
            borderRadius: 20,
            padding: 18,
            gap: 10,
            alignSelf: 'stretch',
          }}
        >
          <StatRow label={t('game.hits')} value={stats.hits} />
          <StatRow label={t('game.hrs')} value={stats.hrs} />
          <StatRow label={t('game.walks')} value={stats.walks} />
        </View>
        {reward && reward.coins > 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CoinBall size={26} />
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 20, color: C.white }}>{t('result.coinsWon', { n: reward.coins })}</Text>
          </View>
        ) : null}
        {reward?.capped ? (
          <Text
            style={{
              fontFamily: F.body,
              fontSize: 15,
              lineHeight: 21,
              color: '#CBD5E1',
              textAlign: 'center',
            }}
          >
            {t('game.capReached')}
          </Text>
        ) : null}
        <Text style={{ fontFamily: F.bodyBold, fontSize: 16, color: '#CBD5E1' }}>
          {t('game.best', {
            n: Math.max(stats.hits, p.games?.batear?.best ?? 0),
          })}
        </Text>
        <Btn testID="game-again" label={t('game.again')} variant="gold" style={{ alignSelf: 'stretch' }} onPress={restart} />
        <Btn label={t('exam.toPath')} variant="ghost" style={{ alignSelf: 'stretch' }} onPress={exit} />
      </ScrollView>
    );
  }

  // ---------------------------------------------------------------- juego
  const pt = pitchView;
  const X = (v: number) => (v - BALL_R) * s;
  const Y = (v: number) => (v - BALL_R) * s;
  // La bola baja del montículo al home y, si nadie le pega, sigue hasta el guante del catcher (abajo).
  const bx = prog.interpolate({ inputRange: [0, 1, 1.3], outputRange: [REL.x, pt.x, pt.x + (pt.x - REL.x) * 0.1].map(X) });
  const by = prog.interpolate({ inputRange: [0, 1, 1.3], outputRange: [REL.y, pt.y, pt.y + 60].map(Y) });
  const bs = prog.interpolate({ inputRange: [0, 1, 1.3], outputRange: [0.55, 1.2, 1.6] });
  const fx = flyTo ? fly.interpolate({ inputRange: [0, 1], outputRange: [X(pt.x), X(flyTo.x)] }) : 0;
  const fy = flyTo ? fly.interpolate({ inputRange: [0, 0.5, 1], outputRange: [Y(pt.y), Y((pt.y + flyTo.y) / 2 - 120), Y(flyTo.y)] }) : 0;
  const fs = flyTo ? fly.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1.2, 1.5, 0.6] }) : 1;
  const big = call && (call.c === 'hr' || call.c === 'hit' || call.c === 'walk');
  const bad = call && (call.c === 'strike' || call.c === 'k');
  const top = areaH ? areaH - H : 0;
  const kb = HF.batter.h / BAT_H;

  return (
    <View style={{ flex: 1, backgroundColor: C.navy, paddingTop: insets.top + 6, paddingBottom: insets.bottom + 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 6, gap: 8, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <BackBtn onPress={exit} label={t('common.back')} light />
        <Text numberOfLines={1} adjustsFontSizeToFit style={{ flex: 1, fontFamily: F.display, fontSize: 24, color: C.white }}>
          {t('game.batTitle')}
        </Text>
        <CountBoard b={count.b} s={count.s} o={count.o} hits={stats.hits} />
      </View>

      <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#93C5FD' }} onLayout={(e) => setAreaH(e.nativeEvent.layout.height)}>
        {areaH ? (
          <Pressable testID="game-field" onPressIn={swing} onPress={swing} unstable_pressDelay={0} style={{ position: 'absolute', left: (Math.min(winW, 9999) - W) / 2, top, width: W, height: H }} accessible={false}>
            <Svg width={W} height={H} viewBox={`0 0 ${VB.w} ${VB.h}`} style={{ position: 'absolute' }}>
              <HighField />
              {/* zona de strike en amarillo, flotando sobre el home */}
              <Rect x={ZONE.l} y={ZONE.t} width={ZONE.r - ZONE.l} height={ZONE.b - ZONE.t} fill="#FDE047" fillOpacity={0.22} stroke="#FACC15" strokeWidth={2} strokeDasharray="5 3" rx={2} />
            </Svg>
            {/* fildeadores rivales; el último es el pitcher, que se prepara antes de tirar */}
            {FIELDERS.map(([x, y, h], i) => {
              const pitcher = i === FIELDERS.length - 1;
              const bh = h * s;
              return (
                <View key={i} pointerEvents="none" style={{ position: 'absolute', left: x * s - ((BODY_W * bh) / BODY_H) / 2, top: (y - h) * s - (pitcher && windup ? 4 * s : 0) }}>
                  <PelotinBody avatar={RIVAL} height={bh} face={{ mood: pitcher && windup ? 'cheer' : 'happy' }} />
                </View>
              );
            })}
            {/* Pelotín al bate */}
            <View pointerEvents="none" style={{ position: 'absolute', left: (HF.batter.x - BAT_FEET.x * kb) * s, top: (HF.batter.y - BAT_FEET.y * kb) * s }}>
              <PelotinBat avatar={avatar} height={BAT_H * kb * s} pose={pose} mood={call ? (bad ? 'think' : 'cheer') : 'happy'} />
            </View>
            {/* bola en vuelo hacia el home */}
            {phase === 'pitch' || (phase === 'call' && !flyTo) ? (
              <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: bx }, { translateY: by }, { scale: bs }] }}>
                <Ball size={BALL_R * 2 * s} />
              </Animated.View>
            ) : null}
            {/* bola bateada */}
            {flyTo && (phase === 'call' || phase === 'ready') ? (
              <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: fx }, { translateY: fy }, { scale: fs }] }}>
                <Ball size={BALL_R * 2 * s} />
              </Animated.View>
            ) : null}
            {call ? (
              <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 150 * s, alignItems: 'center', gap: 6 }}>
                <Text
                  testID="game-call"
                  style={{ fontFamily: F.display, fontSize: big ? 58 : 48, color: big ? C.gold : C.white, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 6, textAlign: 'center' }}
                >
                  {t(`game.${call.c}`)}
                </Text>
                {call.tip ? (
                  <View style={{ backgroundColor: 'rgba(12,35,64,0.88)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, marginHorizontal: 20 }}>
                    <Text style={{ fontFamily: F.bodyBold, fontSize: 16, color: C.white, textAlign: 'center' }}>{t(`game.${call.tip}`)}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </Pressable>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <Pressable
          testID="game-swing"
          accessibilityRole="button"
          accessibilityLabel={t('game.swing')}
          onPressIn={swing}
          onPress={swing}
          unstable_pressDelay={0}
          style={({ pressed }) => [
            { minHeight: 84, borderRadius: 22, backgroundColor: phase === 'pitch' ? C.red : '#7F1D2D', alignItems: 'center', justifyContent: 'center', marginTop: pressed ? 5 : 0, marginBottom: pressed ? 0 : 5 },
            Platform.OS === 'web' ? ({ boxShadow: `0 ${pressed ? 0 : 6}px 0 ${C.redDark}` } as object) : { shadowColor: C.redDark, shadowOffset: { width: 0, height: pressed ? 0 : 6 }, shadowOpacity: 1, shadowRadius: 0 },
          ]}
        >
          <Text style={{ fontFamily: F.display, fontSize: 36, letterSpacing: 2, color: C.white }}>{t('game.swing')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function BackBtn({ onPress, label, light }: { onPress: () => void; label: string; light?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ width: 44, height: 44, justifyContent: 'center' }}>
      <Svg width={28} height={28} viewBox="0 0 24 24">
        <Path d="M15 5l-7 7 7 7" fill="none" stroke={light ? C.white : C.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontFamily: F.bodyBold, fontSize: 18, color: C.muted }}>{label}</Text>
      <Text style={{ fontFamily: F.display, fontSize: 30, color: C.ink }}>{value}</Text>
    </View>
  );
}

function Dots({ n, of, color }: { n: number; of: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {Array.from({ length: of }, (_, i) => (
        <View
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: i < n ? color : 'rgba(255,255,255,0.18)',
          }}
        />
      ))}
    </View>
  );
}

// Marcador como el del estadio: B (bolas), S (strikes), O (outs) y los hits de la entrada.
function CountBoard({ b, s, o, hits }: { b: number; s: number; o: number; hits: number }) {
  const row = (k: string, n: number, of: number, color: string) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Text
        style={{
          width: 12,
          fontFamily: F.bodyHeavy,
          fontSize: 12,
          color: '#CBD5E1',
        }}
      >
        {k}
      </Text>
      <Dots n={n} of={of} color={color} />
    </View>
  );
  return (
    <View
      testID="game-count"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: C.navyDeep,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
      }}
    >
      <View style={{ gap: 3 }}>
        {row('B', b, 3, C.green)}
        {row('S', s, 2, C.gold)}
        {row('O', o, 2, C.red)}
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11, color: '#CBD5E1' }}>H</Text>
        <Text testID="game-hits" style={{ fontFamily: F.display, fontSize: 24, color: C.white }}>
          {hits}
        </Text>
      </View>
    </View>
  );
}

function Ball({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={11} fill={C.white} stroke="#CBD5E1" strokeWidth={1} />
      <Path d="M6 4q4 8 0 16M18 4q-4 8 0 16" fill="none" stroke={C.red} strokeWidth={1.6} strokeDasharray="2 1.6" />
    </Svg>
  );
}
