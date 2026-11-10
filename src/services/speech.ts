import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { VOICE_ES_FILES, VOICE_ES_INDEX } from '@/content/voiceEs';
import { Platform } from 'react-native';
import { SPEECH_LANG, type Locale } from '@/i18n';
import { playSfx } from './sfx';

// Voz de la mascota. En español usa la voz grabada (Alex) cuando la frase está grabada;
// si no, y en los otros idiomas, usa la voz del sistema (es-US, en-US, zh-CN, ja-JP).
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

// ------------------------------------------------------------ voz grabada
type Clip = [number, number, number];
const voicePlayers: Record<number, AudioPlayer> = {};
let activeClip: AudioPlayer | null = null;
let clipTimer: ReturnType<typeof setTimeout> | null = null;

// El saludo con el nombre ("¡Hola, Claude! ...") no puede ir grabado: suena "¡Hola!" grabado y sigue la frase.
const HELLO_RX = /^¡Hola, [^!]+! /;

function clipsFor(text: string, locale: Locale): Clip[] | null {
  if (locale !== 'es') return null;
  const whole = VOICE_ES_INDEX[text];
  if (whole) return [whole];
  const m = text.match(HELLO_RX);
  if (m) {
    const hello = VOICE_ES_INDEX['¡Hola!'];
    const rest = VOICE_ES_INDEX[text.slice(m[0].length)];
    if (hello && rest) return [hello, rest];
  }
  return null;
}

function stopClip() {
  if (clipTimer) clearTimeout(clipTimer);
  clipTimer = null;
  if (activeClip) {
    try {
      activeClip.pause();
    } catch {
      // nada
    }
  }
  activeClip = null;
}

function playClips(clips: Clip[], id: number, onDone?: () => void) {
  const [file, start, dur] = clips[0];
  try {
    if (!voicePlayers[file]) voicePlayers[file] = createAudioPlayer(VOICE_ES_FILES[file]);
    const pl = voicePlayers[file];
    activeClip = pl;
    // En el teléfono el archivo carga en segundo plano: hay que esperar a que esté listo
    // y a que termine el salto al inicio de la frase antes de darle play.
    whenLoaded(pl, id, () => {
      pl.seekTo(start, 0, 0)
        .catch(() => {})
        .then(() => {
          if (id !== current) return;
          pl.play();
          clipTimer = setTimeout(() => {
            if (id !== current) return;
            stopClip();
            if (clips.length > 1) playClips(clips.slice(1), id, onDone);
            else onDone?.();
          }, dur * 1000 + 80);
        });
    });
  } catch {
    onDone?.();
  }
}

function whenLoaded(pl: AudioPlayer, id: number, go: () => void) {
  if (pl.isLoaded) return go();
  let done = false;
  const sub = pl.addListener('playbackStatusUpdate', (st) => {
    if (done || !st.isLoaded) return;
    done = true;
    sub.remove();
    if (id === current) go();
  });
  // Por si el aviso no llega: se intenta igual pasado un momento.
  setTimeout(() => {
    if (done) return;
    done = true;
    sub.remove();
    if (id === current) go();
  }, 1500);
}

export function speak(text: string, locale: Locale, onDone?: () => void, o: VoiceOpts = {}): void {
  const id = ++current;
  stopClip();
  const clips = clipsFor(text, locale);
  if (clips) {
    const s0 = webSynth();
    if (s0) {
      try {
        s0.cancel();
      } catch {
        // nada
      }
    } else if (Platform.OS !== 'web') Speech.stop();
    playClips(clips, id, onDone);
    return;
  }
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
  stopClip();
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
 * Voz del umpire: "Safe!" si acierta, "You're out!" si falla. Es un archivo de audio
 * (suena igual en todos los teléfonos). En béisbol se canta en inglés en todos los países,
 * por eso no se traduce. Cuando termina, sigue la mascota con la retroalimentación (onDone).
 */
export function umpireCall(kind: 'safe' | 'out', _locale: Locale, onDone?: () => void): void {
  stopSpeaking();
  const id = current;
  playSfx(kind);
  setTimeout(() => {
    if (id === current) onDone?.();
  }, kind === 'safe' ? 1000 : 1150);
}
