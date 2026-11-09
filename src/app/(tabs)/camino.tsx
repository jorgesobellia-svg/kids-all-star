import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Polygon, Polyline, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon, CoinBall, Flame, LockIcon, Mascot, StarIcon, TrophyIcon } from '@/components/Art';
import { tapFeedback } from '@/components/ui';
import { LEVELS, STAGE_SUFFIX, stageOf } from '@/content/levels';
import { content } from '@/i18n';
import { TEST_MODE } from '@/services/billing';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

// 'open' = abierta en modo revisión (se ve como la actual, pero sin la mascota).
type NodeState = 'done' | 'current' | 'open' | 'locked' | 'plus' | 'soon';

const OFFSETS = [0, 64, 0, -64, 0, 52];
// Cada fila del camino mide lo mismo para poder dibujar el camino de tierra entre las bases.
const ROW = 128;
const PAD = 18;
// Lección 1 = estrella; lecciones 2-4 = primera, segunda y tercera base; lección 5 = home (anotar la carrera).
type Shape = 'star' | 'base' | 'home';
const shapeOf = (i: number): Shape => (i === 0 ? 'star' : i === 4 ? 'home' : 'base');

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
  const { p, t, locale } = useStore();
  const insets = useSafeAreaInsets();
  const ct = content(locale);
  const [toast, setToast] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const W = Math.min(width, 600);

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
        {p.plus ? (
          <View style={{ backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.navy }}>{t('path.plus')}</Text>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} accessibilityLabel={t('path.coinsA11y', { n: p.coins })}>
          <CoinBall size={24} />
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 18, color: C.ink }}>{p.coins}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <Grass height={LEVELS.length * (6 * ROW + 2 * PAD + 120) + 200} width={width} />
        {LEVELS.map((lv) => {
          const lt = (ct.levels as Record<string, { title: string; badge: string }>)[String(lv.n)];
          const unlockedByProgress = lv.n === 1 || !!p.examsPassed[String(lv.n - 1)];
          const review = !!p.review && TEST_MODE;
          const hasAccess = lv.free || p.plus || review;
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
            else if (st === 'locked') {
              if (isExam) say(t('path.lockedExam'));
            } else go();
          };

          return (
            <View key={lv.n} style={{ marginTop: 14 }}>
              <View style={{ marginHorizontal: 16, backgroundColor: hasAccess ? C.navy : '#334155', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, letterSpacing: 1, color: C.gold }}>{t(`path.stage${STAGE_SUFFIX[stageOf(lv.n)]}`, { n: lv.n })}</Text>
                  <Text style={{ fontFamily: F.display, fontSize: 26, color: C.white }}>{lt.title}</Text>
                </View>
                {!lv.free ? (
                  <View style={{ backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.navy }}>{t('path.plus')}</Text>
                  </View>
                ) : null}
              </View>

              <View style={{ alignItems: 'center', height: 6 * ROW + 2 * PAD }}>
                <Svg pointerEvents="none" width={W} height={6 * ROW + 2 * PAD} style={{ position: 'absolute', top: 0 }}>
                  {/* Camino de tierra que une las bases, con borde más oscuro */}
                  <Polyline points={OFFSETS.map((o, i) => `${W / 2 + o},${PAD + ROW * i + ROW / 2}`).join(' ')} fill="none" stroke="#A86F3C" strokeWidth={30} strokeLinejoin="round" strokeLinecap="round" />
                  <Polyline points={OFFSETS.map((o, i) => `${W / 2 + o},${PAD + ROW * i + ROW / 2}`).join(' ')} fill="none" stroke="#C98B4F" strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" />
                </Svg>
                <View style={{ height: PAD }} />
                {lv.lessonIds.map((id, i) => {
                  const st = lessonState(i);
                  return (
                    <View key={id} style={{ height: ROW, justifyContent: 'center', transform: [{ translateX: OFFSETS[i] }], alignItems: 'center' }}>
                      {st === 'current' ? (
                        <View style={{ position: 'absolute', top: -14, backgroundColor: C.white, borderWidth: 2, borderColor: C.line, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4, zIndex: 2 }}>
                          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: C.red }}>{t('path.start')}</Text>
                        </View>
                      ) : null}
                      <Node state={st} shape={shapeOf(i)} testID={`node-${id}`} label={(ct.lessonTitles as Record<string, string>)[id]} onPress={press(st, () => router.push({ pathname: '/leccion/[id]', params: { id } }))} />
                      {st === 'current' ? (
                        <View pointerEvents="none" style={{ position: 'absolute', left: OFFSETS[i] > 0 ? -110 : 100, top: 34 }}>
                          <Mascot size={84} />
                        </View>
                      ) : null}
                    </View>
                  );
                })}
                <View style={{ height: ROW, justifyContent: 'center', transform: [{ translateX: OFFSETS[5] }], alignItems: 'center' }}>
                  <Node
                    state={examState}
                    exam
                    testID={`exam-${lv.n}`}
                    label={t('path.exam')}
                    onPress={press(examState, () => router.push({ pathname: '/examen/[nivel]', params: { nivel: String(lv.n) } }), true)}
                  />
                  <View style={{ position: 'absolute', bottom: -4, backgroundColor: 'rgba(12,35,64,0.75)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2 }}>
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
        style={{ width: 84, height: 84, borderRadius: 22, backgroundColor: state === 'done' ? C.gold : live ? C.gold : '#E2E8F0', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 0 ${state === 'done' ? C.goldDark : live ? C.goldDark : C.lineDark}` } as object}
      >
        <TrophyIcon size={40} color={state === 'done' || live ? C.white : C.faint} />
      </Pressable>
    );
  }
  const size = (state === 'current' ? 96 : 84) * (shape === 'base' ? 1.1 : 1);
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
