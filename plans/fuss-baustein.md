# Plan: fuss-baustein

> **Status:** Done Teil A (03.11.2026; Freigabe Flo: „Freigabe, du baust hier“, Lane 2); Teil B offen (eigener Lauf, v2.7.0)
> **Projekt:** ds-werkplan (Worktree `wt-ds-fuss`, Branch `feature/fuss-baustein` von `origin/main` bee62d7 = v2.5.0)
> **Ausführung Teil A:** Branch `feature/fuss-baustein-fokus` ab `origin/feature/fuss-baustein` (Session im neuen Account; `wt-ds-fuss` bleibt unberührt)
> **Erstellt:** 02.11.2026
> **Scope:** complex
> **Sprache:** TypeScript
> **Größe:** L (Teil A „fokus“: M · Teil B „voll“ und „tippgeber“: L)
> **Prüfrunde lokal:** 1/2
> **Prüfrunde PR:** 2/2 (Fix des Blockers aus /pr-review: Texte als Prop `texte` mit Standard; dazu leerer Leistungsschein und Schrägstrich am Ende von `basis`)

Stand: 02.11.2026

## Tasks

- [x] Code (Teil A, Steps A1 bis A6; tsc und vitest Exit 0, 517 Tests)
- [x] Gates (/simplify mit fünf Vereinfachungen; /code-review merge, 0 CRITICAL, 2 WARNING; /preflight Ready to ship). Fix-Runde nach /pr-review: /simplify mit vier Vereinfachungen (Texte flach), /code-review merge ohne WARNING, /preflight Ready to ship, 548 Tests
- [ ] Ship (PR, /pr-review, verify-browser, /merge-gate)

## Ziel

Der Fuß aller powerhandwerk-Flächen wird ein Baustein `Fuss` mit einem Datenmodul im Paket, damit Website, Admin und
Vermittlerseite dieselbe geprüfte Fußzeile aus einer Quelle zeigen. Zuerst kommt die Fassung „fokus“, die die
Radar-Session vor dem 09.11.2026 auf /gruendung einbaut; danach „voll“ und „tippgeber“.

## Herkunft

- Auftrag der Session „PHW Design System Artifact Access“ vom 02.11.2026. Freigabe Flo in der Hauptsession: „Ja, Fuß
  jetzt bauen“; vorher in „Radar Zielseiten Teil 3“: „Ja, beauftragen“.
- Entwurf mit Spezifikationsblatt (Schichten 01 bis 07, P1 bis P13, Entscheidungen F1 bis F9):
  https://claude.ai/artifact/RzGxoiUX6meutnf2DpbSSh
- Footer-Research: Vault `3 Wissen/Research/_footer-recherche-2026-11/reports/Zentraler Footer für powerhandwerk.md`
  (Weg (a), Pflichten P1 bis P13, Sollpunkte S1 bis S22, fünf Prüfebenen, E3 Markenzeile); Entscheidungsvorlage
  https://claude.ai/artifact/V9eiS4H8wDzwfzCvMPyQ6y
- Kopf: Navigation-Research und Vorlage https://claude.ai/artifact/MPFAMAc1EGPhb1BxyVWNM4 (KS2 eine Liste für Kopf und
  Fuß, N3 „Kontakt“, N4 „Empfehlen“ nur im Fuß, KP14).
- Bestand Website (nur gelesen, origin/main 0547759): `components/sections/SiteFooter.tsx` (`FOOTER_LINKS`),
  `components/preisseite/WerkplanFuss.tsx`, `lib/site.ts` (`COMPANY`, `WHATSAPP_URL`, `SOCIAL_LINKS`,
  `GOOGLE_THIRD_PARTY_URL`), Pin `github:powerhandwerk/ds-werkplan#v2.5.0`.

## Verbraucher

- Teil A: Radar-Session (`local_8615a46f-5d65-4bc1-9293-2b4f4333fcf4`) baut „fokus“ auf /gruendung ein; Paket-Import nur
  unter `components/gruendung` (das Zero-Footprint-Gate nimmt alle Seiten unter /gruendung aus, `zero-footprint.ts:158`).
  Ob sie dafür ein neues Layout unter `app/gruendung` anlegt oder den `<footer>` in `GruendungSeite.tsx` setzt,
  entscheidet sie; der Einbau auf der Website folgt ihren Regeln (Lane nach `/merge-gate` der Website).
