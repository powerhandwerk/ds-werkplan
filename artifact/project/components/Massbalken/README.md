Der Maßbalken zeigt einen Anteil als Maßlinie mit Endstrichen und einer Lime-Füllung.

## Wann

- Für Anteile und Stände, die wie Vermessung aussehen sollen, statt eines Balkendiagramms.
- Er füllt die Breite seines Elternteils; die Striche bleiben in jeder Breite 1 px. Höhe 14 px, Füllung 6 px.
- Mit `label` ist er ein Bild mit Namen (`role="img"`), ohne ist er für Vorleser versteckt.
- Die Füllfarbe setzt die Stellschraube `--fuell-farbe` an einem umgebenden Element, Standard Lime.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `anteil` | `number` | Pflicht | Anteil in Prozent, auf 0 bis 100 geklemmt. |
| `untergrund` | `"nacht" \| "papier"` | Pflicht | Fläche, auf der der Balken steht. |
| `label` | `string` | ohne | Name für Vorleser. |

Import aus `@powerhandwerk/ds-werkplan/Massbalken`, im Bündel `DsWerkplan.Massbalken`.

## Was man lässt

- Bunte Balkendiagramme.
- Einen Balken ohne `label`, wenn der Anteil nicht daneben im Text steht.
