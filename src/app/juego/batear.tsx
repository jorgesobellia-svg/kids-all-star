import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FieldScene from '@/components/FieldScene';
import { ActionBtn, Ball, Board, CallText, GameHeader, GameIntro, GameOver, rand, RIVAL, useAmbience, useTimers } from '@/components/GameKit';
import { HF, stageOf } from '@/components/HighField';
import PelotinBat from '@/components/PelotinBat';
import type { BatPose } from '@/components/PelotinBat';
import { tapFeedback } from '@/components/ui';
import { BAT } from '@/content/minigames';
import { playSfx, preloadUmpireCalls } from '@/services/sfx';
import { speak, stopSpeaking } from '@/services/speech';
import { avatarOf, type GameReward, useStore } from '@/state/store';
import { C } from '@/theme';

// ¡A batear! (minijuego del nivel 4). Cámara alta detrás del home: el pitcher tira desde el montículo,
// la bola baja hacia la zona de strike y el niño toca BATEA justo cuando llega. Bolas fuera de la zona: no batear.
// Conteo de verdad (bolas y strikes); un ponche acaba el juego. El público brinca con cada hit.

const ZONE = HF.zone;
const REL = HF.release;
const BALL_R = 5.5;

type Phase = 'intro' | 'ready' | 'pitch' | 'call' | 'over';
type Call = 'hr' | 'hit' | 'foul' | 'strike' | 'ball' | 'walk' | 'k';
type Tip = 'early' | 'late' | 'chased' | 'looking' | null;

interface Pitch {
  x: number;
  y: number;
  isBall: boolean;
  ms: number;
}

const FIRST_PITCH: Pitch = { x: 181, y: 443, isBall: false, ms: 1500 };
const ZERO = { count: { b: 0, s: 0, o: 0 }, stats: { hits: 0, hrs: 0, walks: 0 } };

function newPitch(hits: number): Pitch {
  const ms = Math.max(BAT.minMs, BAT.startMs - hits * BAT.stepMs) * rand(0.92, 1.1);
  if (Math.random() < BAT.ballRate) {
    const p = [
      { x: rand(149, 157), y: rand(ZONE.t + 4, ZONE.b - 4) }, // pegada al bateador
      { x: rand(205, 213), y: rand(ZONE.t + 4, ZONE.b - 4) }, // afuera
      { x: rand(172, 190), y: rand(404, 414) }, // alta
      { x: rand(172, 190), y: rand(468, 476) }, // al suelo
    ][Math.floor(Math.random() * 4)];
    return { ...p, isBall: true, ms };
  }
  return { x: rand(ZONE.l + 4, ZONE.r - 4), y: rand(ZONE.t + 4, ZONE.b - 4), isBall: false, ms };
}

