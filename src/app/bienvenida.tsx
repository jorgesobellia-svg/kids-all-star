import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon, Mascot } from '@/components/Art';
import { Btn } from '@/components/ui';
import { startIntroMusic } from '@/services/music';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

export default function Welcome() {
  useEffect(() => {
    startIntroMusic();
  }, []);
  const { t } = useStore();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: C.navy, alignItems: 'center', paddingTop: insets.top + 70, paddingBottom: insets.bottom + 28, paddingHorizontal: 28, gap: 22 }}>
      <AppIcon size={140} />
      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text style={{ fontFamily: F.display, fontSize: 46, lineHeight: 48, color: C.white, textAlign: 'center' }}>
          {t('welcome.appName1')}
          {'\n'}
          <Text style={{ color: C.gold }}>{t('welcome.appName2')}</Text>
        </Text>
        <Text style={{ fontFamily: F.bodySemi, fontSize: 19, color: '#CBD5E1', textAlign: 'center', lineHeight: 26 }}>{t('welcome.tagline')}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
        <Mascot size={96} />
        <View style={{ backgroundColor: C.white, borderRadius: 16, borderBottomLeftRadius: 4, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 40 }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.navy }}>{t('welcome.mascotHello')}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ width: '100%', gap: 10 }}>
        <Btn testID="welcome-start" label={t('welcome.start')} onPress={() => router.push('/nombre')} />
        <Text style={{ fontFamily: F.body, fontSize: 13, color: C.faint, textAlign: 'center' }}>{t('welcome.footer')}</Text>
      </View>
    </View>
  );
}
