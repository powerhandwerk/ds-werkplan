// Gemeinsame Werte des DS Werkplan 2.0 (ADR-261) für Web und PDF.
//
// Warum ein reines Modul: react-pdf kennt weder oklch noch CSS-Module oder
// CSS-Variablen. Das PDF braucht Hex-Werte, Maße und Icon-Pfade als Zahlen und
// Strings; die Web-Bausteine lesen die Icon-Pfade von hier, damit es nur eine
// Kopie gibt. Keine eigene Hex-Tabelle: Farben und Maße kommen aus ./tokens.
//
// Kein Top-Level-Aufruf mit Seiteneffekt: ./icons.tsx importiert dieses Modul
// auch in Client-Bundles, die Farbtabellen bleiben dort ungenutzt und dürfen
// beim Tree-Shaking wegfallen.

import { FARBEN, FLAECHEN, MASSE, hexVon, type FarbName, type Untergrund } from "./tokens";

/* ---- Farben ---------------------------------------------------------- */

/**
 * Hex-Wert eines Farb-Tokens, etwa `farbe("--ink-950")`. Sucht in den Farben
 * aus ./tokens; ein unbekannter Token wirft, statt still schwarz zu drucken.
 */
export function farbe(token: string): string {
  const name = token.replace(/^--/, "");
  if (!Object.hasOwn(FARBEN, name)) throw new Error(`Werkplan-Farbe ${token} steht nicht in src/tokens.ts`);
  return hexVon(name as FarbName);
}

export type { Untergrund } from "./tokens";

/** Die Rollen einer Fläche, die Seitenrahmen und PDF brauchen. */
const PDF_ROLLEN = ["grund", "stark", "text", "gedaempft", "quelle"] as const;

export type FlaechenRolle = (typeof PDF_ROLLEN)[number];

type FlaechenTokens = {
  readonly [U in Untergrund]: { readonly [R in FlaechenRolle]: `--${(typeof FLAECHEN)[U][R]["farbe"]}` };
};

function flaechenTokens(): FlaechenTokens {
  const tokens = (u: Untergrund) => Object.fromEntries(PDF_ROLLEN.map((r) => [r, `--${FLAECHEN[u][r].farbe}`]));
  return { nacht: tokens("nacht"), papier: tokens("papier") } as FlaechenTokens;
}

/**
 * Rollen einer Fläche als Token-Namen (`--ink-…`), abgeleitet aus FLAECHEN in
 * ./tokens; die `--wp-*`-Rollen in werkplan.module.css folgen derselben Tabelle.
 */
export const FLAECHEN_TOKENS = /* @__PURE__ */ flaechenTokens();

/** Hex-Werte der Rollen einer Fläche, fürs PDF. */
export function flaechenFarben(untergrund: Untergrund): Record<FlaechenRolle, string> {
  return Object.fromEntries(PDF_ROLLEN.map((r) => [r, hexVon(FLAECHEN[untergrund][r].farbe)])) as Record<FlaechenRolle, string>;
}

/* ---- Maße ------------------------------------------------------------ */

/** Maße in Pixeln (Web) bzw. Punkten (PDF, gleiche Zahl), aus ./tokens. */
export const WERKPLAN_MASSE = MASSE;

/* ---- Icons ----------------------------------------------------------- */

/** Ein Element eines Icons in Lucide-Geometrie (viewBox 24, Strich 2). */
export type IconElement =
  | { art: "pfad"; d: string; aufFuellung?: true }
  | { art: "kreis"; cx: number; cy: number; r: number; gefuellt?: true };

export const ICON_VIEWBOX = 24;
export const ICON_STRICH = 2;

const KREIS: IconElement = { art: "kreis", cx: 12, cy: 12, r: 10 };

/**
 * Icons des Monatsberichts (Step 16a). `gefuellt` heißt: Fläche in der
 * Strichfarbe; `aufFuellung` heißt: Strich in der Gegenfarbe, weil er auf
 * einer gefüllten Fläche liegt (Haken im gefüllten Kreis).
 */
export const WERKPLAN_ICONS = {
  circle: [KREIS],
  "circle-check-gefuellt": [
    { art: "kreis", cx: 12, cy: 12, r: 10, gefuellt: true },
    { art: "pfad", d: "m9 12 2 2 4-4", aufFuellung: true },
  ],
  "circle-minus": [KREIS, { art: "pfad", d: "M8 12h8" }],
  "circle-dashed": [
    { art: "pfad", d: "M10.1 2.182a10 10 0 0 1 3.8 0" },
    { art: "pfad", d: "M13.9 21.818a10 10 0 0 1-3.8 0" },
    { art: "pfad", d: "M17.609 3.721a10 10 0 0 1 2.69 2.7" },
    { art: "pfad", d: "M2.182 13.9a10 10 0 0 1 0-3.8" },
    { art: "pfad", d: "M20.279 17.609a10 10 0 0 1-2.7 2.69" },
    { art: "pfad", d: "M21.818 10.1a10 10 0 0 1 0 3.8" },
    { art: "pfad", d: "M3.721 6.391a10 10 0 0 1 2.7-2.69" },
    { art: "pfad", d: "M6.391 20.279a10 10 0 0 1-2.69-2.7" },
  ],
  "calendar-clock": [
    { art: "pfad", d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" },
    { art: "pfad", d: "M16 2v4" },
    { art: "pfad", d: "M8 2v4" },
    { art: "pfad", d: "M3 10h5" },
    { art: "pfad", d: "M17.5 17.5 16 16.3V14" },
    { art: "kreis", cx: 16, cy: 16, r: 6 },
  ],
  hourglass: [
    { art: "pfad", d: "M5 22h14" },
    { art: "pfad", d: "M5 2h14" },
    { art: "pfad", d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" },
    { art: "pfad", d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" },
  ],
  ban: [{ art: "pfad", d: "M4.929 4.929 19.07 19.071" }, KREIS],
  "file-text": [
    { art: "pfad", d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" },
    { art: "pfad", d: "M14 2v6h6" },
    { art: "pfad", d: "M9 13h6M9 17h4" },
  ],
} as const satisfies Record<string, readonly IconElement[]>;

export type WerkplanIconName = keyof typeof WERKPLAN_ICONS;
