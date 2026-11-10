import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Ellipse, G, Path, Rect } from 'react-native-svg';
import { CoinBall, LockIcon, Mascot } from '@/components/Art';
import PelotinBody from '@/components/PelotinBody';
import TutorialBubble from '@/components/TutorialBubble';
import { tapFeedback } from '@/components/ui';
import { GIFT_CAP, SHOP, SHOP_BY_ID, type Avatar, type BatLook, type CapLook, type ShopItem, type ShopKind } from '@/content/shop';
import { speak, stopSpeaking } from '@/services/speech';
import { avatarOf, ownedOf, shopOpen, useStore } from '@/state/store';
import { C, F } from '@/theme';

// Mi Pelotín: el vestidor. Arriba, Pelotín de cuerpo completo; debajo, su número y la tienda.
// Al tocar algo, Pelotín se lo prueba; si le gusta, lo compra con sus pelotas (nunca con dinero real).
// La primera vez (o con el botón "?") sale el tutorial: número → gorra de regalo → final.

type Step = 'number' | 'gift' | 'end' | null;
const KINDS: { kind: ShopKind; label: string }[] = [
  { kind: 'cap', label: 'shop.caps' },
  { kind: 'uniform', label: 'shop.uniforms' },
  { kind: 'bat', label: 'shop.bats' },
];

function wearing(a: Avatar, it: ShopItem): boolean {
  return it.kind === 'cap' ? a.cap === it.id : it.kind === 'uniform' ? a.uniform === it.id : a.bat === it.id;
}
function tryOn(a: Avatar, it: ShopItem | undefined): Avatar {
  if (!it) return a;
  return it.kind === 'cap' ? { ...a, cap: it.id } : it.kind === 'uniform' ? { ...a, uniform: it.id } : { ...a, bat: it.id };
}

function BatThumb({ look, size }: { look: BatLook; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <G transform="translate(30 54) rotate(35)">
        <Path d="M-2 0 L-2 -20 Q-5.5 -29 -5.5 -42 Q-5.5 -47 0 -47 Q5.5 -47 5.5 -42 Q5.5 -29 2 -20 L2 0 Z" fill={look.wood} stroke={look.edge} strokeWidth={2} />
        <Rect x={-2.6} y={-9} width={5.2} height={8} rx={1.5} fill={look.grip} />
        <Ellipse cx={0} cy={1} rx={4.5} ry={2.6} fill={look.grip} />
      </G>
    </Svg>
  );
}

function Thumb({ it, avatar }: { it: ShopItem; avatar: Avatar }) {
  if (it.kind === 'cap') {
    const l = it.look as CapLook;
    return <Mascot size={62} cap={l.cap} star={l.star} />;
  }
  if (it.kind === 'bat') return <BatThumb look={it.look as BatLook} size={62} />;
  return <PelotinBody avatar={{ ...avatar, uniform: it.id }} height={70} />;
}

