/*!
 * Iso-Kern des Design-Systems, Projektion nach iso-glow.
 * Copyright (c) 2026 April Zhu (iso-glow: lighting, palettes, gallery shell, examples)
 * Copyright (c) 2026 Tolga Cohce (iso-figure, on which iso-glow is based)
 * MIT-Lizenz, voller Text in LICENSE-iso-glow.txt (Wurzel des Pakets).
 * Port aus powerhandwerk-website, lib/grafiken/iso.ts (keteso 923a5c4).
 */

/**
 * Isometrische Projektion als reine Funktionen, Ausgabe als Knotenbaum
 * `{ tag, attrs, kids }`. Kein DOM, keine Zufallszahlen: Die Komponente
 * `IsoKnoten` macht daraus React-Elemente, auf dem Server wie im Browser.
 *
 * Projektion wie in der Vorlage (siehe Kopf), zusätzlich mit Drehung der ganzen
 * Platte um die Hochachse (`rot` in Bogenmaß; negativ = Fronten drehen zum
 * Betrachter).
 *
 * Attribute stehen in React-Schreibweise (`className`, `strokeWidth`,
 * `textAnchor`, …), damit der Renderer sie unverändert durchreichen kann.
 */

export type AttrWert = string | number | Record<string, string> | undefined;

export type Knoten = {
  tag: string;
  attrs: Record<string, AttrWert>;
  kids: (Knoten | string)[];
};

/** Was `h()` als Kind annimmt: verschachtelte Listen werden flachgeklopft, Leeres fällt weg. */
export type Kind = Knoten | string | number | null | undefined | false | readonly Kind[];

export type Punkt2 = [number, number];
export type Punkt3 = [number, number, number];

/** Auf zwei Nachkommastellen gerundet, damit das SVG kurz und stabil bleibt. */
export const f = (n: number): number => Math.round(n * 100) / 100;

/** Kinder flachklopfen wie `h()`: verschachtelte Listen auflösen, Leeres weglassen, Zahlen als Text. */
export function flach(kids: readonly Kind[], aus: (Knoten | string)[]): (Knoten | string)[] {
  for (const k of kids) {
    if (k === null || k === undefined || k === false || k === "") continue;
    if (Array.isArray(k)) flach(k as readonly Kind[], aus);
    else if (typeof k === "number") aus.push(String(k));
    else aus.push(k as Knoten | string);
  }
  return aus;
}

/** Knoten bauen wie `createElement`, nur ohne React. */
export function h(tag: string, attrs?: Record<string, AttrWert> | null, ...kids: Kind[]): Knoten {
  return { tag, attrs: attrs ?? {}, kids: flach(kids, []) };
}

/** Fünfzackiger Stern um (x, y) als Pfad, Spitze oben; Innenradius 45 % von r. */
export function sternPfad(x: number, y: number, r: number): string {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += (i ? "L" : "M") + f(x + rr * Math.cos(a)) + " " + f(y + rr * Math.sin(a));
  }
  return d + "Z";
}

/**
 * Leuchtfilter einer Zeichnung, in Nutzerkoordinaten mit `rand` um die
 * bbox: `soft` (Blur 2,2 plus Original), `bloom` (nur Blur) und, wenn
 * `glow` und seine ID gesetzt sind, davor `glow` (Blur doppelt plus Original).
 */
export function filterDefs(
  bb: { x0: number; y0: number; w: number; h: number },
  ids: { soft: string; bloom: string; glow?: string },
  { rand, bloom, glow }: { rand: number; bloom: number; glow?: number },
): Knoten[] {
  const rahmen = { filterUnits: "userSpaceOnUse", x: bb.x0 - rand, y: bb.y0 - rand, width: bb.w + 2 * rand, height: bb.h + 2 * rand };
  const blur = (stdDeviation: number) => h("feGaussianBlur", { stdDeviation, result: "b" });
  const merge = (...quellen: string[]) => h("feMerge", {}, quellen.map((q) => h("feMergeNode", { in: q })));
  const filter: Knoten[] = [];
  if (glow !== undefined && ids.glow) filter.push(h("filter", { id: ids.glow, ...rahmen }, blur(glow), merge("b", "b", "SourceGraphic")));
  filter.push(
    h("filter", { id: ids.soft, ...rahmen }, blur(2.2), merge("b", "SourceGraphic")),
    h("filter", { id: ids.bloom, ...rahmen }, h("feGaussianBlur", { stdDeviation: bloom })),
  );
  return filter;
}

