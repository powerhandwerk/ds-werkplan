/**
 * Bausteine der Produktzeichen: isometrische Zeichen für Produkte und
 * Werkzeuge, die Kunden beim Namen nennen. Sie teilen Werkzeug und Projektion
 * mit den Leistungskarten (`werkzeug()` aus der Engine), sind aber kein
 * Grafikstil A: keine Bühne, keine Geste, eigene Strichstärken.
 *
 * Jede Figur zeichnet mit diesen Bausteinen und gibt Klassen statt Farben aus;
 * die Farben und Strichstärken setzt `produktzeichen.module.css` je Untergrund
 * und optischer Größe:
 *
 * - `f` Vorderseite, `s` Seite, `o` Oberseite (Fläche mit Kontur)
 * - `k` Kontur ohne Fläche, `th` feine Linie
 * - `wf` setzt die Grundstärke einer Kontur auf die feine Linie
 * - `kv` Fläche in Konturfarbe, `tv` Fläche in Farbe der feinen Linie, `sv` Seite ohne Kontur
 * - `a` Lime-Fläche, `ar` Kontur in Lime-Randfarbe, `al` Lime-Linie, `ad` Linie auf Lime
 * - `ku` dunkle Unterlage einer Lime-Linie (nur Papier)
 * - `av` volle Lime-Marke, `am` ihre Kante, `ak` Zeichen darauf
 * - `gl` Glühen (nur Nacht), `b` Boden gestrichelt, `pt` Staub, `sch` Schatten
 * - `z` Zeiger, `fk` KI-Funke, `t1` bis `t3` Farbfelder
 *
 * Das eine Lime-Motiv steht in `<g class="motiv">` (siehe `zeichenMotiv`).
 * Die Bildmarke Pin geht mit unveränderten Pfaden per `transform` ins Bild,
 * nie durch die Projektion.
 */
import { ebeneAusBild, maskiere, ruheWert, werkzeug, type Mess, type Pkt, type Szene, type Werkzeug } from "./leistungskarten-engine";
import { stern, type Ebene } from "./leistungskarten-formen";

/* ---------- Strichstärken ---------- */

const stilAttribut = (erste: string, zusatz: string) => `style="${erste}${zusatz ? `;${zusatz}` : ""}"`;

/** Strich relativ zur optischen Größe: `m` mal die Grundstärke der Klasse. */
export const strichMal = (m: number, zusatz = "") => stilAttribut(`--m:${m}`, zusatz);

/** Feste Strichstärke in Bildeinheiten, gleich bei jeder optischen Größe. */
export const strichFest = (breite: number, zusatz = "") => stilAttribut(`stroke-width:${breite}`, zusatz);

const zahl = (v: number) => v.toFixed(2);

/* ---------- Bildschirmparallele Teile ---------- */

/** Erweitert den Bildausschnitt um einen Bildpunkt (für Teile, die nicht durch `P` laufen). */
export function zeichenPunkt(w: Werkzeug, bx: number, by: number): void {
  const [x, y] = ebeneAusBild(bx, by);
  w.P(x, y, 0);
}

type BildPunkte = readonly (readonly [number, number])[];

const bildPfad = (punkte: BildPunkte, cls: string, stil: string, ende: string) =>
  `<path class="${maskiere(cls)}" ${stil} d="M ${punkte.map(([x, y]) => `${zahl(x)} ${zahl(y)}`).join(" L ")}${ende}"/>`;

/** Geschlossene Fläche aus Bildpunkten, für bildschirmparallele Teile wie den Zeiger. */
export const zeichenBildFlaeche = (punkte: BildPunkte, cls: string, stil = "") => bildPfad(punkte, cls, stil, " Z");

/** Offene Linie aus Bildpunkten. */
export const zeichenBildLinie = (punkte: BildPunkte, cls: string, stil = "") => bildPfad(punkte, cls, stil, "");

/* ---------- Ebenen und Tafeln ---------- */

