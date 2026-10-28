/**
 * Formen-Helfer für neue Szenen der Leistungskarten (Grafikstil A, ADR-262).
 * Port aus powerhandwerk-website, lib/werkplan/leistungskarten/szenen.ts (keteso 923a5c4).
 *
 * Jede neue Figur entsteht mit diesen Helfern und dem Werkzeug der Engine,
 * nie freihand: so bleiben Isometrie (30°), Strichstärken und Klassen gleich.
 * Klassen im Markup (Stil im CSS-Modul der Karten): f Fläche, l Linie,
 * d gestrichelt, th fein, a Lime-Fläche, al Lime-Linie, ag Lime ohne Kontur,
 * gl Schein, zeiger, pt Staubpunkt, lbl Beschriftung, uhr Zeitanzeige.
 */
import { TAU, type Werkzeug } from "./leistungskarten-engine";

/** Abbildung einer senkrechten Ebene: a entlang x, b nach oben, Ergebnis ein Szenenpunkt. */
export type Ebene = (a: number, b: number) => number[];

/**
 * Punkt in einer senkrechten Ebene y = konstant: a entlang x, b nach oben.
 * Für alles, was wie ein Blatt, Schild oder Bildschirm zum Betrachter steht.
 */
export const inEbene =
  (y: number): Ebene =>
  (a, b) => [a, y, b];

/** Rechteck in einer Ebene, etwa ein Bildfeld, ein Knopf oder ein Fenster. */
export const rechteck = (E: Ebene, a0: number, a1: number, b0: number, b1: number) => [
  E(a0, b0),
  E(a1, b0),
  E(a1, b1),
  E(a0, b1),
];

/**
 * Zackenfigur in einer Ebene: n Spitzen, Innenradius als Anteil von r. Liefert
 * eine Funktion für Mittelpunkt und Radius; Grundlage von `stern`.
 */
export const zacken =
  (n: number, innen: number) =>
  (E: Ebene, ca: number, cb: number, r: number) =>
    Array.from({ length: 2 * n }, (_, i) => {
      const wi = Math.PI / 2 + (i / (2 * n)) * TAU;
      const ri = i % 2 ? r * innen : r;
      return E(ca + ri * Math.cos(wi), cb + ri * Math.sin(wi));
    });

/** Stern mit fünf Zacken in einer Ebene, etwa für Bewertungen. */
export const stern = zacken(5, 0.45);

/** Sprechblase mit abgerundeten Ecken und Zipfel an der Unterkante, für Nachrichten und Antworten. */
export const blase = (E: Ebene, a0: number, a1: number, b0: number, b1: number, zipfel: number, r = 4) => {
  const out: number[][] = [];
  const bogen = (ca: number, cb: number, w0: number) => {
    for (let i = 0; i <= 6; i++) {
      const wi = w0 + (i / 6) * (Math.PI / 2);
      out.push(E(ca + r * Math.cos(wi), cb + r * Math.sin(wi)));
    }
  };
  bogen(a1 - r, b0 + r, -Math.PI / 2);
  bogen(a1 - r, b1 - r, 0);
  bogen(a0 + r, b1 - r, Math.PI / 2);
  bogen(a0 + r, b0 + r, Math.PI);
  // Zipfel: von der Unterkante schräg nach unten
  out.push(E(zipfel - 3, b0), E(zipfel - 5, b0 - 7), E(zipfel + 4, b0));
  return out;
};

/**
 * Senkrechte Platte mit sichtbarer Stirnseite rechts und Oberkante, etwa eine
 * Profilkarte, ein Bildschirm oder ein Schild mit Tiefe.
 */
export const platte = (w: Werkzeug, y: number, a0: number, a1: number, b0: number, b1: number, tiefe: number, cls = "f", stil = "") =>
  w.flaeche([[a1, y - tiefe, b0], [a1, y, b0], [a1, y, b1], [a1, y - tiefe, b1]], cls, stil) +
  w.flaeche([[a0, y - tiefe, b1], [a1, y - tiefe, b1], [a1, y, b1], [a0, y, b1]], cls, stil) +
  w.flaeche(rechteck(inEbene(y), a0, a1, b0, b1), cls, stil);

