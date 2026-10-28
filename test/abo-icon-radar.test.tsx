import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ABO_ICON_SWEEP_WIDTHS, PAKETE, aboIconStage, aboIconSweepLine } from "../src/abo-icon";
import { AboIcon } from "../src/icons";

// Festes Abo-Icon als Radar-Reichweite (Flo, 24.07.2026): die Reichweite wächst
// mit der Stufe, Standard = kleinste, Platzhirsch = größte. Im Admin prüfte der
// Test das Icon in der Paket-Sektion des Angebots; hier das Icon selbst.

describe("AboIcon", () => {
  it.each(PAKETE)("%s rendert das Icon seiner Reichweiten-Stufe", (paket) => {
    const markup = renderToStaticMarkup(<AboIcon paket={paket} />);
    expect(markup).toContain(`data-abo-stage="${aboIconStage(paket)}"`);
    // Die Länge des Schwenks ist der zweite Träger der Stufe neben den Ringen.
    expect(markup).toContain(`width="${ABO_ICON_SWEEP_WIDTHS[paket]}"`);
    // Volle Ringe = Stufe, die übrigen blass.
    expect((markup.match(/opacity="0.28"/g) ?? []).length).toBe(3 - aboIconStage(paket));
  });

  it("das Icon ist dekorativ: aria-hidden, kein zweiter Screenreader-Text", () => {
    const svg = renderToStaticMarkup(<AboIcon paket="Profi" />);
    expect(svg).toContain('aria-hidden="true"');
    expect(svg).not.toMatch(/aria-label|<title|role=/);
  });

  it("Reichweite wächst strikt mit der Stufe (Standard < Profi < Platzhirsch)", () => {
    expect(PAKETE.map(aboIconStage)).toEqual([1, 2, 3]);
    const widths = PAKETE.map((p) => ABO_ICON_SWEEP_WIDTHS[p]);
    expect(widths[0]).toBeLessThan(widths[1]);
    expect(widths[1]).toBeLessThan(widths[2]);
  });

  it("die PDF-Linie des Schwenks ist so lang wie die Pille ohne ihre runden Enden", () => {
    for (const paket of PAKETE) {
      const { x1, y1, x2, y2, strokeWidth } = aboIconSweepLine(paket);
      expect(Math.hypot(x2 - x1, y2 - y1) + strokeWidth).toBeCloseTo(ABO_ICON_SWEEP_WIDTHS[paket], 6);
    }
  });
});
