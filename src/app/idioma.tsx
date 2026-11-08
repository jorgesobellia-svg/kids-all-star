import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon, BallBadge, CheckIcon } from '@/components/Art';
import { Btn, tapFeedback } from '@/components/ui';
import { LOCALES, translate, type Locale } from '@/i18n';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

export default function LanguageScreen() {
  const { locale, setLocale, p } = useStore();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [sel, setSel] = useState<Locale>(p.locale ?? locale);
  const insets = useSafeAreaInsets();
  const tt = (k: string) => translate(sel, k);

  const confirm = () => {
    setLocale(sel);
    if (from === 'profile') router.back();
    else router.replace(p.nickname ? '/camino' : '/bienvenida');
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.navy, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', gap: 20, paddingBottom: 16 }}>
        <AppIcon size={96} />
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text style={{ color: C.faint, fontFamily: F.bodyBold, fontSize: 15 }}>{tt('language.hello')}</Text>
          <Text style={{ color: C.white, fontFamily: F.display, fontSize: 32, textAlign: 'center' }}>{tt('language.title')}</Text>
        </View>
        <View style={{ width: '100%', gap: 12 }}>
          {LOCALES.map((l) => {
            const on = l === sel;
            return (
              <Pressable
                key={l}
                testID={`lang-${l}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => {
                  tapFeedback();
                  setSel(l);
                }}
                style={{
                  minHeight: 76,
                  borderRadius: 18,
                  backgroundColor: C.white,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingHorizontal: 16,
                  borderWidth: 3,
                  borderColor: on ? C.red : C.white,
                }}
              >
                <BallBadge text={translate(l, `language.code_${l}`)} size={54} fontSize={14} />
                <Text style={{ flex: 1, fontFamily: F.bodyHeavy, fontSize: 22, color: C.ink }}>{translate(l, `language.name_${l}`)}</Text>
                {on ? (
                  <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center' }}>
                    <CheckIcon size={18} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Btn testID="lang-continue" label={tt('common.continue')} onPress={confirm} />
      <Text style={{ color: C.faint, fontFamily: F.body, fontSize: 13, textAlign: 'center', marginTop: 8 }}>{tt('language.note')}</Text>
    </View>
  );
}
