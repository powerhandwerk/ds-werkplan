// @vitest-environment node
import { describe, expect, it } from "vitest";
import { BAUSTEINE } from "../scripts/artifact-daten";
import { BEWEGUNG, GRAFIK } from "../src/tokens";
import { lies, ohneKommentare, regeln, werte } from "./css-hilfe";

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
  /** Der Abschnitt „Wann“ der Leitlinie eines Bausteins als ein Text. */
  const leitlinie = (name: string) => BAUSTEINE.find((b) => b.name === name)?.wann.join(" ") ?? "";

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

  it("die Leitlinie nennt die Breite, ab der die breite Karte flacher kippt", () => {
    const rahmen = regeln(LK).find((r) => r.selektoren.includes(".rasterBreit .an"))?.rahmen ?? "";
    const ab = /min-width: (\d+)px/.exec(rahmen)?.[1];
    expect(ab, rahmen).toBeDefined();
    const flacher = leitlinie("Leistungskarten").match(/breite Karte kippt[^.]*/g) ?? [];
    expect(flacher).toHaveLength(1);
    expect(flacher[0]).toContain(`ab ${ab} px Breite`);
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

  it("Sucher-Ecken der Bühne tragen die Linienfarbe der Karte, über die Stellschraube --ecken-farbe", () => {
    expect(werte(LK, ".karte")["--ecken-farbe"]).toBe("var(--lk-line)");
    // Die Ecken sind in SucherEcken span-Elemente; die Karte greift nicht in diesen Aufbau.
    expect(regeln(LK).flatMap((r) => r.selektoren).filter((s) => /\bspan\b/.test(s))).toEqual([]);
  });

  it("SucherEcken lesen --ecken-farbe vor der Flächenrolle, die Leitlinie beschreibt sie", () => {
    expect(werte(lies("src/werkplan.module.css"), ".eckeOl").border).toBe(
      "0 solid var(--ecken-farbe, var(--wp-stark, currentColor))",
    );
    expect(leitlinie("SucherEcken")).toContain("`--ecken-farbe`");
  });

  it("Maßbalken und Maßkette lesen --fuell-farbe vor Lime, die Leitlinien beschreiben sie", () => {
    expect(werte(lies("src/werkplan.module.css"), ".massbalkenFuellung").fill).toBe(
      "var(--fuell-farbe, var(--lime))",
    );
    for (const name of ["Massbalken", "Masskette"]) expect(leitlinie(name)).toContain("`--fuell-farbe`");
  });

  it("Leuchtsaum der Lime-Teile", () => {
    expect(werte(LK, ".buehne :global(.gl)").filter).toBe(`drop-shadow(0 0 ${GRAFIK.leuchtsaumPx}px var(--lk-glow))`);
  });
});
