/**
 * Produktzeichen 07 bis 13: Bewertungs-Seite, Erscheinungsbild-Handbuch, die
 * vier Bereiche der Kundenseite (Google-Profil, Google-Suche, KI-Sichtbarkeit,
 * Website) sowie Prüfbericht und Kompakt-Check. Gleiche Regeln wie Reihe 1.
 */
import type { Szene, Werkzeug } from "./leistungskarten-engine";
import {
  strichFest,
  strichMal,
  zeichenBildmarke,
  zeichenBoden,
  zeichenBrowserleiste,
  zeichenEbene,
  zeichenKiFunke,
  zeichenMarke,
  zeichenMotiv,
  zeichenRundTafel,
  zeichenSterne,
  zeichenSzene,
  zeichenTafel,
  type ZeichenEbene,
} from "./produktzeichen-formen";

/** QR-Code als Muster: drei Suchmarken und ein paar Module. */
function qr(f: ZeichenEbene, u: number, v: number, groesse: number): string {
  const m = groesse / 7;
  let s = "";
  for (const [du, dv] of [[0, 4], [4, 4], [0, 0]]) {
    s += f.rect(u + du * m, v + dv * m, 3 * m, 3 * m, "k wf", strichMal(1.1));
    s += f.rect(u + (du + 1) * m, v + (dv + 1) * m, m, m, "kv");
  }
  for (const [du, dv] of [[4, 0], [5, 1], [6, 0], [4, 2], [6, 2], [5, 3]]) {
    s += f.rect(u + du * m, v + dv * m, m * 0.9, m * 0.9, "kv");
  }
  return s;
}

/** 07 · Der Aufsteller auf dem Tresen: QR-Code und fünf leuchtende Sterne. */
function bewertungsseite(w: Werkzeug): string {
  let s = zeichenBoden(w, 10, -3, 16);
  s += zeichenTafel(w, -1, 2.5, 0, 22, 1.4, 8).koerper();
  const t = zeichenTafel(w, 1, 0, 1.4, 18, 25, 1.4);
  const f = t.f;
  s += t.koerper();
  s += zeichenMotiv(zeichenSterne(w, f, 3.2, 21, 1.45, 2.9));
  s += f.line(3, 17.4, 15, 17.4, "th");
  s += qr(f, 4.6, 2.6, 8.8);
  return s;
}

/** 08 · Das Handbuch: Logo vorn, darunter die Farbfelder, eins leuchtet. */
function erscheinungsbild(w: Werkzeug): string {
  const bw = 19;
  const h = 25;
  let s = zeichenBoden(w, 9.5, -2, 15);
  const t = zeichenTafel(w, 0, 0, 0, bw, h, 4);
  const f = t.f;
  s += t.koerper();
  const rechts = zeichenEbene(w, [bw, 0, 0], [0, -1, 0], [0, 0, 1]);
  for (const d of [0.9, 1.8, 2.7, 3.4]) s += rechts.line(d, 1, d, h - 1, "th", strichMal(0.7));
  s += f.line(1.6, 0, 1.6, h, "k wf");
  // Zeichen des Betriebs, ohne Lime
  const u = 6.4;
  const v = h - 7.4;
  s += f.kreis(u, v, 2.6, "k");
  s += f.line(u + 4, v + 0.8, u + 11, v + 0.8, "k");
  s += f.line(u + 4, v - 1.2, u + 8.6, v - 1.2, "th");
  for (let i = 0; i < 3; i++) s += f.rect(4 + i * 3.6, 4, 3, 4.6, `t${i + 1} wf`);
  s += zeichenMotiv(f.rect(4 + 3 * 3.6, 4, 3, 4.6, "a"));
  s += f.line(4, 11, 13, 11, "th");
  return s;
}

/** 09 · Der Betrieb mit Pin: Werkstatt mit Tor und Schild, darüber die Bildmarke. */
function googleProfil(w: Werkzeug): string {
  const bw = 18;
  const h = 11;
  let s = zeichenBoden(w, 9, -5, 16);
  const t = zeichenTafel(w, 0, 0, 0, bw, h, 11);
  const f = t.f;
  s += t.koerper();
  s += f.rect(2, 0, 6.4, 7.4, "k");
  for (const v of [1.8, 3.6, 5.4]) s += f.line(2, v, 8.4, v, "th");
  s += f.rect(10.4, 3, 5.6, 4.4, "k wf", strichMal(1.2));
  s += f.line(13.2, 3, 13.2, 7.4, "th");
  s += f.rect(1.4, 8.6, bw - 2.8, 1.6, "o wf");
  s += zeichenMotiv(zeichenBildmarke(w, 9, -5.5, h + 3, 15));
  return s;
}

/** 10 · Suchfeld und Treffer: die Suche leuchtet, darunter die Ergebnisse. */
function googleSuche(w: Werkzeug): string {
  const bw = 24;
  const h = 26;
  const t = zeichenTafel(w, 0, 0, 0, bw, h, 1.6);
  const f = t.f;
  let s = zeichenBoden(w, 12, -1, 17);
  s += t.koerper();
  s += zeichenBrowserleiste(f, bw, h);
  s += zeichenMotiv(
    f.rrect(2, h - 9.4, bw - 4, 3.6, 1.8, "a"),
    f.kreis(bw - 4.6, h - 7.6, 0.9, "ad", strichFest(0.8)) + f.line(bw - 4, h - 8.3, bw - 3.4, h - 8.9, "ad", strichFest(0.8)),
  );
  for (let i = 0; i < 3; i++) {
    const v = h - 13.2 - i * 4.4;
    s += f.line(2, v, 14, v, "k", strichMal(0.8));
    s += f.line(2, v - 1.6, 19, v - 1.6, "th");
  }
  return s;
}

