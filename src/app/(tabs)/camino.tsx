import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon, CoinBall, Flame, LockIcon, StarIcon, TrophyIcon } from '@/components/Art';
import PelotinBody, { BODY_H, BODY_W } from '@/components/PelotinBody';
import { Crowd, stadiumGeom, StadiumScene, type StadiumGeom } from '@/components/Stadium';
import type { Avatar } from '@/content/shop';
import { tapFeedback } from '@/components/ui';
import { LEVELS, STAGE_SUFFIX, stageOf } from '@/content/levels';
import { gameAfter, type MiniGame } from '@/content/minigames';
import { content } from '@/i18n';
import { takeAdvance, type Advance } from '@/services/advance';
import { TEST_MODE } from '@/services/billing';
import { clearLevelPassed, pauseLevelMusic, startLevelMusicIfPending, stopIntroMusic } from '@/services/music';
import { playSfx, stopSfx } from '@/services/sfx';
import { BUILD_STAMP, TESTERS } from '@/services/testers';
import { speak, stopSpeaking } from '@/services/speech';
import { avatarOf, shopOpen, useStore } from '@/state/store';
import TutorialBubble from '@/components/TutorialBubble';
import { C, F } from '@/theme';

// 'open' = abierta en modo revisión (se ve como la actual, pero sin la mascota).
type NodeState = 'done' | 'current' | 'open' | 'locked' | 'plus' | 'soon';

// Cada nivel es una vuelta al diamante, visto desde detrás del home en un estadio: estrella en el círculo
// de espera (lección 1), primera (2), segunda (3), tercera (4), home para anotar la carrera (5) y el examen
// en el dugout de primera.
type Shape = 'star' | 'base' | 'home';
const shapeOf = (i: number): Shape => (i === 0 ? 'star' : i === 4 ? 'home' : 'base');

