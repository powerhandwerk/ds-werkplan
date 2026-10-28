import { describe, expect, it } from "vitest";
import { massketteGeometrie } from "../src/Masskette";

// Maßkette der Website-Übergabe (Entwurf „Plan-Blatt“): je Position ein
// gleich langes Teilstück, Teilstriche innerhalb eines Blatts, ein langer
// Trennstrich zwischen Blatt 01 und Blatt 02, Lime-Füllung je Folge geprüfter
// Positionen. Referenz ist der Zustand des Mockups: 6 von 10, Pos. 01 bis 04
// und 07, 08 geprüft.

const gerundet = (werte: number[]) => werte.map((w) => Math.round(w * 100) / 100);

describe("massketteGeometrie", () => {
  it("zeichnet den Mockup-Zustand 6 von 10 nach", () => {
    const geo = massketteGeometrie([
      [true, true, true, true, false, false],
      [true, true, false, false],
    ]);
    expect(geo.fuellungen.map((f) => [Math.round(f.x), Math.round(f.breite)])).toEqual([
      [0, 40],
      [60, 20],
    ]);
    expect(gerundet(geo.trenner)).toEqual([60]);
    expect(gerundet(geo.teilungen)).toEqual([10, 20, 30, 40, 50, 70, 80, 90]);
  });

  it("füllt die ganze Kette, wenn alles geprüft ist", () => {
    const geo = massketteGeometrie([
      [true, true],
      [true, true],
    ]);
    expect(geo.fuellungen).toEqual([
      { x: 0, breite: 50 },
      { x: 50, breite: 50 },
    ]);
  });

  it("ohne Positionen bleibt die Kette leer statt durch null zu teilen", () => {
    expect(massketteGeometrie([[], []])).toEqual({ fuellungen: [], teilungen: [], trenner: [] });
  });

  it("setzt keinen Trennstrich vor einen leeren oder den ersten Abschnitt", () => {
    const geo = massketteGeometrie([[], [false, true]]);
    expect(geo.trenner).toEqual([]);
    expect(geo.fuellungen).toEqual([{ x: 50, breite: 50 }]);
  });
});
