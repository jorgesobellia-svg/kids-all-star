import { Redirect } from 'expo-router';
import { useStore } from '@/state/store';

export default function Index() {
  const { p } = useStore();
  // Primera vez: el video de entrada y después elegir idioma.
  if (!p.locale && !p.introSeen) return <Redirect href="/intro" />;
  if (!p.locale) return <Redirect href="/idioma" />;
  if (!p.nickname) return <Redirect href="/bienvenida" />;
  return <Redirect href="/camino" />;
}
