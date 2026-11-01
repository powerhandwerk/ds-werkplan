// @vitest-environment jsdom
import { act } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Paket } from "../src/abo-icon";
import { LaufzeitBereich, LaufzeitSchalter } from "../src/LaufzeitSchalter";
import { Paketkarten, type PaketGrund, type Paketkarte, type PaketkartenProps, type PaketPreis } from "../src/Paketkarten";
import { LAUFZEIT_TEXTE, PAKETKARTEN_TEXTE } from "../src/standards";
import { dom, zeige } from "./dom-hilfe";

// Paketkarten: Server-HTML mit allen Rasterplätzen, Empfehlung im Gegenton,
// beiden Laufzeiten im Markup und --pk-zeilen an der Wurzel. Schalter und
// Bereich: Klick, aria-pressed, data-laufzeit und Info-Zeile. Testdaten
// neutral, Beträge nur als Nullen (Repo öffentlich).

const preis = (zusatz?: { 24?: string; 12?: string }): Record<12 | 24, PaketPreis> => ({
  24: { betrag: "00 €", einheit: "im Monat, 24", zusatz: zusatz?.[24] },
  12: { betrag: "000 €", einheit: "im Monat, 12", zusatz: zusatz?.[12] },
});

const karte = (paket: Paket, extra: Partial<Paketkarte> = {}): Paketkarte => ({
  paket,
  nutzen: `Nutzen ${paket}`,
  fuerWen: `Für wen ${paket}`,
  preis: preis(),
  label: `Label ${paket}`,
  reihen: [
    { zeichen: "feinschliff", titel: "Titel eins", text: "Text eins" },
    { zeichen: "kundenseite", titel: "Titel zwei", text: "Text zwei" },
  ],
  ...extra,
});

const DREI: Paketkarte[] = [karte("Standard"), karte("Profi"), karte("Platzhirsch")];

function wurzel(props: PaketkartenProps): HTMLElement {
  const el = dom(renderToString(<Paketkarten {...props} />)).body.firstElementChild;
  if (!(el instanceof HTMLElement)) throw new Error("keine Wurzel im Markup");
  return el;
}

const karten = (el: HTMLElement) => [...el.querySelectorAll("section")];
const zeilen = (el: HTMLElement) => el.style.getPropertyValue("--pk-zeilen");

