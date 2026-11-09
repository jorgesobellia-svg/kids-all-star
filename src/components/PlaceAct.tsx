import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';
import type { Activity as Act, Target } from '@/content/types';
import { playSfx } from '@/services/sfx';
import { C, F } from '@/theme';
import { BallBadge } from './Art';
import Diamond, { POS, POS_NUM, pt, VB } from './Diamond';

// "Arrastrar" del Nivel 2: llevar cada jugador a su posición en el campo,
// o cada tarjeta a su casilla numerada (ordenar del 1 al 4).

type Pt = { x: number; y: number };

interface Props {
  act: Act;
  width: number;
  locked: boolean;
  tokenText: (id: string) => string;
  hint: string;
  retryLabel: string;
  onAnswer: (place: Record<string, string>) => void;
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PlaceAct({ act, width, locked, tokenText, hint, retryLabel, onAnswer }: Props) {
  const place = useMemo(() => act.place ?? {}, [act.place]);
  // 'order' = casillas numeradas; 'match' = casillas con nombre (unir cada ficha con su resultado).
  const isMatch = act.board === 'match';
  const isOrder = act.board === 'order' || isMatch;
  const s = width / VB.w;
  const [tokens] = useState(() => shuffle(Object.keys(place)));
  const slotIds = useMemo(
    () => (act.board === 'order' ? ['1', '2', '3', '4'] : Array.from(new Set(Object.values(place)))),
    [act.board, place],
  );
  const nCols = isMatch ? slotIds.length : 4;
  const boardH = isMatch ? 120 : isOrder ? 96 : VB.h * s;

  const cardW = isOrder ? (width - 10 * (nCols - 1) - 6) / nCols : Math.min(118, (width - 10 * (tokens.length - 1)) / tokens.length);
  const cardH = isMatch ? 70 : isOrder ? 64 : 76;
  const trayTop = boardH + 18;
  const perRow = isOrder ? nCols : tokens.length;

  const slotCenter = (id: string): Pt => {
    if (isOrder) {
      const i = slotIds.indexOf(id);
      return { x: 3 + i * (cardW + 10) + cardW / 2, y: isMatch ? boardH - 8 - cardH / 2 - 4 : boardH / 2 };
    }
    const p = pt(id as Target);
    return { x: p.x * s, y: p.y * s };
  };
  const homeOf = (i: number): Pt => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const rowCount = Math.min(perRow, tokens.length - row * perRow);
    const rowW = rowCount * cardW + (rowCount - 1) * 10;
    return { x: (width - rowW) / 2 + col * (cardW + 10) + cardW / 2, y: trayTop + row * (cardH + 10) + cardH / 2 };
  };

  const initial = () => Object.fromEntries(tokens.map((t, i) => [t, homeOf(i)])) as Record<string, Pt>;
  const [pos, setPos] = useState<Record<string, Pt>>(initial);
  const [slotOf, setSlotOf] = useState<Record<string, string | null>>(() => Object.fromEntries(tokens.map((t) => [t, null])));
  const [dragging, setDragging] = useState<string | null>(null);

  const drop = (token: string, c: Pt) => {
    let best: string | null = null;
    let bestD = isOrder ? cardW * 0.7 : 46 * s;
    for (const id of slotIds) {
      const sc = slotCenter(id);
      const d = Math.hypot(sc.x - c.x, sc.y - c.y);
      if (d < bestD) {
        best = id;
        bestD = d;
      }
    }
    const nextSlot = { ...slotOf };
    const nextPos = { ...pos };
    if (best) {
      // Si la casilla ya tenía otra ficha, esa vuelve a la bandeja.
      for (const [tk, sl] of Object.entries(nextSlot)) {
        if (sl === best && tk !== token) {
          nextSlot[tk] = null;
          nextPos[tk] = homeOf(tokens.indexOf(tk));
        }
      }
      nextSlot[token] = best;
      nextPos[token] = slotCenter(best);
      playSfx('bat');
    } else {
      nextSlot[token] = null;
      nextPos[token] = homeOf(tokens.indexOf(token));
    }
    setSlotOf(nextSlot);
    setPos(nextPos);
    if (Object.values(nextSlot).every((v) => v !== null)) onAnswer(nextSlot as Record<string, string>);
  };

  const reset = () => {
    setPos(initial());
    setSlotOf(Object.fromEntries(tokens.map((t) => [t, null])));
  };

  const totalH = trayTop + Math.ceil(tokens.length / perRow) * (cardH + 10) + 4;

