# ds-werkplan — Repo-Regeln

DS Werkplan 2.0, das Design-System von powerhandwerk. Das Portal
(`powerhandwerk-admin`) und die Website (`keteso/powerhandwerk-website`) importieren
dieses Paket mit fester Version (Git-Tag). Entscheidung: ADR-261 im Admin-Repo, Pläne
`powerhandwerk-admin/plans/ds-werkplan-paket.md` und `ds-werkplan-fundament.md`.

## Werte

- **`src/tokens.ts` ist die einzige Quelle aller Werte.** `src/tokens.css` und
  `artifact/project/tokens.json` sind daraus erzeugt (`bun run erzeuge`) und werden nie
  von Hand geändert; der Workflow `check` prüft, dass sie aktuell sind.
- CSS liest Werte über Tokens: Schriftgrößen `var(--grad-*)`, Rundungen `var(--rund-*)`
  oder `calc(<Höhe>px * var(--rund-pille-faktor))`, Farben `var(--ink-*)`,
  `var(--lime*)`, `var(--danger*)` und die Flächenrollen `--wp-*`.
- Die Flächenrollen `--wp-*` stehen nur in den Flächenklassen von
  `src/werkplan.module.css` (`.papier`, `.aufPapier`, `.nacht`, `.nachtHell`,
  `.aufNacht`), nie auf `:root`: sonst stünde dunkle Schrift auf dunklem Grund außerhalb
  einer Fläche.
- **Olivgrün ist gestrichen** (ADR-261 Nr. 6). Lime gibt es nur als Fläche mit dunkler
  Schrift darauf (Etikett, Punkt, Unterstrich). `test/olivgruen.test.ts` sperrt den
  Hex-Wert, den alten Token-Namen und `--lime-text` der Website in `src/`, `fonts/`,
  `assets/`, `artifact/project/` und `test/`.
- Die Ink-Rampe hat zehn Stufen. Zwischentöne entstehen mit `color-mix()` aus zwei
  Stufen, nicht mit neuen Stufen (Herleitung in `docs/inventur.md`).
- Neue Farbwerte kommen als Token nach `src/tokens.ts`, nie als Hex- oder Farbfunktion ins
  Modul-CSS. Was die gehobenen Bausteine heute noch fest tragen, ist in
  `test/css-regeln.test.ts` je Datei eingefroren und darf nur schrumpfen.
- Werte, die Client-Komponenten (`"use client"`) als Standard nutzen, stehen in einem
  Modul ohne `"use client"` (`src/standards.ts`), damit Server-Komponenten sie lesen können.

## Sprache und Text

- Code ist deutsch wie im Admin: Bezeichner, Kommentare und Commit-Betreffs; der
  Präfix bleibt englisch (`feat`, `fix`, `chore`). Englisch bleibt für Framework- und
  API-Namen (`useEffect`, `className`).
- Nutzersichtbarer Text trägt echte Umlaute und keine Gedankenstriche. Texte und Daten
  kommen als Props mit Standardwert, nie aus einer App.

## Paket

- Jede Datei in `src/` steht ausdrücklich in `package.json` unter `exports`, das Ziel
  mit Dateiendung; `test/exports.test.ts` prüft beide Richtungen.
- Importe im Paket sind relativ, nie `@/`. Keine Abhängigkeit auf Next.js oder auf Code
  aus Admin oder Website.
- Das Repo ist öffentlich: keine Kundendaten, keine Zugangsdaten, keine Preise.
- Versionen sind Git-Tags (`v2.0.0`), die Verbraucher pinnen sie. Ein Tag wird nie
  verschoben; ein Fix bekommt einen neuen Tag.

## Prüfen

`bun x tsc --noEmit`, `bun x vitest run` und
`bun run erzeuge && git diff --exit-code -- src/tokens.css artifact/project/tokens.json`.
