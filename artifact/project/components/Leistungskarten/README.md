Die Leistungskarte erklärt eine Leistung mit einer animierten isometrischen Figur auf einer Bühne mit Sucher-Ecken, darüber Titel und Nummer, darunter der Text (Grafikstil A).

## Wann

- Um Leistungen und Angebote zu erklären, auf Papier oder auf Nacht.
- Jede Figur hat eine Geste: Der Wert `t` läuft von 0 (Ruhe) bis 1 (Geste fertig).
- Aktiv wird eine Karte bei Hover, bei Tastaturfokus und am Handy einmal beim Hineinscrollen. Dann kippt sie um -1,6°, hebt sich ohne Schatten um 6 px an und wechselt auf die Gegenfläche. Die breite Karte kippt flacher: um -0,6°, 4 px angehoben, ohne Vergrößerung.
- Im Server-HTML steht jede Szene im Ruhezustand. Bei reduzierter Bewegung steht die Geste sofort am Ende. Ohne `matchMedia` gilt das Gerät als ohne Hover. Ohne Hover spielt die Geste, sobald die Karte zum Sichtanteil im Bild ist; fehlt dort der `IntersectionObserver`, steht sofort das Ende. Mit Hover bleibt die Karte in Ruhe bis Hover oder Fokus.
- Szenen sind Funktionen und überqueren die Grenze zwischen Server und Client nicht. Das Szenen-Register liegt deshalb in einem eigenen Client-Modul (`"use client"`) als feste Modulkonstante; die Seite reicht nur `karten` weiter.
- Karten, deren `szene` im Register fehlt, fallen weg. Vier Karten stehen 2 × 2 oder in einer Reihe; `breit` legt eine einzelne Karte quer über die volle Breite.
- Neue Szenen zeichnen mit dem Werkzeug `w` der Engine (`leistungskarten-engine`) und den Formen-Helfern (`leistungskarten-formen`). Beispiele: `LEISTUNGSKARTEN_BEISPIELE` mit `profil` und `sanierung`, Musterkarten `LEISTUNGSKARTEN_MUSTER`.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `karten` | `readonly LeistungsKarte[]` | Pflicht | Karten mit `szene`, `titel`, `teaser` und optional `nr` und `schliesst`. |
| `szenen` | `SzenenRegister` | Pflicht | Szenen-Register: Schlüssel aus `szene` auf die Szene, als feste Referenz. |
| `untergrund` | `"papier" \| "nacht"` | Pflicht | Fläche, auf der die Karten stehen. |
| `breit` | `boolean` | `false` | Eine Karte quer über die volle Breite, Bühne links, Text rechts. |

Import aus `@powerhandwerk/ds-werkplan/Leistungskarten`, im Bündel `DsWerkplan.Leistungskarten`.

## Was man lässt

- Mehr als ein Lime-Motiv in einer Figur. Ein Motiv darf aus mehreren Flächen bestehen, wenn sie zusammen eine Aussage tragen, etwa fünf Sterne.
- Eine Figur ohne Geste.
- Eine Szene freihand statt mit Engine und Formen-Helfern.
- Text an `w.text()` vorbei: Eigenes Markup mit Text umginge das Escapen, das Markup geht per `innerHTML` ins SVG.
