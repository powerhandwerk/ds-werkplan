Die Tabelle steht auf `wp-blatt` mit Haarlinien, die erste Spalte ist der Zeilenkopf.

## Wann

- Für Vergleiche mit wenigen Spalten. Bei Überbreite rollt sie waagrecht, der Bereich hat einen Namen und den Tastaturfokus.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `label` | `string` | Pflicht | Name für Vorleser. |
| `kopf` | `readonly string[]` | Pflicht | Spaltenköpfe. |
| `zeilen` | `readonly (readonly ReactNode[])[]` | Pflicht | Zeilen, erste Zelle als Zeilenkopf. |
| `breiten` | `readonly string[]` | ohne | Breite je Spalte. |
| `quelle` | `string` | ohne | Quellenzeile darunter. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Tabelle`.

## Was man lässt

- Farbige Zellen oder Schatten.
