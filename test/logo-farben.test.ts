// @vitest-environment node
// Logo-Dateien färben ohne <style>-Block (Befund 28.10.2026): Asset-Betrachter wie
// der Design-System-Artifact verwerfen eingebettete Stylesheets, dann gilt die
// Standardfüllung Schwarz und die Pille deckt „handwerk“ zu. Jede gefüllte Form
// trägt ihre Farbe deshalb selbst als Präsentationsattribut.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { WURZEL } from "./css-hilfe";

const ORDNER = ["assets", "artifact/project/assets/Logos"];
const FORMEN = /<(path|rect|circle|ellipse|polygon|polyline)\b[^>]*>/g;

const svgs = ORDNER.flatMap((ordner) =>
  readdirSync(join(WURZEL, ordner))
    .filter((name) => name.endsWith(".svg"))
    .map((name) => `${ordner}/${name}`),
);

describe("Logo-Farben ohne Stylesheet", () => {
  it("findet die Logo-Dateien", () => {
    expect(svgs.length).toBe(6);
  });

  it.each(svgs)("%s färbt nur über fill-Attribute", (pfad) => {
    const svg = readFileSync(join(WURZEL, pfad), "utf8");
    expect(svg).not.toMatch(/<style\b/);
    expect(svg).not.toMatch(/\sclass=/);
    const formen = [...svg.matchAll(FORMEN)].map((m) => m[0]);
    expect(formen.length).toBeGreaterThan(0);
    const ohneFarbe = formen.filter((tag) => !/\sfill="#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})"/.test(tag));
    expect(ohneFarbe).toEqual([]);
  });

  // Die Pille der Wortmarke ist das einzige rect; schwarz gefüllt deckt sie „handwerk“ zu.
  it.each(svgs.filter((pfad) => pfad.includes("logo-powerhandwerk")))("%s: Pille ist Lime", (pfad) => {
    const svg = readFileSync(join(WURZEL, pfad), "utf8");
    const pillen = [...svg.matchAll(/<rect\b[^>]*>/g)].map((m) => m[0]);
    expect(pillen).toHaveLength(1);
    expect(pillen[0]).toMatch(/\sfill="#b5e545"/);
  });
});
