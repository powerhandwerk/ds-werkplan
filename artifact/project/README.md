DS Werkplan ist die Gestaltung von powerhandwerk für Kundenseite, Portal und Website. Sie kommt aus dem Bauplan, nicht aus dem Webdesign: zwei Flächen mit Millimeterraster, ein Schriftfeld für Fakten, nummerierte Positionen, große leichte Messwerte, Maßbalken statt Diagrammen und genau ein Licht in Lime dort, wo gehandelt wird.

## Grundsätze

1. **Zwei Flächen.** Nacht trägt den Kopf und das, was als Nächstes ansteht. Papier trägt alles, was gelesen wird. Beide zeigen das Millimeterraster.
2. **Schriftfeld.** Fakten wie Seite, Abo und Stand stehen im Schriftfeld (`Plankopf`) mit Fugen, nicht im Fließtext.
3. **Positionen.** Bereiche sind nummeriert wie auf einem Werkplan: „Pos. 01“ bis „Pos. 06“, Blätter mit „Blatt 02 · Zugänge“.
4. **Messwerte.** Große, leichte Zahlen in `messwert`, darunter `beschriftung` und `quelle`. Fehlt eine Messung, steht das da: „Noch keine Messung“.
5. **Ein Licht.** Lime erscheint nur, wo gehandelt wird: Lichtkante, aktiver Reiter, Füllung des Maßbalkens, Sucher-Ecken der Hauptkarte, Unterstrich, Etikett.
6. **Maße.** Fortschritt sieht aus wie Vermessung: `Massbalken` und `Masskette` statt bunter Balkendiagramme.

Gelieferte Fakten und Recht gehen vor dem Leserjob, der Leserjob vor der Marke, die Marke vor der Komposition. Macht eine schöne Anordnung eine Zahl unlesbar, ist die Anordnung falsch.

## Stimme

**Der Adressat entscheidet die Anrede, nicht der Kanal.** Öffentliche Markenflächen (Website, Landingpages, Videos, Stellenanzeigen) duzen. Alles, was sich an einen bestimmten Betrieb richtet, siezt: Kundenseite, Angebot, Monatsbericht, Prüfbericht, Mail. Bausteine mit eingebautem Text (`Reiter`, `ZiffernFelder`, `KopierenKnopf`) bringen Standardtexte in Sie-Form mit; jeder Text lässt sich per Prop ersetzen.

**Ton.** Ein erfahrener Kollege, der klar redet: ruhig, auf Augenhöhe, in Hauptsätzen. Der Betrieb ist der Held, powerhandwerk das Werkzeug. Ausrufezeichen sind die Ausnahme. Überschriften sagen in einem ganzen Satz, worum es geht, und im Satz steht, wer handelt. So spricht die Kundenseite:

> Guten Tag. Ein Schritt wartet auf Sie.
>
> Hier sehen Sie, was als Nächstes ansteht und was wir schon für Sie getan haben.

| So nicht | So |
|---|---|
| Mehr Aufträge garantiert! | Beispiel: Platz 2 im lokalen Paket, gemessen über 90 Tage. |
| Wir bieten innovative, ganzheitliche Lösungen für Ihren Betrieb. | Wir machen drei Dinge: Profil pflegen, Bewertungen beantworten, monatlich berichten. |
| Jede Bewertung wird beantwortet. | Wir beantworten jede Bewertung. |
| Sie erhalten ca. 40 Anrufe mehr pro Monat. | Anrufe über das Profil, gemessen 06/2026: 18. Vormonat: 11. |

**Feste Regeln für jeden Text:**

