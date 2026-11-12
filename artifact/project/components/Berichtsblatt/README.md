Das Berichtsblatt ist die Seitenhülle für Berichte, Analysen und Entscheidungsvorlagen: Titel auf Nacht, Lesebereich auf Papier mit Kapitelleiste, Abschluss auf Nacht.

## Wann

- Für jedes powerhandwerk-Artifact mit Bericht, Analyse oder Entscheidungsvorlage. Kinder sind nur `Position`-Elemente.
- Es nummeriert die Positionen fortlaufend und baut aus ihnen die Kapitel der Kapitelleiste, ab drei Positionen.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `blatt` | `string` | Pflicht | Blattzeile im Titel. |
| `art` | `string` | `"Analyse"` | Beschriftung über dem Titel. |
| `titel` | `ReactNode` | Pflicht | Seitentitel, darf `Unterstrich` enthalten. |
| `lead` | `ReactNode` | ohne | Einleitung unter dem Titel. |
| `felder` | `readonly PlankopfFeld[]` | Pflicht | Schriftfeld im Titel. |
| `kennzahlen` | `readonly KennzahlDaten[]` | ohne | Kennzahlen unter dem Titel. |
| `stand` | `string` | Pflicht | Stand, etwa „Stand 12.11.2026“. |
| `adressat` | `"intern" \| "betrieb"` | `"intern"` | Schmaler Fuß mit Vermerk oder `Fuss` in der Fassung `fokus`. |
| `kapitelleiste` | `boolean` | `ab drei Positionen` | Kapitelleiste zeigen. |
| `texte` | `Partial<BerichtsblattTexte>` | `BERICHTSBLATT_TEXTE` | Titel der Kapitelleiste, Vermerk, Kürzel der Position. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsblatt`, im Bündel `DsWerkplan.Berichtsblatt`.

## Was man lässt

- Eigenes Layout um das Blatt herum.
- Andere Kinder als `Position`.
