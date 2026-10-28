Der feste Knopf ist dunkel gefüllt und steht nur als Bestätigung in Dialogen.

## Wann

- Als Bestätigung eines Dialogs, neben „Abbrechen“ als `RuhigerKnopf`.
- `WERKPLAN_KNOPF.fest` gibt einem fremden Knopf dasselbe Aussehen, etwa über `confirmProps`.
- Alle übrigen Attribute gehen an den `<button>`; `type` ist `"button"`, solange der Verbraucher keinen anderen setzt.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `icon` | `ReactNode` | ohne | Icon vor dem Text. |
| `className` | `string` | ohne | Zusätzliche Klasse. |
| `children` | `ReactNode` | ohne | Beschriftung. |
| … | `ButtonHTMLAttributes` | ohne | Alle Attribute eines `<button>`. |

Import aus `@powerhandwerk/ds-werkplan/Bausteine`, im Bündel `DsWerkplan.FesterKnopf`.

## Was man lässt

- Den festen Knopf außerhalb von Dialogen oder als Hauptaktion einer Seite.
- Den festen Knopf auf Nacht: Sein Körper ist `ink-950`, er ist für Papier gesetzt.
