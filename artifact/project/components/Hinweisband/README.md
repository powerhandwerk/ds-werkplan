Das Hinweisband meldet eine Warnung mit Rahmen und Fläche in Warnfarbe und dem Icon an der ersten Zeile.

## Wann

- Für eine Warnung auf einer Arbeitsseite, mit optionaler Aktion rechts; am Handy rutscht die Aktion unter den Text.
- Der Titel steht fett in Warnfarbe vor dem Text. Das Band trägt `role="status"`.
- Die Warnfarben setzt `WERKPLAN_BAUSTEINE_SEITE` an der Seite; ohne sie gelten Rückfallwerte.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `icon` | `ReactNode` | Pflicht | Icon an der ersten Zeile. |
| `titel` | `string` | Pflicht | Fetter Anfang in Warnfarbe. |
| `children` | `ReactNode` | ohne | Text nach dem Titel. |
| `aktion` | `ReactNode` | ohne | Aktion rechts, etwa ein `RuhigerKnopf` in `klein`. |

Import aus `@powerhandwerk/ds-werkplan/Bausteine`, im Bündel `DsWerkplan.Hinweisband`.

## Was man lässt

- Einen farbigen Seitenbalken statt Rahmen und Fläche.
- Das Hinweisband auf Nacht: Es trägt feste Farben für Papier.
