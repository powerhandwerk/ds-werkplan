/*!
 * Explosionszeichnung (Stil B, Iso-Szene), gezeichnet mit dem Iso-Kern nach iso-glow.
 * Copyright (c) 2026 April Zhu (iso-glow: lighting, palettes, gallery shell, examples)
 * Copyright (c) 2026 Tolga Cohce (iso-figure, on which iso-glow is based)
 * MIT-Lizenz, voller Text in LICENSE-iso-glow.txt (Wurzel des Pakets).
 * Port aus powerhandwerk-website, lib/grafiken/befund-profil.ts (keteso 923a5c4).
 */

/**
 * Beispiel des Stils B: ein Profil als Explosionszeichnung. Eine stehende
 * Profil-Tafel, davor vier Bauteile (POS. 01 bis 04), nach vorn
 * herausgezogen. `data-stand` am SVG (0 bis 4) sagt, wie viele Teile
 * eingerastet sind und leuchten; `data-fokus` (1 bis 4) färbt nur Ballon und
 * Fassung einer Position, das Einrasten macht allein `data-stand`. Beides
 * setzt `IsoSzene`, die Zustände zeichnet explosion.module.css.
 *
 * Das Ergebnis ist eine serialisierbare Zeichnung (`viewBox`, `knoten`,
 * `klasse`, `stil`), damit eine Server-Komponente sie rechnen und an
 * `IsoSzene` geben kann.
 *
 * Platte        x 20..280, y 10..150 (Rahmen 28..272 × 18..142)
 * Fuß           x 60..240, y 26..56
 * Tafel         x 40..260, Front y 46, z 14..174
 * Teile         Dicke 5 vor der Front, herausgezogen um je eigene Tiefe
 *
 * Texte (Name, Kategorie, Wertung, Anzahl) landen als Text-Kinder im Baum,
 * nie als Attribut. Die Standardtexte sind Muster, keine echten Daten.
 */

import css from "./explosion.module.css";
import { filterDefs, flach, h, isoKernel, sternPfad, type Kind, type Knoten } from "./iso";

/** Musterinhalte der Explosionszeichnung. */
export const EXPLOSION_MUSTER = {
  name: "Betrieb Muster",
  kategorie: "Gewerk · Musterstadt",
  wertung: "4,8",
  anzahl: "38",
} as const;

/** So viele Stufen hat der Ablauf: vier Teile rasten nacheinander ein. */
export const EXPLOSION_STUFEN = 4;

export type ExplosionEingabe = {
  name?: string;
  kategorie?: string;
  wertung?: string;
  anzahl?: string;
  /** Vorsatz für Filter-IDs, damit zwei Zeichnungen auf einer Seite sich nicht stören. */
  idPraefix?: string;
  /** Drehung der Platte in Grad; negativ dreht die Front zum Betrachter. */
  rot?: number;
};

export type ExplosionProfil = {
  viewBox: string;
  /** Klasse der Zeichnung aus explosion.module.css, gehört neben die Palette ans SVG. */
  klasse: string;
  /**
   * IDs der beiden Filter. `stil` setzt sie als `url(#…)` in die
   * CSS-Variablen `--f-bp-soft` und `--f-bp-bloom`; das CSS-Modul nennt nie
   * eine feste ID.
   */
  ids: { soft: string; bloom: string };
  stil: Readonly<Record<string, string>>;
  knoten: Knoten[];
};

/**
 * Stückliste der Teile 02 bis 04: Lage vor der Front (x, Unterkante z,
 * Breite w, Höhe hh) und wie weit das Teil herausgezogen ist. Fassung,
 * Führung, Platte, Ballon und Fassungsnummer rechnen sich daraus.
 */
const TEILE = [
  { n: 2, x: 52, z: 68, w: 122, hh: 52, tiefe: 42, ballonLinks: true },
  { n: 3, x: 52, z: 26, w: 122, hh: 32, tiefe: 50, ballonLinks: true },
  { n: 4, x: 186, z: 26, w: 62, hh: 94, tiefe: 38, ballonLinks: false },
] as const;
type Teil = (typeof TEILE)[number];

