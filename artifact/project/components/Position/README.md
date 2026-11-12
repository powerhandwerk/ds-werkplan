Die Position ist ein Abschnitt im Lesebereich des Berichtsblatts: Maßstrich, Beschriftung „Pos. 01 · Name“, Überschrift und Einleitung.

## Wann

- Als Kind des `Berichtsblatt`; die Nummer und das Sprungziel setzt das Blatt.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `name` | `string` | Pflicht | Kurzer Name für Kapitelleiste und Beschriftung. |
| `titel` | `ReactNode` | Pflicht | Überschrift (`h2`). |
| `text` | `ReactNode` | ohne | Einleitung. |
| `id` | `string` | `pos-01, pos-02, …` | Sprungziel. |
| `children` | `ReactNode` | ohne | Inhalt der Position. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsblatt`, im Bündel `DsWerkplan.Position`.

## Was man lässt

- Die Nummer von Hand setzen, wenn die Position in einem Berichtsblatt steht.
