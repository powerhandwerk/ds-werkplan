// @vitest-environment node
import { describe, expect, it } from "vitest";
import { LEISTUNGSKARTEN_BEISPIELE, LEISTUNGSKARTEN_MUSTER } from "../src/leistungskarten-beispiele";
import { ruheWert, vermesse, zeichne, zeichneRuhe } from "../src/leistungskarten-engine";

// Die zwei Beispielszenen von Stil A. Regeln des Stils: eine Geste je Figur
// (t von 0 nach 1), Lime nur über die Klassen a, al, ag (gl als Zusatz) und
// als ein Motiv, das aus mehreren Flächen bestehen darf.

const LIME = new Set(["a", "al", "ag"]);
/** Größter Abstand zweier Lime-Flächen desselben Motivs, in Bildeinheiten. */
const MOTIV_ABSTAND = 4;

type Teil = { klassen: string[]; box: [number, number, number, number] };

/** Elemente mit Klasse und ihrem Rechteck im Bild (Pfade aus M/L-Punkten, Kreise aus Mittelpunkt und Radius). */
function teile(markup: string): Teil[] {
  const aus: Teil[] = [];
  for (const [, tag, attribute] of markup.matchAll(/<(path|circle)\b([^>]*)\/>/g)) {
    const klassen = /class="([^"]*)"/.exec(attribute)?.[1].split(/\s+/) ?? [];
    let xs: number[] = [];
    let ys: number[] = [];
    if (tag === "path") {
      const zahlen = (/\bd="([^"]*)"/.exec(attribute)?.[1] ?? "").match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
      xs = zahlen.filter((_, i) => i % 2 === 0);
      ys = zahlen.filter((_, i) => i % 2 === 1);
    } else {
      const wert = (name: string) => Number(new RegExp(`\\b${name}="([^"]*)"`).exec(attribute)?.[1]);
      const r = wert("r");
      xs = [wert("cx") - r, wert("cx") + r];
      ys = [wert("cy") - r, wert("cy") + r];
    }
    aus.push({ klassen, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] });
  }
  return aus;
}

const nah = (a: Teil["box"], b: Teil["box"]) =>
  a[0] - MOTIV_ABSTAND <= b[2] && b[0] - MOTIV_ABSTAND <= a[2] && a[1] - MOTIV_ABSTAND <= b[3] && b[1] - MOTIV_ABSTAND <= a[3];

/** Zahl der Gruppen, die die Lime-Teile bilden, wenn nahe Teile zusammengehören. */
function motive(lime: Teil[]): number {
  const gruppe = lime.map((_, i) => i);
  const wurzel = (i: number): number => (gruppe[i] === i ? i : (gruppe[i] = wurzel(gruppe[i])));
  for (let i = 0; i < lime.length; i++)
    for (let j = i + 1; j < lime.length; j++) if (nah(lime[i].box, lime[j].box)) gruppe[wurzel(i)] = wurzel(j);
  return new Set(lime.map((_, i) => wurzel(i))).size;
}

describe.each(Object.entries(LEISTUNGSKARTEN_BEISPIELE))("Beispiel %s", (_name, szene) => {
  const ruhe = zeichneRuhe(szene);
  const ende = zeichne(szene, { ...ruheWert(szene), t: 1 });

  it("hat Proben für t 0 und 1", () => {
    const t = szene.proben.map((p) => p.t);
    expect(t).toContain(0);
    expect(t).toContain(1);
  });

  it("vermisst einen endlichen Bildausschnitt und zeichnet ohne NaN", () => {
    const teileViewBox = vermesse(szene).split(" ").map(Number);
    expect(teileViewBox).toHaveLength(4);
    for (const v of teileViewBox) expect(Number.isFinite(v)).toBe(true);
    for (const markup of [ruhe, ende]) {
      expect(markup).toContain("<path");
      expect(markup).not.toMatch(/NaN|Infinity/);
    }
  });

  it("die Geste verändert das Bild", () => {
    expect(ende).not.toBe(ruhe);
  });

  it("trägt keine Farben im Markup, nur Klassen", () => {
    for (const markup of [ruhe, ende]) expect(markup).not.toMatch(/\b(?:fill|stroke)=|var\(|#[0-9a-f]{3}/i);
  });

  it("Lime nur über a, al, ag; gl nur als Zusatz an Lime", () => {
    for (const markup of [ruhe, ende]) {
      for (const { klassen } of teile(markup)) {
        if (klassen.includes("gl")) expect(klassen.some((k) => LIME.has(k)), klassen.join(" ")).toBe(true);
      }
    }
    expect(teile(ende).some((t) => t.klassen.some((k) => LIME.has(k)))).toBe(true);
  });

  it("die Lime-Teile bilden ein Motiv", () => {
    for (const markup of [ruhe, ende]) {
      const lime = teile(markup).filter((t) => t.klassen.some((k) => LIME.has(k)));
      if (lime.length > 0) expect(motive(lime)).toBe(1);
    }
  });
});

it("Gegenprobe: zwei weit getrennte Lime-Teile sind zwei Motive, nahe eins", () => {
  const teil = (x: number): Teil => ({ klassen: ["a"], box: [x, 0, x + 5, 5] });
  expect(motive([teil(0), teil(8)])).toBe(1);
  expect(motive([teil(0), teil(40)])).toBe(2);
});

describe("Musterkarten", () => {
  it("verweisen nur auf die Beispielszenen, je eine", () => {
    expect(LEISTUNGSKARTEN_MUSTER.map((k) => k.szene).sort()).toEqual(Object.keys(LEISTUNGSKARTEN_BEISPIELE).sort());
  });

  it("Texte ohne Gedankenstriche und ohne Preise", () => {
    for (const karte of LEISTUNGSKARTEN_MUSTER) {
      const text = [karte.titel, karte.teaser, karte.nr ?? "", karte.schliesst ?? ""].join(" ");
      expect(text).not.toMatch(/[–—€]/);
    }
  });
});
