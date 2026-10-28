import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { h, isoKernel } from "../src/iso";
import { IsoKnoten } from "../src/IsoKnoten";
import { dom } from "./dom-hilfe";

// IsoKnoten macht aus dem Knotenbaum des Iso-Kerns SVG-Elemente, ohne Zustand
// und ohne "use client". Texte kommen nur als Kinder an und werden escapt.

const svg = (knoten: Parameters<typeof IsoKnoten>[0]["knoten"], slots?: Parameters<typeof IsoKnoten>[0]["slots"]) =>
  renderToStaticMarkup(
    <svg>
      <IsoKnoten knoten={knoten} slots={slots} />
    </svg>,
  );

describe("IsoKnoten", () => {
  it("baut den Knotenbaum in derselben Reihenfolge nach, Attribute in SVG-Schreibweise", () => {
    const baum = h(
      "g",
      { className: "gruppe", transform: "matrix(1 0 0 1 0 0)" },
      h("rect", { className: "face", width: 10, height: 5, rx: undefined }),
      h("text", { x: 2, y: 3, fontSize: 7, textAnchor: "middle" }, "Muster"),
    );
    const doc = dom(svg(baum));
    const g = doc.querySelector("g")!;
    expect(g.getAttribute("class")).toBe("gruppe");
    expect(Array.from(g.children).map((k) => k.tagName.toLowerCase())).toEqual(["rect", "text"]);
    const rect = g.querySelector("rect")!;
    expect(rect.getAttribute("width")).toBe("10");
    expect(rect.hasAttribute("rx"), "undefined fällt weg").toBe(false);
    const text = g.querySelector("text")!;
    expect(text.getAttribute("font-size")).toBe("7");
    expect(text.getAttribute("text-anchor")).toBe("middle");
    expect(text.textContent).toBe("Muster");
  });

  it("reicht style-Objekte mit CSS-Variablen durch", () => {
    const html = svg(h("g", { style: { "--ex": "3px", "--ey": "-2px" } }));
    expect(html).toContain('style="--ex:3px;--ey:-2px"');
  });

  it("nimmt Listen und reine Texte an", () => {
    const doc = dom(svg([h("circle", { r: 2 }), "frei", h("path", { d: "M0 0L1 1" })]));
    const wurzel = doc.querySelector("svg")!;
    expect(Array.from(wurzel.children).map((k) => k.tagName.toLowerCase())).toEqual(["circle", "path"]);
    expect(wurzel.textContent).toBe("frei");
  });

  it("ersetzt slot-Knoten durch den passenden Inhalt, unbekannte fallen weg", () => {
    const baum = h("g", {}, h("slot", { name: "titel" }), h("slot", { name: "fehlt" }));
    const doc = dom(svg(baum, { titel: <text>Eingesetzt</text> }));
    const g = doc.querySelector("g")!;
    expect(g.children).toHaveLength(1);
    expect(g.textContent).toBe("Eingesetzt");
    expect(doc.querySelector("slot")).toBeNull();
  });

  it("escapt Texte: Markup im Kind wird Text, kein Element", () => {
    const boese = '<img src=x onerror=alert(1)>"&';
    const html = svg(h("text", {}, boese));
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    const doc = dom(html);
    expect(doc.querySelector("img")).toBeNull();
    expect(doc.querySelector("text")!.textContent).toBe(boese);
  });

  it("rendert eine Figur aus dem Kern (Platte und Quader) ohne NaN", () => {
    const k = isoKernel({ rot: -0.4, cx: 50, cy: 40 });
    const knoten = [...k.box(0, 0, 0, 100, 80, 6, 8), ...k.box(30, 20, 6, 40, 30, 24)];
    const html = svg(knoten);
    expect(dom(html).querySelectorAll("path, rect").length).toBe(5);
    expect(html).not.toMatch(/NaN|Infinity/);
  });
});
