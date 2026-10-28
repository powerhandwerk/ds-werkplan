Die Liste ist die linke Spalte der Arbeitsfläche: ein `<ul>` mit Gruppenköpfen und Listenzeilen.

## Wann

- Für Einträge, aus denen einer ins Detail rechts gewählt wird.
- Kinder sind `Gruppe`, `GruppeBlock` und `Listenzeile`.
- `inKarte` setzt die Liste in eine Karte mit Rahmen; am Handy läuft sie dann nicht randlos.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `label` | `string` | Pflicht | Name der Liste (`aria-label`). |
| `inKarte` | `boolean` | `false` | Liste in einer Karte. |
| `children` | `ReactNode` | Pflicht | Gruppenköpfe und Zeilen. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.Liste`.

## Was man lässt

- Andere Elemente als `<li>` direkt in der Liste.
