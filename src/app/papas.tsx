import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon, CheckIcon } from '@/components/Art';
import ParentGate from '@/components/ParentGate';
import { Body, Btn, H1 } from '@/components/ui';
import { getPrices, manageSubscription, purchase, restore, TEST_MODE, type Plan } from '@/services/billing';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

// Puerta para papás: una multiplicación que un niño de 6 años no resuelve por accidente.
// Detrás de la puerta está la única pantalla con pagos de toda la app.

const PRIVACY_URL = 'https://pelotin.app/privacy';
const TERMS_URL = 'https://pelotin.app/terms';

function PlanCard({ id, title, price, per, on, onPick, recommended }: { id: Plan; title: string; price: string; per: string; on: boolean; onPick: (p: Plan) => void; recommended: string }) {
    return (
      <Pressable
        testID={`plan-${id}`}
        accessibilityRole="radio"
        accessibilityState={{ selected: on }}
        onPress={() => onPick(id)}
        style={{ flex: 1, borderRadius: 18, borderWidth: 3, borderColor: on ? C.red : C.lineDark, backgroundColor: on ? C.redSoft : C.white, padding: 14, gap: 4, minHeight: 120 }}
      >
        {id === 'annual' ? (
          <View style={{ alignSelf: 'flex-start', backgroundColor: C.gold, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11, color: C.navy }}>{recommended}</Text>
          </View>
        ) : (
          <View style={{ height: 19 }} />
        )}
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.ink }}>{title}</Text>
        <Text style={{ fontFamily: F.display, fontSize: 24, color: C.ink }}>{price}</Text>
        <Text style={{ fontFamily: F.bodyBold, fontSize: 14, color: C.muted }}>{per}</Text>
      </Pressable>
    );
  }

export default function ParentsScreen() {
  const { t, p, setPlus, setReview, locale, reset } = useStore();
  const [askReset, setAskReset] = useState(false);
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<Plan>('annual');
  const [prices, setPrices] = useState({ monthly: 'USD 4.99', annual: 'USD 39.99' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) getPrices().then(setPrices);
  }, [open]);

  if (!open) return <ParentGate onClose={() => router.back()} onPass={() => setOpen(true)} />;

  const buy = async () => {
    setBusy(true);
    setMsg(null);
    const r = await purchase(plan);
    setBusy(false);
    if (r === 'active') setPlus(true);
    else if (r === 'error') setMsg(t('parents.error'));
  };

  const doRestore = async () => {
    setBusy(true);
    const ok = await restore();
    setBusy(false);
    if (ok) setPlus(true);
    setMsg(ok ? t('parents.restored') : t('parents.nothingToRestore'));
  };


  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.close')} onPress={() => router.back()} style={{ width: 44, height: 44, justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, color: C.muted }}>✕</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <AppIcon size={64} />
          <H1 style={{ flex: 1 }}>{t('parents.title')}</H1>
        </View>
        {p.plus ? (
          <View style={{ backgroundColor: C.greenSoft, borderRadius: 16, padding: 16 }}>
            <Text testID="plus-active" style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: '#166534' }}>{t('parents.active')}</Text>
          </View>
        ) : (
          <>
            <Body>{t('parents.intro')}</Body>
            <View style={{ gap: 10 }}>
              {['parents.benefit1', 'parents.benefit2', 'parents.benefit3'].map((k) => (
                <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
                    <CheckIcon size={16} />
                  </View>
                  <Text style={{ fontFamily: F.bodySemi, fontSize: 16, color: C.ink, flex: 1 }}>{t(k)}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <PlanCard id="monthly" title={t('parents.monthly')} price={prices.monthly} per={t('parents.perMonth')} on={plan === 'monthly'} onPick={setPlan} recommended={t('parents.recommended')} />
              <PlanCard id="annual" title={t('parents.annual')} price={prices.annual} per={t('parents.perYear')} on={plan === 'annual'} onPick={setPlan} recommended={t('parents.recommended')} />
            </View>
            {busy ? <ActivityIndicator color={C.red} /> : <Btn testID="subscribe" label={t('parents.subscribe')} onPress={buy} />}
          </>
        )}
        {msg ? <Text style={{ fontFamily: F.bodyBold, fontSize: 15, color: C.muted, textAlign: 'center' }}>{msg}</Text> : null}
        <View style={{ gap: 4 }}>
          <Pressable accessibilityRole="button" testID="restore" onPress={doRestore} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.blue, textAlign: 'center' }}>{t('parents.restore')}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => manageSubscription()} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.blue, textAlign: 'center' }}>{t('parents.manage')}</Text>
          </Pressable>
        </View>
        <Text style={{ fontFamily: F.body, fontSize: 12, lineHeight: 17, color: C.muted }}>{t('parents.legal')}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(`${PRIVACY_URL}?lang=${locale}`)} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.bodyBold, fontSize: 13, color: C.muted, textDecorationLine: 'underline' }}>{t('parents.privacy')}</Text>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(`${TERMS_URL}?lang=${locale}`)} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.bodyBold, fontSize: 13, color: C.muted, textDecorationLine: 'underline' }}>{t('parents.terms')}</Text>
          </Pressable>
        </View>
        {TEST_MODE ? <Text style={{ fontFamily: F.bodyBold, fontSize: 12, color: C.brown, textAlign: 'center' }}>{t('parents.testMode')}</Text> : null}
        {/* Solo en la demo de prueba: abrir todos los niveles para revisarlos. No existe en la app de las tiendas. */}
        {TEST_MODE ? (
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: !!p.review }}
            testID="review-toggle"
            onPress={() => setReview(!p.review)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 16, padding: 14, borderWidth: 2, borderColor: p.review ? C.green : C.line }}
          >
            <View style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: p.review ? C.green : C.lineDark, padding: 3, alignItems: p.review ? 'flex-end' : 'flex-start' }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.white }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: C.ink }}>{t('parents.reviewTitle')}</Text>
              <Text style={{ fontFamily: F.body, fontSize: 13, lineHeight: 18, color: C.muted }}>{t('parents.reviewText')}</Text>
            </View>
          </Pressable>
        ) : null}
        {/* Empezar de cero: borra el avance de este dispositivo (con confirmación dentro de la app). */}
        {askReset ? (
          <View testID="reset-confirm" style={{ backgroundColor: C.wrongSoft, borderRadius: 16, padding: 16, gap: 12 }}>
            <Text style={{ fontFamily: F.bodySemi, fontSize: 15, lineHeight: 21, color: '#991B1B' }}>{t('parents.resetAsk')}</Text>
            <Btn
              testID="reset-yes"
              label={t('parents.resetYes')}
              variant="wrong"
              onPress={() => {
                const plus = p.plus;
                reset();
                // La compra sigue siendo de la cuenta de la tienda; no se pierde al empezar de cero.
                if (plus) setPlus(true);
                router.replace('/');
              }}
            />
            <Pressable accessibilityRole="button" onPress={() => setAskReset(false)} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Text style={{ fontFamily: F.bodyHeavy, fontSize: 16, color: C.navy, textAlign: 'center' }}>{t('parents.resetNo')}</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable accessibilityRole="button" testID="reset" onPress={() => setAskReset(true)} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 15, color: C.wrong, textAlign: 'center' }}>{t('parents.resetBtn')}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
