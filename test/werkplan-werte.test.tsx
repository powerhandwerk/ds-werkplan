import type { JSX } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  BanIcon,
  CalendarClockIcon,
  CircleCheckFilledIcon,
  CircleDashedIcon,
  CircleIcon,
  CircleMinusIcon,
  FileTextIcon,
  HourglassIcon,
} from "../src/icons";
import {
  FLAECHEN_TOKENS,
  ICON_VIEWBOX,
  WERKPLAN_ICONS,
  type WerkplanIconName,
  farbe,
  WERKPLAN_MASSE,
  flaechenFarben,
} from "../src/werte";
import { FARBEN, FLAECHEN, MASSE, hexVon, type FarbName } from "../src/tokens";

// Gemeinsame Werte für Web und PDF (Monatsbericht v3, Z1, WB-4402e476): keine
// eigene Hex-Tabelle, Farben und Maße aus src/tokens.ts, Icon-Pfade an einer
// Stelle. Den Abgleich der Hex-Werte mit dem Admin macht test/tokens.test.ts.

const TOKEN_HEX = new Set((Object.keys(FARBEN) as FarbName[]).map((name) => hexVon(name)));

describe("Werkplan-Farben", () => {
  it("liefert Hex-Werte aus src/tokens.ts", () => {
    expect(farbe("--ink-950")).toBe(hexVon("ink-950"));
    expect(farbe("--ink-950")).toMatch(/^#[0-9a-f]{6}$/);
    expect(farbe("--lime")).toBe("#b5e545");
  });

  it("wirft bei einem unbekannten Token, statt still eine Farbe zu raten", () => {
    expect(() => farbe("--ink-450")).toThrow(/--ink-450 steht nicht in src\/tokens\.ts/);
  });

  it("jeder Eintrag in FLAECHEN_TOKENS entspricht FLAECHEN aus src/tokens.ts", () => {
    for (const untergrund of ["nacht", "papier"] as const) {
      for (const [rolle, token] of Object.entries(FLAECHEN_TOKENS[untergrund])) {
        const quelle = FLAECHEN[untergrund][rolle as keyof (typeof FLAECHEN)["papier"]];
        expect(token, `${untergrund}.${rolle}`).toBe(`--${quelle.farbe}`);
      }
    }
  });

  it("WERKPLAN_MASSE sind die Maße aus src/tokens.ts", () => {
    expect(WERKPLAN_MASSE).toBe(MASSE);
  });

  it("jede Flächen-Rolle ist ein Hex-Wert aus src/tokens.ts", () => {
    for (const untergrund of ["nacht", "papier"] as const) {
      const werte = flaechenFarben(untergrund);
      expect(Object.keys(werte).sort()).toEqual(Object.keys(FLAECHEN_TOKENS[untergrund]).sort());
      for (const hex of Object.values(werte)) expect(TOKEN_HEX.has(hex)).toBe(true);
    }
  });
});

describe("Werkplan-Icons", () => {
  const namen = Object.keys(WERKPLAN_ICONS) as WerkplanIconName[];

  it("hat die acht Icons aus Step 16a", () => {
    expect(namen.sort()).toEqual(
      [
        "ban",
        "calendar-clock",
        "circle",
        "circle-check-gefuellt",
        "circle-dashed",
        "circle-minus",
        "file-text",
        "hourglass",
      ].sort(),
    );
  });

  it("jedes Icon hat Elemente innerhalb der viewBox", () => {
    for (const name of namen) {
      const elemente = WERKPLAN_ICONS[name];
      expect(elemente.length, name).toBeGreaterThan(0);
      for (const el of elemente) {
        if (el.art === "pfad") {
          expect(el.d.trim().length, name).toBeGreaterThan(0);
        } else {
          expect(el.cx - el.r, name).toBeGreaterThanOrEqual(0);
          expect(el.cx + el.r, name).toBeLessThanOrEqual(ICON_VIEWBOX);
          expect(el.cy - el.r, name).toBeGreaterThanOrEqual(0);
          expect(el.cy + el.r, name).toBeLessThanOrEqual(ICON_VIEWBOX);
        }
      }
    }
  });

  const WEB: [WerkplanIconName, (p: { size?: number }) => JSX.Element][] = [
    ["circle", CircleIcon],
    ["circle-check-gefuellt", CircleCheckFilledIcon],
    ["circle-minus", CircleMinusIcon],
    ["circle-dashed", CircleDashedIcon],
    ["calendar-clock", CalendarClockIcon],
    ["hourglass", HourglassIcon],
    ["ban", BanIcon],
    ["file-text", FileTextIcon],
  ];

  it.each(WEB)("Web-Icon %s zeichnet genau die Pfade aus werte.ts", (name, Komponente) => {
    const markup = renderToStaticMarkup(<Komponente size={20} />);
    expect(markup).toContain('viewBox="0 0 24 24"');
    expect(markup).toContain('aria-hidden="true"');
    const pfade = [...markup.matchAll(/<path d="([^"]+)"/g)].map((t) => t[1]);
    const erwartet = WERKPLAN_ICONS[name].flatMap((el) => (el.art === "pfad" ? [el.d] : []));
    expect(pfade).toEqual(erwartet);
    const kreise = (markup.match(/<circle /g) ?? []).length;
    expect(kreise).toBe(WERKPLAN_ICONS[name].filter((el) => el.art === "kreis").length);
  });

  it("der gefüllte Kreis ist gefüllt, sein Haken steht in der Gegenfarbe", () => {
    const markup = renderToStaticMarkup(<CircleCheckFilledIcon />);
    expect(markup).toMatch(/<circle [^>]*fill="currentColor"/);
    expect(markup).toMatch(/<path d="m9 12 2 2 4-4" stroke="var\(--ink-050\)"/);
  });
});
