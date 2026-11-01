Die Paketkarten zeigen die drei Abo-Pakete nebeneinander: je Karte Emblem und Name, Nutzen, Für-wen, Preis beider Laufzeiten, Zusatz und Aktion, Abschnittslabel und die Liste mit Produktzeichen.

## Wann

- Wo Betriebe zwischen Standard, Profi und Platzhirsch wählen, etwa auf der Preisseite und den Zielseiten der Website, auf Papier oder auf Nacht.
- Nutzen zuerst, die Leistungen sind der Beleg. Jede Karte nennt nur, was gegenüber der vorigen dazukommt; das Label sagt es, etwa „Alles aus Standard, dazu“.
- Die empfohlene Karte (`empfohlen`) steht im Gegenton zur Fläche, auf Papier Nacht und auf Nacht Papier, mit Lime-Rahmen und dem Etikett „Unsere Empfehlung“ auf der oberen Kante. Ihre Produktzeichen und `aktion(grund)` bekommen diesen Gegenton.
- Die Karten schalten über ihre eigene Breite: unter 640 px untereinander, bis 1.080 px untereinander und innen zweispaltig, darüber drei Spalten mit Subgrid. Label und Liste aller Karten stehen auf einer Linie, auch beim Umschalten der Laufzeit.
- Beide Laufzeiten stehen im Server-HTML. Sichtbar ist 24, außer `laufzeit` oder ein Vorfahr mit `data-laufzeit` (`LaufzeitBereich`) wählt 12. Der Baustein selbst rendert auf dem Server.
- Alle Texte und Preise kommen fertig vom Verbraucher, aus seinem Preisregister. Der Baustein rechnet nichts. Produktzeichen stehen in 44 px und sind dekorativ.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `karten` | `Paketkarte[]` | Pflicht | Je Karte `paket`, `nutzen`, `fuerWen`, `preis` mit `24` und `12` (je `betrag`, `einheit`, optional `zusatz`), `label`, `reihen` (je `zeichen`, `titel`, `text`) und optional `aktion(grund)`. |
| `empfohlen` | `Paket` | ohne | Diese Karte trägt Etikett, Lime-Rahmen und Gegenton. |
| `untergrund` | `"papier" \| "nacht"` | `"papier"` | Fläche unter den Karten. |
| `laufzeit` | `12 \| 24` | ohne | Wählt die Laufzeit am Baustein selbst; ohne gilt ein Vorfahr mit `data-laufzeit` oder 24. |
| `texte` | `Partial<PaketkartenTexte>` | `PAKETKARTEN_TEXTE` | Etikett der Empfehlung und zugängliche Namen der Karten. |

Import aus `@powerhandwerk/ds-werkplan/Paketkarten`, im Bündel `DsWerkplan.Paketkarten`.

## Was man lässt

- Preise oder Paketinhalte im Baustein: Sie kommen als Props aus dem Preisregister des Verbrauchers.
- Alle Leistungen auf jeder Karte wiederholen: Jede Karte nennt nur, was dazukommt.
- Mehr als eine Empfehlung oder Lime an anderen Karten.
- Echte Preise in Mustern und Vorschauen: Muster tragen „Muster, keine echten Preise und Leistungen.“
