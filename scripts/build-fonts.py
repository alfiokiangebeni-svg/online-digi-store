#!/usr/bin/env python3
"""
Génère les polices auto-hébergées de Digi Store (app/fonts/*.woff2).

Charte « di.si store » : Plus Jakarta Sans (titres, 700–800) et DM Sans (texte, 400–700,
taille optique 14). Google Fonts sert ces polices en variables complètes ; on garde ici
les seules graisses utiles et le latin du français et du lingala.
(ɛ et ɔ absents de ces deux familles : le téléphone les affiche avec sa police système.)

Sources (licence SIL OFL 1.1) : https://github.com/google/fonts
  ofl/plusjakartasans/PlusJakartaSans[wght].ttf
  ofl/dmsans/DMSans[opsz,wght].ttf

Usage : pip install fonttools brotli
        python3 scripts/build-fonts.py <dossier-des-sources>
"""
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else "fonts-src")
OUT = Path(__file__).resolve().parent.parent / "app" / "fonts"

UNICODES = (
    "U+0020-007E,U+00A0-00FF,U+0152-0153,U+0178,"  # latin de base, latin-1, Œ œ Ÿ
    "U+0186,U+0190,U+0254,U+025B,"  # Ɔ Ɛ ɔ ɛ (lingala)
    "U+0300-0302,U+030C,"  # accents combinants (tons)
    "U+2009,U+200A,U+2010-2014,U+2018-201E,U+2022,U+2026,U+202F,U+2039,U+203A,"
    "U+20AC,U+2122,U+2212"  # €, ™, signe moins
)

FONTS = [
    # (source, sortie, positions des axes à figer — un intervalle garde l'axe variable)
    ("PlusJakartaSans[wght].ttf", "jakarta-display.woff2", {"wght": (700, 800)}),
    ("DMSans[opsz,wght].ttf", "dmsans-text.woff2", {"wght": (400, 700), "opsz": 14}),
]


def find(name: str) -> Path:
    for candidate in (name, name.replace("[", "%5B").replace("]", "%5D")):
        if (SRC / candidate).exists():
            return SRC / candidate
    raise SystemExit(f"Source introuvable : {SRC / name}")


def build(src: Path, out: Path, axes):
    # Sous-ensemble d'abord, puis réduction des axes (l'ordre inverse plante sur
    # certaines polices variables : table gvar incomplète après instanciation).
    font = TTFont(src, lazy=False)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk"]
    options.hinting = False
    options.desubroutinize = True
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6]
    sub = subset.Subsetter(options)
    sub.populate(unicodes=subset.parse_unicodes(UNICODES))
    sub.subset(font)
    if axes:
        font = instancer.instantiateVariableFont(font, axes, updateFontNames=False)
    subset.save_font(font, str(out), options)
    print(f"{out.name:34} {out.stat().st_size / 1024:6.1f} Ko")


OUT.mkdir(parents=True, exist_ok=True)
for name, out, axes in FONTS:
    build(find(name), OUT / out, axes)
