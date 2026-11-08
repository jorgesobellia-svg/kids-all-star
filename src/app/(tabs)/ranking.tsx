import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BallBadge } from '@/components/Art';
import { tapFeedback } from '@/components/ui';
import { initials } from '@/services/moderation';
import { fetchBoard, SCOREBOARD_DEMO, type BoardTab, type Row } from '@/services/scoreboard';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

const INK = [C.blue, C.purple, C.teal, C.brown, C.muted];

export default function RankingScreen() {
  const { t, p } = useStore();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<BoardTab>('league');
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(
    (which: BoardTab) => {
      fetchBoard(which, {
        playerId: p.playerId,
        nickname: p.nickname ?? '',
        country: p.country,
        league: p.league,
        weeklyXp: p.weeklyXp,
        totalXp: p.xp,
        weekId: p.weekId,
      }).then(setRows);
    },
    [p.playerId, p.nickname, p.country, p.league, p.weeklyXp, p.xp, p.weekId],
  );

  useFocusEffect(
    useCallback(() => {
      load(tab);
    }, [load, tab]),
  );

  const countries = t('countries.' + p.country);
  const title = tab === 'league' ? t(`ranking.league_${p.league}`) : tab === 'country' ? countries : t('ranking.tabWorld');
  const sub = tab === 'league' ? t('ranking.leagueSub') : tab === 'country' ? t('ranking.countrySub') : t('ranking.worldSub');

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ backgroundColor: C.navy, paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, letterSpacing: 1.5, color: C.gold }}>{t('ranking.title')}</Text>
          <Text testID="ranking-title" style={{ fontFamily: F.display, fontSize: 32, color: C.white, textTransform: 'uppercase' }}>
            {title}
          </Text>
          <Text style={{ fontFamily: F.body, fontSize: 14, color: '#CBD5E1', textAlign: 'center' }}>{sub}</Text>
        </View>
        <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 4 }}>
          {(['league', 'country', 'world'] as BoardTab[]).map((id) => {
            const on = tab === id;
            const label = id === 'league' ? t('ranking.tabLeague') : id === 'country' ? t('ranking.tabCountry') : t('ranking.tabWorld');
            return (
              <Pressable
                key={id}
                testID={`rtab-${id}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                onPress={() => {
                  tapFeedback();
                  setTab(id);
                }}
                style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: on ? C.white : 'transparent', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: on ? C.navy : C.white }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
        {rows.map((r, i) => {
          const zoneUp = tab === 'league' && i === 5;
          const zoneDown = tab === 'league' && i === 8;
          const posColor = tab === 'league' ? (i < 5 ? C.greenDark : i >= 8 ? C.wrongDark : C.muted) : r.rank <= 3 ? C.brown : C.muted;
          return (
            <View key={`${r.nickname}-${i}`}>
              {zoneUp ? <Zone text={t('ranking.up')} color={C.green} /> : null}
              {zoneDown ? <Zone text={t('ranking.down')} color={C.wrong} /> : null}
              {r.gapBefore ? <Text style={{ textAlign: 'center', color: C.faint, fontSize: 18, lineHeight: 18 }}>⋮</Text> : null}
              <View
                testID={r.me ? 'row-me' : undefined}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 14,
                  backgroundColor: r.me ? C.redSoft : 'transparent',
                  borderWidth: r.me ? 2 : 0,
                  borderColor: C.red,
                }}
              >
                <Text style={{ minWidth: 34, fontFamily: F.bodyHeavy, fontSize: 15, color: posColor }}>{r.rank > 0 ? r.rank.toLocaleString('en-US') : '–'}</Text>
                <BallBadge text={initials(r.nickname)} size={44} ink={r.me ? C.red : INK[i % INK.length]} ring={r.me ? C.red : C.lineDark} ringWidth={r.me ? 3.5 : 2} fontSize={11} />
                <Text numberOfLines={1} style={{ flex: 1, fontFamily: F.bodyBold, fontSize: 16, color: C.ink }}>
                  {r.me ? `${t('ranking.you')} · ${r.nickname}` : r.nickname}
                </Text>
                <View style={{ backgroundColor: C.navy, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ color: C.white, fontFamily: F.bodyHeavy, fontSize: 11 }}>{r.country === 'XX' ? '—' : r.country}</Text>
                </View>
                <Text style={{ minWidth: 70, textAlign: 'right', fontFamily: F.bodyHeavy, fontSize: 14, color: C.muted }}>{r.xp.toLocaleString('en-US')} XP</Text>
              </View>
            </View>
          );
        })}
        {SCOREBOARD_DEMO ? <Text style={{ marginTop: 14, fontFamily: F.body, fontSize: 12, color: C.faint, textAlign: 'center' }}>{t('ranking.demo')}</Text> : null}
      </ScrollView>
    </View>
  );
}

function Zone({ text, color }: { text: string; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
      <View style={{ flex: 1, height: 2, backgroundColor: color }} />
      <Text style={{ fontFamily: F.bodyHeavy, fontSize: 12, color }}>{text}</Text>
      <View style={{ flex: 1, height: 2, backgroundColor: color }} />
    </View>
  );
}
