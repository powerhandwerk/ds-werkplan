Der Marker legt die schräge Lime-Pille des Logos hinter genau ein Wort; die Schrift darauf ist immer dunkel.

## Wann

- Nur im Logo und im Hero der Website, dort einmal und hinter einem kurzen Wort.
- Die Fläche ist dieselbe Form wie die Pille im Logo: `markerGeometry()` rechnet sie aus der Versalhöhe von Big Shoulders Display, die Buchstaben stehen immer frei.
- Die Neigung ist -3,96°; `markerTiltDeg()` macht sie bei langen Wörtern flacher.
- Der Marker hält seinen Kasten auf `line-height: 1`; die Geometrie hängt daran.
- `animate` wischt die Fläche ein; die `@keyframes marker-wisch` liefert bis Phase 1b die App.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `children` | `ReactNode` | Pflicht | Das Wort. |
| `rotate` | `number` | ohne | Neigung in Grad; ohne Angabe -3,96°, bei langen Wörtern flacher. |
| `animate` | `boolean` | `false` | Fläche wischt ein. |
| `color` | `string` | ohne | Farbe der Fläche; ohne Angabe `var(--lime)`. |
| `geometry` | `MarkerGeometry` | `GEOMETRY_DEFAULT` | Überstand und Rundung in em; die Voreinstellung ist am Logo vermessen. |
| … | `HTMLAttributes<HTMLSpanElement>` | ohne | Alle Attribute eines `<span>`. |

Import aus `@powerhandwerk/ds-werkplan/MarkerHighlight`, im Bündel `DsWerkplan.MarkerHighlight`.

## Was man lässt

- Den Marker in Oberflächen: Dort hebt der `Unterstrich` hervor.
- Ein langes Wort markieren; besser ein kürzeres Wort wählen.
- Geschätzte Werte, zusätzliches `padding` oder eine Rundung in Prozent.