export default function PathScreen() {
  useEffect(() => {
    stopIntroMusic();
  }, []);
  // Tras aprobar un examen suena el órgano mientras el jugador mira su avance en el camino.
  // Al volver de una lección: Pelotín corre a la siguiente base (se oyen sus pasos en la tierra).
  const [adv, setAdv] = useState<Advance | null>(null);
  const [advRunning, setAdvRunning] = useState(false);
  useFocusEffect(
    useCallback(() => {
      startLevelMusicIfPending();
      const a = takeAdvance();
      if (a) {
        setAdv(a);
        setAdvRunning(true);
      }
      return () => pauseLevelMusic();
    }, []),
  );
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const levelY = useRef<Record<number, number>>({});
  const scrolled = useRef(false);
  const finishAdvance = useCallback((a: Advance) => {
    stopSfx('steps');
    setAdv(null);
    if (a.next.kind === 'lesson') router.push({ pathname: '/leccion/[id]', params: { id: a.next.id } });
    else router.push({ pathname: '/examen/[nivel]', params: { nivel: String(a.next.level) } });
  }, []);
  const { p, t, locale } = useStore();
  const avatar = avatarOf(p);
  // Tutorial de Mi Pelotín, paso 1: al aprobar el nivel 1 se señala el botón de abajo.
  const showIntro = shopOpen(p) && p.shopIntro !== 'done' && !adv;
  const [focused, setFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );
  useEffect(() => {
    if (!showIntro || !focused) return;
    const tm = setTimeout(() => speak(t('shop.tut1'), locale), 600);
    return () => {
      clearTimeout(tm);
      stopSpeaking();
    };
  }, [showIntro, focused, t, locale]);
  const insets = useSafeAreaInsets();
  const ct = content(locale);
  const [toast, setToast] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const W = Math.min(width, 600);
  const G = useMemo(() => stadiumGeom(W), [W]);
  // Nivel en curso: el primero cuyo examen no se ha aprobado. Ahí el camino saluda al jugador por su nombre.
  const curLevel = (LEVELS.find((l) => !p.examsPassed[String(l.n)]) ?? LEVELS[LEVELS.length - 1]).n;

  const say = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((m) => (m === msg ? null : m)), 2200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.grass }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: 8, backgroundColor: C.bg, borderBottomWidth: 3, borderBottomColor: '#2F7D33', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} accessibilityLabel={t('path.streakA11y', { n: p.streak.count })}>
          <Flame size={26} />
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 18, color: '#C2410C' }}>{p.streak.count}</Text>
        </View>
        {TESTERS ? (
          <View style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.white }}>{t('path.testers')}{BUILD_STAMP ? ' · ' + BUILD_STAMP : ''}</Text>
          </View>
        ) : p.plus ? (
          <View style={{ backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.navy }}>{t('path.plus')}</Text>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} accessibilityLabel={t('path.coinsA11y', { n: p.coins })}>
          <CoinBall size={24} />
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 18, color: C.ink }}>{p.coins}</Text>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {LEVELS.map((lv) => {
          const lt = (ct.levels as Record<string, { title: string; badge: string }>)[String(lv.n)];
          const unlockedByProgress = lv.n === 1 || !!p.examsPassed[String(lv.n - 1)];
          const review = !!p.review && TEST_MODE;
          // Versión de prueba: sin pedir suscripción, pero los niveles se van abriendo en orden como en la app real.
          const hasAccess = lv.free || p.plus || review || TESTERS;
          const built = lv.lessons.length > 0;
          const firstOpen = lv.lessonIds.findIndex((id) => !p.completed[id]);
          const allDone = firstOpen === -1;

          const lessonState = (i: number): NodeState => {
            const id = lv.lessonIds[i];
            if (!hasAccess) return 'plus';
            if (!built) return 'soon';
            if (p.completed[id]) return 'done';
            if (review) return unlockedByProgress && i === firstOpen ? 'current' : 'open';
            if (!unlockedByProgress) return 'locked';
            return i === firstOpen ? 'current' : 'locked';
          };
          const examState: NodeState = !hasAccess
            ? 'plus'
            : !built
              ? 'soon'
              : p.examsPassed[String(lv.n)]
                ? 'done'
                : allDone && unlockedByProgress
                  ? 'current'
                  : review
                    ? 'open'
                    : 'locked';

          const press = (st: NodeState, go: () => void, isExam = false) => () => {
            tapFeedback();
            if (st === 'plus') router.push('/papas');
            else if (st === 'soon') say(t('path.comingSoon'));
            else if (adv) return;
            else if (st === 'locked') {
              if (isExam) say(t('path.lockedExam'));
            } else {
              clearLevelPassed();
              go();
            }
          };

          return (
            <View
              key={lv.n}
              style={{ marginTop: 26 }}
              onLayout={(e) => {
                levelY.current[lv.n] = e.nativeEvent.layout.y;
                // Al abrir el camino se muestra el nivel en curso (o el del avance de Pelotín).
                if (adv?.level === lv.n || (!scrolled.current && !adv && lv.n === curLevel && lv.n > 1)) {
                  scrolled.current = true;
                  scrollRef.current?.scrollTo({ y: Math.max(0, e.nativeEvent.layout.y - 10), animated: false });
                }
              }}
            >
              <View style={{ marginHorizontal: 16, backgroundColor: hasAccess ? C.navy : '#334155', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, letterSpacing: 1, color: C.gold }}>{t(`path.stage${STAGE_SUFFIX[stageOf(lv.n)]}`, { n: lv.n })}</Text>
                  {curLevel === lv.n && (p.nickname ?? '').trim() ? (
                    <Text style={{ fontFamily: F.display, fontSize: 20, color: C.white }}>{t('path.hello', { name: (p.nickname ?? '').trim() })}</Text>
                  ) : null}
                  <Text style={{ fontFamily: F.display, fontSize: 26, color: C.white }}>{lt.title}</Text>
                </View>
                {!lv.free && !TESTERS ? (
                  <View style={{ backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.navy }}>{t('path.plus')}</Text>
                  </View>
                ) : null}
              </View>

              <View style={{ height: G.H, width: W, alignSelf: 'center', overflow: 'hidden', marginTop: 10 }}>
                <StadiumScene g={G} />
                <Crowd g={G} seed={lv.n} cheering={adv?.level === lv.n && advRunning} />
                {lv.lessonIds.map((id, i) => {
                  const st = lessonState(i);
                  const q = G.nodes[i];
                  const left = q.x > W * 0.62;
                  const mh = Math.round(84 * q.s);
                  return (
                    <View key={id} style={{ position: 'absolute', left: q.x - 60, top: q.y - 60, width: 120, height: 120, alignItems: 'center', justifyContent: 'center', zIndex: st === 'current' ? 3 : 1 }}>
                      {st === 'current' && adv?.level !== lv.n ? (
                        <View style={{ position: 'absolute', top: -6, backgroundColor: C.white, borderWidth: 2, borderColor: C.line, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 3, zIndex: 2 }}>
                          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: C.red }}>{t('path.start')}</Text>
                        </View>
                      ) : null}
                      <Node state={st} shape={shapeOf(i)} scale={Math.max(0.68, q.s)} testID={`node-${id}`} label={(ct.lessonTitles as Record<string, string>)[id]} onPress={press(st, () => router.push({ pathname: '/leccion/[id]', params: { id } }))} />
                      {st === 'current' && adv?.level !== lv.n ? (
                        <View pointerEvents="none" testID="path-pelotin" style={{ position: 'absolute', left: left ? 34 - mh * 0.95 : 86, top: 60 + 18 * q.s - mh }}>
                          <PelotinBody avatar={avatar} height={mh} />
                        </View>
                      ) : null}
                    </View>
                  );
                })}
                {adv?.level === lv.n ? <Runner key={`${adv.level}-${adv.from}-${adv.to}`} G={G} a={adv} avatar={avatar} onArrive={() => setAdvRunning(false)} onDone={finishAdvance} /> : null}
                <View style={{ position: 'absolute', left: G.nodes[5].x - 60, top: G.nodes[5].y - 60, width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                  <Node
                    state={examState}
                    exam
                    scale={0.9}
                    testID={`exam-${lv.n}`}
                    label={t('path.exam')}
                    onPress={press(examState, () => router.push({ pathname: '/examen/[nivel]', params: { nivel: String(lv.n) } }), true)}
                  />
                  <View style={{ position: 'absolute', bottom: -2, backgroundColor: 'rgba(12,35,64,0.85)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2 }}>
                    <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.white }}>{t('path.exam')}</Text>
                  </View>
                </View>
              </View>
              {gameAfter(lv.n) ? <GameCard game={gameAfter(lv.n)!} open={!!p.examsPassed[String(lv.n)] || review} best={p.games?.[gameAfter(lv.n)!.id]?.best ?? 0} /> : null}
            </View>
          );
        })}
      </ScrollView>

      {showIntro ? <ShopIntro text={t('shop.tut1')} width={width} /> : null}

      {toast ? (
        <View pointerEvents="none" style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: C.navy, borderRadius: 14, padding: 14 }}>
          <Text style={{ color: C.white, fontFamily: F.bodyBold, fontSize: 15, textAlign: 'center' }}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}

