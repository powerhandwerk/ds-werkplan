# Plan: messlatte-zeichen

> **Status:** Done mit offenen Punkten (Sichtfreigabe Flo und Ship offen; Ship erst nach Markenrecherche, F2)
> **Projekt:** ds-werkplan (Worktree `wt-ds-messlatte` im Scratchpad dieser Session, Branch `feature/messlatte-zeichen` von `origin/main` dff2cd8 = Tag v2.6.0 plus PR #10, ohne Upstream)
> **Erstellt:** 03.11.2026
> **Scope:** complex (neue Fassung „flach“ im Produktzeichen, neuer Baustein, Lesefassung, 15+ Dateien)
> **Sprache:** TypeScript (dazu ein Python-Skript für den Wortpfad)
> **Größe:** L
> **Prüfrunde lokal:** 1/2
> **Ausführung:** `/build` hier bis 5d, danach Halt (kein automatischer Ship, siehe „Halt nur, wenn“)

## Tasks

- [x] Code (Steps 1 bis 8; tsc Exit 0, vitest 601 Tests grün, Prüfsummen gleich)
- [x] Gates (/simplify mit sieben Vereinfachungen; /code-review merge, 0 CRITICAL, 1 WARNING; /preflight Layer 1 PASS, Layer 2 bis 4 nicht anwendbar)
- [ ] Ship (PR, /pr-review, verify-browser, /merge-gate): wartet auf F2

## Ziel

Das am 03.11.2026 gewählte Zeichen des Standards „Messlatte“ (Wasserwaage mit Teilung, die Luftblase ist die Lime-Pille
aus dem Logo) kommt ins Paket: als Produktzeichen `messlatte` und als Baustein `MesslatteSchriftzug`, damit spätere
Flächen (Angebot, Strategieblatt, Abnahmebericht, Kundenseite, Website-Abschnitt) es aus einer Quelle importieren statt
die Dateien des Markenblatts zu kopieren.

## Herkunft

- Auftrag der Session „kundensite-strategie“ vom 03.11.2026; Wahl Flo am 03.11.2026: „Empfehlung: A + B + C“.
- Quellen (gelesen): Markenblatt https://claude.ai/artifact/WUUJ1g7AyEu1MF6ZP41Jkp (lokal `markenblatt.py`, aus dem es
  erzeugt ist), Entwurfsseite https://claude.ai/artifact/6Loe993iGqPoZVQpw3BYpg, Werkstatt
  `powerhandwerk-admin/docs/analysen/messlatte-zeichen/` mit `messlatte.py` (`imlot`, `flach("a", …)`,
  `lockup("a", …)`) und den 14 SVG in `dateien/`, Iso-Motor `docs/analysen/2026-11-01-produktzeichen/modell.py`.
  Die Werkstatt ist im Admin per `.gitignore` ausgenommen.
- Regeln aus dem Markenblatt, die der Bau 1:1 übernimmt:
  - Pos. 02: ab 40 px das Iso-Modell, darunter flach; flach ab 28 px mit Teilung, darunter Waage, Endkappen und Pille.
  - Pos. 03: Pille auf halber Versalhöhe X von MESSLATTE, Zeichen 1,25 X hoch; Schutzzone ½ X rundum; Mindestgrößen:
    Modell ab 40 px, flach ab 16 px, Schriftzug ohne Logo ab X = 14 px (darunter nur das Zeichen), mit Logo ab
    X = 32 px (darunter ohne Logo, Logo getrennt setzen). Ohne Logo dort, wo powerhandwerk schon steht; mit Logo auf
    LinkedIn, in Präsentationen und überall, wo der Absender fehlt.
  - Pos. 05: Stand neben dem Zeichen, nie darin: `Masskette` mit sechs Positionen, Beschriftung „5 von 6“, für
    Screenreader „5 von 6 Punkten der Messlatte erfüllt“. Das Zeichen zeigt immer den vollen Standard.
  - Pos. 06: kein Ring, keine Plakette, kein Band; Pille bleibt Lime und in der Mitte, keine zweite Lime-Fläche; nicht
    drehen, verzerren, nachzeichnen; keine Prüf-Wörter daneben (geprüft, zertifiziert, Garantie); nicht auf den
    Websites der Betriebe; kein Stand im Zeichen.
