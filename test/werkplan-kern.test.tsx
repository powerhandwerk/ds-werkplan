import type React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Etikett, FesterKnopf, Hinweisband, RuhigerKnopf, Tastenkappe, Toast, Unterstrich } from "../src/Bausteine";
import { Logo } from "../src/Logo";
import { GEOMETRY_DEFAULT, MarkerHighlight, markerTiltDeg } from "../src/MarkerHighlight";
import { Masskette } from "../src/Masskette";
import { SucherEcken } from "../src/SucherEcken";

// Render-Tests der Kern-Bausteine, die im Admin keinen eigenen Test hatten
// (Plan ds-werkplan-paket, Step 5). Sie prüfen nur das Markup.

describe("Bausteine", () => {
  it("Knöpfe sind echte Knöpfe mit type=button und tragen Icon und Text", () => {
    const ruhig = renderToStaticMarkup(<RuhigerKnopf icon={<i>i</i>}>Speichern</RuhigerKnopf>);
    expect(ruhig).toMatch(/^<button type="button"[^>]*><i>i<\/i>Speichern<\/button>$/);
    const fest = renderToStaticMarkup(<FesterKnopf type="submit">Löschen</FesterKnopf>);
    expect(fest).toContain('type="submit"');
    expect(fest).toContain("Löschen");
  });

  it("Etikett, Unterstrich und Tastenkappe rendern ihr Element", () => {
    expect(renderToStaticMarkup(<Etikett art="warn">Offen</Etikett>)).toMatch(/^<span [^>]*>Offen<\/span>$/);
    expect(renderToStaticMarkup(<Unterstrich>Wort</Unterstrich>)).toMatch(/^<span [^>]*>Wort<\/span>$/);
    expect(renderToStaticMarkup(<Tastenkappe>Z</Tastenkappe>)).toMatch(/^<kbd [^>]*>Z<\/kbd>$/);
  });

  it("Hinweisband ist eine Statusmeldung mit Titel", () => {
    const markup = renderToStaticMarkup(<Hinweisband icon={<i />} titel="Achtung:">Zugang läuft ab.</Hinweisband>);
    expect(markup).toContain('role="status"');
    expect(markup).toContain("<strong>Achtung:</strong> Zugang läuft ab.");
  });

  it("Toast ist eine Live-Region, außer die Seite sagt selbst an", () => {
    const mit = renderToStaticMarkup(<Toast haken={<i />} text="Gespeichert" />);
    expect(mit).toContain('role="status"');
    expect(mit).toContain('aria-live="polite"');
    const ohne = renderToStaticMarkup(
      <Toast haken={<i />} text="Gespeichert" ohneLiveRegion aktion={{ label: "Rückgängig", taste: "Z", onClick: () => {} }} />,
    );
    expect(ohne).not.toContain("role=");
    expect(ohne).not.toContain("aria-live");
    expect(ohne).toContain(">Rückgängig</button>");
    expect(ohne).toContain(">Z</kbd>");
  });
});

describe("SucherEcken", () => {
  it("setzt vier dekorative Ecken vor den Inhalt und nimmt das Element aus `as`", () => {
    const markup = renderToStaticMarkup(
      <SucherEcken as="form" aria-label="Suche">
        <input />
      </SucherEcken>,
    );
    expect(markup.startsWith("<form")).toBe(true);
    expect(markup).toContain('aria-label="Suche"');
    expect((markup.match(/<span [^>]*aria-hidden="true"><\/span>/g) ?? []).length).toBe(4);
    expect(markup).toMatch(/<\/span><input\/><\/form>$/);
  });
});

describe("Masskette", () => {
  it("ist ein Bild mit Vorlesetext und zeichnet eine Füllung je Folge geprüfter Positionen", () => {
    const markup = renderToStaticMarkup(
      <Masskette
        gruppen={[
          [true, true, false],
          [true, false],
        ]}
        label="3 von 5 geprüft"
      />,
    );
    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="3 von 5 geprüft"');
    expect((markup.match(/<rect /g) ?? []).length).toBe(2);
  });
});

describe("MarkerHighlight", () => {
  it("legt die geneigte Fläche dekorativ hinter das Wort und nagelt line-height auf 1", () => {
    const markup = renderToStaticMarkup(<MarkerHighlight style={{ lineHeight: 0.9 }}>Kern</MarkerHighlight>);
    expect(markup).toContain("line-height:1");
    expect(markup).not.toContain("line-height:0.9");
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain(`rotate(${markerTiltDeg("Kern")}deg)`);
    expect(markup).toContain(`border-radius:${GEOMETRY_DEFAULT.radius}`);
    expect(markup).toContain(">Kern</span>");
  });

  it("übernimmt eine ausdrückliche Neigung", () => {
    expect(renderToStaticMarkup(<MarkerHighlight rotate={-1.5}>Bestandsaufnahme</MarkerHighlight>)).toContain(
      "rotate(-1.5deg)",
    );
  });
});

describe("Logo", () => {
  // React 19 stellt beim Server-Rendern ein <link rel="preload"> fürs Bild voran.
  it("ist ohne href ein Bild in einem span", () => {
    const markup = renderToStaticMarkup(<Logo />);
    expect(markup).toMatch(/<span [^>]*><img [^>]*alt="powerhandwerk"[^>]*\/><\/span>$/);
    expect(markup).not.toContain("<a ");
    expect(markup).toMatch(/src="[^"]*logo-powerhandwerk\.svg"/);
    expect(markup).toContain("height:34px");
  });

  it("wählt die dunkle Fassung für dunkle Flächen", () => {
    expect(renderToStaticMarkup(<Logo variant="dark" />)).toMatch(/src="[^"]*logo-powerhandwerk-dark\.svg"/);
  });

  it("wird mit href ein Link zur Startseite, mit `as` ein fremdes Element", () => {
    const link = renderToStaticMarkup(<Logo href="/" />);
    expect(link).toMatch(/<a href="\/" aria-label="powerhandwerk Startseite"[^>]*><img /);

    function EigenerLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
      return <a data-eigen="ja" {...props} />;
    }
    const eigen = renderToStaticMarkup(<Logo href="/start" as={EigenerLink} />);
    expect(eigen).toContain('data-eigen="ja"');
    expect(eigen).toContain('href="/start"');
  });

  it("nennt den Link nach `linkLabel`", () => {
    const uebersicht = renderToStaticMarkup(<Logo href="/uebersicht" linkLabel="Zur Übersicht" />);
    expect(uebersicht).toContain('aria-label="Zur Übersicht"');
    expect(uebersicht).not.toContain("Startseite");
  });
});
