Der Laufzeit-Schalter wählt über den Paketkarten zwischen 24 und 12 Monaten: zwei gleich breite Knöpfe, 24 zuerst, darunter die Info-Zeile zur gewählten Laufzeit.

## Wann

- Über den Paketkarten, auf Papier oder auf Nacht. 24 Monate stehen zuerst, 12 daneben; die gewählte Laufzeit trägt Lime.
- Die Knöpfe tragen `aria-pressed`. Die Info-Zeile wechselt ihren Text und wird angesagt (`aria-live`); beide Zeilen halten gemeinsam die Höhe, damit nichts springt.
- Ohne `info` entfällt die Info-Zeile. Info-Zeilen haben keinen Standard, weil Sie und du sich unterscheiden.
- Der Schalter nimmt eine Funktion und geht deshalb nur aus Client-Komponenten. Server-Seiten nehmen `LaufzeitBereich`, der den Zustand hält.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `wert` | `12 \| 24` | Pflicht | Gewählte Laufzeit. |
| `onWechsel` | `(laufzeit: 12 \| 24) => void` | Pflicht | Ruft die neu gewählte Laufzeit zurück. |
| `info` | `Record<12 \| 24, string>` | ohne | Info-Zeile je Laufzeit. |
| `texte` | `Partial<LaufzeitTexte>` | `LAUFZEIT_TEXTE` | Beschriftung, Name der Knopfgruppe und Text eines Knopfs mit `{monate}`. |

Import aus `@powerhandwerk/ds-werkplan/LaufzeitSchalter`, im Bündel `DsWerkplan.LaufzeitSchalter`.

## Was man lässt

- 12 Monate zuerst oder vorgewählt: 24 steht vorn.
- Den Schalter in einer Server-Komponente mit eigener Funktion: Dafür gibt es `LaufzeitBereich`.
- Preise in der Info-Zeile des Pakets: Muster tragen Platzhalter.
