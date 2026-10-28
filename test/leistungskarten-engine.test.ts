// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  deck,
  ebeneAusBild,
  naehere,
  ruheWert,
  TAU,
  TEXT_ZEICHENBREITE,
  vermesse,
  werkzeug,
  zeichne,
  zeichneRuhe,
  type Mess,
  type Szene,
  type SzenenWert,
} from "../src/leistungskarten-engine";
import { A0, uhrWinkel } from "../src/leistungskarten-formen";

// Zeichen-Engine der Leistungskarten (Stil A): rein, deterministisch, ohne
// Layout. Neu gegenüber der Website: text() escapt, was ins SVG geht.

/** Kleine Szene mit Beschriftung und Zeiger, damit alle Werkzeuge vorkommen. */
const PROBE: Szene = {
  start: () => ({ t: 0, px: 0.5 }),
  ruhe: { t: 0, px: 0.5 },
  proben: [{ t: 0, px: 0 }, { t: 1, px: 1 }],
  zeichne(s, w) {
    let o = w.flaeche([[0, 0, 0], [20 + 10 * (s.px ?? 0), 0, 0], [20, 20, 0]], "f");
    o += w.linie([[0, 0, 0], [0, 0, 10 * s.t]], "l");
    o += w.staub([[5, 5, 5]]);
    o += w.text([10, 10, 0], 2, 3, "Muster", "lbl");
    return o;
  },
};

describe("Vermessen und Ruhezustand", () => {
  it("vermesse rechnet den Bildausschnitt deterministisch aus den Proben, mit Rand 12", () => {
    const viewBox = vermesse(PROBE);
    expect(vermesse(PROBE)).toBe(viewBox);
    const teile = viewBox.split(" ").map(Number);
    expect(teile).toHaveLength(4);
    for (const v of teile) expect(Number.isFinite(v)).toBe(true);

    const mess: Mess = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    const w = werkzeug(mess);
    for (const p of PROBE.proben) PROBE.zeichne({ ...ruheWert(PROBE), ...p, gepr: 0 }, w);
    const erwartet = [mess.x0 - 12, mess.y0 - 12, mess.x1 - mess.x0 + 24, mess.y1 - mess.y0 + 24];
    teile.forEach((v, i) => expect(v).toBeCloseTo(erwartet[i], 1));
  });

  it.each([
    ["start", 0, 1],
    ["middle", -0.5, 0.5],
    ["end", -1, 0],
  ] as const)("text() mit Anker %s misst die Textbreite auf der richtigen Seite", (anker, links, rechts) => {
    const mess: Mess = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    const w = werkzeug(mess);
    const [x, y] = w.P(0, 0, 0);
    w.text([0, 0, 0], 0, 0, "Wärmepumpe", "lbl", "", anker);
    const breite = "Wärmepumpe".length * TEXT_ZEICHENBREITE;
    expect(mess.x0).toBeCloseTo(x + links * breite, 5);
    expect(mess.x1).toBeCloseTo(x + rechts * breite, 5);
    // Oberlänge: der Text ragt über die Grundlinie hinaus.
    expect(mess.y0).toBeLessThan(y);
    expect(mess.y1).toBeGreaterThan(y);
  });

  it("zeichneRuhe ist deterministisch und gleich zeichne im Ruhewert", () => {
    expect(zeichneRuhe(PROBE)).toBe(zeichneRuhe(PROBE));
    expect(zeichneRuhe(PROBE)).toBe(zeichne(PROBE, ruheWert(PROBE)));
    expect(ruheWert(PROBE)).toEqual({ t: 0, px: 0.5 });
  });
});

describe("naehere", () => {
  it("springt bei reduzierter Bewegung sofort ins Ziel und lässt clk und gepr unberührt", () => {
    const wert: SzenenWert = { t: 0, px: 0, clk: 3, gepr: 5 };
    const ziel: SzenenWert = { t: 1, px: 0.8, clk: 0, gepr: 0 };
    expect(naehere(wert, ziel, true)).toBe(true);
    expect(wert).toEqual({ t: 1, px: 0.8, clk: 3, gepr: 5 });
    expect(naehere(wert, ziel, true)).toBe(false);
  });

  it("nähert sich ohne reduzierte Bewegung schrittweise", () => {
    const wert: SzenenWert = { t: 0 };
    naehere(wert, { t: 1 }, false);
    expect(wert.t).toBeCloseTo(0.1, 10);
  });

  describe("der Uhrzeiger nimmt den kürzeren Weg", () => {
    const STUNDE = TAU / 24;
    const uhr = (stunde: number) => A0 + stunde * STUNDE;
    /** Abstand zweier Winkel auf dem Kreis, 0 bis π. */
    const abstand = (a: number, b: number) => {
      const d = (((a - b) % TAU) + TAU) % TAU;
      return Math.min(d, TAU - d);
    };

    it.each([
      ["23 → 0 Uhr", 23, 0, 1],
      ["0 → 23 Uhr", 0, 23, -1],
    ] as const)("%s: eine Stunde in die richtige Richtung, nicht fast eine Runde zurück", (_, von, nach, richtung) => {
      const wert: SzenenWert = { t: 0, ang: uhr(von) };
      const ziel: SzenenWert = { t: 0, ang: uhr(nach) };
      naehere(wert, ziel, false);
      expect(wert.ang).toBeCloseTo(uhr(von) + richtung * 0.16 * STUNDE, 10);

      // Jeder weitere Schritt verkürzt den Abstand, am Ende steht genau das Ziel.
      let vorher = abstand(wert.ang ?? NaN, uhr(nach));
      let schritte = 0;
      while (naehere(wert, ziel, false)) {
        const jetzt = abstand(wert.ang ?? NaN, uhr(nach));
        expect(jetzt).toBeLessThan(vorher);
        vorher = jetzt;
        expect(++schritte).toBeLessThan(100);
      }
      expect(wert.ang).toBe(uhr(nach));
    });

    it("bei genau einer halben Runde dreht er vorwärts: Differenz auf (−π, π]", () => {
      for (const soll of [A0 + Math.PI, A0 - Math.PI]) {
        const wert: SzenenWert = { t: 0, ang: A0 };
        naehere(wert, { t: 0, ang: soll }, false);
        expect(wert.ang, String(soll)).toBeCloseTo(A0 + 0.16 * Math.PI, 10);
      }
    });

    it("nur ang läuft im Kreis, andere Werte ziehen geradlinig", () => {
      const wert: SzenenWert = { t: 0, px: 0 };
      naehere(wert, { t: 10, px: -10 }, false);
      expect(wert.t).toBeCloseTo(1, 10);
      expect(wert.px).toBeCloseTo(-1, 10);
    });
  });
});