describe("Paketkarten: Server-HTML", () => {
  it("rendert drei Karten in ihrer Reihenfolge mit Emblem, Name als h3 und Liste", () => {
    const el = wurzel({ karten: DREI });
    expect(karten(el).map((k) => k.querySelector("h3")?.textContent)).toEqual(["Standard", "Profi", "Platzhirsch"]);
    for (const k of karten(el)) {
      expect(k.querySelector("svg[data-abo-stage]")?.getAttribute("width")).toBe("28");
      const reihen = k.querySelectorAll("ul > li");
      expect(reihen).toHaveLength(2);
      const zeichen = reihen[0].querySelector("svg");
      expect(zeichen?.getAttribute("width")).toBe("44");
      expect(zeichen?.getAttribute("aria-hidden")).toBe("true");
      expect(reihen[0].textContent).toContain("Titel eins");
      expect(reihen[0].textContent).toContain("Text eins");
    }
  });

  it("benennt die Karten, die Empfehlung mit Zusatz", () => {
    const el = wurzel({ karten: DREI, empfohlen: "Profi" });
    expect(karten(el).map((k) => k.getAttribute("aria-label"))).toEqual([
      "Paket Standard",
      "Paket Profi, unsere Empfehlung",
      "Paket Platzhirsch",
    ]);
  });

  it("trägt das Etikett genau einmal, nur an der Empfehlung", () => {
    const el = wurzel({ karten: DREI, empfohlen: "Profi" });
    const etiketten = el.querySelectorAll(".etikett");
    expect(etiketten).toHaveLength(1);
    expect(etiketten[0].textContent).toBe(PAKETKARTEN_TEXTE.empfehlung);
    expect(etiketten[0].closest("section")?.getAttribute("aria-label")).toContain("Profi");
    expect(wurzel({ karten: DREI }).querySelectorAll(".etikett")).toHaveLength(0);
  });

  it.each([
    ["papier", "nachtKarte", "aufNacht", "nacht"],
    ["nacht", "papierKarte", "aufPapier", "papier"],
  ] as const)("auf %s steht die Empfehlung im Gegenton (%s, %s, Zeichen %s), die übrigen im Grund der Fläche", (untergrund, karteKlasse, flaeche, gegen) => {
    const gruende: PaketGrund[] = [];
    const mitAktion = DREI.map((k) => ({ ...k, aktion: (grund: PaketGrund) => (gruende.push(grund), <a href="#x">Weiter</a>) }));
    const el = wurzel({ karten: mitAktion, empfohlen: "Profi", untergrund });
    const [standard, profi, platzhirsch] = karten(el);
    expect(profi.classList.contains("empfohlen")).toBe(true);
    expect(profi.classList.contains(karteKlasse)).toBe(true);
    expect(profi.classList.contains(flaeche)).toBe(true);
    for (const zeichen of profi.querySelectorAll("li svg")) expect(zeichen.classList.contains(gegen)).toBe(true);
    for (const k of [standard, platzhirsch]) {
      expect(k.className).toBe("karte");
      for (const zeichen of k.querySelectorAll("li svg")) expect(zeichen.classList.contains(untergrund)).toBe(true);
    }
    expect(gruende).toEqual([untergrund, gegen, untergrund]);
  });

  it("stellt beide Laufzeiten ins Markup, Betrag und Einheit je Laufzeit in einer Hülle", () => {
    const el = wurzel({ karten: DREI });
    const preis = karten(el)[0].querySelector(".preis")!;
    const huellen = [...preis.children];
    expect(huellen.map((h) => h.getAttribute("data-nur"))).toEqual(["24", "12"]);
    expect(huellen[0].querySelector(".mess")?.textContent).toBe("00 €");
    expect(huellen[0].querySelector(".einheit")?.textContent).toBe("im Monat, 24");
    expect(huellen[1].querySelector(".mess")?.textContent).toBe("000 €");
    expect(huellen[1].querySelector(".einheit")?.textContent).toBe("im Monat, 12");
  });

  it("setzt data-laufzeit nur mit Prop", () => {
    expect(wurzel({ karten: DREI }).hasAttribute("data-laufzeit")).toBe(false);
    expect(wurzel({ karten: DREI, laufzeit: 12 }).getAttribute("data-laufzeit")).toBe("12");
    expect(wurzel({ karten: DREI, laufzeit: 24 }).getAttribute("data-laufzeit")).toBe("24");
  });

  const aktion = () => <a href="#x">Weiter</a>;
  it.each<[string, Paketkarte[], string, number, number]>([
    ["keins", DREI, "6", 0, 0],
    ["Zusatz", DREI.map((k) => ({ ...k, preis: preis({ 24: "Zusatz 24", 12: "Zusatz 12" }) })), "7", 3, 0],
    ["Aktion", DREI.map((k) => ({ ...k, aktion })), "7", 0, 3],
    ["beides", DREI.map((k) => ({ ...k, preis: preis({ 24: "Zusatz 24", 12: "Zusatz 12" }), aktion })), "8", 3, 3],
    ["Zusatz nur bei 12", [karte("Standard"), karte("Profi", { preis: preis({ 12: "Zusatz 12" }) }), karte("Platzhirsch")], "7", 3, 0],
    ["Aktion nur an einer Karte", [karte("Standard"), karte("Profi", { aktion }), karte("Platzhirsch")], "7", 0, 3],
  ])("--pk-zeilen bei %s: %s, jede Karte hat jeden Platz", (_fall, liste, erwartet, zusaetze, aktionen) => {
    const el = wurzel({ karten: liste });
    expect(zeilen(el)).toBe(erwartet);
    expect(el.querySelectorAll(".zusatz")).toHaveLength(zusaetze);
    expect(el.querySelectorAll(".aktion")).toHaveLength(aktionen);
    // Rasterplätze je Karte: Kopf bis Aktion links, Label und Liste rechts.
    for (const k of karten(el)) {
      const plaetze = k.querySelector(".links")!.children.length + k.querySelector(".rechts")!.children.length;
      expect(plaetze).toBe(Number(erwartet));
    }
  });

  it("lässt fehlende Plätze leer: Zusatz nur bei 12 trägt nur den Span für 12", () => {
    const el = wurzel({ karten: [karte("Standard"), karte("Profi", { preis: preis({ 12: "Zusatz 12" }) })] });
    const [standard, profi] = karten(el);
    expect(standard.querySelector(".zusatz")?.childElementCount).toBe(0);
    const spans = [...profi.querySelector(".zusatz")!.children];
    expect(spans.map((s) => s.getAttribute("data-nur"))).toEqual(["12"]);
    expect(spans[0].textContent).toBe("Zusatz 12");
  });

  it("lässt die Aktion einer Karte ohne Aktion leer", () => {
    const el = wurzel({ karten: [karte("Standard"), karte("Profi", { aktion })] });
    const [standard, profi] = karten(el);
    expect(standard.querySelector(".aktion")?.childElementCount).toBe(0);
    expect(profi.querySelector(".aktion a")?.textContent).toBe("Weiter");
  });

  it("nimmt eigene Texte", () => {
    const el = wurzel({ karten: DREI, empfohlen: "Profi", texte: { empfehlung: "Tipp", karte: "Abo {paket}" } });
    expect(el.querySelector(".etikett")?.textContent).toBe("Tipp");
    expect(karten(el)[0].getAttribute("aria-label")).toBe("Abo Standard");
    expect(karten(el)[1].getAttribute("aria-label")).toBe("Paket Profi, unsere Empfehlung");
  });
});

