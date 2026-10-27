// Einzige Quelle aller Werte des DS Werkplan 2.0 (ADR-261 im Admin-Repo).
//
// Daraus erzeugt scripts/erzeuge.ts die Dateien src/tokens.css, src/schriften.css
// und artifact/project/tokens.json; src/werte.ts liest Hex-Werte und Maße fürs
// PDF von hier, weil react-pdf weder oklch noch CSS-Variablen kennt.
//
// Kein Top-Level-Aufruf mit Seiteneffekt: icons.tsx und werte.ts landen in
// Client-Bundles, die Tabellen hier dürfen beim Tree-Shaking wegfallen.

/* ---- Farben ---------------------------------------------------------- */

/** oklch-Koordinaten wie in CSS: Helligkeit 0 bis 1, Buntheit, Farbton in Grad. */
export type Oklch = readonly [helligkeit: number, buntheit: number, farbton: number];

type FarbQuelle =
  | { readonly oklch: Oklch }
  | { readonly hex: string }
  | { readonly rgba: readonly [rot: number, gruen: number, blau: number, deckkraft: number] }
  | { readonly alias: string };

/** Eine Farbe mit ihrer Rolle; `alias` verweist auf eine andere Farbe der Tabelle. */
export type Farbe = FarbQuelle & { readonly rolle: string };

/**
 * Alle Farben. Die Namen der Ink- und Lime-Stufen sind dieselben wie im Admin
 * (`app/globals.css`), die Werte auch; die Ink-Rampe hat zehn Stufen. Was
 * dazwischen liegt, entsteht mit `color-mix()` aus zwei Stufen (docs/inventur.md).
 */
export const FARBEN = {
  "ink-950": { oklch: [0.17, 0.012, 78], rolle: "Starke Schrift auf Papier, Nachtfläche, Fokusring auf Papier." },
  "ink-900": { oklch: [0.21, 0.013, 78], rolle: "Nachtfläche eine Stufe heller (.nachtHell)." },
  "ink-800": { oklch: [0.27, 0.013, 78], rolle: "Fließtext auf Papier, Hover auf Nacht." },
  "ink-600": { oklch: [0.46, 0.011, 80], rolle: "Quellenzeile auf Papier." },
  "ink-500": { oklch: [0.5, 0.011, 80], rolle: "Gedämpfte Schrift auf Papier." },
  "ink-400": { oklch: [0.68, 0.01, 82], rolle: "Gedämpfte Schrift und Linien auf Nacht." },
  "ink-300": { oklch: [0.8, 0.009, 83], rolle: "Quellenzeile auf Nacht." },
  "ink-200": { oklch: [0.89, 0.008, 84], rolle: "Fließtext auf Nacht, Haarlinie auf Papier." },
  "ink-100": { oklch: [0.96, 0.006, 85], rolle: "Papier." },
  "ink-050": { oklch: [0.975, 0.006, 85], rolle: "Karte und Schriftfeld auf Papier, starke Schrift auf Nacht." },
  lime: {
    hex: "#b5e545",
    rolle: "Signalfarbe des Logos. Nur als Fläche mit dunkler Schrift (ink-950) darauf; auf Nacht auch Fokusring.",
  },
  "lime-deep": { hex: "#a3d137", rolle: "Gedrückter Zustand einer Lime-Fläche." },
  "lime-soft": { hex: "#dcf2a0", rolle: "Marker-Wäsche, Fokus eines Eingabefelds." },
  "lime-glow": { rgba: [181, 229, 69, 0.45], rolle: "Leuchten um Lime-Flächen." },
  danger: { hex: "#ce2324", rolle: "Fehler und Löschen als Fläche (Etikett, Hover). Rot gibt es nur dafür." },
  "danger-ink": { oklch: [0.5, 0.13, 30], rolle: "Fehlertext auf Papier." },
  "focus-ring": { alias: "ink-950", rolle: "Fokusring auf Papier (WCAG 2.2 AA)." },
  "focus-ring-on-dark": { alias: "lime", rolle: "Fokusring auf Nacht." },
} as const satisfies Record<string, Farbe>;

