Die Filterleiste wählt Bereiche über der Liste; jeder Knopf ist ein echter Link mit einer Zahl.

## Wann

- Über einer `Liste`, um zwischen Bereichen zu wechseln.
- Ein einfacher Klick wählt ohne Neuladen, der aktive Bereich trägt `aria-current="page"`.
- `WERKPLAN_FLAECHE.filterKnopf` und `WERKPLAN_FLAECHE.filterZahl` geben einem eigenen Schalter dasselbe Aussehen.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `label` | `string` | Pflicht | Name der Leiste (`aria-label`). |
| `eintraege` | `FilterEintrag[]` | Pflicht | Je Bereich `wert`, `label` und `zahl`. |
| `aktiv` | `T` | Pflicht | Wert des aktiven Bereichs. |
| `hrefFuer` | `(wert: T) => string` | Pflicht | Ziel je Bereich. |
| `onWaehle` | `(wert: T) => void` | Pflicht | Wählt den Bereich ohne Neuladen. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.Filterleiste`.

## Was man lässt

- Knöpfe ohne Ziel: Jeder Bereich ist ein Link.