// Tarjeta del minijuego que se abre al aprobar el examen del nivel anterior.
function GameCard({ game, open, best }: { game: MiniGame; open: boolean; best: number }) {
  const { t } = useStore();
  return (
    <Pressable
      testID={`game-card-${game.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${t('game.label')}: ${t(game.title)}`}
      onPress={() => {
        tapFeedback();
        if (open) {
          clearLevelPassed();
          router.push(`/juego/${game.id}` as never);
        }
      }}
      style={{ marginHorizontal: 16, marginTop: 14, backgroundColor: open ? C.gold : '#E2E8F0', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, boxShadow: `0 6px 0 ${open ? C.goldDark : C.lineDark}` } as object}
    >
      <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: open ? C.navy : '#CBD5E1', alignItems: 'center', justifyContent: 'center' }}>
        {open ? (
          <Svg width={34} height={34} viewBox="0 0 34 34">
            <Polygon points="6,30 9,27 27,7 30,4 32,6 29,9 11,29 8,32" fill="#C9813E" stroke="#7C4A1E" strokeWidth={1.5} strokeLinejoin="round" />
          </Svg>
        ) : (
          <LockIcon size={26} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 12, letterSpacing: 1.2, color: open ? C.navy : C.muted }}>{t('game.label')}</Text>
        <Text style={{ fontFamily: F.display, fontSize: 26, color: open ? C.navy : C.muted }}>{t(game.title)}</Text>
        <Text style={{ fontFamily: F.bodyBold, fontSize: 14, color: open ? C.navy : C.muted }}>{open ? (best ? t(game.best, { n: best }) : t('game.play')) : t('game.locked', { n: game.after })}</Text>
      </View>
    </Pressable>
  );
}