- Teil B: später Website (Layouts je Seitengruppe nach Neuzuschnitt des Gates), Admin (tippgeber), Vermittlerseite
  (HTML-Stück), ein künftiger Baustein `Kopf` (liest `ZIELE` über eigene `KOPF_REIHENFOLGE`).

## Fertig heißt

Teil A · fokus (Tag v2.6.0)

1. Nach dem Commit, wie `check.yml`: `bun install --frozen-lockfile`, `bun x tsc --noEmit` und `bun x vitest run` mit
   Exit 0; `bun run erzeuge` mit leerem `git diff --exit-code -- src/tokens.css src/schriften.css
   artifact/project/tokens.json`; `bun run bundle && bun run artifact` mit leerem `git status --porcelain --
   artifact/project/`.
2. Der Vertragstest `test/fuss-vertrag.test.ts` prüft „fokus“ für jede Kombination aus `basis` (relativ, absolut) und
   Leistungsschein (ohne, mit): Pflichtmenge Impressum und Datenschutz, Teilfolge von `FUSS_REIHENFOLGE` ohne Doppel,
   Text und Name gleich `ZIELE`, Ziel gleich `basis + ZIELE[s].href` bei „/“ vorn, sonst gleich `ZIELE[s].href`,
   Leistungsschein gleich dem Parameter.
3. `test/fuss.test.tsx` belegt für „fokus“ in Du und Sie, mit und ohne B2B-Zeile: kein `<footer>`, kein `<script>`,
   kein `target`, kein `<button>`, genau eine Markenzeile, alle Ziele als `<a href>`, Logo ohne Link, Feld Stand nur mit
   `stand`, kein `"use client"` in `Fuss.tsx`, `ziele.ts`, `fuss-links.ts`; das CSS hat `container-type: inline-size`
   und `@container`, kein ink-500 oder ink-600, keine `transition` oder `animation`.
4. Galerie `artifact/project/components/Fuss/` (README.md, preview.html) zeigt „fokus“ in 390 und 1280 px auf Nacht,
   im Browser angesehen.
5. PR auf `main` per `/merge-gate` gemergt; Tag `v2.6.0` steht auf dem Merge-Commit (`git rev-list -n1 v2.6.0` gleich
   `gh pr view <N> --json mergeCommit`) und ist gepusht; Lesefassung (Adresse in `artifact/ziel.json`)
   neu veröffentlicht.
6. `fuss-uebergabe.md` nach Skill `einbau-uebergabe` liegt im Notizordner (Tag, Importpfad, Props samt „fokus“,
   Prüfwerte); die Radar-Session hat genau eine Nachricht mit dem vollen Pfad; Flo hat eine Rückmeldung in einfacher
   Sprache.

Teil B · voll und tippgeber (Tag v2.7.0)

7. „voll“ (Abschluss oder Kontextband Innung, Kontakt-Schriftfeld, Linkgruppen 01 bis 04, Rechtszeile, B2B-Zeile,
   Markenzeile mit Logo-Link, WhatsApp-Knopf) und „tippgeber“ (Kontextband, Kontakt, Startseite, Teilnahmebedingungen,
   ohne B2B-Zeile) gerendert, im Vertrags-, Render- und Typtest und in der Galerie.
8. `bun run fuss-html` erzeugt das HTML-Stück „tippgeber“ für die Vermittlerseite; CI prüft, dass es aktuell ist.
9. Gemergt, Tag `v2.7.0`, Lesefassung veröffentlicht, Übergabe um „voll“ und „tippgeber“ ergänzt, Rückmeldung an Flo.

## Halt nur, wenn

- Plan-Freigabe durch Flo (jetzt, vor dem Bau), mit Bestätigung, dass der Paket-Merge Lane 2 ist.
- `/merge-gate` meldet einen Lane-3-Treffer oder ein rotes Gate. Vorab bekannt: B7 ändert `check.yml` (Prüfregel),
  dieser PR geht an Flo.
