Der Messwert setzt eine große, leichte Zahl in Barlow Semi Condensed 300 mit proportionalen Versalziffern.

## Wann

- Für eine Kennzahl, mit `Besch` als Beschriftung und einer Quellenzeile darunter.
- Die Größe kommt aus den Graden, Richtwert `grad-80`.
- Fehlt eine Messung, steht das da: „Noch keine Messung“.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `children` | `ReactNode` | Pflicht | Die Zahl. |
| `groesse` | `number` | Pflicht | Schriftgröße in px. |
| `farbe` | `string` | ohne | Schriftfarbe; ohne Angabe `ink-950`. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.Messwert`.

## Was man lässt

- Eine Mono-Schrift oder tabellarische Ziffern.
- Eine Zahl, die eine Wirkung zeigt, ohne Messzeitraum und Quelle.
