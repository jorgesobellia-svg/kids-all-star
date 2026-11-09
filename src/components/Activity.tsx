import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';
import type { Activity as Act, GearTarget, Target } from '@/content/types';
import { C, F } from '@/theme';
import { OptionArt } from './Art';
import Diamond, { hitMatches, pt, VB, type Hit } from './Diamond';
import Gear from './Gear';
import Zone from './Zone';
import LineScore from './LineScore';
import PlaceAct from './PlaceAct';
import { playSfx } from '@/services/sfx';
import { tapFeedback } from './ui';

export type Answer =
  | { kind: 'option'; id: string }
  | { kind: 'tap'; hit: Hit | GearTarget }
  | { kind: 'route'; route: Target[] }
  | { kind: 'place'; place: Record<string, string> };

export function isCorrect(a: Act | { type: string; correct?: string; target?: string; route?: Target[]; place?: Record<string, string> }, ans: Answer): boolean {
  if (ans.kind === 'option') return ans.id === a.correct;
  if (ans.kind === 'place') {
    const want = a.place ?? {};
    return Object.keys(want).every((k) => ans.place[k] === want[k]);
  }
  if (ans.kind === 'tap') {
    if (!a.target) return false;
    if (['bat', 'glove', 'helmet', 'ball'].includes(a.target)) return ans.hit === a.target;
    return hitMatches(ans.hit as Hit, a.target as Target);
  }
  const want = a.route ?? [];
  return want.length === ans.route.length && want.every((t, i) => ans.route[i] === t);
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  act: Act;
  width: number;
  /** Textos de las opciones en el idioma elegido. */
  optText: (id: string) => string;
  trueLabel: string;
  falseLabel: string;
  dragHint: string;
  /** Texto de ayuda para colocar jugadores o tarjetas. */
  placeHint?: string;
  retryLabel: string;
  /** null = sin responder; si hay respuesta, se muestra el resultado y se bloquea. */
  locked: Answer | null;
  picked: string | null;
  onPick: (id: string) => void;
  /** Respuestas que se comprueban solas (tocar y arrastrar). */
  onAnswer: (a: Answer) => void;
}

export default function ActivityView(props: Props) {
  const { act } = props;
  if (act.type === 'tap') return <TapAct {...props} />;
  if (act.type === 'drag' && act.place) {
    return (
      <PlaceAct
        act={act}
        width={props.width}
        locked={!!props.locked}
        tokenText={props.optText}
        hint={props.placeHint ?? props.dragHint}
        retryLabel={props.retryLabel}
        onAnswer={(place) => props.onAnswer({ kind: 'place', place })}
      />
    );
  }
  if (act.type === 'drag') return <DragAct {...props} />;
  if (act.type === 'choiceImg') return <ImageChoices {...props} />;
  return <TextChoices {...props} />;
}

function optionStyle(state: 'idle' | 'picked' | 'good' | 'bad' | 'dim') {
  const map = {
    idle: { borderColor: C.lineDark, backgroundColor: C.white, shadow: C.lineDark },
    picked: { borderColor: C.blue, backgroundColor: C.blueSoft, shadow: C.blue },
    good: { borderColor: C.green, backgroundColor: C.greenSoft, shadow: C.green },
    bad: { borderColor: C.wrong, backgroundColor: C.wrongSoft, shadow: C.wrong },
    dim: { borderColor: C.line, backgroundColor: C.white, shadow: C.line },
  }[state];
  return {
    borderWidth: 3,
    borderColor: map.borderColor,
    backgroundColor: map.backgroundColor,
    borderRadius: 16,
    boxShadow: `0 4px 0 ${map.shadow}`,
  } as object;
}

function stateOf(id: string, act: Act, picked: string | null, locked: Answer | null) {
  if (locked && locked.kind === 'option') {
    if (id === act.correct) return 'good';
    if (id === locked.id) return 'bad';
    return 'dim';
  }
  return id === picked ? 'picked' : 'idle';
}

