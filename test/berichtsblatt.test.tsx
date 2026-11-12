import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Berichtsblatt } from "../src/Berichtsblatt";
import type { PlankopfFeld } from "../src/Plankopf";

// Schriftfeld im Titel: bei ungerader Zahl sichtbarer Felder zieht das letzte
// über beide Spalten, sonst bliebe rechts unten eine leere Zelle.

function breiteFelder(felder: readonly PlankopfFeld[]): string[] {
  const html = renderToStaticMarkup(<Berichtsblatt blatt="Test" titel="Titel" felder={felder} stand="Stand 12.11.2026" />);
  const dom = new DOMParser().parseFromString(html, "text/html");
  return [...dom.querySelectorAll("dl > div")]
    .filter((feld) => /plankopfBreit/.test(feld.className))
    .map((feld) => feld.querySelector("dt")?.textContent ?? "");
}

const feld = (label: string, wert = "x", breit?: boolean): PlankopfFeld => ({ label, wert, breit });

describe("Berichtsblatt: Schriftfeld", () => {
  it("macht bei ungerader Zahl das letzte Feld breit", () => {
    expect(breiteFelder([feld("A"), feld("B"), feld("C")])).toEqual(["C"]);
  });

  it("lässt eine gerade Zahl unverändert", () => {
    expect(breiteFelder([feld("A"), feld("B")])).toEqual([]);
  });

  it("lässt die Wahl des Verfassers stehen", () => {
    expect(breiteFelder([feld("A", "x", true), feld("B"), feld("C")])).toEqual(["A"]);
  });

  it("zählt leere Textfelder nicht mit", () => {
    expect(breiteFelder([feld("A"), feld("B"), feld("C", " ")])).toEqual([]);
  });
});
