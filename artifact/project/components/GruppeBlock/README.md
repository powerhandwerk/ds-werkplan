Der Gruppenblock setzt einen Gruppenkopf und die Zeilen darunter, ohne eigenes Element.

## Wann

- Wenn Gruppen aus Daten entstehen: je Gruppe ein Block mit ihren Zeilen in einer `Liste`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `titel` | `string` | Pflicht | Titel der Gruppe. |
| `zahl` | `number` | Pflicht | Zahl der Einträge. |
| `children` | `ReactNode` | Pflicht | Die Listenzeilen der Gruppe. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.GruppeBlock`.

## Was man lässt

- Den Gruppenblock außerhalb einer `Liste`.
