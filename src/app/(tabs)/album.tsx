import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CoinBall } from '@/components/Art';
import { ProgressBar } from '@/components/ui';
import { LEVELS } from '@/content/levels';
import { content } from '@/i18n';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

// Una tarjeta coleccionable por cada lección terminada (20 en la etapa Novato).
const COLORS = [C.red, C.navy, C.blue, C.teal, C.purple, C.brown];

export default function AlbumScreen() {
  const { t, p, locale } = useStore();
  const insets = useSafeAreaInsets();
  const titles = content(locale).lessonTitles as Record<string, string>;
  const all = LEVELS.flatMap((l) => l.lessonIds);
  const have = all.filter((id) => p.completed[id]).length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 30, gap: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={{ fontFamily: F.display, fontSize: 32, color: C.ink }}>{t('album.title')}</Text>
        <Text testID="album-count" style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.muted }}>
          {t('album.count', { a: have, b: all.length })}
        </Text>
      </View>
      <ProgressBar value={have / all.length} color={C.gold} height={12} />
      {LEVELS.map((lv) => (
        <View key={lv.n} style={{ gap: 10, marginTop: 8 }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: C.muted }}>{t('album.levelTitle', { n: lv.n })}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {lv.lessonIds.map((id, i) => {
              const got = !!p.completed[id];
              return got ? (
                <View key={id} style={{ width: '31%', height: 150, borderRadius: 16, backgroundColor: COLORS[i % COLORS.length], borderWidth: 3, borderColor: C.white, padding: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: F.display, fontSize: 30, color: C.white }}>{id}</Text>
                  <CoinBall size={28} />
                  <Text numberOfLines={3} style={{ fontFamily: F.bodyHeavy, fontSize: 12, color: C.white, textAlign: 'center' }}>
                    {titles[id]}
                  </Text>
                </View>
              ) : (
                <View key={id} style={{ width: '31%', height: 150, borderRadius: 16, backgroundColor: C.line, borderWidth: 2, borderColor: C.faint, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Text style={{ fontFamily: F.display, fontSize: 34, color: C.muted }}>?</Text>
                  <Text style={{ fontFamily: F.bodyBold, fontSize: 12, color: C.muted, textAlign: 'center' }}>{t('album.locked', { id })}</Text>
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
