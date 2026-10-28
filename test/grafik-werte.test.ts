// @vitest-environment node
import { describe, expect, it } from "vitest";
import { BEWEGUNG, GRAFIK } from "../src/tokens";

// Die Werte der Grafikstile stehen als Zahlen in src/tokens.ts. Dieser Test hält
// die Werte untereinander stimmig; die Abschnitte für leistungskarten.module.css
// und die Standardwerte der Komponenten kommen mit den Komponenten dazu.

describe("Werte der Grafikstile in src/tokens.ts", () => {
  it("die Kurve der Karte ist eine cubic-bezier mit x-Werten zwischen 0 und 1", () => {
    const treffer = /^cubic-bezier\(([^)]+)\)$/.exec(BEWEGUNG.kurveKarte);
    expect(treffer).not.toBeNull();
    const [x1, , x2] = (treffer?.[1] ?? "").split(",").map((teil) => Number(teil.trim()));
    for (const x of [x1, x2]) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(1);
    }
  });

  it("die Karte kippt nach dem Farbwechsel fertig, nicht davor", () => {
    expect(BEWEGUNG.kippenMs).toBeGreaterThanOrEqual(BEWEGUNG.karteMs);
  });

  it("die breite Karte kippt flacher und hebt sich weniger als die schmale", () => {
    expect(Math.abs(GRAFIK.kippGradBreit)).toBeLessThan(Math.abs(GRAFIK.kippGrad));
    expect(GRAFIK.hebenPxBreit).toBeLessThan(GRAFIK.hebenPx);
  });

  it("die Striche staffeln sich: fein < Kontur < Lime < Zeiger", () => {
    expect(GRAFIK.strichFein).toBeLessThan(GRAFIK.strich);
    expect(GRAFIK.strich).toBeLessThan(GRAFIK.strichLime);
    expect(GRAFIK.strichLime).toBeLessThan(GRAFIK.strichZeiger);
  });

  it("Startanteile sind Anteile der Sichtfläche", () => {
    for (const anteil of [GRAFIK.handyStartAnteil, GRAFIK.isoStartAnteil]) {
      expect(anteil).toBeGreaterThan(0);
      expect(anteil).toBeLessThanOrEqual(1);
    }
  });
});
