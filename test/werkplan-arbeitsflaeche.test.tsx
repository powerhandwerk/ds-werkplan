// @vitest-environment jsdom
import type React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Filterleiste, Listenzeile } from "../src/Arbeitsflaeche";

// Verhalten der Arbeitsflächen-Bausteine (src/Arbeitsflaeche.tsx, ursprünglich aus
// dem Gründungsradar, Lage L3a): Filterknöpfe und Listenzeilen
// sind echte Links, ein einfacher Klick wählt ohne Neuladen, Klicks mit
// Zusatztaste gehen an den Browser durch.

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;

async function rendere(knoten: React.ReactNode): Promise<HTMLElement> {
  const host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  await act(async () => root!.render(knoten));
  return host;
}

afterEach(async () => {
  await act(async () => root?.unmount());
  root = null;
  document.body.innerHTML = "";
});

/**
 * Klickt und meldet, ob der Baustein das Standardverhalten unterdrückt hat.
 * Danach hält ein Listener am Dokument die Navigation an, die jsdom nicht kann.
 */
function klicke(el: Element, init: MouseEventInit = {}): boolean {
  let unterdrueckt = false;
  const merke = (ev: Event) => {
    unterdrueckt = ev.defaultPrevented;
    ev.preventDefault();
  };
  document.addEventListener("click", merke);
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init }));
  document.removeEventListener("click", merke);
  return unterdrueckt;
}

type Bereich = "offen" | "erledigt";

function leiste(onWaehle: (b: Bereich) => void) {
  return (
    <Filterleiste<Bereich>
      label="Bereiche"
      eintraege={[
        { wert: "offen", label: "Offen", zahl: 3 },
        { wert: "erledigt", label: "Erledigt", zahl: 0 },
      ]}
      aktiv="offen"
      hrefFuer={(b) => `?bereich=${b}`}
      onWaehle={onWaehle}
    />
  );
}

describe("Filterleiste", () => {
  it("rendert echte Links mit Zahl und markiert den aktiven Bereich mit aria-current", async () => {
    const host = await rendere(leiste(() => {}));
    const nav = host.querySelector('nav[aria-label="Bereiche"]')!;
    const links = [...nav.querySelectorAll("a")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["?bereich=offen", "?bereich=erledigt"]);
    expect(links.map((a) => a.textContent)).toEqual(["Offen3", "Erledigt0"]);
    expect(links[0].getAttribute("aria-current")).toBe("page");
    expect(links[1].hasAttribute("aria-current")).toBe(false);
  });

  it("ein einfacher Klick wählt ohne Neuladen", async () => {
    const onWaehle = vi.fn();
    const host = await rendere(leiste(onWaehle));
    const erledigt = host.querySelectorAll("a")[1];
    expect(klicke(erledigt)).toBe(true);
    expect(onWaehle).toHaveBeenCalledWith("erledigt");
  });

  it("Meta-, Strg- und Umschalt-Klick sowie Mittelklick gehen an den Browser durch", async () => {
    const onWaehle = vi.fn();
    const host = await rendere(leiste(onWaehle));
    const erledigt = host.querySelectorAll("a")[1];
    for (const init of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { button: 1 }]) {
      expect(klicke(erledigt, init), JSON.stringify(init)).toBe(false);
    }
    expect(onWaehle).not.toHaveBeenCalled();
  });
});

describe("Listenzeile", () => {
  const basis = { id: "b1", href: "?brief=b1", titel: "Muster GmbH", unter: "Stuttgart", onWaehle: () => {} };

  it("die gewählte Zeile trägt aria-current, andere nicht; die id hängt am Link", async () => {
    const host = await rendere(
      <ul>
        <Listenzeile {...basis} aktiv />
        <Listenzeile {...basis} id="b2" href="?brief=b2" aktiv={false} />
      </ul>,
    );
    expect(host.querySelector("#zeile-b1")?.getAttribute("aria-current")).toBe("true");
    expect(host.querySelector("#zeile-b2")?.hasAttribute("aria-current")).toBe(false);
  });

  it("ein einfacher Klick wählt die Zeile, Meta-Klick öffnet den Link", async () => {
    const onWaehle = vi.fn();
    const host = await rendere(
      <ul>
        <Listenzeile {...basis} aktiv={false} onWaehle={onWaehle} />
      </ul>,
    );
    const link = host.querySelector("a")!;
    expect(klicke(link, { metaKey: true })).toBe(false);
    expect(onWaehle).not.toHaveBeenCalled();
    expect(klicke(link)).toBe(true);
    expect(onWaehle).toHaveBeenCalledWith("b1");
  });

  it("gedimmt setzt eine zusätzliche Klasse am Link", async () => {
    const host = await rendere(
      <ul>
        <Listenzeile {...basis} aktiv={false} />
        <Listenzeile {...basis} id="b2" aktiv={false} gedimmt />
      </ul>,
    );
    const normal = host.querySelector("#zeile-b1")!.className.split(" ");
    const gedimmt = host.querySelector("#zeile-b2")!.className.split(" ");
    expect(gedimmt.length).toBe(normal.length + 1);
    expect(gedimmt).toEqual(expect.arrayContaining(normal));
  });

  it("nachLink steht neben dem Link im selben Listeneintrag, nie im Link", async () => {
    const host = await rendere(
      <ul>
        <Listenzeile {...basis} aktiv={false} nachLink={<button type="button">Rückgängig</button>} />
      </ul>,
    );
    const li = host.querySelector("li")!;
    const knopf = li.querySelector("button")!;
    expect(knopf.textContent).toBe("Rückgängig");
    expect(knopf.closest("a")).toBeNull();
    expect(knopf.parentElement).toBe(li);
  });
});
