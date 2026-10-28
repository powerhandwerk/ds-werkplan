Der ruhige Knopf ist der Knopf für Nebenaktionen: transparenter Grund, 1 px Rahmen und eine Rundung wie die Pille im Logo.

## Wann

- Für Nebenaktionen neben der Lichtkante, in Dialogen als „Abbrechen“ und als Aktion in `Hinweisband` oder `Kasten`.
- Auf Nacht mit `nacht`.
- Drei Größen: `normal` 40 px, `klein` 34 px, `handy` 48 px hoch.
- Alle übrigen Attribute gehen an den `<button>`; `type` ist `"button"`, solange der Verbraucher keinen anderen setzt.
- `WERKPLAN_KNOPF.ruhig` gibt einem fremden Knopf dasselbe Aussehen.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `icon` | `ReactNode` | ohne | Icon vor dem Text. |
| `nacht` | `boolean` | `false` | Fassung für Nacht. |
| `groesse` | `"normal" \| "klein" \| "handy"` | `"normal"` | Höhe 40, 34 oder 48 px. |
| `className` | `string` | ohne | Zusätzliche Klasse. |
| `children` | `ReactNode` | ohne | Beschriftung. |
| … | `ButtonHTMLAttributes` | ohne | Alle Attribute eines `<button>`. |

Import aus `@powerhandwerk/ds-werkplan/Bausteine`, im Bündel `DsWerkplan.RuhigerKnopf`.

## Was man lässt

- Den ruhigen Knopf als Hauptaktion: Die trägt die Lichtkante.
- Eine eigene Farbe auf Nacht; dort `nacht` setzen.
