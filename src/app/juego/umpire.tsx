import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import FieldScene from '@/components/FieldScene';
import { ActionBtn, Ball, Board, CallText, GameHeader, GameIntro, GameOver, rand, RIVAL, useTimers } from '@/components/GameKit';
import { HF, stageOf } from '@/components/HighField';
import PelotinBody from '@/components/PelotinBody';
import { tapFeedback } from '@/components/ui';
import { UMP } from '@/content/minigames';
import { playSfx } from '@/services/sfx';
import { speak, stopSpeaking } from '@/services/speech';
import { avatarOf, type GameReward, useStore } from '@/state/store';
import { C } from '@/theme';

// Umpire por un día (minijuego del nivel 12). La cámara se acerca al home, como si el niño estuviera
// detrás del catcher con la careta puesta. La bola llega y se queda marcada donde pasó; el niño canta
// STRIKE o BOLA. Si la bola toca la zona, aunque sea un poquito, es strike. Tres errores y se acaba.

const ZONE = HF.zone;
const REL = HF.release;
const BALL_R = 5.5;
/** Tamaño de la bola cuando pasa por el home (la animación la agranda 1.2 veces). */
const R_PLATE = BALL_R * 1.2;
const CAM = { x: 90, y: 262, w: 180 };

type Phase = 'intro' | 'ready' | 'pitch' | 'judge' | 'call' | 'over';
interface Pitch {
  x: number;
  y: number;
  strike: boolean;
  ms: number;
}

/** ¿La bola (círculo) toca el rectángulo de la zona? */
function touches(x: number, y: number) {
  const cx = Math.max(ZONE.l, Math.min(x, ZONE.r));
  const cy = Math.max(ZONE.t, Math.min(y, ZONE.b));
  return Math.hypot(x - cx, y - cy) <= R_PLATE;
}

function newPitch(n: number): Pitch {
  const ms = Math.max(UMP.minMs, UMP.startMs - n * UMP.stepMs) * rand(0.92, 1.08);
  let x: number;
  let y: number;
  const r = Math.random();
  if (r < UMP.edgeRate) {
    // Rozando una orilla: unas tocan la zona y otras no, por muy poquito.
    const off = rand(-R_PLATE * 0.7, R_PLATE * 1.7);
    const side = Math.floor(Math.random() * 4);
    if (side === 0) [x, y] = [ZONE.l - off, rand(ZONE.t, ZONE.b)];
    else if (side === 1) [x, y] = [ZONE.r + off, rand(ZONE.t, ZONE.b)];
    else if (side === 2) [x, y] = [rand(ZONE.l, ZONE.r), ZONE.t - off];
    else [x, y] = [rand(ZONE.l, ZONE.r), ZONE.b + off];
  } else if (r < UMP.edgeRate + (1 - UMP.edgeRate) / 2) {
    [x, y] = [rand(ZONE.l + 4, ZONE.r - 4), rand(ZONE.t + 4, ZONE.b - 4)];
  } else {
    const side = Math.floor(Math.random() * 4);
    [x, y] = [
      [rand(146, 152), rand(ZONE.t, ZONE.b)],
      [rand(210, 216), rand(ZONE.t, ZONE.b)],
      [rand(172, 190), rand(404, 412)],
      [rand(172, 190), rand(474, 480)],
    ][side] as [number, number];
  }
  return { x, y, strike: touches(x, y), ms };
}

const FIRST: Pitch = { x: 181, y: 443, strike: true, ms: 1400 };
const ZERO = { count: { b: 0, s: 0 }, stats: { right: 0, wrong: 0, n: 0 } };

