import { Redirect } from 'expo-router';
import { useStore } from '@/state/store';

export default function Index() {
  const { p } = useStore();
  if (!p.locale) return <Redirect href="/idioma" />;
  if (!p.nickname) return <Redirect href="/bienvenida" />;
  return <Redirect href="/camino" />;
}
