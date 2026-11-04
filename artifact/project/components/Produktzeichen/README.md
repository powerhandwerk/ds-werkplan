Das Produktzeichen ist das isometrische Zeichen eines Produkts oder Werkzeugs, das Kunden beim Namen nennen, mit genau einem Lime-Motiv, auf Papier und auf Nacht.

## Wann

- Neben dem Namen eines Produkts, etwa in einer Website-Karte, auf der Kundenseite oder in der Kundenmappe. Ab 32 px; für kleinere Größen gibt es noch keine Fassung.
- Ausnahme `messlatte`, das Zeichen des Standards Messlatte: unter 40 px steht die flache Fassung im 24er-Raster, ab 28 px mit Teilung, nicht unter 16 px. Schriftzug und Regeln stehen bei `MesslatteSchriftzug`.
- Die optische Größe folgt allein aus `groesse`: unter 56 px kräftige Linien, ab 96 px Haarlinien, dazwischen mittel (`optischeGroesse`).
- Im Server-HTML steht das Zeichen im Ruhezustand, ohne Bewegung und ohne Zustand.
- Ohne `titel` ist das Zeichen dekorativ (`aria-hidden`), der Name steht daneben. Steht es allein, bekommt es `titel`, etwa `PRODUKTZEICHEN[name].titel`; dann trägt es `role="img"` und `aria-label`.
- Die 15 Namen stehen in fester Reihenfolge in `PRODUKTZEICHEN_NAMEN`. Neue Zeichen zeichnen mit der Engine und den Bausteinen aus `produktzeichen-formen`, Bildausschnitt über `zeichenAusschnitt`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `name` | `ProduktzeichenName` | Pflicht | Welches Zeichen, etwa `"feinschliff"` oder `"google-profil"`. |
| `untergrund` | `"papier" \| "nacht"` | `"papier"` | Fläche, auf der das Zeichen steht. |
| `groesse` | `number` | `64` | Kantenlänge in px; bestimmt auch die Strichstärken. |
| `titel` | `string` | ohne | Zugänglicher Name, wenn das Zeichen allein steht. |
| `className` | `string` | ohne | Zusätzliche Klasse am SVG. |

Import aus `@powerhandwerk/ds-werkplan/Produktzeichen`, im Bündel `DsWerkplan.Produktzeichen`.

## Was man lässt

- Mehr als ein Lime-Motiv in einem Zeichen. Fünf Sterne zählen als ein Motiv.
- Ein Zeichen für eine Funktion, die ein normales Icon hat, etwa Zugänge, Rückruf oder Neuigkeiten.
- Bühne, Geste oder die Strichstärken der Leistungskarte: Produktzeichen sind kein Stil A.
- Ein Zeichen kleiner als 32 px; die Messlatte flach nicht kleiner als 16 px.
- Ein Zeichen freihand statt mit Engine und `produktzeichen-formen`.