/** Maße eines Hauses: Länge X, Tiefe Y, Traufhöhe H, Firsthöhe F, Dachüberstand ue, Versatz ox/oy. */
export type HausMasse = { X: number; Y: number; H: number; F: number; ue?: number; ox?: number; oy?: number; oeffnungen?: boolean };

/**
 * Satteldach-Haus, First parallel zu x, für Szenen rund um Dach und Gebäude.
 * Liefert die Hülle als Markup (`o`), die vordere Dachfläche als Funktion
 * (`dach`) und Hilfen, um Teile auf das Dach zu setzen (`vorn`, `zDach`).
 */
export function haus(w: Werkzeug, { X, Y, H, F, ue = 4, ox = 0, oy = 0, oeffnungen = true }: HausMasse) {
  const { flaeche } = w;
  const ym = Y / 2;
  const k = (F - H) / ym;
  const zE = H - ue * k;
  const Q = (x: number, y: number, z: number) => [ox + x, oy + y, z];
  const vorn = (u: number, x: number) => [ox + x, oy + (Y + ue) - (ym + ue) * u, zE + (F - zE) * u];
  const hinten = (u: number, x: number) => [ox + x, oy - ue + (ym + ue) * u, zE + (F - zE) * u];
  const zDach = (y: number) => F - (y - ym) * k;
  let o = flaeche([hinten(0, -3), hinten(0, X + 3), hinten(1, X + 3), hinten(1, -3)], "f");
  o += flaeche([Q(0, Y, 0), Q(X, Y, 0), Q(X, Y, H), Q(0, Y, H)], "f");
  o += flaeche([Q(X, 0, 0), Q(X, Y, 0), Q(X, Y, H), Q(X, ym, F), Q(X, 0, H)], "f");
  if (oeffnungen) {
    const zt = Math.min(20, H - 6);
    o += flaeche([Q(X * 0.14, Y, 0), Q(X * 0.14 + 10, Y, 0), Q(X * 0.14 + 10, Y, zt), Q(X * 0.14, Y, zt)], "l");
    const zf = H * 0.42;
    if (zf + 10 < H - 2)
      for (const fx of [X * 0.45, X * 0.72])
        o += flaeche([Q(fx, Y, zf), Q(fx + 10, Y, zf), Q(fx + 10, Y, zf + 10), Q(fx, Y, zf + 10)], "l");
    if (zf + 10 < H - 2)
      o += flaeche([Q(X, Y * 0.3, zf), Q(X, Y * 0.3 + 10, zf), Q(X, Y * 0.3 + 10, zf + 10), Q(X, Y * 0.3, zf + 10)], "l");
  }
  const dach = () => flaeche([vorn(0, -3), vorn(0, X + 3), vorn(1, X + 3), vorn(1, -3)], "f");
  return { o, vorn, zDach, ym, zE, Q, dach };
}

/* ---------- Uhr: Szenen mit Zeiger (`ang`) ---------- */

/** Winkel von 0 Uhr auf einem 24-Stunden-Zifferblatt: zeigt im Bild nach oben. */
export const A0 = (-3 * Math.PI) / 4;

/**
 * Winkel der aktuellen Uhrzeit, für `ruheImClient` einer Szene mit Uhr. Nur
 * im Client aufrufen: im Server-HTML wiche die Hydration je nach Minute ab,
 * dort steht ein fester Winkel in `ruhe`.
 */
export function jetztWinkel(d: Date): number {
  return A0 + ((d.getHours() + d.getMinutes() / 60) / 24) * TAU;
}

/**
 * Zeigerwinkel aus einem Punkt der Zifferblatt-Ebene (z = 0), auf volle
 * Stunden gerastert. Der Motor ruft das mit `ebeneAusBild` der Zeigerposition,
 * sobald eine Szene `ang` trägt.
 */
export function uhrWinkel(x: number, y: number): number {
  let wi = Math.atan2(y, x);
  while (wi < A0) wi += TAU;
  while (wi >= A0 + TAU) wi -= TAU;
  const schritt = TAU / 24; // springt Stunde für Stunde
  let ang = A0 + Math.round((wi - A0) / schritt) * schritt;
  if (ang >= A0 + TAU) ang -= schritt;
  return ang;
}
