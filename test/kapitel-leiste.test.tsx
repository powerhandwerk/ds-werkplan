// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { KapitelLeiste } from "../src/KapitelLeiste";

// Inhaltsleiste des Erscheinungsbilds (aus dem Admin, ADR-245): markiert das
// letzte Kapitel, dessen Kopf das obere Drittel erreicht hat, auch beim
// Zurückscrollen, und am Seitenende das letzte Kapitel.

const KAPITEL = [
  { id: "k-1", name: "Marke" },
  { id: "k-2", name: "Logo" },
  { id: "k-3", name: "Dateien und Rechte" },
];
/** Lage der Kapitelköpfe im Dokument; sichtbar ist davon `top - scrollY`. */
const LAGE: Record<string, number> = { "k-1": 0, "k-2": 1000, "k-3": 2000 };

let wurzel: Root;
let huelle: HTMLDivElement;

beforeEach(() => {
  for (const k of KAPITEL) {
    const sektion = document.createElement("section");
    sektion.id = k.id;
    sektion.getBoundingClientRect = () => ({ top: LAGE[k.id]! - window.scrollY }) as DOMRect;
    document.body.appendChild(sektion);
  }
  huelle = document.createElement("div");
  document.body.appendChild(huelle);
  wurzel = createRoot(huelle);
  Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 3000 });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 900 });
  scrolle(0);
});

afterEach(() => {
  act(() => wurzel.unmount());
  document.body.innerHTML = "";
});

const aktiv = () => [...huelle.querySelectorAll("a[aria-current]")].map((a) => a.getAttribute("href"));

function scrolle(y: number) {
  Object.defineProperty(window, "scrollY", { configurable: true, value: y });
  window.dispatchEvent(new Event("scroll"));
}

describe("KapitelLeiste", () => {
  it("markiert das Kapitel, dessen Kopf oben angekommen ist, auch beim Zurückscrollen", () => {
    act(() => wurzel.render(<KapitelLeiste titel="Inhalt" kapitel={KAPITEL} stand="3 Dateien" />));
    expect(aktiv()).toEqual(["#k-1"]);
    act(() => scrolle(800));
    expect(aktiv()).toEqual(["#k-2"]);
    act(() => scrolle(400));
    expect(aktiv()).toEqual(["#k-1"]);
    act(() => scrolle(900));
    expect(aktiv()).toEqual(["#k-2"]);
  });

  it("am Seitenende das letzte Kapitel, obwohl sein Kopf das obere Drittel nicht erreicht", () => {
    act(() => wurzel.render(<KapitelLeiste titel="Inhalt" kapitel={KAPITEL} stand="3 Dateien" />));
    act(() => scrolle(2100));
    expect(aktiv()).toEqual(["#k-3"]);
  });

  it("Titel, Stand und zweistellige Kapitelnummern; die Nummer kommt auf Wunsch als Prop", () => {
    act(() => wurzel.render(<KapitelLeiste titel="Inhalt" kapitel={KAPITEL} stand="3 Dateien" />));
    expect(huelle.querySelector("nav")?.getAttribute("aria-label")).toBe("Inhalt");
    expect([...huelle.querySelectorAll(".inhaltNr")].map((el) => el.textContent)).toEqual(["01", "02", "03"]);
    expect(huelle.querySelector(".inhaltStand")?.textContent).toBe("3 Dateien");
    act(() => wurzel.render(<KapitelLeiste titel="Inhalt" kapitel={KAPITEL} stand="" kapitelNr={(n) => `K${n}`} />));
    expect(huelle.querySelector(".inhaltNr")?.textContent).toBe("K1");
  });
});