- Keine Gedankenstriche, weder den langen noch den kurzen mit Leerzeichen. Als Trenner dient der Mittelpunkt „·“. Der Bis-Strich ohne Leerzeichen bleibt: „10–20“.
- Echte Umlaute, nie ae, oe, ue.
- Keine Emoji. Neben den Icons gibt es nur Lime-Punkt, ✓ und §.
- Kein Agentursprech, keine Floskeln: nicht „innovativ“, „ganzheitlich“, „Boost“, „skalieren“, keine Superlative wie „führend“ oder „einzigartig“.
- Wirkung nur gemessen: keine Garantie, keine Wirkungszusage, kein Rangversprechen, keine Hochrechnung, keine fremde Statistik. Jede Zahl, die eine Wirkung zeigt, nennt Messzeitraum und Quelle (`quelle`).
- Datum als „TT.MM.JJJJ“, Prozent mit Komma, vor dem Eurozeichen ein geschütztes Leerzeichen.
- Google steht als Wort, nie als Logo.
- Ein Abo-Name (Standard, Profi, Platzhirsch) steht nie ohne sein `AboIcon`.

## Flächen

Jede Seite setzt ihre Inhalte auf eine Fläche: `.papier` (Grund `ink-100`), `.nacht` (Grund `ink-950`) oder `.nachtHell` (Grund `ink-900`); `.aufPapier` und `.aufNacht` geben einem Bereich die Rollen, ohne den Grund zu malen. Erst innerhalb einer Fläche gelten die Rollen `--wp-*`, nie auf der Seite selbst: Sonst stünde dunkle Schrift auf dunklem Grund.

| Rolle | Wofür |
|---|---|
| `wp-grund` | Grund der Fläche |
| `wp-stark` | Überschriften, starke Schrift, Werte |
| `wp-text` | Fließtext |
| `wp-gedaempft` | Beschriftung, Nebeninformation |
| `wp-quelle` | Quellenzeile unter einer Zahl |
| `wp-linie`, `wp-linie-fein` | Haarlinien, Fugen, Maßlinien |
| `wp-fokus` | Fokusring |
| `wp-blatt` | Karte und Schriftfeld auf der Fläche |
| `wp-raster` | Millimeterraster, 24 px |

Schrift erreicht auf ihrer Fläche mindestens 4,5:1, große Schrift, Linien mit Bedeutung und der Fokusring mindestens 3:1. Das gilt in Papier und Nacht.

## Farbe

- **Ink** ist eine warme Grauleiter mit zehn Stufen von `ink-950` bis `ink-050`. Zwischentöne entstehen mit `color-mix()` aus zwei Nachbarstufen, nie als neue Stufe.
- **Lime** (`lime`) ist das Signal des Logos und nur Fläche mit dunkler Schrift (`ink-950`) darauf. `lime-deep` ist der gedrückte Zustand, `lime-soft` die helle Lime-Fläche (Etikett, Icon im Kasten, Glanz der Lichtkante), `lime-glow` das Leuchten um eine Lime-Fläche. Auf Nacht ist Lime zusätzlich Fokusring (`focus-ring-on-dark`) und darf dort Schrift sein.
- **Lime ist auf hellem Grund nie Schriftfarbe.** Eine Hervorhebung auf Papier ist dunkle Schrift mit Lime daneben oder darunter: Etikett „voll“, Lime-Punkt, Unterstrich.
- **Rot** (`danger`) gibt es nur für Fehler und Löschen, als Fläche. Fehlertext auf Papier setzt `danger-ink`.
- Fokusringe: auf Papier `focus-ring` (`ink-950`), auf Nacht `focus-ring-on-dark` (`lime`); innerhalb einer Fläche immer über `wp-fokus`.

## Schrift

Drei Familien mit festen Rollen:

- **Big Shoulders Display** (`display`), Gewicht 800, Versalien: Überschriften `h1` bis `h3`.
- **Hanken Grotesk** (`body`): Fließtext, Einleitung, Knöpfe, Textlink.
- **Barlow Semi Condensed** (`werkplan`): 600 für Beschriftung, Quelle und Schriftfeld; 300 für Messwerte.

Es gibt keine Mono-Schrift. Zahlen setzt `messwert` mit proportionalen Versalziffern, nie tabellarisch.

Schriftgrößen kommen nur aus den Graden `grad-12`, `grad-14`, `grad-16`, `grad-18`, `grad-24`, `grad-32`, `grad-48`, `grad-64` und der Messwert-Stufe `grad-80`. Fließende Überschriften behalten ihre `vw`-Mitte, ihre Endpunkte liegen auf Graden: `clamp(var(--grad-32), 3.4vw, var(--grad-48))`.

