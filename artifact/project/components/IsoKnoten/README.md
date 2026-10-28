Der Renderer `IsoKnoten` macht aus dem Knotenbaum des Iso-Kerns SVG-Elemente, auf dem Server wie im Browser und ohne Zustand.

## Wann

- So zeichnet man mit dem Kern: `isoKernel({ rot, cx, cy, K })` liefert je Zeichnung die Projektion `P`, die Flächen `TOP`, `FRONT` und `SIDE`, Quader mit `box`, Pfade mit `path3` und aus allen gemerkten Punkten mit `bbox()` die viewBox.
- Knoten baut `isoElement(tag, attrs, ...kinder)` wie `createElement`, nur ohne React. Attribute stehen in React-Schreibweise (`className`, `strokeWidth`).
- `K` bildet Klassennamen auf die Namen des eigenen CSS-Moduls ab. Die Farben liefert die Iso-Palette (`isopalette.module.css`), die `IsoSzene` ans SVG setzt.
- Leuchtfilter mit `filterDefs`, Sterne mit `sternPfad`. Knoten mit `tag: "slot"` ersetzt `IsoKnoten` durch `slots[name]`, für Inhalte, die erst zur Laufzeit feststehen.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `knoten` | `Knoten \| string \| readonly (Knoten \| string)[]` | Pflicht | Knotenbaum `{ tag, attrs, kids }` aus dem Iso-Kern. |
| `slots` | `Readonly<Record<string, ReactNode>>` | ohne | Inhalte für die Knoten mit `tag: "slot"`. |

Import aus `@powerhandwerk/ds-werkplan/IsoKnoten`, im Bündel `DsWerkplan.IsoKnoten`.

## Was man lässt

- Eine Figur freihand als SVG statt mit dem Iso-Kern.
- Text als Attribut statt als Kind.
- Feste Filter-IDs: Sie bekommen ein Präfix je Seite.
