// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { WURZEL } from "./css-hilfe";

// ADR-261 Nr. 6: Das Olivgrün ist gestrichen. Lime gibt es nur als Fläche mit
// dunkler Schrift darauf (Etikett, Punkt, Unterstrich). Die gesperrten Wörter
// stehen zusammengesetzt, damit dieser Test nicht an sich selbst anschlägt.

const VERBOTEN = [
  ["4c", "701a"].join(""), // Hex-Wert, gleich in welcher Schreibweise
  ["lime", "on", "light"].join("-"), // alter Token-Name im Admin
  ["lime", "text"].join("-"), // dieselbe Farbe auf der Website (oklch 0.48 0.12 130)
];

const ORDNER = ["src", "fonts", "assets", "artifact/project", "test"];
const DIESE_DATEI = "test/olivgruen.test.ts";

function dateienUnter(ordner: string): string[] {
  return readdirSync(join(WURZEL, ordner), { withFileTypes: true }).flatMap((eintrag) => {
    const pfad = `${ordner}/${eintrag.name}`;
    return eintrag.isDirectory() ? dateienUnter(pfad) : [pfad];
  });
}

describe("Olivgrün-Sperre", () => {
  it.each(ORDNER)("%s enthält kein Olivgrün", (ordner) => {
    const funde: string[] = [];
    for (const pfad of dateienUnter(ordner)) {
      if (pfad === DIESE_DATEI) continue;
      const inhalt = readFileSync(join(WURZEL, pfad), "latin1").toLowerCase();
      for (const wort of VERBOTEN) if (inhalt.includes(wort)) funde.push(`${pfad}: ${wort}`);
    }
    expect(funde).toEqual([]);
  });
});