export default function UmpireGame() {
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
  const [call, setCall] = useState<{ ok: boolean; truth: boolean } | null>(null);
  const [windup, setWindup] = useState(false);
  const [reward, setReward] = useState<GameReward | null>(null);
  const [prog] = useState(() => new Animated.Value(0));
  const pitch = useRef<Pitch>(FIRST);
  const [pv, setPv] = useState<Pitch>(FIRST);
  const game = useRef(ZERO);
  const judged = useRef(false);
  const tm = useTimers();

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    if (phase !== 'intro') return;
    const id = setTimeout(() => speak(`${t('game.umpIntro')} ${t('game.umpRule')}`, locale), 500);
    return () => clearTimeout(id);
  }, [phase, t, locale]);

  function throwPitch() {
    const pt = newPitch(game.current.stats.n);
    pitch.current = pt;
    judged.current = false;
    setPv(pt);
    prog.setValue(0);
    setWindup(true);
    setPhase('ready');
    tm.later(() => {
      setWindup(false);
      setPhase('pitch');
      Animated.timing(prog, { toValue: 1, duration: pt.ms, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
        if (finished && tm.alive.current) setPhase('judge');
      });
    }, rand(600, 1100));
  }

  function judge(said: boolean) {
    if (phase !== 'judge' || judged.current) return;
    judged.current = true;
    tapFeedback();
    const pt = pitch.current;
    const ok = said === pt.strike;
    playSfx(ok ? 'safe' : 'out');
    const { count: k, stats: sx } = game.current;
    let { b, s } = k;
    if (pt.strike) {
      s += 1;
      if (s >= 3) [b, s] = [0, 0];
    } else {
      b += 1;
      if (b >= 4) [b, s] = [0, 0];
    }
    const nx = { right: sx.right + (ok ? 1 : 0), wrong: sx.wrong + (ok ? 0 : 1), n: sx.n + 1 };
    game.current = { count: { b, s }, stats: nx };
    setCount({ b, s });
    setStats(nx);
    setCall({ ok, truth: pt.strike });
    setPhase('call');
    tm.later(
      () => {
        setCall(null);
        if (nx.wrong >= UMP.lives) {
          setReward(finishGame('umpire', nx.right, Math.floor(nx.right / UMP.callsPerCoin)));
          setPhase('over');
        } else throwPitch();
      },
      ok ? 1300 : 2300,
    );
  }

  function restart() {
    tm.clear();
    game.current = ZERO;
    setCount(ZERO.count);
    setStats(ZERO.stats);
    setReward(null);
    setCall(null);
    stopSpeaking();
    throwPitch();
  }

  function exit() {
    tm.clear();
    stopSpeaking();
    prog.stopAnimation();
    router.back();
  }

  const best = p.games?.umpire?.best ?? 0;
  if (phase === 'intro') {
    return (
      <GameIntro
        label={t('game.label')}
        title={t('game.umpTitle')}
        intro={t('game.umpIntro')}
        rule={t('game.umpRule')}
        art={<PelotinBody avatar={{ ...avatar, uniform: 'uni-black', cap: 'cap-black' }} height={190} face={{ mood: 'happy' }} />}
        best={best ? t('game.bestCalls', { n: best }) : undefined}
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
          [t('game.calls'), stats.right],
          [t('game.misses'), stats.wrong],
        ]}
        reward={reward}
        newBest={t('game.newBest')}
        capText={t('game.capReached')}
        coinsText={t('result.coinsWon', { n: reward?.coins ?? 0 })}
        bestText={t('game.bestCalls', { n: Math.max(stats.right, best) })}
        again={t('game.again')}
        toPath={t('exam.toPath')}
        onAgain={restart}
        onExit={exit}
      />
    );
  }

  const X = (v: number) => st.X(v - BALL_R);
  const Y = (v: number) => st.Y(v - BALL_R);
  const bx = prog.interpolate({ inputRange: [0, 1], outputRange: [X(REL.x), X(pv.x)] });
  const by = prog.interpolate({ inputRange: [0, 1], outputRange: [Y(REL.y), Y(pv.y)] });
  const bs = prog.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.2] });
  const showBall = phase === 'pitch' || phase === 'judge' || phase === 'call';

  return (
    <View style={{ flex: 1, backgroundColor: C.navy, paddingTop: insets.top + 6, paddingBottom: insets.bottom + 16 }}>
      <GameHeader
        title={t('game.umpTitle')}
        back={t('common.back')}
        onBack={exit}
        right={
          <Board
            rows={[
              { k: 'B', n: count.b, of: 3, color: C.green },
              { k: 'S', n: count.s, of: 2, color: C.gold },
              { k: '✗', n: stats.wrong, of: UMP.lives, color: C.red },
            ]}
            label="✓"
            n={stats.right}
          />
        }
      />
      <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#93C5FD' }} onLayout={(e) => setAreaH(e.nativeEvent.layout.height)}>
        {areaH ? (
          <View style={{ position: 'absolute', left: (winW - W) / 2, top: areaH - st.H, width: W, height: st.H }}>
            <FieldScene st={st} team={RIVAL} pitcher={RIVAL} pitcherUp={windup} batter={RIVAL}>
              {showBall ? (
                <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: bx }, { translateY: by }, { scale: bs }] }}>
                  <Ball size={BALL_R * 2 * st.s} />
                </Animated.View>
              ) : null}
              {/* donde pasó la bola queda marcado con un aro, para poder juzgar con calma */}
              {phase === 'judge' || phase === 'call' ? (
                <View pointerEvents="none" style={{ position: 'absolute', left: st.X(pv.x - R_PLATE - 3), top: st.Y(pv.y - R_PLATE - 3) }}>
                  <Svg width={(R_PLATE + 3) * 2 * st.s} height={(R_PLATE + 3) * 2 * st.s} viewBox={`0 0 ${(R_PLATE + 3) * 2} ${(R_PLATE + 3) * 2}`}>
                    <Circle cx={R_PLATE + 3} cy={R_PLATE + 3} r={R_PLATE + 1.8} fill="none" stroke={call ? (call.truth ? C.red : C.green) : '#FFFFFF'} strokeWidth={1.4} strokeDasharray="2 1.5" />
                  </Svg>
                </View>
              ) : null}
              {call ? <CallText text={t(call.ok ? 'game.goodCall' : 'game.badCall')} tip={t(call.truth ? 'game.wasStrike' : 'game.wasBall')} big={call.ok} top={st.Y(330)} /> : null}
            </FieldScene>
          </View>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 12, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <ActionBtn flex testID="ump-strike" label={t('game.callStrike')} onPress={() => judge(true)} active={phase === 'judge'} />
        <ActionBtn flex testID="ump-ball" label={t('game.callBall')} onPress={() => judge(false)} active={phase === 'judge'} color={C.green} shadow={C.greenDark} dim="#14532D" />
      </View>
    </View>
  );
}
