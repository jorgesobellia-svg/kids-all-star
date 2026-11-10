#!/bin/sh
# Prepara la versión web para Netlify (probadores). Uso: sh tools/contenido/web_netlify.sh CARPETA_SALIDA
# Netlify Drop no sube carpetas llamadas node_modules, y ahí exporta Expo las letras: se renombran a "nm".
set -e
OUT=${1:-dist-netlify}
rm -rf "$OUT"
EXPO_PUBLIC_TESTERS=1 EXPO_OFFLINE=1 CI=1 npx expo export --platform web --output-dir "$OUT" >/dev/null
mv "$OUT/assets/node_modules" "$OUT/assets/nm"
grep -rl '/assets/node_modules/' "$OUT/_expo" | xargs sed -i 's#/assets/node_modules/#/assets/nm/#g'
printf '/*  /index.html  200\n' > "$OUT/_redirects"
! grep -rq 'node_modules' "$OUT/_expo" || { echo "quedan rutas node_modules"; exit 1; }
echo "listo: $OUT"
