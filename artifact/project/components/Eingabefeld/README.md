Das Eingabefeld setzt das Label über das Feld und darunter Hinweis und Fehlertext, beide per `aria-describedby` am Feld.

## Wann

- Für Text- und Mehrzeilenfelder der Kundenseite.
- Das Feld ist weiß mit dunkler Schrift, auf Papier wie auf Nacht; Label und Texte folgen der Fläche.
- Ein Fehler setzt `aria-invalid` und wird über `role="alert"` angesagt. Ohne `id` vergibt React eine.
- Alle übrigen Attribute gehen an das Feld.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `label` | `ReactNode` | Pflicht | Label über dem Feld. |
| `hinweis` | `ReactNode` | ohne | Hinweis unter dem Feld, im Stil der Quellenzeile. |
| `fehler` | `ReactNode` | ohne | Fehlertext; vorhanden heißt ungültig. |
| `mehrzeilig` | `boolean` | `false` | Mehrzeiliges Feld (`<textarea>`, mindestens 96 px hoch). |
| `id` | `string` | ohne | id des Felds. |
| `className` | `string` | ohne | Zusätzliche Klasse am Feld. |
| … | `Input- oder TextareaHTMLAttributes` | ohne | Alle Attribute des Felds. |

Import aus `@powerhandwerk/ds-werkplan/Eingabefeld`, im Bündel `DsWerkplan.Eingabefeld`.

## Was man lässt

- Ein eigenes Label daneben: `label` ist Pflicht und hängt am Feld.
