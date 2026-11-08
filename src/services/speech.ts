import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { SPEECH_LANG, type Locale } from '@/i18n';

// Voz de la mascota. Por ahora usa la voz del sistema en el idioma elegido
// (es-US, en-US, zh-CN, ja-JP). Cuando existan las grabaciones con voces infantiles,
// se reemplaza aquí por audio grabado, sin tocar las pantallas.
//
// En navegadores (y en el iPhone) la voz solo se permite después de que el niño toca
// la pantalla: unlockSpeech() se llama en cada toque y "despierta" la voz la primera vez.

let current = 0;

type WebSynth = {
  speak: (u: unknown) => void;
  cancel: () => void;
  getVoices: () => { lang: string; localService?: boolean; name: string }[];
};

function webSynth(): WebSynth | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const w = window as unknown as { speechSynthesis?: WebSynth };
  return w.speechSynthesis ?? null;
}

let unlocked = false;
// Chrome descarta la frase si nadie guarda la referencia.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let keep: unknown = null;

export function unlockSpeech(): void {
  if (unlocked) return;
  const s = webSynth();
  if (!s) {
    unlocked = true;
    return;
  }
  try {
    const U = (window as unknown as { SpeechSynthesisUtterance: new (t: string) => { volume: number } }).SpeechSynthesisUtterance;
    const u = new U(' ');
    u.volume = 0;
    s.speak(u);
    unlocked = true;
  } catch {
    // sin voz en este navegador
  }
}

function pickVoice(s: WebSynth, lang: string) {
  const voices = s.getVoices();
  const norm = (l: string) => l.replace('_', '-').toLowerCase();
  const full = norm(lang);
  const base = full.split('-')[0];
  return (
    voices.find((v) => norm(v.lang) === full) ??
    voices.find((v) => norm(v.lang).startsWith(base + '-') && v.localService) ??
    voices.find((v) => norm(v.lang).startsWith(base))
  );
}

interface VoiceOpts {
  lang?: string;
  pitch?: number;
  rate?: number;
}

function speakWeb(s: WebSynth, text: string, locale: Locale, id: number, onDone?: () => void, o: VoiceOpts = {}) {
  try {
    s.cancel();
  } catch {
    // nada
  }
  // Chrome a veces ignora una frase dicha justo después de cancel(); se espera un instante.
  setTimeout(() => {
    if (id !== current) return;
    try {
      const W = window as unknown as {
        SpeechSynthesisUtterance: new (t: string) => {
          lang: string;
          rate: number;
          pitch: number;
          voice: unknown;
          onend: (() => void) | null;
          onerror: (() => void) | null;
        };
      };
      const u = new W.SpeechSynthesisUtterance(text);
      const lang = o.lang ?? SPEECH_LANG[locale];
      u.lang = lang;
      u.rate = o.rate ?? (locale === 'ja' || locale === 'zh-Hans' ? 0.9 : 0.95);
      u.pitch = o.pitch ?? 1.15;
      const v = pickVoice(s, lang);
      if (v) u.voice = v;
      u.onend = () => id === current && onDone?.();
      u.onerror = () => id === current && onDone?.();
      keep = u;
      s.speak(u);
    } catch {
      onDone?.();
    }
  }, 80);
}

export function speak(text: string, locale: Locale, onDone?: () => void, o: VoiceOpts = {}): void {
  const id = ++current;
  const s = webSynth();
  if (Platform.OS === 'web') {
    if (s) speakWeb(s, text, locale, id, onDone, o);
    else onDone?.();
    return;
  }
  Speech.stop();
  try {
    Speech.speak(text, {
      language: o.lang ?? SPEECH_LANG[locale],
      rate: o.rate ?? (locale === 'ja' || locale === 'zh-Hans' ? 0.9 : 0.95),
      pitch: o.pitch ?? 1.15,
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
  const s = webSynth();
  if (s) {
    try {
      s.cancel();
    } catch {
      // nada
    }
    keep = null;
    return;
  }
  Speech.stop();
}

/**
 * Voz del umpire: "Safe!" si acierta, "You're out!" si falla. En béisbol se canta en inglés
 * en todos los países (en Japón también: セーフ y アウト suenan igual), por eso no se traduce.
 * Voz grave y fuerte; después sigue la mascota con la retroalimentación (onDone).
 */
export function umpireCall(kind: 'safe' | 'out', locale: Locale, onDone?: () => void): void {
  speak(kind === 'safe' ? 'Safe!' : "You're out!", locale, onDone, { lang: 'en-US', pitch: 0.6, rate: kind === 'safe' ? 0.85 : 0.95 });
}
