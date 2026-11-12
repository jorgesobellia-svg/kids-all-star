import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';

// Efectos de sonido:
//   bat.wav          -> golpe de bate de madera contra la pelota al elegir una opción.
//                       Grabación "Baseball hit - wooden bat" de GFX Sounds (Uppbeat), recortada a 0,38 s.
//                       Ver docs/creditos.md.
//   umpire-safe.wav  -> el umpire canta "Safe!" (respuesta correcta)
//   umpire-out.wav   -> el umpire canta "You're out!" (respuesta incorrecta)
//   pasos.mp3        -> pasos de tenis corriendo en tierra mientras Pelotín corre de base en base en el camino.
//                       Grabación "Footsteps running on gravel (sneakers)" de GFX Sounds, recortada a 3,2 s.
//   publico.wav      -> el público del estadio celebrando (jonrón en ¡A batear!, atrapada en ¡Atrapa la elevada!).
//                       Sintetizado con tools/contenido/gen_publico.py (sin grabaciones de terceros).
// Las voces del umpire se generaron con Kokoro (licencia Apache 2.0). Para usar una
// grabación real, basta reemplazar estos archivos con el mismo nombre.

const SOURCES = {
  bat: require('../../assets/sfx/bat.wav'),
  safe: require('../../assets/sfx/umpire-safe.wav'),
  out: require('../../assets/sfx/umpire-out.wav'),
  steps: require('../../assets/sfx/pasos.mp3'),
  crowd: require('../../assets/sfx/publico.wav'),
};

type Sfx = keyof typeof SOURCES;
const VOLUME: Record<Sfx, number> = { bat: 1, safe: 1, out: 1, steps: 1, crowd: 0.9 };
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

export type { Sfx };

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

/** Detiene un efecto largo (los pasos de Pelotín al llegar a la base). */
export function stopSfx(name: Sfx): void {
  try {
    players[name]?.pause();
  } catch {
    // nada
  }
}

/** Carga los sonidos con anticipación para que el primer "clac" no se retrase. */
export function preloadSfx(): void {
  player('bat');
  player('safe');
  player('out');
  player('crowd');
}
