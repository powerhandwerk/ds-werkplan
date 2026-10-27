import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { REITER_TEXTE, Reiter, type ReiterEintrag } from "../src/Reiter";

// Navigation der Kundenseite, gehoben aus dem Admin (Kopfband und HandyMenue;
// dort geprüft in test/kundenseite-bereiche.test.tsx). Neutrale Beispielreiter.

const EINTRAEGE: ReiterEintrag[] = [
  { kennung: "uebersicht", name: "Übersicht", href: "/seite", stand: { text: "5 warten auf Sie", art: "hervor" } },
  { kennung: "google-profil", name: "Google-Profil", href: "/seite/google-profil", stand: { text: "Nicht geladen", art: "fehler" } },
  { kennung: "website", name: "Website", href: "/seite/website", stand: { text: "Läuft", art: "ruhig" } },
  { kennung: "berichte", name: "Berichte", href: null },
];

const LEISTE = `nav[aria-label="${REITER_TEXTE.leiste}"]`;
const MENUE = `nav[aria-label="${REITER_TEXTE.menueListe}"]`;

function dom(markup: string): Document {
  return new DOMParser().parseFromString(`<body>${markup}</body>`, "text/html");
}

describe("Reiter", () => {
  it("die Leiste zeigt alle Reiter in Reihenfolge; ohne Ziel ein span statt Link", () => {
    const d = dom(renderToStaticMarkup(<Reiter eintraege={EINTRAEGE} aktiv="uebersicht" />));
    expect([...d.querySelectorAll(`${LEISTE} li`)].map((li) => li.textContent)).toEqual(EINTRAEGE.map((r) => r.name));
    expect([...d.querySelectorAll(`${LEISTE} a`)].map((a) => a.getAttribute("href"))).toEqual(["/seite", "/seite/google-profil", "/seite/website"]);
    expect(d.querySelector(`${LEISTE} li:last-child span`)?.textContent).toBe("Berichte");
  });

  it("aria-current=\"page\" genau am aktiven Reiter, in Leiste und Menü", () => {
    for (const aktiv of ["uebersicht", "berichte"]) {
      const d = dom(renderToStaticMarkup(<Reiter eintraege={EINTRAEGE} aktiv={aktiv} />));
      for (const nav of [LEISTE, MENUE]) {
        const aktuell = [...d.querySelectorAll(`${nav} [aria-current]`)];
        expect(aktuell, nav).toHaveLength(1);
        expect(aktuell[0]!.getAttribute("aria-current")).toBe("page");
        expect(aktuell[0]!.textContent).toContain(EINTRAEGE.find((r) => r.kennung === aktiv)!.name);
      }
    }
    const ohne = dom(renderToStaticMarkup(<Reiter eintraege={EINTRAEGE} aktiv={null} />));
    expect(ohne.querySelectorAll("[aria-current]")).toHaveLength(0);
  });

  it("Handy-Menü: <details> mit <summary> ohne Skript und ohne Knopf, Zahl wartender Schritte im Namen", () => {
    const markup = renderToStaticMarkup(<Reiter eintraege={EINTRAEGE} aktiv="uebersicht" wartend={5} />);
    expect(markup).not.toContain("<script");
    expect(markup).not.toMatch(/\son[a-z]+=/i);
    const d = dom(markup);
    const menue = d.querySelector("details");
    expect(menue?.hasAttribute("open")).toBe(false);
    expect(d.querySelectorAll("button")).toHaveLength(0);
    const summary = menue?.querySelector("summary");
    expect(summary?.getAttribute("aria-label")).toBe("Menü, 5 Schritte warten auf Sie");
    expect(summary?.textContent).toBe("Menü5");
  });

  it("ohne wartende Schritte keine Zahl, der Name ist „Menü“", () => {
    const d = dom(renderToStaticMarkup(<Reiter eintraege={EINTRAEGE} aktiv="uebersicht" />));
    expect(d.querySelector("summary")?.getAttribute("aria-label")).toBe("Menü");
    expect(d.querySelector("summary")?.textContent).toBe("Menü");
    expect(REITER_TEXTE.menueLabel(1)).toBe("Menü, ein Schritt wartet auf Sie");
  });

  it("Handy-Menü: Reiter als Liste mit Stand und Standklasse, `ende` als letzte Zeile", () => {
    const d = dom(
      renderToStaticMarkup(<Reiter eintraege={EINTRAEGE} aktiv="uebersicht" ende={<li className="neu">Neuigkeiten</li>} />),
    );
    expect([...d.querySelectorAll(`${MENUE} li`)].map((li) => li.textContent)).toEqual([
      "Übersicht5 warten auf Sie",
      "Google-ProfilNicht geladen",
      "WebsiteLäuft",
      "Berichte",
      "Neuigkeiten",
    ]);
    const staende = [...d.querySelectorAll(`${MENUE} .blickStand`)].map((el) => el.className);
    expect(staende).toEqual(["blickStand standHervor", "blickStand standFehler", "blickStand standRuhig"]);
  });

  it("Texte kommen als Prop", () => {
    const texte = { leiste: "Bereiche", menue: "Navigation", menueLabel: (n: number) => `Navigation ${n}`, menueListe: "Liste" };
    const d = dom(renderToStaticMarkup(<Reiter eintraege={EINTRAEGE} aktiv={null} wartend={2} texte={texte} />));
    expect(d.querySelector('nav[aria-label="Bereiche"]')).not.toBeNull();
    expect(d.querySelector('nav[aria-label="Liste"]')).not.toBeNull();
    expect(d.querySelector("summary")?.getAttribute("aria-label")).toBe("Navigation 2");
  });
});
