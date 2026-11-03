/**
 * Produktzeichen „Messlatte“: Wasserwaage mit Teilung, die Luftblase in der
 * Libelle ist die Lime-Pille aus dem Logo. Ab 40 px das Iso-Modell, darunter
 * die flache Fassung im 24er-Raster in drei Stufen. Maße und Reihenfolge aus
 * dem Markenblatt (`imlot` und `flach("a", …)` in `messlatte.py`); die Pille
 * rundet in beiden Fassungen wie im Logo (`PILLE_FAKTOR`), die Libelle voll.
 */
import { werkzeug, type Szene, type Werkzeug } from "./leistungskarten-engine";
import { strichFest, strichMal, zeichenBoden, zeichenMotiv, zeichenSzene, zeichenTafel, type FlacheFassung } from "./produktzeichen-formen";
import { PILLE_FAKTOR } from "./tokens";

/* ---------- Iso-Modell ---------- */

// Körper: Länge, Höhe, Dicke
const L = 34;
const HH = 6.4;
const T = 2.4;
// Libelle: Breite, Höhe, Abstand von der Unterkante
const FW = 10.4;
const FH = 3.4;
const FV = 0.9;
// Pille in der Libelle
const PW = 4.2;
const PH = 2.0;

/** Waage mit Endkappen, Teilung auf der Oberkante, Libelle mit zwei Marken und der Pille. */
function zeichneMesslatte(w: Werkzeug, { boden }: { boden: boolean }): string {
  let s = boden ? zeichenBoden(w, L / 2, -T / 2, 20) : "";
  const t = zeichenTafel(w, 0, 0, 0, L, HH, T);
  const f = t.f;
  s += t.koerper();
  // Endkappen: dunkle Stirnstücke wie bei einer echten Waage
  s += f.rect(0, 0, 1.1, HH, "s wf");
  s += f.rect(L - 1.1, 0, 1.1, HH, "s wf");
  // Teilung oben: sechs Abschnitte mit langen Endstrichen, je ein Halbstrich
  const a = 2.2;
  const b = L - 2.2;
  for (let i = 0; i < 13; i++) {
    const u = a + ((b - a) * i) / 12;
    const lang = i % 2 === 0;
    const laenge = i === 0 || i === 12 ? 1.7 : lang ? 1.3 : 0.85;
    s += f.line(u, HH - 0.4, u, HH - laenge, lang ? "k wf" : "th", lang ? strichMal(1.4) : "");
  }
  // Libelle: das Glas ist die Vorderseite
  const fu = L / 2 - FW / 2;
  s += f.rrect(fu, FV, FW, FH, FH / 2, "f");
  for (const du of [-2.6, 2.6]) s += f.line(L / 2 + du, FV + 0.45, L / 2 + du, FV + FH - 0.45, "k wf", strichMal(1.3));
  s += zeichenMotiv(f.rrect(L / 2 - PW / 2, FV + (FH - PH) / 2, PW, PH, PH * PILLE_FAKTOR, "a"));
  return s;
}

/** Das Zeichen im Verzeichnis, mit Boden. */
export const ZEICHEN_MESSLATTE: Szene = zeichenSzene((w) => zeichneMesslatte(w, { boden: true }));

/** Das Zeichen ohne Boden, für den Schriftzug. */
export const ZEICHEN_MESSLATTE_OHNE_BODEN: Szene = zeichenSzene((w) => zeichneMesslatte(w, { boden: false }));

/** Mitte der Libelle in Bildkoordinaten (Szenenpunkt auf der Vorderseite). */
export function messlatteLibelleMitte(): [number, number] {
  return werkzeug(null).P(L / 2, 0, FV + FH / 2);
}

/* ---------- Flache Fassung ---------- */

/** Zahl auf höchstens drei Nachkommastellen gerundet; als Text ohne Nullen am Ende. */
export const runde = (v: number) => Number(v.toFixed(3));

/** Breite des flachen Körpers im 24er-Raster (x = 1 bis 23). */
export const MESSLATTE_FLACH_KOERPER = 22;

/** Stufe der flachen Fassung: `s` bis 20 px, `m` bis 27 px, `l` ab 28 px. */
export type MesslatteFlachStufe = "s" | "m" | "l";

const flachStufe = (groesse: number): MesslatteFlachStufe => (groesse <= 20 ? "s" : groesse < 28 ? "m" : "l");

/**
 * Flache Fassung im 24er-Raster (viewBox 0 0 24 24) als Markup, je Stufe: in
 * `s` Strich 1,25, sonst 1,1; in `l` flacherer Körper mit Teilung und kleinerer
 * Libelle. Farben über die Klassen `fg`, `fs`, `fl`, `fa` aus
 * `produktzeichen.module.css`; die Pille steht als einziges Lime-Teil in
 * `<g class="motiv">`, ohne Glühen.
 */
function zeichneFlach(stufe: MesslatteFlachStufe): string {
  const sw = stufe === "s" ? 1.25 : 1.1;
  const gross = stufe === "l";
  const hoch = gross ? 6.0 : 6.4;
  const y0 = 12 - hoch / 2;
  let s = `<rect class="fg" x="1" y="${runde(y0)}" width="${MESSLATTE_FLACH_KOERPER}" height="${runde(hoch)}" rx="0.5" ${strichFest(sw)}/>`;
  s += `<rect class="fs" x="1" y="${runde(y0)}" width="1.7" height="${runde(hoch)}"/>`;
  s += `<rect class="fs" x="21.3" y="${runde(y0)}" width="1.7" height="${runde(hoch)}"/>`;
  if (gross) {
    for (let i = 0; i < 7; i++) {
      const x = runde(4.2 + (15.6 * i) / 6);
      const y2 = y0 + (i === 0 || i === 6 ? 1.6 : 1.1);
      s += `<line class="fl" x1="${x}" y1="${runde(y0)}" x2="${x}" y2="${runde(y2)}" ${strichFest(0.8)}/>`;
    }
  }
  const [fw, fh] = gross ? [8.4, 3.0] : [9.4, 3.6];
  const fy = 12 - fh / 2 + (gross ? 0.5 : 0);
  s += `<rect class="fg" x="${runde(12 - fw / 2)}" y="${runde(fy)}" width="${fw}" height="${fh}" rx="${runde(fh / 2)}" ${strichFest(Number((sw * 0.85).toFixed(2)))}/>`;
  const [pw, ph] = gross ? [3.6, 1.8] : [4.4, 2.3];
  const pille = `<rect class="fa" x="${runde(12 - pw / 2)}" y="${runde(fy + (fh - ph) / 2)}" width="${pw}" height="${ph}" rx="${runde(ph * PILLE_FAKTOR)}" ${strichFest(0.7)}/>`;
  return s + `<g class="motiv">${pille}</g>`;
}

/** Die flache Fassung fürs Verzeichnis: unter 40 px, Markup je Stufe. */
export const MESSLATTE_FLACH: FlacheFassung = { unter: 40, stufe: flachStufe, zeichne: zeichneFlach };