/** 11 · Frage und Antwort: die leuchtende Antwort, der KI-Funke frei oben links. */
function kiSichtbarkeit(w: Werkzeug): string {
  let s = zeichenBoden(w, 11, -2, 15);
  const frage = zeichenRundTafel(w, 6, -6, 13.5, 17, 8, 2.6, 1.3, [[12.4, 0], [14.8, -2.8], [10, 0]]);
  s += frage.koerper();
  s += frage.f.line(2.4, 4.6, 13, 4.6, "th");
  s += frage.f.line(2.4, 2.6, 9.4, 2.6, "th");
  const antwort = zeichenRundTafel(w, 0, 0, 0, 19, 11, 2.8, 1.5, [[3, 0], [1, -3.4], [6.4, 0]]);
  const f = antwort.f;
  let zeilen = "";
  for (let i = 0; i < 3; i++) zeilen += f.line(2.8, 8 - i * 2.4, 2.8 + [12, 9.6, 11][i], 8 - i * 2.4, "ad", strichFest(0.9));
  s += zeichenMotiv(antwort.koerper(true), zeilen);
  // KI-Funke frei oben links über der Antwort, dazu ein kleiner Zweitfunke
  const [fx, fy] = w.P(-3.2, 0, 19.5);
  s += zeichenKiFunke(w, fx, fy, 4.6);
  s += zeichenKiFunke(w, fx + 5.6, fy - 4.2, 2.1);
  return s;
}

/** 12 · Die Website läuft: Fenster mit leuchtendem Prüfhaken. */
function websiteBereich(w: Werkzeug): string {
  const bw = 28;
  const h = 20;
  const t = zeichenTafel(w, 0, 0, 0, bw, h, 1.8);
  const f = t.f;
  let s = zeichenBoden(w, 14, -1, 18);
  s += t.koerper();
  s += zeichenBrowserleiste(f, bw, h);
  s += f.rect(2, 2, 12, 11.6, "th");
  s += f.path([[3, 3.2], [6.8, 7.6], [9.2, 5.4], [13, 9.8]], "th");
  for (let i = 0; i < 4; i++) s += f.line(16, 12 - i * 2.6, 16 + [9, 7, 8, 5][i], 12 - i * 2.6, "th");
  const [mx, my] = w.P(bw, 0, h);
  s += zeichenMarke(w, mx + 1, my + 1.5, 5.4, "haken");
  return s;
}

/** Das Prüfgerät auf seiner Bodenplatte, die Anzeige leuchtet. */
function pruefgeraet(w: Werkzeug): string {
  let s = zeichenTafel(w, -2, 3, 0, 26, 1.2, 15).koerper();
  const g = zeichenTafel(w, 0, 0, 1.2, 22, 9, 8);
  const f = g.f;
  s += g.koerper();
  s += zeichenMotiv(f.rect(1.6, 3.6, 9.4, 4.2, "a"), f.line(2.6, 5.7, 7.4, 5.7, "ad", strichFest(0.9)));
  for (let i = 0; i < 4; i++) s += f.kreis(13.2 + i * 2.3, 5.6, 0.85, "s wf");
  s += f.line(1.6, 1.8, 20.4, 1.8, "th");
  const oben = zeichenEbene(w, [0, -8, 10.2], [1, 0, 0], [0, 1, 0]);
  s += oben.rrect(4, 3.4, 14, 1.4, 0.7, "s wf");
  return s;
}

/** 13 · Der Prüfstand: das Gerät ist der Kompakt-Check, der Prüfbericht kommt oben heraus. */
function pruefstand(w: Werkzeug, kompakt: boolean): string {
  let s = zeichenBoden(w, 11, -4, 17);
  s += pruefgeraet(w);
  if (kompakt) return s;
  // Bericht steckt im Schlitz und ragt nach oben
  const b = zeichenTafel(w, 5, -4.6, 10.2, 12, 13, 0.4);
  s += b.koerper();
  s += b.f.line(1.4, 10.6, 8, 10.6, "k", strichMal(0.8));
  for (let i = 0; i < 3; i++) {
    const v = 8 - i * 2.2;
    s += b.f.rect(1.4, v - 0.8, 1.6, 1.6, "k wf", strichMal(0.8));
    s += b.f.line(4, v, 4 + [6, 4.6, 5.4][i], v, "th");
  }
  return s;
}

export const ZEICHEN_BEWERTUNGSSEITE: Szene = zeichenSzene(bewertungsseite);
export const ZEICHEN_ERSCHEINUNGSBILD: Szene = zeichenSzene(erscheinungsbild);
export const ZEICHEN_GOOGLE_PROFIL: Szene = zeichenSzene(googleProfil);
export const ZEICHEN_GOOGLE_SUCHE: Szene = zeichenSzene(googleSuche);
export const ZEICHEN_KI_SICHTBARKEIT: Szene = zeichenSzene(kiSichtbarkeit);
export const ZEICHEN_WEBSITE_BEREICH: Szene = zeichenSzene(websiteBereich);
export const ZEICHEN_PRUEFBERICHT: Szene = zeichenSzene((w) => pruefstand(w, false));
export const ZEICHEN_KOMPAKT_CHECK: Szene = zeichenSzene((w) => pruefstand(w, true));