// Pelotín corre de base en base por el recorrido del estadio. Se ve de espaldas cuando corre
// hacia el fondo y de frente cuando viene hacia el home, y se agranda al acercarse.
const RUN_H = 84;
const RUN_W = (RUN_H * BODY_W) / BODY_H;

function Runner({ G, a, avatar, onArrive, onDone }: { G: StadiumGeom; a: Advance; avatar: Avatar; onArrive: () => void; onDone: (a: Advance) => void }) {
  const pts = G.route.slice(G.nodeAt[a.from], G.nodeAt[a.to] + 1);
  const n = pts.length - 1;
  const range = pts.map((_, i) => i);
  const [t] = useState(() => new Animated.Value(0));
  const [hop] = useState(() => new Animated.Value(0));
  const [seg, setSeg] = useState(0);
  const [frame, setFrame] = useState<0 | 1>(0);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    let alive = true;
    const sub = t.addListener(({ value }) => setSeg(Math.min(n - 1, Math.floor(value))));
    const legs = setInterval(() => setFrame((f) => (f ? 0 : 1)), 150);
    const run = Animated.timing(t, { toValue: n, duration: 850 * n, easing: Easing.inOut(Easing.quad), useNativeDriver: true });
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(hop, { toValue: -6, duration: 150, useNativeDriver: true }),
        Animated.timing(hop, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]),
    );
    const arrive = () => {
      if (!alive) return;
      clearInterval(legs);
      bounce.stop();
      hop.setValue(0);
      stopSfx('steps');
      setRunning(false);
      onArrive();
      // Llega a la base: celebra un momento y entra.
      setTimeout(() => alive && onDone(a), 1000);
    };
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((still) => {
        if (!alive) return;
        if (still) {
          t.setValue(n);
          arrive();
          return;
        }
        playSfx('steps');
        bounce.start();
        run.start(arrive);
      });
    return () => {
      alive = false;
      t.removeListener(sub);
      clearInterval(legs);
      run.stop();
      bounce.stop();
    };
    // Se anima una sola vez por avance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tx = t.interpolate({ inputRange: range, outputRange: pts.map((q) => q.x - RUN_W / 2) });
  const ty = t.interpolate({ inputRange: range, outputRange: pts.map((q) => q.y - (RUN_H / 2) * (1 + q.s) + 4) });
  const sc = t.interpolate({ inputRange: range, outputRange: pts.map((q) => q.s) });
  const goingAway = pts[seg + 1] ? pts[seg + 1].y < pts[seg].y - 1 : false;
  return (
    <Animated.View
      testID="runner"
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, top: 0, zIndex: 5, transform: [{ translateX: tx }, { translateY: Animated.add(ty, hop) }, { scale: sc }] }}
    >
      <PelotinBody avatar={avatar} height={RUN_H} view={running && goingAway ? 'back' : 'front'} pose={running ? 'run' : 'stand'} frame={frame} face={{ mood: 'cheer' }} />
    </Animated.View>
  );
}

