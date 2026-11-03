// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LOGO_INHALT, schriftzugGeometrie } from "../src/messlatte-schriftzug";
import { MesslatteSchriftzug } from "../src/MesslatteSchriftzug";
import { PRODUKTZEICHEN } from "../src/produktzeichen-verzeichnis";

// Schriftzug „Messlatte“: Verbindungsregel (Pillenmitte, Zeichenhöhe),
// Schutzzone, Mindestgrößen, Logo aus den Asset-Dateien, kein Text im Bild,
// Lime nur in Pille und Logo, Barrierefreiheit.

// Pfad aus dem String von import.meta.url: in jsdom ist `URL` die Klasse von jsdom (wie in bundle.test.ts).
const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..") + "/";
const lies = (pfad: string) => readFileSync(WURZEL + pfad, "utf8");

const LIME_KLASSEN = new Set(["a", "al", "gl", "fa"]);
const UNTERGRUENDE = ["papier", "nacht"] as const;

function svgAus(html: string): SVGSVGElement {
  const huelle = document.createElement("div");
  huelle.innerHTML = html;
  const svg = huelle.querySelector("svg");
  if (!svg) throw new Error("kein <svg> im Markup");
  return svg;
}

/** `translate(a b) scale(k)` als [a, b, k]. */
function transformation(wert: string | null): [number, number, number] {
  const m = /^translate\((-?[\d.]+) (-?[\d.]+)\) scale\(([\d.]+)\)$/.exec(wert ?? "");
  if (!m) throw new Error(`unerwartete Transformation: ${wert}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** Bildpunkte aus Pfaden der Engine (`M x y L x y … Z`). */
const punkte = (els: Iterable<Element>) =>
  [...els].flatMap((el) => [...(el.getAttribute("d") ?? "").matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])] as const));

const rahmen = (pkte: readonly (readonly [number, number])[]) => {
  const xs = pkte.map(([x]) => x);
  const ys = pkte.map(([, y]) => y);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};

/** Teile des gerenderten Schriftzugs in px des Wurzel-SVG. */
function vermiss(svg: SVGSVGElement) {
  const zeichen = svg.querySelector(":scope > g");
  if (!zeichen) throw new Error("kein Zeichen");
  const [tx, ty, k] = transformation(zeichen.getAttribute("transform"));
  const figur = rahmen(punkte(zeichen.querySelectorAll("path")));
  const pille = rahmen(punkte(zeichen.querySelectorAll("g.motiv path.a")));
  const [, grundlinie] = transformation(svg.querySelector(":scope > path")?.getAttribute("transform") ?? null);
  return {
    grundlinie,
    pillenMitteY: ((pille.y0 + pille.y1) / 2) * k + ty,
    zeichen: { x0: figur.x0 * k + tx, x1: figur.x1 * k + tx, y0: figur.y0 * k + ty, y1: figur.y1 * k + ty },
  };
}

describe("Verbindungsregel", () => {
  describe.each([14, 40, 64])("X = %i", (x) => {
    it("Geometrie: Zeichen 1,25 X hoch, links in der Schutzzone", () => {
      const g = schriftzugGeometrie({ versalhoehe: x });
      if (g.nurZeichen) throw new Error("unerwartet nur Zeichen");
      expect(Math.abs(g.zeichen.hoehe - 1.25 * x)).toBeLessThan(0.005 * x);
      expect(g.zeichen.x).toBeCloseTo(x / 2, 6);
    });

    it.each(UNTERGRUENDE)("auf %s: Pillenmitte auf halber Versalhöhe, Zeichenhöhe 1,25 X", (untergrund) => {
      const svg = svgAus(renderToString(<MesslatteSchriftzug untergrund={untergrund} versalhoehe={x} />));
      const m = vermiss(svg);
      expect(Math.abs(m.pillenMitteY - (m.grundlinie - x / 2))).toBeLessThan(0.005 * x);
      expect(Math.abs(m.zeichen.y1 - m.zeichen.y0 - 1.25 * x)).toBeLessThan(0.005 * x);
    });
  });
});

describe("Schutzzone", () => {
  it.each([
    [40, false, "papier"],
    [40, true, "papier"],
    [64, true, "nacht"],
    [14, false, "nacht"],
  ] as const)("X = %i, Logo %s, %s: jedes Teil mindestens ½ X vom Rand, eines genau", (x, mitLogo, untergrund) => {
    const svg = svgAus(renderToString(<MesslatteSchriftzug versalhoehe={x} mitLogo={mitLogo} untergrund={untergrund} />));
    const g = schriftzugGeometrie({ versalhoehe: x, mitLogo, untergrund });
    if (g.nurZeichen) throw new Error("unerwartet nur Zeichen");
    const [, , vbB, vbH] = (svg.getAttribute("viewBox") ?? "").split(" ").map(Number);
    const m = vermiss(svg);
    const teile = [m.zeichen, { x0: g.wort.x, x1: g.wort.x + g.wort.breite, y0: g.wort.y, y1: g.wort.y + g.wort.hoehe }];
    const logo = svg.querySelector(":scope > svg");
    expect(Boolean(logo)).toBe(mitLogo);
    if (logo) {
      const zahl = (a: string) => Number(logo.getAttribute(a));
      teile.push({ x0: zahl("x"), x1: zahl("x") + zahl("width"), y0: zahl("y"), y1: zahl("y") + zahl("height") });
    }
    const abstaende = teile.flatMap((t) => [t.x0, t.y0, vbB - t.x1, vbH - t.y1]);
    for (const a of abstaende) expect(a).toBeGreaterThanOrEqual(x / 2 - 0.01 * x);
    expect(Math.abs(Math.min(...abstaende) - x / 2)).toBeLessThan(0.005 * x);
  });
});

describe("Mindestgrößen", () => {
  it.each(UNTERGRUENDE)("auf %s: unter X = 32 ohne Logo, ab 32 mit", (untergrund) => {
    const ohne = svgAus(renderToString(<MesslatteSchriftzug untergrund={untergrund} versalhoehe={31} mitLogo />));
    expect(ohne.getAttribute("data-mit-logo")).toBe("false");
    expect(ohne.querySelector(":scope > svg")).toBeNull();
    expect(ohne.getAttribute("aria-label")).toBe("Messlatte");
    const mit = svgAus(renderToString(<MesslatteSchriftzug untergrund={untergrund} versalhoehe={32} mitLogo />));
    expect(mit.getAttribute("data-mit-logo")).toBe("true");
    const logo = mit.querySelector(":scope > svg");
    expect(logo?.getAttribute("viewBox")).toBe(LOGO_INHALT[untergrund === "nacht" ? "dunkel" : "hell"].viewBox);
    expect(mit.getAttribute("aria-label")).toBe("powerhandwerk Messlatte");
  });

  it.each(UNTERGRUENDE)("auf %s: unter X = 14 nur das Zeichen, ab 14 der Schriftzug", (untergrund) => {
    const g = schriftzugGeometrie({ versalhoehe: 13 });
    expect(g.nurZeichen).toBe(true);
    const klein = svgAus(renderToString(<MesslatteSchriftzug untergrund={untergrund} versalhoehe={13} mitLogo />));
    expect(klein.getAttribute("data-mit-logo")).toBeNull();
    expect(klein.querySelector(":scope > path")).toBeNull();
    expect(klein.getAttribute("width")).toBe(String(g.nurZeichen ? g.groesse : NaN));
    expect(klein.getAttribute("aria-label")).toBe("Messlatte");
    expect(klein.getAttribute("class")).toContain(untergrund);
    const voll = svgAus(renderToString(<MesslatteSchriftzug untergrund={untergrund} versalhoehe={14} />));
    expect(voll.getAttribute("data-mit-logo")).toBe("false");
    expect(voll.querySelectorAll(":scope > path")).toHaveLength(1);
  });

  it("das Zeichen allein ist mindestens 16 px", () => {
    const g = schriftzugGeometrie({ versalhoehe: 2 });
    expect(g.nurZeichen && g.groesse).toBe(16);
  });
});

describe("Logo", () => {
  const ohneIds = (datei: string) => {
    const roh = lies(datei);
    const start = roh.indexOf(">", roh.indexOf("<svg")) + 1;
    return roh.slice(start, roh.lastIndexOf("</svg>")).replace(/ (?:id|data-name)="[^"]*"/g, "");
  };
  const viewBox = (datei: string) => /<svg[^>]*viewBox="([^"]+)"/.exec(lies(datei))?.[1];

  it.each([
    ["hell", "assets/logo-powerhandwerk.svg"],
    ["dunkel", "assets/logo-powerhandwerk-dark.svg"],
  ] as const)("%s gleicht der Asset-Datei ohne id und data-name", (variante, datei) => {
    expect(LOGO_INHALT[variante].inhalt).toBe(ohneIds(datei));
    expect(LOGO_INHALT[variante].viewBox).toBe(viewBox(datei));
    expect(LOGO_INHALT[variante].inhalt).not.toMatch(/ id=| data-name=|<style|class=/);
  });

  it.each(UNTERGRUENDE)("auf %s färbt jede Form über fill, ohne class", (untergrund) => {
    const svg = svgAus(renderToString(<MesslatteSchriftzug untergrund={untergrund} versalhoehe={48} mitLogo />));
    const formen = svg.querySelectorAll(":scope > svg :is(path, rect, circle, ellipse, polygon, polyline, line)");
    expect(formen.length).toBeGreaterThan(5);
    for (const form of formen) {
      expect(form.getAttribute("fill"), form.outerHTML.slice(0, 60)).toMatch(/^#[0-9a-f]{3,6}$/i);
      expect(form.getAttribute("class")).toBeNull();
    }
    expect(svg.querySelector("style")).toBeNull();
  });

  it("zwei Schriftzüge auf einer Seite doppeln keine id", () => {
    const html = renderToString(
      <div>
        <MesslatteSchriftzug versalhoehe={48} mitLogo />
        <MesslatteSchriftzug untergrund="nacht" versalhoehe={48} mitLogo />
      </div>,
    );
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Inhalt", () => {
  it.each(UNTERGRUENDE)("auf %s: kein <text>, ein Pfad fürs Wort, Lime nur in Pille und Logo", (untergrund) => {
    const svg = svgAus(renderToString(<MesslatteSchriftzug untergrund={untergrund} versalhoehe={48} mitLogo />));
    expect(svg.querySelector("text")).toBeNull();
    expect(svg.querySelectorAll(":scope > path")).toHaveLength(1);
    const zeichen = svg.querySelector(":scope > g");
    const motiv = zeichen?.querySelectorAll("g.motiv");
    expect(motiv).toHaveLength(1);
    const logo = svg.querySelector(":scope > svg");
    for (const el of svg.querySelectorAll("*")) {
      const klassen = (el.getAttribute("class") ?? "").split(/\s+/);
      if (klassen.some((k) => LIME_KLASSEN.has(k))) expect(motiv?.[0].contains(el), el.outerHTML.slice(0, 60)).toBe(true);
      if ((el.getAttribute("fill") ?? "").toLowerCase() === "#b5e545") expect(logo?.contains(el)).toBe(true);
    }
    const ohneLogo = svg.cloneNode(true) as SVGSVGElement;
    ohneLogo.querySelector(":scope > svg")?.remove();
    expect(ohneLogo.outerHTML.toLowerCase()).not.toContain("#b5e545");
  });
});

describe("Barrierefreiheit", () => {
  it("role=img mit Standardtitel, nicht versteckt", () => {
    const svg = svgAus(renderToString(<MesslatteSchriftzug />));
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.getAttribute("aria-label")).toBe("Messlatte");
    expect(svg.getAttribute("aria-hidden")).toBeNull();
    expect(svg.getAttribute("focusable")).toBe("false");
  });

  it("eigener titel ersetzt den Standard, auch wenn nur das Zeichen steht", () => {
    for (const versalhoehe of [40, 10]) {
      const svg = svgAus(renderToString(<MesslatteSchriftzug versalhoehe={versalhoehe} mitLogo titel="Unser Standard" />));
      expect(svg.getAttribute("role")).toBe("img");
      expect(svg.getAttribute("aria-label")).toBe("Unser Standard");
    }
  });

  it("die Standardtitel tragen keine Prüf-Wörter", () => {
    const titel = [
      PRODUKTZEICHEN.messlatte.titel,
      svgAus(renderToString(<MesslatteSchriftzug />)).getAttribute("aria-label"),
      svgAus(renderToString(<MesslatteSchriftzug mitLogo />)).getAttribute("aria-label"),
      svgAus(renderToString(<MesslatteSchriftzug versalhoehe={10} />)).getAttribute("aria-label"),
    ];
    for (const t of titel) expect(t ?? "").not.toMatch(/geprüft|zertifiz|garantie|siegel/i);
  });
});