describe("Projektion", () => {
  it("ebeneAusBild kehrt die Projektion auf der Ebene z = 0 um", () => {
    const { P } = werkzeug(null);
    for (const [x, y] of [[0, 0], [12, -7], [-30, 44], [70.5, 25.25]]) {
      const [bx, by] = P(x, y, 0);
      const [x2, y2] = ebeneAusBild(bx, by);
      expect(x2).toBeCloseTo(x, 9);
      expect(y2).toBeCloseTo(y, 9);
    }
  });

  it("uhrWinkel rastert auf volle Stunden ab 0 Uhr", () => {
    const schritt = (Math.PI * 2) / 24;
    const rest = ((((uhrWinkel(1, 0.3) - A0) / schritt) % 1) + 1) % 1;
    expect(Math.min(rest, 1 - rest)).toBeLessThan(1e-9);
  });
});

describe("text() escapt, was ins SVG geht", () => {
  const ANGRIFF = "<img src=x onerror=alert(1)>";
  const { text } = werkzeug(null);

  it("Inhalt", () => {
    const markup = text([0, 0, 0], 0, 0, ANGRIFF, "lbl");
    expect(markup).not.toContain("<img");
    expect(markup).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("Klasse", () => {
    const markup = text([0, 0, 0], 0, 0, "Muster", `x" ${ANGRIFF}`);
    expect(markup).not.toContain("<img");
    expect(markup).toContain('class="x&quot; &lt;img src=x onerror=alert(1)&gt;"');
  });

  it("Anführungszeichen und Ampersand im Inhalt", () => {
    expect(text([0, 0, 0], 0, 0, `A & B 'c' "d"`, "lbl")).toContain(">A &amp; B &#39;c&#39; &quot;d&quot;</text>");
  });

  it("stil nimmt deck() an und weist alles andere ab", () => {
    expect(text([0, 0, 0], 0, 0, "Muster", "lbl", deck(0.5))).toContain('style="opacity:0.500"');
    for (const boese of ["onmouseover=alert(1)", 'onload="alert(1)"', `style="x"><img src=x onerror=alert(1)>`]) {
      expect(() => text([0, 0, 0], 0, 0, "Muster", "lbl", boese), boese).toThrow(/stil/);
    }
  });

  it("die Textbreite beim Vermessen zählt den Inhalt, nicht das Escapete", () => {
    const messen = (inhalt: string) => {
      const mess: Mess = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
      werkzeug(mess).text([0, 0, 0], 0, 0, inhalt, "lbl");
      return mess.x1;
    };
    expect(messen("<<<<")).toBe(messen("abcd"));
  });
});

describe("flaeche() und linie() behandeln Klasse und stil wie text()", () => {
  const ANGRIFF = "<img src=x onerror=alert(1)>";
  const { flaeche, linie } = werkzeug(null);
  const PUNKTE = [[0, 0, 0], [10, 0, 0], [10, 10, 0]];

  for (const [name, zeichne] of [["flaeche", flaeche], ["linie", linie]] as const) {
    it(`${name}: Klasse wird escapt`, () => {
      const markup = zeichne(PUNKTE, ANGRIFF);
      expect(markup).not.toContain("<img");
      expect(markup).toContain('class="&lt;img src=x onerror=alert(1)&gt;"');
    });

    it(`${name}: stil nimmt deck() an und weist alles andere ab`, () => {
      expect(zeichne(PUNKTE, "f", deck(0.5))).toContain('style="opacity:0.500"');
      for (const boese of ["onmouseover=alert(1)", 'onload="alert(1)"', `style="x"><img src=x onerror=alert(1)>`]) {
        expect(() => zeichne(PUNKTE, "f", boese), boese).toThrow(/stil/);
      }
    });
  }
});
