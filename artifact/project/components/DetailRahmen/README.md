Der Detailrahmen fasst die Detailfläche rechts neben der Liste ein.

## Wann

- Auf Arbeitsseiten mit Liste links und Detail rechts, als `<section>` mit Namen.
- `spalte` stapelt den Inhalt. Unter 880 px fallen Rahmen und Polster weg, der Inhalt steht untereinander.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `children` | `ReactNode` | Pflicht | Inhalt. |
| `label` | `string` | Pflicht | Name der Fläche (`aria-label`). |
| `spalte` | `boolean` | `false` | Inhalt untereinander. |
| `className` | `string` | ohne | Zusätzliche Klasse. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.DetailRahmen`.

## Was man lässt

- Schatten oder Rundung: Der Rahmen ist eckig mit Haarlinie.
