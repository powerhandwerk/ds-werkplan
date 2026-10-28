Die Kapitelleiste listet die Kapitel einer langen Seite: am Handy als Chip-Leiste über den Kapiteln, ab 1024 px links daneben und mitlaufend.

## Wann

- Auf langen Seiten der Kundenseite mit mehreren Kapiteln, deren Köpfe die ids aus `kapitel` tragen.
- Markiert ist das letzte Kapitel, dessen Kopf das obere Drittel des Fensters erreicht hat, am Seitenende das letzte. Ohne JavaScript bleibt sie eine Liste von Sprungmarken.
- Die negativen Ränder am Handy gleichen die Seitenluft der Kundenseite aus (20 px, ab 768 px 32 px). Das Raster daneben setzt die Seite. Client-Komponente.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `titel` | `string` | Pflicht | Titel und Name der Leiste. |
| `kapitel` | `readonly KapitelEintrag[]` | Pflicht | Je Kapitel `id` und `name`. |
| `stand` | `string` | Pflicht | Zeile unter der Liste, etwa der Stand. |
| `kapitelNr` | `(nummer: number) => string` | `kapitelNummer` | Nummer je Kapitel, Standard zweistellig („01“). |

Import aus `@powerhandwerk/ds-werkplan/KapitelLeiste`, im Bündel `DsWerkplan.KapitelLeiste`.

## Was man lässt

- Die Kapitelleiste auf Nacht: Ihr Grund ist `ink-100`.
