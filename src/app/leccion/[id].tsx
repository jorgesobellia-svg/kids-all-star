import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActivityView, { isCorrect, type Answer } from '@/components/Activity';
import { CheckIcon, CoinBall, Mascot, SpeakerIcon } from '@/components/Art';
import Pelotin from '@/components/Pelotin';
import Scoreboard from '@/components/Scoreboard';
import { StatusBar } from 'expo-status-bar';
import { Board, CallBanner, Lineup } from '@/components/Board';
import Diamond from '@/components/Diamond';
import Gear from '@/components/Gear';
import Zone from '@/components/Zone';
import LineScore from '@/components/LineScore';
import Mound from '@/components/Mound';
import { Btn, Label, ProgressBar } from '@/components/ui';
import { getLesson, getLevel, REWARDS } from '@/content/levels';
import type { DemoSegment, GearTarget, Target } from '@/content/types';
import { content } from '@/i18n';
import { speak, stopSpeaking, umpireCall } from '@/services/speech';
import { submitScore } from '@/services/scoreboard';
import { dayKey, useStore, weekKey, type LessonReward } from '@/state/store';
import { C, F } from '@/theme';

type LessonText = {
  title: string;
  objective: string;
  demo: string[];
  acts: Record<string, { q: string; ok: string; ko: string; opts?: Record<string, string>; answer?: string }>;
};

/** Escena del diamante o del equipo con lo que se resalta en ese pedazo del guion. */
function Scene({ seg, width, runKey }: { seg: DemoSegment; width: number; runKey: number }) {
  const hl = seg.highlight as string[];
  if (seg.scene === 'gear') return <Gear width={width} highlight={seg.highlight as GearTarget[]} />;
  // Marcador y alineación: el letrero del umpire va arriba, sin tapar el tablero.
  if (seg.scene === 'board' || seg.scene === 'lineup') {
    return (
      <View style={{ gap: 10, alignItems: 'center' }}>
        {seg.call ? <View style={{ height: 52, width }}><CallBanner call={seg.call} /></View> : null}
        {seg.scene === 'board' && seg.board ? <Board width={width} state={seg.board} highlight={hl} /> : <Lineup width={width} batter={seg.batter} marked={seg.marked} />}
      </View>
    );
  }
  const scene =
    seg.scene === 'zone' ? (
      <Zone width={width} highlight={hl} showZone={seg.showZone} pitch={seg.pitch} swing={seg.swing} count={seg.count} />
    ) : seg.scene === 'linescore' && seg.linescore ? (
      <LineScore width={width} state={seg.linescore} highlight={hl} />
    ) : seg.scene === 'mound' ? (
      <Mound width={width} pose={seg.pose} highlight={hl} />
    ) : (
      <Diamond width={width} highlight={seg.highlight as Target[]} run={seg.run ?? null} runKey={runKey} players={seg.scene === 'field9'} numbers={seg.numbers} foulHit={seg.foulHit} fx={seg.fx} />
    );
  return (
    <View>
      {scene}
      {seg.call ? <CallBanner call={seg.call} /> : null}
    </View>
  );
}

