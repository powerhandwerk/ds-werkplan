Der Laufzeit-Bereich hält die gewählte Laufzeit, zeigt oben den Laufzeit-Schalter und setzt `data-laufzeit` auf den Rahmen um seine Kinder, die Paketkarten.

## Wann

- Um die Paketkarten einer Server-Seite: Der Bereich ist eine Client-Komponente, die Karten darin bleiben Server-Inhalt.
- Er startet mit 24 Monaten (`start`). Ein Klick auf 12 tauscht in allen Karten darin Betrag, Einheit und Zusatz und die Info-Zeile.
- Info-Zeilen und Texte reicht er an den `LaufzeitSchalter` weiter.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `children` | `ReactNode` | Pflicht | Die Paketkarten, die der Laufzeit folgen. |
| `start` | `12 \| 24` | `24` | Laufzeit beim ersten Rendern. |
| `info` | `Record<12 \| 24, string>` | ohne | Info-Zeile je Laufzeit. |
| `texte` | `Partial<LaufzeitTexte>` | `LAUFZEIT_TEXTE` | Texte des Schalters. |

Import aus `@powerhandwerk/ds-werkplan/LaufzeitSchalter`, im Bündel `DsWerkplan.LaufzeitBereich`.

## Was man lässt

- Den Zustand der Laufzeit in den Karten halten: Er gehört in den Bereich, die Karten lesen `data-laufzeit`.
- Zwei Bereiche um dieselben Karten.
