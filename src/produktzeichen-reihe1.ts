/**
 * Produktzeichen 01 bis 06: One-Pager, Website, Feinschliff, Datei-Anfrage,
 * Kundenseite, Monatsbericht. Jede Figur zeichnet mit den Bausteinen aus
 * `produktzeichen-formen` und hat genau ein Lime-Motiv.
 */
import type { Szene, Werkzeug } from "./leistungskarten-engine";
import {
  strichFest,
  strichMal,
  zeichenBildFlaeche,
  zeichenBildLinie,
  zeichenBoden,
  zeichenBrowserleiste,
  zeichenEbene,
  zeichenMarke,
  zeichenMotiv,
  zeichenPunkt,
  zeichenSchatten,
  zeichenSzene,
  zeichenTafel,
  zeichenZylinder,
  type ZeichenEbene,
} from "./produktzeichen-formen";

/** 01 · Eine lange Seite: hohe Browserseite, Kopfbild leuchtet, Bildlauf rechts. */
function onepager(w: Werkzeug): string {
  const bw = 18;
  const h = 33;
  const t = zeichenTafel(w, 0, 0, 0, bw, h, 1.8);
  const f = t.f;
  let s = zeichenBoden(w, 9, -1, 15.5);
  s += t.koerper();
  s += zeichenBrowserleiste(f, bw, h);
  s += zeichenMotiv(f.rrect(2, h - 13.2, bw - 5.2, 8, 1.1, "a"));
  s += f.line(2, h - 16.2, 12, h - 16.2, "th", strichMal(1.4));
  s += f.line(2, h - 18.6, 9.6, h - 18.6, "th");
  s += f.rrect(2, h - 23.4, 6.4, 2.6, 1.3, "k wf");
  s += f.line(2, h - 27, 11, h - 27, "th");
  s += f.line(2, h - 29.2, 8.2, h - 29.2, "th");
  // Bildlaufleiste: die Seite ist länger als das Fenster
  s += f.line(bw - 1.6, h - 5.6, bw - 1.6, 2, "th", `${strichMal(0.8)} opacity="0.6"`);
  s += f.line(bw - 1.6, h - 6.2, bw - 1.6, h - 12.5, "k", strichFest(1.6));
  return s;
}

/** 02 · Vier Seiten hintereinander, die vorderste mit leuchtendem Kopfbild. */
function website(w: Werkzeug): string {
  const bw = 20;
  const h = 26;
  let s = zeichenBoden(w, 10, -6, 17);
  for (let i = 3; i >= 0; i--) {
    const t = zeichenTafel(w, 0, -i * 4.2, 0, bw, h, 1.4);
    const f = t.f;
    s += t.koerper();
    s += zeichenBrowserleiste(f, bw, h);
    if (i === 0) {
      s += zeichenMotiv(f.rrect(2, h - 11.6, bw - 4, 6.6, 1, "a"));
      s += f.line(2, h - 14.4, 13, h - 14.4, "th", strichMal(1.4));
      s += f.line(2, h - 16.6, 10, h - 16.6, "th");
      for (let j = 0; j < 3; j++) s += f.rrect(2 + j * 5.6, 2, 4.4, 5, 0.6, "th");
    }
  }
  return s;
}

