# Pelotín (antes «Kids All Star»)

App tipo Duolingo para que niños de 6 a 13 años aprendan béisbol jugando.
Fuente única del contenido: `docs/guion-v2.md` (documento "Kids All Star – Contenido Niveles 1-4", Versión 2).

Hecha con **React Native + Expo** (SDK 58): un solo código para iPhone, Android y una vista web de prueba.

## Qué está construido

| Parte | Estado |
|---|---|
| Elegir idioma al abrir la app (español, inglés, chino simplificado, japonés) y cambiarlo en Perfil sin perder progreso | Listo |
| Bienvenida, nombre de jugador obligatorio (apodo revisado) y país | Listo |
| Nivel 1 completo: 5 lecciones × 6 actividades + examen de 12 preguntas (80 % para aprobar), en los 4 idiomas | Listo |
| Demostración animada en el diamante 2D, narrada por la mascota con voz en el idioma elegido | Listo (voz del sistema; ver "Voz") |
| Los 5 tipos de actividad: selección con imágenes, verdadero/falso, tocar en el campo, arrastrar, ¿qué cantaría el umpire? | Listo |
| Si falla: se repite el pedazo clave de la demostración y la pregunta vuelve al final | Listo |
| XP (10 por acierto, +5 lección perfecta, +50 examen), pelotas (1 por acierto, +3 perfecta, +10 examen), racha diaria con hitos 3/7/14/30 | Listo |
| Suscripción Plus: Nivel 1 gratis; niveles 2-4 con candado Plus; puerta para papás; USD 4.99/mes o USD 39.99/año; restaurar y gestionar | Listo (falta conectar RevenueCat y las tiendas) |
| Scoreboard semanal: mi liga, mi país y mundial | Listo (falta conectar Firebase; sin él muestra jugadores de ejemplo) |
| Álbum (una tarjeta por lección) y perfil con insignias | Listo |
| Niveles 2, 3 y 4 | Aparecen en el camino con el candado Plus; su contenido se construye después de aprobar el Nivel 1 |

## Probarla

```bash
npm install
npx expo start          # escanea el QR con Expo Go o abre la vista web con "w"
```

Sin claves, la app corre en **modo de prueba**: la compra se simula (no cobra) y el scoreboard muestra jugadores de ejemplo.

## Revisión contra el guion (Prompts 5 y 6)

```bash
npx tsx tools/verificar.ts 1
```

Reporta, sin corregir nada: lecciones y actividades contra el guion, respuestas que no coinciden, claves de texto por idioma (faltan/sobran), términos de béisbol que no coinciden con el glosario y texto escrito fijo en el código.

## Dónde vive cada cosa

```
docs/guion-v2.md                    el guion (fuente única)
src/content/levels.ts               estructura de lecciones y RESPUESTAS CORRECTAS (iguales en los 4 idiomas)
src/i18n/locales/<idioma>/content.json   textos de lecciones y examen
src/i18n/locales/<idioma>/ui.json        textos de la interfaz
src/i18n/locales/<idioma>/glossary.json  glosario del documento
src/app/                            pantallas (idioma, bienvenida, nombre, camino, lección, examen, ranking, álbum, perfil, papás)
src/services/billing.ts             suscripción (RevenueCat → Apple / Google)
src/services/scoreboard.ts          scoreboard (Firebase)
src/services/moderation.ts          revisión de apodos
src/services/speech.ts              voz de la mascota
firebase/                           reglas e índices de Firestore
tools/verificar.ts                  revisión de los Prompts 5 y 6
```

Ningún texto está escrito en las pantallas: todo sale de los archivos de idioma por clave.

## Conectar la suscripción (Apple y Google)

1. **App Store Connect**: crea la app (`com.pelotin.app`), categoría **Kids** (6-8 y 9-11), y un grupo de suscripciones con `kas_plus_monthly` (USD 4.99) y `kas_plus_annual` (USD 39.99). Elige el nivel de precio equivalente para cada país.
2. **Google Play Console**: crea la app, únete al programa **Designed for Families** y crea las mismas dos suscripciones.
3. **RevenueCat**: crea el proyecto, conecta las dos tiendas, crea el entitlement `plus` y la offering `default` con los paquetes Monthly y Annual.
4. Copia `.env.example` como `.env` y pon las claves públicas de RevenueCat.
5. Inscríbete en el Programa para Pequeñas Empresas de Apple y en el de Google para pagar 15 % de comisión en lugar de 30 %.

## Conectar el scoreboard (Firebase)

1. Crea un proyecto en Firebase, activa **Authentication → Anónimo** y **Firestore**.
2. Publica `firebase/firestore.rules` y `firebase/firestore.indexes.json`.
3. Pon la configuración web en `.env`.

Pendiente en el servidor:
- La función semanal que sube y baja de liga, con grupos de unos 30 jugadores. Mientras no exista, todos empiezan y se quedan en "Novatos".
- Una segunda revisión de apodos antes de mostrarlos a otros niños.

## Publicar

```bash
npm install -g eas-cli
eas login
eas build --platform all --profile production
eas submit --platform all
```

Antes de enviar:
- **Política de privacidad** publicada. La app la enlaza en `pelotin.app/privacy` y los términos en `pelotin.app/terms`; cambia esas direcciones en `src/app/papas.tsx` si usas otras.
- **Formulario de privacidad de Apple y Data safety de Google.** Solo se guarda apodo, país y XP, sin anuncios ni rastreo.
- **Capturas de tienda** en los 4 idiomas, y los textos de la ficha (Prompt 7).

## Voz

Hoy la mascota habla con la voz del sistema del teléfono: es-US, en-US, zh-CN y ja-JP. El documento pide voces infantiles grabadas en los 4 idiomas. Cuando existan, se cambian en `src/services/speech.ts` sin tocar las pantallas.

## Traducciones

El español es el texto exacto del guion, verificado palabra por palabra. El inglés, el chino y el japonés de las lecciones los tradujo Claude usando el glosario del documento. Deben revisarlos hablantes nativos antes de publicar.
