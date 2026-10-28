// @vitest-environment jsdom
// Bündel der Lesefassung (scripts/bundle.ts, Plan ds-werkplan-paket Step 7):
// ein klassisches Skript für React 18 als UMD. Der Test lädt React 18 aus dem
// Alias `react18`, wertet das eingecheckte Bündel aus und rendert jeden
// Baustein einmal. Dass das Bündel aktuell ist, prüft der Workflow `check`
// (`bun run bundle` und `git diff --exit-code`).

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { exportNamen, kopfBausteine, kopfZeile } from "../scripts/bundle";

// Pfad aus dem String von import.meta.url: in jsdom ist `URL` die Klasse von jsdom,
// die fileURLToPath nicht annimmt (darum hier nicht test/css-hilfe.ts).
const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..") + "/";
const lies = (pfad: string) => readFileSync(WURZEL + pfad, "utf8");

const umd = (datei: string) => lies(`node_modules/${datei}`);

const buendel = lies("artifact/project/components/bundle.js");
const indexQuelle = lies("src/index.ts");
const kopf = buendel.slice(0, buendel.indexOf("\n"));

type Baustein = (props: Record<string, unknown>) => unknown;
interface React18 { version: string; createElement(typ: unknown, props: Record<string, unknown> | null, ...kinder: unknown[]): unknown }
interface Wurzel { render(element: unknown): void; unmount(): void }
interface ReactDom18 { createRoot(knoten: Element): Wurzel; flushSync(f: () => void): void }
interface Fenster { React: React18; ReactDOM: ReactDom18; DsWerkplan: Record<string, unknown> }

const fenster = globalThis as unknown as Fenster;
const fehler: unknown[][] = [];
const echterFehler = console.error;
let alterActModus: unknown;

beforeAll(() => {
  // Ohne act(): createRoot und flushSync wie auf der Seite, keine act-Warnungen.
  const g = globalThis as { IS_REACT_ACT_ENVIRONMENT?: unknown };
  alterActModus = g.IS_REACT_ACT_ENVIRONMENT;
  g.IS_REACT_ACT_ENVIRONMENT = false;
  console.error = (...args: unknown[]) => {
    fehler.push(args);
  };
  // Wie drei <script>-Tags: erst React, dann ReactDOM, dann das Bündel.
  for (const quelle of [umd("react18/umd/react.development.js"), umd("react-dom18/umd/react-dom.development.js"), buendel]) {
    new Function("window", "self", quelle)(globalThis, globalThis);
  }
});

afterAll(() => {
  console.error = echterFehler;
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: unknown }).IS_REACT_ACT_ENVIRONMENT = alterActModus;
  for (const name of ["React", "ReactDOM", "DsWerkplan"]) delete (globalThis as Record<string, unknown>)[name];
});

