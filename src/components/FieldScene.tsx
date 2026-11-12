import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Fans } from '@/components/GameKit';
import HighField, { FIELDERS, HF, type Stage } from '@/components/HighField';
import PelotinBat, { BAT_FEET, BAT_H, type BatPose } from '@/components/PelotinBat';
import PelotinBody, { BODY_H, BODY_W } from '@/components/PelotinBody';
import type { Avatar } from '@/content/shop';

// El campo de los minijuegos con la cámara alta detrás del home: gradas con público,
// fildeadores (el último es el pitcher), el bateador de perfil en su caja y la zona de strike.

export default function FieldScene({
  st,
  team,
  pitcher,
  pitcherUp = false,
  batter,
  batterPose = 'box',
  batterMood = 'happy',
  cheering = false,
  zone = true,
  children,
}: {
  st: Stage;
  team: Avatar;
  pitcher: Avatar;
  pitcherUp?: boolean;
  batter: Avatar;
  batterPose?: BatPose;
  batterMood?: 'happy' | 'cheer' | 'think';
  cheering?: boolean;
  zone?: boolean;
  children?: React.ReactNode;
}) {
  const { s } = st;
  const kb = HF.batter.h / BAT_H;
  const Z = HF.zone;
  return (
    <>
      <Svg width={st.W} height={st.H} viewBox={st.viewBox} style={{ position: 'absolute' }}>
        <HighField />
        {zone ? <Rect x={Z.l} y={Z.t} width={Z.r - Z.l} height={Z.b - Z.t} fill="#FDE047" fillOpacity={0.22} stroke="#FACC15" strokeWidth={2} strokeDasharray="5 3" rx={2} /> : null}
      </Svg>
      <Fans box={HF.stands} s={s} ox={st.cam.x} oy={st.cam.y} cheering={cheering} />
      {FIELDERS.map(([x, y, h], i) => {
        const isPitcher = i === FIELDERS.length - 1;
        const bh = h * s;
        return (
          <View key={i} pointerEvents="none" style={{ position: 'absolute', left: st.X(x) - (BODY_W * bh) / BODY_H / 2, top: st.Y(y - h) - (isPitcher && pitcherUp ? 4 * s : 0) }}>
            <PelotinBody avatar={isPitcher ? pitcher : team} height={bh} face={{ mood: isPitcher && pitcherUp ? 'cheer' : 'happy' }} />
          </View>
        );
      })}
      <View pointerEvents="none" style={{ position: 'absolute', left: st.X(HF.batter.x - BAT_FEET.x * kb), top: st.Y(HF.batter.y - BAT_FEET.y * kb) }}>
        <PelotinBat avatar={batter} height={BAT_H * kb * s} pose={batterPose} mood={batterMood} />
      </View>
      {children}
    </>
  );
}
