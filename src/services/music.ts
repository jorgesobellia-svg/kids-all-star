import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';

// Música de entrada: órgano de estadio con público ("Baseball stadium organ crowd", Locran).
// Suena en bucle en las pantallas de inicio (idioma → bienvenida → apodo) y se apaga
// al entrar al juego. Ver docs/creditos.md.
const SRC = require('../../assets/music/intro-estadio.mp3');
const VOLUME = 0.55;

let player: AudioPlayer | null = null;
let wanted = false;
let webUnlockArmed = false;

function get(): AudioPlayer | null {
  try {
    if (!player) {
      if (Platform.OS !== 'web') setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
      player = createAudioPlayer(SRC);
      player.loop = true;
      player.volume = VOLUME;
    }
    return player;
  } catch {
    return null;
  }
}

// En la web el navegador no deja sonar nada hasta que la persona toca la pantalla:
// se vuelve a intentar con el primer toque.
function armWebUnlock() {
  if (Platform.OS !== 'web' || webUnlockArmed || typeof document === 'undefined') return;
  webUnlockArmed = true;
  const go = () => {
    document.removeEventListener('pointerdown', go, true);
    document.removeEventListener('keydown', go, true);
    webUnlockArmed = false;
    if (wanted) get()?.play();
  };
  document.addEventListener('pointerdown', go, true);
  document.addEventListener('keydown', go, true);
}

export function startIntroMusic(): void {
  if (wanted) return;
  wanted = true;
  const p = get();
  if (!p) return;
  try {
    p.play();
  } catch {
    // sin audio: la app sigue igual
  }
  armWebUnlock();
}

export function stopIntroMusic(): void {
  if (!wanted) return;
  wanted = false;
  try {
    player?.pause();
    player?.seekTo(0);
  } catch {
    // nada
  }
}