/** Abgerundetes Rechteck in Flächenkoordinaten (u nach rechts, v nach oben), n Punkte je Ecke. */
export function rundRechteck(u: number, v: number, bw: number, bh: number, r: number, n = 6): [number, number][] {
  const rr = Math.min(r, bw / 2, bh / 2);
  const ecken: [number, number, number][] = [
    [u + bw - rr, v + bh - rr, 0],
    [u + rr, v + bh - rr, 90],
    [u + rr, v + rr, 180],
    [u + bw - rr, v + rr, 270],
  ];
  const out: [number, number][] = [];
  for (const [cx, cy, a0] of ecken) {
    for (let i = 0; i <= n; i++) {
      const a = ((a0 + (90 * i) / n) * Math.PI) / 180;
      out.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
    }
  }
  return out;
}

/** Ebene Fläche im Raum: Ursprung `o`, Achse `eu` nach rechts, `ev` nach oben. */
export function zeichenEbene(w: Werkzeug, o: Pkt, eu: Pkt, ev: Pkt) {
  const q = (u: number, v: number) => [o[0] + u * eu[0] + v * ev[0], o[1] + u * eu[1] + v * ev[1], o[2] + u * eu[2] + v * ev[2]];
  const E: Ebene = q;
  const shape = (lst: readonly (readonly [number, number])[], cls: string, stil = "") => w.flaeche(lst.map(([a, b]) => q(a, b)), cls, stil);
  const path = (lst: readonly (readonly [number, number])[], cls: string, stil = "") => w.linie(lst.map(([a, b]) => q(a, b)), cls, stil);
  return {
    q,
    E,
    shape,
    path,
    rect: (u: number, v: number, bw: number, bh: number, cls: string, stil = "") =>
      shape([[u, v], [u + bw, v], [u + bw, v + bh], [u, v + bh]], cls, stil),
    rrect: (u: number, v: number, bw: number, bh: number, r: number, cls: string, stil = "") => shape(rundRechteck(u, v, bw, bh, r), cls, stil),
    line: (u1: number, v1: number, u2: number, v2: number, cls: string, stil = "") => path([[u1, v1], [u2, v2]], cls, stil),
    kreis: (u: number, v: number, rad: number, cls: string, stil = "") =>
      shape(
        Array.from({ length: 28 }, (_, i) => [u + rad * Math.cos((2 * Math.PI * i) / 28), v + rad * Math.sin((2 * Math.PI * i) / 28)] as const),
        cls,
        stil,
      ),
  };
}

export type ZeichenEbene = ReturnType<typeof zeichenEbene>;

/**
 * Stehende Tafel (Seite, Bildschirm, Karte, Block): Breite entlang x, Höhe
 * entlang z, Dicke nach hinten (−y). Sichtbar sind Vorderseite, rechte Kante
 * und Oberkante.
 */
export function zeichenTafel(w: Werkzeug, x: number, y: number, z: number, bw: number, bh: number, t = 1.6) {
  const f = zeichenEbene(w, [x, y, z], [1, 0, 0], [0, 0, 1]);
  const koerper = () =>
    w.flaeche([[x + bw, y, z], [x + bw, y - t, z], [x + bw, y - t, z + bh], [x + bw, y, z + bh]], "s") +
    w.flaeche([[x, y, z + bh], [x + bw, y, z + bh], [x + bw, y - t, z + bh], [x, y - t, z + bh]], "o") +
    w.flaeche([[x, y, z], [x + bw, y, z], [x + bw, y, z + bh], [x, y, z + bh]], "f");
  return { f, koerper };
}

/**
 * Stehende Tafel mit runden Ecken (Handy, Sprechblase, Münze): Vorderseite,
 * um die Dicke versetzte Rückseite und die zwei Tangenten rechts. `zipfel`
 * sind Flächenpunkte, die an der Unterkante links eingesetzt werden.
 * `koerper(true)` zeichnet die Tafel als Lime-Fläche.
 */
