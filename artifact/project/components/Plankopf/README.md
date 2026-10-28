Der Plankopf ist das Schriftfeld einer Seite: Label im Beschriftungsstil, Wert darunter, zwei Spalten mit 1-px-Fugen.

## Wann

- Für Fakten wie Seite, Abo und Stand, statt sie in den Fließtext zu schreiben.
- Als `<dl>`, damit Label und Wert vorgelesen zusammengehören. Werte stehen in normaler Schreibung, damit Namen und Adressen lesbar bleiben.
- Felder mit leerem Text fallen weg. `breit` zieht ein Feld über beide Spalten.
- `anhang` steht als letztes Kind im `<dl>` und bringt seine Felder selbst mit.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `felder` | `readonly PlankopfFeld[]` | Pflicht | Je Feld `label`, `wert` (Text oder Element) und optional `breit`. |
| `untergrund` | `"nacht" \| "papier"` | `"papier"` | Fläche, auf der der Plankopf steht. |
| `className` | `string` | ohne | Zusätzliche Klasse. |
| `anhang` | `ReactNode` | ohne | Weitere Felder am Ende. |

Import aus `@powerhandwerk/ds-werkplan/Plankopf`, im Bündel `DsWerkplan.Plankopf`.

## Was man lässt

- Leere oder erfundene Werte: Leere Felder fallen von selbst weg.
- Einen Abo-Namen ohne sein `AboIcon`.
- Werte in Versalien; das ist das `Schriftfeld` der Arbeitsfläche.
