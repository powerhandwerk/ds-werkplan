// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Leistungskarten } from "../src/Leistungskarten";
import { LEISTUNGSKARTEN_BEISPIELE, LEISTUNGSKARTEN_MUSTER } from "../src/leistungskarten-beispiele";
import { ruheWert, vermesse, zeichne, zeichneRuhe, type LeistungsKarte, type Szene } from "../src/leistungskarten-engine";
import css from "../src/leistungskarten.module.css";
import { GRAFIK } from "../src/tokens";
import { attrappeBeobachter, attrappeGeraet } from "./browser-attrappen";
import { dom, zeige } from "./dom-hilfe";

// Komponente von Stil A: Server-HTML im Ruhezustand, Motor im Client mit
// Hover, Fokus, Handy-Geste und reduzierter Bewegung; robust ohne matchMedia
// und IntersectionObserver.

const SZENEN = LEISTUNGSKARTEN_BEISPIELE;
const KARTEN = LEISTUNGSKARTEN_MUSTER;
const SVG = "http://www.w3.org/2000/svg";

/** Markup so, wie es der Browser nach innerHTML im SVG serialisiert. */
function alsDom(markup: string): string {
  const g = document.createElementNS(SVG, "g");
  g.innerHTML = markup;
  return g.innerHTML;
}

const ende = (szene: Szene) => alsDom(zeichne(szene, { ...ruheWert(szene), t: 1 }));
const ruhe = (szene: Szene) => alsDom(zeichneRuhe(szene));
const bild = (host: HTMLElement, schluessel: string) =>
  host.querySelector(`article[data-szene="${schluessel}"] svg g`)?.innerHTML;
/**
 * Markup gleich bis auf Rundung: Der Motor hört auf zu zeichnen, sobald ein
 * Wert näher als 0,0015 am Ziel ist (wie auf der Website); im letzten Bild
 * liegen Deckkraft und Längen deshalb knapp neben dem Ziel. Gleich sein muss
 * der Aufbau (dieselben Elemente), die Zahlen auf einen halben Bildpunkt.
 */
function erwarteFast(ist: string | undefined, soll: string) {
  const zahl = /-?\d+(?:\.\d+)?/g;
  expect(ist?.replace(zahl, "#")).toBe(soll.replace(zahl, "#"));
  const a = ist?.match(zahl)?.map(Number) ?? [];
  const b = soll.match(zahl)?.map(Number) ?? [];
  expect(a.every((v, i) => Math.abs(v - b[i]) <= 0.5)).toBe(true);
}

/** Eigene Wurzel, wenn ein Test neu rendern oder selbst abbauen muss. */
function wurzel() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  return {
    host,
    zeige: (element: ReactNode) => act(() => root.render(element)),
    abbauen: () => {
      act(() => root.unmount());
      host.remove();
    },
  };
}

/** Ein paar Bilder des rAF-Takts laufen lassen. */
const takt = (ms = 100) => act(() => vi.advanceTimersByTime(ms));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "setInterval", "clearInterval", "performance"] });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Server-HTML", () => {
  const doc = dom(renderToStaticMarkup(<Leistungskarten karten={KARTEN} szenen={SZENEN} untergrund="papier" />));

  it("je Karte ein fokussierbares article mit Titel als Name", () => {
    const artikel = [...doc.querySelectorAll("article")];
    expect(artikel).toHaveLength(KARTEN.length);
    for (const a of artikel) {
      expect(a.getAttribute("tabindex")).toBe("0");
      const titel = doc.getElementById(a.getAttribute("aria-labelledby") ?? "");
      expect(titel?.tagName).toBe("H3");
      expect(a.contains(titel)).toBe(true);
    }
  });

  it("svg mit vermessenem viewBox und Ruhezustand, Bühne mit Sucher-Ecken und aria-hidden", () => {
    for (const k of KARTEN) {
      const szene = SZENEN[k.szene as keyof typeof SZENEN];
      const svg = doc.querySelector(`article[data-szene="${k.szene}"] svg`);
      expect(svg?.getAttribute("viewBox")).toBe(vermesse(szene));
      expect(svg?.querySelector("g")?.innerHTML).toBe(dom(`<svg><g>${zeichneRuhe(szene)}</g></svg>`).querySelector("g")?.innerHTML);
      const buehne = svg?.parentElement;
      expect(buehne?.getAttribute("aria-hidden")).toBe("true");
      expect(buehne?.querySelectorAll(":scope > span[aria-hidden]")).toHaveLength(4);
    }
  });

  it("Texte als Kinder, Nummer und Bezug nur wenn gesetzt", () => {
    const markup = renderToStaticMarkup(
      <Leistungskarten
        karten={[{ szene: "profil", titel: "<b>Titel</b>", teaser: "Text", schliesst: "schließt Pos. 01" }]}
        szenen={SZENEN}
        untergrund="nacht"
      />,
    );
    expect(markup).toContain("&lt;b&gt;Titel&lt;/b&gt;");
    expect(markup).toContain("schließt Pos. 01");
    expect(dom(markup).querySelector(`.${css.nr}`)).toBeNull();
  });
});

