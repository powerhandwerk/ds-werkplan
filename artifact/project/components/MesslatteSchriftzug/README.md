Der Schriftzug des Standards Messlatte: das Zeichen, eine Wasserwaage mit der Lime-Pille aus dem Logo als Luftblase, daneben MESSLATTE als Pfad, auf Wunsch mit dem echten Logo darüber.

## Wann

- Mit Logo dort, wo powerhandwerk sonst nicht erkennbar ist, etwa auf LinkedIn und in Präsentationen. Ohne Logo dort, wo powerhandwerk schon steht: Website, Kundenseite, Berichte mit powerhandwerk-Kopf.
- Die Pille sitzt auf halber Versalhöhe von MESSLATTE, das Zeichen ist 1,25 Versalhöhen hoch. `versalhoehe` setzt die Größe in px, alles andere folgt daraus.
- Mindestgrößen: ohne Logo ab 20 px Versalhöhe, mit Logo ab 32 px. Darunter fällt das Logo weg, unter 20 px steht nur das Zeichen; `data-mit-logo` sagt, ob das Logo steht.
- Die Fläche enthält die Schutzzone, eine halbe Versalhöhe rundum. Zum bündigen Ausrichten wird der Schriftzug um diese Zone versetzt, nicht beschnitten.
- Allein steht das Zeichen als `Produktzeichen` mit dem Namen `messlatte`: ab 40 px das Modell, darunter die flache Fassung, ab 28 px mit Teilung, nicht unter 16 px.
- Der Stand eines Projekts steht neben dem Zeichen, nie darin: `Masskette` mit einer Gruppe aus sechs Positionen, daneben die Beschriftung „5 von 6“ und als `label` „5 von 6 Punkten der Messlatte erfüllt“. Die Maßkette steht auf Papier.
- Rendert auf dem Server, ohne Zustand und ohne Bewegung. Das Logo kommt unverändert aus `assets/` und färbt über seine `fill`-Attribute.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `untergrund` | `"papier" \| "nacht"` | `"papier"` | Fläche, auf der der Schriftzug steht. |
| `mitLogo` | `boolean` | `false` | Das powerhandwerk-Logo über MESSLATTE, erst ab 32 px Versalhöhe. |
| `versalhoehe` | `number` | `40` | Versalhöhe von MESSLATTE in px; bestimmt die ganze Größe. |
| `titel` | `string` | `„Messlatte“, mit Logo „powerhandwerk Messlatte“` | Zugänglicher Name des Bilds. |
| `className` | `string` | ohne | Zusätzliche Klasse am SVG. |

Import aus `@powerhandwerk/ds-werkplan/MesslatteSchriftzug`, im Bündel `DsWerkplan.MesslatteSchriftzug`.

## Was man lässt

- Ring, Plakette, Band oder Rosette um Zeichen oder Schriftzug: Die Messlatte ist ein Werkzeug, kein Siegel.
- Eine zweite Lime-Fläche im Zeichen oder die Pille außerhalb der Mitte.
- Zeichen oder Schriftzug drehen, verzerren oder nachzeichnen; das Logo als Text setzen.
- Wörter wie geprüft, zertifiziert oder Garantie neben dem Zeichen.
- Die Messlatte auf den Websites der Betriebe. Dort bleibt der Herstellerhinweis, wie er ist.
- Den Stand im Zeichen zeigen. Das Zeichen zeigt immer den vollen Standard.
