import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Mascot } from '@/components/Art';
import { capLook } from '@/content/shop';
import { avatarOf, useStore } from '@/state/store';
import { C, F } from '@/theme';

/** Globo de Pelotín para el tutorial. */
export default function TutorialBubble({ text, onOk, okLabel }: { text: string; onOk?: () => void; okLabel?: string }) {
  const look = capLook(avatarOf(useStore().p));
  return (
    <View testID="tutorial-bubble" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
      <Mascot size={58} mood="cheer" cap={look.cap} star={look.star} />
      <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 16, borderWidth: 3, borderColor: C.gold, padding: 12, gap: 8 }}>
        <Text style={{ fontFamily: F.bodyBold, fontSize: 16, lineHeight: 22, color: C.navy }}>{text}</Text>
        {onOk ? (
          <Pressable testID="tutorial-ok" accessibilityRole="button" onPress={onOk} style={{ alignSelf: 'flex-end', backgroundColor: C.green, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: C.white }}>{okLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
