// @vitest-environment node
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { WURZEL, lies } from "./css-hilfe";

// package.json `exports` ist eine ausdrückliche Liste mit Dateiendungen im
// Ziel: TypeScript hängt bei exports-Zielen keine Endung an, ein Platzhalter
// ohne Endung bräche jeden Import. Dieser Test prüft beide Richtungen.

const PAKET = JSON.parse(lies("package.json")) as { exports: Record<string, string> };
const EINTRAEGE = Object.entries(PAKET.exports);
const FESTE = EINTRAEGE.filter(([schluessel]) => !schluessel.includes("*") && schluessel !== "./package.json");
const QUELLEN = readdirSync(join(WURZEL, "src")).filter((datei) => !datei.endsWith(".d.ts"));

describe("package.json exports", () => {
  it("jedes Ziel existiert und trägt eine Dateiendung", () => {
    for (const [schluessel, ziel] of FESTE) {
      expect(ziel, schluessel).toMatch(/^\.\/src\/[\w.-]+\.(ts|tsx|css)$/);
      expect(existsSync(join(WURZEL, ziel)), ziel).toBe(true);
    }
  });

  it("der Schlüssel nennt die Datei: ./X zeigt auf ./src/X mit Endung", () => {
    for (const [schluessel, ziel] of FESTE) {
      if (schluessel === ".") {
        expect(ziel).toBe("./src/index.ts");
        continue;
      }
      expect(ziel.replace(/\.(tsx?)$/, ""), schluessel).toBe(schluessel.replace(/^\.\//, "./src/"));
    }
  });

  it("jede Datei in src/ ist exportiert (außer Typdeklarationen)", () => {
    const exportiert = new Set(FESTE.map(([, ziel]) => ziel.replace(/^\.\/src\//, "")));
    expect(QUELLEN.filter((datei) => !exportiert.has(datei))).toEqual([]);
  });

  it("Platzhalter zeigen auf Ordner mit Dateien", () => {
    for (const [schluessel, ziel] of EINTRAEGE.filter(([s]) => s.includes("*"))) {
      expect(ziel, schluessel).toBe(schluessel);
      const ordner = join(WURZEL, ziel.replace(/^\.\//, "").replace(/\/\*$/, ""));
      expect(readdirSync(ordner).length, schluessel).toBeGreaterThan(0);
    }
  });

  it("index.ts reicht jedes TypeScript-Modul aus src/ weiter", () => {
    const index = lies("src/index.ts");
    const module = QUELLEN.filter((datei) => /\.tsx?$/.test(datei) && datei !== "index.ts");
    expect(module.filter((datei) => !index.includes(`from "./${datei.replace(/\.tsx?$/, "")}"`))).toEqual([]);
  });
});
