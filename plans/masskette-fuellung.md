# Plan: Füllfarbe der Maßkette als Stellschraube

Stand: 31.10.2026

## Ziel

Die Füllfarbe von Maßkette und Maßbalken lässt sich über die Stellschraube
`--mass-fuellung` an einem umgebenden Element setzen. Ohne gesetzte Stellschraube
bleibt sie Lime. Paketversion 2.2.0.

## Fertig heißt

- Tag `v2.2.0` steht auf `main`.
- Ohne gesetzte Stellschraube füllen Maßkette und Maßbalken unverändert in Lime.

## Steps

1. `src/werkplan.module.css`, `.massbalkenFuellung`: `fill: var(--mass-fuellung, var(--lime))`
   mit Kommentar im Stil der Sucher-Ecken (`--ecken-farbe`).
2. Doku der Stellschraube in `scripts/artifact-daten.ts` (Abschnitt `wann` von Maßbalken
   und Maßkette, wie bei den Sucher-Ecken); die Lesefassungs-READMEs entstehen daraus.
3. Version 2.2.0 in `package.json` und in der Installationszeile der `README.md`.
4. Lesefassung neu erzeugen: `bun run erzeuge && bun run bundle && bun run artifact`.

## Herkunft

Step 2 aus powerhandwerk-admin `plans/partnerportal-neu.md`, /plan-review dort am
31.10.2026 (GO-mit-Edits).

## Verbraucher

Partnerportal: Stufenkette mit `ink-400`, `ink-600`, `ink-950` und Lime je Stand.