| Rolle | Satz |
|---|---|
| `h1` | Seitentitel, `grad-48`, am Handy `grad-32`, auf einer Startseite bis `grad-64` |
| `h2` | Abschnittstitel, `grad-32`, ab 1024 px `grad-48` |
| `h3` | Zwischenüberschrift, `grad-24` |
| `lead` | Einleitung unter dem Titel, `grad-18`, höchstens 34 em breit |
| `text` | Fließtext, `grad-16`, höchstens 62 Zeichen breit |
| `beschriftung` | Beschriftung, Positionsnummer, Blattzeile: `grad-12`, ab 768 px `grad-14`, Versalien, gesperrt |
| `messwert` | große Zahl, Richtwert `grad-80`, Gewicht 300 |
| `quelle` | Quellenzeile unter einer Zahl, `grad-12`, Versalien |
| `textlink` | Zweitaktion, `grad-16`, Gewicht 600 |
| `schriftfeld-label`, `schriftfeld-wert` | Label und Wert eines Felds im Schriftfeld |

## Form

**Rundung** folgt einer Rolle, nie einem freien Wert:

- `rund-eckig` für Kästen, Karten, Schriftfeld, Listen und Bilder.
- `rund-fein` für Etikett, Eingabefeld, Fokusrahmen und Textlink.
- `rund-kreis` für Punkte, Avatare und Pillen ohne feste Höhe.
- Knöpfe und Chips mit fester Höhe runden mit `calc(<Höhe>px * var(--rund-pille-faktor))`. Der Faktor 0,433 ist die Pille im Logo.

Rundungen stehen nie in Prozent: Prozent macht aus einem breiten Chip eine Ellipse.

**Linie.** Haarlinien sind 1 px (`wp-linie`, `wp-linie-fein`), Sucher-Ecken 10 px lang bei 1,5 px Strich. Inhaltsblöcke tragen keinen Schatten; sie trennen sich über Haarlinie und Tonwechsel der Fläche. Schatten haben nur die Lichtkante und schwebende Teile wie Toast und Handy-Menü.

**Abstand** im 4-px-Raster: `abstand-4` bis `abstand-128`.

## Bewegung

Übergänge dauern 180 ms mit `ease-out`, das Licht der Lichtkante läuft in 3,2 s um. `prefers-reduced-motion` schaltet beides ab und zeigt sofort den Endzustand.

## Hervorhebung

In Oberflächen hebt der Lime-Unterstrich (`Unterstrich`) ein Wort hervor. Die schräge Marker-Pille (`MarkerHighlight`) ist dem Logo und dem Hero der Website vorbehalten. Dort steht sie einmal, hinter einem kurzen Wort; ist das Wort lang, wird ein kürzeres markiert. Die Pille ist vermessen und wird nicht geschätzt: `markerGeometry()` rechnet sie aus der Versalhöhe des Worts, die Buchstaben stehen immer frei.

## Bausteine

- **Hauptaktion:** `LichtkanteButton`, ein dunkler Körper mit umlaufendem Lime-Licht an der Kante und dem Pfeil in einer Lime-Kapsel. Mit `href` ein Link, sonst ein Knopf; `extern` öffnet eine fremde Seite in neuem Tab.
- **Weitere Aktionen:** `RuhigerKnopf` für Nebenaktionen; `FesterKnopf` nur als Bestätigung in Dialogen; `IconKnopf` quadratisch und nur mit Icon, das Label steht als `aria-label` und `title`; `Textlink` für die Zweitaktion mit 1 px Unterstrich, der bei Hover und Fokus zu 3 px Lime wird.
- **Status und Meldung:** `Etikett` in sechs Arten (`linie`, `gestrichelt`, `voll`, `lead`, `warn`, `still`); `Hinweisband` für Warnungen, mit Rahmen und Fläche in Warnfarbe, nie als Seitenbalken; `Toast` für eine kurze Rückmeldung; `Tastenkappe` für eine Taste im Text.
- **Fakten:** `Plankopf` ist das Schriftfeld einer Seite (Werte in normaler Schreibung), `Schriftfeld` die Fassung der Arbeitsfläche (Werte in Versalien); `Messwert` mit `Besch` und Quelle als Kennzahl; `Massbalken`, `Masskette` und `Fortschritt` für Anteile und Stände; `BlattZeile` für die Zeile über einem Blatt.
- **Rahmen und Ordnung:** `Kasten` mit `SucherEcken`, `Info`, `Schritte`, `Liste` mit `Gruppe` und `Listenzeile`, `Filterleiste`, `DetailRahmen`.
- **Kundenseite:** `Reiter` (Navigation mit Handy-Menü), `KapitelLeiste`, `ZiffernFelder` für Codes, `KopierenKnopf`, `Eingabefeld`.

