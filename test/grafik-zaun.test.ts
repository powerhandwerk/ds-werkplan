// @vitest-environment node
// Zaun der Grafikstile (ADR-262, Plan ds-werkplan-grafikstile Step 6): Das
// Repo ist öffentlich. In src/ stehen außer den Beispielen keine Inhalte der
// Website, keine Preise und kein Credit-Link von iso-glow; die MIT-Lizenz
// steht als Kopf in den beiden Dateien, die auf iso-glow beruhen.

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { WURZEL, lies } from "./css-hilfe";

const DATEIEN = readdirSync(join(WURZEL, "src")).map((datei) => `src/${datei}`);
const TEXTE = DATEIEN.map((datei) => [datei, lies(datei)] as const);

/** Lizenzköpfe `/*! … *\/` bleiben stehen, wenn ein Bundler minifiziert; nur dort darf iso-glow genannt sein. */
const ohneLizenzkopf = (text: string) => text.replace(/\/\*![\s\S]*?\*\//g, "");

/** Herkunftszeile: „Port aus powerhandwerk-website, <Pfad> (keteso <Commit>)“, auch über einen Zeilenumbruch im Kommentar. */
const ohneHerkunft = (text: string) => text.replace(/Port aus powerhandwerk-website,[^()]*?\(keteso [0-9a-f]{7,}\)/g, "");

describe("Zaun der Grafik über src/", () => {
  it("kein „Made with“ und kein iso-glow außerhalb der Lizenzköpfe", () => {
    for (const [datei, text] of TEXTE) {
      const rest = ohneLizenzkopf(text);
      expect(rest, datei).not.toMatch(/made with/i);
      expect(rest, datei).not.toMatch(/iso-glow/i);
    }
  });

  it("keine Preise: kein €", () => {
    for (const [datei, text] of TEXTE) expect(text.includes("€"), datei).toBe(false);
  });

  it("keine Inhalte der Dachdeckerseite und kein Preis-Zaun", () => {
    for (const [datei, text] of TEXTE) {
      expect(text, datei).not.toMatch(/dachdecker/i);
      expect(text, datei).not.toMatch(/preis-zaun/i);
    }
  });

  it("kein Verweis auf das Admin-Repo", () => {
    for (const [datei, text] of TEXTE) expect(text, datei).not.toContain("powerhandwerk-admin");
  });

  it("Pfade der Website nur in Herkunftszeilen", () => {
    for (const [datei, text] of TEXTE) {
      const rest = ohneHerkunft(text);
      expect(rest, datei).not.toContain("powerhandwerk-website");
      expect(rest, datei).not.toMatch(/\b(?:lib\/werkplan|lib\/grafiken|components\/werkplan)\//);
    }
  });

  it("der MIT-Kopf von iso-glow steht in iso.ts und explosion.ts", () => {
    for (const datei of ["src/iso.ts", "src/explosion.ts"]) {
      const kopf = lies(datei).match(/^\/\*![\s\S]*?\*\//)?.[0] ?? "";
      expect(kopf, datei).toContain("MIT");
      expect(kopf, datei).toContain("LICENSE-iso-glow.txt");
    }
  });
});
