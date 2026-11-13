Der Bildbeleg zeigt ein Bild im Rahmen mit Haarlinie auf `wp-blatt`, eckig und ohne Schatten, darunter Bildunterschrift und Quellenzeile.

## Wann

- Für Bildschirmfotos und Ausschnitte, die einen Fund belegen; jedes Bild nennt seine Quelle.
- `titel` steht als Beschriftung über dem Bild, `text` und `quelle` in der Bildunterschrift.
- Neben Text in `Spalten`; das Bild füllt seine Spalte und lädt erst beim Hineinscrollen.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `src` | `string` | Pflicht | Adresse des Bildes. |
| `alt` | `string` | Pflicht | Bildbeschreibung für Vorleser. |
| `titel` | `string` | ohne | Beschriftung über dem Bild. |
| `text` | `ReactNode` | ohne | Bildunterschrift. |
| `quelle` | `string` | ohne | Quellenzeile. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Bildbeleg`.

## Was man lässt

- Runde Ecken, Schatten oder Rahmen in Farbe.
- KI-Bilder ohne Kennzeichnung.