- Vor Step B5: Flos Entscheidung zu KS14, falls sie bis dahin nicht gefallen ist.
- Die Radar-Session meldet beim Einbau einen Widerspruch zur Übergabe.

## Goal Condition

```
/goal Teil A fertig: nach dem Commit bun install --frozen-lockfile, bun x tsc --noEmit exit 0 UND bun x vitest run exit 0 UND bun run erzeuge && git diff --exit-code -- src/tokens.css src/schriften.css artifact/project/tokens.json exit 0 UND bun run bundle && bun run artifact && git status --porcelain -- artifact/project/ leer UND artifact/project/components/Fuss/preview.html existiert UND gh pr view N zeigt state MERGED und baseRefName main UND git rev-list -n1 v2.6.0 gleich mergeCommit von PR N UND git ls-remote --tags origin v2.6.0 liefert eine Zeile UND fuss-uebergabe.md im Notizordner enthält „v2.6.0“ und „@powerhandwerk/ds-werkplan/Fuss“, oder stop nach 40 turns
```

## Steps

### Teil A · fokus

1. [x] **A1 Datenmodul `src/ziele.ts`** (M)
   - `FIRMA` als eine Quelle, Typ mit `string`-Feldern: Herausgeber „KETESO GmbH“, Ansprechpartner „Andreas Keller“,
     Telefon `{ anzeige: "+49 152 295 409 46", href: "tel:+4915229540946" }`, E-Mail „kontakt@powerhandwerk.de“,
     WhatsApp `https://wa.me/4915229540946`, Markenzeile „powerhandwerk ist eine Marke der KETESO GmbH“ (E3, D12).
     Schreibweisen von Telefon, E-Mail und WhatsApp wie `lib/site.ts`. Erreichbarkeit, LinkedIn und Startseite kommen
     in Teil B.
   - `ZIELE: Readonly<Record<ZielSchluessel, Ziel>>`, `Ziel = { text; href?; name?; art }`, `art` aus `seite`, `extern`,
     `telefon`, `mail`. Teil A nur die Ziele von „fokus“: `telefon`, `email`, `whatsapp` (sichtbar „WhatsApp“, Name
     „WhatsApp Chat starten“), `impressum`, `datenschutz`, `agb`, `leistungsschein` (ohne `href`, kommt als Parameter).
     `ZielSchluessel` und `FussVariante` bleiben erweiterbar.
   - `PFLICHT = ["impressum", "datenschutz"] as const`; `FUSS_REIHENFOLGE` mit den Schlüsseln von Teil A in
     Quelltext-Reihenfolge (Teil B fügt Schlüssel an ihrer Stelle ein, nie Umsortieren); `FUSS_TEXTE` (Überschrift
     „Kontakt“, Kontaktsatz Du „Ruf an oder schreib uns.“ und Sie „Rufen Sie an oder schreiben Sie uns.“, B2B-Zeile
     „Nur für Unternehmer · Alle Preise netto zzgl. USt.“, nav-Name „Rechtliches“, Plankopf-Labels Herausgeber, Blatt,
     Stand, Ansprechpartner); `FUSS_VERSION`.
   - Kein React, kein `"use client"`; benannte Exporte mit deutschem JSDoc.
2. [x] **A2 Reine Funktion `src/fuss-links.ts`** (M)
   - `fussLinks({ variante, basis = "", leistungsschein }): FussEintrag[]`, `FussEintrag` mit `schluessel`, `text`,
     `href`, `name?`, `art`, `schicht`.
   - „fokus“: Schicht 02 `telefon`, `email`, `whatsapp`; Schicht 04 `impressum`, `datenschutz`, dazu `agb` und
     `leistungsschein` nur mit `leistungsschein` (Bestellen). „Datenschutz-Einstellungen“ kommt erst mit einem
     Einwilligungs-Werkzeug (dann `<button type="button" data-fuss-einwilligung>`, Skript beim Verbraucher); Schalter
     kommen in Teil B.
   - `basis`: Ziele mit „/“ vorn werden `basis + href` (P1, Subdomains absolut); volle URLs, `tel:`, `mailto:` bleiben.