export function zeichenRundTafel(
  w: Werkzeug,
  x: number,
  y: number,
  z: number,
  bw: number,
  bh: number,
  r: number,
  t = 1.8,
  zipfel: readonly (readonly [number, number])[] = [],
) {
  const f = zeichenEbene(w, [x, y, z], [1, 0, 0], [0, 0, 1]);
  const hinten = zeichenEbene(w, [x, y - t, z], [1, 0, 0], [0, 0, 1]);
  const umriss = (): (readonly [number, number])[] => {
    const lst = rundRechteck(0, 0, bw, bh, r);
    if (!zipfel.length) return lst;
    const unten = lst.findIndex(([, b]) => b <= 0.001);
    const i = unten >= 0 ? unten : Math.floor((lst.length * 3) / 4);
    return [...lst.slice(0, i + 1), ...zipfel, ...lst.slice(i + 1)];
  };
  const koerper = (lime = false) => {
    const rand = lime ? " ar" : "";
    const u = umriss();
    return (
      hinten.shape(u, `s${rand}`) +
      w.flaeche([[x + bw, y, z + bh - r], [x + bw, y - t, z + bh - r], [x + bw, y - t, z + r], [x + bw, y, z + r]], "sv") +
      w.linie([[x + bw, y, z + bh - r], [x + bw, y - t, z + bh - r]], `k${rand}`) +
      w.linie([[x + bw, y, z + r], [x + bw, y - t, z + r]], `k${rand}`) +
      f.shape(u, lime ? "a" : "f")
    );
  };
  return { f, koerper };
}

/**
 * Stehender Zylinder auf der Ebene z (Stempel, Knopf): sichtbare Mantelhälfte
 * und Deckel, Klassen für Deckel und Mantel.
 */
export function zeichenZylinder(w: Werkzeug, cx: number, cy: number, z: number, rad: number, hoehe: number, deckel: string, mantel: string) {
  const schritte = 32;
  const winkel = Array.from({ length: schritte }, (_, i) => (2 * Math.PI * i) / schritte);
  const oben = winkel.map((a) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a), z + hoehe]);
  const unten = winkel.map((a) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a), z]);
  const bildX = (p: Pkt) => w.P(p[0], p[1], p[2])[0];
  const vorne = winkel.map((a, i) => (Math.cos(a) + Math.sin(a) > -0.05 ? i : -1)).filter((i) => i >= 0);
  for (const p of [...oben, ...unten]) bildX(p);
  const seiteUnten = vorne.map((i) => unten[i]).sort((a, b) => bildX(a) - bildX(b));
  const seiteOben = vorne.map((i) => oben[i]).sort((a, b) => bildX(b) - bildX(a));
  return w.flaeche([...seiteUnten, ...seiteOben], mantel) + w.flaeche(oben, deckel);
}

/* ---------- Boden und Schatten ---------- */

/** Gestrichelte Bodenellipse mit drei Staubpunkten. */
export function zeichenBoden(w: Werkzeug, cx: number, cy: number, radius: number, z = 0): string {
  const rad = radius * 0.8;
  const [x, y] = w.P(cx, cy, z);
  const rx = 1.2247 * rad;
  const ry = 0.7071 * rad;
  zeichenPunkt(w, x - rx, y - ry);
  zeichenPunkt(w, x + rx, y + ry);
  let s = `<ellipse class="b" cx="${zahl(x)}" cy="${zahl(y)}" rx="${zahl(rx)}" ry="${zahl(ry)}"/>`;
  for (const [dx, dy] of [[-0.78, -0.42], [0.86, 0.3], [0.12, 0.93]]) {
    s += `<circle class="pt" cx="${zahl(x + dx * rx)}" cy="${zahl(y + dy * ry)}" r="0.55"/>`;
  }
  return s;
}

/** Weicher Bodenschatten unter schwebenden Teilen. */
export function zeichenSchatten(w: Werkzeug, cx: number, cy: number, radius: number): string {
  const [x, y] = w.P(cx, cy, 0);
  const rad = radius * 0.75;
  return `<ellipse class="sch" cx="${zahl(x)}" cy="${zahl(y)}" rx="${zahl(1.2247 * rad)}" ry="${zahl(0.7071 * rad)}"/>`;
}

/* ---------- Teile ---------- */

/** Browserleiste oben auf einer Tafel: Trennlinie und Punkte. */
export function zeichenBrowserleiste(f: ZeichenEbene, bw: number, bh: number, punkte = 3): string {
  let s = f.line(0, bh - 3.4, bw, bh - 3.4, "k", strichMal(0.8));
  for (let i = 0; i < punkte; i++) s += f.kreis(2.1 + i * 2.1, bh - 1.7, 0.62, "tv");
  return s;
}