export type FarbName = keyof typeof FARBEN;

/* ---- Farbrechnung ---------------------------------------------------- */

/**
 * oklch nach sRGB (0 bis 255), dieselbe Rechnung wie im Browser: OKLab nach
 * Björn Ottosson, über den LMS-Raum in lineares sRGB, dann die Übertragungskurve.
 */
export function oklchZuRgb([helligkeit, buntheit, farbton]: Oklch): [number, number, number] {
  const winkel = (farbton * Math.PI) / 180;
  const a = buntheit * Math.cos(winkel);
  const b = buntheit * Math.sin(winkel);

  const l = (helligkeit + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (helligkeit - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (helligkeit - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  const [rot, gruen, blau] = linear.map((wert) => {
    const kurve = wert <= 0.0031308 ? 12.92 * wert : 1.055 * Math.pow(wert, 1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, kurve)) * 255);
  });
  return [rot, gruen, blau];
}

function zweiStellen(wert: number): string {
  return Math.round(wert).toString(16).padStart(2, "0");
}

/** Löst Verweise auf und liefert die Quelle der Farbe. */
function quelle(name: FarbName): Exclude<FarbQuelle, { readonly alias: string }> {
  const farbe: Farbe = FARBEN[name];
  if ("alias" in farbe) {
    if (!Object.hasOwn(FARBEN, farbe.alias)) throw new Error(`Farbe ${name} verweist auf unbekannte Farbe ${farbe.alias}`);
    return quelle(farbe.alias as FarbName);
  }
  return farbe;
}

/** sRGB-Werte 0 bis 255 und Deckkraft 0 bis 1 einer Farbe. */
export function rgbVon(name: FarbName): { rgb: [number, number, number]; deckkraft: number } {
  const q = quelle(name);
  if ("hex" in q) {
    const zahl = parseInt(q.hex.slice(1), 16);
    return { rgb: [(zahl >> 16) & 255, (zahl >> 8) & 255, zahl & 255], deckkraft: 1 };
  }
  if ("rgba" in q) return { rgb: [q.rgba[0], q.rgba[1], q.rgba[2]], deckkraft: q.rgba[3] };
  return { rgb: oklchZuRgb(q.oklch), deckkraft: 1 };
}

/**
 * Hex-Wert einer Farbe (`#rrggbb`, mit Deckkraft unter 1 `#rrggbbaa`). Mit
 * `anteil` (Prozent) die Farbe mit dieser Deckkraft, also das Ergebnis von
 * `color-mix(in oklch, var(--name) <anteil>%, transparent)`.
 */
export function hexVon(name: FarbName, anteil?: number): string {
  const { rgb, deckkraft } = rgbVon(name);
  const alpha = deckkraft * (anteil === undefined ? 1 : anteil / 100);
  const hex = "#" + rgb.map(zweiStellen).join("");
  return alpha >= 1 ? hex : hex + zweiStellen(alpha * 255);
}

/** CSS-Wert einer Farbe, wie src/tokens.css ihn schreibt. */
export function cssVon(name: FarbName): string {
  const farbe: Farbe = FARBEN[name];
  if ("alias" in farbe) return `var(--${farbe.alias})`;
  if ("hex" in farbe) return farbe.hex;
  if ("rgba" in farbe) return `rgba(${farbe.rgba.join(", ")})`;
  return `oklch(${farbe.oklch.join(" ")})`;
}

/* ---- Flächen --------------------------------------------------------- */

export type Untergrund = "papier" | "nacht";

/** Wert einer Flächenrolle: eine Farbe, wahlweise mit Deckkraft in Prozent. */
export interface RollenWert {
  readonly farbe: FarbName;
  readonly anteil?: number;
}

/**
 * Rollen der zwei Flächen. In CSS stehen sie als `--wp-<rolle>` nur in den
 * Flächenklassen von src/werkplan.module.css (`.papier`, `.aufPapier`, `.nacht`,
 * `.nachtHell`, `.aufNacht`), nie auf `:root`. `grund` ist die Hintergrundfarbe
 * der Fläche selbst, `raster` das Millimeterraster darauf.
 */
export const FLAECHEN = {
  papier: {
    grund: { farbe: "ink-100" },
    stark: { farbe: "ink-950" },
    text: { farbe: "ink-800" },
    gedaempft: { farbe: "ink-500" },
    quelle: { farbe: "ink-600" },
    linie: { farbe: "ink-950", anteil: 40 },
    "linie-fein": { farbe: "ink-950", anteil: 20 },
    fokus: { farbe: "focus-ring" },
    blatt: { farbe: "ink-050" },
    raster: { farbe: "ink-950", anteil: 6 },
  },
  nacht: {
    grund: { farbe: "ink-950" },
    stark: { farbe: "ink-050" },
    text: { farbe: "ink-200" },
    gedaempft: { farbe: "ink-400" },
    quelle: { farbe: "ink-300" },
    linie: { farbe: "ink-400", anteil: 50 },
    "linie-fein": { farbe: "ink-400", anteil: 22 },
    fokus: { farbe: "focus-ring-on-dark" },
    blatt: { farbe: "ink-900", anteil: 60 },
    raster: { farbe: "ink-400", anteil: 7 },
  },
} as const satisfies Record<Untergrund, Record<string, RollenWert>>;

export type WpRolle = keyof (typeof FLAECHEN)["papier"];

/** `.nachtHell` ist Nacht eine Stufe heller: nur der Grund weicht ab. */
export const NACHT_HELL_GRUND = "ink-900" satisfies FarbName;

/** Eine Flächenrolle als CSS-Wert, so wie src/werkplan.module.css sie setzt. */
export function rolleCss(wert: RollenWert): string {
  return wert.anteil === undefined
    ? `var(--${wert.farbe})`
    : `color-mix(in oklch, var(--${wert.farbe}) ${wert.anteil}%, transparent)`;
}

/* ---- Schrift --------------------------------------------------------- */

/** Schriftfamilien als CSS-Stapel; in CSS `--font-display`, `--font-body`, `--font-werkplan`. */
export const SCHRIFTFAMILIEN = {
  display: {
    stapel: '"Big Shoulders Display", "Arial Narrow", sans-serif',
    rolle: "Überschriften: Versalien, Gewicht 800.",
  },
  body: {
    stapel: '"Hanken Grotesk", system-ui, sans-serif',
    rolle: "Fließtext, Einleitung, Knöpfe, Textlink.",
  },
  werkplan: {
    stapel: '"Barlow Semi Condensed"',
    rolle: "Beschriftung, Quelle und Schriftfeld (600), Messwert (300). Die Rollen hängen var(--font-body) als Rückfall an.",
  },
} as const;

export type SchriftFamilie = keyof typeof SCHRIFTFAMILIEN;

/** Selbst gehostete Schriftdateien unter fonts/ (SIL OFL 1.1, Lizenztexte daneben). */
export const SCHRIFTDATEIEN = [
  { familie: "Big Shoulders Display", datei: "big-shoulders-display.woff2", gewicht: "100 900" },
  { familie: "Hanken Grotesk", datei: "hanken-grotesk.woff2", gewicht: "100 900" },
  { familie: "Barlow Semi Condensed", datei: "barlow-semi-condensed-300.woff2", gewicht: "300" },
  { familie: "Barlow Semi Condensed", datei: "barlow-semi-condensed-600.woff2", gewicht: "600" },
] as const;

/**
 * Schriftgrade in Pixeln, in CSS `--grad-<n>`. Acht Grade von 12 bis 64 plus
 * die Messwert-Stufe 80 (die Kundenseite setzt große Messwerte mit 76 und 84 px).
 */
export const GRADE = {
  12: "Beschriftung, Quelle, Etikett, Schriftfeld-Label.",
  14: "Kleintext, Beschriftung ab 768 px, Listenzeilen.",
  16: "Fließtext, Knöpfe, Textlink, Schriftfeld-Wert.",
  18: "Einleitung.",
  24: "Zwischenüberschrift.",
  32: "Überschrift am Handy.",
  48: "Überschrift.",
  64: "Große Überschrift.",
  80: "Großer Messwert.",
} as const;

export type Grad = keyof typeof GRADE;

/** Eine Typo-Rolle; `klasse` ist die Klasse in src/werkplan.module.css. */
export interface TypoRolle {
  readonly name: string;
  readonly klasse: string;
  readonly familie: SchriftFamilie;
  readonly gewicht: number;
  /** Schriftgrad; bei Überschriften der Richtwert, die Größe setzt dort die Seite. */
  readonly grad: Grad;
  /** Schriftgrad ab 768 px Breite, falls die Rolle dort wächst. */
  readonly gradAb768?: Grad;
  readonly groesseSetztSeite?: true;
  readonly zeilenhoehe: number;
  readonly sperrung?: string;
  readonly versalien?: true;
  readonly beispiel: string;
  readonly rolle: string;
}

/**
 * Typo-Rollen des Werkplans. Schrift, Gewicht, Grad, Zeilenhöhe und Sperrung
 * stehen hier; src/werkplan.module.css setzt dieselben Werte in den Klassen
 * (test/typo-rollen.test.ts hält beides gleich).
 */
export const TYPO_ROLLEN: readonly TypoRolle[] = [
  {
    name: "h1",
    klasse: "h1",
    familie: "display",
    gewicht: 800,
    grad: 48,
    groesseSetztSeite: true,
    zeilenhoehe: 1,
    versalien: true,
    beispiel: "Werkplan",
    rolle: "Seitentitel. Am Handy grad-32, auf der Startseite bis grad-64.",
  },
  {
    name: "h2",
    klasse: "h2",
    familie: "display",
    gewicht: 800,
    grad: 32,
    groesseSetztSeite: true,
    zeilenhoehe: 1,
    versalien: true,
    beispiel: "Google-Profil",
    rolle: "Abschnittstitel, ab 1024 px grad-48.",
  },
  {
    name: "h3",
    klasse: "h3",
    familie: "display",
    gewicht: 800,
    grad: 24,
    groesseSetztSeite: true,
    zeilenhoehe: 1,
    versalien: true,
    beispiel: "Nächster Schritt",
    rolle: "Zwischenüberschrift.",
  },
  {
    name: "lead",
    klasse: "lead",
    familie: "body",
    gewicht: 400,
    grad: 18,
    zeilenhoehe: 1.5,
    beispiel: "Einleitung in 18 Pixel.",
    rolle: "Einleitung unter dem Titel, höchstens 34 em breit.",
  },
  {
    name: "text",
    klasse: "text",
    familie: "body",
    gewicht: 400,
    grad: 16,
    zeilenhoehe: 1.55,
    beispiel: "Fließtext in 16 Pixel.",
    rolle: "Fließtext, höchstens 62 Zeichen breit.",
  },
  {
    name: "beschriftung",
    klasse: "beschriftung",
    familie: "werkplan",
    gewicht: 600,
    grad: 12,
    gradAb768: 14,
    zeilenhoehe: 1.2,
    sperrung: "0.16em",
    versalien: true,
    beispiel: "Blatt 02 · Zugänge",
    rolle: "Beschriftung, Positionsnummer und Blattzeile in gedämpfter Farbe.",
  },
  {
    name: "messwert",
    klasse: "messwert",
    familie: "werkplan",
    gewicht: 300,
    grad: 80,
    groesseSetztSeite: true,
    zeilenhoehe: 0.82,
    sperrung: "-0.01em",
    beispiel: "4,8",
    rolle: "Große Zahl mit proportionalen Versalziffern (nie tabellarisch).",
  },
  {
    name: "quelle",
    klasse: "quelle",
    familie: "werkplan",
    gewicht: 600,
    grad: 12,
    zeilenhoehe: 1.45,
    sperrung: "0.06em",
    versalien: true,
    beispiel: "Quelle: Google",
    rolle: "Quellenzeile unter einer Zahl, mindestens 4,5:1.",
  },
  {
    name: "textlink",
    klasse: "textlink",
    familie: "body",
    gewicht: 600,
    grad: 16,
    zeilenhoehe: 1,
    beispiel: "Mehr erfahren",
    rolle: "Zweitaktion: 1 px Unterstrich, bei Hover und Fokus 3 px Lime.",
  },
  {
    name: "schriftfeld-label",
    klasse: "plankopfLabel",
    familie: "werkplan",
    gewicht: 600,
    grad: 12,
    zeilenhoehe: 1.2,
    sperrung: "0.16em",
    versalien: true,
    beispiel: "Betrieb",
    rolle: "Label eines Felds im Schriftfeld.",
  },
  {
    name: "schriftfeld-wert",
    klasse: "plankopfWert",
    familie: "werkplan",
    gewicht: 600,
    grad: 16,
    zeilenhoehe: 1.3,
    sperrung: "0.02em",
    beispiel: "Musterbetrieb",
    rolle: "Wert eines Felds im Schriftfeld, normale Schreibung.",
  },
];

/* ---- Form ------------------------------------------------------------ */

/** Rundungsrollen, in CSS `--rund-<rolle>`. */
export const RUNDUNGEN = {
  eckig: { wert: "0", rolle: "Kästen, Karten, Schriftfeld, Listen." },
  fein: { wert: "2px", rolle: "Etikett, Eingabefeld, Fokusrahmen, Textlink." },
  kreis: {
    wert: "999px",
    rolle: "Punkte, Avatare und Pillen ohne feste Höhe: an einem Quadrat ein Kreis, sonst runde Enden.",
  },
} as const;

/**
 * Knöpfe und Chips mit fester Höhe runden mit 0,433 × Höhe, der Form der Pille
 * im Logo (`rx=21.7` bei `height=50.1`); in CSS `--rund-pille-faktor`.
 */
export const PILLE_FAKTOR = 0.433;

/** Abstände im 4-px-Raster. */
export const ABSTAENDE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const;

/** Bewegung: Übergänge, Lichtumlauf der Lichtkante. `prefers-reduced-motion` schaltet beides ab. */
export const BEWEGUNG = {
  uebergangMs: 180,
  kurve: "ease-out",
  lichtUmlaufS: 3.2,
} as const;

/**
 * Maße in Pixeln (Web) bzw. Punkten (PDF, gleiche Zahl), Quelle der Werte in
 * werkplan.module.css und lichtkante.module.css.
 */
export const MASSE = {
  /** Maßlinie, Endstriche, Schriftfeld-Fugen. */
  linie: 1,
  /** Kantenlänge und Linienstärke der Sucher-Ecken. */
  ecke: 10,
  eckeLinie: 1.5,
  /** Millimeterraster der Flächen. */
  raster: 24,
  /** Höhe des Maßbalkens und seiner Lime-Füllung. */
  massbalkenHoehe: 14,
  massbalkenFuellung: 6,
  /** Lichtkante: Höhe, Chip, Rundung als Anteil der Höhe (Form der Logo-Pille). */
  lichtkanteHoehe: 54,
  lichtkanteChip: 38,
  rundungsFaktor: PILLE_FAKTOR,
  /** Umlaufzeit des Lichts in Sekunden. */
  lichtkanteUmlauf: BEWEGUNG.lichtUmlaufS,
} as const;