/** POS. 01: Inhaber-Siegel, eine runde Scheibe mit Haken. */
const SIEGEL = { cx: 208, cz: 153, r: 9, tiefe: 54 };

export function explosionProfil({
  name = EXPLOSION_MUSTER.name,
  kategorie = EXPLOSION_MUSTER.kategorie,
  wertung = EXPLOSION_MUSTER.wertung,
  anzahl = EXPLOSION_MUSTER.anzahl,
  idPraefix = "",
  rot = -25,
}: ExplosionEingabe = {}): ExplosionProfil {
  const k = isoKernel({ rot: (rot * Math.PI) / 180, cx: 150, cy: 95, K: css });
  const { P, D, merk, merkSchirm, cls, FRONT, TOP, auf, box, d2, path3, f } = k;
  const ids = { soft: `${idPraefix}bp-soft`, bloom: `${idPraefix}bp-bloom` };
  const PZ = 6;
  const FRONT_Y = 46;
  const TAFEL = { x: 40, z1: 174 };
  /** Punkt der Front im Schnitt der Tafel (u nach rechts, v nach unten). */
  const schnitt = (x: number, z: number) => ({ u: x - TAFEL.x, v: TAFEL.z1 - z });
  const knoten: Knoten[] = [];
  const add = (...n: Kind[]) => knoten.push(...flach(n, []).filter((x): x is Knoten => typeof x !== "string"));
  const stern = (x: number, y: number, r: number, c: string) => h("path", { className: cls(c), d: sternPfad(x, y, r) });

  /* ---------- Platte, Fuß, Tafel ---------- */
  add(box(20, 10, 0, 260, 140, PZ, 12));
  add(
    auf(
      TOP(0, 0, PZ),
      h("rect", { className: cls("detail"), x: 28, y: 18, width: 244, height: 124, rx: 8 }),
      (
        [
          [36, 26],
          [264, 26],
          [36, 134],
          [264, 134],
        ] as const
      ).map(([x, y]) => [
        h("circle", { className: cls("face recess"), cx: x, cy: y, r: 2.6 }),
        h("path", { className: cls("detail"), d: `M${x - 1.6} ${y}H${x + 1.6}` }),
      ]),
    ),
  );
  add(box(60, 26, PZ, 180, 30, 8, 5));
  add(
    h(
      "g",
      { className: cls("tafel-halo-g") },
      auf(
        FRONT(TAFEL.x, FRONT_Y, TAFEL.z1),
        h("rect", {
          className: cls("halo tafel-halo"),
          x: -6,
          y: -6,
          width: 232,
          height: 172,
          rx: 10,
        }),
      ),
    ),
  );
  add(box(TAFEL.x, 34, 14, 220, 12, 160, 4, "tafel"));

  // Schnitt der Tafel: Kopf mit Name, vier Fassungen für die Teile
  const siegelMitte = schnitt(SIEGEL.cx, SIEGEL.cz);
  const fassungen = TEILE.map((t) => ({ t, ...schnitt(t.x, t.z + t.hh) }));
  add(
    auf(
      FRONT(TAFEL.x, FRONT_Y, TAFEL.z1),
      h("rect", { className: cls("face recess"), x: 4, y: 4, width: 212, height: 152, rx: 6 }),
      h("circle", { className: cls("face kopf-avatar"), cx: 24, cy: 26, r: 13 }),
      h("path", { className: cls("kopf-glyph"), d: "M16 30L24 21L32 30M19 27V32M29 27V32" }),
      h("text", { className: cls("kopf-name"), x: 44, y: 25, fontSize: 11 }, name),
      h("text", { className: cls("kopf-kat"), x: 44, y: 37, fontSize: 7 }, kategorie),
      h("circle", { className: cls("fassung f1"), cx: siegelMitte.u, cy: siegelMitte.v, r: SIEGEL.r + 1 }),
      h("path", { className: cls("detail"), d: "M10 46H210" }),
      fassungen.map(({ t, u, v }) =>
        h("rect", { className: cls("fassung", `f${t.n}`), x: u, y: v, width: t.w, height: t.hh, rx: 2 }),
      ),
      [
        { nr: "01", x: siegelMitte.u, y: siegelMitte.v },
        ...fassungen.map(({ t, u, v }) => ({ nr: `0${t.n}`, x: u + t.w / 2, y: v + t.hh / 2 })),
      ].map(({ nr, x, y }) =>
        h("text", { className: cls("fassung-nr"), x, y: y + 2.4, fontSize: 7, textAnchor: "middle" }, nr),
      ),
    ),
  );

  /* ---------- Teile ---------- */
  const teil = (n: number, tiefe: number, inhalt: Kind, ballon: Knoten) => {
    const v = D(0, tiefe, 0);
    return h("g", { className: cls("teil", `t${n}`), style: { "--ex": `${f(v[0])}px`, "--ey": `${f(v[1])}px` } }, inhalt, ballon);
  };
  // Führungslinien von den Fassungsecken zur herausgezogenen Lage (hinter den Teilen)
  const fuehrung = (t: Teil) =>
    h("path", {
      className: cls("fuehrung", `fu${t.n}`),
      d: (
        [
          [t.x, t.z + t.hh],
          [t.x + t.w, t.z + t.hh],
          [t.x + t.w, t.z],
          [t.x, t.z],
        ] as const
      )
        .map(([x, z]) =>
          path3([
            [x, FRONT_Y, z],
            [x, FRONT_Y + t.tiefe, z],
          ]),
        )
        .join(""),
    });
  const ballon = (n: number, ax: number, ay: number, dx: number, dy: number, tiefe: number) => {
    const bx = ax + dx;
    const by = ay + dy;
    const v = D(0, tiefe, 0);
    merkSchirm([bx - 12, by - 12], [bx + 12, by + 12], [bx + v[0] - 12, by + v[1] - 12], [bx + v[0] + 12, by + v[1] + 12]);
    return h(
      "g",
      { className: cls("ballon", `b${n}`) },
      h("path", { className: cls("ballon-linie"), d: `M${f(ax)} ${f(ay)}L${f(bx - Math.sign(dx) * 11)} ${f(by)}` }),
      h("circle", { className: cls("ballon-kreis"), cx: f(bx), cy: f(by), r: 11 }),
      h("text", { className: cls("ballon-nr"), x: f(bx), y: f(by + 3.4), fontSize: 9.5, textAnchor: "middle" }, `0${n}`),
    );
  };
  // Ballon an der Seitenkante, auf halber Höhe des Teils
  const ballonAn = (t: Teil) => {
    const a = P(t.ballonLinks ? t.x : t.x + t.w, FRONT_Y + 5, t.z + t.hh / 2);
    return ballon(t.n, a[0], a[1], t.ballonLinks ? -40 : 40, 0, t.tiefe);
  };
  for (const t of TEILE) {
    add(fuehrung(t));
    merk([t.x, FRONT_Y + t.tiefe + 5, t.z], [t.x + t.w, FRONT_Y + t.tiefe + 5, t.z + t.hh]);
  }
  // Siegel-Scheibe: Führung von der runden Fassung
  add(
    h("path", {
      className: cls("fuehrung fu1"),
      d: [0, 1, 2, 3]
        .map((i) => {
          const a = (i * Math.PI) / 2 + Math.PI / 4;
          const x = SIEGEL.cx + SIEGEL.r * Math.cos(a);
          const z = SIEGEL.cz + SIEGEL.r * Math.sin(a);
          return path3([
            [x, FRONT_Y, z],
            [x, FRONT_Y + SIEGEL.tiefe, z],
          ]);
        })
        .join(""),
    }),
  );

  const scheibe = () => {
    const { cx, cz, r } = SIEGEL;
    const y0 = FRONT_Y;
    const y1 = FRONT_Y + 5;
    const n = 28;
    const vorn: [number, number][] = [];
    const hinten: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      vorn.push(P(cx + r * Math.cos(a), y1, cz + r * Math.sin(a)));
      hinten.push(P(cx + r * Math.cos(a), y0, cz + r * Math.sin(a)));
    }
    merk([cx - r, y1 + SIEGEL.tiefe, cz - r], [cx + r, y1 + SIEGEL.tiefe, cz + r]);
    return [
      h("path", { className: cls("face teil-flaeche"), d: d2(k.huelle(vorn.concat(hinten))) + "Z" }),
      h("path", { className: cls("face teil-front"), d: d2(vorn) + "Z" }),
      auf(FRONT(cx, y1, cz), h("path", { className: cls("teil-zeichen"), d: "M-4.4 0.4L-1.2 3.6L4.6 -3.4" })),
    ];
  };

  // Was auf der Front jedes Teils steht, im Maß des Teils (u nach rechts, v nach unten)
  const aufschrift: Record<Teil["n"], Kind[]> = {
    2: [
      h("path", { className: cls("teil-zeichen"), d: "M9 13.5c0-2.6 1.4-4.2 3.6-4.8M15.6 13.5c0-2.6 1.4-4.2 3.6-4.8" }),
      h("path", { className: cls("teil-linie"), d: "M26 12H112M26 20H104M26 28H110M26 36H92M26 44H70" }),
    ],
    3: [
      h("text", { className: cls("teil-text"), x: 8, y: 20.5, fontSize: 10 }, wertung),
      [0, 1, 2, 3, 4].map((i) => stern(34 + i * 14, 16.5, 5.4, "teil-stern")),
      h("text", { className: cls("teil-text leise"), x: 104, y: 20.5, fontSize: 8, textAnchor: "middle" }, `(${anzahl})`),
    ],
    4: [
      h("path", { className: cls("teil-linie"), d: "M0 10H62" }),
      [6, 11, 16].map((u) => h("circle", { className: cls("teil-punkt"), cx: u, cy: 5, r: 1.6 })),
      h("rect", { className: cls("teil-feld"), x: 6, y: 16, width: 50, height: 28, rx: 2 }),
      h("path", { className: cls("teil-zeichen"), d: "M20 38L31 27L42 38M24 35V42M38 35V42" }),
      h("path", { className: cls("teil-linie"), d: "M6 54H52M6 62H44M6 70H48" }),
      h("rect", { className: cls("teil-knopf"), x: 6, y: 78, width: 28, height: 9, rx: 4.5 }),
    ],
  };
  for (const t of TEILE) {
    const platte = box(t.x, FRONT_Y, t.z, t.w, 5, t.hh, 0, "teil-flaeche");
    const front = auf(FRONT(t.x, FRONT_Y + 5, t.z + t.hh), ...aufschrift[t.n]);
    add(teil(t.n, t.tiefe, [platte, front], ballonAn(t)));
  }
  const a1 = P(SIEGEL.cx + SIEGEL.r, FRONT_Y + 5, SIEGEL.cz);
  add(teil(1, SIEGEL.tiefe, scheibe(), ballon(1, a1[0], a1[1], 40, -6, SIEGEL.tiefe)));

  const bb = k.bbox(18);
  const defs = h("defs", {}, filterDefs(bb, ids, { rand: 40, bloom: 10 }));
  return {
    viewBox: bb.viewBox,
    klasse: css.bp,
    ids,
    stil: { "--f-bp-soft": `url(#${ids.soft})`, "--f-bp-bloom": `url(#${ids.bloom})` },
    knoten: [defs, ...knoten],
  };
}
