import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActivityView, { isCorrect, type Answer } from '@/components/Activity';
import { BadgeMedal, CheckIcon, Mascot, TrophyIcon } from '@/components/Art';
import { Btn, Card, H1, Label, ProgressBar } from '@/components/ui';
import { getLevel, REWARDS } from '@/content/levels';
import type { Activity } from '@/content/types';
import { content } from '@/i18n';
import { submitScore } from '@/services/scoreboard';
import { speak, stopSpeaking } from '@/services/speech';
import { useStore, weekKey } from '@/state/store';
import { C, F } from '@/theme';

type ExamText = Record<string, { q: string; opts?: Record<string, string>; answer?: string }>;

export default function ExamScreen() {
  const { nivel } = useLocalSearchParams<{ nivel: string }>();
  const level = getLevel(Number(nivel));
  const { t, locale, passExam, p } = useStore();
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const W = Math.min(winW, 520) - 40;
  const ct = content(locale);
  const text = (ct.exams as Record<string, ExamText>)[String(nivel)];
  const levelText = (ct.levels as Record<string, { title: string; badge: string }>)[String(nivel)];

  const [phase, setPhase] = useState<'intro' | 'run' | 'done'>('intro');
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  if (!level || !text || level.exam.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Btn label={t('common.back')} onPress={() => router.back()} />
      </View>
    );
  }

  const total = level.exam.length;
  const need = Math.ceil((total * level.passPercent) / 100);
  const q = level.exam[i];
  const qt = text[String(q.n)];
  // El examen usa el mismo componente de actividades que las lecciones.
  const act: Activity = { n: q.n, type: q.type === 'tap' ? 'tap' : q.type, options: q.options, correct: q.correct, scene: 'diamond', target: q.target, seg: 0 };
  const answered = answer !== null;
  const right = answered ? isCorrect(act, answer!) : false;

  const submit = (a: Answer) => {
    if (answered) return;
    setAnswer(a);
    if (isCorrect(act, a)) setScore((s) => s + 1);
    else setWrong((w) => [...w, i]);
  };

  const next = () => {
    stopSpeaking();
    if (i + 1 < total) {
      setI(i + 1);
      setAnswer(null);
      setPicked(null);
      speak(text[String(level.exam[i + 1].n)].q, locale);
    } else {
      setPhase('done');
      if (score >= need) {
        const r = passExam(level.n);
        const wk = weekKey();
        submitScore({
          playerId: p.playerId,
          nickname: p.nickname ?? '',
          country: p.country,
          league: p.league,
          weeklyXp: (p.weekId === wk ? p.weeklyXp : 0) + r.xp,
          totalXp: p.xp + r.xp,
          weekId: wk,
        });
      }
    }
  };

  const restart = () => {
    setI(0);
    setScore(0);
    setWrong([]);
    setAnswer(null);
    setPicked(null);
    setPhase('run');
    speak(text[String(level.exam[0].n)].q, locale);
  };

  // ------------------------------------------------------------ Portada
  if (phase === 'intro') {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24, paddingHorizontal: 20 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.back')} onPress={() => router.back()} style={{ width: 44, height: 44, justifyContent: 'center' }}>
          <Text style={{ fontSize: 28, color: C.muted, fontFamily: F.bodyBold }}>‹</Text>
        </Pressable>
        <ScrollView contentContainerStyle={{ gap: 16, alignItems: 'center' }}>
          <View style={{ width: 120, height: 120, borderRadius: 32, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 0 ${C.goldDark}` } as object}>
            <TrophyIcon size={68} color={C.white} />
          </View>
          <Label>{t('exam.label', { n: level.n })}</Label>
          <H1 style={{ textAlign: 'center' }}>{levelText.title}</H1>
          <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            <Card style={{ flex: 1 }}>
              <Text style={{ fontFamily: F.display, fontSize: 28, color: C.ink }}>{total}</Text>
              <Text style={{ fontFamily: F.bodyBold, fontSize: 14, color: C.muted }}>{t('exam.questions')}</Text>
            </Card>
            <Card style={{ flex: 1 }}>
              <Text style={{ fontFamily: F.display, fontSize: 28, color: C.ink }}>{t('exam.ofN', { a: need, b: total })}</Text>
              <Text style={{ fontFamily: F.bodyBold, fontSize: 14, color: C.muted }}>{t('exam.toPass', { p: level.passPercent })}</Text>
            </Card>
          </View>
          <View style={{ width: '100%', backgroundColor: C.navy, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <BadgeMedal size={48} earned level={level.n} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.white }}>{t('exam.reward')}</Text>
              <Text style={{ fontFamily: F.body, fontSize: 14, color: '#CBD5E1' }}>
                {t('exam.rewardText', { badge: levelText.badge, xp: REWARDS.examXp, coins: REWARDS.examCoins })}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={{ gap: 8 }}>
          <Btn testID="exam-start" label={t('exam.start')} onPress={restart} />
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={{ minHeight: 48, justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.navy, textAlign: 'center' }}>{t('exam.review')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ------------------------------------------------------------ Resultado
  if (phase === 'done') {
    const passed = score >= need;
    const toReview = Array.from(new Set(wrong.map((w) => level.exam[w].lesson)));
    const titles = ct.lessonTitles as Record<string, string>;
    return (
      <View style={{ flex: 1, backgroundColor: C.navy, paddingTop: insets.top + 36, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', gap: 16 }}>
          <Mascot size={130} mood={passed ? 'cheer' : 'think'} />
          <Text testID="exam-result" style={{ fontFamily: F.display, fontSize: 36, color: passed ? C.gold : C.white }}>{passed ? t('exam.passTitle') : t('exam.failTitle')}</Text>
          <Text style={{ fontFamily: F.bodyBold, fontSize: 18, color: '#CBD5E1' }}>{t('exam.score', { a: score, b: total })}</Text>
          {passed ? (
            <View style={{ alignItems: 'center', gap: 10 }}>
              <BadgeMedal size={96} earned level={level.n} />
              <Text style={{ fontFamily: F.bodyHeavy, fontSize: 18, color: C.gold, textAlign: 'center' }}>{t('exam.badgeWon', { badge: levelText.badge })}</Text>
              <Text style={{ fontFamily: F.bodyBold, fontSize: 16, color: C.white }}>
                +{REWARDS.examXp} XP · {t('result.coinsWon', { n: REWARDS.examCoins })}
              </Text>
              <Text style={{ fontFamily: F.body, fontSize: 15, color: '#CBD5E1' }}>{t('exam.nextUnlocked')}</Text>
            </View>
          ) : (
            <View style={{ width: '100%', gap: 10 }}>
              <Text style={{ fontFamily: F.bodyBold, fontSize: 16, color: C.white }}>{t('exam.reviewThese')}</Text>
              {toReview.map((id) => (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  onPress={() => router.replace({ pathname: '/leccion/[id]', params: { id } })}
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 14, minHeight: 48 }}
                >
                  <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.white }}>
                    {id} · {titles[id]}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={{ gap: 8 }}>
          {passed ? null : <Btn label={t('exam.retry')} onPress={restart} />}
          <Btn testID="exam-done" label={t('exam.toPath')} variant={passed ? 'red' : 'ghost'} onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  // ------------------------------------------------------------ Preguntas
  const correctLabel = q.type === 'tap' ? qt.answer : q.type === 'tf' ? (q.correct === 'true' ? t('common.true') : t('common.false')) : qt.opts?.[q.correct ?? ''];

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('lesson.exit')} onPress={() => { stopSpeaking(); router.back(); }} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, color: C.muted, fontFamily: F.bodyBold }}>✕</Text>
        </Pressable>
        <ProgressBar value={(i + (answered ? 1 : 0)) / total} color={C.gold} />
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: C.muted }}>
          {i + 1}/{total}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <Label>{t('exam.label', { n: level.n })}</Label>
        <Text testID="exam-question" style={{ fontFamily: F.display, fontSize: 26, lineHeight: 30, color: C.ink }}>
          {qt.q}
        </Text>
        <ActivityView
          key={i}
          act={act}
          width={W}
          optText={(o) => qt.opts?.[o] ?? o}
          trueLabel={t('common.true')}
          falseLabel={t('common.false')}
          dragHint=""
          retryLabel=""
          locked={answer}
          picked={picked}
          onPick={setPicked}
          onAnswer={submit}
        />
      </ScrollView>
      {answered ? (
        <View testID="exam-feedback" style={{ backgroundColor: right ? C.greenSoft : C.wrongSoft, paddingHorizontal: 22, paddingTop: 16, paddingBottom: insets.bottom + 20, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {right ? (
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
                <CheckIcon size={20} />
              </View>
            ) : null}
            <Text style={{ fontFamily: F.display, fontSize: 26, color: right ? '#166534' : '#991B1B' }}>{right ? t('lesson.right') : t('lesson.almost')}</Text>
          </View>
          {!right && correctLabel ? <Text style={{ fontFamily: F.bodyBold, fontSize: 16, color: '#991B1B' }}>{t('exam.correctWas', { a: correctLabel })}</Text> : null}
          <Btn testID="exam-continue" label={t('common.continue')} variant={right ? 'green' : 'wrong'} onPress={next} />
        </View>
      ) : q.type !== 'tap' ? (
        <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: insets.bottom + 20, borderTopWidth: 2, borderTopColor: C.line }}>
          <Btn testID="exam-check" label={t('common.check')} variant={picked ? 'red' : 'disabled'} onPress={picked ? () => submit({ kind: 'option', id: picked }) : undefined} />
        </View>
      ) : null}
    </View>
  );
}
