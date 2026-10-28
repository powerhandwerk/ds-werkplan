// @vitest-environment node
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EXPLOSION_MUSTER, EXPLOSION_STUFEN, explosionProfil, type ExplosionEingabe } from "../src/explosion";
import css from "../src/explosion.module.css";
import type { Knoten } from "../src/iso";
import { IsoKnoten } from "../src/IsoKnoten";
import { lies } from "./css-hilfe";

// Teile aus powerhandwerk-website, lib/grafiken/befund-profil.test.ts (keteso
// 923a5c4), dazu Filter-IDs je Präfix und das Escapen der Texte.

const EINGABE: ExplosionEingabe = { idPraefix: "x1" };

function alle(knoten: readonly (Knoten | string)[], aus: Knoten[] = []): Knoten[] {
  for (const n of knoten) {
    if (typeof n === "string") continue;
    aus.push(n);
    alle(n.kids, aus);
  }
  return aus;
}

const klassen = (n: Knoten) => String(n.attrs.className ?? "").split(" ");
const text = (n: Knoten): string => n.kids.map((k) => (typeof k === "string" ? k : text(k))).join("");
const modul = (name: string) => (css as Record<string, string>)[name] ?? name;

describe("explosionProfil", () => {
  const profil = explosionProfil(EINGABE);
  const baum = alle(profil.knoten);

  it("vier Teile t1 bis t4, jedes mit Auszug --ex/--ey", () => {
    expect(EXPLOSION_STUFEN).toBe(4);
    for (const n of [1, 2, 3, 4]) {
      const teile = baum.filter((k) => klassen(k).includes(modul(`t${n}`)));
      expect(teile, `Teil t${n}`).toHaveLength(1);
      expect(klassen(teile[0])).toContain(modul("teil"));
      const stil = teile[0].attrs.style as Record<string, string>;
      expect(stil["--ex"]).toMatch(/^-?\d+(\.\d+)?px$/);
      expect(stil["--ey"]).toMatch(/^-?\d+(\.\d+)?px$/);
    }
  });

  it("vier Ballons b1 bis b4 mit den Nummern 01 bis 04, vier Fassungen f1 bis f4", () => {
    for (const n of [1, 2, 3, 4]) {
      const ballons = baum.filter((k) => klassen(k).includes(modul(`b${n}`)));
      expect(ballons, `Ballon b${n}`).toHaveLength(1);
      expect(text(ballons[0])).toBe(`0${n}`);
      expect(baum.filter((k) => klassen(k).includes(modul(`f${n}`))), `Fassung f${n}`).toHaveLength(1);
    }
  });

  it("Klasse der Zeichnung und Klassen der Teile kommen aus explosion.module.css", () => {
    expect(profil.klasse).toBe(css.bp);
    expect(baum.some((k) => klassen(k).includes(css.face))).toBe(true);
  });

  it("ohne Eingabe stehen die neutralen Mustertexte als Kinder", () => {
    const texte = alle(explosionProfil().knoten)
      .filter((k) => k.tag === "text")
      .map(text);
    expect(EXPLOSION_MUSTER.name).toBe("Betrieb Muster");
    expect(EXPLOSION_MUSTER.kategorie).toBe("Gewerk · Musterstadt");
    expect(texte).toContain(EXPLOSION_MUSTER.name);
    expect(texte).toContain(EXPLOSION_MUSTER.kategorie);
    expect(texte).toContain(EXPLOSION_MUSTER.wertung);
    expect(texte).toContain(`(${EXPLOSION_MUSTER.anzahl})`);
  });

  it("Texte nur als Kinder: Markup im Namen landet escapt", () => {
    const boese = "<img src=x onerror=alert(1)>";
    const knoten = explosionProfil({ ...EINGABE, name: boese, kategorie: '"><script>x</script>' }).knoten;
    for (const k of alle(knoten)) {
      for (const v of Object.values(k.attrs)) expect(JSON.stringify(v ?? "")).not.toContain("<img");
    }
    expect(alle(knoten).filter((k) => k.tag === "text").map(text)).toContain(boese);
    const html = renderToStaticMarkup(createElement("svg", null, createElement(IsoKnoten, { knoten })));
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<script");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("Filter-IDs tragen das Präfix, stil verweist auf sie, der Baum nennt keine feste url(#…)", () => {
    expect(profil.ids).toEqual({ soft: "x1bp-soft", bloom: "x1bp-bloom" });
    expect(profil.stil).toEqual({ "--f-bp-soft": "url(#x1bp-soft)", "--f-bp-bloom": "url(#x1bp-bloom)" });
    const definiert = new Set(baum.map((k) => k.attrs.id).filter(Boolean));
    expect(definiert).toEqual(new Set([profil.ids.soft, profil.ids.bloom]));
    for (const k of baum) for (const v of Object.values(k.attrs)) expect(JSON.stringify(v ?? "")).not.toContain("url(#");
  });

  it("zwei Präfixe ergeben verschiedene Filter-IDs", () => {
    const a = explosionProfil({ idPraefix: "a" });
    const b = explosionProfil({ idPraefix: "b" });
    const ids = [...Object.values(a.ids), ...Object.values(b.ids)];
    expect(new Set(ids).size).toBe(4);
  });

  it("deterministisch und frei von NaN", () => {
    expect(explosionProfil(EINGABE)).toEqual(profil);
    // JSON macht aus NaN still null, deshalb jeden Wert einzeln prüfen.
    for (const k of baum) {
      for (const v of Object.values(k.attrs)) {
        if (typeof v === "number") expect(Number.isFinite(v)).toBe(true);
        else expect(JSON.stringify(v ?? "")).not.toMatch(/NaN|Infinity/);
      }
    }
    expect(profil.viewBox.split(" ").map(Number).every(Number.isFinite)).toBe(true);
  });

  it("das CSS-Modul nennt keine feste url(#…) und hat einen Block für reduzierte Bewegung", () => {
    const quelle = lies("src/explosion.module.css");
    expect(quelle).not.toContain("url(#");
    expect(quelle).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });
});