3. [x] **A3 Baustein `src/Fuss.tsx` und `src/fuss.module.css`** (M)
   - Props Teil A: `variante: "fokus"`, `b2b: boolean` (Pflicht, ohne Standard), `blatt: string`, `stand?: string`,
     `anrede?: "du" | "sie"` (Standard „du“), `basis?`, `leistungsschein?`, `className?`. Server-Komponente ohne
     `"use client"`, ohne Hooks, ohne feste IDs.
   - Aufbau „fokus“: Wurzel `<div>` mit Fläche `nacht` aus `werkplan.module.css`, `data-fuss="fokus"`,
     `data-fuss-version`; Schicht 02 `<section>` mit `<h2>Kontakt</h2>`, Satz je Anrede, Liste Telefon, E-Mail,
     WhatsApp; feine Linie; Schicht 04 `<nav aria-label="Rechtliches">` mit Liste; Schicht 05 B2B-Zeile nur bei `b2b`;
     Schicht 06 `Logo variant="dark"` ohne `href`, Markenzeile, `Plankopf untergrund="nacht"` mit Herausgeber, Blatt,
     Ansprechpartner und Stand nur, wenn `stand` gesetzt ist (der Plankopf lässt `undefined` als leeres Feld stehen).
     Kein `<footer>`, keine Schicht 01, keine Gruppen, kein Knopf.
   - CSS: `container-type: inline-size` an der Wurzel, Umbruch per `@container` (schmal gestapelt, breit links Recht,
     B2B und Marke, rechts Plankopf bis 440 px); Schrift `var(--grad-*)`, Farben nur Rollen `--wp-*` der Fläche, Ziele
     `min-height: 44px`, Fokus `outline: 2px solid var(--wp-fokus)`, keine `transition` und keine `animation`.
4. [x] **A4 Paket-Einträge** (S)
   - `package.json`: exports `./Fuss`, `./fuss.module.css`, `./ziele`, `./fuss-links`; `version` 2.6.0.
   - `src/index.ts` reicht die neuen Module weiter; `README.md` Pin v2.6.0, Bausteinliste, kurzer Abschnitt „Fuß
     einbauen“ (`<footer><Fuss … /></footer>`, Container-Breite statt Fensterbreite); `artifact/project/README.md`
     Bausteinliste (von Hand).
5. [x] **A5 Tests** (M)
   - `test/fuss-vertrag.test.ts` (`@vitest-environment node`): „Fertig heißt“ 2; dazu `FIRMA` fest (Telefon, E-Mail,
     WhatsApp gegen die Schreibweise der Website, Markenzeile gegen E3); `FUSS_VERSION` gleich `package.json`; in allen
     Texten kein „—“ und kein „ – “ (Regel wie `test/artifact.test.ts:84`).
   - `test/fuss.test.tsx` (`renderToStaticMarkup`): „Fertig heißt“ 3, dazu sichtbarer Text im Namen des
     WhatsApp-Links (2.5.3) und `data-fuss-version`.
   - `test/bundle.test.ts` PROPS-Eintrag für `Fuss` (Pflicht-Props, React 18); `test/artifact.test.ts` Anzahl 43 auf
     44.
6. [x] **A6 Galerie** (M)
   - `scripts/artifact-daten.ts` Eintrag `Fuss`: Gruppe „Rahmen“, Fläche „nacht“, Skript zeigt „fokus“ in Sie ohne
     B2B-Zeile in einem 390 px breiten Rahmen und in Du mit B2B-Zeile in 1280 px; Zusammenfassung, Wann, Props,
     Lassen ohne Gedankenstriche.
   - `bun run erzeuge && bun run bundle && bun run artifact` (bun 1.4.4), Vorschau im Browser ansehen.
7. [ ] **A7 Prüfen und ausliefern** (M)
   - `/simplify`, `/code-review`, `/preflight`; `/commit-push-pr --base main`; `/pr-review`; `/merge-gate` (Lane 2,
     von Flo bei der Plan-Freigabe bestätigt).
   - Nach dem Merge: `git fetch origin`, Merge-Commit per `gh pr view <N> --json mergeCommit`, `git tag v2.6.0 <sha>`,
     `git push origin v2.6.0`, nie verschieben; Lesefassung aus `artifact/project/` neu veröffentlichen.
