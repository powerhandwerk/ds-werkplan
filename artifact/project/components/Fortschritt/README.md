Der Fortschritt stellt eine Kopfzeile links und rechts über einen Maßbalken.

## Wann

- Für einen Stand mit Text, etwa „3 von 7“ über dem Balken.
- Links steht `Besch`, rechts `Besch` in der starken Fassung. Der Maßbalken steht auf Papier.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `links` | `string` | Pflicht | Text links. |
| `rechts` | `string` | Pflicht | Text rechts. |
| `anteil` | `number` | Pflicht | Anteil in Prozent. |
| `label` | `string` | Pflicht | Name des Balkens für Vorleser. |
| `className` | `string` | ohne | Zusätzliche Klasse, etwa für den Kopf untereinander am Handy. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.Fortschritt`.

## Was man lässt

- Den Fortschritt auf Nacht.
