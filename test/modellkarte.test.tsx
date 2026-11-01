// @vitest-environment jsdom
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Modellkarte, type ModellkarteProps } from "../src/Modellkarte";

// Modellkarte: Server-HTML mit Überschrift, Etikett, Preis, Einheit, Summen
// als Beschreibungsliste, dekorativem Produktzeichen und benannter section.

const MUSTER: ModellkarteProps = {
  zeichen: "onepager",
  name: "One-Pager",
  etikett: "1 Seite",
  text: "Eine Seite mit Ihren Leistungen.",
  preis: "00 €",
  einheit: "im Monat, netto",
  summen: [
    { label: "24 Raten zusammen", wert: "24 × 00 € = 000 €" },
    { label: "Auf einmal gekauft", wert: "0.000 €" },
  ],
};

function karte(props: ModellkarteProps): HTMLElement {
  const huelle = document.createElement("div");
  huelle.innerHTML = renderToString(<Modellkarte {...props} />);
  const section = huelle.querySelector("section");
  if (!section) throw new Error("keine <section> im Markup");
  return section;
}

describe("Modellkarte", () => {
  it("ist eine section mit dem Namen als zugänglichem Namen", () => {
    const section = karte(MUSTER);
    expect(section.getAttribute("aria-label")).toBe("One-Pager");
  });

  it("setzt den Namen als h3, auf Wunsch als h2 oder h4", () => {
    expect(karte(MUSTER).querySelector("h3")?.textContent).toBe("One-Pager");
    expect(karte({ ...MUSTER, ueberschrift: "h2" }).querySelector("h2")?.textContent).toBe("One-Pager");
    const h4 = karte({ ...MUSTER, ueberschrift: "h4" });
    expect(h4.querySelector("h4")?.textContent).toBe("One-Pager");
    expect(h4.querySelector("h3")).toBeNull();
  });

  it("stellt das Etikett vor den Namen", () => {
    const kopf = karte(MUSTER).querySelector("h3")?.parentElement;
    expect(kopf?.firstElementChild?.textContent).toBe("1 Seite");
    expect(kopf?.lastElementChild?.tagName).toBe("H3");
  });

  it("zeigt Text, Preis und Einheit", () => {
    const text = karte(MUSTER).textContent ?? "";
    expect(text).toContain("Eine Seite mit Ihren Leistungen.");
    expect(text).toContain("00 €");
    expect(text).toContain("im Monat, netto");
  });

  it("baut die Summen als Beschreibungsliste", () => {
    const dl = karte(MUSTER).querySelectorAll("dl");
    expect(dl).toHaveLength(1);
    const paare = [...dl[0].querySelectorAll(":scope > div")].map((d) => [d.querySelector("dt")?.textContent, d.querySelector("dd")?.textContent]);
    expect(paare).toEqual([
      ["24 Raten zusammen", "24 × 00 € = 000 €"],
      ["Auf einmal gekauft", "0.000 €"],
    ]);
  });

  it("lässt die Liste ohne Summen weg, auch bei leerer Liste", () => {
    expect(karte({ ...MUSTER, summen: undefined }).querySelector("dl")).toBeNull();
    expect(karte({ ...MUSTER, summen: [] }).querySelector("dl")).toBeNull();
  });

  it("lässt Etikett, Text und Einheit weg, wenn sie fehlen", () => {
    const section = karte({ zeichen: "website", name: "Website", preis: "00 €" });
    expect(section.querySelector("p")).toBeNull();
    expect(section.textContent).toBe("Website00 €");
  });

  it("zeichnet das Produktzeichen dekorativ in der gewählten Größe", () => {
    const svg = karte(MUSTER).querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("role")).toBeNull();
    expect(svg?.getAttribute("width")).toBe("172");
    expect(karte({ ...MUSTER, zeichenGroesse: 120 }).querySelector("svg")?.getAttribute("width")).toBe("120");
  });

  it("trägt die Sucher-Ecken und eine zusätzliche Klasse", () => {
    const section = karte({ ...MUSTER, className: "extra" });
    expect(section.className).toContain("extra");
    expect(section.querySelectorAll(":scope > span[aria-hidden='true']")).toHaveLength(4);
  });
});
