// @vitest-environment node
import { describe, expect, it } from "vitest";
import { FLAECHEN, NACHT_HELL_GRUND, deckkraftVon, rgbVon, type FarbName, type RollenWert, type Untergrund, type WpRolle } from "../src/tokens";

// Kontrast nach WCAG 2.2 für jede Rolle auf jedem Grund, auf dem sie steht:
// Schrift mindestens 4,5:1, Fokusring 3:1. Was keine Schrift und kein
// Bedienelement ist, steht mit Begründung in AUSNAHMEN.

type Rgb = [number, number, number];

/** Farbe über einem Grund; Deckkraft wie im Browser in sRGB verrechnet. */
function auf(wert: RollenWert, grund: Rgb): Rgb {
  const alpha = deckkraftVon(wert.farbe, wert.anteil);
  return rgbVon(wert.farbe).rgb.map((kanal, i) => Math.round(kanal * alpha + grund[i] * (1 - alpha))) as Rgb;
}

function leuchtdichte([rot, gruen, blau]: Rgb): number {
  const linear = (kanal: number) => {
    const c = kanal / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(rot) + 0.7152 * linear(gruen) + 0.0722 * linear(blau);
}

function kontrast(a: Rgb, b: Rgb): number {
  const [hell, dunkel] = [leuchtdichte(a), leuchtdichte(b)].sort((x, y) => y - x);
  return (hell + 0.05) / (dunkel + 0.05);
}

const farbe = (name: FarbName): RollenWert => ({ farbe: name });
const SCHWARZ: Rgb = [0, 0, 0];

/** Gründe je Fläche: der Grund selbst, das Blatt darauf und bei Nacht die hellere Stufe. */
function gruende(untergrund: Untergrund): [string, Rgb][] {
  const grund = auf(FLAECHEN[untergrund].grund, SCHWARZ);
  const liste: [string, Rgb][] = [
    ["Grund", grund],
    ["Blatt", auf(FLAECHEN[untergrund].blatt, grund)],
  ];
  if (untergrund === "nacht") liste.push(["Nacht hell", auf(farbe(NACHT_HELL_GRUND), SCHWARZ)]);
  return liste;
}

const SCHRIFT: readonly WpRolle[] = ["stark", "text", "gedaempft", "quelle"];
const FOKUS: readonly WpRolle[] = ["fokus"];
const AUSNAHMEN: Partial<Record<WpRolle, string>> = {
  grund: "Ist selbst der Grund.",
  blatt: "Fläche unter der Schrift, keine Schrift; die Schrift darauf prüft dieser Test.",
  linie: "Gliederung von Schriftfeld, Listen und Kästen, keine Grenze eines Bedienelements (WCAG 1.4.11 greift nicht).",
  "linie-fein": "Feine Trennlinie, rein gliedernd.",
  raster: "Millimeterraster als Hintergrundmuster.",
};

describe("Kontrast der Flächenrollen", () => {
  it("jede Rolle ist eingeordnet: Schrift, Fokus oder begründete Ausnahme", () => {
    const offen = (Object.keys(FLAECHEN.papier) as WpRolle[]).filter(
      (rolle) => !SCHRIFT.includes(rolle) && !FOKUS.includes(rolle) && !(rolle in AUSNAHMEN),
    );
    expect(offen).toEqual([]);
  });

  for (const untergrund of ["papier", "nacht"] as const) {
    for (const [grundName, grund] of gruende(untergrund)) {
      it.each(SCHRIFT)(`${untergrund}, ${grundName}: Schrift %s mindestens 4,5:1`, (rolle) => {
        expect(kontrast(auf(FLAECHEN[untergrund][rolle], grund), grund)).toBeGreaterThanOrEqual(4.5);
      });
      it(`${untergrund}, ${grundName}: Fokusring mindestens 3:1`, () => {
        expect(kontrast(auf(FLAECHEN[untergrund].fokus, grund), grund)).toBeGreaterThanOrEqual(3);
      });
    }
  }
});

describe("Kontrast der Farben außerhalb der Flächen", () => {
  it.each(["lime", "lime-deep", "lime-soft"] as const)("dunkle Schrift auf %s mindestens 4,5:1", (flaeche) => {
    const grund = auf(farbe(flaeche), SCHWARZ);
    expect(kontrast(auf(farbe("ink-950"), grund), grund)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(["ink-100", "ink-050"] as const)("Fehlertext danger-ink auf %s mindestens 4,5:1", (flaeche) => {
    const grund = auf(farbe(flaeche), SCHWARZ);
    expect(kontrast(auf(farbe("danger-ink"), grund), grund)).toBeGreaterThanOrEqual(4.5);
  });
});