Bausteine bekommen Texte und Daten als Props. Sie holen nichts aus einer App und hängen nicht an Next.js.

## Icons

Strich-Icons, überwiegend aus Lucide: Strich 2 px im 24er-Raster (`ICON_STRICH`, `ICON_VIEWBOX`), eine Pfadtabelle `WERKPLAN_ICONS` für Web und PDF. Icons zeichnen mit `currentColor` und nehmen die Farbe ihrer Rolle an. Sie stehen dort, wo sie etwas bedeuten, nicht vor jeder Überschrift und nicht vor jedem Listenpunkt.

## Logo

Das Logo wird nie nachgezeichnet. `logo-powerhandwerk.svg` steht auf Papier, `logo-powerhandwerk-dark.svg` ist die freigestellte Fassung für Nacht. Die Bildmarke `pin.svg` steht überall, wo powerhandwerk selbst auf einer Karte oder in einer Grafik auftaucht, statt einer Kartennadel. Die Pille hinter „handwerk“ ist die Form, aus der Marker, Lichtkante und `rund-pille-faktor` abgeleitet sind.

## Bild und Iso-Grafik

Fotos sind erlaubt. KI-Bilder erscheinen nur gekennzeichnet. Erklärgrafiken sind isometrische Zeichnungen in zwei Familien:

- **Nacht-Szene:** leuchtende Haarlinien auf dunkler Grundplatte für Abläufe. Lime heißt „eingeschaltet“, mehrere Teile dürfen leuchten.
- **Papier-Figur:** dunkler Strich auf Papier mit gestrichelter Bodenellipse und Sucher-Ecken für Leistungskarten und Aufzählungen. Genau ein Element ist Lime.

Beide nutzen echte Isometrie mit 30°, Haarlinien gleicher Stärke in jeder Größe und Farben nur aus Ink und Lime. Musterinhalte tragen „Muster, keine echten Daten.“ Reduzierte Bewegung zeigt sofort den Endzustand, jede Grafik hat eine Beschreibung für Vorleser. Die Iso-Bausteine kommen mit der ersten Website-Seite, die sie nutzt, in dieses System.

## Nicht verwenden

- Eine Mono-Schrift für Zahlen. Zahlen setzt `messwert`.
- Lime als Schriftfarbe auf hellem Grund, auch nicht als dunkleres Grün.
- Die Lime-Pille als Hauptknopf. Die Hauptaktion ist die Lichtkante.
- Karten mit großem Radius und Schatten. Kästen sind eckig.
- Neue Ink-Stufen, Farbverläufe hinter Titeln, Rundungen in Prozent.

## Im Code

Portal und Website importieren das Paket `@powerhandwerk/ds-werkplan` mit fester Version (Git-Tag). `tokens.css` wird einmal global geladen, die Bausteine einzeln (`@powerhandwerk/ds-werkplan/LichtkanteButton`), Flächen und Typo-Rollen über `werkplan.module.css`. PDFs bekommen Hex-Werte, Flächenrollen, Maße und Icon-Pfade aus `@powerhandwerk/ds-werkplan/werte`. Werte ändern sich nur im Paket: `src/tokens.ts` ist die einzige Quelle.
