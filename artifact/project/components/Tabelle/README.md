Die Tabelle steht auf `wp-blatt` mit Haarlinien, Kopfzeile in der Rolle `beschriftung`, die erste Spalte ist der Zeilenkopf.

## Wann

- Für Vergleiche und Aufstellungen mit wenigen Spalten. Zellen stehen in `grad-14`, jede Spalte ist mindestens 112 px breit.
- Bei Überbreite rollt die Tabelle waagrecht in ihrem eigenen Bereich, die Seite bleibt stehen. Der Bereich trägt `label` als Namen und den Tastaturfokus.
- `quelle` steht darunter in der Rolle `quelle`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `label` | `string` | Pflicht | Name für Vorleser. |
| `kopf` | `readonly string[]` | Pflicht | Spaltenköpfe. |
| `zeilen` | `readonly (readonly ReactNode[])[]` | Pflicht | Zeilen, erste Zelle als Zeilenkopf. |
| `breiten` | `readonly string[]` | ohne | Breite je Spalte, etwa `"30%"`. |
| `quelle` | `string` | ohne | Quellenzeile darunter. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Tabelle`.

## Was man lässt

- Farbige Zellen, Ampeln oder Schatten.
- Lauftext in Zellen: Dafür ist `Fliesstext` da.