  return (
    <View style={{ gap: 8 }}>
      <View style={{ width, height: totalH }}>
        {isOrder ? (
          <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 3, height: boardH, alignItems: 'center' }}>
            {slotIds.map((id) => (
              <View key={id} style={{ width: cardW, height: isMatch ? boardH - 8 : cardH + 8, borderRadius: 14, borderWidth: 2.5, borderStyle: 'dashed', borderColor: C.lineDark, alignItems: 'center', justifyContent: isMatch ? 'flex-start' : 'center', paddingTop: isMatch ? 6 : 0, backgroundColor: C.bg }}>
                {isMatch ? (
                  <Text numberOfLines={2} style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.navy, textAlign: 'center', paddingHorizontal: 4 }}>{tokenText(id)}</Text>
                ) : (
                  <Text style={{ fontFamily: F.display, fontSize: 30, color: C.faint }}>{id}</Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Diamond width={width} slots={slotIds as Target[]} />
        )}
        <View style={{ position: 'absolute', left: 0, right: 0, top: boardH + 6, height: 2, backgroundColor: C.line }} />
        {tokens.map((t) => (
          <Token
            key={t}
            id={t}
            label={tokenText(t)}
            num={!isOrder ? POS_NUM[place[t] as keyof typeof POS] : undefined}
            center={pos[t]}
            placed={!!slotOf[t]}
            compact={!isOrder && !!slotOf[t]}
            w={cardW}
            h={cardH}
            locked={locked}
            raised={dragging === t}
            onMove={(c) => {
              setDragging(t);
              setPos((p) => ({ ...p, [t]: c }));
            }}
            onDrop={(c) => {
              setDragging(null);
              drop(t, c);
            }}
          />
        ))}
      </View>
      {!locked ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: F.bodyBold, fontSize: 14, color: C.muted, flex: 1 }}>{hint}</Text>
          {Object.values(slotOf).some(Boolean) ? (
            <Pressable accessibilityRole="button" onPress={reset} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 10 }}>
              <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: C.blue }}>{retryLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function Token({
  id,
  label,
  num,
  center,
  placed,
  compact,
  w,
  h,
  locked,
  raised,
  onMove,
  onDrop,
}: {
  id: string;
  label: string;
  num?: number;
  center: Pt;
  placed: boolean;
  compact: boolean;
  w: number;
  h: number;
  locked: boolean;
  raised: boolean;
  onMove: (c: Pt) => void;
  onDrop: (c: Pt) => void;
}) {
  const start = useRef<Pt>(center);
  const live = useRef({ center, locked, onMove, onDrop });
  useEffect(() => {
    live.current = { center, locked, onMove, onDrop };
  });
  // Las referencias solo se leen dentro de los callbacks del gesto, nunca al dibujar.
  // eslint-disable-next-line react-hooks/refs
  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !live.current.locked,
      onMoveShouldSetPanResponder: () => !live.current.locked,
      onStartShouldSetPanResponderCapture: () => !live.current.locked,
      onMoveShouldSetPanResponderCapture: () => !live.current.locked,
      // Mientras arrastra, el desplazamiento de la pantalla no le quita el dedo.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        start.current = live.current.center;
      },
      onPanResponderMove: (_e, g) => {
        live.current.onMove({ x: start.current.x + g.dx, y: start.current.y + g.dy });
      },
      onPanResponderRelease: (_e, g) => {
        live.current.onDrop({ x: start.current.x + g.dx, y: start.current.y + g.dy });
      },
      onPanResponderTerminate: () => {
        live.current.onDrop(start.current);
      },
    }),
  );
  const size = compact ? 38 : 0;
  const bw = compact ? size : w;
  const bh = compact ? size : h;
  return (
    <View
      {...pan.panHandlers}
      testID={`token-${id}`}
      accessibilityLabel={label}
      style={{
        position: 'absolute',
        left: center.x - bw / 2,
        top: center.y - bh / 2,
        width: bw,
        height: bh,
        zIndex: raised ? 10 : placed ? 2 : 1,
        userSelect: 'none',
        alignItems: 'center',
        justifyContent: 'center',
      } as object}
    >
      {compact ? (
        <BallBadge text={num != null ? String(num) : label.slice(0, 1).toUpperCase()} size={38} ink={C.navy} ring={C.gold} ringWidth={3} fontSize={14} />
      ) : (
        <View
          style={{
            width: w,
            height: h,
            borderRadius: 14,
            backgroundColor: C.white,
            borderWidth: 2.5,
            borderColor: placed ? C.green : C.navy,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
            gap: 2,
            boxShadow: '0 3px 0 rgba(12,35,64,0.25)',
          } as object}
        >
          <Text numberOfLines={2} style={{ fontFamily: F.bodyHeavy, fontSize: 12, lineHeight: 14, color: C.ink, textAlign: 'center' }}>
            {label}
          </Text>
        </View>
      )}
    </View>
  );
}
