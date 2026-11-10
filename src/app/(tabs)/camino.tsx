import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Polyline, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon, CoinBall, Flame, LockIcon, Mascot, StarIcon, TrophyIcon } from '@/components/Art';
import { tapFeedback } from '@/components/ui';
import { LEVELS, STAGE_SUFFIX, stageOf } from '@/content/levels';
import { content } from '@/i18n';
import { takeAdvance, type Advance } from '@/services/advance';
import { TEST_MODE } from '@/services/billing';
import { clearLevelPassed, pauseLevelMusic, startLevelMusicIfPending, stopIntroMusic } from '@/services/music';
import { playSfx, stopSfx } from '@/services/sfx';
import { BUILD_STAMP, TESTERS } from '@/services/testers';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

// 'open' = abierta en modo revisión (se ve como la actual, pero sin la mascota).
type NodeState = 'done' | 'current' | 'open' | 'locked' | 'plus' | 'soon';

// Cada nivel es una vuelta al diamante: estrella en el círculo de espera (lección 1), primera (2), segunda (3),
// tercera (4), home para anotar la carrera (5) y el examen en el dugout.
type Shape = 'star' | 'base' | 'home';
const shapeOf = (i: number): Shape => (i === 0 ? 'star' : i === 4 ? 'home' : 'base');

function fieldGeom(W: number) {
  // El "diamante" es un cuadrado girado: los cuatro lados iguales. Su tamaño se ajusta para que las líneas
  // de foul (a 45°) suban casi hasta el título del nivel.
  const dx = Math.min(W * 0.21, 92);
  const dy = dx;
  const d = dy;
  const cx = W / 2;
  const home = { x: cx, y: 2 * dy + 64 };
  const H = home.y + 100;
  const first = { x: cx + dx, y: home.y - dy };
  const second = { x: cx, y: home.y - 2 * dy };
  const third = { x: cx - dx, y: home.y - dy };
  const onDeck = { x: cx - dx * 1.25, y: home.y + 40 };
  const dugout = { x: cx + dx * 1.25, y: home.y + 42 };
  const slope = dy / dx;
  // Orden de los nodos: lecciones 1-5 y examen.
  return { d, H, cx, slope, home, first, second, third, onDeck, dugout, nodes: [onDeck, first, second, third, home, dugout] };
}

// Fondo de pasto con franjas de corte, como un campo de béisbol.
function Grass({ height, width }: { height: number; width: number }) {
  const stripes = Math.ceil(height / 56);
  return (
    <Svg pointerEvents="none" width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Rect x={0} y={0} width={width} height={height} fill={C.grass} />
      {Array.from({ length: stripes }, (_, k) => (k % 2 ? <Rect key={k} x={0} y={k * 56} width={width} height={56} fill="#48A64C" /> : null))}
    </Svg>
  );
}

