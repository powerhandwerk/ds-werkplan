import { describe, expect, it } from "vitest";
import {
  GEOMETRY_DEFAULT,
  MARKER_AREA_HEIGHT,
  MARKER_BASELINE_EM,
  MARKER_CAP_HEIGHT_EM,
  MARKER_OVERSHOOT_EM,
  MARKER_REFERENCE_HEIGHT_EM,
  MARKER_CHAR_WIDTH,
  MARKER_CLEARANCE_BOTTOM,
  MARKER_CLEARANCE_SIDE,
  MARKER_CLEARANCE_TOP,
  MARKER_RADIUS_FACTOR,
  MARKER_TILT_DEG,
  markerGeometry,
  markerTiltDeg,
} from "../src/MarkerHighlight";

/**
 * WB-8a5b45b3: Die Marker-Neigung wurde einmal an zwei Stellen unabhängig
 * gerechnet; ab 8 Zeichen liefen sie auseinander. Geblieben ist die Fassung mit
 * seitlicher Luft: der Hub entsteht an den Enden der FLÄCHE, nicht des Wortes.
 *
 * Dieser Test hält die Werte fest, damit die Rechnung nicht wieder still driftet.
 */
describe("markerTiltDeg", () => {
  it("gibt kurzen Wörtern die volle CD-Neigung", () => {
    for (const wort of ["Kern", "Farbe", "Flach", "klingt", "Alltag", "Schrift", "Zeichen"]) {
      expect(markerTiltDeg(wort)).toBe(MARKER_TILT_DEG);
    }
  });

  it("flacht lange Wörter ab", () => {
    expect(markerTiltDeg("gefunden")).toBe(-3.56);
    expect(markerTiltDeg("nicht gefunden")).toBe(-2.15);
    expect(markerTiltDeg("Bestandsaufnahme")).toBe(-1.89);
  });

  it("hält den Hub der Flächenenden unter der Luft an der Grundlinie", () => {
    for (const zeichen of [1, 4, 8, 14, 30]) {
      const wort = "x".repeat(zeichen);
      const breite = zeichen * MARKER_CHAR_WIDTH + 2 * MARKER_CLEARANCE_SIDE;
      const hub = (breite / 2) * Math.sin((Math.abs(markerTiltDeg(wort)) * Math.PI) / 180);
      expect(hub).toBeLessThanOrEqual(MARKER_CLEARANCE_BOTTOM);
    }
  });

  it("fällt bei leerer Eingabe auf die CD-Neigung zurück", () => {
    expect(markerTiltDeg("")).toBe(MARKER_TILT_DEG);
    expect(markerTiltDeg("   ")).toBe(MARKER_TILT_DEG);
  });
});

/**
 * WB-af6cfb14: Die vier CSS-Werte waren bis 13.08.2026 aus zwei falschen
 * Annahmen zurückgerechnet (Bezugshöhe 0,81em statt 0,805em, Grundlinie
 * 0,856em statt 0,8855em). Deshalb prüft dieser Block die Zahlen gegen ihre
 * Herleitung.
 */
describe("Marker-CSS-Geometrie", () => {
  it("ist aus den Schriftmetriken hergeleitet, nicht gesetzt", () => {
    expect(GEOMETRY_DEFAULT).toEqual(markerGeometry());
    expect(GEOMETRY_DEFAULT).toEqual({
      top: "-0.072em",
      bottom: "-0.030em",
      side: "-0.232em",
      radius: "0.477em",
    });
  });

  it("trifft die Gegenprobe: Flächenhöhe = 1,369 × Bezugshöhe", () => {
    // Bezugsgröße ist die Bounding-Box des Wortes (Versal-Oberkante bis
    // Unterkante der Rundungsüberschüsse), NICHT die Cap-Height; nur so geht
    // die 36,9-%-Gegenprobe auf.
    const px = (wert: string) => parseFloat(wert) * 100;
    const oben = px(GEOMETRY_DEFAULT.top);
    const unten = 100 - px(GEOMETRY_DEFAULT.bottom);
    const bezug = MARKER_REFERENCE_HEIGHT_EM * 100;
    const versalOberkante = (MARKER_BASELINE_EM - MARKER_CAP_HEIGHT_EM) * 100;
    const bboxUnterkante = (MARKER_BASELINE_EM + MARKER_OVERSHOOT_EM) * 100;

    expect((unten - oben) / bezug).toBeCloseTo(MARKER_AREA_HEIGHT, 3);
    expect((versalOberkante - oben) / bezug).toBeCloseTo(MARKER_CLEARANCE_TOP, 3);
    expect((unten - bboxUnterkante) / bezug).toBeCloseTo(MARKER_CLEARANCE_BOTTOM, 3);
    expect(-px(GEOMETRY_DEFAULT.side) / bezug).toBeCloseTo(MARKER_CLEARANCE_SIDE, 3);
    expect(px(GEOMETRY_DEFAULT.radius) / (unten - oben)).toBeCloseTo(MARKER_RADIUS_FACTOR, 3);

    // Die Fläche ist 36,9 % höher als die Bounding-Box des Wortes.
    expect(((unten - oben) / bezug - 1) * 100).toBeCloseTo(36.9, 1);
  });
});
