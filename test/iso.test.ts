// Port aus powerhandwerk-website, lib/grafiken/iso.test.ts (keteso 923a5c4).
import { describe, expect, it } from "vitest";
import { h, isoKernel, type Knoten, type Punkt2 } from "../src/iso";

/** iso-glow-Projektion (gallery.html): P = [(x − y)·cos30°, (x + y)·sin30° − z]. */
const isoGlow = (x: number, y: number, z: number): Punkt2 => [
  (x - y) * Math.cos(Math.PI / 6),
  (x + y) * Math.sin(Math.PI / 6) - z,
];

/** Alle Attributwerte und Texte eines Baums als flache Liste. */
function alleWerte(n: Knoten | string, aus: string[] = []): string[] {
  if (typeof n === "string") {
    aus.push(n);
    return aus;
  }
  for (const v of Object.values(n.attrs)) {
    if (v === undefined) continue;
    if (typeof v === "object") aus.push(...Object.values(v));
    else aus.push(String(v));
  }
  for (const k of n.kids) alleWerte(k, aus);
  return aus;
}

describe("isoKernel", () => {
  it("bei rot = 0 entspricht P der iso-glow-Projektion", () => {
    const k = isoKernel();
    for (const [x, y, z] of [
      [0, 0, 0],
      [10, 20, 5],
      [300, 190, 0],
      [-7.5, 42, 13],
    ] as const) {
      const [a, b] = k.P(x, y, z);
      const [ea, eb] = isoGlow(x, y, z);
      expect(a).toBeCloseTo(ea, 10);
      expect(b).toBeCloseTo(eb, 10);
    }
  });

  it("dreht um den Drehpunkt: der Drehpunkt selbst bleibt, wo er ohne Drehung stünde", () => {
    const gedreht = isoKernel({ rot: -0.4, cx: 150, cy: 95 });
    const [a, b] = gedreht.P(150, 95, 7);
    const [ea, eb] = isoGlow(150, 95, 7);
    expect(a).toBeCloseTo(ea, 10);
    expect(b).toBeCloseTo(eb, 10);
  });

  it("huelle liefert eine konvexe Hülle ohne innere Punkte", () => {
    const k = isoKernel();
    const pts: Punkt2[] = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [5, 5],
      [3, 7],
      [5, 0],
    ];
    const hl = k.huelle(pts);
    expect(hl).toHaveLength(4);
    expect(hl).not.toContainEqual([5, 5]);
    expect(hl).not.toContainEqual([3, 7]);
    // Konvex: alle Kreuzprodukte aufeinanderfolgender Kanten haben dasselbe Vorzeichen.
    const vorzeichen = hl.map((p, i) => {
      const a = hl[(i + 1) % hl.length];
      const b = hl[(i + 2) % hl.length];
      return Math.sign((a[0] - p[0]) * (b[1] - p[1]) - (a[1] - p[1]) * (b[0] - p[0]));
    });
    expect(new Set(vorzeichen).size).toBe(1);
  });

  it("bbox umschließt alle gemerkten Punkte samt Rand", () => {
    const k = isoKernel({ rot: -0.3, cx: 50, cy: 50 });
    const raum: [number, number, number][] = [
      [0, 0, 0],
      [100, 0, 0],
      [100, 100, 40],
      [0, 100, 12],
    ];
    k.merk(...raum);
    k.merkSchirm([-500, 3]);
    const bb = k.bbox(10);
    const punkte = [...raum.map((p) => k.P(...p)), [-500, 3] as Punkt2];
    for (const [x, y] of punkte) {
      expect(x).toBeGreaterThanOrEqual(bb.x0 + 10 - 0.01);
      expect(x).toBeLessThanOrEqual(bb.x0 + bb.w - 10 + 0.01);
      expect(y).toBeGreaterThanOrEqual(bb.y0 + 10 - 0.01);
      expect(y).toBeLessThanOrEqual(bb.y0 + bb.h - 10 + 0.01);
    }
    expect(bb.viewBox).toBe(`${bb.x0} ${bb.y0} ${bb.w} ${bb.h}`);
  });

  it("box liefert bei r = 0 drei Flächen, bei r > 0 Hülle plus Deckfläche", () => {
    const k = isoKernel({ K: { face: "F", top: "T" } });
    const eckig = k.box(0, 0, 0, 40, 30, 20);
    expect(eckig).toHaveLength(3);
    expect(eckig.every((n) => n.tag === "g" && n.kids.length === 1)).toBe(true);
    expect((eckig[2].kids[0] as Knoten).attrs.className).toBe("F T");

    const rund = k.box(0, 0, 0, 40, 30, 20, 6, "tafel");
    expect(rund.map((n) => n.tag)).toEqual(["path", "path"]);
    expect(rund[0].attrs.className).toBe("F tafel");
    expect(rund[1].attrs.className).toBe("F T tafel");
    expect(String(rund[0].attrs.d)).toMatch(/^M.*Z$/);
  });

  it("matInv kehrt die Flächenachsen um", () => {
    const k = isoKernel({ rot: -0.43 });
    const inv = k.matInv([1, 0, 0], [0, 0, -1]);
    const u = k.D(1, 0, 0);
    const v = k.D(0, 0, -1);
    const [a, b] = inv(u[0] * 3 + v[0] * 5, u[1] * 3 + v[1] * 5);
    expect(a).toBeCloseTo(3, 1);
    expect(b).toBeCloseTo(5, 1);
  });

  it("h klopft Kinder flach und lässt Leeres weg", () => {
    const n = h("g", null, ["a", [null, "b", false]], undefined, "", 3);
    expect(n.kids).toEqual(["a", "b", "3"]);
    expect(n.attrs).toEqual({});
  });

  it("Ausgabe frei von NaN, auch mit Drehung", () => {
    const k = isoKernel({ rot: (-25 * Math.PI) / 180, cx: 150, cy: 95 });
    const baum = h(
      "g",
      {},
      k.box(20, 10, 0, 260, 140, 6, 12),
      k.box(60, 26, 6, 180, 30, 8),
      h("path", { d: k.path3([
        [0, 0, 0],
        [10, 20, 30],
      ]) }),
      k.rect(k.FRONT(0, 0, 10), 20, 10, 2),
    );
    const werte = alleWerte(baum).join(" ");
    expect(werte).not.toMatch(/NaN|Infinity/);
    expect(k.bbox().viewBox).not.toMatch(/NaN|Infinity/);
  });
});
