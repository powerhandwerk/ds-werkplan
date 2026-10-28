Besch ist die Beschriftung der Arbeitsfläche: Barlow Semi Condensed 600 in 12 px, Versalien, gesperrt.

## Wann

- Für Labels, Positionsnummern, Gruppenköpfe und Kopfzeilen auf Arbeitsseiten.
- `stark` setzt `ink-950` statt `ink-600`. `gross` setzt die Klasse `beschGross`, heute ebenfalls `grad-12`.
- `as` wählt das Element, etwa `h2` für einen Abschnittskopf.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `children` | `ReactNode` | Pflicht | Text; die Versalien setzt das CSS. |
| `gross` | `boolean` | `false` | Klasse `beschGross`. |
| `stark` | `boolean` | `false` | Starke Farbe. |
| `className` | `string` | ohne | Zusätzliche Klasse. |
| `as` | `"span" \| "p" \| "h2" \| "h3"` | `"span"` | Element. |

Import aus `@powerhandwerk/ds-werkplan/Arbeitsflaeche`, im Bündel `DsWerkplan.Besch`.

## Was man lässt

- Besch für Fließtext.
- Eine freie Farbe; die starke Fassung kommt über `stark`.