8. [ ] **A8 Übergabe** (S)
   - Skill `einbau-uebergabe`: `fuss-uebergabe.md` im Notizordner mit Freigabe-Wortlaut, Pin
     `github:powerhandwerk/ds-werkplan#v2.6.0`, Import `@powerhandwerk/ds-werkplan/Fuss`, Props für /gruendung
     (`variante="fokus" anrede="sie" b2b={false} blatt=… stand=…`), Einbau `<footer><Fuss … /></footer>` entweder in
     einem neuen Layout unter `app/gruendung` (gilt dann für alle /gruendung-Seiten) oder in `GruendungSeite.tsx`,
     Import nur unter `components/gruendung`, Werten, Prüfzahlen, Offenem (B2B nach Anwalt, Gate für alle anderen Seiten).
   - Genau eine `SendMessage` an die Radar-Session; Rückmeldung an Flo.

### Teil B · voll und tippgeber

9. [ ] **B0 Daten erweitern** (M): `ZIELE`, `FUSS_REIHENFOLGE` und `fussLinks` um „voll“ und „tippgeber“ nach
   Spezifikationsblatt Pos. 01 (F9-Texte, Kontextband-Anker, Gruppen, Recht, `whatsapp-knopf`), `FIRMA` um
   Erreichbarkeit „Mo–Sa 9–20 Uhr“ (Flo, F1, 02.11.2026), LinkedIn, Startseite; Google-Hinweis mit Ziel gleich
   `GOOGLE_THIRD_PARTY_URL` der Website samt Test; Schalter `innung`, `karriere`, `barrierefreiheit`,
   `teilnahmebedingungen` (Standard `false`); Linktext des Google-Hinweises gegen Googles Seitentitel prüfen (A7 des
   Entwurfs).
10. [ ] **B1 Schicht 02 voll und tippgeber** (M): Kontakt-Schriftfeld „voll“ als `dl` mit den Plankopf-Klassen, jede
    Zelle ganz klickbar (Telefon, E-Mail, WhatsApp „Chat starten“, Erreichbarkeit, Formular „Kontakt“); „tippgeber“
    Telefon, E-Mail, Erreichbarkeit; Satz je Anrede.
11. [ ] **B2 Schicht 03** (M): „voll“ vier Gruppen mit `h2` und Positionsnummer (`aria-hidden`), Partner mit
    Innungskasten (Schalter `innung`, Verbandslogo nur als Prop nach schriftlicher Freigabe), Karriere per Schalter;
    „tippgeber“ „Zur Startseite“.
12. [ ] **B3 Schicht 01** (L): Abschluss „voll“ als Props (`kicker`, `titel`, `text`, `aufruf`, `bild` als Slot im
    Rahmen A: SucherEcken, 224 × 280 px, am Handy 128 × 160 px; die KI-Kennzeichnung bringt der Verbraucher im Slot
    mit); Kontextband Innung (`kontextband: "innung"`, Logo-Slot) und Band „Vermittlerprogramm“ in „tippgeber“.
13. [ ] **B4 Schichten 04 bis 06** (S): Rechtszeile je Fassung, `aktuell` für `aria-current` (Vergleich gegen das Ziel
    ohne `basis`), B2B-Zeile in „voll“ als Pflicht-Prop `b2b` ohne Standard, in „tippgeber“ per Typ ausgeschlossen
    (`b2b?: never`, Typtest), Logo-Link zur Startseite (in „tippgeber“ absolut).
14. [ ] **B5 Schicht 07 WhatsApp-Knopf** (M): nur „voll“, `<a>` an fester Stelle am Ende, 56 px, Lime auf ink-950,
    88 px Polster am Fußende; Verhalten nach Flos Entscheidung zu KS14.
15. [ ] **B6 Tests, Galerie, README** (M): Render-, Vertrags- und Typtest für alle drei Fassungen samt Schaltern,
    Galerie mit drei Fassungen, Props-Tabelle.
