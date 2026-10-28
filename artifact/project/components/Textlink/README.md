Der Textlink ist die Zweitaktion neben der Lichtkante: Text mit 1 px Unterstrich, der bei Hover und Fokus zu 3 px Lime wird.

## Wann

- Für die Zweitaktion neben der Lichtkante.
- Die Schrift erbt ihre Farbe, der Fokusring folgt `wp-fokus`; der Textlink steht deshalb auf Papier und Nacht.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `href` | `string` | Pflicht | Ziel. |
| `children` | `ReactNode` | Pflicht | Text. |
| `className` | `string` | ohne | Zusätzliche Klasse. |

Import aus `@powerhandwerk/ds-werkplan/Textlink`, im Bündel `DsWerkplan.Textlink`.

## Was man lässt

- Den Textlink für die Hauptaktion.
- Lime als Schriftfarbe: Lime ist nur der Unterstrich.
