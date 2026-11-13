Spalten ordnen Text neben Bild oder Bildreihen; unter 720 px eigener Breite stehen sie untereinander.

## Wann

- Zwei Spalten mit `verhaeltnis` für Text neben `Bildbeleg`, drei Spalten für Bildreihen oder Kennzahlen.
- Der Baustein misst sich selbst, nicht das Fenster; der Abstand ist 24 px, die Spalten stehen oben bündig.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `anzahl` | `2 \| 3` | `2` | Zahl der Spalten. |
| `verhaeltnis` | `"1:1" \| "2:3" \| "3:2"` | `"1:1"` | Verhältnis bei zwei Spalten. |
| `children` | `ReactNode` | Pflicht | Je Spalte ein Kind. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Spalten`.

## Was man lässt

- Mehr als drei Spalten.
- Spalten für Lauftext neben Lauftext: Das liest sich schlecht.