describe("Motor im Client", () => {
  it("reduzierte Bewegung: nach dem Mount steht das Ende der Geste", () => {
    attrappeGeraet({ reduziert: true });
    const host = zeige(<Leistungskarten karten={KARTEN} szenen={SZENEN} untergrund="papier" />);
    takt();
    for (const [schluessel, szene] of Object.entries(SZENEN)) expect(bild(host, schluessel)).toBe(ende(szene));
  });

  it("ohne matchMedia und ohne IntersectionObserver: kein Fehler und Endzustand", () => {
    expect(typeof window.matchMedia).toBe("undefined");
    expect(typeof globalThis.IntersectionObserver).toBe("undefined");
    const host = zeige(<Leistungskarten karten={KARTEN} szenen={SZENEN} untergrund="nacht" />);
    takt();
    for (const [schluessel, szene] of Object.entries(SZENEN)) expect(bild(host, schluessel)).toBe(ende(szene));
  });

  it("Rechner mit Hover: Ruhezustand bleibt bis zur Aktivierung", () => {
    attrappeGeraet({ hover: true });
    const host = zeige(<Leistungskarten karten={KARTEN} szenen={SZENEN} untergrund="papier" />);
    takt();
    expect(bild(host, "profil")).toBe(ruhe(SZENEN.profil));
  });

  it("Tastaturfokus setzt die Aktiv-Klasse und spielt die Geste, Blur nimmt beides zurück", () => {
    attrappeGeraet({ hover: true });
    const host = zeige(<Leistungskarten karten={KARTEN} szenen={SZENEN} untergrund="papier" />);
    const karte = host.querySelector<HTMLElement>('article[data-szene="profil"]');
    if (!karte) throw new Error("Karte fehlt");
    act(() => karte.focus());
    expect(karte.classList.contains(css.an)).toBe(true);
    takt(5000);
    erwarteFast(bild(host, "profil"), ende(SZENEN.profil));
    act(() => karte.blur());
    expect(karte.classList.contains(css.an)).toBe(false);
    takt(5000);
    erwarteFast(bild(host, "profil"), ruhe(SZENEN.profil));
  });

  it("Handy ohne Hover: die Geste läuft ab, sobald die Karte im Bild ist", () => {
    attrappeGeraet({ hover: false });
    const io = attrappeBeobachter();
    const host = zeige(<Leistungskarten karten={KARTEN} szenen={SZENEN} untergrund="papier" />);
    takt();
    expect(bild(host, "profil")).toBe(ruhe(SZENEN.profil));
    const karte = host.querySelector('article[data-szene="profil"]');
    if (!karte) throw new Error("Karte fehlt");
    act(() => io.melde(karte, 1));
    takt(5000);
    erwarteFast(bild(host, "profil"), ende(SZENEN.profil));
    act(() => io.melde(karte, 0));
    takt(5000);
    erwarteFast(bild(host, "profil"), ruhe(SZENEN.profil));
  });

  it("Handy: unter dem Sichtanteil bleibt die Ruhe, über ihm läuft die Geste einmal, ganz draußen kommt die Ruhe", () => {
    attrappeGeraet({ hover: false });
    const io = attrappeBeobachter();
    const host = zeige(<Leistungskarten karten={KARTEN} szenen={SZENEN} untergrund="papier" />);
    const karte = host.querySelector('article[data-szene="profil"]');
    if (!karte) throw new Error("Karte fehlt");
    // Erster Rückruf beim Beobachten: Die Karte ist erst zu einem Drittel im Bild.
    act(() => io.melde(karte, 0.3));
    takt(5000);
    expect(bild(host, "profil")).toBe(ruhe(SZENEN.profil));
    act(() => io.melde(karte, GRAFIK.handyStartAnteil + 0.1));
    takt(5000);
    erwarteFast(bild(host, "profil"), ende(SZENEN.profil));
    // Zurück unter die Schwelle, aber noch im Bild: kein Neustart, die Geste bleibt stehen.
    act(() => io.melde(karte, 0.5));
    takt(16);
    erwarteFast(bild(host, "profil"), ende(SZENEN.profil));
    act(() => io.melde(karte, GRAFIK.handyStartAnteil + 0.2));
    takt(16);
    erwarteFast(bild(host, "profil"), ende(SZENEN.profil));
    act(() => io.melde(karte, 0));
    takt(5000);
    erwarteFast(bild(host, "profil"), ruhe(SZENEN.profil));
  });

  it("der Sichtanteil der Handy-Geste ist GRAFIK.handyStartAnteil", () => {
    attrappeGeraet({ hover: false });
    const io = attrappeBeobachter();
    zeige(<Leistungskarten karten={KARTEN} szenen={SZENEN} untergrund="papier" />);
    expect(io.beobachter).toHaveLength(1);
    expect(io.beobachter[0].optionen?.threshold).toBe(GRAFIK.handyStartAnteil);
  });

  it("Unmount trennt den Beobachter", () => {
    attrappeGeraet({ hover: false });
    const io = attrappeBeobachter();
    const w = wurzel();
    w.zeige(<Leistungskarten karten={KARTEN} szenen={SZENEN} untergrund="papier" />);
    expect(io.beobachter).toHaveLength(1);
    expect(io.beobachter[0].ziele.size).toBe(KARTEN.length);
    w.abbauen();
    expect(io.beobachter[0].getrennt).toBe(true);
  });
});