16. [ ] **B7 HTML-Stück** (M): `scripts/fuss-html.ts` (`bun run fuss-html`) rendert „tippgeber“ mit
    `renderToStaticMarkup` samt CSS nach `html/fuss-tippgeber.html`; CI-Schritt prüft Aktualität (Änderung an
    `check.yml` ist eine Prüfregel, Lane 3); Export `./html/*`.
17. [ ] **B8 Prüfen und ausliefern** (M): Prüfkette, PR, Review, Merge, Tag v2.7.0, Lesefassung, Übergabe ergänzen,
    Rückmeldung an Flo.
18. [ ] **Verify** je Teil: die Schritte aus „Fertig heißt“ 1.

## Betroffene Dateien

| Datei | Aktion | Was ändert sich |
|---|---|---|
| `src/ziele.ts` | neu | `FIRMA`, `ZIELE`, `PFLICHT`, `FUSS_REIHENFOLGE`, `FUSS_TEXTE`, `FUSS_VERSION` |
| `src/fuss-links.ts` | neu | `fussLinks`, `FussVariante`, `FussEintrag` (B: `FussSchalter`) |
| `src/Fuss.tsx` | neu | Server-Komponente, Teil A „fokus“, Teil B „voll“ und „tippgeber“ |
| `src/fuss.module.css` | neu | Layout mit Container Queries auf Nacht |
| `src/index.ts` | erweitern | Reexporte |
| `package.json` | erweitern | exports, Version 2.6.0 (B: 2.7.0, Skript `fuss-html`) |
| `test/fuss-vertrag.test.ts` | neu | Vertragstest |
| `test/fuss.test.tsx` | neu | Rendertest, Quell- und CSS-Regeln |
| `test/bundle.test.ts` | erweitern | PROPS für `Fuss` |
| `test/artifact.test.ts` | erweitern | Anzahl Bausteine 44 |
| `scripts/artifact-daten.ts` | erweitern | Galerie-Eintrag `Fuss` |
| `artifact/project/components/Fuss/*`, `bundle.*`, `index.d.ts` | erzeugt | aus `bun run bundle` und `bun run artifact` |
| `README.md`, `artifact/project/README.md` | erweitern | Pin, Bausteinliste, Einbau-Hinweis |
| `scripts/fuss-html.ts`, `html/fuss-tippgeber.html`, `.github/workflows/check.yml` | neu, erweitern (B) | HTML-Stück und CI-Prüfung |

## Design Decisions

