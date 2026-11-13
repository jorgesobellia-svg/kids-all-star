import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActivityView, { isCorrect, type Answer } from '@/components/Activity';
import { BadgeMedal, CheckIcon, Mascot, TrophyIcon } from '@/components/Art';
import Pelotin from '@/components/Pelotin';
import { Btn, Card, H1, Label, ProgressBar } from '@/components/ui';
import { getLevel, LEVELS, REWARDS, STAGE_END, STAGE_SUFFIX } from '@/content/levels';
import { gameAfter } from '@/content/minigames';
import type { Activity } from '@/content/types';
import { content } from '@/i18n';
import { markLevelPassed, startGradMusic, startLevelMusicIfPending } from '@/services/music';
import { submitScore } from '@/services/scoreboard';
import { speak, stopSpeaking, umpireCall } from '@/services/speech';
import { useStore, weekKey } from '@/state/store';
import { C, F } from '@/theme';

const LAST_LEVEL = LEVELS[LEVELS.length - 1].n;

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
  // ¿Ya terminó Pelotín de decir la respuesta correcta?
  const [heard, setHeard] = useState(true);
  const heardToken = useRef(0);
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
  // Cada fallo es un out. Con los outs que ya no dejan aprobar (3 en un examen de 12), se acaba el examen.
  const maxOuts = total - need + 1;
  const outs = wrong.length;
  const q = level.exam[i];
  const qt = text[String(q.n)];
  // El examen usa el mismo componente de actividades que las lecciones.
  // Se guarda la misma actividad por pregunta para que las opciones no se vuelvan a barajar al contestar.
  const act = examAct(q);
  const answered = answer !== null;
  const right = answered ? isCorrect(act, answer!) : false;

  const submit = (a: Answer) => {
    if (answered) return;
    setAnswer(a);
    const tok = ++heardToken.current;
    if (isCorrect(act, a)) {
      setHeard(true);
      umpireCall('safe', locale);
      setScore((s) => s + 1);
    } else {
      // Pelotín dice la respuesta correcta en voz alta (como en las lecciones) y
      // "Continuar" espera a que termine, para los niños que todavía no leen bien.
      setHeard(false);
      const label = q.type === 'tap' ? qt.answer : q.type === 'tf' ? (q.correct === 'true' ? t('common.true') : t('common.false')) : qt.opts?.[q.correct ?? ''];
      const msg = label ? t('exam.correctWas', { a: label }) : '';
      // Después de la respuesta, Pelotín avisa cuántos outs van.
      const warn = outWarning(wrong.length + 1, maxOuts);
      const done = () => {
        if (heardToken.current === tok) setHeard(true);
      };
      const sayWarn = () => {
        if (heardToken.current !== tok) return;
        if (!warn) return done();
        speak(t(warn), locale, done);
      };
      umpireCall('out', locale, () => {
        if (msg) speak(msg, locale, sayWarn);
        else sayWarn();
        setTimeout(done, Math.max(3000, (msg.length + 90) * 95) + 3500);
      });
      setWrong((w) => [...w, i]);
    }
  };

  const next = () => {
    if (!heard) return;
    heardToken.current++;
    stopSpeaking();
    if (outs >= maxOuts) {
      // Tercer out: se acaba el examen y vuelve a home a repetirlo.
      setPhase('done');
      return;
    }
    if (i + 1 < total) {
      setI(i + 1);
      setAnswer(null);
      setPicked(null);
      speak(text[String(level.exam[i + 1].n)].q, locale);
    } else {
      setPhase('done');
      if (score >= need) {
        const r = passExam(level.n);
        markLevelPassed();
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
    setHeard(true);
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
          <View testID="exam-outs-rule" style={{ width: '100%', backgroundColor: C.wrongSoft, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <OutLights outs={3} max={3} />
            <Text style={{ flex: 1, fontFamily: F.bodyBold, fontSize: 15, lineHeight: 20, color: '#991B1B' }}>{t('exam.outsRule')}</Text>
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
          {passed ? null : <Text testID="exam-3outs" style={{ fontFamily: F.display, fontSize: 52, color: C.gold }}>{t('exam.outsTitle')}</Text>}
          <Text testID="exam-result" style={{ fontFamily: F.display, fontSize: 36, color: passed ? C.gold : C.white }}>{(p.nickname ?? '').trim() ? t(passed ? 'exam.passTitleName' : 'exam.failTitleName', { name: (p.nickname ?? '').trim() }) : passed ? t('exam.passTitle') : t('exam.failTitle')}</Text>
          <Text style={{ fontFamily: F.bodyBold, fontSize: 18, color: '#CBD5E1' }}>{t('exam.score', { a: score, b: total })}</Text>
          {passed ? (
            <View style={{ alignItems: 'center', gap: 10 }}>
              <BadgeMedal size={96} earned level={level.n} />
              <Text style={{ fontFamily: F.bodyHeavy, fontSize: 18, color: C.gold, textAlign: 'center' }}>{t('exam.badgeWon', { badge: levelText.badge })}</Text>
              <Text style={{ fontFamily: F.bodyBold, fontSize: 16, color: C.white }}>
                +{REWARDS.examXp} XP · {t('result.coinsWon', { n: REWARDS.examCoins })}
              </Text>
              {STAGE_END[level.n] ? null : <Text style={{ fontFamily: F.body, fontSize: 15, color: '#CBD5E1' }}>{t('exam.nextUnlocked')}</Text>}
              {gameAfter(level.n) ? <Text testID="exam-game-unlocked" style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.gold, textAlign: 'center' }}>{t('game.unlocked', { name: t(gameAfter(level.n)!.title) })}</Text> : null}
            </View>
          ) : null}
          {passed && STAGE_END[level.n] ? (
            // Cierre de la etapa Novato: diploma y mensaje del guion.
            <View testID="stage-diploma" style={{ width: '100%', backgroundColor: C.white, borderRadius: 20, padding: 18, gap: 10, alignItems: 'center', borderWidth: 4, borderColor: C.gold }}>
              <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.red, letterSpacing: 1 }}>{t(`exam.stageDiploma${STAGE_SUFFIX[STAGE_END[level.n]]}`)}</Text>
              <Text style={{ fontFamily: F.display, fontSize: 28, color: C.navy, textAlign: 'center' }}>{t(`exam.stageTitle${STAGE_SUFFIX[STAGE_END[level.n]]}`)}</Text>
              <Text style={{ fontFamily: F.display, fontSize: 24, color: C.gold }}>{p.nickname ?? ''}</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {[level.n - 3, level.n - 2, level.n - 1, level.n].map((n) => (
                  <BadgeMedal key={n} size={40} earned level={n} />
                ))}
              </View>
              <Text style={{ fontFamily: F.bodySemi, fontSize: 16, lineHeight: 22, color: C.ink, textAlign: 'center' }}>{t(`exam.stageText${STAGE_SUFFIX[STAGE_END[level.n]]}`)}</Text>
              <Text style={{ fontFamily: F.body, fontSize: 14, lineHeight: 20, color: C.muted, textAlign: 'center' }}>{t(`exam.stageNext${STAGE_SUFFIX[STAGE_END[level.n]]}`)}</Text>
            </View>
          ) : null}
          {passed ? null : (
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
          {passed && level.n === LAST_LEVEL ? (
            // Último nivel: en vez de volver al camino, la ceremonia de graduación.
            <Btn
              testID="exam-ceremony"
              label={t('grad.goCeremony')}
              onPress={() => {
                startGradMusic();
                router.replace('/graduacion' as never);
              }}
            />
          ) : null}
          {passed && level.n === LAST_LEVEL ? null : <Btn
            testID="exam-done"
            label={t('exam.toPath')}
            variant={passed ? 'red' : 'ghost'}
            onPress={() => {
              // En el iPhone (Safari) la música solo puede arrancar dentro de un toque: se inicia aquí.
              startLevelMusicIfPending();
              router.back();
            }}
          />}
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
        <View testID="exam-outs" accessibilityLabel={`${t('lesson.strikes')} ${outs}`} style={{ alignItems: 'center', gap: 2 }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 10, color: C.muted, letterSpacing: 1 }}>{t('lesson.strikes').toUpperCase()}</Text>
          <OutLights outs={outs} max={maxOuts} />
        </View>
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
        {/* Pelotín acompaña cada pregunta del examen: habla al leerla y reacciona a la respuesta. */}
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <Pelotin size={120} testID="exam-pelotin" mood={answered ? (right ? 'cheer' : 'think') : 'happy'} />
        </View>
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
          {!right && outWarning(outs, maxOuts) ? <Text testID="exam-out-warn" style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: '#991B1B' }}>{t(outWarning(outs, maxOuts)!)}</Text> : null}
          <Btn testID="exam-continue" label={t('common.continue')} variant={right ? 'green' : heard ? 'wrong' : 'disabled'} onPress={heard ? next : undefined} />
        </View>
      ) : q.type !== 'tap' ? (
        <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: insets.bottom + 20, borderTopWidth: 2, borderTopColor: C.line }}>
          <Btn testID="exam-check" label={t('common.check')} variant={picked ? 'red' : 'disabled'} onPress={picked ? () => submit({ kind: 'option', id: picked }) : undefined} />
        </View>
      ) : null}
    </View>
  );
}

const actCache = new WeakMap<object, Activity>();
function examAct(q: NonNullable<ReturnType<typeof getLevel>>['exam'][number]): Activity {
  let a = actCache.get(q);
  if (!a) {
    a = { n: q.n, type: q.type === 'tap' ? 'tap' : q.type, options: q.options, correct: q.correct, scene: q.scene ?? 'diamond', target: q.target, fx: q.fx, seg: 0 };
    actCache.set(q, a);
  }
  return a;
}

/** Lo que Pelotín dice después de cada fallo: 1 out, el que deja a uno del final, o el último. */
function outWarning(outs: number, max: number): string | null {
  if (outs <= 0) return null;
  if (outs >= max) return 'exam.out3';
  if (outs === max - 1) return 'exam.out2';
  return 'exam.out1';
}

/** Luces de outs como en el marcador del estadio. */
function OutLights({ outs, max }: { outs: number; max: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {Array.from({ length: max }, (_, k) => (
        <View key={k} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: k < outs ? C.red : C.line, borderWidth: 2, borderColor: k < outs ? '#7F0A1C' : '#CBD5E1' }} />
      ))}
    </View>
  );
}
