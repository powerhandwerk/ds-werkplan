Das Logo ist die echte Wortmarke von powerhandwerk mit Standort-Pin und „handwerk“ auf der Lime-Pille, je eine Fassung für helle und dunkle Flächen.

## Wann

- `variant="light"` auf Papier („power“ in Ink), `variant="dark"` auf Nacht („power“ hell, freigestellt).
- Mit `href` ist es ein Link mit dem Namen aus `linkLabel`, ohne ein reines Bild. `as` reicht eine Link-Komponente der App durch.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `variant` | `"light" \| "dark"` | `"light"` | Fassung für helle oder dunkle Flächen. |
| `height` | `number \| string` | `34` | Höhe; die Breite folgt. |
| `className` | `string` | ohne | Zusätzliche Klasse. |
| `style` | `CSSProperties` | ohne | Stil der Hülle. |
| `href` | `string` | ohne | Ziel; mit `href` ein Link. |
| `linkLabel` | `string` | `"powerhandwerk Startseite"` | Name des Links für Vorleser. |
| `as` | `ElementType` | `"a"` | Element des Links. |

Import aus `@powerhandwerk/ds-werkplan/Logo`, im Bündel `DsWerkplan.Logo`.

## Was man lässt

- Das Logo nachzeichnen.
- Die helle Fassung auf Nacht oder die dunkle auf Papier.