/** 03 · Diese Stelle: Lime-Sucher-Ecken fassen ein Element, der Zeiger tippt darauf. */
function feinschliff(w: Werkzeug): string {
  const bw = 24;
  const h = 28;
  const t = zeichenTafel(w, 0, 0, 0, bw, h, 1.6);
  const f = t.f;
  let s = zeichenBoden(w, 12, -1, 18);
  s += t.koerper();
  s += zeichenBrowserleiste(f, bw, h);
  s += f.line(2, h - 7.4, 15, h - 7.4, "th", strichMal(1.4));
  s += f.line(2, h - 9.8, 11, h - 9.8, "th");
  // das gewählte Element
  s += f.rrect(3.4, 7.6, 13.6, 8, 0.6, "k wf", strichMal(1.2));
  s += f.path([[4.6, 8.8], [8.4, 12.6], [10.8, 10.4], [15.8, 14.8]], "th");
  s += f.line(2, 4.6, 14, 4.6, "th");
  s += f.line(2, 2.6, 10, 2.6, "th");
  // Sucher-Ecken in Lime, auf Papier mit dunkler Unterlage
  const e = 3.2;
  const ecken = (cls: string, stil: string) =>
    f.path([[1.6, 17.4 - e], [1.6, 17.4], [1.6 + e, 17.4]], cls, stil) +
    f.path([[18.8 - e, 17.4], [18.8, 17.4], [18.8, 17.4 - e]], cls, stil) +
    f.path([[1.6, 5.8 + e], [1.6, 5.8], [1.6 + e, 5.8]], cls, stil) +
    f.path([[18.8 - e, 5.8], [18.8, 5.8], [18.8, 5.8 + e]], cls, stil);
  s += zeichenMotiv(ecken("al", strichFest(1.9)), "", ecken("ku", strichFest(3.1)));
  // Zeiger (bildschirmparallel), tippt auf das Element
  const [zx, zy] = w.P(15.4, 1.5, 9.4);
  zeichenPunkt(w, zx + 7, zy + 10.6);
  const zeiger: [number, number][] = [[0, 0], [0, 9.2], [2.3, 7.1], [4, 10.6], [5.6, 9.8], [3.9, 6.4], [6.9, 6.2]];
  s += zeichenBildFlaeche(zeiger.map(([a, b]) => [zx + a, zy + b] as const), "z", strichFest(1.1));
  return s;
}

/** Foto auf einer Tafel: Rahmen, Berglinie, Sonne. */
function foto(f: ZeichenEbene, bw: number, bh: number): string {
  let s = f.rrect(1.4, 1.4, bw - 2.8, bh - 2.8, 0.5, "th");
  s += f.path([[2.4, 2.6], [bw * 0.38, bh * 0.55], [bw * 0.55, bh * 0.36], [bw * 0.68, bh * 0.5], [bw - 2.4, 2.6]], "k wf", strichMal(1.3));
  s += f.kreis(bw * 0.72, bh * 0.73, 1.4, "k wf");
  return s;
}

/** 04 · Foto hebt ab: die Bildkarte schwebt, die Lime-Marke zeigt nach oben. */
function dateiAnfrage(w: Werkzeug): string {
  const bw = 22;
  const h = 16;
  let s = zeichenBoden(w, 11, -1, 15);
  s += zeichenSchatten(w, 11, -1, 9.5);
  const t = zeichenTafel(w, 0, 0, 9, bw, h, 1.5);
  s += t.koerper();
  s += foto(t.f, bw, h);
  // Bewegungsspuren unter der Karte
  for (const u of [4, 11, 18]) {
    s += w.linie([[u, 0.5, 7.6], [u, 0.5, 3.4]], "th", strichFest(0.8, "stroke-dasharray:1.2 1.4"));
  }
  const [mx, my] = w.P(bw, 0, 9 + h);
  s += zeichenMarke(w, mx + 1.5, my - 2.5, 5.2, "pfeil");
  return s;
}

