// @vitest-environment node
// Zaun für Beträge außerhalb von src/ (Plan ds-werkplan-paketkarten, Fertig 6):
// Das Repo ist öffentlich, Preise kommen nur als Props vom Verbraucher. In der
// Datentabelle der Lesefassung, unter artifact/project/ und im README stehen
// Beträge darum nur als Platzhalter aus Nullen („00 €“, „000 €“, „0.000 €“).
// src/ hält der Zaun der Grafik (kein „€“ überhaupt).

import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { WURZEL, lies } from "./css-hilfe";

/**
 * Schriften und Bilder sind Binärdateien: Als Text gelesen ergäben sie
 * Zufallszeichen, und ein Betrag stünde dort nie lesbar. SVG ist Text und wird
 * mitgeprüft.
 */
const BINAER = /\.(woff2?|ttf|otf|png|jpe?g|gif|webp|avif|ico|pdf)$/i;

function alleDateien(ordner: string): string[] {
  return readdirSync(ordner).flatMap((name) => {
    const voll = join(ordner, name);
    return statSync(voll).isDirectory() ? alleDateien(voll) : [relative(WURZEL, voll)];
  });
}

const DATEIEN = [
  "scripts/artifact-daten.ts",
  "README.md",
  ...alleDateien(join(WURZEL, "artifact/project")).filter((datei) => !BINAER.test(datei)),
];

/** Eine Zahl direkt vor oder nach „€“, getrennt höchstens durch Leerzeichen derselben Zeile (auch geschützte). */
const BETRAG = /(\d[\d.,]*)[ \t\u00a0\u202f]*€|€[ \t\u00a0\u202f]*(\d[\d.,]*)/g;

/** Alle Beträge eines Textes, deren Ziffern nicht nur Nullen sind. */
function echteBetraege(text: string): string[] {
  return [...text.matchAll(BETRAG)].filter((m) => /[1-9]/.test(m[1] ?? m[2] ?? "")).map((m) => m[0]);
}

describe("Zaun für Beträge außerhalb von src/", () => {
  it("prüft die Datentabelle, das README und die Lesefassung", () => {
    expect(DATEIEN).toContain("scripts/artifact-daten.ts");
    expect(DATEIEN).toContain("README.md");
    expect(DATEIEN).toContain("artifact/project/README.md");
    expect(DATEIEN.some((datei) => datei.endsWith("/preview.html"))).toBe(true);
  });

  it("das Muster unterscheidet Platzhalter von echten Beträgen", () => {
    expect(echteBetraege("00 €, 000 €, 0.000 €, 24 × 00 € = 000 €, Preis in €")).toEqual([]);
    expect(echteBetraege("89 €")).toEqual(["89 €"]);
    expect(echteBetraege("1.299\u00a0€")).toEqual(["1.299\u00a0€"]);
    expect(echteBetraege("€ 10,50")).toEqual(["€ 10,50"]);
  });

  it("vor und nach „€“ steht nur eine Zahl aus Nullen", () => {
    for (const datei of DATEIEN) expect(echteBetraege(lies(datei)), datei).toEqual([]);
  });
});