| Entscheidung | Begründung | Alternativen |
|---|---|---|
| D1 Zwei Teile mit eigenem PR und Tag: A „fokus“ (v2.6.0), B „voll“ und „tippgeber“ (v2.7.0) | /gruendung braucht nur „fokus“ vor dem 09.11.; ein kleiner PR ist schneller geprüft und eingebaut; v2.6.0 schreibt keine ungeklärten Texte von „voll“ fest | ein PR mit allen drei Fassungen |
| D2 `ZIELE` als Verzeichnis (Schlüssel auf Text, Ziel, Name), Reihenfolge je Baustein als eigene Liste `FUSS_REIHENFOLGE`; der Kopf bekommt später `KOPF_REIHENFOLGE` über dieselben Schlüssel | „Kontakt“ steht im Fuß vorn (Kontaktblock zuerst, S11), im Kopf zuletzt (KS7); eine einzige Reihenfolge für beide ginge nicht auf. Geteilt wird, was 3.2.4 verlangt: gleicher Schlüssel, gleicher Text, gleiches Ziel; 3.2.3 gilt je Baustein | eine Liste mit einer Reihenfolge für Kopf und Fuß (KS2 wörtlich, KP14) |
| D3 `fussLinks({ variante, basis, leistungsschein })` als reine Funktion in eigenem Modul | Vertragstest ohne Rendern; das `fassung` aus dem Muster des Berichts ist die Preismodell-Fassung der Website (`legacyPdfTarget`), Website-Code darf nicht ins Paket, deshalb kommt nur die fertige Adresse des Leistungsscheins | Funktion im Baustein; Fassungs-Typ der Website übernehmen |
| D4 `Fuss` liefert Inhalt in einem `div` mit Fläche `nacht` und Container; das `<footer>` stellt der Verbraucher | Auftrag Punkt 3; genau ein contentinfo je Seite (P9) bleibt beim Layout | `<footer>` im Baustein |
| D5 `b2b` ist in „fokus“ und „voll“ Pflicht-Prop ohne Standard, „tippgeber“ kennt sie nicht (`b2b?: never`) | /gruendung schaltet die Zeile bis zum Anwalt ab, und kein Einbau schaltet sie still ein; P5 wird zum Typfehler | `b2b` mit Standard `true` |
| D6 Firmendaten als Standardwerte im Paket, ohne Override-Prop in Teil A | Repo-Regel „Daten als Props mit Standardwert“, hier als feste Quelle: Telefon, E-Mail, Markenzeile sind öffentliche Angaben aus dem Impressum; ein Override nur der Anzeige ließe `tel:` und Anzeige auseinanderlaufen | `firma?: Partial<Firma>` |
| D7 Keine Bewegung, Fokus über `--wp-fokus`, Ziele 44 px, externe Links ohne `target` | Auftrag Punkt 4, P12, P13, S18, E10 | Lime-Unterstrich mit Übergang wie im Entwurf |
| D8 `data-fuss` und `data-fuss-version` an der Wurzel, `FUSS_VERSION` per Test gleich `package.json` | Crawler-Ebene des Research: gleiche Version auf allen Hosts | Version zur Laufzeit aus `package.json` lesen |
| D9 Absolute Ziele über `basis` | P1: Subdomains verlinken absolut auf das zentrale Impressum | Host im Baustein erraten |
| D10 Bild im Abschluss nur als Slot, kein Bild im Paket | Repo öffentlich; Andreas' KI-Porträt ist von ihm nicht freigegeben; die KI-Kennzeichnung (AiZeichen) hängt am Bild beim Verbraucher | Foto-URL als Prop mit Zeichen im Baustein |
| D11 Kein `useId`, keine festen IDs; Abschnitte ohne `aria-labelledby` | Server-Komponente ohne Hooks, mehrfach einsetzbar in der Galerie | `useId` |
| D12 Markenzeile „powerhandwerk ist eine Marke der KETESO GmbH“, nicht die Website-Fassung „powerhandwerk, eine Marke der KETESO GmbH“ | E3 der Entscheidungsvorlage und Auftrag; die Website übernimmt den Wortlaut mit dem Baustein (S21: ein Wortlaut überall) | Website-Fassung übernehmen |
| D13 „Datenschutz-Einstellungen“ und Schalter erst in Teil B bzw. mit Einwilligungs-Werkzeug | Ein Knopf ohne Skript wäre tot; heute gibt es keine Einwilligung (P3) | Knopf schon in Teil A |

## Offene Fragen

- [ ] Q1 KS14: Soll der WhatsApp-Knopf in „voll“ verschwinden, sobald der Kontaktblock im Bild ist? Braucht Skript
  beim Verbraucher oder CSS mit Scroll-Zeitleiste; ohne Entscheidung bleibt er mit 88 px Polster sichtbar (Entwurf F6).
  Betrifft erst Step B5.

## Regression Checklist

- [ ] **Bündel und Lesefassung** — Betroffen weil: neuer Name im Bündel-Kopf, Anzahl in `test/artifact.test.ts`,
  Dateigrenze und Gedankenstrich-Regel der Vorschauen.
- [ ] **Exporte** — Betroffen weil: `test/exports.test.ts` prüft beide Richtungen für vier neue Module.
- [ ] **CSS-Regeln, Olivgrün, Kontrast** — Betroffen weil: neue CSS-Datei ohne Bestand; `css-regeln` liest
  `@container` nicht, deshalb eigener Test.
- [ ] **Plankopf und Logo** — Betroffen weil: `Fuss` nutzt beide unverändert; keine Änderung an ihren Props.
- [ ] **Verbraucher-Pins** — Betroffen weil: Website v2.5.0 und Admin v2.2.0 bleiben unberührt, bis sie selbst anheben.
- [ ] **Prozess-Handbuch + Systemkarte** — keiner (Repo ohne `lib/prozesse/`).

