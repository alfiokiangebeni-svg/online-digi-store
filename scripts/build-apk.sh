#!/usr/bin/env bash
# Construit l'application Android de test (APK de débogage, installable directement).
#
#   1. export statique de la boutique (BUILD_TARGET=apk → out-apk/)
#   2. copie dans android/app/src/main/assets/www
#   3. gradle assembleDebug → dist/DigiStore-demo.apk
#
# Prérequis : Node 20+, JDK 17+, Android SDK (plateforme 35, build-tools 35)
# avec ANDROID_HOME défini, et Gradle 8.13+ (ou GRADLE=chemin/vers/gradle).
set -euo pipefail
cd "$(dirname "$0")/.."

: "${ANDROID_HOME:?Définir ANDROID_HOME (chemin du SDK Android)}"
GRADLE="${GRADLE:-gradle}"

echo "→ Export statique"
rm -rf out-apk
# Next écrit ses fichiers intermédiaires dans .next même en export : on protège le build web.
if [ -d .next ]; then rm -rf .next-web; mv .next .next-web; fi
restore_web_build() { rm -rf .next; if [ -d .next-web ]; then mv .next-web .next; fi; }
trap restore_web_build EXIT
BUILD_TARGET=apk npx next build --webpack

echo "→ Allègement de l'export"
# Pages inutiles dans l'application : vitrine du thème et page hors ligne (pas de service worker).
for l in fr ln en; do rm -rf "out-apk/$l/design" "out-apk/$l/hors-ligne"; done
# __next._full.txt est une copie exacte de index.txt, jamais demandée par la navigation.
find out-apk -name "__next._full.txt" -delete
du -sh out-apk

echo "→ Copie dans l'application Android"
WWW=android/app/src/main/assets/www
rm -rf "$WWW"
mkdir -p "$(dirname "$WWW")"
cp -R out-apk "$WWW"

echo "→ Gradle assembleDebug"
# Repart d'un APK neuf : la mise à jour « sur place » de Gradle laisse sinon l'espace
# des anciennes versions de fichiers dans l'APK (plusieurs Mo perdus).
rm -f android/app/build/outputs/apk/debug/app-debug.apk
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
(cd android && "$GRADLE" --no-daemon -q assembleDebug)

echo "→ Vérification du contenu de l'APK"
APK=android/app/build/outputs/apk/debug/app-debug.apk
# Chaque fichier de l'export doit être dans l'APK (JavaScript et CSS de _next compris).
expected=$(cd out-apk && find . -type f | sed 's|^\./|assets/www/|' | sort)
packed=$(unzip -Z1 "$APK" | grep '^assets/www/' | sort)
missing=$(comm -23 <(echo "$expected") <(echo "$packed"))
if [ -n "$missing" ]; then
  echo "✗ Fichiers absents de l'APK :"; echo "$missing" | head -20; exit 1
fi
echo "✓ $(echo "$packed" | wc -l) fichiers du site dans l'APK, dont $(echo "$packed" | grep -c '_next/') dans _next"

mkdir -p dist
cp "$APK" dist/DigiStore-demo.apk
echo "✓ dist/DigiStore-demo.apk ($(du -h dist/DigiStore-demo.apk | cut -f1))"
