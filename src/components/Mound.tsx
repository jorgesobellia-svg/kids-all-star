import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import type { PitcherPose } from '@/content/types';
import { C } from '@/theme';

// Escena del montículo vista de lado (Niveles 9 y 11): la goma, el pitcher y sus posturas.
// No se dibuja ninguna distancia con número: la distancia a home cambia con la edad y la liga.
const VB = { w: 360, h: 240 };
const SKIN = '#F2C29B';

function Body({ pose }: { pose: PitcherPose }) {
  // Pitcher derecho mirando hacia home (a la izquierda).
  const x = 196;
  const feetY = 150;
  const legs =
    pose === 'release' ? (
      <G>
        <Path d={`M${x} 112 L${x - 36} ${feetY}`} stroke="#E2E8F0" strokeWidth={9} strokeLinecap="round" />
        <Path d={`M${x} 112 L${x + 22} ${feetY}`} stroke="#E2E8F0" strokeWidth={9} strokeLinecap="round" />
      </G>
    ) : pose === 'windup' || pose === 'balk' ? (
      <G>
        <Path d={`M${x} 112 L${x - 4} ${feetY}`} stroke="#E2E8F0" strokeWidth={9} strokeLinecap="round" />
        <Path d={`M${x} 112 L${x - 22} 124 L${x - 14} 138`} stroke="#E2E8F0" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>
    ) : (
      <G>
        <Path d={`M${x} 112 L${x - 10} ${feetY}`} stroke="#E2E8F0" strokeWidth={9} strokeLinecap="round" />
        <Path d={`M${x} 112 L${x + 10} ${feetY}`} stroke="#E2E8F0" strokeWidth={9} strokeLinecap="round" />
      </G>
    );
  const arms =
    pose === 'windup' || pose === 'balk' ? (
      <G>
        <Path d={`M${x - 6} 78 L${x - 14} 46`} stroke={SKIN} strokeWidth={7} strokeLinecap="round" />
        <Path d={`M${x + 6} 78 L${x + 2} 46`} stroke={SKIN} strokeWidth={7} strokeLinecap="round" />
        <Circle cx={x - 6} cy={42} r={9} fill={C.brown} />
      </G>
    ) : pose === 'set' ? (
      <G>
        <Path d={`M${x - 6} 80 L${x - 12} 96 L${x} 98`} stroke={SKIN} strokeWidth={7} strokeLinecap="round" fill="none" />
        <Path d={`M${x + 6} 80 L${x + 10} 96 L${x} 98`} stroke={SKIN} strokeWidth={7} strokeLinecap="round" fill="none" />
        <Circle cx={x} cy={98} r={9} fill={C.brown} />
      </G>
    ) : pose === 'pickoff' ? (
      <G>
        <Path d={`M${x + 6} 80 L${x + 40} 70`} stroke={SKIN} strokeWidth={7} strokeLinecap="round" />
        <Path d={`M${x - 6} 80 L${x - 22} 96`} stroke={SKIN} strokeWidth={7} strokeLinecap="round" />
        <Circle cx={x - 24} cy={98} r={8} fill={C.brown} />
      </G>
    ) : (
      <G>
        <Path d={`M${x - 6} 80 L${x - 40} 92`} stroke={SKIN} strokeWidth={7} strokeLinecap="round" />
        <Path d={`M${x + 6} 80 L${x + 24} 100`} stroke={SKIN} strokeWidth={7} strokeLinecap="round" />
        <Circle cx={x + 26} cy={104} r={8} fill={C.brown} />
      </G>
    );
  return (
    <G>
      {legs}
      <Rect x={x - 14} y={72} width={28} height={44} rx={9} fill={C.red} />
      {arms}
      <Circle cx={x} cy={58} r={13} fill={SKIN} />
      <Path d={`M${x - 14} 56 Q${x - 14} 40 ${x} 40 Q${x + 14} 40 ${x + 14} 54 Z`} fill={C.navy} />
      <Rect x={x - 24} y={51} width={14} height={5} rx={2} fill={C.navy} />
    </G>
  );
}

function Grip({ kind }: { kind: 'fastball' | 'changeup' }) {
  // Primer plano de la mano y la bola.
  return (
    <G>
      <Circle cx={180} cy={120} r={58} fill={C.white} stroke="#CBD5E1" strokeWidth={2} />
      <Path d="M136 92 Q180 120 136 150" fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="5 4" />
      <Path d="M224 92 Q180 120 224 150" fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="5 4" />
      {kind === 'fastball' ? (
        <G>
          <Rect x={160} y={42} width={16} height={74} rx={8} fill={SKIN} stroke="#C9956E" strokeWidth={1.5} />
          <Rect x={184} y={42} width={16} height={74} rx={8} fill={SKIN} stroke="#C9956E" strokeWidth={1.5} />
          <Ellipse cx={180} cy={190} rx={22} ry={12} fill={SKIN} stroke="#C9956E" strokeWidth={1.5} />
        </G>
      ) : (
        <G>
          <Rect x={150} y={60} width={15} height={66} rx={7.5} fill={SKIN} stroke="#C9956E" strokeWidth={1.5} />
          <Rect x={168} y={48} width={15} height={74} rx={7.5} fill={SKIN} stroke="#C9956E" strokeWidth={1.5} />
          <Rect x={186} y={50} width={15} height={72} rx={7.5} fill={SKIN} stroke="#C9956E" strokeWidth={1.5} />
          <Rect x={204} y={62} width={15} height={62} rx={7.5} fill={SKIN} stroke="#C9956E" strokeWidth={1.5} />
          <Path d="M146 150 Q180 136 214 150" fill="none" stroke={SKIN} strokeWidth={14} strokeLinecap="round" />
        </G>
      )}
    </G>
  );
}

