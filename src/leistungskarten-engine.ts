/**
 * Zeichen-Engine der animierten Leistungskarten (Grafikstil A, ADR-262).
 * Port aus powerhandwerk-website, lib/werkplan/leistungskarten/engine.ts (keteso 923a5c4).
 *
 * Alles hier ist reine Funktion: kein DOM, kein globaler Zustand. Die
 * Ausdehnung einer Szene steckt in einem expliziten Mess-Objekt, das
 * `werkzeug()` gebunden bekommt. So rechnet der Server den Bildausschnitt aus
 * den projizierten Proben-Punkten, ohne Layout (Layout-Messungen liefern in
 * versteckten Rahmen und beim Server-Rendern nur Nullen).
 *
 * Neu gegenüber der Website: `flaeche()`, `linie()` und `text()` escapen die
 * Klasse (`text()` auch den Inhalt) und lassen als `stil` nur harmlose
 * Attribute zu. Im Paket sind Szenen Eingabe des Verbrauchers, und das Markup
 * geht per `innerHTML` ins SVG.
 */

export const C = Math.cos(Math.PI / 6);
export const TAU = Math.PI * 2;

/** Ein Punkt im Szenenraum: x nach rechts unten, y nach links unten, z nach oben. */
export type Pkt = readonly number[];

/** Ausdehnung einer Szene in Bildkoordinaten, gesammelt beim Vermessen. */
export type Mess = { x0: number; x1: number; y0: number; y1: number };

/**
 * Parameter einer Szene. `t` ist der Fortschritt der Geste (0 Ruhe, 1 Ende).
 *
 * `px`, `mx` und `ang` belegt der Motor, sobald die Szene sie in `ruhe` oder
 * `start` führt: Er setzt sie aus dem Zeiger, auf dem Handy fährt er sie selbst.
 */
export type SzenenWert = {
  t: number;
  /** Zeigerposition waagerecht, 0 bis 1. Handy: läuft beim Abspielen von 0 auf 0,85. */
  px?: number;
  /** Zeigerposition waagerecht, -1 bis 1. Handy: steht beim Abspielen auf 0,35. */
  mx?: number;
  /** Zeigerwinkel einer Uhr (siehe `uhrWinkel` in leistungskarten-formen); in Ruhe die Uhrzeit per `ruheImClient`. */
  ang?: number;
  /** Laufende Uhr in Sekunden für Szenen mit Dauerbewegung. */
  clk?: number;
  /** Bitmaske abgehakter Punkte, wird beim Zeichnen fortgeschrieben. */
  gepr?: number;
};

export type SzenenSchluessel = keyof SzenenWert;

export type Szene = {
  /** Szene bewegt sich dauerhaft, solange die Karte aktiv ist. */
  laufend?: boolean;
  /** Startwerte beim Einblenden. */
  start: () => SzenenWert;
  /** Ruhezustand, wie ihn der Server rendert. Muss deterministisch sein. */
  ruhe: SzenenWert;
  /** Ruhezustand, den nur der Client kennt (Uhrzeit), überschreibt `ruhe` nach dem Laden. */
  ruheImClient?: () => Partial<SzenenWert>;
  /** Extremzustände für die Vermessung des Bildausschnitts. */
  proben: readonly SzenenWert[];
  /**
   * Liefert das SVG-Innen-Markup. Darf `s.gepr` fortschreiben.
   *
   * Szenen liefern Geometrie, also Pfade und Kreise aus dem Werkzeug `w`.
   * Text kommt nur über `w.text()` ins Bild: das escapt Inhalt und Klasse.
   * Eigenes Markup mit Text darin umginge das Escapen, denn das Ergebnis geht
   * per `innerHTML` ins SVG.
   */
  zeichne: (s: SzenenWert, w: Werkzeug) => string;
};

/**
 * Eine Karte im Raster von `Leistungskarten`. `szene` ist ein Schlüssel im
 * Szenen-Register, das der Verbraucher übergibt.
 */
export type LeistungsKarte = {
  szene: string;
  titel: string;
  /** Kartentext unter der Bühne. */
  teaser: string;
  /** Laufende Nummer, etwa „001“, optional. */
  nr?: string;
  /** Bezug unter dem Text, etwa „schließt Pos. 01 und 02“, optional. */
  schliesst?: string;
};

export const klemm = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const plus = (p: Pkt, v: Pkt, f = 1): number[] => [p[0] + v[0] * f, p[1] + v[1] * f, p[2] + v[2] * f];
export const kreis = (cx: number, cy: number, z: number, r: number, n = 72): number[][] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * TAU), cy + r * Math.sin((i / n) * TAU), z]);
/** Deckkraft als Attribut-Zusatz für `flaeche`, `linie` und `text`. */
export const deck = (o: number) => `style="opacity:${o.toFixed(3)}"`;

