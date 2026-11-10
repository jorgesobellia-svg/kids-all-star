// Versión para probadores: no pide la suscripción Plus (ni el muro de padres para pagar);
// los niveles se desbloquean en orden igual que en la app real.
// Solo se activa al compilar con EXPO_PUBLIC_TESTERS=1 (web de Netlify y APK de prueba).
// Las compilaciones para la App Store y Google Play NO deben llevar esa variable.
export const TESTERS = process.env.EXPO_PUBLIC_TESTERS === '1';

// Fecha y hora de la compilación, visible junto a la etiqueta PRUEBA para saber qué versión tiene cada probador.
export const BUILD_STAMP = process.env.EXPO_PUBLIC_BUILD ?? '';
