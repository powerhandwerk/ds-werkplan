Der Fließtext setzt Lauftext in der Rolle `text`: Absätze, Listen, starke Wörter, Links und Zwischentitel, höchstens 62 Zeichen breit.

## Wann

- Für den Text einer Position, als `vertrauenswuerdigesHtml` oder als Kinder.
- `h3` steht in der Rolle `h3` (`grad-24`), Links sehen aus wie `Textlink`: 1 px Unterstrich, bei Hover und Fokus 3 px Lime.
- Der Inhalt wird unverändert eingesetzt und darf nur vom Verfasser der Seite stammen, nie aus Daten von außen (Scan-Ergebnisse, Formulare); dafür `children` nehmen. Die Farben nimmt der Text von der Fläche.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `vertrauenswuerdigesHtml` | `string` | ohne | Fertiges Markup des Verfassers, unverändert eingesetzt. |
| `children` | `ReactNode` | ohne | Inhalt statt `vertrauenswuerdigesHtml`; für alles aus Daten von außen. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Fliesstext`.

## Was man lässt

- Fremdes Markup aus Formularen, Mails oder Quellen außerhalb der Seite.
- Eigene Schriftgrößen oder Farben im Markup.
