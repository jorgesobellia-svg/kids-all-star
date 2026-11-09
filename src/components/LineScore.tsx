import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LineScoreState, Target } from '@/content/types';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';
import type { Hit } from './Diamond';

// Marcador completo del Nivel 8: carreras por entrada y al final R (carreras), H (hits) y E (errores).
// Cada celda R/H/E se puede tocar: su id es ls-R0, ls-H1… (columna + fila).

interface Props {
  width: number;
  state: LineScoreState;
  highlight?: string[];
  good?: Target | null;
  bad?: Hit | null;
  onTap?: (h: Hit) => void;
}

export default function LineScore({ width, state, highlight = [], good, bad, onTap }: Props) {
  const { t } = useStore();
  const cols = state.innings + 3;
  const teamW = Math.min(96, width * 0.27);
  const cw = (width - 24 - teamW) / cols;
  const cell = (id: string, text: string, strong = false) => {
    const tid = `ls-${id}` as Target;
    const mark = good === tid ? C.green : bad === tid ? C.wrong : highlight.includes(id) || highlight.includes(id[0]) ? C.gold : null;
    const inner = (
      <View style={{ width: cw - 2, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: mark ? mark : strong ? C.navyDeep : 'transparent', borderWidth: mark ? 2 : 0, borderColor: C.white }}>
        <Text style={{ fontFamily: F.display, fontSize: strong ? 22 : 18, color: mark ? C.navy : strong ? C.gold : C.white }}>{text}</Text>
      </View>
    );
    if (!onTap || !strong) return <View key={id} style={{ width: cw, alignItems: 'center' }}>{inner}</View>;
    return (
      <Pressable key={id} testID={tid} accessibilityRole="button" onPress={() => onTap(tid)} style={{ width: cw, alignItems: 'center' }}>
        {inner}
      </Pressable>
    );
  };
  return (
    <View testID="scene-linescore" style={{ width, backgroundColor: C.navy, borderRadius: 18, padding: 12, gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: teamW }} />
        {Array.from({ length: state.innings }, (_, i) => (
          <View key={i} style={{ width: cw, alignItems: 'center' }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 12, color: '#94A3B8' }}>{String(i + 1)}</Text>
          </View>
        ))}
        {['R', 'H', 'E'].map((k) => (
          <View key={k} style={{ width: cw, alignItems: 'center' }}>
            <Text style={{ fontFamily: F.display, fontSize: 18, color: highlight.includes(k) ? C.gold : C.white }}>{k}</Text>
          </View>
        ))}
      </View>
      {state.rows.map((r, ri) => (
        <View key={ri} style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)', paddingTop: 4 }}>
          <Text numberOfLines={1} style={{ width: teamW, fontFamily: F.bodyHeavy, fontSize: 13, color: '#CBD5E1' }}>{t(`board.${r.team}`)}</Text>
          {r.runs.map((n, i) => cell(`${i}-${ri}`, String(n)))}
          {cell(`R${ri}`, String(r.R), true)}
          {cell(`H${ri}`, String(r.H), true)}
          {cell(`E${ri}`, String(r.E), true)}
        </View>
      ))}
    </View>
  );
}
