// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fussLinks } from "../src/fuss-links";
import { GRADE } from "../src/tokens";
import { FIRMA, FUSS_REIHENFOLGE, FUSS_TEXTE, FUSS_VERSION, PFLICHT, ZIELE } from "../src/ziele";
import { lies, ohneKommentare } from "./css-hilfe";

// Vertrag des Fußes (Plan fuss-baustein, Fertig heißt 2): Für jede Kombination
// aus `basis` und Leistungsschein zeigt „fokus“ die Pflichtziele, folgt der
// festen Reihenfolge ohne Doppel und übernimmt Text, Namen und Ziel aus ZIELE.
// Dazu die Firmendaten in der Schreibweise der Website, die Version und die
// Regeln für Quelle und CSS (Fertig heißt 3), die css-regeln in @container
// nicht prüft.

const FAELLE = ["", "https://powerhandwerk.de"].flatMap((basis) =>
  [undefined, "/agb-anlage-1-leistungsschein.pdf"].map((leistungsschein) => ({ basis, leistungsschein })),
);

describe.each(FAELLE)("fokus mit basis „$basis“ und Leistungsschein $leistungsschein", ({ basis, leistungsschein }) => {
  const eintraege = fussLinks({ variante: "fokus", basis, leistungsschein });
  const schluessel = eintraege.map((eintrag) => eintrag.schluessel);

  it("enthält Impressum und Datenschutz", () => {
    for (const pflicht of PFLICHT) expect(schluessel).toContain(pflicht);
  });

  it("ist eine Teilfolge von FUSS_REIHENFOLGE ohne Doppel", () => {
    const stellen = schluessel.map((s) => FUSS_REIHENFOLGE.indexOf(s));
    expect(stellen.every((stelle) => stelle >= 0)).toBe(true);
    expect(stellen).toEqual([...stellen].sort((a, b) => a - b));
    expect(new Set(schluessel).size).toBe(schluessel.length);
  });

  it("übernimmt Text, Namen und Art aus ZIELE", () => {
    for (const eintrag of eintraege) {
      const ziel = ZIELE[eintrag.schluessel];
      expect(eintrag.text, eintrag.schluessel).toBe(ziel.text);
      expect(eintrag.name, eintrag.schluessel).toBe(ziel.name);
      expect(eintrag.art, eintrag.schluessel).toBe(ziel.art);
    }
  });

  it("setzt basis vor eigene Seiten, lässt fremde Ziele und nimmt den Leistungsschein wie übergeben", () => {
    for (const eintrag of eintraege) {
      const href = ZIELE[eintrag.schluessel].href;
      if (eintrag.schluessel === "leistungsschein") expect(eintrag.href).toBe(leistungsschein);
      else if (href?.startsWith("/")) expect(eintrag.href, eintrag.schluessel).toBe(basis + href);
      else expect(eintrag.href, eintrag.schluessel).toBe(href);
    }
  });

  it("zeigt AGB und Leistungsschein nur mit Leistungsschein", () => {
    const erwartet = leistungsschein === undefined ? [] : ["agb", "leistungsschein"];
    expect(schluessel.filter((s) => s === "agb" || s === "leistungsschein")).toEqual(erwartet);
  });

  it("legt Telefon, E-Mail und WhatsApp in Schicht 02, die Rechtsseiten in Schicht 04", () => {
    expect(eintraege.filter((e) => e.schicht === "02").map((e) => e.schluessel)).toEqual(["telefon", "email", "whatsapp"]);
    expect(eintraege.filter((e) => e.schicht === "04").map((e) => e.art)).toEqual(schluessel.slice(3).map(() => "seite"));
  });
});

describe("Firmendaten", () => {
  it("stehen in der Schreibweise der Website (lib/site.ts)", () => {
    expect(FIRMA.telefon).toEqual({ anzeige: "+49 152 295 409 46", href: "tel:+4915229540946" });
    expect(FIRMA.email).toBe("kontakt@powerhandwerk.de");
    expect(FIRMA.whatsapp).toBe("https://wa.me/4915229540946");
  });

  it("Anzeige, tel: und WhatsApp tragen dieselbe Nummer", () => {
    const ziffern = (text: string) => text.replace(/\D/g, "");
    expect(ziffern(FIRMA.telefon.href)).toBe(ziffern(FIRMA.telefon.anzeige));
    expect(ziffern(FIRMA.whatsapp)).toBe(ziffern(FIRMA.telefon.anzeige));
  });

  it("die Markenzeile folgt E3 der Entscheidungsvorlage", () => {
    expect(FIRMA.markenzeile).toBe("powerhandwerk ist eine Marke der KETESO GmbH");
  });
});

describe("Version und Texte", () => {
  it("FUSS_VERSION ist die Paketversion", () => {
    expect(FUSS_VERSION).toBe((JSON.parse(lies("package.json")) as { version: string }).version);
  });

  it("kein Gedankenstrich in Firmendaten, Zielen und Texten", () => {
    const texte = JSON.stringify([FIRMA, ZIELE, FUSS_TEXTE]);
    expect(texte.includes("—"), "langer Strich").toBe(false);
    expect(texte.includes(" – "), "kurzer Strich mit Leerzeichen").toBe(false);
  });
});

describe("Quelle und CSS des Fußes", () => {
  // Die Direktive steht als eigene Zeile; Kommentare dürfen sie erwähnen.
  it.each(["src/Fuss.tsx", "src/ziele.ts", "src/fuss-links.ts"])("%s ohne \"use client\"", (pfad) => {
    expect(lies(pfad)).not.toMatch(/^\s*["']use client["']/m);
  });

  const CSS = ohneKommentare(lies("src/fuss.module.css"));

  it("schaltet über den Container, nicht über das Fenster", () => {
    expect(CSS).toMatch(/container-type:\s*inline-size/);
    expect(CSS).toMatch(/@container\s*\(/);
    expect(CSS).not.toMatch(/@media\b/);
  });

  it("ohne ink-500 und ink-600, ohne Übergang und Animation", () => {
    expect(CSS).not.toMatch(/ink-(?:500|600)\b/);
    expect(CSS).not.toMatch(/\b(?:transition|animation)\b/);
  });

  it("Schriftgrade auch in @container nur aus GRADE", () => {
    const grad = new RegExp(`^var\\(--grad-(?:${Object.keys(GRADE).join("|")})\\)$`);
    const groessen = [...CSS.matchAll(/font-size:\s*([^;]+);/g)].map((treffer) => treffer[1].trim());
    expect(groessen.length).toBeGreaterThan(0);
    expect(groessen.filter((wert) => !grad.test(wert))).toEqual([]);
  });
});
