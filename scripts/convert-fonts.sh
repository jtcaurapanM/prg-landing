#!/usr/bin/env bash
# Conversion de fuentes Gotham TTF/OTF -> WOFF2
# Requiere: pip install fonttools brotli
# Ejecutar desde raiz del proyecto: bash scripts/convert-fonts.sh

set -e

FONTS_SRC="src/assets/fonts"
FONTS_OUT="public/fonts"

mkdir -p "$FONTS_OUT"

echo "Instalando fonttools..."
pip3 install fonttools brotli --quiet

echo "Convirtiendo fuentes..."

do_convert() {
  INPUT="$1"
  OUTPUT="$2"
  if [ -f "$FONTS_SRC/$INPUT" ]; then
    python3 -m fonttools.ttx --flavor woff2 -o "$FONTS_OUT/$OUTPUT" "$FONTS_SRC/$INPUT" 2>/dev/null || \
    python3 -c "
from fontTools.ttLib import TTFont
font = TTFont('$FONTS_SRC/$INPUT')
font.flavor = 'woff2'
font.save('$FONTS_OUT/$OUTPUT')
print('OK: $OUTPUT')
"
  else
    echo "SKIP (no encontrado): $INPUT"
  fi
}

do_convert "Gotham Light.ttf"          "Gotham-Light.woff2"
do_convert "Gotham Light Italic.ttf"   "Gotham-Light-Italic.woff2"
do_convert "Gotham Book Italic.ttf"    "Gotham-Book-Italic.woff2"
do_convert "Gotham Medium.ttf"         "Gotham-Medium.woff2"
do_convert "Gotham Medium Italic.ttf"  "Gotham-Medium-Italic.woff2"
do_convert "Gotham Bold.ttf"           "Gotham-Bold.woff2"
do_convert "Gotham Bold Italic.ttf"    "Gotham-Bold-Italic.woff2"
do_convert "Gotham Ultra.ttf"          "Gotham-Ultra.woff2"
do_convert "Gotham Ultra Italic.otf"   "Gotham-Ultra-Italic.woff2"

echo ""
echo "Fuentes en $FONTS_OUT:"
ls -lh "$FONTS_OUT"
echo "Ahorro estimado vs TTF: ~30-40% por archivo."
