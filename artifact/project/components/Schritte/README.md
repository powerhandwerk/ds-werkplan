Schritte nummerieren Arbeitsschritte mit 01, 02 und folgenden, je mit optionalem Titel.

## Wann

- Für eine kurze Abfolge in einem Detail oder Kasten.
- Die Liste ist ein `<ol>`; die Nummer ist für Vorleser versteckt. `gross` vergrößert den Kreis der Nummer auf 24 px.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `schritte` | `{ titel?: string; text: string }[]` | Pflicht | Die Schritte in Reihenfolge. |
| `gross` | `boolean` | `false` | Größere Nummer. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.Schritte`.

## Was man lässt

- Nummern in den Text schreiben; die Zählung kommt aus der Liste.
