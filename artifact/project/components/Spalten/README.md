Spalten ordnen Text neben Bild oder Bildreihen; unter 720 px eigener Breite stehen sie untereinander.

## Wann

- Zwei Spalten mit `verhaeltnis`, drei Spalten für Bildreihen.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `anzahl` | `2 \| 3` | `2` | Zahl der Spalten. |
| `verhaeltnis` | `"1:1" \| "2:3" \| "3:2"` | `"1:1"` | Verhältnis bei zwei Spalten. |
| `children` | `ReactNode` | Pflicht | Je Spalte ein Kind. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Spalten`.

## Was man lässt

- Mehr als drei Spalten.
