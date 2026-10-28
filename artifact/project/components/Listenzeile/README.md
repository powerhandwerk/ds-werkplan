Die Listenzeile ist ein echter Link; ein einfacher Klick wählt den Eintrag ohne Neuladen.

## Wann

- Als Zeile in `Liste`: Titel, Unterzeile mit optionalem Icon, rechts optional ein Etikett oder eine Zahl.
- Die gewählte Zeile (`aktiv`) ist weiß mit 2 px Innenlinie und trägt `aria-current`.
- Meta, Strg, Umschalt oder Mittelklick öffnen den Link wie gewohnt (`einfacherKlick`).
- `unterArt` färbt die Unterzeile als Warnung oder Haken, `gedimmt` setzt die Zeile zurück.
- `nachLink` steht neben dem Link, etwa „Rückgängig“ mit `WERKPLAN_FLAECHE.textlink` und `WERKPLAN_FLAECHE.zeileRueck`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `id` | `string` | Pflicht | Kennung; der Link bekommt die id `zeile-<id>`. |
| `href` | `string` | Pflicht | Ziel des Links. |
| `aktiv` | `boolean` | Pflicht | Gewählte Zeile. |
| `titel` | `string` | Pflicht | Titel. |
| `unter` | `string` | Pflicht | Unterzeile. |
| `unterIcon` | `ReactNode` | ohne | Icon vor der Unterzeile. |
| `unterArt` | `"warn" \| "haken"` | ohne | Art der Unterzeile. |
| `rechts` | `ReactNode` | ohne | Inhalt rechts. |
| `gedimmt` | `boolean` | `false` | Zeile zurückgesetzt. |
| `nachLink` | `ReactNode` | ohne | Element neben dem Link. |
| `onWaehle` | `(id: string) => void` | Pflicht | Wählt die Zeile ohne Neuladen. |
| `className` | `string` | ohne | Zusätzliche Klasse am Link. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.Listenzeile`.

## Was man lässt

- Links oder Knöpfe im Link: Zusatzaktionen gehören in `nachLink`.
- Einen Farbbalken für die gewählte Zeile.