export default function BatGame() {
  const { t, p, locale, finishGame } = useStore();
  const avatar = avatarOf(p);
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const W = Math.min(winW, 520);
  const [areaH, setAreaH] = useState(0);
  const st = stageOf(W);

  const [phase, setPhase] = useState<Phase>('intro');
  const [count, setCount] = useState(ZERO.count);
  const [stats, setStats] = useState(ZERO.stats);
  const [call, setCall] = useState<{ c: Call; tip: Tip } | null>(null);
  const [pose, setPose] = useState<BatPose>('box');
  const [windup, setWindup] = useState(false);
  const [cheer, setCheer] = useState(false);
  const [reward, setReward] = useState<GameReward | null>(null);
  const [prog] = useState(() => new Animated.Value(0));
  const [fly] = useState(() => new Animated.Value(0));
  const pitch = useRef<Pitch>(FIRST_PITCH);
  const [pitchView, setPitchView] = useState<Pitch>(FIRST_PITCH);
  const [flyTo, setFlyTo] = useState<{ x: number; y: number } | null>(null);
  const t0 = useRef(0);
  const swung = useRef(false);
  const game = useRef(ZERO);
  const tm = useTimers();
  useAmbience(phase !== 'intro' && phase !== 'over');

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    if (phase !== 'intro') return;
    const id = setTimeout(() => speak(`${t('game.batIntro')} ${t('game.batRule')}`, locale), 500);
    return () => clearTimeout(id);
  }, [phase, t, locale]);

  function throwPitch() {
    const pt = newPitch(game.current.stats.hits);
    pitch.current = pt;
    setPitchView(pt);
    setFlyTo(null);
    swung.current = false;
    prog.setValue(0);
    setWindup(true);
    setPhase('ready');
    // El pitcher se prepara un rato distinto cada vez, para que no se pueda adivinar.
    tm.later(() => {
      setWindup(false);
      setPhase('pitch');
      t0.current = Date.now();
      Animated.timing(prog, { toValue: 1.3, duration: pt.ms * 1.3, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
        if (finished && tm.alive.current && !swung.current) settle(pt.isBall ? 'ball' : 'strike', pt.isBall ? null : 'looking');
      });
    }, rand(700, 1400));
  }

  function settle(c: Call, tip: Tip) {
    const { count: k, stats: sx } = game.current;
    let { b, s, o } = k;
    let shown: Call = c;
    const nx = { ...sx };
    if (c === 'strike') {
      s += 1;
      if (s >= 3) {
        shown = 'k';
        o += 1;
        b = 0;
        s = 0;
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
    } else {
      nx.hits += 1;
      if (c === 'hr') nx.hrs += 1;
      b = 0;
      s = 0;
      // El público brinca con cada hit.
      setCheer(true);
      tm.later(() => setCheer(false), c === 'hr' ? 2000 : 1500);
    }
    // El umpire canta la jugada (en inglés, como en el béisbol de verdad).
    const voice = { hr: 'umpHr', hit: 'umpHit', foul: 'umpFoul', strike: 'umpStrike', ball: 'umpBall', walk: 'umpWalk', k: 'umpK' } as const;
    tm.later(() => playSfx(voice[shown]), c === 'hit' || c === 'hr' || c === 'foul' ? 250 : 0);
    game.current = { count: { b, s, o }, stats: nx };
    setCount({ b, s, o });
    setStats(nx);
    setCall({ c: shown, tip });
    setPhase('call');
    tm.later(
      () => {
        setCall(null);
        if (o >= BAT.outs) {
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
    tm.later(() => setPose('boxSwing'), 70);
    tm.later(() => setPose('box'), 650);
    const pt = pitch.current;
    const dt = Date.now() - (t0.current + pt.ms);
    const a = Math.abs(dt);
    if (pt.isBall) return settle('strike', 'chased');
    if (a > BAT.foul) return settle('strike', dt < 0 ? 'early' : 'late');
    prog.stopAnimation();
    const c: Call = a <= BAT.hr ? 'hr' : a <= BAT.hit ? 'hit' : 'foul';
    playSfx('bat');
    if (c === 'hr') tm.later(() => playSfx('crowd'), 900);
    if (Platform.OS !== 'web') Haptics.impactAsync(c === 'foul' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    // A dónde sale la bola: jonrón por encima de la cerca, hit entre los fildeadores, foul de lado.
    const left = dt < 0; // temprano = jalada (hacia la izquierda, el lado de tercera)
    const dest = c === 'hr' ? { x: rand(110, 250), y: 10 } : c === 'hit' ? { x: left ? rand(40, 130) : rand(230, 320), y: rand(150, 240) } : { x: left ? -30 : HF.w + 30, y: rand(380, 450) };
    setFlyTo(dest);
    fly.setValue(0);
    Animated.timing(fly, { toValue: 1, duration: c === 'hr' ? 1300 : 900, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    settle(c, c === 'foul' ? (dt < 0 ? 'early' : 'late') : null);
  }

  function restart() {
    tm.clear();
    preloadUmpireCalls();
    game.current = ZERO;
    setCount(ZERO.count);
    setStats(ZERO.stats);
    setReward(null);
    setCall(null);
    setCheer(false);
    stopSpeaking();
    throwPitch();
  }

  function exit() {
    tm.clear();
    stopSpeaking();
    prog.stopAnimation();
    router.back();
  }

  const best = p.games?.batear?.best ?? 0;
  if (phase === 'intro') {
    return (
      <GameIntro
        label={t('game.label')}
        title={t('game.batTitle')}
        intro={t('game.batIntro')}
        rule={t('game.batRule')}
        art={<PelotinBat avatar={avatar} height={190} pose="stance" mood="cheer" />}
        best={best ? t('game.best', { n: best }) : undefined}
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
          [t('game.hits'), stats.hits],
          [t('game.hrs'), stats.hrs],
          [t('game.walks'), stats.walks],
        ]}
        reward={reward}
        newBest={t('game.newBest')}
        capText={t('game.capReached')}
        coinsText={t('result.coinsWon', { n: reward?.coins ?? 0 })}
        bestText={t('game.best', { n: Math.max(stats.hits, best) })}
        again={t('game.again')}
        toPath={t('exam.toPath')}
        onAgain={restart}
        onExit={exit}
      />
    );
  }

  const pt = pitchView;
  const X = (v: number) => st.X(v - BALL_R);
  const Y = (v: number) => st.Y(v - BALL_R);
  // La bola baja del montículo al home y, si nadie le pega, sigue hasta el guante del catcher (abajo).
  const bx = prog.interpolate({ inputRange: [0, 1, 1.3], outputRange: [REL.x, pt.x, pt.x + (pt.x - REL.x) * 0.1].map(X) });
  const by = prog.interpolate({ inputRange: [0, 1, 1.3], outputRange: [REL.y, pt.y, pt.y + 60].map(Y) });
  const bs = prog.interpolate({ inputRange: [0, 1, 1.3], outputRange: [0.55, 1.2, 1.6] });
  const fx = flyTo ? fly.interpolate({ inputRange: [0, 1], outputRange: [X(pt.x), X(flyTo.x)] }) : 0;
  const fy = flyTo ? fly.interpolate({ inputRange: [0, 0.5, 1], outputRange: [Y(pt.y), Y((pt.y + flyTo.y) / 2 - 120), Y(flyTo.y)] }) : 0;
  const fs = flyTo ? fly.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1.2, 1.5, 0.6] }) : 1;
  const big = !!call && (call.c === 'hr' || call.c === 'hit' || call.c === 'walk');
  const bad = !!call && (call.c === 'strike' || call.c === 'k');

  return (
    <View style={{ flex: 1, backgroundColor: C.navy, paddingTop: insets.top + 6, paddingBottom: insets.bottom + 16 }}>
      <GameHeader
        title={t('game.batTitle')}
        back={t('common.back')}
        onBack={exit}
        right={
          <Board
            rows={[
              { k: 'B', n: count.b, of: 3, color: C.green },
              { k: 'S', n: count.s, of: 2, color: C.gold },
            ]}
            label="H"
            n={stats.hits}
          />
        }
      />
      <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#93C5FD' }} onLayout={(e) => setAreaH(e.nativeEvent.layout.height)}>
        {areaH ? (
          // El campo va pegado abajo (cerca del botón); si falta alto, se recorta el cielo.
          <Pressable testID="game-field" onPressIn={swing} onPress={swing} unstable_pressDelay={0} style={{ position: 'absolute', left: (winW - W) / 2, top: areaH - st.H, width: W, height: st.H }} accessible={false}>
            <FieldScene st={st} team={RIVAL} pitcher={RIVAL} pitcherUp={windup} batter={avatar} batterPose={pose} batterMood={call ? (bad ? 'think' : 'cheer') : 'happy'} cheering={cheer}>
              {phase === 'pitch' || (phase === 'call' && !flyTo) ? (
                <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: bx }, { translateY: by }, { scale: bs }] }}>
                  <Ball size={BALL_R * 2 * st.s} />
                </Animated.View>
              ) : null}
              {flyTo && (phase === 'call' || phase === 'ready') ? (
                <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateX: fx }, { translateY: fy }, { scale: fs }] }}>
                  <Ball size={BALL_R * 2 * st.s} />
                </Animated.View>
              ) : null}
              {call ? <CallText text={t(`game.${call.c}`)} tip={call.tip ? t(`game.${call.tip}`) : null} big={big} top={st.Y(150)} /> : null}
            </FieldScene>
          </Pressable>
        ) : null}
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <ActionBtn testID="game-swing" label={t('game.swing')} onPress={swing} active={phase === 'pitch'} />
      </View>
    </View>
  );
}