- Illustration B (Vermessung) ist nicht Teil des Auftrags und kommt nicht ins Paket.
- Kein Verbraucher wartet: Das Admin pinnt v2.2.0, die Website nutzt die Messlatte nicht; öffentlich wird der Standard
  erst nach Skill-Einbau und erstem Kunden.

## Fertig heißt

1. `<Produktzeichen name="messlatte" />` rendert auf Papier und Nacht. Ab 40 px das Iso-Modell aus `imlot` (mit
   Boden), unter 40 px die flache Fassung im 24er-Raster in drei Stufen (bis 20 px, 21 bis 27 px, ab 28 px mit
   Teilung). In jeder Fassung genau ein Lime-Teil, die Pille, in `g.motiv`. „Flach ab 16 px“ steht nur in der Doku,
   wie „ab 32 px“ bei den übrigen Zeichen. Tests grün.
2. Die 14 vorhandenen Produktzeichen rendern byte-gleich wie vorher: Prüfsumme von
   `renderToStaticMarkup(<Produktzeichen …>)` für 14 Namen × Papier/Nacht × 16, 32, 40, 44, 64, 96, 172 px vor und
   nach dem Bau gleich.
3. `<MesslatteSchriftzug />` rendert auf Papier und Nacht, mit und ohne Logo. Tests belegen: Pillenmitte auf halber
   Versalhöhe und Zeichenhöhe 1,25 X (je auf 0,5 % von X), Schutzzone ½ X (nach F3), Mindestgrößen nach Pos. 03
   (unter X = 32 ohne Logo, unter X = 14 nur das Zeichen), das Logo ist der Inhalt aus `assets/` ohne IDs und färbt nur
   über `fill`-Attribute, kein `<text>` im Bild, MESSLATTE als Pfad.
4. Lesefassung: Karte `Produktzeichen` mit 15 Zeichen und der flachen Fassung, neue Karte `MesslatteSchriftzug` mit
   Stand-Beispiel (`Masskette` 5 von 6 mit Label); Bündel, Typen und Karten neu erzeugt; Brand-Book
   (`artifact/project/README.md`), Root-README und `docs/bausteine.md` nachgezogen.
5. `bun x tsc --noEmit`, `bun x vitest run`, `bun run erzeuge && git diff --exit-code -- src/tokens.css
   src/schriften.css artifact/project/tokens.json` und `bun run bundle && bun run artifact && git status
   --porcelain -- artifact/project/` (leer nach dem Commit) mit Exit 0; Prüfsummen-Vergleich aus 2 gleich.
6. Sichtprüfung in der lokalen Vorschau (`ds-messlatte-vorschau`, Port 4391) im Browser-Pane: Zeichen 160, 64, 40 und
   flach 32, 24, 16 px, Schriftzug beide Untergründe mit und ohne Logo, Lichtrand auf Nacht ohne eckige Kante;
   Screenshot an Flo und Halt, bis Flo es gesehen hat.
7. Prüfkette `/simplify` → `/code-review --path <Worktree>` → `/preflight` gelaufen.
8. Erst nach Flos Ja zu F2: `/commit-push-pr` mit `gh pr create --base main`, `/pr-review`, `/merge-gate N --dry-run`
   als Entscheidungsvorlage. `lane3.txt` nimmt ds-werkplan aus; ohne `--dry-run` würde das Gate selbst mergen. Flo
   mergt.

## Halt nur, wenn

- Plan-Freigabe (dieser Halt) mit den Fragen F1 bis F3 unten.
- Ein Befund verlangt, vom Markenblatt abzuweichen (über F1 bis F3 hinaus).
- Nach Step 9 (Sichtprüfung): Screenshot an Flo, warten auf sein Urteil. `/build` geht danach nicht in 5e.
- Vor jedem Push: Das Repo `powerhandwerk/ds-werkplan` ist öffentlich (`gh repo view`: PUBLIC). Ohne Flos Ja zu F2
  wird nichts gepusht.
- Merge: Lane 3 (Außenwirkung), Flo entscheidet; `/merge-gate` nur mit `--dry-run`.

