// @vitest-environment node
import { describe, expect, it } from "vitest";
import { FLAECHEN, GRADE, NACHT_HELL_GRUND, RUNDUNGEN, rolleCss, type WpRolle } from "../src/tokens";
import { STELLSCHRAUBEN, cssDateien, lies, ohneKommentare, regeln, werte } from "./css-hilfe";

// Regeln für das CSS im Paket: Jede Variable ist definiert, Schriftgrößen und
// Rundungen laufen über Tokens, die Flächenrollen stehen nur in den
// Flächenklassen und folgen FLAECHEN aus src/tokens.ts.

const MODULE = cssDateien().filter((pfad) => pfad.endsWith(".module.css"));

describe("Variablen", () => {
  it("jedes var(--x) in src/*.css ist im Paket definiert", () => {
    const definiert = new Set<string>();
    for (const pfad of cssDateien()) {
      const css = ohneKommentare(lies(pfad));
      for (const treffer of css.matchAll(/(--[\w-]+)\s*:/g)) definiert.add(treffer[1]);
      for (const treffer of css.matchAll(/@property\s+(--[\w-]+)/g)) definiert.add(treffer[1]);
    }
    const fehlt: string[] = [];
    for (const pfad of cssDateien()) {
      // Eine Stellschraube gilt nur mit Rückfallwert als versorgt: var(--x, Standard).
      for (const treffer of ohneKommentare(lies(pfad)).matchAll(/var\(\s*(--[\w-]+)\s*(,?)/g)) {
        const stellschraube = STELLSCHRAUBEN.has(treffer[1]) && treffer[2] === ",";
        if (!definiert.has(treffer[1]) && !stellschraube) fehlt.push(`${pfad}: ${treffer[1]}`);
      }
    }
    expect(fehlt).toEqual([]);
  });

  it("nur werkplan.module.css setzt Flächenrollen --wp-*", () => {
    const fremd: string[] = [];
    for (const pfad of MODULE.filter((p) => p !== "src/werkplan.module.css")) {
      for (const regel of regeln(lies(pfad))) {
        for (const name of regel.deklarationen.keys()) {
          if (name.startsWith("--wp-")) fremd.push(`${pfad}: ${regel.selektoren.join(", ")} ${name}`);
        }
      }
    }
    expect(fremd).toEqual([]);
  });

  it("die Flächenrollen --wp-* stehen nie auf :root", () => {
    expect(lies("src/tokens.css")).not.toMatch(/--wp-/);
    for (const pfad of cssDateien()) {
      for (const regel of regeln(lies(pfad))) {
        const aufRoot = regel.selektoren.some((s) => s === ":root" || s === "html");
        const setztWp = [...regel.deklarationen.keys()].some((name) => name.startsWith("--wp-"));
        expect(aufRoot && setztWp, `${pfad}: ${regel.selektoren.join(", ")}`).toBe(false);
      }
    }
  });
});

describe("Schriftgrade und Rundungen", () => {
  const GRAD = `var\\(--grad-(?:${Object.keys(GRADE).join("|")})\\)`;
  const SCHRIFTGROESSE = [new RegExp(`^${GRAD}$`), new RegExp(`^clamp\\(${GRAD}, [\\d.]+vw, ${GRAD}\\)$`), /^inherit$/, /^[\d.]+em$/];
  const RUNDUNG = [
    new RegExp(`^var\\(--rund-(?:${Object.keys(RUNDUNGEN).join("|")})\\)$`),
    /^calc\((?:[\d.]+px|var\(--[\w-]+\)) \* var\(--rund-pille-faktor\)\)$/,
    /^inherit$/,
  ];

  it.each(MODULE)("%s: jede font-size liest einen Schriftgrad", (pfad) => {
    const frei = regeln(lies(pfad))
      .map((r) => r.deklarationen.get("font-size"))
      .filter((wert): wert is string => wert !== undefined && !SCHRIFTGROESSE.some((muster) => muster.test(wert)));
    expect(frei).toEqual([]);
  });

  it.each(MODULE)("%s: jede border-radius folgt einer Rundungsrolle", (pfad) => {
    const frei = regeln(lies(pfad))
      .map((r) => r.deklarationen.get("border-radius"))
      .filter((wert): wert is string => wert !== undefined && !RUNDUNG.some((muster) => muster.test(wert)));
    expect(frei).toEqual([]);
  });
});

describe("Farbwerte", () => {
  // Farben gehören nach src/tokens.ts. Was die gehobenen Bausteine heute noch
  // als festen Wert tragen (Weiß, Schatten, Warnfläche, Fehler auf Nacht), ist
  // hier je Datei eingefroren und darf nur schrumpfen; neue Werte kommen als
  // Token. Sinkt eine Zahl, die Liste nachziehen.
  const LITERAL = /#[0-9a-f]{3,8}\b|\b(?:oklch|oklab|rgba?|hsla?)\(|\b(?:white|black)\b/gi;
  const BESTAND: Record<string, number> = {
    "src/arbeitsflaeche.module.css": 6,
    "src/bausteine.module.css": 8,
    "src/eingabefeld.module.css": 1,
    "src/kapitel-leiste.module.css": 2,
    "src/kopieren-knopf.module.css": 1,
    "src/lichtkante.module.css": 7,
    "src/reiter.module.css": 1,
    "src/ziffernfelder.module.css": 1,
  };

  it.each(MODULE)("%s: keine neuen Farbwerte neben den Tokens", (pfad) => {
    const zahl = ohneKommentare(lies(pfad)).match(LITERAL)?.length ?? 0;
    expect(zahl).toBe(BESTAND[pfad] ?? 0);
  });
});

describe("Flächen in werkplan.module.css folgen FLAECHEN", () => {
  const CSS = lies("src/werkplan.module.css");
  const ROLLEN_OHNE_FLAECHE = (Object.keys(FLAECHEN.papier) as WpRolle[]).filter((r) => r !== "grund" && r !== "raster");

  it.each([
    ["papier", ".aufPapier"],
    ["nacht", ".aufNacht"],
  ] as const)("%s: Rollen der Klasse %s", (untergrund, selektor) => {
    const css = werte(CSS, selektor);
    for (const rolle of ROLLEN_OHNE_FLAECHE) {
      expect(css[`--wp-${rolle}`], `${selektor} --wp-${rolle}`).toBe(rolleCss(FLAECHEN[untergrund][rolle]));
    }
  });

  it.each([
    ["papier", ".papier"],
    ["nacht", ".nacht"],
  ] as const)("%s: Grund, Schrift und Raster der Fläche %s", (untergrund, selektor) => {
    const css = werte(CSS, selektor);
    expect(css["background-color"]).toBe(rolleCss(FLAECHEN[untergrund].grund));
    expect(css.color).toBe(rolleCss(FLAECHEN[untergrund].stark));
    expect(css["--wp-raster"]).toBe(rolleCss(FLAECHEN[untergrund].raster));
  });

  it(".nachtHell ist Nacht mit hellerem Grund", () => {
    const css = werte(CSS, ".nachtHell");
    expect(css["background-color"]).toBe(`var(--${NACHT_HELL_GRUND})`);
    expect(css["--wp-stark"]).toBe(rolleCss(FLAECHEN.nacht.stark));
  });
});
