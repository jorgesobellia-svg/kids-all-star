import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';

// Música en bucle (ver docs/creditos.md):
//   intro  -> órgano de estadio con público ("Baseball stadium organ crowd", Locran).
//             Pantallas de inicio: idioma → bienvenida → apodo. Se apaga al entrar al juego.
//   nivel  -> "Take Me Out to the Ball Game" en órgano Hammond (Albert Behar).
//             Suena en el camino de niveles después de aprobar un examen, hasta que el
//             jugador entra a la siguiente lección o examen.
const SOURCES = {
  intro: require('../../assets/music/intro-estadio.mp3'),
  // El mismo ambiente de estadio, más bajito, de fondo durante los minijuegos.
  juego: require('../../assets/music/intro-estadio.mp3'),
  nivel: require('../../assets/music/nivel-organo.mp3'),
};
type Track = keyof typeof SOURCES;
const VOLUME: Record<Track, number> = { intro: 0.55, juego: 0.3, nivel: 0.6 };

const players: Partial<Record<Track, AudioPlayer>> = {};
let playing: Track | null = null;
let modeSet = false;
let webUnlockArmed = false;

function get(name: Track): AudioPlayer | null {
  try {
    if (!modeSet && Platform.OS !== 'web') {
      modeSet = true;
      setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    }
    if (!players[name]) {
      const p = createAudioPlayer(SOURCES[name]);
      p.loop = true;
      p.volume = VOLUME[name];
      players[name] = p;
    }
    return players[name] ?? null;
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
    if (playing) get(playing)?.play();
  };
  document.addEventListener('pointerdown', go, true);
  document.addEventListener('keydown', go, true);
}

function start(name: Track) {
  if (playing === name) return;
  if (playing) stop(playing);
  playing = name;
  try {
    get(name)?.play();
  } catch {
    // sin audio: la app sigue igual
  }
  armWebUnlock();
}

function stop(name: Track) {
  if (playing !== name) return;
  playing = null;
  try {
    players[name]?.pause();
    players[name]?.seekTo(0);
  } catch {
    // nada
  }
}

export const startIntroMusic = () => start('intro');
export const stopIntroMusic = () => stop('intro');

// Celebración de nivel: el examen aprobado la deja pendiente y el camino la toca
// mientras el jugador mira su avance.
let levelPending = false;
export const markLevelPassed = () => {
  levelPending = true;
};
export const clearLevelPassed = () => {
  levelPending = false;
  stop('nivel');
};
export const startLevelMusicIfPending = () => {
  if (levelPending) start('nivel');
};
export const pauseLevelMusic = () => stop('nivel');

/** Ambiente de estadio (público y órgano, bajito) mientras se juega un minijuego. */
export const startGameAmbience = () => start('juego');
export const stopGameAmbience = () => stop('juego');