## Risiken

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|---|---|---|---|
| Zero-Footprint-Gate der Website wird rot, wenn das Paket außerhalb /gruendung geladen wird | MED | HIGH | Übergabe schreibt Import nur unter `components/gruendung` vor; Teil B wartet auf Neuzuschnitt (Website, Prüfregel) |
| Scratchpad-Worktree verschwindet (ein fremder Scratchpad-Worktree ist schon „prunable“) | MED | MED | Branch nach dem Plan-Commit pushen, danach jeder Commit gepusht |
| Bündel bricht wegen Bun-Version | LOW | MED | bun 1.4.4 lokal belegt, gleich `packageManager` |
| `css-regeln` prüft `@container` nicht, ein ink-500 rutscht durch | MED | MED | eigener CSS-Test in `test/fuss.test.tsx` |
| React 18 und 19 rendern unterschiedlich | LOW | LOW | keine Hooks, nur statisches Markup; Bündel-Test rendert mit React 18 |
| Frist 09.11.2026 für /gruendung | MED | HIGH | Teil A klein, Übergabe sofort nach Tag v2.6.0 |

## Änderungen nach /plan-review (02.11.2026, GO-mit-Edits)

| Befund | Einarbeitung |
|---|---|
| C1 Knopf „Datenschutz-Einstellungen“ widersprüchlich und ohne Skript tot | aus Teil A gestrichen (A2, D13), Fertig 3 prüft „kein `<button>`“ |
| C2 Vertragsregel „Ziel gleich `ZIELE`“ mit `basis` und Leistungsschein nicht erfüllbar | Regel präzisiert (Fertig 2, A5): `basis + href` bei „/“ vorn, Leistungsschein gleich Parameter, `ZIELE.leistungsschein` ohne `href` |
| W1 Erreichbarkeit „Mo–Sa 9–20 Uhr“ unbelegt, Gedankenstrich-Regel | aus Teil A gestrichen; in B0 mit Quelle Flo F1 vom 02.11.2026 (Spezifikationsblatt), Testregel wie `artifact.test.ts:84` („—“ und „ – “) |
| W2 Markenzeile weicht von der Website ab | nicht übernommen, weil E3 und der Auftrag „ist eine Marke“ festlegen; als D12 begründet, Test gegen E3 |
| W3 `firma` wirkt nur auf die Anzeige | Prop gestrichen (A3, D6) |
| W4 Daten und Vertrag für alle Fassungen schon in Teil A | Teil A nur „fokus“ (A1, A2); Daten für „voll“ und „tippgeber“ als B0 |
| W5 B2B-Zeile in „voll“ standardmäßig an | Pflicht-Prop ohne Standard auch in „voll“ (B4, D5) |
| W6 „wie CI check“ ungenau | Fertig 1 und Goal mit den Schritten aus `check.yml`, nach dem Commit |
| W7 Goal deckt Fertig 4 bis 6 nicht | Goal um Galerie-Datei, Tag gleich Merge-Commit und Übergabe-Inhalt ergänzt; Veröffentlichung der Lesefassung bleibt Beleg im Transkript |
| W8 Layout unter `app/gruendung` gibt es nicht | Verbraucher und A8: neues Layout oder `GruendungSeite.tsx`, Wahl bei der Radar-Session, Lane dort |
| I1 Lane 2 bestätigen, `check.yml` ist Prüfregel | in „Halt nur, wenn“ und B7 |
| I2 B2B-Prüfung für „tippgeber“ gehört in Render- und Typtest | B4 und B6 |
| I3 Plankopf lässt `undefined` stehen | A3: Feld Stand nur mit `stand`; Fertig 3 |
| I4 `aktuell` trifft mit `basis` nie | `aktuell` erst in B4, Vergleich ohne `basis` |
| I5 Begriff „Fläche“ für `basis` | Fertig 2 sagt `basis` |
| I6 Google-Hinweis ohne Ziel | B0: Ziel gleich `GOOGLE_THIRD_PARTY_URL` mit Test |
| I7 Plan untracked, Branch nicht auf origin, Merge-Commit vor dem Tag holen | Plan jetzt committen und pushen; A7 mit `git fetch` und `gh pr view --json mergeCommit`; Q1 (zwei Tags) als D1 entschieden |
