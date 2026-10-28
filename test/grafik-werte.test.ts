// @vitest-environment node
import { describe, expect, it } from "vitest";
import { BEWEGUNG, GRAFIK } from "../src/tokens";
import { lies, ohneKommentare, werte } from "./css-hilfe";

// Die Werte der Grafikstile stehen als Zahlen in src/tokens.ts. Dieser Test hält
// die Werte untereinander stimmig und die CSS-Werte an denselben Zahlen. Den
// Sichtanteil der Handy-Geste prüft test/leistungskarten.test.tsx im
// gerenderten Motor (braucht jsdom, css-hilfe braucht node).

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

describe("leistungskarten.module.css folgt BEWEGUNG und GRAFIK", () => {
  const LK = lies("src/leistungskarten.module.css");
  const farbe = (name: string) => `${name} ${BEWEGUNG.karteMs}ms ${BEWEGUNG.kurveKarte}`;
  const KIPPEN_BASIS = "perspective(900px) rotateX(var(--lk-rx)) rotateY(var(--lk-ry))";

  it("Übergänge: Farben 320 ms, Kippen 380 ms, mit der Kurve der Karte", () => {
    expect(werte(LK, ".karte").transition).toBe(
      [
        ...["--lk-bg", "--lk-line", "--lk-txt", "--lk-mut", "--lk-glow"].map(farbe),
        `transform ${BEWEGUNG.kippenMs}ms ${BEWEGUNG.kurveKarte}`,
      ].join(", "),
    );
  });

  it("aktive Karte: gekippt, angehoben, vergrößert, ohne Schatten", () => {
    expect(werte(LK, ".an").transform).toBe(
      `${KIPPEN_BASIS} rotate(${GRAFIK.kippGrad}deg) translateY(-${GRAFIK.hebenPx}px) scale(${GRAFIK.skalierung})`,
    );
    expect(ohneKommentare(LK)).not.toMatch(/box-shadow/);
  });

  it("aktive breite Karte: flacher und weniger angehoben, ohne Vergrößerung", () => {
    const rahmen = "@media (min-width: 600px) and (prefers-reduced-motion: no-preference)";
    expect(werte(LK, ".rasterBreit .an", rahmen).transform).toBe(
      `${KIPPEN_BASIS} rotate(${GRAFIK.kippGradBreit}deg) translateY(-${GRAFIK.hebenPxBreit}px)`,
    );
  });

  it.each([
    [".f", GRAFIK.strich],
    [".l", GRAFIK.strich],
    [".a", GRAFIK.strich],
    [".th", GRAFIK.strichFein],
    [".al", GRAFIK.strichLime],
    [".zeiger", GRAFIK.strichZeiger],
  ])("Strichstärke der SVG-Klasse %s", (klasse, staerke) => {
    expect(werte(LK, `.buehne :global(${klasse})`)["stroke-width"]).toBe(String(staerke));
  });

  it("Leuchtsaum der Lime-Teile", () => {
    expect(werte(LK, ".buehne :global(.gl)").filter).toBe(`drop-shadow(0 0 ${GRAFIK.leuchtsaumPx}px var(--lk-glow))`);
  });
});
