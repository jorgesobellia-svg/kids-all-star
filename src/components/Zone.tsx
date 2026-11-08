import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import type { PitchSpot } from '@/content/types';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';
import type { Hit } from './Diamond';

// Escena del Nivel 4, vista desde atrás del catcher: el pitcher al fondo,
// home adelante y el bateador a un lado. La zona de strike es un rectángulo
// sobre home, del ancho de home y de las rodillas al pecho del bateador (Prompt 4).
const VB = { w: 360, h: 300 };
const PLATE = { l: 146, r: 214, y: 254 };
const KNEES = 228;
const CHEST = 150;
export const ZONE_RECT = { x: PLATE.l, y: CHEST, w: PLATE.r - PLATE.l, h: KNEES - CHEST };
const MOUND = { x: 180, y: 120 };
const FIRST = { x: 306, y: 134 };

const SPOT: Record<PitchSpot, { x: number; y: number }> = {
  mid: { x: 182, y: 190 },
  high: { x: 186, y: 96 },
  outside: { x: 252, y: 188 },
  ground: { x: 192, y: 246 },
  body: { x: 112, y: 206 },
};

interface Props {
  width: number;
  showZone?: boolean;
  highlight?: string[];
  pitch?: PitchSpot;
  swing?: boolean;
  /** Conteo: bolas primero, strikes después. */
  count?: [number, number];
  good?: Hit | null;
  bad?: Hit | null;
  onTap?: (h: Hit) => void;
}

function Batter({ swing }: { swing?: boolean }) {
  // Bateador derecho visto desde el catcher: queda a la izquierda de home.
  return (
    <G>
      <Ellipse cx={104} cy={276} rx={34} ry={6} fill="#000" fillOpacity={0.18} />
      {/* piernas */}
      <Path d="M92 196 L84 272 L96 272 L102 214 L108 272 L120 272 L114 196 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth={1.5} strokeLinejoin="round" />
      <Rect x={82} y={268} width={16} height={7} rx={3} fill={C.navy} />
      <Rect x={106} y={268} width={16} height={7} rx={3} fill={C.navy} />
      {/* torso */}
      <Path d="M88 136 Q103 128 118 136 L116 200 L90 200 Z" fill={C.red} />
      <Rect x={89} y={194} width={28} height={6} fill={C.navy} />
      {/* cabeza y casco */}
      <Circle cx={103} cy={114} r={14} fill="#F2C29B" />
      <Path d="M88 114 Q88 94 103 94 Q120 94 120 112 L126 114 L120 118 L88 118 Z" fill={C.navy} />
      {/* brazos y bate */}
      {swing ? (
        <G>
          <Path d="M96 146 L132 160 L134 154 L100 138 Z" fill="#F2C29B" />
          <Rect x={128} y={150} width={92} height={7} rx={3.5} fill="#C9813E" transform="rotate(4 128 154)" />
        </G>
      ) : (
        <G>
          <Path d="M110 142 L126 128 L131 133 L116 150 Z" fill="#F2C29B" />
          <Rect x={124} y={62} width={7} height={74} rx={3.5} fill="#C9813E" transform="rotate(18 128 130)" />
        </G>
      )}
    </G>
  );
}