export default function PathScreen() {
  useEffect(() => {
    stopIntroMusic();
  }, []);
  // Tras aprobar un examen suena el órgano mientras el jugador mira su avance en el camino.
  // Al volver de una lección: Pelotín corre a la siguiente base (se oyen sus pasos en la tierra).
  const [adv, setAdv] = useState<Advance | null>(null);
  useFocusEffect(
    useCallback(() => {
      startLevelMusicIfPending();
      const a = takeAdvance();
      if (a) setAdv(a);
      return () => pauseLevelMusic();
    }, []),
  );
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const levelY = useRef<Record<number, number>>({});
  const finishAdvance = useCallback((a: Advance) => {
    stopSfx('steps');
    setAdv(null);
    if (a.next.kind === 'lesson') router.push({ pathname: '/leccion/[id]', params: { id: a.next.id } });
    else router.push({ pathname: '/examen/[nivel]', params: { nivel: String(a.next.level) } });
  }, []);
  const { p, t, locale } = useStore();
  const insets = useSafeAreaInsets();
  const ct = content(locale);
  const [toast, setToast] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const W = Math.min(width, 600);
  const G = fieldGeom(W);
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
        <Grass height={LEVELS.length * (G.H + 110) + 200} width={width} />
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
                if (adv?.level === lv.n) scrollRef.current?.scrollTo({ y: Math.max(0, e.nativeEvent.layout.y - 10), animated: false });
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

              <View style={{ height: G.H, width: W, alignSelf: 'center' }}>
                <Svg pointerEvents="none" width={W} height={G.H} style={{ position: 'absolute', top: 0, left: 0 }}>
                  {/* Diamante visto desde arriba: tierra del cuadro, pasto interior, líneas de foul hasta el borde y montículo */}
                  <Polygon points={`${G.home.x},${G.home.y + 32} ${G.first.x + 32},${G.first.y} ${G.second.x},${G.second.y - 32} ${G.third.x - 32},${G.third.y}`} fill="#C98B4F" stroke="#A86F3C" strokeWidth={3} strokeLinejoin="round" />
                  <Polygon points={`${G.home.x},${G.home.y - 26} ${G.first.x - 26},${G.first.y} ${G.second.x},${G.second.y + 26} ${G.third.x + 26},${G.third.y}`} fill="#48A64C" />
                  <Line x1={G.home.x} y1={G.home.y} x2={G.home.x + (G.home.y + 14) / G.slope} y2={-14} stroke="#FFFFFF" strokeWidth={3} opacity={0.85} />
                  <Line x1={G.home.x} y1={G.home.y} x2={G.home.x - (G.home.y + 14) / G.slope} y2={-14} stroke="#FFFFFF" strokeWidth={3} opacity={0.85} />
                  <Circle cx={G.cx} cy={G.home.y - G.d} r={14} fill="#C98B4F" stroke="#A86F3C" strokeWidth={2} />
                  <Rect x={G.cx - 7} y={G.home.y - G.d - 2} width={14} height={4} fill="#FFFFFF" />
                  {/* Círculo de espera y dugout */}
                  <Circle cx={G.onDeck.x} cy={G.onDeck.y} r={40} fill="#C98B4F" stroke="#FFFFFF" strokeWidth={3} opacity={0.95} />
                  <Rect x={G.dugout.x - 50} y={G.dugout.y - 38} width={100} height={76} rx={14} fill="#1E3A5F" stroke="#0C2340" strokeWidth={3} />
                  <Rect x={G.dugout.x - 50} y={G.dugout.y - 38} width={100} height={14} rx={7} fill="#0C2340" />
                  {/* Recorrido del corredor: de la espera a home y la vuelta completa, luego al dugout */}
                  <Polyline
                    points={[G.onDeck, G.home, G.first, G.second, G.third, G.home, G.dugout].map((q) => `${q.x},${q.y}`).join(' ')}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={4}
                    strokeDasharray="2 10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.9}
                  />
                </Svg>
                {lv.lessonIds.map((id, i) => {
                  const st = lessonState(i);
                  const q = G.nodes[i];
                  const right = q.x >= G.cx;
                  return (
                    <View key={id} style={{ position: 'absolute', left: q.x - 60, top: q.y - 60, width: 120, height: 120, alignItems: 'center', justifyContent: 'center', zIndex: st === 'current' ? 3 : 1 }}>
                      {st === 'current' && adv?.level !== lv.n ? (
                        <View style={{ position: 'absolute', top: -6, backgroundColor: C.white, borderWidth: 2, borderColor: C.line, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 3, zIndex: 2 }}>
                          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: C.red }}>{t('path.start')}</Text>
                        </View>
                      ) : null}
                      <Node state={st} shape={shapeOf(i)} testID={`node-${id}`} label={(ct.lessonTitles as Record<string, string>)[id]} onPress={press(st, () => router.push({ pathname: '/leccion/[id]', params: { id } }))} />
                      {st === 'current' && adv?.level !== lv.n ? (
                        <View pointerEvents="none" style={{ position: 'absolute', left: right && i !== 4 ? 96 : i === 4 ? 100 : -46, top: i === 4 ? -24 : 40 }}>
                          <Mascot size={68} />
                        </View>
                      ) : null}
                    </View>
                  );
                })}
                {adv?.level === lv.n ? <Runner key={`${adv.level}-${adv.from}-${adv.to}`} G={G} a={adv} onDone={finishAdvance} /> : null}
                <View style={{ position: 'absolute', left: G.dugout.x - 60, top: G.dugout.y - 60, width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                  <Node
                    state={examState}
                    exam
                    testID={`exam-${lv.n}`}
                    label={t('path.exam')}
                    onPress={press(examState, () => router.push({ pathname: '/examen/[nivel]', params: { nivel: String(lv.n) } }), true)}
                  />
                  <View style={{ position: 'absolute', bottom: -2, backgroundColor: 'rgba(12,35,64,0.85)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2 }}>
                    <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.white }}>{t('path.exam')}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {toast ? (
        <View pointerEvents="none" style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: C.navy, borderRadius: 14, padding: 14 }}>
          <Text style={{ color: C.white, fontFamily: F.bodyBold, fontSize: 15, textAlign: 'center' }}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}

// Recorrido del corredor en el diamante y el punto de cada nodo dentro de él.
// Nodos: 0 estrella, 1 primera, 2 segunda, 3 tercera, 4 home, 5 dugout (examen).
const NODE_AT = [0, 2, 3, 4, 5, 6];
const MASCOT = 68;

function Runner({ G, a, onDone }: { G: ReturnType<typeof fieldGeom>; a: Advance; onDone: (a: Advance) => void }) {
  const route = [G.onDeck, G.home, G.first, G.second, G.third, G.home, G.dugout];
  const pts = route.slice(NODE_AT[a.from], NODE_AT[a.to] + 1);
  const at = (q: { x: number; y: number }) => ({ x: q.x - MASCOT / 2, y: q.y - MASCOT - 6 });
  const [pos] = useState(() => new Animated.ValueXY(at(pts[0])));
  const [hop] = useState(() => new Animated.Value(0));
  useEffect(() => {
    let alive = true;
    const run = Animated.sequence(pts.slice(1).map((q) => Animated.timing(pos, { toValue: at(q), duration: 750, easing: Easing.inOut(Easing.quad), useNativeDriver: true })));
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(hop, { toValue: -10, duration: 160, useNativeDriver: true }),
        Animated.timing(hop, { toValue: 0, duration: 160, useNativeDriver: true }),
      ]),
    );
    const go = (still: boolean) => {
      if (!alive) return;
      if (still) pos.setValue(at(pts[pts.length - 1]));
      else {
        bounce.start();
        playSfx('steps');
      }
      (still ? Animated.delay(400) : run).start(() => {
        if (!alive) return;
        // Llega a la base: se callan los pasos, celebra un momento y entra.
        stopSfx('steps');
        bounce.stop();
        hop.setValue(0);
        setTimeout(() => alive && onDone(a), 1000);
      });
    };
    AccessibilityInfo.isReduceMotionEnabled()
      .then(go)
      .catch(() => go(false));
    return () => {
      alive = false;
      run.stop();
      bounce.stop();
    };
    // Se anima una sola vez por avance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Animated.View testID="runner" pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, zIndex: 5, transform: [{ translateX: pos.x }, { translateY: Animated.add(pos.y, hop) }] }}>
      <Mascot size={MASCOT} mood="cheer" />
    </Animated.View>
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

function Node({ state, onPress, exam, shape = 'star', label, testID }: { state: NodeState; onPress: () => void; exam?: boolean; shape?: Shape; label: string; testID?: string }) {
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
        style={{ width: 70, height: 70, borderRadius: 18, backgroundColor: state === 'done' ? C.gold : live ? C.gold : '#E2E8F0', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 0 ${state === 'done' ? C.goldDark : live ? C.goldDark : C.lineDark}` } as object}
      >
        <TrophyIcon size={40} color={state === 'done' || live ? C.white : C.faint} />
      </Pressable>
    );
  }
  const size = (state === 'current' ? 76 : 66) * (shape === 'base' ? 1.1 : 1);
  const pts = SHAPES[shape](size);
  const iconTop = shape === 'home' ? -size * 0.08 : shape === 'star' ? size * 0.05 : 0;
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ width: size, height: size + 6, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size + 6} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Polygon points={pts} fill={sh} transform="translate(0,6)" strokeLinejoin="round" stroke={sh} strokeWidth={3} />
        <Polygon points={pts} fill={bg} stroke={state === 'done' || live ? 'rgba(255,255,255,0.55)' : '#CBD5E1'} strokeWidth={3} strokeLinejoin="round" />
      </Svg>
      <View style={{ marginTop: iconTop - 6 }}>
        {state === 'done' ? <CheckIcon size={shape === 'star' ? 26 : 32} /> : live ? (shape === 'star' ? null : <StarIcon size={34} />) : <LockIcon size={shape === 'star' ? 20 : 26} />}
      </View>
      {state === 'plus' ? (
        <View style={{ position: 'absolute', right: 0, top: 0, backgroundColor: C.gold, borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1 }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11, color: C.navy }}>+</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
