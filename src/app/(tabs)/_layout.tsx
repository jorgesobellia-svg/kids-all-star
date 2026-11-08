import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { tapFeedback } from '@/components/ui';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

function Icon({ name, active }: { name: string; active: boolean }) {
  const c = active ? C.red : C.muted;
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
    default:
      return <Svg width={26} height={26} viewBox="0 0 24 24"><Circle cx={12} cy={8} r={4} fill={fill} stroke={c} strokeWidth={2} /><Path d="M4 21a8 8 0 0 1 16 0" fill={fill} stroke={c} strokeWidth={2} /></Svg>;
  }
}

const LABEL: Record<string, string> = { camino: 'tabs.learn', ranking: 'tabs.ranking', album: 'tabs.album', perfil: 'tabs.profile' };

export default function TabsLayout() {
  const { t } = useStore();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigateToTab }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 2, borderTopColor: C.line, backgroundColor: C.white, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 12) }}>
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
                style={{ alignItems: 'center', minWidth: 72, minHeight: 48, gap: 2 }}
              >
                <Icon name={r.name} active={active} />
                <Text style={{ fontSize: 12, fontFamily: active ? F.bodyHeavy : F.bodyBold, color: active ? C.red : C.muted }}>{t(LABEL[r.name] ?? r.name)}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="camino" />
      <Tabs.Screen name="ranking" />
      <Tabs.Screen name="album" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
