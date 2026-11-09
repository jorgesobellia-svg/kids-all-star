import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BadgeMedal, BallBadge, CoinBall, Flame, LockIcon, Mascot, StarIcon } from '@/components/Art';
import { LEVELS, STAGE_SUFFIX, stageOf } from '@/content/levels';
import { content, translate } from '@/i18n';
import { initials } from '@/services/moderation';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: F.display, fontSize: 22, color: C.ink }}>{value}</Text>
        <Text style={{ fontFamily: F.bodyBold, fontSize: 13, color: C.muted }}>{label}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { t, p, locale } = useStore();
  const insets = useSafeAreaInsets();
  const ct = content(locale);
  const levelNow = LEVELS.find((l) => !p.examsPassed[String(l.n)])?.n ?? LEVELS.length;
  const cards = Object.keys(p.completed).length;


  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 30, gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center' }}>
          <Mascot size={74} />
        </View>
        <View style={{ flex: 1 }}>
          <Text testID="profile-name" style={{ fontFamily: F.display, fontSize: 30, color: C.ink }}>
            {p.nickname}
          </Text>
          <Text style={{ fontFamily: F.bodySemi, fontSize: 15, color: C.muted }}>{t(`profile.stage${STAGE_SUFFIX[stageOf(levelNow)]}`, { n: levelNow })}</Text>
        </View>
        <BallBadge text={initials(p.nickname ?? '')} size={48} ink={C.red} ring={C.red} ringWidth={3.5} fontSize={13} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat icon={<Flame size={30} />} value={String(p.streak.count)} label={t('profile.streak')} />
        <Stat icon={<CoinBall size={28} />} value={p.xp.toLocaleString('en-US')} label={t('profile.xp')} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat icon={<StarIcon size={28} color={C.red} stroke={C.red} />} value={t(`ranking.league_${p.league}`)} label={t('profile.league')} />
        <Stat icon={<CoinBall size={28} />} value={String(cards)} label={t('profile.cards')} />
      </View>

      <View style={{ backgroundColor: C.white, borderRadius: 16, padding: 16, gap: 12 }}>
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.ink }}>{t('profile.badges')}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {LEVELS.map((lv) => {
            const earned = !!p.examsPassed[String(lv.n)];
            const name = (ct.levels as Record<string, { badge: string }>)[String(lv.n)].badge;
            return (
              <View key={lv.n} style={{ alignItems: 'center', gap: 6, width: 76 }}>
                <BadgeMedal earned={earned} level={lv.n} />
                <Text style={{ fontFamily: F.bodyBold, fontSize: 12, color: earned ? C.ink : C.muted, textAlign: 'center' }}>{name}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <Pressable
        testID="profile-language"
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/idioma', params: { from: 'profile' } })}
        style={{ backgroundColor: C.white, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64 }}
      >
        <BallBadge text={translate(locale, `language.code_${locale}`)} size={46} fontSize={13} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: F.bodyBold, fontSize: 13, color: C.muted }}>{t('profile.language')}</Text>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 17, color: C.ink }}>{translate(locale, `language.name_${locale}`)}</Text>
        </View>
        <Text style={{ fontSize: 22, color: C.muted }}>›</Text>
      </Pressable>

      <Pressable
        testID="profile-parents"
        accessibilityRole="button"
        onPress={() => router.push('/papas')}
        style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <LockIcon size={18} color={C.muted} />
        <Text style={{ fontFamily: F.bodyBold, fontSize: 15, color: C.muted }}>{p.plus ? `${t('profile.parents')} · ${t('profile.plusActive')}` : t('profile.parents')}</Text>
      </Pressable>
    </ScrollView>
  );
}
