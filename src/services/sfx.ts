import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';

// Efectos de sonido originales (generados para la app, sin derechos de terceros):
//   bat.wav   -> "clac" del bate al elegir una opción
//   cheer.wav -> ovación del estadio cuando la respuesta es correcta

const SOURCES = {
  bat: require('../../assets/sfx/bat.wav'),
  cheer: require('../../assets/sfx/cheer.wav'),
};

type Sfx = keyof typeof SOURCES;
const VOLUME: Record<Sfx, number> = { bat: 1, cheer: 0.55 };
const players: Partial<Record<Sfx, AudioPlayer>> = {};
let modeSet = false;

function player(name: Sfx): AudioPlayer | null {
  try {
    if (!modeSet && Platform.OS !== 'web') {
      modeSet = true;
      setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    }
    if (!players[name]) {
      const p = createAudioPlayer(SOURCES[name]);
      p.volume = VOLUME[name];
      players[name] = p;
    }
    return players[name] ?? null;
  } catch {
    return null;
  }
}

export function playSfx(name: Sfx): void {
  const p = player(name);
  if (!p) return;
  try {
    p.seekTo(0);
    p.play();
  } catch {
    // sin audio disponible: el juego sigue igual
  }
}

/** Carga los sonidos con anticipación para que el primer "clac" no se retrase. */
export function preloadSfx(): void {
  player('bat');
  player('cheer');
}