export type IsoKernel = ReturnType<typeof isoKernel>;

/**
 * Ein Kernel je Zeichnung: `rot` dreht die Platte um (cx, cy), `K` bildet
 * Klassennamen auf CSS-Modul-Namen ab (unbekannte bleiben, wie sie sind).
 * `merk`/`merkSchirm` sammeln Punkte für `bbox()`.
 */
export function isoKernel({
  rot = 0,
  cx = 0,
  cy = 0,
  K = {},
}: { rot?: number; cx?: number; cy?: number; K?: Readonly<Record<string, string>> } = {}) {
  const C30 = Math.cos(Math.PI / 6);
  const S30 = Math.sin(Math.PI / 6);
  const cr = Math.cos(rot);
  const sr = Math.sin(rot);
  const ext: Punkt2[] = [];

  const rxy = (x: number, y: number): Punkt2 => [
    cx + (x - cx) * cr - (y - cy) * sr,
    cy + (x - cx) * sr + (y - cy) * cr,
  ];
  /** Punkt im Raum auf die Zeichenfläche. */
  const P = (x: number, y: number, z: number): Punkt2 => {
    const [a, b] = rxy(x, y);
    return [(a - b) * C30, (a + b) * S30 - z];
  };
  /** Richtung im Raum auf die Zeichenfläche (ohne Drehpunkt). */
  const D = (x: number, y: number, z: number): Punkt2 => {
    const a = x * cr - y * sr;
    const b = x * sr + y * cr;
    return [(a - b) * C30, (a + b) * S30 - z];
  };
  const merk = (...p: Punkt3[]) => {
    for (const q of p) ext.push(P(...q));
  };
  const merkSchirm = (...p: Punkt2[]) => {
    for (const q of p) ext.push(q);
  };
  const cls = (...ns: (string | false | null | undefined)[]): string =>
    ns
      .filter(Boolean)
      .join(" ")
      .split(" ")
      .filter(Boolean)
      .map((n) => K[n] ?? n)
      .join(" ");
  /** Affine Matrix einer Fläche: Ursprung O, Achsen U und V im Raum. */
  const mat = (O: Punkt3, U: Punkt3, V: Punkt3): string => {
    const o = P(...O);
    const u = D(...U);
    const v = D(...V);
    return `matrix(${f(u[0])} ${f(u[1])} ${f(v[0])} ${f(v[1])} ${f(o[0])} ${f(o[1])})`;
  };
  /** Umkehrung zu `mat` ohne Ursprung: Bildschirmversatz in Flächenkoordinaten. */
  const matInv = (U: Punkt3, V: Punkt3) => {
    const u = D(...U);
    const v = D(...V);
    const det = u[0] * v[1] - v[0] * u[1];
    return (dx: number, dy: number): Punkt2 => [f((v[1] * dx - v[0] * dy) / det), f((-u[1] * dx + u[0] * dy) / det)];
  };
  const TOP = (x: number, y: number, z: number) => mat([x, y, z], [1, 0, 0], [0, 1, 0]);
  const FRONT = (x: number, y: number, z: number) => mat([x, y, z], [1, 0, 0], [0, 0, -1]);
  const SIDE = (x: number, y: number, z: number) => mat([x, y, z], [0, -1, 0], [0, 0, -1]);
  const d2 = (pts: readonly Punkt2[]): string => "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L");
  const path3 = (arr: readonly Punkt3[]): string => {
    for (const p of arr) merk(p);
    return d2(arr.map((p) => P(...p)));
  };
  const auf = (t: string, ...kids: Kind[]): Knoten => h("g", { transform: t }, ...kids);
  const rect = (t: string, w: number, hh: number, r = 0, c = "face"): Knoten =>
    auf(t, h("rect", { className: cls(c), width: f(w), height: f(hh), rx: r || undefined }));

  /** Grundriss eines Rechtecks mit gerundeten Ecken als Punktfolge. */
  function ring(x: number, y: number, w: number, d: number, r: number, n = 6): Punkt2[] {
    r = Math.min(r, w / 2, d / 2);
    const out: Punkt2[] = [];
    const ecke = (ex: number, ey: number, a0: number) => {
      for (let i = 0; i <= n; i++) {
        const a = a0 + (Math.PI / 2) * (i / n);
        out.push([ex + r * Math.cos(a), ey + r * Math.sin(a)]);
      }
    };
    ecke(x + w - r, y + r, -Math.PI / 2);
    ecke(x + w - r, y + d - r, 0);
    ecke(x + r, y + d - r, Math.PI / 2);
    ecke(x + r, y + r, Math.PI);
    return out;
  }

  /** Konvexe Hülle (Monotone Chain). */
  function huelle(pts: readonly Punkt2[]): Punkt2[] {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const kreuz = (o: Punkt2, a: Punkt2, b: Punkt2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const unten: Punkt2[] = [];
    const oben: Punkt2[] = [];
    for (const q of p) {
      while (unten.length >= 2 && kreuz(unten[unten.length - 2], unten[unten.length - 1], q) <= 0) unten.pop();
      unten.push(q);
    }
    for (const q of p.reverse()) {
      while (oben.length >= 2 && kreuz(oben[oben.length - 2], oben[oben.length - 1], q) <= 0) oben.pop();
      oben.push(q);
    }
    return unten.slice(0, -1).concat(oben.slice(0, -1));
  }

  /** Quader: r = 0 drei Flächen, r > 0 Hülle aus Grund- und Deckring plus Deckfläche. */
  function box(x: number, y: number, z: number, w: number, d: number, hh: number, r = 0, c = ""): Knoten[] {
    merk(
      [x, y, z],
      [x + w, y, z],
      [x, y + d, z],
      [x + w, y + d, z],
      [x, y, z + hh],
      [x + w, y, z + hh],
      [x, y + d, z + hh],
      [x + w, y + d, z + hh],
    );
    if (r <= 0) {
      return [
        rect(SIDE(x + w, y + d, z + hh), d, hh, 0, "face " + c),
        rect(FRONT(x, y + d, z + hh), w, hh, 0, "face " + c),
        rect(TOP(x, y, z + hh), w, d, 0, "face top " + c),
      ];
    }
    const rg = ring(x, y, w, d, r);
    const lo = rg.map(([a, b]) => P(a, b, z));
    const hi = rg.map(([a, b]) => P(a, b, z + hh));
    return [
      h("path", { className: cls("face", c), d: d2(huelle(lo.concat(hi))) + "Z" }),
      h("path", { className: cls("face top", c), d: d2(hi) + "Z" }),
    ];
  }

  /** Umriss aller gemerkten Punkte plus Rand, als Zahlen und als viewBox. */
  function bbox(rand = 12) {
    const xs = ext.map((p) => p[0]);
    const ys = ext.map((p) => p[1]);
    const x0 = Math.min(...xs) - rand;
    const y0 = Math.min(...ys) - rand;
    const x1 = Math.max(...xs) + rand;
    const y1 = Math.max(...ys) + rand;
    return { x0: f(x0), y0: f(y0), w: f(x1 - x0), h: f(y1 - y0), viewBox: `${f(x0)} ${f(y0)} ${f(x1 - x0)} ${f(y1 - y0)}` };
  }

  return { P, D, merk, merkSchirm, cls, mat, matInv, TOP, FRONT, SIDE, d2, path3, auf, rect, ring, huelle, box, bbox, f, h };
}
