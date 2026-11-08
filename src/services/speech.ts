import * as Speech from 'expo-speech';
import { SPEECH_LANG, type Locale } from '@/i18n';

// Voz de la mascota. Por ahora usa la voz del sistema en el idioma elegido
// (es-US, en-US, zh-CN, ja-JP). Cuando existan las grabaciones con voces infantiles,
// se reemplaza aquí por audio grabado, sin tocar las pantallas.

let current = 0;

export function speak(text: string, locale: Locale, onDone?: () => void): void {
  const id = ++current;
  Speech.stop();
  try {
    Speech.speak(text, {
      language: SPEECH_LANG[locale],
      rate: locale === 'ja' || locale === 'zh-Hans' ? 0.9 : 0.95,
      pitch: 1.15,
      onDone: () => {
        if (id === current) onDone?.();
      },
      onStopped: () => {},
      onError: () => {
        if (id === current) onDone?.();
      },
    });
  } catch {
    onDone?.();
  }
}

export function stopSpeaking(): void {
  current++;
  Speech.stop();
}
