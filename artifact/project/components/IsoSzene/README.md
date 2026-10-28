Die Iso-Szene erklärt einen Ablauf in Stufen: eine isometrische Zeichnung auf Nacht, deren Teile nacheinander einrasten und leuchten (Grafikstil B).

## Wann

- Um Abläufe und Zerlegungen zu erklären, etwa die Explosionszeichnung eines Profils (`explosionProfil`, 4 Stufen in `EXPLOSION_STUFEN`).
- Ist die Zeichnung zu 50 % im Bild, rastet einmal Stufe 1 bis `stufen` im Takt von 700 ms ein (`data-stand` 0 bis `stufen`).
- Im Server-HTML steht `data-stand="0"`. Bei reduzierter Bewegung, ohne `matchMedia` oder ohne `IntersectionObserver` stehen sofort alle Stufen.
- Die Zeichnung ist nur Daten (`viewBox`, `knoten`, `klasse`, `stil`): Eine Server-Komponente rechnet sie und reicht sie an `IsoSzene`. `idPraefix` beim Rechnen macht die Filter-IDs je Seite eindeutig, im Client liefert es `useSvgPraefix`.
- Lime heißt „eingeschaltet“ und darf an mehreren Teilen leuchten. `fokus` hebt eine Stufe hervor, ohne den Ablauf zu ändern.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `zeichnung` | `IsoZeichnung` | Pflicht | `{ viewBox, knoten, klasse?, stil? }`, etwa aus `explosionProfil()`. |
| `stufen` | `number` | Pflicht | So viele Stufen rasten nacheinander ein. |
| `beschreibung` | `string` | Pflicht | Was die Grafik zeigt, für Vorleser (`aria-label`). |
| `unterschrift` | `ReactNode` | ohne | Unterschrift unter der Zeichnung. |
| `fokus` | `number` | ohne | Hebt eine Stufe hervor (`data-fokus`). |
| `className` | `string` | ohne | Zusätzliche Klasse der Bühne. |

Import aus `@powerhandwerk/ds-werkplan/IsoSzene`, im Bündel `DsWerkplan.IsoSzene`.

## Was man lässt

- Lime ohne Bedeutung: Lime heißt „eingeschaltet“.
- Text als Attribut. Texte stehen als Kinder im Knotenbaum, React escapt sie.
- Eine Grafik ohne Beschreibung.
