Der Fuß schließt jede Seite auf Nacht ab: Kontakt, Rechtszeile, auf Wunsch die B2B-Zeile, Logo mit Markenzeile und Plankopf.

## Wann

- Unter jeder Seite, im `<footer>` der Seite. Der Baustein liefert nur den Inhalt, damit es genau ein `<footer>` gibt.
- Die Fassung `fokus` gilt für Seiten mit einem Ziel, etwa die Gründungsseiten: Kontakt in einer Zeile, Impressum und Datenschutz, keine Linkgruppen.
- Fassungen lassen Teile weg und sortieren nie um. Text und Ziel jedes Links kommen aus `ZIELE`, die Reihenfolge aus `FUSS_REIHENFOLGE`; `fussLinks()` liefert die Links einer Fassung ohne Rendern.
- Er schaltet über seine eigene Breite: unter 640 px untereinander, ab 640 px der Kontakt in einer Zeile, ab 1.024 px der Plankopf rechts.
- `b2b` ist Pflicht und ohne Standard: Die Seite entscheidet, ob „Nur für Unternehmer · Alle Preise netto zzgl. USt.“ dasteht.
- Mit `leistungsschein` zeigt die Rechtszeile auch AGB und Leistungsschein. `basis` setzt eigenen Seiten einen Vorsatz voran, damit Subdomains auf das zentrale Impressum zeigen.
- Er rendert auf dem Server, ohne Skript und ohne Bewegung. Jeder Fuß trägt `data-fuss` und `data-fuss-version`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `variante` | `"fokus"` | Pflicht | Fassung; „voll“ und „tippgeber“ folgen. |
| `b2b` | `boolean` | Pflicht | B2B-Zeile zeigen. |
| `blatt` | `string` | Pflicht | Blatt im Plankopf, etwa „Gründung · Website“. |
| `stand` | `string` | ohne | Stand im Plankopf; ohne Wert fällt das Feld weg. |
| `anrede` | `"du" \| "sie"` | `"du"` | Anrede des Kontaktsatzes. |
| `basis` | `string` | `""` | Vorsatz für eigene Seiten; ein Schrägstrich am Ende fällt weg. |
| `leistungsschein` | `string` | ohne | Fertige Adresse des Leistungsscheins; zeigt AGB und Leistungsschein. |
| `texte` | `Partial<FussTexte>` | `FUSS_TEXTE` | Überschrift, Kontaktsatz je Anrede, B2B-Zeile, Name der Navigation und Plankopf-Beschriftungen. Linktexte kommen aus `ZIELE`. |
| `className` | `string` | ohne | Zusätzliche Klasse an der Wurzel. |

Import aus `@powerhandwerk/ds-werkplan/Fuss`, im Bündel `DsWerkplan.Fuss`.

## Was man lässt

- Ein `<footer>` im Baustein: Das stellt die Seite, genau eines je Seite.
- Links umsortieren oder umbenennen; Text, Ziel und Reihenfolge kommen aus `ZIELE` und `FUSS_REIHENFOLGE`.
- Externe Links in neuem Tab oder Übergänge an den Links.