/** Fünf Sterne in einer Reihe, über `stern` aus den Formen der Leistungskarten. */
export function zeichenSterne(w: Werkzeug, f: ZeichenEbene, u0: number, v: number, r: number, abstand: number, lime = true, anzahl = 5): string {
  let s = "";
  for (let i = 0; i < anzahl; i++) {
    const punkte = stern(f.E, u0 + i * abstand, v, r);
    s += lime ? w.flaeche(punkte, "a", strichMal(0.8)) : w.flaeche(punkte, "k wf");
  }
  return s;
}

/**
 * Das eine Lime-Motiv eines Zeichens: `leuchtend` glüht auf Nacht, `davor`
 * und `danach` gehören zum Motiv, glühen aber nicht (Unterlage, Zeichen auf Lime).
 */
export const zeichenMotiv = (leuchtend: string, danach = "", davor = "") =>
  `<g class="motiv">${davor}<g class="gl">${leuchtend}</g>${danach}</g>`;

/**
 * Bildschirmparallele Lime-Marke als Münze mit Kante, darauf ein Pfeil nach
 * oben oder ein Haken. Liefert ein ganzes Motiv.
 */
export function zeichenMarke(w: Werkzeug, cx: number, cy: number, rad: number, zeichen: "pfeil" | "haken" = "pfeil"): string {
  zeichenPunkt(w, cx - rad, cy - rad);
  zeichenPunkt(w, cx + rad, cy + rad + 1.3);
  const muenze =
    `<ellipse class="am" cx="${zahl(cx)}" cy="${zahl(cy + 1.3)}" rx="${zahl(rad)}" ry="${zahl(rad)}"/>` +
    `<circle class="av" cx="${zahl(cx)}" cy="${zahl(cy)}" r="${zahl(rad)}"/>`;
  const d =
    zeichen === "pfeil"
      ? `M${zahl(cx)} ${zahl(cy + rad * 0.48)}V${zahl(cy - rad * 0.48)}M${zahl(cx - rad * 0.42)} ${zahl(cy - rad * 0.06)}` +
        `L${zahl(cx)} ${zahl(cy - rad * 0.48)}L${zahl(cx + rad * 0.42)} ${zahl(cy - rad * 0.06)}`
      : `M${zahl(cx - rad * 0.45)} ${zahl(cy + rad * 0.02)}L${zahl(cx - rad * 0.12)} ${zahl(cy + rad * 0.36)}` +
        `L${zahl(cx + rad * 0.47)} ${zahl(cy - rad * 0.3)}`;
  return zeichenMotiv(muenze, `<path class="ak" d="${d}"/>`);
}

/** KI-Funke mit nach innen gewölbten Seiten, bildschirmparallel, Mittelpunkt im Bild. */
export function zeichenKiFunke(w: Werkzeug, cx: number, cy: number, r: number): string {
  zeichenPunkt(w, cx - r, cy - r);
  zeichenPunkt(w, cx + r, cy + r);
  const k = r * 0.14;
  const d =
    `M${zahl(cx)} ${zahl(cy - r)}Q${zahl(cx + k)} ${zahl(cy - k)} ${zahl(cx + r)} ${zahl(cy)}` +
    `Q${zahl(cx + k)} ${zahl(cy + k)} ${zahl(cx)} ${zahl(cy + r)}Q${zahl(cx - k)} ${zahl(cy + k)} ${zahl(cx - r)} ${zahl(cy)}` +
    `Q${zahl(cx - k)} ${zahl(cy - k)} ${zahl(cx)} ${zahl(cy - r)}Z`;
  return `<path class="fk" d="${d}"/>`;
}

