import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Pattern, Rect, Stop } from 'react-native-svg';
import { LockIcon } from '@/components/Art';
import { tapFeedback } from '@/components/ui';
import { shopOpen, useStore } from '@/state/store';
import { C, F } from '@/theme';

// Pasto de la barra de abajo: el mismo verde, briznas y franjas de cortadora de los minijuegos.
function speckles(n: number, seed: number, w: number, h: number) {
  let x = seed;
  const r = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, () => [r() * w, r() * h, r()] as const);
}
const GRASS_DOTS = speckles(40, 3, 18, 18);

function GrassBg({ count }: { count: number }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none">
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="tabGrass" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#3F8F3A" />
            <Stop offset="1" stopColor="#2F7A2B" />
          </LinearGradient>
          <Pattern id="tabGrassTex" width={18} height={18} patternUnits="userSpaceOnUse">
            {GRASS_DOTS.map(([x, y, k], i) => (
              <Line key={i} x1={x} y1={y} x2={x + (k - 0.5) * 2} y2={y - 2 - k * 2} stroke={k > 0.5 ? '#2F6B2A' : '#6BBF5F'} strokeWidth={0.8} opacity={0.5} />
            ))}
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#tabGrass)" />
        {Array.from({ length: count }, (_, i) =>
          i % 2 ? <Rect key={i} x={`${(i * 100) / count}%`} y="0" width={`${100 / count}%`} height="100%" fill="#FFFFFF" opacity={0.08} /> : null,
        )}
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#tabGrassTex)" />
      </Svg>
      {/* raya de cal arriba, como la línea del campo */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 4, backgroundColor: '#FFFFFF' }} />
    </View>
  );
}

function Icon({ name, active }: { name: string; active: boolean }) {
  const c = active ? C.red : '#FFD43B';
  const fill = active ? C.red : 'none';
  switch (name) {
    case 'camino':
      return <Svg width={26} height={26} viewBox="0 0 24 24"><Path d="M12 3l8 8v9h-5v-6H9v6H4v-9z" fill={fill} stroke={c} strokeWidth={2} strokeLinejoin="round" /></Svg>;
    case 'ranking':
      return <Svg width={26} height={26} viewBox="0 0 24 24"><Path d="M4 20V12h4v8M10 20V6h4v14M16 20V9h4v11" fill={fill} stroke={c} strokeWidth={2} strokeLinejoin="round" /></Svg>;
    case 'album':
      return (
        <Svg width={26} height={26} viewBox="0 0 24 24">
          <Rect x={4} y={4} width={7} height={9} rx={1.5} fill={fill} stroke={c} strokeWidth={2} />
          <Rect x={13} y={4} width={7} height={9} rx={1.5} fill={fill} stroke={c} strokeWidth={2} />
          <Rect x={4} y={15} width={16} height={5} rx={1.5} fill={fill} stroke={c} strokeWidth={2} />
        </Svg>
      );
    case 'pelotin':
      // Pelotín con gorra
      return (
        <Svg width={26} height={26} viewBox="0 0 24 24">
          <Circle cx={12} cy={13.5} r={8} fill={active ? '#FFE4E6' : 'none'} stroke={c} strokeWidth={2} />
          <Path d="M4.5 10.5a7.5 6.5 0 0 1 15 0z" fill={c} />
          <Path d="M14 10.5h7a1 1 0 0 1 0 2h-7z" fill={c} />
        </Svg>
      );
    default:
      return <Svg width={26} height={26} viewBox="0 0 24 24"><Circle cx={12} cy={8} r={4} fill={fill} stroke={c} strokeWidth={2} /><Path d="M4 21a8 8 0 0 1 16 0" fill={fill} stroke={c} strokeWidth={2} /></Svg>;
  }
}

const LABEL: Record<string, string> = { camino: 'tabs.learn', ranking: 'tabs.ranking', album: 'tabs.album', pelotin: 'tabs.pelotin', perfil: 'tabs.profile' };

export default function TabsLayout() {
  const { t, p } = useStore();
  const open = shopOpen(p);
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigateToTab }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, paddingBottom: Math.max(insets.bottom, 12), backgroundColor: '#3F8F3A' }}>
          <GrassBg count={state.routes.length} />
          {state.routes.map((r, i) => {
            const active = state.index === i;
            return (
              <Pressable
                key={r.key}
                testID={`tab-${r.name}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  tapFeedback();
                  navigateToTab(r.key);
                }}
                style={{ alignItems: 'center', minWidth: 64, minHeight: 48, gap: 2, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 14, backgroundColor: active ? '#FFFFFF' : 'transparent' }}
              >
                <View>
                  <Icon name={r.name} active={active} />
                  {r.name === 'pelotin' && !open ? (
                    <View style={{ position: 'absolute', right: -8, top: -4 }}>
                      <LockIcon size={13} />
                    </View>
                  ) : null}
                </View>
                <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 12, maxWidth: 76, fontFamily: active ? F.bodyHeavy : F.bodyBold, color: active ? C.red : '#FFD43B', textShadowColor: active ? 'transparent' : 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>{t(LABEL[r.name] ?? r.name)}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="camino" />
      <Tabs.Screen name="ranking" />
      <Tabs.Screen name="album" />
      <Tabs.Screen name="pelotin" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
