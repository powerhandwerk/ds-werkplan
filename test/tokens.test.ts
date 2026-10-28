// @vitest-environment node
import { describe, expect, it } from "vitest";
import { ZIELE } from "../scripts/erzeuge";
import { FARBEN, SCHRIFTFAMILIEN, cssVon, hexVon, oklchZuRgb, type FarbName } from "../src/tokens";
import { lies } from "./css-hilfe";
import adminGlobals from "./fixtures/admin-globals.json";
import cdHandbuch from "./fixtures/cd-handbuch-hex.json";

// src/tokens.ts ist die einzige Quelle aller Werte. Dieser Test hält die
// erzeugten Dateien aktuell und die gemeinsamen Namen gleich mit dem Admin,
// dessen app/globals.css die Alt-Werte weiterführt, bis das Portal umgezogen ist.

const istFarbe = (name: string): name is FarbName => Object.hasOwn(FARBEN, name);

/** Zahlen vereinheitlichen: `0.50` und `0.5` sind derselbe Wert. */
function vereinheitlicht(wert: string): string {
  return wert
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\d*\.\d+|\d+/g, (zahl) => String(Number(zahl)));
}

describe("Erzeugte Dateien", () => {
  it.each(Object.entries(ZIELE))("%s ist aktuell (bun run erzeuge)", (pfad, erzeuge) => {
    expect(lies(pfad)).toBe(erzeuge());
  });
});

describe("Gleichstand mit dem Admin (app/globals.css)", () => {
  const GESTRICHEN = ["ink-700", "ink-150", "ink-000"];

  it("gemeinsame Farbnamen tragen dieselben Werte", () => {
    const geprueft: string[] = [];
    for (const [name, wert] of Object.entries(adminGlobals.werte)) {
      if (!istFarbe(name)) continue;
      expect(vereinheitlicht(cssVon(name)), name).toBe(vereinheitlicht(wert));
      geprueft.push(name);
    }
    expect(geprueft).toHaveLength(Object.keys(FARBEN).length);
  });

  it("die Schriftstapel sind dieselben", () => {
    const werte = adminGlobals.werte as Record<string, string>;
    expect(SCHRIFTFAMILIEN.display.stapel).toBe(werte["font-display"]);
    expect(SCHRIFTFAMILIEN.body.stapel).toBe(werte["font-body"]);
  });

  it("nur Ink-700, Ink-150 und Ink-000 fehlen gegenüber dem Admin (zehn Stufen)", () => {
    const fehlend = Object.keys(adminGlobals.werte).filter((name) => !istFarbe(name) && !name.startsWith("font-"));
    expect(fehlend).toEqual(GESTRICHEN);
    expect(Object.keys(FARBEN).filter((name) => name.startsWith("ink-"))).toHaveLength(10);
  });

  it("die Ersatzmischung für Ink-150 weicht höchstens 2 von 255 ab, die für Ink-700 höchstens 1", () => {
    // Mischung in oklch wie color-mix(): Helligkeit, Buntheit und Farbton linear.
    const ok = (name: string) => {
      const wert = (adminGlobals.werte as Record<string, string>)[name] ?? "";
      return wert.match(/[\d.]+/g)!.map(Number) as [number, number, number];
    };
    const mische = (a: number[], b: number[], anteilA: number) =>
      a.map((wert, i) => wert * anteilA + b[i] * (1 - anteilA)) as [number, number, number];
    const abstand = (x: number[], y: number[]) => Math.max(...x.map((wert, i) => Math.abs(wert - y[i])));

    const ink150 = oklchZuRgb(ok("ink-150"));
    const ersatz150 = oklchZuRgb(mische(ok("ink-100"), ok("ink-200"), 0.5));
    expect(abstand(ink150, ersatz150)).toBeLessThanOrEqual(2);

    const ink700 = oklchZuRgb(ok("ink-700"));
    const ersatz700 = oklchZuRgb(mische(ok("ink-800"), ok("ink-600"), 0.55));
    expect(abstand(ink700, ersatz700)).toBeLessThanOrEqual(1);
  });
});

describe("Druckwerte (CD-Handbuch, PDF)", () => {
  it("jede Farbe trifft den Hex-Wert des Handbuchs genau", () => {
    let treffer = 0;
    for (const [name, hex] of Object.entries(cdHandbuch.hex)) {
      if (!istFarbe(name)) continue;
      expect(hexVon(name), name).toBe(hex);
      treffer++;
    }
    expect(treffer).toBeGreaterThanOrEqual(13);
  });

  it("Mischungen mit transparent ergeben Hex mit Alpha", () => {
    expect(hexVon("ink-950", 40)).toBe("#120f0a66");
    expect(hexVon("lime-glow")).toBe("#b5e54573");
  });

  it("Verweise lösen auf ihr Ziel auf", () => {
    expect(hexVon("focus-ring")).toBe(hexVon("ink-950"));
    expect(hexVon("focus-ring-on-dark")).toBe(hexVon("lime"));
    expect(cssVon("focus-ring")).toBe("var(--ink-950)");
  });
});