// Oscurece el mapa y señala con una flecha el botón "Mi Pelotín" de la barra de abajo
// (cuarto de cinco botones).
function ShopIntro({ text, width }: { text: string; width: number }) {
  const [bob] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 10, duration: 420, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
    );
    a.start();
    return () => a.stop();
  }, [bob]);
  const tabX = (3.5 * width) / 5;
  return (
    <Pressable
      testID="shop-intro"
      accessibilityRole="button"
      accessibilityLabel={text}
      onPress={() => router.navigate('/pelotin')}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(2,11,24,0.72)', justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 6 }}
    >
      <TutorialBubble text={text} />
      <Animated.View style={{ marginLeft: tabX - 16 - 18, marginTop: 8, transform: [{ translateY: bob }] }}>
        <Svg width={36} height={44} viewBox="0 0 36 44">
          <Polygon points="10,0 26,0 26,24 36,24 18,44 0,24 10,24" fill={C.gold} stroke={C.white} strokeWidth={3} strokeLinejoin="round" />
        </Svg>
      </Animated.View>
    </Pressable>
  );
}

const SHAPES: Record<Shape, (s: number) => string> = {
  star: (s) =>
    Array.from({ length: 10 }, (_, k) => {
      const r = k % 2 ? s * 0.24 : s * 0.5;
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      return `${s / 2 + r * Math.cos(a)},${s * 0.54 + r * Math.sin(a)}`;
    }).join(' '),
  base: (s) => `${s / 2},2 ${s - 2},${s / 2} ${s / 2},${s - 2} 2,${s / 2}`,
  home: (s) => `${s * 0.1},${s * 0.12} ${s * 0.9},${s * 0.12} ${s * 0.9},${s * 0.55} ${s / 2},${s * 0.92} ${s * 0.1},${s * 0.55}`,
};

function Node({ state, onPress, exam, shape = 'star', label, testID, scale = 1 }: { state: NodeState; onPress: () => void; exam?: boolean; shape?: Shape; label: string; testID?: string; scale?: number }) {
  const live = state === 'current' || state === 'open';
  const bg = state === 'done' ? C.red : live ? C.gold : '#F8FAFC';
  const sh = state === 'done' ? C.redDark : live ? C.goldDark : '#94A3B8';
  if (exam) {
    return (
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={{ width: 62 * scale, height: 62 * scale, borderRadius: 16 * scale, backgroundColor: state === 'done' ? C.gold : live ? C.gold : '#E2E8F0', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 0 ${state === 'done' ? C.goldDark : live ? C.goldDark : C.lineDark}` } as object}
      >
        <TrophyIcon size={36 * scale} color={state === 'done' || live ? C.white : C.faint} />
      </Pressable>
    );
  }
  const size = (state === 'current' ? 76 : 66) * (shape === 'base' ? 1.15 : 1) * scale;
  const pts = SHAPES[shape](size);
  // Las bases y el home están acostados en el suelo: en perspectiva se ven aplastados.
  const flat = shape === 'star' ? 1 : 0.6;
  const h = size * flat;
  const iconTop = shape === 'star' ? size * 0.05 : 0;
  const ic = scale * (shape === 'star' ? 1 : 0.85);
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ width: size, height: h + 6, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={h + 6} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Polygon points={pts} fill={sh} transform={`translate(0,6) scale(1,${flat})`} strokeLinejoin="round" stroke={sh} strokeWidth={3} />
        <Polygon points={pts} fill={bg} transform={`scale(1,${flat})`} stroke={state === 'done' || live ? 'rgba(255,255,255,0.55)' : '#CBD5E1'} strokeWidth={3} strokeLinejoin="round" />
      </Svg>
      <View style={{ marginTop: iconTop - 6 }}>
        {state === 'done' ? <CheckIcon size={(shape === 'star' ? 26 : 30) * ic} /> : live ? (shape === 'star' ? null : <StarIcon size={30 * ic} />) : <LockIcon size={(shape === 'star' ? 20 : 24) * ic} />}
      </View>
      {state === 'plus' ? (
        <View style={{ position: 'absolute', right: 0, top: 0, backgroundColor: C.gold, borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1 }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11, color: C.navy }}>+</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