## Goal Condition

```
/goal bun x tsc --noEmit exit 0 UND bun x vitest run exit 0 UND bun run erzeuge && git diff --exit-code -- src/tokens.css src/schriften.css artifact/project/tokens.json exit 0 UND bun run bundle && bun run artifact && git status --porcelain -- artifact/project/ leer nach dem Commit UND Prüfsummen der 14 Zeichen gleich messlatte-vorher.json UND test/messlatte.test.tsx existiert UND PRODUKTZEICHEN_NAMEN endet mit "messlatte" UND artifact/project/components/MesslatteSchriftzug/README.md existiert, oder stop nach 30 turns
```

## Steps

1. [x] **Step 1: Prüfsummen der 14 Zeichen sichern** (S)
   - Vor jeder Änderung: `renderToStaticMarkup(<Produktzeichen name untergrund groesse />)` für 14 Namen ×
     Papier/Nacht × 16, 32, 40, 44, 64, 96, 172 px, SHA-256 je Fall in die Scratchpad-Datei `messlatte-vorher.json`.
     Nach dem Bau dieselbe Rechnung; Vergleich muss gleich sein (Fertig heißt 2).

2. [x] **Step 2: Iso-Figur, Rahmen und flache Fassung** (M)
   - `src/produktzeichen-formen.ts`: reine Funktion `zeichenRahmen(szene)` mit dem engen Rahmen der Figur
     (`x0`, `y0`, `x1`, `y1` aus `Mess`); `zeichenAusschnitt` rechnet damit, Ausgabe unverändert (Prüfsummen).
   - Datei neu: `src/produktzeichen-messlatte.ts`.
   - `zeichneMesslatte(w, { boden })`: Port von `imlot` mit den Bausteinen aus `produktzeichen-formen`, Klassen statt
     Farben: Körper `zeichenTafel(w, 0, 0, 0, 34, 6.4, 2.4).koerper()`; Endkappen `f.rect(…, "s wf")`; Teilung 13
     Striche (lang `k wf` mit `strichMal(1.4)`, Halbstriche `th`); Libelle `f.rrect(…, "f")` (Glas = Vorderseite in
     beiden Paletten); zwei Marken `k wf` mit `strichMal(1.3)`; Pille `zeichenMotiv(f.rrect(…, "a"))`; Boden
     `zeichenBoden(w, 17, -1.2, 20)` nur mit `boden: true`.
   - Rundung der Pille in Iso und flach nach F1.
   - Zwei Szenen: `ZEICHEN_MESSLATTE` (mit Boden, fürs Verzeichnis) und `ZEICHEN_MESSLATTE_OHNE_BODEN` (für den
     Schriftzug, nicht im Verzeichnis). `messlatteLibelleMitte()`: Mitte der Libelle über `werkzeug(null).P` in
     Bildkoordinaten.
   - `messlatteFlach(groesse)`: Port von `flach("a", …)` im 24er-Raster mit den drei Stufen (Strich 1,25 bis 20 px,
     sonst 1,1; Teilung, Körper-, Libellen- und Pillenmaß ab 28 px); Klassen statt Farben; die Pille in
     `<g class="motiv">` ohne Glühen (wie im Markenblatt).
   - Konstante `MESSLATTE_FLACH_UNTER = 40`.