describe("Bündel als Text", () => {
  it("enthält nichts, was ein <script>-Tag vorzeitig schließt oder auskommentiert", () => {
    expect(buendel.toLowerCase()).not.toContain("</script");
    expect(buendel).not.toContain("<!--");
  });

  it("ist ein klassisches Skript ohne Modul-Syntax und ohne Netz", () => {
    expect(buendel).not.toMatch(/\bimport\s*[({"'*]|\bexport\s|\brequire\(|\bfetch\(|XMLHttpRequest/);
    expect(Buffer.byteLength(buendel)).toBeLessThanOrEqual(6 * 1024 * 1024);
  });

  it("trägt in Zeile 1 den @ds-bundle-Kopf, passend zu src/index.ts", () => {
    const treffer = kopf.match(/^\/\* @ds-bundle: (.*) \*\/$/);
    expect(treffer).not.toBeNull();
    const json = JSON.parse(treffer![1]) as { format: number; namespace: string; components: { name: string }[] };
    expect(json.format).toBe(4);
    expect(json.namespace).toBe("DsWerkplan");
    expect(json.components.length).toBeGreaterThan(0);
    expect(json.components.some((k) => k.name.endsWith("Icon"))).toBe(false);
    expect(kopf).toBe(kopfZeile(kopfBausteine(indexQuelle)));
  });
});

describe("Bündel mit React 18", () => {
  it("lädt mit React 18 und setzt window.DsWerkplan", () => {
    expect(fenster.React.version).toMatch(/^18\./);
    expect(typeof fenster.DsWerkplan).toBe("object");
    expect(fehler).toEqual([]);
  });

  it("enthält jeden Export aus src/index.ts", () => {
    const fehlend = exportNamen(indexQuelle).filter((name) => !(name in fenster.DsWerkplan));
    expect(fehlend).toEqual([]);
    expect(Object.keys(fenster.DsWerkplan).sort()).toEqual([...exportNamen(indexQuelle)].sort());
  });

  it("jeder Name im Kopf ist ein Baustein im Namespace", () => {
    const json = JSON.parse(kopf.slice("/* @ds-bundle: ".length, -" */".length)) as { components: { name: string }[] };
    for (const { name } of json.components) expect(typeof fenster.DsWerkplan[name], name).toBe("function");
  });

  it("das Logo trägt sein Bild als Daten-URL", () => {
    const knoten = rendere("Logo", {});
    const bild = knoten.querySelector("img");
    expect(bild?.getAttribute("src")).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(atob(bild!.getAttribute("src")!.split(",")[1])).toContain("<svg");
  });

  it("jeder React-Baustein rendert einmal mit createRoot ohne Fehler, die Icons eingeschlossen", () => {
    const bausteine = Object.keys(fenster.DsWerkplan).filter(
      (name) => /^[A-Z][a-z]/.test(name) && typeof fenster.DsWerkplan[name] === "function",
    );
    expect(bausteine.length).toBeGreaterThan(70);
    for (const name of bausteine) {
      const knoten = rendere(name, PROPS[name] ?? (name.endsWith("Icon") ? {} : { children: "Text" }));
      expect(knoten.innerHTML, name).not.toBe("");
    }
    expect(fehler).toEqual([]);
  });
});

function rendere(name: string, props: Record<string, unknown>): HTMLElement {
  const { React, ReactDOM, DsWerkplan } = fenster;
  const knoten = document.createElement("div");
  document.body.append(knoten);
  const wurzelKnoten = ReactDOM.createRoot(knoten);
  ReactDOM.flushSync(() => wurzelKnoten.render(React.createElement(DsWerkplan[name] as Baustein, props)));
  const kopie = knoten.cloneNode(true) as HTMLElement;
  ReactDOM.flushSync(() => wurzelKnoten.unmount());
  knoten.remove();
  return kopie;
}

const nichts = () => {};

// Pflicht-Props je Baustein; alle anderen bekommen nur `children`.
const PROPS: Record<string, Record<string, unknown>> = {
  Hinweisband: { icon: "!", titel: "Achtung:", children: "Zugang läuft ab." },
  Toast: { haken: "✓", text: "Gespeichert", aktion: { label: "Rückgängig", taste: "Z", onClick: nichts } },
  LichtkanteButton: { children: "Weiter", onClick: nichts },
  Messwert: { children: "42", groesse: 32 },
  Schriftfeld: { felder: [["Betrieb", "Muster"], ["Ort", "Stuttgart"]] },
  Info: { icon: "i", children: "Hinweis" },
  Kasten: { icon: "i", label: "Stand", titel: "Titel", children: "Text" },
  Schritte: { schritte: [{ titel: "Eins", text: "Erster Schritt" }, { text: "Zweiter Schritt" }] },
  IconKnopf: { icon: "x", label: "Schließen", onClick: nichts },
  DetailRahmen: { children: "Inhalt", label: "Detail" },
  Filterleiste: {
    label: "Filter",
    eintraege: [{ wert: "alle", label: "Alle", zahl: 3 }, { wert: "offen", label: "Offen", zahl: 1 }],
    aktiv: "alle",
    hrefFuer: (wert: string) => `?f=${wert}`,
    onWaehle: nichts,
  },
  Fortschritt: { links: "1 von 3", rechts: "33 %", anteil: 0.33, label: "Fortschritt" },
  Liste: { label: "Liste", children: "Zeile" },
  Gruppe: { titel: "Heute", zahl: 2 },
  GruppeBlock: { titel: "Heute", zahl: 2, children: "Zeile" },
  Listenzeile: { id: "a", href: "#a", aktiv: true, titel: "Titel", unter: "Unterzeile", onWaehle: nichts },
  Textlink: { href: "#", children: "Mehr" },
  Plankopf: { felder: [{ label: "Blatt", wert: "01" }, { label: "Stand", wert: "28.10.2026", breit: true }] },
  Massbalken: { anteil: 0.5, untergrund: "papier", label: "Hälfte" },
  Masskette: { gruppen: [[true, false], [true]], label: "Masskette" },
  BlattZeile: { nr: 1, titel: "Übersicht" },
  MarkerHighlight: { children: "Wort" },
  Logo: {},
  Reiter: {
    eintraege: [
      { kennung: "a", name: "Übersicht", href: "#a" },
      { kennung: "b", name: "Zugang", href: null, stand: { text: "offen", art: "warn" } },
    ],
    aktiv: "a",
  },
  KapitelLeiste: { titel: "Kapitel", kapitel: [{ id: "k1", name: "Start" }, { id: "k2", name: "Ende" }], stand: "Stand 28.10." },
  ZiffernFelder: { ziffern: ["1", "2", "", "", "", ""], aendern: nichts, fehlerId: null, fokusAnlass: 0 },
  KopierenKnopf: { wert: "ABC-123" },
  Eingabefeld: { label: "Name", name: "name" },
};
