Der Merksatz hebt einen Satz hervor: ein Etikett `lead` mit dem Label, daneben der Satz stark in `wp-stark`.

## Wann

- Für die eine Folgerung eines Fundes, höchstens einer je Fund.
- Das Label ist ein Wort wie „Folge“ oder „Empfehlung“; der Satz steht in Textgröße, Gewicht 600.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `label` | `string` | ohne | Text des Etiketts, etwa „Folge“. |
| `children` | `ReactNode` | Pflicht | Der Satz. |

Import aus `@powerhandwerk/ds-werkplan/Berichtsteile`, im Bündel `DsWerkplan.Merksatz`.

## Was man lässt

- Einen Seitenstreifen oder eine farbige Fläche statt des Etiketts.
- Mehrere Merksätze hintereinander.
