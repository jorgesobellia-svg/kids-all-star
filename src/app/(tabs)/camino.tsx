import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon, CoinBall, Flame, LockIcon, Mascot, StarIcon, TrophyIcon } from '@/components/Art';
import { tapFeedback } from '@/components/ui';
import { LEVELS } from '@/content/levels';
import { content } from '@/i18n';
import { TEST_MODE } from '@/services/billing';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

// 'open' = abierta en modo revisión (se ve como la actual, pero sin la mascota).
type NodeState = 'done' | 'current' | 'open' | 'locked' | 'plus' | 'soon';

const OFFSETS = [0, 64, 0, -64, 0, 52];

export default function PathScreen() {
  const { p, t, locale } = useStore();
  const insets = useSafeAreaInsets();
  const ct = content(locale);
  const [toast, setToast] = useState<string | null>(null);

  const say = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((m) => (m === msg ? null : m)), 2200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
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
            <View key={lv.n} style={{ marginTop: 6 }}>
              <View style={{ marginHorizontal: 16, backgroundColor: hasAccess ? C.navy : '#334155', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, letterSpacing: 1, color: C.gold }}>{t('path.stage', { n: lv.n })}</Text>
                  <Text style={{ fontFamily: F.display, fontSize: 26, color: C.white }}>{lt.title}</Text>
                </View>
                {!lv.free ? (
                  <View style={{ backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.navy }}>{t('path.plus')}</Text>
                  </View>
                ) : null}
              </View>

              <View style={{ alignItems: 'center', paddingVertical: 18, gap: 18 }}>
                {lv.lessonIds.map((id, i) => {
                  const st = lessonState(i);
                  return (
                    <View key={id} style={{ transform: [{ translateX: OFFSETS[i] }], alignItems: 'center' }}>
                      {st === 'current' ? (
                        <View style={{ backgroundColor: C.white, borderWidth: 2, borderColor: C.line, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 8 }}>
                          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: C.red }}>{t('path.start')}</Text>
                        </View>
                      ) : null}
                      <Node state={st} testID={`node-${id}`} label={(ct.lessonTitles as Record<string, string>)[id]} onPress={press(st, () => router.push({ pathname: '/leccion/[id]', params: { id } }))} />
                      {st === 'current' ? (
                        <View pointerEvents="none" style={{ position: 'absolute', left: OFFSETS[i] > 0 ? -110 : 100, top: 30 }}>
                          <Mascot size={84} />
                        </View>
                      ) : null}
                    </View>
                  );
                })}
                <View style={{ transform: [{ translateX: OFFSETS[5] }], alignItems: 'center', gap: 6 }}>
                  <Node
                    state={examState}
                    exam
                    testID={`exam-${lv.n}`}
                    label={t('path.exam')}
                    onPress={press(examState, () => router.push({ pathname: '/examen/[nivel]', params: { nivel: String(lv.n) } }), true)}
                  />
                  <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.muted }}>{t('path.exam')}</Text>
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

function Node({ state, onPress, exam, label, testID }: { state: NodeState; onPress: () => void; exam?: boolean; label: string; testID?: string }) {
  const size = state === 'current' ? 88 : 72;
  const live = state === 'current' || state === 'open';
  const bg = state === 'done' ? C.red : live ? C.gold : '#E2E8F0';
  const sh = state === 'done' ? C.redDark : live ? C.goldDark : C.lineDark;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        width: exam ? 84 : size,
        height: exam ? 84 : size,
        borderRadius: exam ? 22 : size / 2,
        backgroundColor: exam && state === 'done' ? C.gold : bg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: sh,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        boxShadow: `0 6px 0 ${sh}`,
      } as object}
    >
      {exam ? (
        <TrophyIcon size={40} color={state === 'done' || live ? C.white : C.faint} />
      ) : state === 'done' ? (
        <CheckIcon size={34} />
      ) : live ? (
        <StarIcon size={42} />
      ) : (
        <LockIcon size={28} />
      )}
      {state === 'plus' && !exam ? (
        <View style={{ position: 'absolute', right: -6, top: -6, backgroundColor: C.gold, borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1 }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11, color: C.navy }}>+</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
