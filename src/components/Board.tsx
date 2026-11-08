import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import type { BoardState, Call } from '@/content/types';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

// Escenas del Nivel 3: el marcador (entradas, alta/baja, outs, carreras)
// y la alineación (orden al bate del 1 al 9). Más el letrero de lo que canta el umpire.

const ring = (on: boolean) => ({ borderWidth: 3, borderColor: on ? C.gold : 'transparent', borderRadius: 14 });

function BatIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 21 L5 19 L18 6 Q20 4 21.5 5.5 Q23 7 21 9 L8 22 Z" fill={C.gold} />
    </Svg>
  );
}

export function Board({ width, state, highlight = [] }: { width: number; state: BoardState; highlight?: string[] }) {
  const { t } = useStore();
  const hl = (k: string) => highlight.includes(k);
  const big = Math.round(width * 0.13);
  const batting = state.half === 'top' ? 'away' : state.half === 'bottom' ? 'home' : null;
  const halfPill = (h: 'top' | 'bottom') => {
    const on = state.half === h || state.half === 'both';
    return (
      <View key={h} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: on ? C.gold : 'rgba(255,255,255,0.08)' }}>
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: on ? C.navy : '#64748B' }}>{h === 'top' ? '▲' : '▼'}</Text>
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: on ? C.navy : '#64748B' }}>{t(`board.${h}`)}</Text>
      </View>
    );
  };
  const row = (team: 'away' | 'home') => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
      <View style={{ width: 20, alignItems: 'center' }}>{batting === team && hl('batting') ? <BatIcon /> : batting === team ? <BatIcon size={14} /> : null}</View>
      <Text style={{ flex: 1, fontFamily: F.bodyHeavy, fontSize: 16, color: batting === team ? C.white : '#CBD5E1' }}>{t(`board.${team}`)}</Text>
      <View style={[{ minWidth: big * 1.1, alignItems: 'center', backgroundColor: C.navyDeep, paddingHorizontal: 6 }, ring(hl('runs'))]}>
        <Text style={{ fontFamily: F.display, fontSize: big * 0.8, color: C.gold }}>{String(team === 'away' ? state.away : state.home)}</Text>
      </View>
    </View>
  );
  const total = state.innings ?? 0;
  return (
    <View testID="scene-board" style={{ width, backgroundColor: C.navy, borderRadius: 22, padding: 14, gap: 10, borderWidth: 4, borderColor: '#24406B' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={[{ flexDirection: 'row', alignItems: 'baseline', gap: 8, paddingHorizontal: 6 }, ring(hl('innings') && !total)]}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: '#CBD5E1' }}>{t('board.inning')}</Text>
          <Text style={{ fontFamily: F.display, fontSize: big, color: C.white }}>{String(state.inning)}</Text>
        </View>
        {state.final ? (
          <View style={{ backgroundColor: C.red, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: C.white }}>{t('board.final')}</Text>
          </View>
        ) : (
          <View style={[{ flexDirection: 'row', gap: 6, padding: 3 }, ring(hl('half'))]}>
            {halfPill('top')}
            {halfPill('bottom')}
          </View>
        )}
      </View>
      {total ? (
        <View style={[{ gap: 6, padding: 6 }, ring(hl('innings'))]}>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
              const on = n <= state.inning;
              return (
                <View key={n} style={{ flex: 1, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? C.gold : 'rgba(255,255,255,0.1)' }}>
                  <Text style={{ fontFamily: F.display, fontSize: 18, color: on ? C.navy : '#94A3B8' }}>{String(n)}</Text>
                </View>
              );
            })}
            {state.extra ? (
              <View style={{ flex: 1.6, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: C.red }}>
                <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11, color: C.white }}>{t('board.extra')}</Text>
              </View>
            ) : null}
          </View>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: '#CBD5E1', textAlign: 'center' }}>{t('board.innings', { n: total })}</Text>
        </View>
      ) : null}
      <View style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 }}>
        {row('away')}
        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
        {row('home')}
      </View>
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' }, ring(hl('outs'))]}>
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: '#CBD5E1' }}>{t('board.outs')}</Text>
        {[1, 2, 3].map((n) => (
          <View key={n} testID={n <= state.outs ? 'out-on' : 'out-off'} style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: n <= state.outs ? C.red : 'transparent', borderWidth: 2.5, borderColor: n <= state.outs ? '#FCA5A5' : '#475569' }} />
        ))}
      </View>
    </View>
  );
}

export function Lineup({ width, batter, marked = [] }: { width: number; batter?: number; marked?: number[] }) {
  const { t } = useStore();
  const tile = (width - 28 - 16) / 3;
  return (
    <View testID="scene-lineup" style={{ width, backgroundColor: C.navy, borderRadius: 22, padding: 14, gap: 10 }}>
      <Text style={{ fontFamily: F.display, fontSize: 22, color: C.gold, letterSpacing: 1 }}>{t('board.lineup')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
          const up = batter === n;
          const done = marked.includes(n);
          return (
            <View
              key={n}
              testID={up ? 'lineup-up' : undefined}
              style={{ width: tile, height: tile * 0.82, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: up ? C.gold : done ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)', borderWidth: up ? 3 : 0, borderColor: C.white }}
            >
              <Jersey n={n} size={tile * 0.5} fill={up ? C.red : done ? '#64748B' : '#24406B'} />
              {up ? <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11, color: C.navy }}>{t('board.batting')}</Text> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function Jersey({ n, size = 40, fill = C.navy }: { n: number; size?: number; fill?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M13 4 L20 7 L27 4 L37 10 L33 18 L29 16 L29 37 L11 37 L11 16 L7 18 L3 10 Z" fill={fill} stroke={C.white} strokeWidth={1.6} strokeLinejoin="round" />
      <SvgText x={20} y={30} fontSize={15} fontWeight="bold" fill={C.white} textAnchor="middle">
        {String(n)}
      </SvgText>
    </Svg>
  );
}

const CALL_COLOR: Record<Call, string> = {
  strike: C.red, ball: C.blue, foul: C.orange, out: C.red, k: C.red, walk: C.green, hbp: C.purple, run: C.green,
};
const CALL_KEY: Record<Call, string> = {
  strike: 'callStrike', ball: 'callBall', foul: 'callFoul', out: 'callOut', k: 'callK', walk: 'callWalk', hbp: 'callHbp', run: 'callRun',
};

/** Letrero con lo que canta el umpire, encima de la escena. */
export function CallBanner({ call }: { call: Call }) {
  const { t } = useStore();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 10, left: 0, right: 0, alignItems: 'center' }}>
      <View testID="call-banner" style={{ backgroundColor: CALL_COLOR[call], borderRadius: 14, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 3, borderColor: C.white, boxShadow: '0 3px 8px rgba(0,0,0,0.35)' } as object}>
        <Text style={{ fontFamily: F.display, fontSize: 24, color: C.white, letterSpacing: 1 }}>{t(`board.${CALL_KEY[call]}`)}</Text>
      </View>
    </View>
  );
}