describe("Schnittstelle", () => {
  it("eine Karte mit unbekanntem Szenen-Schlüssel fällt weg", () => {
    const karten: LeistungsKarte[] = [{ szene: "fehlt", titel: "Fehlt", teaser: "x" }, ...KARTEN, { szene: "toString", titel: "Erbe", teaser: "x" }];
    const doc = dom(renderToStaticMarkup(<Leistungskarten karten={karten} szenen={SZENEN} untergrund="papier" />));
    expect([...doc.querySelectorAll("article")].map((a) => a.getAttribute("data-szene"))).toEqual(KARTEN.map((k) => k.szene));
    attrappeGeraet({ reduziert: true });
    expect(() => {
      zeige(<Leistungskarten karten={karten} szenen={SZENEN} untergrund="papier" />);
      takt();
    }).not.toThrow();
  });

  it("zwei Karten mit derselben Szene: eigene IDs, jeder Titel benennt seine Karte", () => {
    const karten: LeistungsKarte[] = [
      { szene: "profil", titel: "Erste", teaser: "a" },
      { szene: "profil", titel: "Zweite", teaser: "b" },
    ];
    const doc = dom(renderToStaticMarkup(<Leistungskarten karten={karten} szenen={SZENEN} untergrund="papier" />));
    const artikel = [...doc.querySelectorAll("article")];
    expect(artikel).toHaveLength(2);
    expect(new Set(artikel.map((a) => a.getAttribute("aria-labelledby"))).size).toBe(2);
    expect(artikel.map((a) => doc.getElementById(a.getAttribute("aria-labelledby") ?? "")?.textContent)).toEqual(["Erste", "Zweite"]);
    const fehler = vi.spyOn(console, "error").mockImplementation(() => {});
    attrappeGeraet({ reduziert: true });
    zeige(<Leistungskarten karten={karten} szenen={SZENEN} untergrund="papier" />);
    const meldungen = fehler.mock.calls.map((aufruf) => String(aufruf[0]));
    fehler.mockRestore();
    expect(meldungen).toEqual([]);
  });

  it("ein neues szenen-Objekt wird übernommen", () => {
    attrappeGeraet({ reduziert: true });
    const karten: LeistungsKarte[] = [{ szene: "x", titel: "X", teaser: "x" }];
    const w = wurzel();
    w.zeige(<Leistungskarten karten={karten} szenen={{ x: SZENEN.profil }} untergrund="papier" />);
    takt();
    expect(bild(w.host, "x")).toBe(ende(SZENEN.profil));
    w.zeige(<Leistungskarten karten={karten} szenen={{ x: SZENEN.sanierung }} untergrund="papier" />);
    takt();
    expect(w.host.querySelector("svg")?.getAttribute("viewBox")).toBe(vermesse(SZENEN.sanierung));
    expect(bild(w.host, "x")).toBe(ende(SZENEN.sanierung));
    w.abbauen();
  });

  it.each([
    ["papier", css.untergrundPapier],
    ["nacht", css.untergrundNacht],
  ] as const)("untergrund %s wählt die Flächenklasse %s", (untergrund, klasse) => {
    const doc = dom(renderToStaticMarkup(<Leistungskarten karten={KARTEN} szenen={SZENEN} untergrund={untergrund} />));
    for (const a of doc.querySelectorAll("article")) {
      expect(a.classList.contains(klasse)).toBe(true);
      expect(a.classList.contains(css.karte)).toBe(true);
    }
  });

  it("breit legt die Querform an, genau vier Karten das Viererraster", () => {
    const liste = (karten: readonly LeistungsKarte[], breit?: boolean, szenen: Readonly<Record<string, Szene>> = SZENEN) =>
      dom(renderToStaticMarkup(<Leistungskarten karten={karten} szenen={szenen} untergrund="papier" breit={breit} />)).querySelector("ul");
    expect(liste(KARTEN.slice(0, 1), true)?.classList.contains(css.rasterBreit)).toBe(true);
    expect(liste(KARTEN)?.className).toBe(css.raster);
    const register = { a: SZENEN.profil, b: SZENEN.sanierung, c: SZENEN.profil, d: SZENEN.sanierung };
    const vier = Object.keys(register).map((szene) => ({ szene, titel: szene, teaser: "x" }));
    expect(liste(vier, false, register)?.classList.contains(css.rasterVier)).toBe(true);
  });
});
