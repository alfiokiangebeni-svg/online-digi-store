#!/usr/bin/env python3
"""
Génère les polices auto-hébergées de Digi Store (app/fonts/*.woff2).

Pourquoi : Google Fonts sert Work Sans et Bricolage Grotesque en polices variables
complètes (≈ 50 Ko et 22 Ko préchargés). On fige ici les seules graisses utilisées
et on garde le latin utile au français et au lingala (ɛ, ɔ, tons).

Sources (licence SIL OFL 1.1) : https://github.com/google/fonts
  ofl/worksans/WorkSans[wght].ttf
  ofl/bricolagegrotesque/BricolageGrotesque[opsz,wdth,wght].ttf
  ofl/spacemono/SpaceMono-Regular.ttf, SpaceMono-Bold.ttf

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
    # (source, sortie, positions des axes à figer)
    ("WorkSans[wght].ttf", "work-sans-400.woff2", {"wght": 400}),
    ("WorkSans[wght].ttf", "work-sans-500.woff2", {"wght": 500}),
    (
        "BricolageGrotesque[opsz,wdth,wght].ttf",
        "bricolage-grotesque-700.woff2",
        {"wght": 700, "opsz": 48, "wdth": 100},
    ),
    ("SpaceMono-Regular.ttf", "space-mono-400.woff2", None),
    ("SpaceMono-Bold.ttf", "space-mono-700.woff2", None),
]


def find(name: str) -> Path:
    for candidate in (name, name.replace("[", "%5B").replace("]", "%5D")):
        if (SRC / candidate).exists():
            return SRC / candidate
    raise SystemExit(f"Source introuvable : {SRC / name}")


def build(src: Path, out: Path, axes):
    font = TTFont(src)
    if axes:
        font = instancer.instantiateVariableFont(font, axes, updateFontNames=False)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk"]
    options.hinting = False
    options.desubroutinize = True
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6]
    options.notdef_outline = True
    sub = subset.Subsetter(options)
    sub.populate(unicodes=subset.parse_unicodes(UNICODES))
    sub.subset(font)
    subset.save_font(font, str(out), options)
    print(f"{out.name:34} {out.stat().st_size / 1024:6.1f} Ko")


OUT.mkdir(parents=True, exist_ok=True)
for name, out, axes in FONTS:
    build(find(name), OUT / out, axes)