/** Pfade der Bildmarke Pin, unverändert aus `assets/pin.svg` (viewBox 0 0 45.59 62.85). */
export const PIN_PFADE: readonly { fill: string; d: string }[] = [
  {
    fill: "#b5e545",
    d: "M23.23,62.85h-.61c-.57-.1-1.2-.39-1.59-.87l-5.36-6.58c-4.97-6.1-11.25-16.13-13.89-23.57-.87-2.46-1.53-4.91-1.72-7.45C-.87,11.96,8.5.55,20.94.08l2.18-.08c12.22.14,22.26,10.15,22.39,22.48.06,5.19-2,10.57-4.3,15.23-4.23,8.57-10.44,16.88-16.62,24.14-.41.48-.85.76-1.36,1ZM34.22,22.75c0-6.33-5.13-11.46-11.46-11.46s-11.46,5.13-11.46,11.46,5.13,11.46,11.46,11.46,11.46-5.13,11.46-11.46Z",
  },
  { fill: "#fff", d: "M22.76,11.29c6.33,0,11.46,5.13,11.46,11.46s-5.13,11.46-11.46,11.46" },
  { fill: "#fff", d: "M23.05,34.49V11c-6.49,0-11.75,5.26-11.75,11.75s5.26,11.75,11.75,11.75Z" },
  {
    fill: "#88ac34",
    d: "M23.2,0h-.37v11.29c6.33,0,11.46,5.13,11.46,11.46s-5.13,11.46-11.46,11.46v28.64h.47c.51-.24.95-.52,1.36-1,6.18-7.26,12.39-15.57,16.62-24.14,2.3-4.66,4.36-10.03,4.3-15.23C45.46,10.15,35.42.14,23.2,0Z",
  },
  { fill: "#c5d8df", d: "M22.84,11v23.49c6.49,0,11.75-5.26,11.75-11.75s-5.26-11.75-11.75-11.75Z" },
];

const PIN_BREITE = 45.59;
const PIN_HOEHE = 62.85;
/** Lage der Spitze im Pin, waagerecht. */
const PIN_SPITZE = 23.0;

/**
 * Die Bildmarke Pin, Spitze am Szenenpunkt (x, y, z), `hoehe` in Bildeinheiten.
 * Bildschirmparallel per `transform`, ohne Rand. Gehört als Motiv in `zeichenMotiv`.
 */
export function zeichenBildmarke(w: Werkzeug, x: number, y: number, z: number, hoehe: number): string {
  const [sx, sy] = w.P(x, y, z);
  const k = hoehe / PIN_HOEHE;
  const tx = sx - PIN_SPITZE * k;
  const ty = sy - PIN_HOEHE * k;
  zeichenPunkt(w, tx, ty);
  zeichenPunkt(w, tx + PIN_BREITE * k, sy);
  const pfade = PIN_PFADE.map((p) => `<path fill="${p.fill}" d="${p.d}"/>`).join("");
  return `<g transform="translate(${zahl(tx)} ${zahl(ty)}) scale(${zahl(k)})">${pfade}</g>`;
}

/* ---------- Szene und Bildausschnitt ---------- */

/** Ein Produktzeichen als Szene der Engine: ohne Geste, eine Probe im Ruhezustand. */
export const zeichenSzene = (zeichne: (w: Werkzeug) => string): Szene => ({
  start: () => ({ t: 0 }),
  ruhe: { t: 0 },
  proben: [{ t: 0 }],
  zeichne: (_s, w) => zeichne(w),
});

/** Rand um die Figur als Anteil der Kantenlänge: 4 von 64. */
const RAND_ANTEIL = 4 / 64;

/**
 * Quadratischer Bildausschnitt eines Zeichens als viewBox-String: die Figur
 * mittig, die längere Seite füllt 56 von 64 Teilen. So bleiben Größe und
 * Strichstärke gleich, egal wie breit oder hoch die Figur ist.
 */
export function zeichenAusschnitt(szene: Szene): string {
  const mess: Mess = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
  const w = werkzeug(mess);
  const basis = ruheWert(szene);
  for (const p of szene.proben) szene.zeichne({ ...basis, ...p, gepr: 0 }, w);
  const bw = mess.x1 - mess.x0;
  const bh = mess.y1 - mess.y0;
  const seite = Math.max(bw, bh) / (1 - 2 * RAND_ANTEIL);
  const cx = mess.x0 + bw / 2;
  const cy = mess.y0 + bh / 2;
  return [cx - seite / 2, cy - seite / 2, seite, seite].map((v) => v.toFixed(2)).join(" ");
}
