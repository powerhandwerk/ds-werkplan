Der Toast ist eine kurze Bestätigung unten in der Mitte, dunkel, mit Lime-Haken und optionaler Aktion wie „Rückgängig“.

## Wann

- Als Rückmeldung nach einer Aktion, mit Aktion und Tastenkappe für die Abkürzung.
- Er steht fest 22 px über dem unteren Rand; unter 880 px läuft er über die volle Breite, 96 px über dem Rand.
- Er trägt `role="status"` und `aria-live="polite"`, außer mit `ohneLiveRegion`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `haken` | `ReactNode` | Pflicht | Inhalt des Lime-Kreises, meist ein Haken-Icon. |
| `text` | `string` | Pflicht | Die Bestätigung. |
| `aktion` | `{ label, icon?, taste?, onClick }` | ohne | Aktion rechts; `taste` erscheint als Tastenkappe. |
| `ohneLiveRegion` | `boolean` | `false` | Ohne Live-Region, wenn die Seite den Text selbst über den StatusAnnouncer ansagt. |

Import aus `@powerhandwerk/ds-werkplan/Bausteine`, im Bündel `DsWerkplan.Toast`.

## Was man lässt

- `ohneLiveRegion`, wenn die Seite den Text nicht selbst ansagt.
