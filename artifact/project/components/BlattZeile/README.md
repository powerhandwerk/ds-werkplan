Die Blattzeile steht über einem Abschnitt und nennt das Blatt, etwa „Blatt 02 · Zugänge“.

## Wann

- Über einem Abschnitt auf Papier. Die Nummer wird zweistellig.
- Ohne `nr` steht nur der Titel.
- Die Versalien setzt das CSS.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `nr` | `number` | ohne | Blattnummer. |
| `titel` | `string` | Pflicht | Titel des Blatts. |
| `className` | `string` | ohne | Zusätzliche Klasse. |

Import aus `@powerhandwerk/ds-werkplan/BlattZeile`, im Bündel `DsWerkplan.BlattZeile`.

## Was man lässt

- Versalien in den Text schreiben.
- Die Blattzeile auf Nacht; die Nacht-Fassung kommt in Phase 2.
