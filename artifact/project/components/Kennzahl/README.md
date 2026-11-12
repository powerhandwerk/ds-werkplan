Die Kennzahl setzt Beschriftung, große leichte Zahl und Klartext; die Zahl nimmt `wp-stark` und ist auf Papier und Nacht lesbar.

## Wann

- Einzeln oder in `Kennzahlen`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `kopf` | `string` | ohne | Beschriftung. |
| `wert` | `ReactNode` | Pflicht | Die Zahl, fertig formatiert. |
| `text` | `ReactNode` | ohne | Klartext darunter. |
| `groesse` | `32 \| 48 \| 64` | `48` | Grad der Zahl. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Kennzahl`.

## Was man lässt

- Eine Zahl, die eine Wirkung zeigt, ohne Messzeitraum und Quelle.
