Die Modellkarte ist die Preiskarte eines Website-Angebots: das Produktzeichen auf eigener Bühne, Etikett und Name, ein kurzer Text, der Preis groß als Messwert mit Einheit und darunter bis zu zwei Summen.

## Wann

- Auf Papier, für Angebote mit festem Preis wie One-Pager und Website auf der Website und der Preisseite. Zwei Karten stehen nebeneinander in einem Raster mit 16 px Lücke, schmal untereinander.
- Alle Zahlen kommen fertig formatiert vom Verbraucher, aus seinem Preisregister: `preis`, `einheit` und die Werte in `summen`. Der Baustein rechnet nichts.
- Die Karte schaltet über ihre eigene Breite: unter 420 px Bühne 220 px und Zeichen 150 px, Summen untereinander; ab 420 px Bühne 250 px, Zeichen in voller Größe, Summen nebeneinander mit feiner Trennlinie. Der Preis wächst mit der Kartenbreite von 48 auf 64 px.
- Die Textzeile wächst, damit Preis und Summen zweier Karten nebeneinander auf einer Linie stehen, auch bei verschieden langen Texten.
- Die Karte ist eine `section` mit `name` als zugänglichem Namen, gerahmt von `SucherEcken` mit Lime-Ecken. Das Produktzeichen ist dekorativ, der Name steht daneben.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `zeichen` | `ProduktzeichenName` | Pflicht | Produktzeichen auf der Bühne, etwa `"onepager"` oder `"website"`. |
| `name` | `string` | Pflicht | Name des Angebots; Überschrift und zugänglicher Name der Karte. |
| `ueberschrift` | `"h2" \| "h3" \| "h4"` | `"h3"` | Ebene der Überschrift. |
| `etikett` | `ReactNode` | ohne | Etikett (`lead`) vor dem Namen, etwa der Umfang. |
| `text` | `ReactNode` | ohne | Kurzer Text zum Angebot. |
| `preis` | `string` | Pflicht | Preis, fertig formatiert, etwa `"00 €"`. |
| `einheit` | `string` | ohne | Einheit neben dem Preis. |
| `summen` | `readonly { label: string; wert: string }[]` | ohne | Bis zu zwei Summen unter dem Preis, als Beschreibungsliste. |
| `zeichenGroesse` | `number` | `172` | Kantenlänge des Produktzeichens in px; unter 420 px Kartenbreite 150 px. |
| `className` | `string` | ohne | Zusätzliche Klasse an der Karte. |

Import aus `@powerhandwerk/ds-werkplan/Modellkarte`, im Bündel `DsWerkplan.Modellkarte`.

## Was man lässt

- Preise im Baustein ausrechnen oder fest eintragen: Die Zahlen kommen aus dem Preisregister des Verbrauchers.
- Die Karte auf Nacht: Sie steht auf Papier.
- Mehr als zwei Summen oder mehr als zwei Karten nebeneinander.
- Echte Preise in Mustern und Vorschauen: Muster tragen „Muster, keine echten Preise.“
