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

echo "→ Copie dans l'application Android"
WWW=android/app/src/main/assets/www
rm -rf "$WWW"
mkdir -p "$(dirname "$WWW")"
cp -R out-apk "$WWW"

echo "→ Gradle assembleDebug"
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
(cd android && "$GRADLE" --no-daemon -q assembleDebug)

mkdir -p dist
cp android/app/build/outputs/apk/debug/app-debug.apk dist/DigiStore-demo.apk
echo "✓ dist/DigiStore-demo.apk ($(du -h dist/DigiStore-demo.apk | cut -f1))"
