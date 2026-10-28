import { act } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EXPLOSION_STUFEN, explosionProfil } from "../src/explosion";
import { IsoSzene, type IsoZeichnung } from "../src/IsoSzene";
import pal from "../src/isopalette.module.css";
import { GRAFIK } from "../src/tokens";
import { attrappeBeobachter, attrappeGeraet } from "./browser-attrappen";
import { eigeneWurzel, zeige } from "./dom-hilfe";

// IsoSzene: Server-HTML im Ausgangszustand, Ablauf in Stufen ab dem
// Sichtanteil GRAFIK.isoStartAnteil im Takt GRAFIK.isoTaktMs, sofort alles bei
// reduzierter Bewegung oder fehlenden Browser-APIs.

const zeichnung: IsoZeichnung = explosionProfil({ idPraefix: "t-" });
const BESCHREIBUNG = "Ein Profil, in seine vier Stellen zerlegt.";

const szene = (extra: Partial<Parameters<typeof IsoSzene>[0]> = {}) => (
  <IsoSzene zeichnung={zeichnung} stufen={EXPLOSION_STUFEN} beschreibung={BESCHREIBUNG} {...extra} />
);

const stand = (host: HTMLElement) => host.querySelector("svg")!.getAttribute("data-stand");

afterEach(() => {
  vi.useRealTimers();
});

describe("IsoSzene", () => {
  it("Server-HTML: data-stand 0, role img, aria-label aus beschreibung, Palette und Klasse der Zeichnung", () => {
    const html = renderToString(szene({ unterschrift: "Muster, keine echten Daten." }));
    expect(html).toMatch(/<svg[^>]*data-stand="0"/);
    expect(html).toMatch(/<svg[^>]*role="img"/);
    expect(html).toContain(`aria-label="${BESCHREIBUNG}"`);
    expect(html).toContain(`class="${pal.palette} ${zeichnung.klasse}"`);
    expect(html).toContain("--f-bp-soft:url(#t-bp-soft)");
    expect(html).toMatch(/<figcaption[^>]*>Muster, keine echten Daten\.<\/figcaption>/);
    expect(html).not.toContain("data-fokus");
  });

  it("fokus steht als data-fokus am SVG", () => {
    const html = renderToString(szene({ fokus: 2 }));
    expect(html).toMatch(/<svg[^>]*data-fokus="2"/);
  });

  it("bei reduzierter Bewegung stehen sofort alle Stufen", () => {
    attrappeGeraet({ reduziert: true });
    const beobachter = attrappeBeobachter();
    const host = zeige(szene());
    expect(stand(host)).toBe(String(EXPLOSION_STUFEN));
    expect(beobachter.beobachter).toHaveLength(0);
  });

  it("ohne matchMedia und ohne IntersectionObserver (jsdom) stehen sofort alle Stufen", () => {
    expect(typeof window.matchMedia).toBe("undefined");
    expect(typeof IntersectionObserver).toBe("undefined");
    expect(stand(zeige(szene()))).toBe(String(EXPLOSION_STUFEN));
  });

  it("ohne IntersectionObserver, aber mit matchMedia stehen sofort alle Stufen", () => {
    attrappeGeraet();
    expect(stand(zeige(szene()))).toBe(String(EXPLOSION_STUFEN));
  });

  it("ab dem Startanteil rasten die Stufen 1 bis n im Takt ein", () => {
    vi.useFakeTimers();
    attrappeGeraet();
    const attrappe = attrappeBeobachter();
    const host = zeige(szene());
    const svg = host.querySelector("svg")!;
    expect(stand(host)).toBe("0");
    expect(attrappe.beobachter).toHaveLength(1);
    expect(attrappe.beobachter[0].optionen?.threshold).toBe(GRAFIK.isoStartAnteil);

    act(() => attrappe.melde(svg, GRAFIK.isoStartAnteil - 0.1));
    act(() => vi.advanceTimersByTime(GRAFIK.isoTaktMs * 10));
    expect(stand(host), "unter dem Startanteil passiert nichts").toBe("0");

    act(() => attrappe.melde(svg, GRAFIK.isoStartAnteil));
    expect(attrappe.beobachter[0].getrennt, "läuft nur einmal").toBe(true);
    act(() => vi.advanceTimersByTime(0));
    expect(stand(host)).toBe("1");
    for (let n = 2; n <= EXPLOSION_STUFEN; n++) {
      act(() => vi.advanceTimersByTime(GRAFIK.isoTaktMs - 1));
      expect(stand(host), `kurz vor Stufe ${n}`).toBe(String(n - 1));
      act(() => vi.advanceTimersByTime(1));
      expect(stand(host)).toBe(String(n));
    }
    expect(vi.getTimerCount()).toBe(0);
  });

  it("Unmount räumt Timer und Beobachter ab", () => {
    vi.useFakeTimers();
    attrappeGeraet();
    const attrappe = attrappeBeobachter();
    const erste = eigeneWurzel();
    erste.zeige(szene());
    act(() => attrappe.melde(erste.host.querySelector("svg")!, 1));
    act(() => vi.advanceTimersByTime(GRAFIK.isoTaktMs));
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    erste.abbauen();
    expect(vi.getTimerCount()).toBe(0);

    // Auch vor dem Start: Unmount trennt den Beobachter.
    const zweite = eigeneWurzel();
    zweite.zeige(szene());
    const zweiter = attrappe.beobachter.at(-1)!;
    expect(zweiter.getrennt).toBe(false);
    zweite.abbauen();
    expect(zweiter.getrennt).toBe(true);
  });
});
