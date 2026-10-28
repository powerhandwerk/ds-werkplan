import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BlattZeile } from "../src/BlattZeile";
import { LichtkanteButton } from "../src/LichtkanteButton";
import { Massbalken } from "../src/Massbalken";
import { Plankopf } from "../src/Plankopf";
import { Textlink } from "../src/Textlink";

// Render-Tests der Werkplan-Bausteine aus Z1 (WB-4402e476, Plan
// plans/z1-werkplan-bausteine.md, Schritt 9). Sie prüfen nur das Markup;
// ob die CSS-Klassen stimmen, sieht erst der Build der ersten Seite, die
// sie importiert (Monatsbericht v3 PR 3a, Zugangs-Seite Z3).

/** Breite der Lime-Füllung aus dem Markup, null ohne Füllung. */
function fuellbreite(markup: string): number | null {
  const treffer = markup.match(/<rect[^>]*\swidth="([^"]+)"/);
  return treffer ? Number(treffer[1]) : null;
}

describe("Massbalken", () => {
  it("klemmt den Anteil auf 0 bis 100", () => {
    expect(fuellbreite(renderToStaticMarkup(<Massbalken anteil={42} untergrund="papier" />))).toBe(42);
    expect(fuellbreite(renderToStaticMarkup(<Massbalken anteil={140} untergrund="papier" />))).toBe(100);
    expect(fuellbreite(renderToStaticMarkup(<Massbalken anteil={-5} untergrund="nacht" />))).toBeNull();
    expect(fuellbreite(renderToStaticMarkup(<Massbalken anteil={Number.NaN} untergrund="nacht" />))).toBeNull();
  });

  it("ist mit Label ein Bild mit Vorlesetext, ohne Label dekorativ", () => {
    const mitLabel = renderToStaticMarkup(<Massbalken anteil={80} untergrund="nacht" label="4,8 von 5 Sternen" />);
    expect(mitLabel).toContain('role="img"');
    expect(mitLabel).toContain('aria-label="4,8 von 5 Sternen"');
    expect(mitLabel).not.toContain("aria-hidden");

    const ohneLabel = renderToStaticMarkup(<Massbalken anteil={80} untergrund="nacht" />);
    expect(ohneLabel).not.toContain('role="img"');
    expect(ohneLabel).toContain('aria-hidden="true"');
  });
});

describe("Textlink", () => {
  it("rendert einen Link mit Ziel und Inhalt", () => {
    const markup = renderToStaticMarkup(<Textlink href="/bericht.pdf">PDF herunterladen</Textlink>);
    expect(markup).toMatch(/^<a [^>]*href="\/bericht\.pdf"[^>]*>PDF herunterladen<\/a>$/);
  });
});

describe("LichtkanteButton", () => {
  it("bleibt ohne href ein echter Knopf mit type=button als Standard", () => {
    const markup = renderToStaticMarkup(<LichtkanteButton>Erhalt bestätigen</LichtkanteButton>);
    expect(markup.startsWith("<button")).toBe(true);
    expect(markup).toContain('type="button"');
    expect(markup).toContain("Erhalt bestätigen");
  });

  it("übernimmt type=submit und disabled wie bisher", () => {
    const markup = renderToStaticMarkup(
      <LichtkanteButton type="submit" disabled>
        Senden
      </LichtkanteButton>,
    );
    expect(markup).toContain('type="submit"');
    expect(markup).toContain("disabled");
  });

  it("wird mit href ein Link", () => {
    const markup = renderToStaticMarkup(<LichtkanteButton href="/zugang">Ihr Schritt</LichtkanteButton>);
    expect(markup.startsWith("<a")).toBe(true);
    expect(markup).toContain('href="/zugang"');
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("type=");
  });

  it("führt als gesperrter Link nirgends hin, bleibt aber erreichbar", () => {
    const markup = renderToStaticMarkup(
      <LichtkanteButton href="/zugang" disabled>
        Ihr Schritt
      </LichtkanteButton>,
    );
    expect(markup.startsWith("<a")).toBe(true);
    expect(markup).not.toContain("href=");
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('role="link"');
    expect(markup).toContain('tabindex="0"');
  });
});

describe("Plankopf", () => {
  it("nimmt ein Element als Wert", () => {
    const markup = renderToStaticMarkup(
      <Plankopf felder={[{ label: "Paket", wert: <strong>Profi</strong> }]} untergrund="nacht" />,
    );
    expect(markup).toContain("<dd");
    expect(markup).toContain("<strong>Profi</strong>");
  });

  it("lässt leere Text-Werte weiterhin weg", () => {
    const markup = renderToStaticMarkup(
      <Plankopf
        felder={[
          { label: "Für", wert: "Musterbetrieb" },
          { label: "Telefon", wert: "  " },
        ]}
      />,
    );
    expect(markup).toContain("Für");
    expect(markup).not.toContain("Telefon");
  });

  it("unterscheidet Nacht und Papier in der Klasse", () => {
    const nacht = renderToStaticMarkup(<Plankopf felder={[{ label: "A", wert: "1" }]} untergrund="nacht" />);
    const papier = renderToStaticMarkup(<Plankopf felder={[{ label: "A", wert: "1" }]} untergrund="papier" />);
    const standard = renderToStaticMarkup(<Plankopf felder={[{ label: "A", wert: "1" }]} />);
    expect(nacht).not.toBe(papier);
    expect(standard).toBe(papier);
  });
});

describe("BlattZeile", () => {
  it("zeigt mit Nummer „Blatt 02 · Titel“ wie bisher", () => {
    const markup = renderToStaticMarkup(<BlattZeile nr={2} titel="Zugänge" />);
    expect(markup).toContain(">Blatt 02 · Zugänge</p>");
  });

  it("zeigt ohne Nummer nur den Titel", () => {
    const markup = renderToStaticMarkup(<BlattZeile titel="Google-Profil" />);
    expect(markup).toContain(">Google-Profil</p>");
    expect(markup).not.toContain("Blatt");
  });
});
