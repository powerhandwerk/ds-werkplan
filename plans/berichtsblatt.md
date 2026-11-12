# Plan: berichtsblatt

> **Status:** gebaut, Abnahme der Probe-Seite offen
> **Projekt:** ds-werkplan, Branch `feature/berichtsblatt`
> **Erstellt:** 12.11.2026
> **Version:** 2.8.0

## Anlass

Flo, 12.11.2026: Die powerhandwerk-Artifacts (Berichte, Analysen, Entscheidungsvorlagen) weichen vom DS Werkplan ab,
weil jede Seite ihr eigenes Layout schreibt. Freigabe des Umfangs: „Ja, umsetzen“. Das Aussehen der neuen Bausteine
nimmt Flo an einer Probe-Seite ab.

## Idee

Eine Berichtsseite schreibt kein eigenes Layout mehr. Sie liefert Inhalt als JavaScript mit `React.createElement`,
zusammengesetzt aus Bausteinen des Bündels `window.DsWerkplan`. Die Seitenhülle heißt `Berichtsblatt`. Vorbild ist die
Prüfbericht-Leseseite im Portal: Titel auf Nacht über die volle Breite, Lesebereich auf Papier mit `KapitelLeiste`,
Abschnittskopf mit Maßstrich, Beschriftung und `h2`.

## Bausteine

Alle ohne `"use client"`, soweit kein Zustand nötig ist. Farben, Grade und Abstände nur aus Tokens, Texte als Props.

| Baustein | Props | Bedeutung |
|---|---|---|
| `Berichtsblatt` | `blatt`, `art?` („Analyse“), `titel`, `lead?`, `felder`, `kennzahlen?`, `stand`, `adressat?` (`"intern"`), `b2b?` (`false`), `kapitelleiste?` (ab drei Positionen), `texte?`, `children` (nur `Position`) | Seitenhülle: Titelfläche auf Nacht (Logo dunkel, Blattzeile, Beschriftung, `h1`, Lead, `Plankopf` auf Nacht, optional Kennzahlen), Lesebereich auf Papier mit Kapitelleiste und den Positionen, Abschluss auf Nacht. „intern“: schmaler Fuß mit Logo, Vermerk und Stand; „betrieb“: `Fuss` in der Fassung `fokus`, Anrede Sie. Die Wurzel trägt `data-berichtsblatt="<Paketversion>"`. |
| `Position` | `name`, `titel`, `text?`, `id?` (`pos-01`, …), `children` | Abschnitt im Lesebereich: Maßstrich, Beschriftung „Pos. 01 · Name“, `h2`, Lead. Die Nummer zählt das Blatt. |
| `Fliesstext` | `vertrauenswuerdigesHtml?` oder `children` | Lauftext in der Rolle `text`, höchstens 62 Zeichen breit. Der Inhalt wird unverändert eingesetzt und darf nur vom Verfasser der Seite stammen, nie aus Daten von außen (Scan-Ergebnisse, Formulare); dafür `children` nehmen. |
| `Tabelle` | `label`, `kopf`, `zeilen`, `breiten?`, `quelle?` | Tabelle auf `wp-blatt` mit Haarlinien, erste Spalte als Zeilenkopf, bei Überbreite waagrecht rollbar. |
| `Bildbeleg` | `src`, `alt`, `titel?`, `text?`, `quelle?` | Bild im Rahmen (Haarlinie, eckig, ohne Schatten), darunter Text und Quelle. |
| `Kennzahl` | `kopf?`, `wert`, `text?`, `groesse?` (48) | Beschriftung, große leichte Zahl in `wp-stark`, Klartext. |
| `Kennzahlen` | `zahlen` | Zwei bis vier Kennzahlen nebeneinander, schmal untereinander. |
| `Merksatz` | `label?`, `children` | Etikett `lead` mit dem Label, daneben der Satz stark; kein Seitenstreifen. |
| `Spalten` | `anzahl?` (2), `verhaeltnis?` (`"1:1"`), `children` | Text neben Bild oder Bildreihen; unter 720 px eigener Breite untereinander. |

Schon vorhanden und in Berichten zu nutzen: `Plankopf`, `Unterstrich`, `Etikett`, `Messwert`, `Besch`, `Massbalken`,
`Masskette`, `Fortschritt`, `Schritte`, `Hinweisband`, `Info`, `Kasten`, `RuhigerKnopf`, `Textlink`, `Logo`, `Fuss`,
`KapitelLeiste`, `SucherEcken`, `BlattZeile`.

## Offen

- Flos Abnahme der Probe-Seite.
- Einbau ins Rezept für Artifacts (claude-config).