3. [x] **Step 3: Verzeichnis, Baustein und CSS der Produktzeichen** (M)
   - `src/produktzeichen-verzeichnis.ts`: Eintrag `messlatte: { titel: "Messlatte", szene: ZEICHEN_MESSLATTE, flach:
     messlatteFlach }` am Ende. `produktzeichenDaten(name, groesse = 64)`: hat der Eintrag `flach` (Eingrenzung per
     `"flach" in eintrag`, weil `as const satisfies` den Typ nicht erweitert) und ist `groesse < 40`, liefert es die
     flache Fassung (`viewBox="0 0 24 24"`); ohne `flach` bleibt es unter 40 px bei der Iso-Fassung wie bisher.
     Cache-Schlüssel je Name und Fassung (`iso`, `flach-s` bis 20 px, `flach-m` bis 27 px, `flach-l` ab 28 px).
   - `src/Produktzeichen.tsx`: `groesse` an `produktzeichenDaten` geben, Klasse `flach` nur an der flachen Fassung;
     für die 14 übrigen Zeichen bleibt das Markup gleich.
   - `src/produktzeichen.module.css`: Variable `--z-flach-strich` je Untergrund (Papier `--ink-950`, Nacht `--ink-050`)
     und vier Klassen für die flache Fassung (Grund mit Strich, Strichfläche, Strichlinie, Lime-Pille mit Strich), nur
     Tokens, kein Hex.
   - Lichtrand: bleibt `filter: drop-shadow(…)` auf `.gl`. Probe 03.11.2026 im Pane (Scratchpad `glowtest/`): der
     CSS-Filter wächst mit der Unschärfe und hat keine Kante, der SVG-Filter mit Standardbereich zeigt die eckige
     Kante, vor der der Auftrag warnt. Sichtprüfung in Step 9 bei 160 px auf Nacht und im Schriftzug.

4. [x] **Step 4: Wortpfad und Logo-Inhalte** (M)
   - Skript neu: `scripts/messlatte-wort.py` (fontTools, Pfad zur TTF als Argument), Port von `Schrift.pfad` aus
     `messlatte.py`: „MESSLATTE“ bei Schriftgröße 100, Grundlinie y = 0, mit GPOS-Unterschneidung, Zahlen auf zwei
     Stellen; gibt die TS-Konstante aus. Quelle `powerhandwerk-fonts/ttf/big-shoulders-display-800.ttf`, dieselbe wie
     für die Markenblatt-Dateien. Die variable woff2 des Pakets bei wght 800 hat andere Umrisse (Probe 03.11.2026:
     gleiche Laufweiten, andere Punkte), deshalb die TTF.
   - Datei neu: `src/messlatte-schriftzug.ts` (rein, ohne React) mit `MESSLATTE_WORT` (Pfad, Breite, Versalhöhe 0,8
     aus `OS/2.sCapHeight` 1600 bei 2000 Einheiten) und `LOGO_INHALT` (Inhalt von `assets/logo-powerhandwerk.svg` und
     `assets/logo-powerhandwerk-dark.svg` je mit viewBox, ohne `id`/`data-name`, sonst Zeichen für Zeichen gleich).
   - `schriftzugGeometrie({ versalhoehe, mitLogo })`: Port der Rechnung aus `lockup("a", …)` mit `zeichenRahmen` der
     Szene ohne Boden: Zeichen links, Höhe 1,25 X, Pillenmitte auf Grundlinie minus X/2, Wort im Abstand 0,28 F, Logo
     0,34 F hoch, 0,16 F über der Versal-Oberkante. Rand nach F3. Mindestgrößen (Pos. 03): unter X = 32 fällt das Logo
     weg; unter X = 14 nur das Zeichen (Konstanten `SCHRIFTZUG_MIN_X = 14`, `SCHRIFTZUG_MIN_X_LOGO = 32`).

5. [x] **Step 5: Baustein `MesslatteSchriftzug`** (M)
   - Dateien neu: `src/MesslatteSchriftzug.tsx`, `src/messlatte-schriftzug.module.css`.
   - Props: `untergrund` (`"papier"`, Standard), `mitLogo` (Standard `false`), `versalhoehe` (px, Standard 40),
     `titel` (Standard „Messlatte“, mit Logo „powerhandwerk Messlatte“), `className`.
   - Ein `<svg role="img" aria-label>`: Zeichen als Gruppe mit den Klassen der Produktzeichen in optischer Größe
     „gross“ (wie `lockup` mit 96 px), ohne Boden; MESSLATTE als `<path>` mit Klasse für die Schriftfarbe (Papier
     `--ink-950`, Nacht `--ink-050`); Logo als verschachteltes `<svg>` mit dem Inhalt aus `LOGO_INHALT`. Rendert auf
     dem Server, ohne Zustand. `data-mit-logo` zeigt, ob das Logo wirklich steht.
   - Unter X = 14: `<Produktzeichen name="messlatte">` mit `titel`, so breit wie das Zeichen im Schriftzug bei
     diesem X (`groesse` = Zeichenbreite × 24/22, die Waage füllt 22 von 24 Einheiten), mindestens 16 px.

