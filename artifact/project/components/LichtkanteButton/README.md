Die Lichtkante ist der Hauptknopf des DS Werkplan: ein dunkler Körper mit 1 px Kante, ein Lime-Licht, das bei Hover und Fokus um die Kante läuft, und der Pfeil in einer Lime-Kapsel.

## Wann

- Für die Hauptaktion einer Fläche, etwa „Ihr Schritt“ im Monatsbericht oder auf der Zugangs-Seite.
- Mit `href` ist sie ein Link, ohne `href` ein echter `<button>` mit `type="button"`.
- Mit `extern` öffnet der Link eine fremde Seite in neuem Tab, der Pfeil zeigt dann schräg nach oben.
- Auf Papier mit `untergrund="papier"`: Der Körper bleibt dunkel, die Innenkante verschwindet, der Schatten wird weicher und der Fokusring dunkel.
- Kleinere Fassungen über `className`: `WERKPLAN_KNOPF.lichtkanteKlein` (40 px, Chip 28 px), `WERKPLAN_KNOPF.lichtkanteVoll` (füllt am Handy ihre Spalte), `WERKPLAN_KNOPF.lichtkanteHandy` (feste 48 px).
- Bei reduzierter Bewegung steht das Licht still.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `href` | `string` | ohne | Ziel; mit `href` ein Link. |
| `type` | `"submit" \| "button"` | `"button"` | Typ des Knopfs ohne `href`. |
| `untergrund` | `"nacht" \| "papier"` | `"nacht"` | Fläche, auf der die Lichtkante steht. |
| `disabled` | `boolean` | `false` | Gesperrt; ein gesperrter Link hat kein Ziel, bleibt aber per Tastatur erreichbar (`aria-disabled`). |
| `extern` | `boolean` | `false` | Nur mit `href`: fremde Seite, neuer Tab, Pfeil schräg nach oben. |
| `onClick` | `MouseEventHandler` | ohne | Nur ohne `href` und nur aus Client-Komponenten. |
| `className` | `string` | ohne | Zusätzliche Klasse, etwa eine Größe aus `WERKPLAN_KNOPF`. |
| `children` | `ReactNode` | Pflicht | Beschriftung. |

Import aus `@powerhandwerk/ds-werkplan/LichtkanteButton`, im Bündel `DsWerkplan.LichtkanteButton`.

## Was man lässt

- Die Lime-Pille als Hauptknopf: Die Hauptaktion ist die Lichtkante.
- Eine zweite Lichtkante für eine Nebenaktion; dafür gibt es `RuhigerKnopf` und `Textlink`.
- `untergrund="nacht"` auf Papier.
