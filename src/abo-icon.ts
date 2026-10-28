// Geometrie der drei festen Abo-Icons (Standard, Profi, Platzhirsch) des DS
// Werkplan 2.0 (ADR-261), 1:1 aus der kompakten Fassung des Radar-Musters
// (Flo, 24.07.2026). Radar-Reichweite: drei konzentrische Ringe, die erreichten
// voll und die möglichen blass, dazu ein Lime-Schwenk, der mit der Stufe wächst.
// Standard = kleinste Reichweite, Platzhirsch = größte.
//
// EINE Quelle für Web (AboIcon in ./icons.tsx) und PDF, damit beide Fassungen
// nie auseinanderlaufen. Reines Modul, auch im Client nutzbar.

/** Die drei Pakete in ihrer festen Reihenfolge. Nur Namen, keine Preise. */
export const PAKETE = ["Standard", "Profi", "Platzhirsch"] as const;
export type Paket = (typeof PAKETE)[number];

/** Quadratisches Icon-Raster; alle Maße unten in diesen Einheiten. */
export const ABO_ICON_VIEWBOX = 24;

/** Ringradien von innen nach außen. Kompakte Fassung: Strich auf 1,6 gehoben und
 *  die Trefferpunkte weggelassen, bei 16 bis 20 px fiele ihr r 1,25 unter ein Pixel. */
export const ABO_ICON_RING_RADII = [3.8, 7.2, 10.4] as const;
export const ABO_ICON_STROKE_WIDTH = 1.6;

/** Ringe jenseits der erreichten Stufe bleiben sichtbar, aber blass (möglich, nicht abwesend). */
export const ABO_ICON_FAINT_OPACITY = 0.28;

/** Mitte der Ringe; das Raster sitzt 0,5 tiefer, damit unten Platz für den Schwenk bleibt. */
export const ABO_ICON_CENTER = { x: 12, y: 12.5, r: 1.9 } as const;

/** Der Schwenk ist eine Lime-Pille auf der Mittellinie der Ringe: y 10,7 plus Höhe
 *  3,6 zentriert sie auf cy 12,5, rx = Höhe / 2 macht beide Enden rund. */
export const ABO_ICON_SWEEP = { y: 10.7, height: 3.6, rx: 1.8, angle: -42 } as const;

/** Länge des Schwenks je Stufe, der zweite Träger der Stufe neben den Ringen. */
export const ABO_ICON_SWEEP_WIDTHS: Record<Paket, number> = {
  Standard: 5.4,
  Profi: 8.8,
  Platzhirsch: 11.8,
};

/** Reichweitenstufe 1 bis 3 = Zahl der vollen Ringe, aus der Reihenfolge in PAKETE. */
export function aboIconStage(paket: Paket): number {
  return PAKETE.indexOf(paket) + 1;
}

/** Die gedrehte Schwenk-Pille als Linie mit runden Enden: geometrisch gleich dem
 *  SVG-rect (rx = Höhe / 2), aber in @react-pdf/renderer darstellbar, das keine
 *  verlässliche Gruppen-Transformation kennt. Die Achse der Pille läuft von der
 *  Ringmitte nach außen; die Linie verbindet die Mittelpunkte der beiden Enden. */
export function aboIconSweepLine(paket: Paket): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeWidth: number;
} {
  const rad = (ABO_ICON_SWEEP.angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const at = (d: number) => ({
    x: ABO_ICON_CENTER.x + d * cos,
    y: ABO_ICON_CENTER.y + d * sin,
  });
  const a = at(ABO_ICON_SWEEP.rx);
  const b = at(ABO_ICON_SWEEP_WIDTHS[paket] - ABO_ICON_SWEEP.rx);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y, strokeWidth: ABO_ICON_SWEEP.height };
}
