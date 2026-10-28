/**
 * Zwei Beispielszenen der Leistungskarten (Grafikstil A, ADR-262) und
 * Musterkarten dazu. Port aus powerhandwerk-website,
 * lib/werkplan/leistungskarten/szenen.ts (keteso 923a5c4): `profil` ist dort
 * `googleProfil`, `sanierung` heißt gleich.
 *
 * Bewusst ohne "use client": Server-Komponenten lesen die Musterkarten als
 * Werte. Die Szenen sind Funktionen und überqueren die Server-Client-Grenze
 * nicht; ein Verbraucher in Next.js reicht sie deshalb aus einem eigenen
 * Client-Modul an `Leistungskarten` (siehe dort).
 *
 * Jede Szene zeigt eine Geste (`t` von 0 nach 1) und ein Lime-Motiv, das aus
 * mehreren Flächen bestehen darf (fünf Sterne; Eindeckung und Ziegel).
 */
import { deck, klemm, kreis, type LeistungsKarte, type Pkt, type Szene } from "./leistungskarten-engine";
import { inEbene, platte, rechteck, stern } from "./leistungskarten-formen";

/* ---------- Profil: Sterne und Beschreibung füllen sich ---------- */
const profil: Szene = {
  start: () => ({ t: 0 }),
  ruhe: { t: 0 },
  proben: [{ t: 0 }, { t: 1 }],
  zeichne(s, w) {
    const { flaeche, linie, staub } = w;
    const Y = 40;
    const E = inEbene(Y);
    let o = linie(kreis(30, 45, 0, 46), "l d th") + staub([[-15, 20, 70], [80, 10, 70], [70, 72, 10], [0, 75, 30]]);
    // Karte im Hintergrund: Straßen
    o += linie([[-5, 58, 0], [76, 58, 0]], "l th");
    o += linie([[60, 30, 0], [60, 84, 0]], "l th");
    o += linie([[2, 72, 0], [36, 72, 0], [42, 82, 0]], "l d th");
    // Profilkarte
    o += platte(w, Y, 0, 56, 0, 70, 3);
    o += flaeche(rechteck(E, 4, 52, 48, 66), "l");
    o += linie([E(10, 50), E(22, 60), E(30, 54), E(38, 62), E(48, 50)], "l th");
    o += linie([E(4, 43), E(34, 43)], "l");
    // Sterne: zwei stehen schon, die übrigen füllen sich mit der Geste
    for (let i = 0; i < 5; i++) {
      const ecken = stern(E, 8 + i * 8, 35, 3.2);
      const voll = klemm(2 + s.t * 3 - i);
      if (voll > 0.01) o += flaeche(ecken, "a gl", deck(voll));
      o += flaeche(ecken, "l th");
    }
    // Beschreibungszeilen schreiben sich
    const zeilen = [[27, 48], [22, 48], [17, 48], [12, 36]];
    zeilen.forEach(([b, ende], k) => {
      o += linie([E(4, b), E(ende, b)], "l d th");
      const p = klemm(0.3 + s.t * 4.2 - k);
      if (p > 0.01) o += linie([E(4, b), E(4 + (ende - 4) * p, b)], "l");
    });
    // Knopfleiste
    for (const a of [4, 20, 36]) o += flaeche(rechteck(E, a, a + 12, 3, 8), "l th");
    // Pin auf der Karte, vor der Profilkarte (zuletzt, damit er vorn liegt)
    const pin = [72, 66];
    o += flaeche(kreis(pin[0], pin[1], 0, 4, 24), "l th");
    const kopf = 18;
    const PE = inEbene(pin[1]);
    const tropfen = [PE(pin[0], 0)];
    for (let i = 0; i <= 16; i++) {
      const wi = -Math.PI / 6 + (i / 16) * (Math.PI + Math.PI / 3);
      tropfen.push(PE(pin[0] + 6 * Math.cos(wi), kopf + 6 * Math.sin(wi)));
    }
    o += flaeche(tropfen, "f");
    o += flaeche(kreis(0, 0, 0, 2.4, 16).map((p) => PE(pin[0] + p[0], kopf + p[1])), "l");
    return o;
  },
};