const ZEICHEN: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapt `& < > " '` für Text und Attributwerte im Markup. */
export const maskiere = (wert: string) => wert.replace(/[&<>"']/g, (z) => ZEICHEN[z]);

/**
 * Erlaubter Attribut-Zusatz an `flaeche()`, `linie()` und `text()`: nur `style`, `opacity` und
 * `transform`, je in doppelten Anführungszeichen, ohne `< > & '` im Wert
 * (so liefert ihn `deck()`). Alles andere, etwa ein `on…`-Attribut, wird
 * abgewiesen: Escapen allein machte ein Attribut ohne Anführungszeichen nicht
 * harmlos.
 */
const STIL_ERLAUBT = /^(?:\s*(?:style|opacity|transform)="[^"<>&']*")*\s*$/;

/** Wirft, wenn `stil` mehr als die erlaubten Attribute trägt. */
function pruefeStil(art: string, stil: string): void {
  if (!STIL_ERLAUBT.test(stil)) {
    throw new Error(`${art}(): stil nur als style-, opacity- oder transform-Attribut, erhalten: ${JSON.stringify(stil)}`);
  }
}

/** Textanker im SVG. */
export type Anker = "start" | "middle" | "end";

// Geschätzte Textmaße der Beschriftungen beim Vermessen, in Bildeinheiten. Die
// Beschriftung (`.lbl`) steht bei etwa 8 Einheiten Schriftgröße; 4,4 je Zeichen
// ist die mittlere Laufweite, die Versalien ragen etwa 6 über die Grundlinie,
// Unterlängen etwa 3 darunter.
export const TEXT_ZEICHENBREITE = 4.4;
const TEXT_OBERLAENGE = 6;
const TEXT_UNTERLAENGE = 3;
/** Anteil der Textbreite links vom Ankerpunkt. */
const LINKS_VOM_ANKER: Record<Anker, number> = { start: 0, middle: 0.5, end: 1 };

/**
 * Zeichenwerkzeug, gebunden an ein Mess-Objekt (oder `null` beim normalen
 * Zeichnen). Jede Projektion erweitert beim Vermessen die Ausdehnung.
 */
export function werkzeug(mess: Mess | null) {
  const P = (x: number, y: number, z: number): [number, number] => {
    const q: [number, number] = [(x - y) * C, (x + y) * 0.5 - z];
    if (mess) {
      mess.x0 = Math.min(mess.x0, q[0]);
      mess.x1 = Math.max(mess.x1, q[0]);
      mess.y0 = Math.min(mess.y0, q[1]);
      mess.y1 = Math.max(mess.y1, q[1]);
    }
    return q;
  };
  const fmt = (p: Pkt) => {
    const q = P(p[0], p[1], p[2]);
    return q[0].toFixed(2) + " " + q[1].toFixed(2);
  };
  const pfad = (arr: readonly Pkt[], zu: boolean) => "M " + arr.map(fmt).join(" L ") + (zu ? " Z" : "");
  /** Pfad mit escapter Klasse; `stil` wie bei `text()` nur harmlose Attribute. */
  const pfadElement = (art: string, arr: readonly Pkt[], cls: string, stil: string, zu: boolean) => {
    pruefeStil(art, stil);
    return `<path class="${maskiere(cls)}" ${stil} d="${pfad(arr, zu)}"/>`;
  };
  const flaeche = (arr: readonly Pkt[], cls: string, stil = "") => pfadElement("flaeche", arr, cls, stil, true);
  const linie = (arr: readonly Pkt[], cls: string, stil = "") => pfadElement("linie", arr, cls, stil, false);
  const staub = (liste: readonly Pkt[]) =>
    liste
      .map((p) => {
        const q = P(p[0], p[1], p[2]);
        return `<circle class="pt" cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="0.9"/>`;
      })
      .join("");
  /**
   * Beschriftung an einem Szenenpunkt; beim Vermessen wird die Textbreite
   * geschätzt. `inhalt` und `cls` werden escapt; `stil` nimmt nur harmlose
   * Attribute wie aus `deck()` und wirft sonst einen Fehler.
   */
  const text = (p: Pkt, dx: number, dy: number, inhalt: string, cls: string, stil = "", anker: Anker = "start") => {
    pruefeStil("text", stil);
    const q = P(p[0], p[1], p[2]);
    const x = q[0] + dx;
    const y = q[1] + dy;
    if (mess) {
      const breite = inhalt.length * TEXT_ZEICHENBREITE;
      const links = x - breite * LINKS_VOM_ANKER[anker];
      mess.x0 = Math.min(mess.x0, links);
      mess.x1 = Math.max(mess.x1, links + breite);
      mess.y0 = Math.min(mess.y0, y - TEXT_OBERLAENGE);
      mess.y1 = Math.max(mess.y1, y + TEXT_UNTERLAENGE);
    }
    return `<text class="${maskiere(cls)}" ${stil} x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${maskiere(anker)}">${maskiere(inhalt)}</text>`;
  };
  return { P, pfad, flaeche, linie, staub, text };
}

export type Werkzeug = ReturnType<typeof werkzeug>;

/** Werkzeug ohne Messung; zustandslos, darf daher geteilt werden. */
const ZEICHNER = werkzeug(null);

/** Rand um den vermessenen Bildausschnitt, in Bildeinheiten. */
const RAND = 12;

/** Grundwerte einer Szene: Start, überschrieben vom Ruhezustand des Servers. */
export function ruheWert(szene: Szene): SzenenWert {
  return { ...szene.start(), ...szene.ruhe };
}

/** Bildausschnitt einer Szene als viewBox-String, allein aus den Proben gerechnet. */
export function vermesse(szene: Szene): string {
  const mess: Mess = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
  const w = werkzeug(mess);
  const basis = ruheWert(szene);
  for (const p of szene.proben) szene.zeichne({ ...basis, ...p, gepr: 0 }, w);
  return [mess.x0 - RAND, mess.y0 - RAND, mess.x1 - mess.x0 + 2 * RAND, mess.y1 - mess.y0 + 2 * RAND]
    .map((v) => v.toFixed(1))
    .join(" ");
}

/** SVG-Innen-Markup einer Szene im Zustand `wert` (der Motor übergibt seinen eigenen Wert, `gepr` bleibt so erhalten). */
export function zeichne(szene: Szene, wert: SzenenWert): string {
  return szene.zeichne(wert, ZEICHNER);
}

/** Ruhezustand für das Server-HTML: deterministisch, auf einer Kopie gezeichnet. */
export function zeichneRuhe(szene: Szene): string {
  return zeichne(szene, ruheWert(szene));
}

/* ---------- Motor-Bausteine (rein, der Motor in Leistungskarten.tsx ruft sie) ---------- */

/** Schwelle, unter der ein Wert als angekommen gilt. */
const RUHIG = 0.0015;

/**
 * Werte, die kein Ziel ansteuern: `clk` treibt der Motor-Takt vorwärts,
 * `gepr` schreibt die Szene beim Zeichnen fort. Würde `naehere` sie zum Ziel
 * ziehen, stünde die Uhr nach wenigen Bildern still.
 */
const OHNE_ZIEL: ReadonlySet<SzenenSchluessel> = new Set(["clk", "gepr"]);

/** Winkeldifferenz auf (−π, π]: der kürzere Weg auf dem Kreis. */
const kreisDiff = (d: number) => d - TAU * Math.ceil((d - Math.PI) / TAU);

/**
 * Zieht jeden Wert einen Schritt in Richtung Ziel. Bei reduzierter Bewegung
 * springt er sofort. Liefert, ob sich etwas bewegt hat.
 *
 * Der Zeigerwinkel `ang` nimmt den kürzeren Weg auf dem Kreis (von 23 auf 0 Uhr
 * eine Stunde vorwärts, nicht fast eine Runde zurück). Unterwegs kann er
 * deshalb kurz außerhalb des Bereichs von `uhrWinkel` liegen; am Ziel steht
 * wieder genau der Zielwert.
 */
export function naehere(wert: SzenenWert, ziel: SzenenWert, reduziert: boolean): boolean {
  let bewegt = false;
  for (const key of Object.keys(ziel) as SzenenSchluessel[]) {
    if (OHNE_ZIEL.has(key)) continue;
    const soll = ziel[key];
    if (soll === undefined) continue;
    const ist = wert[key] ?? soll;
    const kreis = key === "ang";
    const diff = kreis ? kreisDiff(soll - ist) : soll - ist;
    if (Math.abs(diff) > RUHIG) {
      wert[key] = reduziert ? soll : ist + diff * (kreis ? 0.16 : 0.1);
      bewegt = true;
    } else wert[key] = soll;
  }
  return bewegt;
}

/** Zeigerparameter aus der relativen Zeigerposition in der Karte (0 bis 1). */
export function zeigerZiel(ziel: SzenenWert, relX: number) {
  if ("px" in ziel) ziel.px = klemm((relX - 0.15) / 0.7);
  if ("mx" in ziel) ziel.mx = klemm((relX - 0.5) * 2.4, -1, 1);
}

/** Kippwinkel der Karte (Grad) aus der relativen Zeigerposition. */
export function kippung(relX: number, relY: number): { rx: number; ry: number } {
  return { rx: (0.5 - relY) * 8, ry: (relX - 0.5) * 10 };
}

/** Umkehrung der Projektion auf die Ebene z = 0: Bildpunkt zu Szenenpunkt (x, y). */
export function ebeneAusBild(bx: number, by: number): [number, number] {
  return [(bx / C + by / 0.5) / 2, (by / 0.5 - bx / C) / 2];
}
