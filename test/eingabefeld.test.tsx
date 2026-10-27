import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Eingabefeld } from "../src/Eingabefeld";

// Eingabefeld im Stil der Kundenseiten-Formulare: Label am Feld, Hinweis und
// Fehler per aria-describedby, Fehler setzt aria-invalid, Attribute gehen durch.

function dom(markup: string): Document {
  return new DOMParser().parseFromString(`<body>${markup}</body>`, "text/html");
}

describe("Eingabefeld", () => {
  it("Label zeigt aufs Feld, übrige Attribute gehen ans Feld", () => {
    const d = dom(renderToStaticMarkup(<Eingabefeld id="name" label="Ihr Name" name="name" autoComplete="name" maxLength={80} required />));
    const feld = d.querySelector("input")!;
    expect(d.querySelector("label")?.getAttribute("for")).toBe("name");
    expect(d.querySelector("label")?.textContent).toBe("Ihr Name");
    expect(feld.id).toBe("name");
    expect(feld.getAttribute("name")).toBe("name");
    expect(feld.getAttribute("autocomplete")).toBe("name");
    expect(feld.getAttribute("maxlength")).toBe("80");
    expect(feld.hasAttribute("required")).toBe(true);
    expect(feld.className).toBe("feld");
    expect(feld.hasAttribute("aria-invalid")).toBe(false);
    expect(feld.hasAttribute("aria-describedby")).toBe(false);
  });

  it("ohne id vergibt React eine, Label und Feld bleiben verbunden", () => {
    const d = dom(renderToStaticMarkup(<Eingabefeld label="Ort" />));
    const id = d.querySelector("input")!.id;
    expect(id).not.toBe("");
    expect(d.querySelector("label")?.getAttribute("for")).toBe(id);
  });

  it("Hinweis und Fehler hängen per aria-describedby am Feld, Fehler macht es ungültig", () => {
    const d = dom(
      renderToStaticMarkup(<Eingabefeld id="text" label="Was ist passiert?" hinweis="Mindestens 10 Zeichen" fehler="Bitte etwas mehr schreiben." aria-describedby="extra" />),
    );
    const feld = d.querySelector("input")!;
    expect(feld.getAttribute("aria-describedby")).toBe("extra text-hinweis text-fehler");
    expect(feld.getAttribute("aria-invalid")).toBe("true");
    expect(d.getElementById("text-hinweis")?.textContent).toBe("Mindestens 10 Zeichen");
    const fehler = d.getElementById("text-fehler");
    expect(fehler?.textContent).toBe("Bitte etwas mehr schreiben.");
    expect(fehler?.getAttribute("role")).toBe("alert");
  });

  it("mehrzeilig rendert ein <textarea> mit durchgereichten Attributen", () => {
    const d = dom(renderToStaticMarkup(<Eingabefeld mehrzeilig id="t" label="Nachricht" rows={5} className="extra" placeholder="Text" />));
    expect(d.querySelector("input")).toBeNull();
    const feld = d.querySelector("textarea")!;
    expect(feld.getAttribute("rows")).toBe("5");
    expect(feld.getAttribute("placeholder")).toBe("Text");
    expect(feld.className).toBe("feld extra");
    expect(feld.hasAttribute("mehrzeilig")).toBe(false);
  });
});
