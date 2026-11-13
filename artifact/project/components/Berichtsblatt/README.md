Das Berichtsblatt ist die Seitenhülle für Berichte, Analysen und Entscheidungsvorlagen: Titelfläche auf Nacht, Lesebereich auf Papier mit Kapitelleiste und nummerierten Positionen, Fuß auf Nacht.

## Wann

- Für jede Berichtsseite von powerhandwerk, auch als Artifact: Die Seite liefert nur Inhalt, das Blatt liefert Kopf, Schriftfeld, Abschnittsköpfe und Fuß.
- Die Titelfläche zeigt Logo, Blattzeile, Beschriftung (`art`), Titel als `h1`, Einleitung, das Schriftfeld (`Plankopf` auf Nacht) und auf Wunsch bis zu vier Kennzahlen. Bei ungerader Zahl von Feldern zieht das letzte über beide Spalten, sofern kein Feld selbst `breit` ist.
- Kinder sind nur `Position`-Elemente. Das Blatt zählt sie fortlaufend („Pos. 01 · Name“), vergibt die Sprungziele `pos-01`, `pos-02`, … und baut daraus die Kapitelleiste, standardmäßig ab drei Positionen.
- `adressat="intern"` setzt einen schmalen Fuß mit Logo, Vermerk „nicht zur Weitergabe“ und Stand; `adressat="betrieb"` setzt den `Fuss` in der Fassung `fokus` mit Anrede Sie, die B2B-Zeile nur mit `b2b`.
- Es schaltet über seine eigene Breite: Titel ab 768 px in `grad-48`, ab 1024 px Schriftfeld rechts, Kapitelleiste links mitlaufend und Abschnittstitel in `grad-48`. Die Wurzel trägt `data-berichtsblatt` mit der Paketversion.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `blatt` | `string` | Pflicht | Blattzeile im Titel, im Fuß der Fassung „betrieb“ das Blatt. |
| `art` | `string` | `"Analyse"` | Beschriftung über dem Titel. |
| `titel` | `ReactNode` | Pflicht | Seitentitel (`h1`), darf `Unterstrich` enthalten. |
| `lead` | `ReactNode` | ohne | Einleitung unter dem Titel. |
| `felder` | `readonly PlankopfFeld[]` | Pflicht | Schriftfeld im Titel. |
| `kennzahlen` | `readonly KennzahlDaten[]` | ohne | Kennzahlen unter dem Titel, höchstens vier. |
| `stand` | `string` | Pflicht | Stand, etwa „Stand 12.11.2026“; steht in Kapitelleiste und Fuß. |
| `adressat` | `"intern" \| "betrieb"` | `"intern"` | Schmaler Fuß mit Vermerk oder `Fuss` in Sie-Form. |
| `b2b` | `boolean` | `false` | B2B-Zeile im `Fuss` der Fassung „betrieb“. |
| `kapitelleiste` | `boolean` | `ab drei Positionen` | Kapitelleiste zeigen. |
| `texte` | `Partial<BerichtsblattTexte>` | `BERICHTSBLATT_TEXTE` | Titel der Kapitelleiste, Vermerk, Kürzel der Position. |
| `children` | `ReactNode` | ohne | Nur `Position`-Elemente; andere Kinder fallen weg. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsblatt`, im Bündel `DsWerkplan.Berichtsblatt`.

## Was man lässt

- Eine Berichtsseite mit eigenem Layout, eigenem Kopf oder nachgebautem Schriftfeld.
- Andere Kinder als `Position`: Sie erscheinen nicht.
- Mehr als vier Kennzahlen im Kopf.