function readTime(text: string) {
  return Math.max(2600, text.length * 60);
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLesson(String(id));
  const { t, locale, completeLesson, p } = useStore();
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const W = Math.min(winW, 520) - 40;
  const rawText = (content(locale).lessons as Record<string, LessonText>)[String(id)];
  // El narrador saluda al jugador por su nombre de usuario al empezar cada lección (texto y voz).
  const name = (p.nickname ?? '').trim();
  const text = useMemo(
    () => (rawText && name && rawText.demo.length ? { ...rawText, demo: [t('common.hello', { name }) + rawText.demo[0], ...rawText.demo.slice(1)] } : rawText),
    [rawText, name, t],
  );

  const [phase, setPhase] = useState<'demo' | 'acts' | 'replay' | 'ponche' | 'result'>('demo');
  const [segIdx, setSegIdx] = useState(0);
  const [demoDone, setDemoDone] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const [queue, setQueue] = useState<number[]>(() => (lesson ? lesson.activities.map((_, i) => i) : []));
  const [attempt, setAttempt] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [firstTry, setFirstTry] = useState<Set<number>>(new Set());
  const [missed, setMissed] = useState<Set<number>>(new Set());
  const [replaySeg, setReplaySeg] = useState(0);
  // Los botones de Continuar esperan a que Pelotín termine de decir la explicación en voz alta,
  // para que los niños que todavía no leen bien la escuchen completa.
  const [heard, setHeard] = useState(true);
  const heardToken = useRef(0);
  const sayThen = (msg: string) => {
    const tok = ++heardToken.current;
    setHeard(false);
    const ok = () => {
      if (tok === heardToken.current) setHeard(true);
    };
    speak(msg, locale, ok);
    // Respaldo por si el teléfono no tiene voz para ese idioma.
    setTimeout(ok, readTime(msg) + 2500);
  };
  const [reward, setReward] = useState<LessonReward | null>(null);
  const [playing, setPlaying] = useState(true);
  const [plays, setPlays] = useState(0);
  // Outs de la lección (con 3 outs, al dugout) y racha de aciertos seguidos.
  const [strikes, setStrikes] = useState(0);
  const [inARow, setInARow] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [combo, setCombo] = useState<0 | 3 | 5>(0);

  // Narración de la demostración: cada pedazo con su voz y avanza solo al terminar.
  useEffect(() => {
    if (phase !== 'demo' || !playing || !text) return;
    let done = false;
    const advance = () => {
      if (done) return;
      done = true;
      if (segIdx + 1 < text.demo.length) setSegIdx(segIdx + 1);
      else {
        setPlaying(false);
        setDemoDone(true);
      }
    };
    speak(text.demo[segIdx], locale, advance);
    // Respaldo por si el teléfono no tiene voz para ese idioma.
    const timer = setTimeout(advance, readTime(text.demo[segIdx]) + 2500);
    return () => {
      done = true;
      clearTimeout(timer);
    };
  }, [phase, playing, segIdx, text, locale, plays]);

  useEffect(() => () => stopSpeaking(), []);

  if (!lesson || !text) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg }}>
        <Btn label={t('common.back')} onPress={() => router.back()} />
      </View>
    );
  }

  const total = lesson.activities.length;
  const curIdx = queue[0];
  const act = lesson.activities[curIdx];
  const at = act ? text.acts[String(act.n)] : null;
  const progress = phase === 'demo' ? 0 : correctCount / total;
  const answered = answer !== null;
  const right = answered && act ? isCorrect(act, answer!) : false;

  const startActs = () => {
    setPlaying(false);
    stopSpeaking();
    setPhase('acts');
    if (at) speak(at.q, locale);
  };

  const submit = (a: Answer) => {
    if (!act || answered) return;
    setAnswer(a);
    const ok = isCorrect(act, a);
    if (ok) {
      setCorrectCount((c) => c + 1);
      if (!missed.has(curIdx)) setFirstTry((s) => new Set(s).add(curIdx));
      const run = inARow + 1;
      setInARow(run);
      if (run === 3) {
        setCombo(3);
        setBonus((b) => b + REWARDS.combo3Coins);
      } else if (run === 5) {
        setCombo(5);
        setBonus((b) => b + REWARDS.combo5Coins);
      } else setCombo(0);
    } else {
      setMissed((s) => new Set(s).add(curIdx));
      setInARow(0);
      setCombo(0);
      setStrikes((k) => k + 1);
    }
    const fb = ok ? at?.ok : at?.ko;
    // Primero canta el umpire; después la mascota explica.
    const tok = ++heardToken.current;
    setHeard(false);
    umpireCall(ok ? 'safe' : 'out', locale, () => {
      if (tok !== heardToken.current) return;
      if (fb) sayThen(fb);
      else setHeard(true);
    });
  };

  const finish = () => {
    const perfect = missed.size === 0;
    const r = completeLesson(lesson.id, correctCount, total, perfect, bonus);
    setReward(r);
    setPhase('result');
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
  };

  const next = () => {
    if (!heard) return;
    stopSpeaking();
    if (!act) return;
    if (!right && strikes >= REWARDS.strikesPerLesson) {
      // Tercer strike: ponche. Se va al dugout (pantalla de ponche) antes de volver a ver la demostración.
      setPhase('ponche');
      return;
    }
    if (!right) {
      // Se repite el pedazo clave de la demostración y la pregunta vuelve al final.
      setReplaySeg(act.seg);
      setPhase('replay');
      setReplayCount((k) => k + 1);
      sayThen(text.demo[act.seg]);
      return;
    }
    const rest = queue.slice(1);
    setQueue(rest);
    setAnswer(null);
    setPicked(null);
    setAttempt((x) => x + 1);
    if (rest.length === 0) finish();
    else {
      const na = lesson.activities[rest[0]];
      speak(text.acts[String(na.n)].q, locale);
    }
  };

  const afterReplay = () => {
    stopSpeaking();
    const rest = [...queue.slice(1), curIdx];
    setQueue(rest);
    setAnswer(null);
    setPicked(null);
    setAttempt((x) => x + 1);
    setPhase('acts');
    const na = lesson.activities[rest[0]];
    speak(text.acts[String(na.n)].q, locale);
  };

  const exit = () => {
    stopSpeaking();
    router.back();
  };

  // Desde el dugout: la cuenta vuelve a cero, se ve la demostración completa y el turno empieza de nuevo.
  const backToBat = () => {
    stopSpeaking();
    setStrikes(0);
    setInARow(0);
    setCombo(0);
    setCorrectCount(0);
    setQueue(lesson.activities.map((_, i) => i));
    setAnswer(null);
    setPicked(null);
    setAttempt((x) => x + 1);
    setSegIdx(0);
    setDemoDone(false);
    setPlays((n) => n + 1);
    setPlaying(true);
    setPhase('demo');
  };

  // ------------------------------------------------------------------ Resultado
  if (phase === 'result' && reward) {
    // Secuencia del nivel: estrella → 1.ª base → 2.ª base → 3.ª base → home → examen.
    // Al tocar Continuar se pasa directo a la siguiente lección; después del home, al examen
    // (si ya está aprobado, se vuelve al camino).
    const lv = getLevel(Number(String(id).split('.')[0]));
    const pos = lv ? lv.lessonIds.indexOf(String(id)) : -1;
    const nextLesson = lv && pos >= 0 && pos < lv.lessonIds.length - 1 ? lv.lessonIds[pos + 1] : null;
    const toExam = !!lv && pos === lv.lessonIds.length - 1 && !p.examsPassed[String(lv.n)];
    const onDone = () => {
      stopSpeaking();
      if (nextLesson) router.replace({ pathname: '/leccion/[id]', params: { id: nextLesson } });
      else if (toExam && lv) router.replace({ pathname: '/examen/[nivel]', params: { nivel: String(lv.n) } });
      else router.back();
    };
    return <ResultView reward={reward} firstTry={firstTry.size} total={total} onDone={onDone} />;
  }

  const autoCheck = act && (act.type === 'tap' || act.type === 'drag');

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <StatusBar style="light" />
      <Scoreboard
        total={total}
        runs={correctCount}
        strikes={strikes}
        strikesLabel={t('lesson.strikes')}
        inningLabel={t('lesson.inning')}
        exitLabel={t('lesson.exit')}
        onExit={exit}
        topInset={insets.top}
      />

      {phase === 'ponche' ? (
        <View testID="ponche" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14, backgroundColor: C.navy }}>
          <Text style={{ fontFamily: F.display, fontSize: 56, color: C.gold }}>{'3 ' + t('lesson.strikes').toUpperCase()}</Text>
          <Text style={{ fontFamily: F.display, fontSize: 34, color: C.white, textAlign: 'center' }}>{name ? t('lesson.ponchadoName', { name }) : t('lesson.ponchado')}</Text>
          <Text style={{ fontFamily: F.bodySemi, fontSize: 17, lineHeight: 24, color: '#CBD5E1', textAlign: 'center' }}>{t('lesson.ponchadoText')}</Text>
          <View style={{ alignSelf: 'stretch', marginTop: 10 }}>
            <Btn testID="to-dugout" label={t('lesson.toDugout')} onPress={backToBat} />
          </View>
        </View>
      ) : null}

      {phase === 'ponche' ? null : phase === 'demo' || phase === 'replay' ? (
        <>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 16, alignItems: 'center' }}>
            <Label style={{ alignSelf: 'flex-start' }}>{phase === 'demo' ? t('lesson.watch') : t('lesson.rewatch')}</Label>
            {phase === 'demo' ? <Text style={{ alignSelf: 'flex-start', fontFamily: F.display, fontSize: 28, color: C.ink }}>{text.title}</Text> : null}
            <Scene seg={lesson.demo[phase === 'demo' ? segIdx : replaySeg]} width={W} runKey={phase === 'demo' ? plays * 100 + segIdx : 10000 + replayCount} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, width: W }}>
              <Pelotin size={88} testID="pelotin" />
              <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 16, borderTopLeftRadius: 4, padding: 14 }}>
                <Text testID="demo-text" style={{ fontFamily: F.bodySemi, fontSize: 18, lineHeight: 25, color: C.ink }}>
                  {text.demo[phase === 'demo' ? segIdx : replaySeg]}
                </Text>
              </View>
            </View>
            {phase === 'demo' ? (
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {text.demo.map((_, i) => (
                  <View key={i} style={{ width: i === segIdx ? 22 : 8, height: 8, borderRadius: 4, backgroundColor: i <= segIdx ? C.red : C.line }} />
                ))}
              </View>
            ) : null}
          </ScrollView>
          <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20, gap: 10, borderTopWidth: 2, borderTopColor: C.line, paddingTop: 14 }}>
            {phase === 'demo' ? (
              <>
                <Pressable
                  accessibilityRole="button"
                  testID="demo-replay"
                  onPress={() => {
                    setDemoDone(false);
                    setSegIdx(0);
                    setPlays((n) => n + 1);
                    setPlaying(true);
                  }}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44 }}
                >
                  <SpeakerIcon />
                  <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.navy }}>{t('lesson.replay')}</Text>
                </Pressable>
                <Btn testID="demo-ready" label={t('lesson.ready')} variant={demoDone ? 'red' : 'disabled'} onPress={demoDone ? startActs : undefined} />
              </>
            ) : (
              <Btn testID="replay-continue" label={t('common.continue')} variant={heard ? 'red' : 'disabled'} onPress={heard ? afterReplay : undefined} />
            )}
          </View>
        </>
      ) : act && at ? (
        <>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
            <Label>{t(`lesson.type_${act.type}`)}</Label>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Pelotin size={60} />
              <Text testID="act-question" style={{ flex: 1, fontFamily: F.display, fontSize: 26, lineHeight: 30, color: C.ink }}>
                {at.q}
              </Text>
            </View>
            <ActivityView
              key={`${curIdx}-${attempt}`}
              act={act}
              width={W}
              optText={(o) => at.opts?.[o] ?? o}
              trueLabel={t('common.true')}
              falseLabel={t('common.false')}
              dragHint={t('lesson.dragHint')}
              placeHint={t('lesson.placeHint')}
              retryLabel={t('lesson.retryRoute')}
              locked={answer}
              picked={picked}
              onPick={setPicked}
              onAnswer={submit}
            />
          </ScrollView>
          {answered ? (
            <View testID="feedback" style={{ backgroundColor: right ? C.greenSoft : C.wrongSoft, paddingHorizontal: 22, paddingTop: 16, paddingBottom: insets.bottom + 20, gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Pelotin size={56} mood={right ? 'cheer' : 'think'} />
                <Text style={{ fontFamily: F.display, fontSize: 26, color: right ? '#166534' : '#991B1B' }}>{name ? t(right ? 'lesson.rightName' : 'lesson.almostName', { name }) : right ? t('lesson.right') : t('lesson.almost')}</Text>
              </View>
              <Text style={{ fontFamily: F.bodySemi, fontSize: 16, lineHeight: 22, color: right ? '#166534' : '#991B1B' }}>{right ? at.ok : at.ko}</Text>
              {right && combo ? (
                <View testID="combo" style={{ alignSelf: 'flex-start', backgroundColor: C.gold, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5 }}>
                  <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: C.navy }}>
                    {t(combo === 5 ? 'lesson.combo5' : 'lesson.combo3', { n: combo === 5 ? REWARDS.combo5Coins : REWARDS.combo3Coins })}
                  </Text>
                </View>
              ) : null}
              {!right && strikes > 0 && strikes < REWARDS.strikesPerLesson ? (
                <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: '#991B1B' }}>{t('lesson.strikeN', { n: strikes })}</Text>
              ) : null}
              {!right && at.answer ? (
                <Text style={{ fontFamily: F.bodyBold, fontSize: 15, color: '#991B1B' }}>{t('lesson.answerWas', { a: at.answer })}</Text>
              ) : null}
              <Btn testID="feedback-continue" label={t('common.continue')} variant={!heard ? 'disabled' : right ? 'green' : 'wrong'} onPress={heard ? next : undefined} />
            </View>
          ) : !autoCheck ? (
            <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: insets.bottom + 20, borderTopWidth: 2, borderTopColor: C.line }}>
              <Btn
                testID="check"
                label={t('common.check')}
                variant={picked ? 'red' : 'disabled'}
                onPress={picked ? () => submit({ kind: 'option', id: picked }) : undefined}
              />
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

