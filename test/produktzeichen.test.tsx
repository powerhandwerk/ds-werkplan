// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { werkzeug } from "../src/leistungskarten-engine";
import { Produktzeichen } from "../src/Produktzeichen";
import { PIN_PFADE, strichFest, strichMal, zeichenBildFlaeche, zeichenBildLinie } from "../src/produktzeichen-formen";
import { PRODUKTZEICHEN, PRODUKTZEICHEN_NAMEN, optischeGroesse, produktzeichenDaten } from "../src/produktzeichen-verzeichnis";
import { PILLE_FAKTOR } from "../src/tokens";

// Produktzeichen: Server-HTML auf Papier und Nacht, ein Lime-Motiv je Zeichen,
// optische Größe aus `groesse`, unveränderte Bildmarke, Barrierefreiheit,
// flache Fassung der Messlatte unter 40 px.

// Pfad aus dem String von import.meta.url: in jsdom ist `URL` die Klasse von jsdom (wie in bundle.test.ts).
const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..") + "/";
const lies = (pfad: string) => readFileSync(WURZEL + pfad, "utf8");

const SVG = "http://www.w3.org/2000/svg";
const LIME_KLASSEN = new Set(["a", "al", "gl", "fa"]);

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
  it("führt die 15 Zeichen in fester Reihenfolge", () => {
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
      "messlatte",
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
    expect(motiv.querySelector(".a, .al, .gl, .fa, [fill='#b5e545']"), name).not.toBeNull();
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

describe("Stil-Attribute der Bausteine", () => {
  const punkte = [[0, 0], [1, 1]] as const;
  it("Bildpfade nehmen nur harmlose Attribute an", () => {
    expect(() => zeichenBildLinie(punkte, "k", 'onload="alert(1)"')).toThrow();
    expect(() => zeichenBildFlaeche(punkte, "k", 'style="x" onclick="y"')).toThrow();
    expect(zeichenBildLinie(punkte, "k", strichFest(1.2))).toContain('style="stroke-width:1.2"');
  });
  it("Strich-Zusätze können das style-Attribut nicht verlassen", () => {
    expect(() => strichMal(1, 'x" onload="alert(1)')).toThrow();
    expect(() => strichFest(1, "<script>")).toThrow();
    expect(strichMal(1.5, "opacity:0.6")).toBe('style="--m:1.5;opacity:0.6"');
  });
});

describe("Messlatte: flache Fassung unter 40 px", () => {
  const svgFuer = (groesse: number, untergrund: "papier" | "nacht" = "papier") =>
    svgAus(renderToString(<Produktzeichen name="messlatte" untergrund={untergrund} groesse={groesse} />));
  const klassenVon = (el: Element) => (el.getAttribute("class") ?? "").split(/\s+/);
  const strichDesKoerpers = (svg: SVGSVGElement) => svg.querySelector("rect.fg")?.getAttribute("style");

  // Erwartung je Größe: flach oder Iso, Strich des Körpers, Zahl der Teilstriche.
  const ERWARTUNG: Record<number, { flach: boolean; strich?: string; teilung?: number }> = {
    40: { flach: false },
    39: { flach: true, strich: "stroke-width:1.1", teilung: 7 },
    28: { flach: true, strich: "stroke-width:1.1", teilung: 7 },
    27: { flach: true, strich: "stroke-width:1.1", teilung: 0 },
    21: { flach: true, strich: "stroke-width:1.1", teilung: 0 },
    20: { flach: true, strich: "stroke-width:1.25", teilung: 0 },
  };
  const GROESSEN = Object.keys(ERWARTUNG).map(Number);

  it.each([
    ["groß nach klein", [...GROESSEN].sort((a, b) => b - a)],
    ["klein nach groß", [...GROESSEN].sort((a, b) => a - b)],
  ])("Grenzen 39/40, 27/28 und 20/21 px, Aufrufe %s", (_, folge) => {
    for (const groesse of folge) {
      const soll = ERWARTUNG[groesse];
      const svg = svgFuer(groesse);
      expect(svg.getAttribute("width"), `${groesse}`).toBe(String(groesse));
      if (!soll.flach) {
        expect(svg.getAttribute("viewBox"), `${groesse}`).not.toBe("0 0 24 24");
        expect(klassenVon(svg), `${groesse}`).not.toContain("flach");
        expect(svg.querySelector(".fg, .fs, .fl, .fa"), `${groesse}`).toBeNull();
        continue;
      }
      expect(svg.getAttribute("viewBox"), `${groesse}`).toBe("0 0 24 24");
      expect(klassenVon(svg), `${groesse}`).toContain("flach");
      expect(strichDesKoerpers(svg), `${groesse}`).toBe(soll.strich);
      expect(svg.querySelectorAll("line.fl"), `${groesse}`).toHaveLength(soll.teilung ?? 0);
    }
  });

  it.each(["papier", "nacht"] as const)("auf %s je Stufe genau ein Lime-Teil, in g.motiv, ohne Glühen", (untergrund) => {
    for (const groesse of [16, 24, 32]) {
      const svg = svgFuer(groesse, untergrund);
      const lime = [...svg.querySelectorAll("*")].filter((el) => klassenVon(el).some((k) => LIME_KLASSEN.has(k)));
      expect(lime, `${groesse}`).toHaveLength(1);
      expect(klassenVon(lime[0]), `${groesse}`).toContain("fa");
      expect(lime[0].parentElement?.matches("g.motiv"), `${groesse}`).toBe(true);
      expect(svg.querySelectorAll("g.motiv"), `${groesse}`).toHaveLength(1);
      expect(svg.querySelector(".gl"), `${groesse}`).toBeNull();
      expect(svg.innerHTML.toLowerCase(), `${groesse}`).not.toContain("#b5e545");
    }
  });

  it("ein Zeichen ohne flache Fassung bleibt bei 32 px Iso", () => {
    const svg = svgAus(renderToString(<Produktzeichen name="feinschliff" groesse={32} />));
    expect(svg.getAttribute("viewBox")).toBe(produktzeichenDaten("feinschliff").viewBox);
    expect(svg.getAttribute("viewBox")).not.toBe("0 0 24 24");
    expect(klassenVon(svg)).not.toContain("flach");
    expect(produktzeichenDaten("feinschliff", 32)).toBe(produktzeichenDaten("feinschliff", 64));
  });

  it.each([16, 24, 32])("die Pille rundet bei %i px wie im Logo", (groesse) => {
    const pille = svgFuer(groesse).querySelector("g.motiv rect.fa");
    const rx = Number(pille?.getAttribute("rx"));
    const hoehe = Number(pille?.getAttribute("height"));
    expect(Math.abs(rx / hoehe - PILLE_FAKTOR)).toBeLessThan(0.005);
  });

  it("die Pille des Iso-Modells rundet wie im Logo", () => {
    const g = gruppe(produktzeichenDaten("messlatte").markup);
    const d = g.querySelector("g.motiv path.a")?.getAttribute("d") ?? "";
    const bild = [...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])] as const);
    expect(bild.length).toBeGreaterThan(8);
    // Bildpunkte zurück in Flächenkoordinaten der Vorderseite (u entlang x, v entlang z)
    const { P } = werkzeug(null);
    const [ox, oy] = P(0, 0, 0);
    const [ux, uy] = P(1, 0, 0).map((v, i) => v - [ox, oy][i]);
    const [vx, vy] = P(0, 0, 1).map((v, i) => v - [ox, oy][i]);
    const det = ux * vy - uy * vx;
    const flaeche = bild.map(([x, y]) => [((x - ox) * vy - (y - oy) * vx) / det, ((y - oy) * ux - (x - ox) * uy) / det] as const);
    const us = flaeche.map(([u]) => u);
    const vs = flaeche.map(([, v]) => v);
    const breite = Math.max(...us) - Math.min(...us);
    const hoehe = Math.max(...vs) - Math.min(...vs);
    const oben = flaeche.filter(([, v]) => v > Math.max(...vs) - 0.015).map(([u]) => u);
    const radius = (breite - (Math.max(...oben) - Math.min(...oben))) / 2;
    expect(Math.abs(radius / hoehe - PILLE_FAKTOR)).toBeLessThan(0.02);
  });
});