export default function PelotinScreen() {
  const { p, t, locale, buy, equip, setNumber, giftCap, finishShopIntro } = useStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const avatar = avatarOf(p);
  const owned = ownedOf(p);
  const open = shopOpen(p);
  const [kind, setKind] = useState<ShopKind>('cap');
  const [preview, setPreview] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [step, setStep] = useState<Step>(null);

  // Tutorial: arranca solo la primera vez que entra después de aprobar el nivel 1.
  useFocusEffect(
    useCallback(() => {
      if (open && p.shopIntro !== 'done') setStep((s) => s ?? 'number');
      return () => stopSpeaking();
    }, [open, p.shopIntro]),
  );
  useEffect(() => {
    if (!step) return;
    const key = step === 'number' ? 'shop.tut2' : step === 'gift' ? 'shop.tut3' : 'shop.tut4';
    speak(t(key), locale);
  }, [step, t, locale]);

  const shown = tryOn(avatar, preview ? SHOP_BY_ID[preview] : undefined);
  const sel = preview ? SHOP_BY_ID[preview] : undefined;

  const pick = (it: ShopItem) => {
    tapFeedback();
    setMsg(null);
    if (step === 'gift') {
      if (it.id !== GIFT_CAP) return;
      giftCap();
      setPreview(null);
      setStep('end');
      return;
    }
    if (owned.includes(it.id)) {
      equip(it.id);
      setPreview(null);
    } else setPreview(it.id);
  };

  const doBuy = () => {
    if (!sel) return;
    const r = buy(sel.id);
    if (r === 'ok') {
      setPreview(null);
      setMsg(t('shop.bought'));
    } else if (r === 'coins') setMsg(t('shop.needCoins', { n: sel.price - p.coins }));
  };

  const changeNum = (d: number) => {
    tapFeedback();
    setNumber((avatar.number + d + 100) % 100);
  };

  if (!open) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 18 }}>
        <PelotinBody avatar={avatar} height={200} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <LockIcon size={26} />
          <Text testID="shop-locked" style={{ flexShrink: 1, fontFamily: F.bodyBold, fontSize: 17, lineHeight: 24, color: C.navy, textAlign: 'center' }}>
            {t('shop.lockedTab')}
          </Text>
        </View>
      </View>
    );
  }

  const items = SHOP.filter((i) => i.kind === kind);
  const cols = width >= 520 ? 4 : 3;
  const cardW = (Math.min(width, 600) - 32 - (cols - 1) * 10) / cols;
  const hl = (on: boolean) => (on ? { borderWidth: 3, borderColor: C.gold, borderRadius: 18, boxShadow: `0 0 0 4px rgba(255,184,28,0.35)` } : {});

  let action: React.ReactNode = null;
  if (sel && !step) {
    const locked = sel.reward ? t('shop.reward', { n: sel.reward }) : sel.unlock && !p.examsPassed[String(sel.unlock)] ? t('shop.lockedLevel', { n: sel.unlock }) : null;
    action = locked ? (
      <Text style={{ fontFamily: F.bodyBold, fontSize: 15, color: C.muted, textAlign: 'center' }}>{locked}</Text>
    ) : (
      <Pressable
        testID="shop-buy"
        accessibilityRole="button"
        onPress={doBuy}
        style={{ backgroundColor: p.coins >= sel.price ? C.green : '#94A3B8', borderRadius: 16, paddingVertical: 14, alignItems: 'center', boxShadow: `0 5px 0 ${p.coins >= sel.price ? '#15803D' : '#64748B'}` } as object}
      >
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 18, color: C.white, letterSpacing: 1 }}>{t('shop.buy', { n: sel.price })}</Text>
      </Pressable>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: 8, backgroundColor: C.bg, borderBottomWidth: 3, borderBottomColor: '#2F7D33', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ flex: 1, fontFamily: F.display, fontSize: 26, color: C.navy }}>{t('shop.title')}</Text>
        <Pressable testID="shop-help" accessibilityRole="button" accessibilityLabel={t('shop.help')} onPress={() => setStep('number')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: C.lineDark, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 18, color: C.navy }}>?</Text>
        </Pressable>
        <View testID="shop-coins" style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} accessibilityLabel={t('path.coinsA11y', { n: p.coins })}>
          <CoinBall size={24} />
          <Text style={{ fontFamily: F.bodyHeavy, fontSize: 18, color: C.ink }}>{p.coins}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Pelotín en grande, con lo que se está probando */}
        <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 6, backgroundColor: '#48A64C' }}>
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 46, backgroundColor: '#C98B4F' }} />
          <View testID="shop-avatar">
            <PelotinBody avatar={shown} height={210} holdBat face={{ mood: step === 'end' ? 'cheer' : 'happy' }} />
          </View>
          {sel ? (
            <View style={{ position: 'absolute', top: 10, left: 12, backgroundColor: C.navy, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13, color: C.white }}>{t('shop.trying')}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ padding: 16, gap: 14 }}>
          {step ? (
            <TutorialBubble
              text={t(step === 'number' ? 'shop.tut2' : step === 'gift' ? 'shop.tut3' : 'shop.tut4')}
              okLabel={t('shop.ok')}
              onOk={
                step === 'number'
                  ? () => {
                      setKind('cap');
                      setPreview(null);
                      setStep('gift');
                    }
                  : step === 'end'
                    ? () => {
                        stopSpeaking();
                        finishShopIntro();
                        setStep(null);
                      }
                    : undefined
              }
            />
          ) : null}

          {/* Número del uniforme */}
          <View style={[{ backgroundColor: C.white, borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderColor: C.line }, hl(step === 'number')]}>
            <Text style={{ flex: 1, fontFamily: F.bodyHeavy, fontSize: 17, color: C.navy }}>{t('shop.number')}</Text>
            <Pressable testID="num-less" accessibilityRole="button" accessibilityLabel={t('shop.less')} onPress={() => changeNum(-1)} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: F.display, fontSize: 28, color: C.white, lineHeight: 32 }}>−</Text>
            </Pressable>
            <Text testID="num-value" accessibilityLabel={t('shop.numberA11y', { n: avatar.number })} style={{ width: 56, textAlign: 'center', fontFamily: F.display, fontSize: 34, color: C.red }}>
              {avatar.number}
            </Text>
            <Pressable testID="num-more" accessibilityRole="button" accessibilityLabel={t('shop.more')} onPress={() => changeNum(1)} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: F.display, fontSize: 28, color: C.white, lineHeight: 32 }}>+</Text>
            </Pressable>
          </View>

          {/* Categorías */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {KINDS.map((k) => {
              const on = kind === k.kind;
              return (
                <Pressable
                  key={k.kind}
                  testID={`shop-tab-${k.kind}`}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: on }}
                  onPress={() => {
                    if (step === 'gift') return;
                    tapFeedback();
                    setKind(k.kind);
                    setPreview(null);
                    setMsg(null);
                  }}
                  style={{ flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: 'center', backgroundColor: on ? C.navy : C.white, borderWidth: 2, borderColor: on ? C.navy : C.line }}
                >
                  <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: on ? C.white : C.navy }}>{t(k.label)}</Text>
                </Pressable>
              );
            })}
          </View>

          {action}
          {msg ? (
            <Text testID="shop-msg" style={{ fontFamily: F.bodyBold, fontSize: 15, color: C.navy, textAlign: 'center' }}>
              {msg}
            </Text>
          ) : null}

          {/* Cosas para comprar */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {items.map((it) => {
              const mine = owned.includes(it.id);
              const on = wearing(avatar, it);
              const lockedLv = it.reward ?? (it.unlock && !p.examsPassed[String(it.unlock)] ? it.unlock : 0);
              const isGift = step === 'gift' && it.id === GIFT_CAP;
              return (
                <Pressable
                  key={it.id}
                  testID={`item-${it.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={t(`shop.item.${it.id}`)}
                  onPress={() => pick(it)}
                  style={[
                    {
                      width: cardW,
                      backgroundColor: C.white,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: preview === it.id ? C.navy : on ? C.green : C.line,
                      padding: 8,
                      alignItems: 'center',
                      gap: 4,
                      opacity: step === 'gift' && !isGift ? 0.35 : 1,
                    },
                    hl(isGift),
                  ]}
                >
                  <View style={{ height: 74, alignItems: 'center', justifyContent: 'center' }}>
                    <Thumb it={it} avatar={avatar} />
                  </View>
                  <Text numberOfLines={2} style={{ fontFamily: F.bodyBold, fontSize: 13, lineHeight: 16, color: C.navy, textAlign: 'center', minHeight: 32 }}>
                    {t(`shop.item.${it.id}`)}
                  </Text>
                  {on ? (
                    <Text style={{ fontFamily: F.bodyHeavy, fontSize: 12, color: C.green }}>{t('shop.wearing')}</Text>
                  ) : mine ? (
                    <Text style={{ fontFamily: F.bodyHeavy, fontSize: 12, color: C.navy }}>{t('shop.wear')}</Text>
                  ) : isGift ? (
                    <Text style={{ fontFamily: F.bodyHeavy, fontSize: 12, color: C.green }}>{t('shop.free')}</Text>
                  ) : lockedLv ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <LockIcon size={14} />
                      <Text style={{ fontFamily: F.bodyHeavy, fontSize: 12, color: C.muted }}>{t('shop.levelShort', { n: lockedLv })}</Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <CoinBall size={16} />
                      <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: p.coins >= it.price ? C.ink : C.muted }}>{it.price}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
