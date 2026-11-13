Die Kennzahl setzt Beschriftung, große leichte Zahl in der Rolle `messwert` und Klartext; die Zahl nimmt `wp-stark` und ist auf Papier und Nacht lesbar.

## Wann

- Einzeln, in `Spalten` oder als Reihe in `Kennzahlen`.
- Der Wert kommt fertig formatiert, mit Komma und geschütztem Leerzeichen vor der Einheit.
- Anders als `Messwert` trägt sie keine feste Farbe; auf Nacht bleibt die Zahl hell.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `kopf` | `string` | ohne | Beschriftung über der Zahl. |
| `wert` | `ReactNode` | Pflicht | Die Zahl, fertig formatiert. |
| `text` | `ReactNode` | ohne | Klartext darunter. |
| `groesse` | `32 \| 48 \| 64` | `48` | Grad der Zahl. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Kennzahl`.

## Was man lässt

- Eine Zahl, die eine Wirkung zeigt, ohne Messzeitraum und Quelle.
- Tabellarische Ziffern oder eine Mono-Schrift.