/* ---------- Sanierung: neue Ziegelreihen schieben sich hoch ---------- */
const sanierung: Szene = {
  start: () => ({ t: 0, px: 0.5 }),
  ruhe: { t: 0, px: 0.5 },
  proben: [{ t: 0, px: 0.5 }, { t: 1, px: 0 }, { t: 1, px: 1 }],
  zeichne(s, w) {
    const { flaeche, linie, staub } = w;
    const px = s.px ?? 0.5;
    const vorn = (u: number, x: number) => [x, 54 - 29 * u, 38 + 30 * u]; // u: 0 Traufe, 1 First
    const hinten = (u: number, x: number) => [x, -4 + 29 * u, 38 + 30 * u];
    const n = [0, 0.719, 0.695]; // Normale der vorderen Dachfläche
    const hoch = (p: Pkt, h: number) => [p[0] + n[0] * h, p[1] + n[1] * h, p[2] + n[2] * h];
    const zDach = (y: number) => 68 - ((y - 25) * 30) / 29;
    const oben = 0.125 + 0.5 * s.t;
    let o = linie(kreis(35, 25, 0, 60), "l d th");
    o += staub([[-20, 10, 70], [90, 40, 60], [80, -20, 40], [-10, 70, 20], [60, 80, 5], [20, -30, 60]]);
    o += flaeche([hinten(0, -3), hinten(0, 73), hinten(1, 73), hinten(1, -3)], "f");
    o += flaeche([[0, 50, 0], [70, 50, 0], [70, 50, 38], [0, 50, 38]], "f");
    o += flaeche([[70, 0, 0], [70, 50, 0], [70, 50, 38], [70, 25, 68], [70, 0, 38]], "f");
    o += flaeche([[12, 50, 0], [24, 50, 0], [24, 50, 22], [12, 50, 22]], "l");
    o += flaeche([[34, 50, 16], [46, 50, 16], [46, 50, 28], [34, 50, 28]], "l");
    o += flaeche([[52, 50, 16], [64, 50, 16], [64, 50, 28], [52, 50, 28]], "l");
    o += flaeche([[70, 14, 14], [70, 26, 14], [70, 26, 26], [70, 14, 26]], "l");
    o += flaeche([vorn(0, -3), vorn(0, 73), vorn(1, 73), vorn(1, -3)], "f");
    // neue Eindeckung
    o += flaeche([vorn(0, -3), vorn(0, 73), vorn(oben, 73), vorn(oben, -3)], "a gl");
    for (let k = 1; k < 8; k++) {
      const u = k / 8;
      o += linie([vorn(u, -3), vorn(u, 73)], u <= oben + 1e-6 ? "l" : "l d");
    }
    for (let r = 0; r < 8; r++) {
      const u0 = r / 8;
      const u1 = Math.min((r + 1) / 8, oben);
      if (u1 <= u0) break;
      for (let x = r % 2 ? 5 : 1; x < 73; x += 8) o += linie([vorn(u0, x), vorn(u1, x)], "l th");
    }
    // der nächste Ziegel schwebt über der Kante und folgt dem Zeiger
    if (s.t > 0.02) {
      const x0 = -3 + px * 66;
      const x1 = x0 + 10;
      const u0 = oben;
      const u1 = Math.min(oben + 0.125, 1);
      const ecken = [vorn(u0, x0), vorn(u0, x1), vorn(u1, x1), vorn(u1, x0)];
      o += flaeche(ecken, "ag", deck(0.25 * s.t));
      o += flaeche(ecken.map((p) => hoch(p, 7)), "a", deck(s.t));
    }
    // Kamin
    const zv = zDach(39);
    const zh = zDach(33);
    o += flaeche([[48, 39, zv], [55, 39, zv], [55, 39, 76], [48, 39, 76]], "f");
    o += flaeche([[55, 33, zh], [55, 39, zv], [55, 39, 76], [55, 33, 76]], "f");
    o += flaeche([[48, 33, 76], [55, 33, 76], [55, 39, 76], [48, 39, 76]], "f");
    return o;
  },
};

/** Beispielszenen der Leistungskarten: `profil` für Papier, `sanierung` für Nacht. */
export const LEISTUNGSKARTEN_BEISPIELE: Readonly<Record<"profil" | "sanierung", Szene>> = {
  profil,
  sanierung,
};

/** Musterkarten zu den Beispielszenen, neutral getextet. */
export const LEISTUNGSKARTEN_MUSTER: readonly LeistungsKarte[] = [
  {
    szene: "profil",
    titel: "Profil pflegen",
    teaser: "Sterne und Beschreibung füllen sich, das Profil wirkt gepflegt.",
    nr: "001",
  },
  {
    szene: "sanierung",
    titel: "Dach sanieren",
    teaser: "Neue Ziegelreihen schieben sich hoch, der nächste Ziegel folgt dem Zeiger.",
    nr: "002",
  },
];
