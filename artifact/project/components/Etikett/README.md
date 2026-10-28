Das Etikett ist ein kleines Schild in Versalien für Stand und Art eines Eintrags, in sechs Arten.

## Wann

- `linie` mit Rahmen, `gestrichelt` mit gestricheltem Rahmen, `voll` als dunkle Fläche mit heller Schrift, `lead` als helle Lime-Fläche mit dunkler Schrift, `warn` in Warnfarbe, `still` leise.
- Eine Hervorhebung auf Papier ist das Etikett „voll“.
- Die Warnfarben setzt `WERKPLAN_BAUSTEINE_SEITE` an der Seite; ohne sie gelten Rückfallwerte.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `art` | `"linie" \| "gestrichelt" \| "voll" \| "lead" \| "warn" \| "still"` | `"linie"` | Art des Etiketts. |
| `icon` | `ReactNode` | ohne | Icon vor dem Text. |
| `children` | `ReactNode` | Pflicht | Text; die Versalien setzt das CSS. |
| `className` | `string` | ohne | Zusätzliche Klasse. |

Import aus `@powerhandwerk/ds-werkplan/Bausteine`, im Bündel `DsWerkplan.Etikett`.

## Was man lässt

- Lime als Schriftfarbe: `lead` ist eine Lime-Fläche mit dunkler Schrift.
- Eigene Farben neben den sechs Arten.
- Etiketten auf Nacht: Sie tragen feste Ink-Farben für Papier.
