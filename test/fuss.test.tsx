// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Fuss, type FussProps } from "../src/Fuss";
import { fussLinks } from "../src/fuss-links";
import w from "../src/werkplan.module.css";
import { FIRMA, FUSS_TEXTE, FUSS_VERSION } from "../src/ziele";
import { dom } from "./dom-hilfe";

// Fuß „fokus“ als Server-HTML (Plan fuss-baustein, Fertig heißt 3): ohne
// <footer>, Skript, target und Knopf, alle Ziele als Links, Logo ohne Link,
// Markenzeile einmal, B2B-Zeile nach `b2b`, Stand nur mit Wert. Die Regeln für
// Quelle und CSS prüft test/fuss-vertrag.test.ts (läuft unter node).

const GRUND: FussProps = { variante: "fokus", b2b: false, blatt: "Gründung · Website", stand: "03.11.2026" };

// React 19 stellt dem Markup ein <link rel="preload"> für das Logo voran; die
// Wurzel des Fußes ist deshalb das Element mit data-fuss, nicht das erste.
function fuss(props: Partial<FussProps> = {}): HTMLElement {
  const wurzel = dom(renderToStaticMarkup(<Fuss {...GRUND} {...props} />)).body.querySelector<HTMLElement>("[data-fuss]");
  if (!wurzel) throw new Error("kein Element im Markup");
  return wurzel;
}

const links = (wurzel: Element) => [...wurzel.querySelectorAll("a")].map((a) => [a.getAttribute("href"), a.textContent]);

const FAELLE = (["du", "sie"] as const).flatMap((anrede) => [true, false].map((b2b) => ({ anrede, b2b })));

describe.each(FAELLE)("fokus in $anrede, b2b $b2b", ({ anrede, b2b }) => {
  const markup = renderToStaticMarkup(<Fuss {...GRUND} anrede={anrede} b2b={b2b} />);
  const wurzel = dom(markup).body;

  it("ohne footer, Skript, target und Knopf", () => {
    expect(wurzel.querySelector("footer")).toBeNull();
    expect(wurzel.querySelector("script")).toBeNull();
    expect(wurzel.querySelector("[target]")).toBeNull();
    expect(wurzel.querySelector("button")).toBeNull();
  });

  it("zeigt die Markenzeile genau einmal", () => {
    expect(markup.split(FIRMA.markenzeile)).toHaveLength(2);
  });

  it("setzt jedes Ziel als Link mit href und Text aus fussLinks", () => {
    expect(links(wurzel)).toEqual(fussLinks({ variante: "fokus" }).map((eintrag) => [eintrag.href, eintrag.text]));
  });

  it("zeigt das Logo ohne Link", () => {
    const logo = wurzel.querySelector('img[alt="powerhandwerk"]');
    expect(logo).not.toBeNull();
    expect(logo?.closest("a")).toBeNull();
  });

  it("wählt den Kontaktsatz nach der Anrede", () => {
    const andere = anrede === "du" ? "sie" : "du";
    expect(wurzel.textContent).toContain(FUSS_TEXTE.kontaktSatz[anrede]);
    expect(wurzel.textContent).not.toContain(FUSS_TEXTE.kontaktSatz[andere]);
  });

  it("zeigt die B2B-Zeile nur mit b2b", () => {
    expect(wurzel.textContent?.includes(FUSS_TEXTE.b2b)).toBe(b2b);
  });

  it("trägt Fassung und Version an der Wurzel", () => {
    const element = wurzel.querySelector("[data-fuss]");
    expect(element?.getAttribute("data-fuss")).toBe("fokus");
    expect(element?.getAttribute("data-fuss-version")).toBe(FUSS_VERSION);
  });
});

describe("Fuss", () => {
  it("ordnet den Kontakt unter einer Überschrift und das Recht in einer benannten Navigation", () => {
    const wurzel = fuss();
    expect(wurzel.querySelector("section > h2")?.textContent).toBe("Kontakt");
    const nav = wurzel.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe("Rechtliches");
    expect([...(nav?.querySelectorAll("li > a") ?? [])].map((a) => a.textContent)).toEqual(["Impressum", "Datenschutz"]);
  });

  it("der zugängliche Name des WhatsApp-Links enthält den sichtbaren Text (WCAG 2.5.3)", () => {
    const wurzel = fuss();
    const link = wurzel.querySelector('a[href^="https://wa.me/"]');
    expect(link?.textContent).toBe("WhatsApp");
    expect(link?.getAttribute("aria-label")).toContain("WhatsApp");
    expect(wurzel.querySelectorAll("a[aria-label]")).toHaveLength(1);
  });

  it("zeigt das Feld Stand nur mit Stand", () => {
    const labels = (props: Partial<FussProps>) => [...fuss(props).querySelectorAll("dt")].map((dt) => dt.textContent);
    expect(labels({})).toEqual(["Herausgeber", "Blatt", "Stand", "Ansprechpartner"]);
    expect(labels({ stand: undefined })).toEqual(["Herausgeber", "Blatt", "Ansprechpartner"]);
    expect(labels({ stand: " " })).toEqual(["Herausgeber", "Blatt", "Ansprechpartner"]);
    expect(fuss().querySelector("dl")?.textContent).toContain("03.11.2026");
  });

  it("zieht ohne Stand den Ansprechpartner über beide Spalten", () => {
    const zellen = (props: Partial<FussProps>) => [...fuss(props).querySelectorAll("dl > div")];
    expect(zellen({}).filter((zelle) => zelle.classList.contains(w.plankopfBreit))).toHaveLength(0);
    const ohneStand = zellen({ stand: undefined });
    expect(ohneStand.at(-1)?.classList.contains(w.plankopfBreit)).toBe(true);
    expect(ohneStand.at(-1)?.textContent).toBe("AnsprechpartnerAndreas Keller");
  });

  it.each([{ basis: "https://powerhandwerk.de" }, { leistungsschein: "/agb-anlage-1-leistungsschein.pdf" }])(
    "reicht %o an fussLinks durch",
    (optionen) => {
      expect(links(fuss(optionen))).toEqual(fussLinks({ variante: "fokus", ...optionen }).map((eintrag) => [eintrag.href, eintrag.text]));
    },
  );

  it("hängt eine zusätzliche Klasse an die Wurzel", () => {
    expect(fuss({ className: "extra" }).className).toContain("extra");
  });
});
