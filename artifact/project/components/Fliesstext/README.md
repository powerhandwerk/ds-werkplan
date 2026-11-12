Der Fließtext setzt Lauftext in der Rolle `text`: Absätze, Listen, starke Wörter, Links und Zwischentitel, höchstens 62 Zeichen breit.

## Wann

- Für den Text einer Position, als `html` oder als Kinder. `html` kommt vom Verfasser der Seite, nie von außen.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `html` | `string` | ohne | Fertiges Markup, unverändert eingesetzt. |
| `children` | `ReactNode` | ohne | Inhalt statt `html`. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Fliesstext`.

## Was man lässt

- Fremdes Markup aus Formularen oder Quellen außerhalb der Seite.
