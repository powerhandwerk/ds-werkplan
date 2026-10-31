Die Maßkette zeigt einen Prüfstand: ein Teilstück je Position, lange Trennstriche zwischen Abschnitten, Lime füllt, was geprüft ist.

## Wann

- Für den Stand mehrerer Positionen in Abschnitten, etwa Blatt 01 und Blatt 02.
- `massketteGeometrie()` rechnet Füllungen, Teilstriche und Trenner aus; der Test prüft sie ohne DOM.
- Sie steht auf Papier.
- Die Füllfarbe setzt die Stellschraube `--mass-fuellung` an einem umgebenden Element, Standard Lime.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `gruppen` | `readonly (readonly boolean[])[]` | Pflicht | Je Abschnitt eine Liste; `true` heißt geprüft. |
| `label` | `string` | Pflicht | Name für Vorleser. |

Import aus `@powerhandwerk/ds-werkplan/Masskette`, im Bündel `DsWerkplan.Masskette`.

## Was man lässt

- Die Maßkette auf Nacht.
- Bunte Balkendiagramme.