export default function Mound({ width, pose = 'set', highlight = [] }: { width: number; pose?: PitcherPose; highlight?: string[] }) {
  const s = width / VB.w;
  const rubberOn = highlight.includes('rubber');
  return (
    <View testID="scene-mound" style={{ width, height: VB.h * s }}>
      <Svg width={width} height={VB.h * s} viewBox={`0 0 ${VB.w} ${VB.h}`}>
        <Rect x={0} y={0} width={VB.w} height={VB.h} rx={22} fill="#BFDBFE" />
        <Rect x={0} y={150} width={VB.w} height={90} fill={C.grass} />
        {pose === 'fastball' || pose === 'changeup' ? (
          <G>
            <Rect x={0} y={0} width={VB.w} height={VB.h} rx={22} fill="#E8EEF7" />
            <Grip kind={pose} />
          </G>
        ) : pose === 'rest' ? (
          <G>
            {/* Dugout: el pitcher descansa sentado después de su salida */}
            <Rect x={40} y={70} width={280} height={120} rx={14} fill="#5B4636" />
            <Rect x={70} y={150} width={220} height={14} rx={4} fill="#C9A27A" />
            <Rect x={166} y={112} width={28} height={40} rx={9} fill={C.red} />
            <Circle cx={180} cy={100} r={13} fill={SKIN} />
            <Path d="M166 98 Q166 82 180 82 Q194 82 194 96 Z" fill={C.navy} />
            <Rect x={192} y={118} width={22} height={18} rx={6} fill="#93C5FD" />
          </G>
        ) : (
          <G>
            {/* Montículo, goma y home a la izquierda (sin distancia con número) */}
            <Path d="M110 152 Q196 112 282 152 Z" fill={C.dirt} />
            <Rect x={176} y={146} width={40} height={6} rx={2} fill={C.white} stroke={rubberOn ? C.gold : '#8a6a44'} strokeWidth={rubberOn ? 3 : 1} />
            {rubberOn ? <Ellipse cx={196} cy={149} rx={30} ry={12} fill="none" stroke={C.gold} strokeWidth={4} /> : null}
            <Path d="M18 154 L40 154 L44 158 L29 164 L14 158 Z" fill={C.white} stroke="#8a6a44" strokeWidth={1} />
            {highlight.includes('distance') ? (
              <G>
                <Line x1={34} y1={176} x2={190} y2={176} stroke={C.gold} strokeWidth={4} strokeDasharray="8 6" />
                <Path d="M42 168 L30 176 L42 184" fill="none" stroke={C.gold} strokeWidth={4} />
                <Path d="M182 168 L194 176 L182 184" fill="none" stroke={C.gold} strokeWidth={4} />
              </G>
            ) : null}
            {pose === 'pickoff' ? (
              <G>
                <Rect x={316} y={146} width={16} height={8} fill={C.white} />
                <Line x1={240} y1={70} x2={318} y2={140} stroke={C.white} strokeWidth={3} strokeDasharray="4 6" />
              </G>
            ) : null}
            {pose === 'release' ? <Line x1={150} y1={92} x2={40} y2={130} stroke={C.white} strokeWidth={3} strokeDasharray="4 6" /> : null}
            {pose === 'warm' ? (
              <G>
                <Path d="M60 150 L60 110" stroke="#E2E8F0" strokeWidth={8} strokeLinecap="round" />
                <Rect x={48} y={78} width={24} height={36} rx={8} fill={C.blue} />
                <Circle cx={60} cy={66} r={11} fill={SKIN} />
                <Path d="M86 92 Q140 60 160 90" fill="none" stroke={C.white} strokeWidth={3} strokeDasharray="3 6" />
              </G>
            ) : null}
            <Body pose={pose === 'warm' ? 'set' : pose} />
            {pose === 'balk' ? (
              <G>
                <Circle cx={262} cy={58} r={22} fill={C.wrong} stroke={C.white} strokeWidth={3} />
                <Line x1={250} y1={46} x2={274} y2={70} stroke={C.white} strokeWidth={5} strokeLinecap="round" />
                <Line x1={274} y1={46} x2={250} y2={70} stroke={C.white} strokeWidth={5} strokeLinecap="round" />
              </G>
            ) : null}
          </G>
        )}
      </Svg>
    </View>
  );
}
