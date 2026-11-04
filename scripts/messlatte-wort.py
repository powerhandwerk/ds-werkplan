"""Wortpfad „MESSLATTE“ für den Baustein MesslatteSchriftzug.

Setzt das Wort aus Big Shoulders Display 800 als Umrisspfad, mit der
Unterschneidung aus GPOS (Feature `kern`), bei Schriftgröße 100 und der
Grundlinie auf y = 0. Gibt den Pfad, die Laufweite und die Versalhöhe als
JSON aus; die Werte stehen als `MESSLATTE_WORT` in `src/messlatte-schriftzug.ts`.

Quelle ist die statische TTF aus `powerhandwerk-fonts/ttf/`, dieselbe wie für die
Dateien des Markenblatts. Die variable woff2 des Pakets hat bei wght 800 andere
Umrisse (gleiche Laufweiten), deshalb nicht sie.

Aufruf: python3 scripts/messlatte-wort.py <pfad>/big-shoulders-display-800.ttf
Braucht fontTools.
"""
import json
import sys

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

WORT = "MESSLATTE"
GROESSE = 100


def zahl(v):
    """Zwei Nachkommastellen ohne Nullen am Ende; -0 wird 0."""
    text = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if text == "-0" else text


def paarlisten(schrift):
    """Paar-Unterschneidungen (GPOS Typ 2, auch in Erweiterungen) aus dem Feature `kern`."""
    if "GPOS" not in schrift:
        return []
    gpos = schrift["GPOS"].table
    nummern = set()
    for eintrag in gpos.FeatureList.FeatureRecord:
        if eintrag.FeatureTag == "kern":
            nummern.update(eintrag.Feature.LookupListIndex)
    listen = []
    for nummer in sorted(nummern):
        lookup = gpos.LookupList.Lookup[nummer]
        for tabelle in lookup.SubTable:
            if lookup.LookupType == 9:
                tabelle = tabelle.ExtSubTable
            if getattr(tabelle, "LookupType", 2) == 2 and hasattr(tabelle, "Coverage"):
                listen.append(tabelle)
    return listen


def unterschneidung(listen, g1, g2):
    for tabelle in listen:
        abdeckung = tabelle.Coverage.glyphs
        if g1 not in abdeckung:
            continue
        if tabelle.Format == 1:
            for paar in tabelle.PairSet[abdeckung.index(g1)].PairValueRecord:
                if paar.SecondGlyph == g2:
                    return getattr(paar.Value1, "XAdvance", 0) or 0
        else:
            k1 = tabelle.ClassDef1.classDefs.get(g1, 0)
            k2 = tabelle.ClassDef2.classDefs.get(g2, 0)
            wert = tabelle.Class1Record[k1].Class2Record[k2].Value1
            return getattr(wert, "XAdvance", 0) or 0
    return 0


def main(pfad):
    schrift = TTFont(pfad)
    upm = schrift["head"].unitsPerEm
    zeichen = schrift.getGlyphSet()
    namen = [schrift.getBestCmap()[ord(c)] for c in WORT]
    laufweiten = schrift["hmtx"]
    listen = paarlisten(schrift)
    s = GROESSE / upm
    teile, x = [], 0.0
    for i, name in enumerate(namen):
        stift = SVGPathPen(zeichen, ntos=zahl)
        zeichen[name].draw(TransformPen(stift, (s, 0, 0, -s, x, 0)))
        teile.append(stift.getCommands())
        weite = laufweiten[name][0]
        if i + 1 < len(namen):
            weite += unterschneidung(listen, name, namen[i + 1])
        x += weite * s
    print(json.dumps({
        "d": " ".join(teile),
        "breite": round(x, 2),
        "versalhoehe": schrift["OS/2"].sCapHeight / upm,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main(sys.argv[1])