export default function Zone({ width, showZone, highlight = [], pitch, swing, count, good, bad, onTap }: Props) {
  const { t } = useStore();
  const s = width / VB.w;
  const hl = (k: string) => highlight.includes(k);
  const tap = (h: Hit) => (onTap ? () => onTap(h) : undefined);
  const mark = (h: Hit) => (good === h ? C.green : bad === h ? C.wrong : null);
  const zoneColor = mark('zone') ?? (hl('zone') ? C.gold : C.white);
  const drawZone = showZone || hl('zone') || !!mark('zone');
  const p = pitch ? SPOT[pitch] : null;

  return (
    <View testID="scene-zone" style={{ width, height: VB.h * s }}>
      <Svg width={width} height={VB.h * s} viewBox={`0 0 ${VB.w} ${VB.h}`}>
        {/* Todo el fondo se puede tocar: cuenta como "otra parte" */}
        <G onPress={tap('none')}>
          <Rect x={0} y={0} width={VB.w} height={VB.h} rx={22} fill="#BFDBFE" />
          <Rect x={0} y={84} width={VB.w} height={216} fill={C.grass} />
          <Path d={`M0 300 L0 150 Q180 92 360 150 L360 300 Z`} fill={C.dirt} />
          <Path d={`M30 300 L30 176 Q180 128 330 176 L330 300 Z`} fill={C.grass} />
          <Path d="M110 300 Q180 236 250 300 Z" fill={C.dirt} />
          <Rect x={0} y={78} width={VB.w} height={8} fill="#1F5E22" />
        </G>
        {/* Montículo y pitcher al fondo */}
        <G onPress={tap('mound')}>
          <Ellipse cx={MOUND.x} cy={MOUND.y + 8} rx={30} ry={8} fill={C.dirt} stroke={mark('mound') ?? 'none'} strokeWidth={mark('mound') ? 3 : 0} />
          <Circle cx={MOUND.x} cy={MOUND.y - 16} r={5} fill="#F2C29B" />
          <Rect x={MOUND.x - 5} y={MOUND.y - 11} width={10} height={14} rx={3} fill={C.navy} />
          <Rect x={MOUND.x - 5} y={MOUND.y + 2} width={4} height={8} fill="#E2E8F0" />
          <Rect x={MOUND.x + 1} y={MOUND.y + 2} width={4} height={8} fill="#E2E8F0" />
          <Circle cx={MOUND.x} cy={MOUND.y} r={28} fill="#000" fillOpacity={0.001} />
        </G>
        {/* Primera base, lejos a la derecha */}
        <G onPress={tap('first')}>
          <Rect x={FIRST.x - 6} y={FIRST.y - 3} width={12} height={6} fill={C.white} />
          {mark('first') ? <Circle cx={FIRST.x} cy={FIRST.y} r={14} fill="none" stroke={mark('first')!} strokeWidth={3} /> : null}
          <Circle cx={FIRST.x} cy={FIRST.y} r={22} fill="#000" fillOpacity={0.001} />
        </G>
        {/* Home: la placa, vista un poco desde arriba */}
        <Polygon points={`${PLATE.l},${PLATE.y} ${PLATE.r},${PLATE.y} ${PLATE.r},${PLATE.y + 8} 180,${PLATE.y + 18} ${PLATE.l},${PLATE.y + 8}`} fill={C.white} stroke={hl('plate') ? C.gold : '#8a6a44'} strokeWidth={hl('plate') ? 4 : 1.2} />
        <Batter swing={swing} />
        <G onPress={tap('none')}>
          <Rect x={80} y={92} width={50} height={186} fill="#000" fillOpacity={0.001} />
        </G>
        {/* Ancho de home: líneas desde la placa hasta la zona */}
        {hl('plate') ? (
          <G>
            <Line x1={PLATE.l} y1={PLATE.y} x2={PLATE.l} y2={CHEST} stroke={C.gold} strokeWidth={3} strokeDasharray="6 5" />
            <Line x1={PLATE.r} y1={PLATE.y} x2={PLATE.r} y2={CHEST} stroke={C.gold} strokeWidth={3} strokeDasharray="6 5" />
          </G>
        ) : null}
        {/* Alto: de las rodillas al pecho del bateador */}
        {hl('height') ? (
          <G>
            <Line x1={96} y1={CHEST} x2={PLATE.r + 10} y2={CHEST} stroke={C.gold} strokeWidth={3} strokeDasharray="6 5" />
            <Line x1={96} y1={KNEES} x2={PLATE.r + 10} y2={KNEES} stroke={C.gold} strokeWidth={3} strokeDasharray="6 5" />
            <Path d={`M${PLATE.r + 22} ${CHEST + 4} L${PLATE.r + 22} ${KNEES - 4}`} stroke={C.gold} strokeWidth={3} />
            <Path d={`M${PLATE.r + 15} ${CHEST + 12} L${PLATE.r + 22} ${CHEST + 2} L${PLATE.r + 29} ${CHEST + 12}`} fill="none" stroke={C.gold} strokeWidth={3} />
            <Path d={`M${PLATE.r + 15} ${KNEES - 12} L${PLATE.r + 22} ${KNEES - 2} L${PLATE.r + 29} ${KNEES - 12}`} fill="none" stroke={C.gold} strokeWidth={3} />
          </G>
        ) : null}
        {/* Zona de strike */}
        {drawZone ? (
          <Rect x={ZONE_RECT.x} y={ZONE_RECT.y} width={ZONE_RECT.w} height={ZONE_RECT.h} fill={zoneColor} fillOpacity={mark('zone') || hl('zone') ? 0.32 : 0.16} stroke={zoneColor} strokeWidth={3.5} strokeDasharray={mark('zone') ? undefined : '8 6'} />
        ) : null}
        <G onPress={tap('zone')}>
          <Rect x={ZONE_RECT.x - 8} y={ZONE_RECT.y - 8} width={ZONE_RECT.w + 16} height={ZONE_RECT.h + 16} fill="#000" fillOpacity={0.001} />
        </G>
        {/* Lanzamiento: estela desde el pitcher y la pelota */}
        {p ? (
          <G>
            <Path d={`M${MOUND.x + 4} ${MOUND.y - 12} Q${(MOUND.x + p.x) / 2} ${Math.min(MOUND.y, p.y) - 30} ${p.x} ${p.y}`} fill="none" stroke={C.white} strokeWidth={3} strokeOpacity={0.7} strokeDasharray="2 6" strokeLinecap="round" />
            {pitch === 'ground' ? <Ellipse cx={p.x} cy={p.y + 10} rx={12} ry={3} fill="#7A5A3A" /> : null}
            <Circle testID="pitch-ball" cx={p.x} cy={p.y} r={10} fill={C.white} stroke={C.lineDark} strokeWidth={1.5} />
            <Path d={`M${p.x - 5} ${p.y - 8} Q${p.x - 1} ${p.y} ${p.x - 5} ${p.y + 8}M${p.x + 5} ${p.y - 8} Q${p.x + 1} ${p.y} ${p.x + 5} ${p.y + 8}`} fill="none" stroke={C.red} strokeWidth={1.4} />
            {pitch === 'body' ? <Circle cx={p.x} cy={p.y} r={18} fill="none" stroke={C.gold} strokeWidth={3} /> : null}
          </G>
        ) : null}
      </Svg>
      {/* Conteo: siempre bolas primero, strikes después */}
      {count ? (
        <View
          testID="count"
          pointerEvents="none"
          style={{ position: 'absolute', right: 10 * s, top: 10 * s, flexDirection: 'row', gap: 6, backgroundColor: C.navy, borderRadius: 12, padding: 6, borderWidth: 3, borderColor: hl('count') ? C.gold : C.navy }}
        >
          {([['balls', count[0], C.green], ['strikes', count[1], C.red]] as const).map(([k, n, col]) => (
            <View key={k} style={{ alignItems: 'center', minWidth: 54 }}>
              <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11, color: '#CBD5E1' }}>{t(`board.${k}`)}</Text>
              <Text style={{ fontFamily: F.display, fontSize: 30, lineHeight: 32, color: col === C.green ? '#4ADE80' : '#F87171' }}>{String(n)}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
