Der Icon-Knopf ist quadratisch und trägt nur ein Icon; sein Label steht als `aria-label` und `title`.

## Wann

- Für Werkzeugaktionen in Listen, im Detailrahmen und in Kopfzeilen, etwa Kopieren, Löschen oder Schließen.
- Auf Nacht mit `nacht`.
- Als Link: die Klasse `WERKPLAN_FLAECHE.iconKnopf` an einem eigenen `<a>`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `icon` | `ReactNode` | Pflicht | Das Icon. |
| `label` | `string` | Pflicht | Name des Knopfs, steht als `aria-label` und `title`. |
| `onClick` | `() => void` | ohne | Aktion. |
| `disabled` | `boolean` | ohne | Gesperrt. |
| `nacht` | `boolean` | `false` | Fassung für Nacht. |
| `groesse` | `number` | `32` | Kantenlänge in px. |
| `className` | `string` | ohne | Zusätzliche Klasse. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.IconKnopf`.

## Was man lässt

- Ein Icon-Knopf ohne sprechendes `label`.
- Den Icon-Knopf für die Hauptaktion.
