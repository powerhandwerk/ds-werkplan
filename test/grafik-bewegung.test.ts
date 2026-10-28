// @vitest-environment node
// Bewegung nur mit Ausweg (Plan ds-werkplan-grafikstile Step 6): Jede
// Modul-CSS-Datei in src/, die `transition` oder `animation` setzt, hat einen
// Block `@media (prefers-reduced-motion: reduce)`. Gilt für alle Module, nicht
// nur für die Grafik, weil der Bestand die Regel schon erfüllt.

import { describe, expect, it } from "vitest";
import { cssDateien, lies, ohneKommentare, regeln } from "./css-hilfe";

const MODULE = cssDateien().filter((datei) => datei.endsWith(".module.css"));
const BEWEGUNG = /^(?:transition|animation)(?:-|$)/;

describe("Bewegung in den CSS-Modulen", () => {
  it("die Grafik-Module bewegen sich und sind dabei", () => {
    for (const datei of ["src/leistungskarten.module.css", "src/explosion.module.css"]) {
      expect(MODULE, datei).toContain(datei);
      expect(regeln(lies(datei)).some((r) => [...r.deklarationen.keys()].some((n) => BEWEGUNG.test(n))), datei).toBe(true);
    }
  });

  it("jedes Modul mit transition oder animation hat einen Block prefers-reduced-motion: reduce", () => {
    for (const datei of MODULE) {
      const css = lies(datei);
      const bewegt = regeln(css).some((r) => [...r.deklarationen.keys()].some((n) => BEWEGUNG.test(n)));
      if (!bewegt) continue;
      expect(ohneKommentare(css), datei).toMatch(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/);
    }
  });
});
