import { Barlow_500Medium, Barlow_600SemiBold, Barlow_700Bold, Barlow_800ExtraBold } from '@expo-google-fonts/barlow';
import { BarlowCondensed_700Bold, BarlowCondensed_800ExtraBold } from '@expo-google-fonts/barlow-condensed';
import { useFonts } from 'expo-font';
import { getLocales } from 'expo-localization';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { deviceLocale } from '@/i18n';
import { initBilling } from '@/services/billing';
import { StoreProvider, useStore } from '@/state/store';
import { C } from '@/theme';

function BillingSync() {
  const { ready, p, setPlus } = useStore();
  useEffect(() => {
    if (!ready) return;
    initBilling(p.playerId).then((active) => {
      // En modo de prueba se respeta lo que ya estaba guardado.
      if (active) setPlus(true);
    });
  }, [ready, p.playerId, setPlus]);
  return null;
}

function Gate({ children }: { children: React.ReactNode }) {
  const { ready } = useStore();
  if (!ready) return <View style={{ flex: 1, backgroundColor: C.navy }} />;
  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Barlow_500Medium,
    Barlow_600SemiBold,
    Barlow_700Bold,
    Barlow_800ExtraBold,
    BarlowCondensed_700Bold,
    BarlowCondensed_800ExtraBold,
  });
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: C.navy }} />;
  return (
    <SafeAreaProvider>
      <StoreProvider fallbackLocale={deviceLocale(getLocales())}>
        <BillingSync />
        <Gate>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg }, animation: 'slide_from_right' }} />
        </Gate>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