function Tile({ head, value, color }: { head: string; value: string; color: string }) {
  return (
    <View style={{ flex: 1, borderWidth: 2, borderColor: color, borderRadius: 16, overflow: 'hidden', alignItems: 'center' }}>
      <Text style={{ backgroundColor: color, color: C.navy, width: '100%', textAlign: 'center', fontFamily: F.bodyHeavy, fontSize: 12, paddingVertical: 4 }}>{head}</Text>
      <Text style={{ fontFamily: F.display, fontSize: 28, color: C.white, paddingVertical: 8 }}>{value}</Text>
    </View>
  );
}

function ResultView({ reward, firstTry, total, onDone }: { reward: LessonReward; firstTry: number; total: number; onDone: () => void }) {
  const { t, p } = useStore();
  const insets = useSafeAreaInsets();
  const labels = t('result.weekdays').split(',');
  const week = useMemo(() => {
    const now = new Date();
    const dow = (now.getDay() + 6) % 7; // lunes = 0
    return labels.map((l, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - dow + i);
      const k = dayKey(d);
      return { l, played: p.streak.days.includes(k), today: i === dow, future: i > dow };
    });
  }, [labels, p.streak.days]);


  return (
    <View style={{ flex: 1, backgroundColor: C.navy, paddingTop: insets.top + 36, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', gap: 18 }}>
        <Mascot size={140} mood="cheer" />
        <View style={{ alignItems: 'center' }}>
          <Text testID="result-title" style={{ fontFamily: F.display, fontSize: 36, color: C.gold, textAlign: 'center' }}>
            {(p.nickname ?? '').trim() ? t(reward.perfect ? 'result.perfectName' : 'result.titleName', { name: (p.nickname ?? '').trim() }) : reward.perfect ? t('result.perfect') : t('result.title')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
          <Tile head={t('result.xp')} value={`+${reward.xp}`} color={C.gold} />
          <Tile head={t('result.correct')} value={`${firstTry}/${total}`} color="#22C55E" />
          <Tile head={t('result.streak')} value={t(reward.streak === 1 ? 'result.day1' : 'result.days', { n: reward.streak })} color={C.orange} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <CoinBall size={26} />
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 18, color: C.white }}>{t('result.coinsWon', { n: reward.coins })}</Text>
        </View>
        <View style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 16, gap: 12 }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: C.white }}>{t('result.week')}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {week.map((d, i) => (
              <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                <Text style={{ fontFamily: d.today ? F.bodyHeavy : F.body, fontSize: 13, color: d.today ? C.white : '#CBD5E1' }}>{d.l}</Text>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: d.played ? C.orange : 'transparent',
                    borderWidth: d.played ? (d.today ? 3 : 0) : 2,
                    borderColor: d.played ? C.gold : '#64748B',
                    borderStyle: d.played ? 'solid' : 'dashed',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {d.played ? <CheckIcon size={16} /> : null}
                </View>
              </View>
            ))}
          </View>
        </View>
        {reward.milestone ? (
          <View style={{ width: '100%', backgroundColor: C.gold, borderRadius: 20, padding: 16 }}>
            <Text style={{ fontFamily: F.display, fontSize: 22, color: C.navy }}>{t('result.milestone', { n: reward.milestone })}</Text>
          </View>
        ) : null}
        {reward.newCard ? (
          <View style={{ width: '100%', backgroundColor: 'rgba(255,184,28,0.15)', borderWidth: 2, borderColor: C.gold, borderRadius: 16, padding: 12 }}>
            <Text style={{ fontFamily: F.bodyBold, fontSize: 15, color: C.gold, textAlign: 'center' }}>{t('result.cardWon')}</Text>
          </View>
        ) : null}
      </ScrollView>
      <Btn testID="result-continue" label={t('common.continue')} onPress={onDone} />
    </View>
  );
}

// Luces de strikes como en el marcador: tres luces; cuando se enciende la tercera, es ponche.