6. [x] **Step 6: Paket-Anschluss** (S)
   - `package.json`: vier `exports` (`./produktzeichen-messlatte`, `./messlatte-schriftzug`, `./MesslatteSchriftzug`,
     `./messlatte-schriftzug.module.css`), Version auf die nächste freie Minor (heute 2.7.0; vor dem PR gegen
     `git tag` und offene PRs prüfen). Im selben Schritt `src/ziele.ts` `FUSS_VERSION` (der Test
     `fuss-vertrag.test.ts:87` vergleicht mit der Paketversion) und `README.md:12` (`#v…`) nachziehen.
   - `src/index.ts`: Exporte ergänzen.
   - Reihenfolge mit Fuß Teil B (`plans/fuss-baustein.md`, plant auch 2.7.0 und berührt dieselben Dateien): Wer als
     Zweiter mergt, nimmt die nächste Minor und erzeugt die Lesefassung neu.

7. [x] **Step 7: Tests** (M)
   - `test/produktzeichen.test.tsx`: Verzeichnis mit 15 Namen; Grenzen 39/40 px (flach/Iso), 20/21 px (Strich) und
     27/28 px (Teilung), dabei die Reihenfolge der Aufrufe wechseln (Cache); flache Fassung je Untergrund mit genau
     einem Lime-Element in `g.motiv`; Lime-Klassen der flachen Fassung in `LIME_KLASSEN`; ein Zeichen ohne `flach`
     bleibt unter 40 px Iso.
   - Neu `test/messlatte.test.tsx`: Verbindungsregel (Pillenmitte, Zeichenhöhe), Rand, Mindestgrößen (31/32, 13/14),
     `LOGO_INHALT` gleich der Datei in `assets/` ohne IDs, jedes Logo-Element mit `fill="#…"`, kein `<style>` und kein
     `class` im Logo, keine doppelten IDs bei zwei Schriftzügen, kein `<text>` im Schriftzug, kein Lime außerhalb von
     Pille und Logo, Barrierefreiheit, keine Prüf-Wörter (geprüft, zertifiziert, Garantie, Siegel) in Titeln,
     Standard-Texten und im Beispiel der neuen Karte.
   - Prüfsummen-Vergleich aus Step 1 als einmaliges Skript im Scratchpad (nicht im Repo).
   - `test/artifact.test.ts` (45 Bausteine), `test/bundle.test.ts` (Beispiel-Props `MesslatteSchriftzug`).

8. [x] **Step 8: Doku und Lesefassung** (M)
   - `scripts/artifact-daten.ts`: Karte `Produktzeichen`: „Die 14 Namen“ wird 15, „Ab 32 px“ und „Ein Zeichen kleiner
     als 32 px“ bekommen die Ausnahme `messlatte` (unter 40 px flach, ab 16 px), Beispiel um die flachen Größen. Neue
     Karte `MesslatteSchriftzug` (Gruppe Grafik, Papier und Nacht) mit Schriftzug ohne und mit Logo, Zeichen in den
     Größen und Stand-Beispiel `Masskette` 5 von 6 mit Label „5 von 6 Punkten der Messlatte erfüllt“.
   - `bun run bundle`, `bun run artifact` (erzeugt `components/*`, `bundle.*`, `index.d.ts`).
   - `artifact/project/README.md` (Brand-Book): Produktzeichen-Liste um `messlatte`, Absatz „Messlatte“ mit den Regeln
     aus Pos. 02, 03, 05 und 06.
   - `README.md` (Root): 15 Zeichen, Schriftzug, Version; `docs/bausteine.md`: zwei Zeilen im Register.

9. [x] **Step 9: Verify und Sichtprüfung, dann Halt** (M)
   - Alle Prüfungen aus Fertig heißt 5, Prüfsummen aus Step 1 vergleichen.
   - Vorschau `ds-messlatte-vorschau` (Port 4391) im Pane: Karten `Produktzeichen` und `MesslatteSchriftzug` bei 1280
     und 390 px, Lichtrand auf Nacht gezoomt, Vergleich gegen die SVG-Dateien des Markenblatts. Screenshot an Flo,
     Halt bis Flos Urteil.