/** 05 · Alles auf einen Blick: Bildschirm mit Plakette, vier Kacheln, eine leuchtet. */
function kundenseite(w: Werkzeug): string {
  const bw = 30;
  const h = 22;
  let s = zeichenBoden(w, 15, -3, 19);
  // Fuß
  s += zeichenTafel(w, 12, -1.5, -2.4, 6, 3, 3).koerper();
  const t = zeichenTafel(w, 0, 0, 0.6, bw, h, 1.8);
  const f = t.f;
  s += t.koerper();
  s += f.kreis(3.6, h - 3.6, 2.1, "o wf", strichMal(1.2));
  s += f.line(7, h - 2.9, 17, h - 2.9, "k", strichMal(0.9));
  s += f.line(7, h - 4.8, 13, h - 4.8, "th");
  s += f.line(0, h - 7, bw, h - 7, "th", strichMal(0.8));
  s += zeichenMotiv(f.rect(2, 7.6, 12.4, 6.2, "a"), f.line(3.4, 11.8, 9, 11.8, "ad", strichFest(0.9)));
  s += f.rect(15.6, 7.6, 12.4, 6.2, "k wf", strichMal(1.2));
  s += f.rect(2, 1.4, 12.4, 5, "k wf", strichMal(1.2));
  s += f.rect(15.6, 1.4, 12.4, 5, "k wf", strichMal(1.2));
  s += f.line(17, 11.8, 24, 11.8, "th");
  s += f.line(3.4, 4.6, 10, 4.6, "th");
  s += f.line(17, 4.6, 22, 4.6, "th");
  return s;
}

/** 06 · Belegt: der Stempel hat den Lime-Haken auf den liegenden Bericht gesetzt. */
function monatsbericht(w: Werkzeug): string {
  const W = 20;
  const D = 26;
  // liegendes Blatt mit Kanten
  let s = w.flaeche([[0, 0, 0], [W, 0, 0], [W, -D, 0], [0, -D, 0]], "f");
  s += w.flaeche([[0, 0, 0], [W, 0, 0], [W, 0, -0.9], [0, 0, -0.9]], "s");
  s += w.flaeche([[W, 0, 0], [W, -D, 0], [W, -D, -0.9], [W, 0, -0.9]], "s");
  const lagen = zeichenEbene(w, [0, -D, 0], [1, 0, 0], [0, 1, 0]);
  s += lagen.line(2, 3, 13, 3, "k");
  s += lagen.line(2, 5.4, 9, 5.4, "th");
  for (let i = 0; i < 3; i++) s += lagen.line(2, 9 + i * 2.6, 16 - i * 2, 9 + i * 2.6, "th");
  // Abdruck: Lime-Haken in einem Kreis auf dem Blatt
  const [hx, hy] = w.P(13, -D + 19.6, 0);
  s += zeichenMotiv(
    lagen.kreis(13, 19.6, 4.6, "a"),
    zeichenBildLinie([[hx - 2.6, hy - 0.1], [hx - 0.8, hy + 1.1], [hx + 2.7, hy - 1.5]], "ad", strichFest(1.2)),
  );
  // Stempel schwebt darüber: Platte, Hals und Griff
  const cx = 13;
  const cy = -D + 19.6;
  const z0 = 9;
  s += zeichenSchatten(w, cx + 0.4, cy - 0.4, 0.1);
  s += zeichenZylinder(w, cx, cy, z0, 5.6, 1.8, "o", "s");
  s += zeichenZylinder(w, cx, cy, z0 + 1.8, 1.7, 6, "o", "s");
  s += zeichenZylinder(w, cx, cy, z0 + 7.8, 3.2, 3, "o", "f");
  for (const u of [-3, 0, 3]) {
    s += w.linie([[cx + u * 0.7, cy - u * 0.7, z0 - 1.2], [cx + u * 0.7, cy - u * 0.7, z0 - 4.2]], "th", strichFest(0.8, "stroke-dasharray:1.2 1.3"));
  }
  return s;
}

export const ZEICHEN_ONEPAGER: Szene = zeichenSzene(onepager);
export const ZEICHEN_WEBSITE: Szene = zeichenSzene(website);
export const ZEICHEN_FEINSCHLIFF: Szene = zeichenSzene(feinschliff);
export const ZEICHEN_DATEI_ANFRAGE: Szene = zeichenSzene(dateiAnfrage);
export const ZEICHEN_KUNDENSEITE: Szene = zeichenSzene(kundenseite);
export const ZEICHEN_MONATSBERICHT: Szene = zeichenSzene(monatsbericht);
