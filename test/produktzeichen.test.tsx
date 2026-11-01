// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Produktzeichen } from "../src/Produktzeichen";
import { PIN_PFADE } from "../src/produktzeichen-formen";
import { PRODUKTZEICHEN, PRODUKTZEICHEN_NAMEN, optischeGroesse, produktzeichenDaten } from "../src/produktzeichen-verzeichnis";

// Produktzeichen: Server-HTML auf Papier und Nacht, ein Lime-Motiv je Zeichen,
// optische Größe aus `groesse`, unveränderte Bildmarke, Barrierefreiheit.

// Pfad aus dem String von import.meta.url: in jsdom ist `URL` die Klasse von jsdom (wie in bundle.test.ts).
const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..") + "/";
const lies = (pfad: string) => readFileSync(WURZEL + pfad, "utf8");

const SVG = "http://www.w3.org/2000/svg";
const LIME_KLASSEN = new Set(["a", "al", "gl"]);

function svgAus(html: string): SVGSVGElement {
  const huelle = document.createElement("div");
  huelle.innerHTML = html;
  const svg = huelle.querySelector("svg");
  if (!svg) throw new Error("kein <svg> im Markup");
  return svg;
}

function gruppe(markup: string): SVGGElement {
  const g = document.createElementNS(SVG, "g");
  g.innerHTML = markup;
  return g;
}

describe("Verzeichnis", () => {
  it("führt die 14 Zeichen in fester Reihenfolge", () => {
    expect(PRODUKTZEICHEN_NAMEN).toEqual([
      "onepager",
      "website",
      "feinschliff",
      "datei-anfrage",
      "kundenseite",
      "monatsbericht",
      "bewertungsseite",
      "erscheinungsbild",
      "google-profil",
      "google-suche",
      "ki-sichtbarkeit",
      "website-bereich",
      "pruefbericht",
      "kompakt-check",
    ]);
    for (const name of PRODUKTZEICHEN_NAMEN) expect(PRODUKTZEICHEN[name].titel.length, name).toBeGreaterThan(0);
  });
});

describe.each(PRODUKTZEICHEN_NAMEN)("%s", (name) => {
  it.each(["papier", "nacht"] as const)("rendert auf %s mit endlichem, passendem Bildausschnitt", (untergrund) => {
    const svg = svgAus(renderToString(<Produktzeichen name={name} untergrund={untergrund} />));
    expect(svg.getAttribute("class")).toContain(untergrund);
    expect(svg.getAttribute("width")).toBe("64");
    const box = (svg.getAttribute("viewBox") ?? "").split(" ").map(Number);
    expect(box).toHaveLength(4);
    for (const wert of box) expect(Number.isFinite(wert)).toBe(true);
    const verhaeltnis = box[2] / box[3];
    expect(verhaeltnis).toBeGreaterThanOrEqual(0.6);
    expect(verhaeltnis).toBeLessThanOrEqual(1.7);
    expect(svg.querySelectorAll("path").length).toBeGreaterThan(3);
  });

  it("hat genau eine Gruppe motiv; Lime-Klassen und #b5e545 stehen nur darin", () => {
    const { markup } = produktzeichenDaten(name);
    const g = gruppe(markup);
    const motive = g.querySelectorAll("g.motiv");
    expect(motive).toHaveLength(1);
    const motiv = motive[0];
    const draussen = [...g.querySelectorAll("*")].filter((el) => !motiv.contains(el));
    for (const el of draussen) {
      const klassen = (el.getAttribute("class") ?? "").split(/\s+/);
      expect(klassen.filter((k) => LIME_KLASSEN.has(k)), `${name}: ${el.outerHTML.slice(0, 80)}`).toEqual([]);
    }
    expect(motiv.querySelector(".a, .al, .gl, [fill='#b5e545']"), name).not.toBeNull();
    motiv.remove();
    expect(g.innerHTML.toLowerCase()).not.toContain("#b5e545");
  });
});

describe("optische Größe", () => {
  it.each([
    [55, "klein"],
    [56, "mittel"],
    [95, "mittel"],
    [96, "gross"],
  ] as const)("%i px ist %s", (groesse, klasse) => {
    expect(optischeGroesse(groesse)).toBe(klasse);
    const svg = svgAus(renderToString(<Produktzeichen name="feinschliff" groesse={groesse} />));
    const klassen = (svg.getAttribute("class") ?? "").split(" ");
    expect(klassen).toContain(klasse);
    expect(svg.getAttribute("width")).toBe(String(groesse));
    expect(svg.getAttribute("height")).toBe(String(groesse));
  });
});

describe("Bildmarke Pin", () => {
  it("die Pfade gleichen assets/pin.svg in Farbe und Form", () => {
    const datei = lies("assets/pin.svg");
    const ausDatei = [...datei.matchAll(/<path fill="([^"]+)" d="([^"]+)"\/>/g)].map((m) => ({ fill: m[1], d: m[2] }));
    expect(PIN_PFADE).toEqual(ausDatei);
  });

  it("steht im Google-Profil unverändert als Motiv, ohne Rand", () => {
    const g = gruppe(produktzeichenDaten("google-profil").markup);
    const pfade = [...g.querySelectorAll("g.motiv g[transform] path")].map((p) => ({ fill: p.getAttribute("fill"), d: p.getAttribute("d") }));
    expect(pfade).toEqual(PIN_PFADE);
    expect(g.querySelector("g.motiv g[transform] [stroke]")).toBeNull();
  });
});

describe("Barrierefreiheit", () => {
  it("ohne titel dekorativ", () => {
    const svg = svgAus(renderToString(<Produktzeichen name="onepager" />));
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("role")).toBeNull();
    expect(svg.getAttribute("aria-label")).toBeNull();
  });

  it("mit titel role=img und aria-label, der Titel steht nicht im Bild", () => {
    const titel = "Feinschliff Testtitel";
    const html = renderToString(<Produktzeichen name="feinschliff" titel={titel} />);
    const svg = svgAus(html);
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.getAttribute("aria-label")).toBe(titel);
    expect(svg.getAttribute("aria-hidden")).toBeNull();
    expect(svg.innerHTML).not.toContain(titel);
    expect(html.split(titel)).toHaveLength(2);
  });
});
