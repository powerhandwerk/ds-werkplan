Die Position ist ein Abschnitt im Lesebereich des Berichtsblatts: Maßstrich, Beschriftung „Pos. 01 · Name“, Überschrift und Einleitung.

## Wann

- Als Kind des `Berichtsblatt`; Nummer, Kürzel und Sprungziel setzt das Blatt.
- Der Name ist kurz, er steht in Kapitelleiste und Beschriftung. Die Überschrift sagt in einem Satz, worum es geht.
- Der Inhalt steht in einer Spalte mit 24 px Abstand: `Fliesstext`, `Tabelle`, `Bildbeleg`, `Kennzahlen`, `Merksatz`, `Spalten`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `name` | `string` | Pflicht | Kurzer Name für Kapitelleiste und Beschriftung. |
| `titel` | `ReactNode` | Pflicht | Überschrift (`h2`). |
| `text` | `ReactNode` | ohne | Einleitung in der Rolle `lead`. |
| `id` | `string` | `pos-01, pos-02, …` | Sprungziel. |
| `children` | `ReactNode` | ohne | Inhalt der Position. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsblatt`, im Bündel `DsWerkplan.Position`.

## Was man lässt

- Die Nummer von Hand setzen, wenn die Position in einem Berichtsblatt steht.
- Lange Namen: Sie brechen die Chips der Kapitelleiste am Handy.
