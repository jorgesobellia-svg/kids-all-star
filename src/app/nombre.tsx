import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BallBadge } from '@/components/Art';
import { Body, Btn, H1, ProgressBar, tapFeedback } from '@/components/ui';
import { ui } from '@/i18n';
import { checkNickname, initials } from '@/services/moderation';
import { startIntroMusic, stopIntroMusic } from '@/services/music';
import { submitScore } from '@/services/scoreboard';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

export default function NicknameScreen() {
  useEffect(() => {
    startIntroMusic();
  }, []);
  const { t, locale, p, setPlayer } = useStore();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(p.nickname ?? '');
  const [country, setCountry] = useState(p.country);
  const [picking, setPicking] = useState(false);
  const countries = ui(locale).countries as Record<string, string>;

  const check = checkNickname(name);
  const valid = check === 'ok';
  const hint = useMemo(() => {
    switch (check) {
      case 'chars': return { text: t('nickname.hintChars'), color: C.wrongDark };
      case 'short': return { text: t('nickname.hintMin'), color: C.wrongDark };
      case 'blocked': return { text: t('nickname.hintBlocked'), color: C.wrongDark };
      case 'ok': return { text: t('nickname.hintOk'), color: C.greenDark };
      default: return { text: t('nickname.hintRequired'), color: C.muted };
    }
  }, [check, t]);

  const done = () => {
    const nick = name.trim();
    setPlayer(nick, country);
    submitScore({ playerId: p.playerId, nickname: nick, country, league: p.league, weeklyXp: p.weeklyXp, totalXp: p.xp, weekId: p.weekId });
    stopIntroMusic();
    router.replace('/camino');
  };

  const ideas = [t('nickname.idea1'), t('nickname.idea2'), t('nickname.idea3')];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('common.back')} onPress={() => router.back()} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, color: C.muted, fontFamily: F.bodyBold }}>‹</Text>
          </Pressable>
          <ProgressBar value={0.5} height={12} />
        </View>
        <View style={{ gap: 6 }}>
          <H1>{t('nickname.title')}</H1>
          <Body>{t('nickname.subtitle')}</Body>
        </View>
        <View style={{ gap: 6 }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: C.ink }}>{t('nickname.label')}</Text>
          <TextInput
            testID="nick-input"
            value={name}
            onChangeText={setName}
            placeholder={t('nickname.placeholder')}
            placeholderTextColor={C.faint}
            maxLength={15}
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              height: 56,
              borderRadius: 16,
              paddingHorizontal: 16,
              fontSize: 20,
              fontFamily: F.bodyHeavy,
              color: C.ink,
              backgroundColor: C.white,
              borderWidth: 3,
              borderColor: valid ? C.green : name && !valid ? C.wrong : C.lineDark,
            }}
          />
          <Text style={{ fontFamily: F.bodyBold, fontSize: 13, color: hint.color }}>{hint.text}</Text>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: C.ink }}>{t('nickname.ideasLabel')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {ideas.map((s) => (
              <Pressable key={s} accessibilityRole="button" onPress={() => { tapFeedback(); setName(s); }} style={{ minHeight: 44, paddingHorizontal: 14, borderRadius: 999, borderWidth: 2, borderColor: C.lineDark, backgroundColor: C.white, justifyContent: 'center' }}>
                <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: C.ink }}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Pressable accessibilityRole="button" testID="country-open" onPress={() => setPicking(true)} style={{ backgroundColor: C.white, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: F.bodyBold, fontSize: 13, color: C.muted }}>{t('nickname.countryLabel')}</Text>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 17, color: C.ink }}>{countries[country] ?? country}</Text>
          </View>
          <Text style={{ fontSize: 22, color: C.muted }}>›</Text>
        </Pressable>
        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: C.ink }}>{t('nickname.previewLabel')}</Text>
          <View style={{ backgroundColor: C.redSoft, borderWidth: 2, borderColor: C.red, borderRadius: 14, paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ width: 22, fontFamily: F.bodyHeavy, color: C.greenDark, fontSize: 15 }}>1</Text>
            <BallBadge text={initials(name || t('nickname.yourName'))} size={46} ink={C.red} ring={C.red} ringWidth={3.5} fontSize={12} />
            <Text style={{ flex: 1, fontFamily: F.bodyHeavy, fontSize: 16, color: C.ink }}>{name || t('nickname.yourName')}</Text>
            <View style={{ backgroundColor: C.navy, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ color: C.white, fontFamily: F.bodyHeavy, fontSize: 12 }}>{country === 'XX' ? '—' : country}</Text>
            </View>
          </View>
        </View>
        <Body style={{ fontSize: 13 }}>{t('nickname.safety')}</Body>
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}>
        <Btn testID="nick-done" label={t('nickname.cta')} variant={valid ? 'red' : 'disabled'} onPress={valid ? done : undefined} />
      </View>

      <Modal visible={picking} animationType="slide" transparent onRequestClose={() => setPicking(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(2,11,24,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', paddingBottom: insets.bottom + 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18 }}>
              <Text style={{ flex: 1, fontFamily: F.display, fontSize: 24, color: C.ink }}>{t('country.title')}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={t('common.close')} onPress={() => setPicking(false)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 22, color: C.muted }}>✕</Text>
              </Pressable>
            </View>
            <ScrollView>
              {Object.entries(countries).map(([code, label]) => (
                <Pressable
                  key={code}
                  testID={`country-${code}`}
                  accessibilityRole="button"
                  onPress={() => { setCountry(code); setPicking(false); }}
                  style={{ minHeight: 52, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: code === country ? C.redSoft : C.white, borderBottomWidth: 1, borderBottomColor: C.line }}
                >
                  <View style={{ width: 34, alignItems: 'center', backgroundColor: C.navy, borderRadius: 6, paddingVertical: 2 }}>
                    <Text style={{ color: C.white, fontFamily: F.bodyHeavy, fontSize: 12 }}>{code === 'XX' ? '—' : code}</Text>
                  </View>
                  <Text style={{ fontFamily: F.bodySemi, fontSize: 17, color: C.ink }}>{label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
