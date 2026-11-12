import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Berichtsblatt, Position } from "../src/Berichtsblatt";
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

describe("Berichtsblatt: Positionen", () => {
  function blatt(kinder: React.ReactNode) {
    const html = renderToStaticMarkup(
      <Berichtsblatt blatt="Test" titel="Titel" felder={[]} stand="Stand 12.11.2026">
        {kinder}
      </Berichtsblatt>,
    );
    const dom = new DOMParser().parseFromString(html, "text/html");
    const positionen = [...dom.querySelectorAll("main section")];
    return {
      ids: positionen.map((p) => p.id),
      beschriftungen: positionen.map((p) => p.querySelector("p")?.textContent ?? ""),
      sprungziele: [...dom.querySelectorAll("nav a")].map((a) => a.getAttribute("href")),
      text: dom.body.textContent ?? "",
    };
  }

  it("nummeriert fortlaufend und vergibt pos-01 bis pos-03", () => {
    const b = blatt(["Eins", "Zwei", "Drei"].map((name) => <Position key={name} name={name} titel={name} />));
    expect(b.ids).toEqual(["pos-01", "pos-02", "pos-03"]);
    expect(b.beschriftungen).toEqual(["Pos. 01 · Eins", "Pos. 02 · Zwei", "Pos. 03 · Drei"]);
    expect(b.sprungziele).toEqual(["#pos-01", "#pos-02", "#pos-03"]);
  });

  it("lässt eine eigene id stehen", () => {
    const b = blatt([<Position key="a" name="Eins" titel="Eins" />, <Position key="b" name="Zwei" titel="Zwei" id="vergleich" />, <Position key="c" name="Drei" titel="Drei" />]);
    expect(b.ids).toEqual(["pos-01", "vergleich", "pos-03"]);
    expect(b.sprungziele).toEqual(["#pos-01", "#vergleich", "#pos-03"]);
  });

  it("verwirft ein Kind, das keine Position ist, und warnt", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const b = blatt([<Position key="a" name="Eins" titel="Eins" />, <p key="x">Fremdes Kind</p>]);
    expect(b.ids).toEqual(["pos-01"]);
    expect(b.text).not.toContain("Fremdes Kind");
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("warnt bei doppelter id", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    blatt([<Position key="a" name="Eins" titel="Eins" id="x" />, <Position key="b" name="Zwei" titel="Zwei" id="x" />]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("x"));
    warn.mockRestore();
  });
});
