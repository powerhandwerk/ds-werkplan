// @vitest-environment jsdom
import { act, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { leereZiffern } from "../src/standards";
import { ZiffernFelder } from "../src/ZiffernFelder";
import { zeige } from "./dom-hilfe";

// Code-Eingabe der Kundenseite (aus dem Admin): Namen, Fehlerbezug, Länge als
// Prop und das Verteilen eines eingefügten Codes auf alle Felder.

function Probe({ laenge }: { laenge?: number }) {
  const [ziffern, setZiffern] = useState<string[]>(leereZiffern(laenge));
  return <ZiffernFelder ziffern={ziffern} aendern={setZiffern} fehlerId={null} fokusAnlass={0} />;
}

describe("ZiffernFelder", () => {
  it("sechs Felder mit Namen „Ziffer n von 6“, Autofill nur im ersten, ohne Stil am Raster", () => {
    const markup = renderToStaticMarkup(<ZiffernFelder ziffern={leereZiffern()} aendern={() => {}} fehlerId={null} fokusAnlass={0} />);
    const d = new DOMParser().parseFromString(markup, "text/html");
    const felder = [...d.querySelectorAll("input")];
    expect(felder.map((f) => f.getAttribute("aria-label"))).toEqual([1, 2, 3, 4, 5, 6].map((n) => `Ziffer ${n} von 6`));
    expect(felder.map((f) => f.getAttribute("autocomplete"))).toEqual(["one-time-code", "off", "off", "off", "off", "off"]);
    expect(felder.every((f) => !f.hasAttribute("aria-invalid") && !f.hasAttribute("name"))).toBe(true);
    expect(d.querySelector(".ziffern")?.hasAttribute("style")).toBe(false);
  });

  it("mit Fehler hängt jedes Feld am Fehlertext und ist ungültig", () => {
    const markup = renderToStaticMarkup(<ZiffernFelder ziffern={leereZiffern()} aendern={() => {}} fehlerId="code-fehler" fokusAnlass={0} />);
    const felder = [...new DOMParser().parseFromString(markup, "text/html").querySelectorAll("input")];
    expect(felder.every((f) => f.getAttribute("aria-invalid") === "true" && f.getAttribute("aria-describedby") === "code-fehler")).toBe(true);
  });

  it("ein eingefügter Code verteilt sich auf alle Felder, Nicht-Ziffern fallen weg", () => {
    const host = zeige(<Probe />);
    const felder = () => [...host.querySelectorAll("input")];
    const daten = new Event("paste", { bubbles: true, cancelable: true }) as Event & { clipboardData: { getData: () => string } };
    daten.clipboardData = { getData: () => "12 34-56" };
    act(() => {
      felder()[2]!.dispatchEvent(daten);
    });
    expect(felder().map((f) => f.value)).toEqual(["1", "2", "3", "4", "5", "6"]);
    expect(daten.defaultPrevented).toBe(true);
  });

  it("Länge als Prop: vier Felder, Spaltenzahl am Raster, Namen „von 4“", () => {
    const host = zeige(<Probe laenge={4} />);
    expect(host.querySelectorAll("input")).toHaveLength(4);
    expect(host.querySelector("input")?.getAttribute("aria-label")).toBe("Ziffer 1 von 4");
    expect((host.querySelector(".ziffern") as HTMLElement).style.getPropertyValue("--zf-anzahl")).toBe("4");
  });
});
