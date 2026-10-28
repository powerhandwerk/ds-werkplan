Der Kasten rahmt einen Eintrag mit Icon fein rundum, etwa einen Lead oder eine Sperre.

## Wann

- Für einen hervorgehobenen Eintrag auf einer Arbeitsseite: Icon links, Label, Titel und Unterzeile daneben, rechts optional eine Aktion.
- Das Icon steht auf `lime-soft`, mit `dunkel` auf `ink-950`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `icon` | `ReactNode` | Pflicht | Icon im Feld links. |
| `dunkel` | `boolean` | `false` | Icon-Feld dunkel. |
| `label` | `string` | Pflicht | Beschriftung über dem Titel. |
| `titel` | `string` | Pflicht | Titel. |
| `children` | `ReactNode` | Pflicht | Unterzeile. |
| `rechts` | `ReactNode` | ohne | Aktion rechts. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.Kasten`.

## Was man lässt

- Rundung, Schatten oder einen farbigen Seitenstreifen: Kästen sind eckig.
- Den Kasten auf Nacht.
