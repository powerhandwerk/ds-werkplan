// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Massbalken } from "../src/Massbalken";
import { BEWEGUNG, MASSE } from "../src/tokens";
import { lies, werte } from "./css-hilfe";

// Maße und Bewegung stehen als Zahlen in src/tokens.ts (für tokens.json und das
// PDF) und als Werte im CSS. Dieser Test hält beide gleich.

const WP = lies("src/werkplan.module.css");
const LK = lies("src/lichtkante.module.css");
const UEBERGANG = `${BEWEGUNG.uebergangMs}ms ${BEWEGUNG.kurve}`;

describe("Maße und Bewegung im CSS folgen src/tokens.ts", () => {
  it.each([".nacht", ".papier"])("Millimeterraster der Fläche %s", (flaeche) => {
    expect(werte(WP, flaeche)["background-size"]).toBe(`${MASSE.raster}px ${MASSE.raster}px`);
  });

  it("Maßbalken: Höhe, Linie und Füllung", () => {
    expect(werte(WP, ".massbalken").height).toBe(`${MASSE.massbalkenHoehe}px`);
    for (const linie of [".massbalkenLinie", ".massbalkenFuellung"]) {
      expect(werte(WP, linie)["stroke-width"], linie).toBe(String(MASSE.linie));
    }
    const markup = renderToStaticMarkup(<Massbalken anteil={50} untergrund="papier" />);
    expect(markup).toContain(`viewBox="0 0 100 ${MASSE.massbalkenHoehe}"`);
    expect(markup).toMatch(new RegExp(`<rect[^>]*height="${MASSE.massbalkenFuellung}"`));
  });

  it("Sucher-Ecken", () => {
    const ecke = werte(WP, ".eckeOl");
    expect(ecke.width).toBe(`${MASSE.ecke}px`);
    expect(ecke["border-top-width"]).toBe(`${MASSE.eckeLinie}px`);
  });

  it("Lichtkante: Höhe, Chip und Lichtumlauf", () => {
    const lk = werte(LK, ".lk");
    const chip = werte(LK, ".chip");
    expect(lk["--lk-h"]).toBe(`${MASSE.lichtkanteHoehe}px`);
    expect(chip.width).toBe(`${MASSE.lichtkanteChip}px`);
    expect(chip["border-radius"]).toBe(`calc(${MASSE.lichtkanteChip}px * var(--rund-pille-faktor))`);
    expect(lk.animation).toContain(`${MASSE.lichtkanteUmlauf}s`);
  });

  it("Übergänge von Textlink und Maßbalken", () => {
    expect(werte(WP, ".textlink").transition).toBe(`background-size ${UEBERGANG}`);
    expect(werte(WP, ".massbalkenFuellung").transition).toBe(`width ${UEBERGANG}, x ${UEBERGANG}`);
  });
});
