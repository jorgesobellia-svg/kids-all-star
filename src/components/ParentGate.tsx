import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/state/store';
import { C, F } from '@/theme';

// Puerta para papás: una multiplicación que un niño de 6 años no resuelve por accidente.
// Se usa antes de pagos (Zona de padres) y antes de imprimir o compartir el certificado.
export default function ParentGate({ onPass, onClose }: { onPass: () => void; onClose: () => void }) {
  const { t } = useStore();
  const insets = useSafeAreaInsets();
  const [[a, b]] = useState(() => [6 + Math.floor(Math.random() * 4), 12 + Math.floor(Math.random() * 8)]);
  const [val, setVal] = useState('');
  const [wrong, setWrong] = useState(false);
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'ok'];
  const press = (k: string) => {
    setWrong(false);
    if (k === '⌫') setVal((v) => v.slice(0, -1));
    else if (k === 'ok') {
      if (Number(val) === a * b) onPass();
      else {
        setWrong(true);
        setVal('');
      }
    } else if (val.length < 4) setVal((v) => v + k);
  };
  return (
    <View style={{ flex: 1, backgroundColor: C.navy, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20, paddingHorizontal: 24 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={t('common.close')} onPress={onClose} style={{ width: 44, height: 44, justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, color: C.white }}>✕</Text>
      </Pressable>
      <View style={{ alignItems: 'center', gap: 12, marginTop: 10 }}>
        <Text style={{ fontFamily: F.display, fontSize: 30, color: C.white, textAlign: 'center' }}>{t('parents.gateTitle')}</Text>
        <Text style={{ fontFamily: F.body, fontSize: 16, color: '#CBD5E1', textAlign: 'center' }}>{t('parents.gateQuestion')}</Text>
        <Text testID="gate-question" style={{ fontFamily: F.display, fontSize: 44, color: C.gold }}>
          {a} × {b} = {val || '?'}
        </Text>
        {wrong ? <Text style={{ fontFamily: F.bodyBold, fontSize: 15, color: '#FCA5A5' }}>{t('parents.gateWrong')}</Text> : <Text style={{ fontSize: 15 }}> </Text>}
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {keys.map((k) => (
          <Pressable
            key={k}
            testID={`key-${k}`}
            accessibilityRole="button"
            accessibilityLabel={k === 'ok' ? t('parents.gateOk') : k}
            onPress={() => press(k)}
            style={{ width: '30%', height: 64, borderRadius: 16, backgroundColor: k === 'ok' ? C.red : 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: k === 'ok' ? 18 : 26, color: C.white }}>{k === 'ok' ? t('parents.gateOk') : k}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