const INFO = { 24: "Info 24", 12: "Info 12" };

describe("LaufzeitSchalter", () => {
  it("zeigt Beschriftung, Gruppe und 24 vor 12; Klick auf 12 ruft onWechsel(12), aria-pressed folgt", () => {
    const onWechsel = vi.fn();
    const host = zeige(<LaufzeitSchalter wert={24} onWechsel={onWechsel} />);
    expect(host.querySelector("p")?.textContent).toBe(LAUFZEIT_TEXTE.label);
    const gruppe = host.querySelector('[role="group"]')!;
    expect(gruppe.getAttribute("aria-label")).toBe(LAUFZEIT_TEXTE.gruppe);
    const knoepfe = [...gruppe.querySelectorAll("button")];
    expect(knoepfe.map((k) => k.textContent)).toEqual(["24 Monate", "12 Monate"]);
    expect(knoepfe.map((k) => k.getAttribute("aria-pressed"))).toEqual(["true", "false"]);
    act(() => knoepfe[1].click());
    expect(onWechsel).toHaveBeenCalledWith(12);
  });

  it("ohne info keine Info-Zeile", () => {
    const host = zeige(<LaufzeitSchalter wert={24} onWechsel={() => {}} />);
    expect(host.querySelector("[aria-live]")).toBeNull();
    expect(host.querySelector(".laufzeitInfo")).toBeNull();
  });

  it("mit info: beide Zeilen verdeckt, darüber die Live-Zeile der gewählten Laufzeit", () => {
    const host = zeige(<LaufzeitSchalter wert={12} onWechsel={() => {}} info={INFO} />);
    const verdeckt = [...host.querySelectorAll('.laufzeitInfo > p[aria-hidden="true"]')].map((p) => p.textContent);
    expect(verdeckt).toEqual(["Info 24", "Info 12"]);
    expect(host.querySelector('[aria-live="polite"]')?.textContent).toBe("Info 12");
  });
});

describe("LaufzeitBereich", () => {
  it("startet mit 24, setzt data-laufzeit um die Kinder und tauscht die Info-Zeile", () => {
    const host = zeige(
      <LaufzeitBereich info={INFO}>
        <Paketkarten karten={DREI} empfohlen="Profi" />
      </LaufzeitBereich>,
    );
    const bereich = host.firstElementChild as HTMLElement;
    expect(bereich.getAttribute("data-laufzeit")).toBe("24");
    expect(bereich.querySelector(".paketkarten")).not.toBeNull();
    expect(bereich.querySelector(".paketkarten")?.hasAttribute("data-laufzeit")).toBe(false);
    const live = () => host.querySelector('[aria-live="polite"]')?.textContent;
    expect(live()).toBe("Info 24");

    const [k24, k12] = [...host.querySelectorAll("button")];
    act(() => k12.click());
    expect(bereich.getAttribute("data-laufzeit")).toBe("12");
    expect(k12.getAttribute("aria-pressed")).toBe("true");
    expect(k24.getAttribute("aria-pressed")).toBe("false");
    expect(live()).toBe("Info 12");
  });

  it("nimmt start und eigene Texte", () => {
    const host = zeige(
      <LaufzeitBereich start={12} texte={{ option: "{monate} M." }}>
        <p>Inhalt</p>
      </LaufzeitBereich>,
    );
    expect(host.firstElementChild?.getAttribute("data-laufzeit")).toBe("12");
    expect([...host.querySelectorAll("button")].map((k) => k.textContent)).toEqual(["24 M.", "12 M."]);
    expect(host.querySelector("[aria-live]")).toBeNull();
  });
});
