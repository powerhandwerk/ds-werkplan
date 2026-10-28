Der Reiter ist die Navigation der Kundenseite: ab 1024 px eine Reiter-Leiste, darunter ein Menü als `<details>` ohne Client-JavaScript.

## Wann

- Im Kopf der Kundenseite auf Nacht. Der aktive Reiter trägt den Lime-Unterstrich und `aria-current="page"`.
- Unter 1024 px steht der Knopf „Menü“ mit der Zahl wartender Schritte; die Menütafel zeigt dieselben Reiter mit ihrem Stand.
- Die Zeile der App muss positioniert sein (`position: relative`), denn die Menütafel legt sich darunter über die volle Breite.
- Logo, Pille „Sicher angemeldet“ und der Weg zu „Wer hat Zugriff“ setzt die App.
- Die Standardtexte sind in Sie-Form (`REITER_TEXTE`).

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `eintraege` | `readonly ReiterEintrag[]` | Pflicht | Je Reiter `kennung`, `name`, `href` (null heißt ohne Funktion) und optional `stand` mit `text` und `art`. |
| `aktiv` | `string \| null` | Pflicht | Kennung des aktiven Reiters. |
| `wartend` | `number` | `0` | Zahl wartender Schritte am Menüknopf. |
| `texte` | `ReiterTexte` | `REITER_TEXTE` | Namen von Leiste, Menü und Menüliste. |
| `ende` | `ReactNode` | ohne | Letztes Kind der Menüliste, bringt sein `<li>` selbst mit. |

Import aus `@powerhandwerk/ds-werkplan/Reiter`, im Bündel `DsWerkplan.Reiter`.

## Was man lässt

- Den Reiter auf Papier: Die nicht aktiven Reiter (`ink-300`) und die Menütafel (`ink-950`) sind für Nacht gesetzt.
- Eine Zeile ohne Positionierung um den Reiter.