function TextChoices({ act, optText, trueLabel, falseLabel, picked, locked, onPick }: Props) {
  const ids = useMemo(() => (act.type === 'tf' ? ['true', 'false'] : shuffle(act.options ?? [])), [act]);
  const label = (id: string) => (act.type === 'tf' ? (id === 'true' ? trueLabel : falseLabel) : optText(id));
  return (
    <View style={{ gap: 12, flexDirection: act.type === 'tf' ? 'row' : 'column' }}>
      {ids.map((id) => (
        <Pressable
          key={id}
          testID={`opt-${id}`}
          accessibilityRole="button"
          accessibilityState={{ selected: picked === id }}
          disabled={!!locked}
          onPress={() => {
            tapFeedback();
            playSfx('bat');
            onPick(id);
          }}
          style={[{ minHeight: act.type === 'tf' ? 72 : 60, paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'center', flex: act.type === 'tf' ? 1 : undefined }, optionStyle(stateOf(id, act, picked, locked))]}
        >
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: act.type === 'tf' ? 19 : 17, color: C.ink, textAlign: act.type === 'tf' ? 'center' : 'left' }}>
            {label(id)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function ImageChoices({ act, optText, picked, locked, onPick, width }: Props) {
  const ids = useMemo(() => shuffle(act.options ?? []), [act]);
  const cardW = (width - 24) / 3;
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {ids.map((id) => (
        <Pressable
          key={id}
          testID={`opt-${id}`}
          accessibilityRole="button"
          accessibilityLabel={optText(id)}
          disabled={!!locked}
          onPress={() => {
            tapFeedback();
            playSfx('bat');
            onPick(id);
          }}
          style={[{ width: cardW, minHeight: 150, padding: 8, alignItems: 'center', justifyContent: 'space-between' }, optionStyle(stateOf(id, act, picked, locked))]}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>{act.images?.[id] ? <OptionArt image={act.images[id]} size={56} /> : null}</View>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.ink, textAlign: "center" }}>{optText(id)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function TapAct({ act, width, locked, onAnswer }: Props) {
  const done = locked && locked.kind === 'tap' ? locked : null;
  const correct = done ? isCorrect(act, done) : false;
  if (act.scene === 'gear') {
    return (
      <Gear
        width={width}
        good={done ? (act.target as GearTarget) : null}
        bad={done && !correct ? (done.hit as GearTarget) : null}
        onTap={done ? undefined : (t) => { tapFeedback(); playSfx('bat'); onAnswer({ kind: 'tap', hit: t }); }}
      />
    );
  }
  if (act.scene === 'zone') {
    return (
      <Zone
        width={width}
        good={done ? (act.target as Target) : null}
        bad={done && !correct ? (done.hit as Hit) : null}
        showZone={!!done}
        onTap={done ? undefined : (h) => { tapFeedback(); playSfx('bat'); onAnswer({ kind: 'tap', hit: h }); }}
      />
    );
  }
  if (act.scene === 'linescore' && act.linescore) {
    return (
      <LineScore
        width={width}
        state={act.linescore}
        good={done ? (act.target as Target) : null}
        bad={done && !correct ? (done.hit as Hit) : null}
        onTap={done ? undefined : (h) => { tapFeedback(); playSfx('bat'); onAnswer({ kind: 'tap', hit: h }); }}
      />
    );
  }
  return (
    <Diamond
      width={width}
      players={act.scene === 'field9'}
      fx={act.fx}
      good={done ? (act.target as Target) : null}
      bad={done && !correct ? (done.hit as Hit) : null}
      onTap={done ? undefined : (h) => { tapFeedback(); playSfx('bat'); onAnswer({ kind: 'tap', hit: h }); }}
    />
  );
}

const BASES: Target[] = ['first', 'second', 'third', 'home'];

function DragAct({ act, width, locked, onAnswer, dragHint, retryLabel }: Props) {
  const s = width / VB.w;
  // Sale de home (corredor) o de un jugador (la bola en el 6-4-3 o en el relevo del cortador).
  const from: Target = act.from ?? 'home';
  const home0 = pt(from);
  const [trail, setTrail] = useState<Target[]>([from]);
  const [runner, setRunner] = useState({ x: home0.x, y: home0.y });
  const trailRef = useRef<Target[]>([from]);
  const start = useRef({ x: home0.x, y: home0.y });
  const want = act.route ?? [];
  const isBall = from !== 'home';
  // Con la bola solo cuentan los receptores (y las paradas pedidas): una bola que cruza por encima
  // de segunda o del montículo camino a home no es una parada.
  const nodes: Target[] = Array.from(new Set([...(isBall ? [] : BASES), ...want, ...(isBall ? (['first', 'third', 'home', 'pos1b', 'pos2b', 'pos3b', 'posSS', 'cutoff'] as Target[]) : [])])).filter((t) => t !== from);

  const visit = (b: Target) => {
    const cur = trailRef.current;
    if (cur[cur.length - 1] === b) return;
    const next = [...cur, b];
    trailRef.current = next;
    setTrail(next);
    playSfx('bat');
    const route = next.slice(1);
    const wrongSoFar = route.some((t, i) => want[i] !== t);
    if (wrongSoFar || route.length === want.length) onAnswer({ kind: 'route', route });
  };

  const nearest = (x: number, y: number): Target | null => {
    for (const b of nodes) {
      const p = pt(b);
      if (Math.hypot(p.x - x, p.y - y) < 24) return b;
    }
    return null;
  };

  const runnerRef = useRef({ x: home0.x, y: home0.y });
  // Lo que el gesto necesita en cada momento; se actualiza fuera del render.
  const live = useRef({ locked: !!locked, s, visit, nearest });
  useEffect(() => {
    live.current = { locked: !!locked, s, visit, nearest };
  });

  // Las referencias solo se leen dentro de los callbacks del gesto, nunca al dibujar.
  // eslint-disable-next-line react-hooks/refs
  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        start.current = { ...runnerRef.current };
      },
      onPanResponderMove: (_e, g) => {
        const L = live.current;
        if (L.locked) return;
        const x = start.current.x + g.dx / L.s;
        const y = start.current.y + g.dy / L.s;
        runnerRef.current = { x, y };
        setRunner({ x, y });
        const b = L.nearest(x, y);
        if (b) L.visit(b);
      },
      onPanResponderRelease: () => {
        // El corredor se queda en la última base pisada.
        const last = trailRef.current[trailRef.current.length - 1];
        const p = pt(last);
        runnerRef.current = { x: p.x, y: p.y };
        setRunner({ x: p.x, y: p.y });
      },
    }),
  );

  const reset = () => {
    trailRef.current = [from];
    setTrail([from]);
    runnerRef.current = { x: home0.x, y: home0.y };
    setRunner({ x: home0.x, y: home0.y });
  };

  const R = 18 * s;
  return (
    <View style={{ gap: 8 }}>
      <Diamond
        width={width}
        trail={trail}
        players={isBall}
        fx={isBall ? { ...act.fx, runners: act.fx?.runners } : act.fx}
        highlight={locked ? [] : [want[0] ?? 'first']}
        onTap={locked ? undefined : (h) => (nodes.includes(h as Target) ? visit(h as Target) : undefined)}
      >
        <View
          {...pan.panHandlers}
          testID="drag-runner"
          accessibilityLabel={dragHint}
          style={{
            position: 'absolute',
            left: runner.x * s - R,
            top: runner.y * s - R,
            width: R * 2,
            height: R * 2,
            borderRadius: R,
            backgroundColor: isBall ? C.white : C.red,
            borderWidth: 3,
            borderColor: isBall ? C.red : C.white,
            boxShadow: '0 3px 6px rgba(0,0,0,0.35)',
          } as object}
        />
      </Diamond>
      {!locked ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: F.bodyBold, fontSize: 14, color: C.muted, flex: 1 }}>{dragHint}</Text>
          {trail.length > 1 ? (
            <Pressable accessibilityRole="button" onPress={reset} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 10 }}>
              <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: C.blue }}>{retryLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