10. [ ] **Step 10: Prüfkette und Ship** (M)
    - `/simplify` → `/code-review --path <Worktree>` → `/preflight` (läuft in `/build` vor 5d).
    - Erst nach Flos Ja zu F2: `/commit-push-pr` mit `gh pr create --base main`, `/pr-review`,
      `/merge-gate N --dry-run` als Entscheidungsvorlage. Nach dem Merge durch Flo: Tag der Version.
    - Folgepunkte melden, nicht hier erledigen: ADR-Nachtrag im Admin-Repo (Nummer per `bun run adr:naechste`), weil
      ADR-272 flache Piktogramme verworfen hat („ab 32 px“) und ADR-261 Nr. 4 die Pille auf Logo und Website-Hero
      begrenzt; die Messlatte weicht in beidem ab, gedeckt durch Flos Wahl vom 03.11.2026. Diese Session darf im Admin
      nichts ändern. Dazu: Design-System-Artifact aus dem Besitzer-Konto nachziehen; Markenblatt-Dateien neu erzeugen,
      falls F1 die Rundung ändert; `lane3.txt` kennt ds-werkplan nicht als Außenwirkung (Prüfregel, Flos Sache).

## Betroffene Dateien

| Datei | Aktion | Was ändert sich |
|-------|--------|-----------------|
| `src/produktzeichen-formen.ts` | erweitern | `zeichenRahmen`, `zeichenAusschnitt` rechnet damit |
| `src/produktzeichen-messlatte.ts` | neu | Iso-Figur (zwei Szenen), flache Fassung, Mitte der Libelle |
| `src/produktzeichen-verzeichnis.ts` | erweitern | Eintrag `messlatte`, flache Fassung, `groesse` in `produktzeichenDaten` |
| `src/Produktzeichen.tsx` | erweitern | flache Fassung unter 40 px |
| `src/produktzeichen.module.css` | erweitern | Farben und Klassen der flachen Fassung |
| `src/messlatte-schriftzug.ts` | neu | Wortpfad, Logo-Inhalte, Geometrie, Mindestgrößen |
| `src/MesslatteSchriftzug.tsx` | neu | Baustein Schriftzug |
| `src/messlatte-schriftzug.module.css` | neu | Schriftfarbe je Untergrund |
| `scripts/messlatte-wort.py` | neu | Erzeugung des Wortpfads |
| `src/index.ts`, `package.json` | erweitern | Exporte, Version |
| `src/ziele.ts`, `README.md` | erweitern | `FUSS_VERSION`, Versions-Pin im Beispiel, Doku |
| `test/produktzeichen.test.tsx` | erweitern | 15 Zeichen, flache Fassung |
| `test/messlatte.test.tsx` | neu | Schriftzug |
| `test/artifact.test.ts`, `test/bundle.test.ts` | erweitern | 45 Bausteine, Beispiel-Props |
| `scripts/artifact-daten.ts` | erweitern | zwei Karten |
| `artifact/project/**` | erzeugt | Bündel, Typen, Karten |
| `artifact/project/README.md`, `docs/bausteine.md` | erweitern | Doku |

## Design Decisions

