Kennzahlen stellen zwei bis vier Kennzahlen in eine Reihe mit Fugen; schmal stehen sie untereinander.

## Wann

- Im Kopf eines Berichtsblatts für das Ergebnis auf einen Blick, oder in einer Position.
- Der Baustein schaltet über seine eigene Breite: ab 480 px zwei oder drei nebeneinander, vier ab 720 px.
- Ist ein Wert länger als acht Zeichen, steht die ganze Reihe in `grad-32` statt `grad-48`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `zahlen` | `readonly KennzahlDaten[]` | Pflicht | Je Zahl `kopf`, `wert` und `text`; ohne Zahlen rendert nichts. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Kennzahlen`.

## Was man lässt

- Mehr als vier Zahlen in einer Reihe.
- Anteile als Zahlenreihe: Dafür stehen `Massbalken` und `Fortschritt`.
