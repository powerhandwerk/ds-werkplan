Die Sucher-Ecken setzen vier 10-px-Winkel in die Ecken eines Rahmens, wie im Kamerasucher.

## Wann

- Für die Hauptkarte einer Fläche.
- Die Ecken zeichnen in `wp-stark` mit 1,5 px und sind rein dekorativ (`aria-hidden`). Sie stehen auf Papier und Nacht.
- Sie umschließen ihren Inhalt; `as` wählt das Element, damit auch ein Formular den Rahmen tragen kann. Das Polster setzt der Verbraucher.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `as` | `"div" \| "section" \| "form"` | `"div"` | Element. |
| `className` | `string` | ohne | Zusätzliche Klasse, etwa für das Polster. |
| `children` | `ReactNode` | Pflicht | Inhalt. |
| … | `HTMLAttributes, onSubmit, noValidate` | ohne | Attribute des Elements. |

Import aus `@powerhandwerk/ds-werkplan/SucherEcken`, im Bündel `DsWerkplan.SucherEcken`.

## Was man lässt

- Sucher-Ecken an jeder Karte: Sie markieren die Hauptkarte.