| Entscheidung | Begründung | Alternativen |
|-------------|------------|-------------|
| Zeichen als Szene der Engine mit Klassen, nicht die SVG-Dateien einbetten | So sind alle Produktzeichen gebaut; Farben und Strichstärken kommen aus `produktzeichen.module.css`, optische Größe gilt mit | Dateien aus `dateien/` als Strings: Hex-Farben im Code, keine optische Größe |
| Flache Fassung als optionales Feld im Verzeichnis, nur für `messlatte` | Pos. 02 verlangt sie; die 14 anderen haben keine (Folgearbeit „flache Glyphen“) und bleiben byte-gleich | Flache Fassung für alle: nicht beauftragt |
| Lichtrand bleibt der CSS-Filter des Pakets | Probe im Pane: keine Kante, weil der CSS-Filter seinen Bereich mit der Unschärfe vergrößert; der Auftrag verlangt genau das | SVG-Filter mit Bereich −250 %/600 %: bräuchte eine ID je Zeichen |
| Wortpfad einmalig aus der TTF, Skript im Paket | Das Paket hat nur die woff2, deren Umrisse bei 800 abweichen; dieselbe Quelle wie die Markenblatt-Dateien; das Skript macht es wiederholbar | Pfad zur Laufzeit aus der Schrift: neue Abhängigkeit |
| Logo als Inhalt der Asset-Dateien ohne IDs, per Test an die Datei gebunden | „Logo nie als Text nachbauen“; wie `PIN_PFADE` aus `pin.svg`; ohne IDs keine Dopplung | `Logo`-Baustein als `<img>` neben dem SVG: zwei Elemente, Lage nicht exakt |
| Optische Größe „gross“ im Schriftzug | So rechnet `lockup` (Zeichen mit 96 px); die Dateien des Markenblatts zeigen genau das | Strich nach Anzeigegröße: weicht von den Dateien ab |
| Mindestgrößen im Schriftzug durchgesetzt, im Produktzeichen nur Doku | Pos. 03 nennt für den Schriftzug je einen Weg für „darunter“; beim Produktzeichen hält es das Paket wie bei den 14 anderen | Nur Doku: wird beim Einbau vergessen |
| Stand nur in der Doku, kein neuer Baustein | Auftrag; `Masskette` mit einer Gruppe aus sechs Positionen deckt es ab | Baustein „MesslatteStand“: nicht beauftragt |

## Offene Fragen

Antworten Flo, 03.11.2026: Ausführung „/build hier“; F1 → „Logo-Maß 0,433“; F2 → „Erst nach Recherche“ (kein Push
und kein PR in diesem Lauf, bis die Markenrecherche durch ist oder Flo ausdrücklich Ja sagt); F3 → „Fest eingebaut“.

- [x] **F1 Rundung der Pille:** Das Markenblatt nennt die Luftblase „die Lime-Pille aus dem Logo“; die Dateien runden
  in Iso und flach aber voll (0,5 der Höhe). Das Logo rundet mit 0,433 (`PILLE_FAKTOR` im Paket; „Das Logo ist die
  Wahrheit“ steht in `keteso/CLAUDE.md`). Bei 64 px unter 0,5 px Unterschied. Empfehlung: 0,433 aus `PILLE_FAKTOR` in
  beiden Fassungen; dann weichen die 14 Werkstatt-Dateien minimal ab (Folgepunkt: neu erzeugen).
- [x] **F2 Öffentliches Repo:** `powerhandwerk/ds-werkplan` ist öffentlich. Ein Push zeigt Name und Zeichen vor der
  Markenrecherche (Markenblatt Pos. 07: Recherche, „bevor der Name öffentlich steht“) und vor Skill-Einbau und erstem
  Kunden. Empfehlung: jetzt bauen, lokal prüfen und im Pane zeigen; Push und PR erst nach der Markenrecherche oder
  deinem ausdrücklichen Ja.
- [x] **F3 Rand des Schriftzugs:** `lockup` hat 2 bis 4 Einheiten Rand, die ½ X des Markenblatts kommen dort aus dem
  Abstand der Seite. Eingebaut heißt: der Baustein ersetzt den kleinen Rand durch ½ X rundum, bündiges Ausrichten heißt
  dann um ½ X versetzen. Sonst: enger Rand, Schutzzone nur als Regel. Empfehlung: eingebaut, weil der Baustein die
  Regel dann selbst hält.

## Regression Checklist

- [ ] **14 Produktzeichen** — Betroffen weil: `produktzeichenDaten` bekommt `groesse`, `zeichenAusschnitt` rechnet über `zeichenRahmen`; Prüfsummen vorher und nachher gleich.
- [ ] **Modellkarte, Paketkarten** — Betroffen weil: sie rendern `Produktzeichen`; Tests `modellkarte`, `paketkarten` grün.
- [ ] **Fuß** — Betroffen weil: `FUSS_VERSION` folgt der Paketversion; `fuss-vertrag`, `fuss` grün.
- [ ] **Lesefassung** — Betroffen weil: Karten, Bündel und Typen neu erzeugt; `artifact.test`, `bundle.test`, `lesefassung-paket.test` grün.
- [ ] **Zäune** — `olivgruen`, `css-regeln` (kein Hex im Modul-CSS), `grafik-zaun` (kein €), `logo-farben` (6 Dateien, unverändert), `exports` grün.
- [ ] **Prozess-Handbuch + Systemkarte:** keiner (Repo hat kein `lib/prozesse/`).

