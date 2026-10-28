Die Ziffernfelder nehmen einen Code Ziffer für Ziffer auf; Einfügen oder Autofill verteilen einen ganzen Code auf alle Felder.

## Wann

- Für die Code-Eingabe der Kundenseite, etwa bei der Anmeldung auf Nacht.
- Die Felder sind gesteuert: `ziffern` kommt von der App, `aendern` bekommt eine Funktion vom alten zum neuen Stand.
- Rücktaste und Pfeile springen zwischen den Feldern; jede neue Antwort (`fokusAnlass`) setzt den Fokus ins erste Feld.
- Die Länge ist die Länge von `ziffern`, Standard 6 (`CODE_LAENGE_STANDARD`, `leereZiffern()`).
- Die Felder haben keinen `name`; abgeschickt wird ein verborgenes Feld, das die App aus `ziffern` setzt. Client-Komponente.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `ziffern` | `readonly string[]` | Pflicht | Je Feld eine Ziffer oder leer. |
| `aendern` | `(neu: (vorher: string[]) => string[]) => void` | Pflicht | Übernimmt eine Änderung. |
| `fehlerId` | `string \| null` | Pflicht | id des Fehlertexts; gesetzt heißt ungültig. |
| `fokusAnlass` | `unknown` | Pflicht | Jeder neue Wert setzt den Fokus ins erste Feld. |
| `zifferLabel` | `(nummer, laenge) => string` | `zifferLabelStandard` | Name je Feld, Standard „Ziffer 1 von 6“. |

Import aus `@powerhandwerk/ds-werkplan/ZiffernFelder`, im Bündel `DsWerkplan.ZiffernFelder`.

## Was man lässt

- Die Ziffernfelder auf Papier: Das helle Rot am ungültigen Feld ist für Nacht gesetzt.
- Einen `name` an den Feldern erwarten.
