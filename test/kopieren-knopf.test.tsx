// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { KopierenKnopf } from "../src/KopierenKnopf";
import { KOPIEREN_TEXTE } from "../src/standards";
import { zeige } from "./dom-hilfe";

// Aus dem Admin umgezogen (test/kopieren-knopf.test.tsx zum früheren
// DS-KopierenKnopf), ergänzt um die Fassung der Kundenseite. jsdom kennt
// navigator.clipboard nicht: genau der Fall, in dem der Knopf den Text zum
// Markieren zeigen muss (App-Ansichten, alte Browser).

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("KopierenKnopf", () => {
  it("zeigt ohne Zwischenablage den Text zusätzlich in einem Feld und sagt das an", async () => {
    const host = zeige(<KopierenKnopf wert={"Zeile 1\nZeile 2"} label="Gerüst" />);
    expect(host.querySelector("textarea")).toBeNull();
    const knopf = host.querySelector("button")!;
    expect(knopf.textContent).toBe("Kopieren");
    await act(async () => {
      knopf.click();
    });
    const feld = host.querySelector("textarea");
    expect(feld).not.toBeNull();
    expect(feld!.value).toBe("Zeile 1\nZeile 2");
    expect(feld!.getAttribute("aria-label")).toBe(KOPIEREN_TEXTE.feld);
    expect(host.querySelector('[role="status"]')?.textContent).toBe(KOPIEREN_TEXTE.manuell);
  });

  it("mit Zwischenablage: „Kopiert“ am Knopf und in der Ansage, kein Feld", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const host = zeige(<KopierenKnopf wert="abc-123" label="Kennung" />);
    await act(async () => {
      host.querySelector("button")!.click();
    });
    expect(writeText).toHaveBeenCalledWith("abc-123");
    expect(host.querySelector("button")!.textContent).toBe("Kopiert");
    expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Kennung: Kopiert");
    expect(host.querySelector('[role="status"]')?.textContent).toBe("Kopiert");
    expect(host.querySelector("textarea")).toBeNull();
  });

  it("der Wert steht sichtbar daneben, mit `label` als Name von Wert und Knopf", () => {
    const host = zeige(<KopierenKnopf wert="dienst@beispiel.de" label="Adresse" />);
    const wert = host.querySelector(".wert");
    expect(wert?.textContent).toBe("dienst@beispiel.de");
    expect(wert?.getAttribute("aria-label")).toBe("Adresse");
    expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Adresse: Kopieren");
  });

  it("ohne Zusatz und ohne label heißt der Knopf wie sein sichtbarer Text", () => {
    const host = zeige(<KopierenKnopf wert="x" />);
    const knopf = host.querySelector("button")!;
    expect(knopf.textContent).toBe("Kopieren");
    expect(knopf.hasAttribute("aria-label")).toBe(false);
  });

  it("Zusatz macht den zugänglichen Namen unterscheidbar und beginnt mit dem sichtbaren Text", () => {
    const host = zeige(<KopierenKnopf wert="x" label="Satz" zusatz="Satz 2" />);
    const knopf = host.querySelector("button")!;
    expect(knopf.textContent).toBe("Kopieren Satz 2");
    expect(knopf.hasAttribute("aria-label")).toBe(false);
    expect(knopf.querySelector(".versteckt")?.textContent).toBe(" Satz 2");
  });

  it("ohneFunktion sperrt den Knopf mit Hinweis, kompakt wählt die kleine Fassung", () => {
    const host = zeige(<KopierenKnopf wert="#b5e545" label="HEX Lime" ohneFunktion kompakt />);
    const knopf = host.querySelector("button")!;
    expect(knopf.disabled).toBe(true);
    expect(knopf.getAttribute("title")).toBe(KOPIEREN_TEXTE.ohneFunktion);
    expect(knopf.className).toBe("knopfKompakt");
    expect(host.firstElementChild?.className).toBe("kopierenKompakt");
  });
});
