Die Tastenkappe zeigt eine Taste im Text, etwa die Abkürzung zu einer Aktion.

## Wann

- Im Fließtext und im `Toast` neben der Aktion.
- Auf Nacht mit `nacht`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `children` | `ReactNode` | Pflicht | Name der Taste. |
| `nacht` | `boolean` | `false` | Fassung für Nacht. |

Import aus `@powerhandwerk/ds-werkplan/Bausteine`, im Bündel `DsWerkplan.Tastenkappe`.

## Was man lässt

- Die Tastenkappe als Knopf: Sie ist ein `<kbd>` ohne Funktion.
