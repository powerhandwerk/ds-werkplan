Das Schriftfeld der Arbeitsfläche zeigt Label und Wert wie auf den Tafeln, die Werte in Barlow-Versalien, mit 1-px-Fugen.

## Wann

- Für Fakten auf Arbeitsseiten mit Liste links und Detail rechts.
- `voll` streckt die Felder auf die ganze Breite; mit `letzteBreit` nimmt das letzte Feld den Rest, etwa für eine Notiz.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `felder` | `[string, ReactNode][]` | Pflicht | Paare aus Label und Wert; das Label ist der Schlüssel und muss eindeutig sein. |
| `voll` | `boolean` | `false` | Felder auf ganzer Breite. |
| `letzteBreit` | `boolean` | `false` | Das letzte Feld nimmt den Rest. |
| `className` | `string` | ohne | Zusätzliche Klasse. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.Schriftfeld`.

## Was man lässt

- Das Schriftfeld für Namen und Adressen auf Seiten für Betriebe; dort steht der `Plankopf` in normaler Schreibung.
- Das Schriftfeld auf Nacht: Es trägt feste Farben für Papier.