## Risiken

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Name und Zeichen stehen vor der Markenrecherche öffentlich | HIGH bei Push | MED | F2, kein Push ohne Flos Ja |
| Gate mergt selbst, weil `lane3.txt` ds-werkplan ausnimmt | HIGH ohne Vorkehr | HIGH | `/merge-gate --dry-run`, `/build` hält vor 5e |
| Lichtrand im skalierten Schriftzug zu stark oder zu schwach | MED | LOW | Sichtprüfung Step 9 gegen die Markenblatt-Datei |
| Wortpfad weicht von den Markenblatt-Dateien ab | LOW | MED | Erzeugung mit demselben Verfahren und derselben TTF, Sichtvergleich |
| Versionskonflikt 2.7.0 mit Fuß Teil B | MED | LOW | Version erst vor dem PR gegen Tags und offene PRs festlegen |
| Doppelte IDs durch das Logo | LOW | LOW | IDs entfernt, Test |

## Änderungen nach /plan-review (03.11.2026, GO-mit-Edits)

| Befund | Einarbeitung |
|---|---|
| C1 Halt vor Push und Merge hält technisch nicht (`/build` 5e, `lane3.txt` nimmt ds-werkplan aus) | Kopf „Ausführung“, Fertig 8, Halt-Liste, Step 9 und 10: `/build` nur bis 5d, `/merge-gate --dry-run`; `lane3.txt` als Folgepunkt für Flo |
| C2 Versionssprung bricht `fuss-vertrag.test.ts` und lässt den README-Pin stehen | Step 6 und Dateitabelle: `FUSS_VERSION`, `README.md:12` |
| C3 Mindestgröße wich vom Markenblatt ab (Anheben statt „nur das Zeichen“) | Step 4 und 5, Fertig 3: unter X = 14 nur das Zeichen |
| W1 Typfehler bei `flach` unter `as const satisfies` | Step 3: Eingrenzung per `"flach" in eintrag`, Verhalten ohne `flach` festgelegt |
| W2 Cache-Schlüssel zu grob | Step 3: Schlüssel je Stufe; Step 7: Grenzen 20/21 und 27/28 mit wechselnder Reihenfolge |
| W3 enger Rahmen der Figur fehlt | Step 2: `zeichenRahmen`, Szene ohne Boden, Mitte über `w.P` |
| W4 Prüfsumme prüfte fast nichts | Step 1 und Fertig 2: `renderToStaticMarkup` über 14 × 2 × 7 Fälle |
| W5 Goal meldet zu früh fertig | Goal und Fertig 5 um `erzeuge`, Lesefassung und Prüfsummen ergänzt |
| W6 Konflikt mit ADR-272 und ADR-261 Nr. 4 ohne Nachtrag | Step 10: ADR-Nachtrag als Folgepunkt, weil diese Session im Admin nichts ändern darf |
| W7 „Flo hat es gesehen“ ohne Halt | Halt nach Step 9 |
| W8 F2 unvollständig, Kollision mit Fuß Teil B | F2 um Skill-Einbau und ersten Kunden ergänzt; Step 6: Regel für die Reihenfolge |
| I1 Kopfzeile Basis, Upstream | Kopf korrigiert; `git branch --unset-upstream` erledigt |
| I2 „flach ab 16 px“ nicht durchgesetzt | Fertig 1 und Design Decision: nur Doku |
| I3 weitere Textstellen und Wörter-Test | Step 7 und 8 |
| I4 F1 und F3 präzisiert | F1 nennt beide Fassungen und die Fundstelle, F3 die richtige Herkunft der ½ X |
| I5 Erzeugung des Wortpfads sichern | Step 4: `scripts/messlatte-wort.py` im Paket; Probe: woff2 bei 800 weicht ab |
| I6 Größe L, kein Verbraucher wartet | Größe L; F2 bietet den späteren Push |
