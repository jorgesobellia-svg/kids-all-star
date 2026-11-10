// Versión para probadores: todos los niveles abiertos, sin pasar por el muro de padres.
// Solo se activa al compilar con EXPO_PUBLIC_TESTERS=1 (web de Netlify y APK de prueba).
// Las compilaciones para la App Store y Google Play NO deben llevar esa variable.
export const TESTERS = process.env.EXPO_PUBLIC_TESTERS === '1';
