// @vitest-environment node
// Lesefassung für den Artifact-Typ „Design System“ (scripts/artifact.ts, Plan
// ds-werkplan-paket Step 8): je Baustein Leitlinie und Vorschau, Formatregeln
// der Vorschauen, Tokens in tokens.css, verbotene Pfade, keine Gedankenstriche.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { PROJEKT, TOKENS_KOPF, kopfNamen, textDateien } from "../scripts/artifact";

const lies = (pfad: string) => readFileSync(join(PROJEKT, pfad), "utf8");

function alleDateien(ordner: string): string[] {
  return readdirSync(ordner).flatMap((name) => {
    const voll = join(ordner, name);
    return statSync(voll).isDirectory() ? alleDateien(voll) : [relative(PROJEKT, voll)];
  });
}

const dateien = alleDateien(PROJEKT);
const bausteine = kopfNamen(lies("components/bundle.js"));
const vorschauen = dateien.filter((d) => d.endsWith("/preview.html"));
const readmes = dateien.filter((d) => d.endsWith("README.md"));
const tokens = lies("tokens.css");

/** Erste Zeile einer Vorschau: der Marker des Typs. */
const MARKER =
  /^<!-- @dsCard(?: group="[^"]+")?(?: height=(\d+))?(?: width=\d+)?(?: subtitle="[^"]*")?(?: floor)?(?: page)? -->$/;

const definiert = (text: string) => new Set([...text.matchAll(/(--[A-Za-z0-9_\\.-]+)\s*:/g)].map((m) => m[1]));
const benutzt = (text: string) => [...new Set([...text.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)].map((m) => m[1]))];

const VERBOTENE_NAMEN = new Set([
  "node_modules", "package.json", "package-lock.json", "bun.lock", "bun.lockb", "yarn.lock", "pnpm-lock.yaml",
  "bunfig.toml", "tsconfig.json", "CLAUDE.md", "AGENTS.md", "index.html", "SKILL.md", "artifact-type",
]);

describe("Lesefassung", () => {
  it("jeder Baustein aus dem Kopf von bundle.js hat README.md und preview.html", () => {
    expect(bausteine).toHaveLength(38);
    for (const name of bausteine) {
      expect(dateien, name).toContain(`components/${name}/README.md`);
      expect(dateien, name).toContain(`components/${name}/preview.html`);
    }
  });

  it("Zeile 1 jeder Vorschau ist ein gültiger @dsCard-Marker", () => {
    expect(vorschauen.length).toBeGreaterThanOrEqual(bausteine.length + 2);
    for (const datei of vorschauen) {
      const zeile = lies(datei).split("\n", 1)[0];
      const treffer = zeile.match(MARKER);
      expect(treffer, `${datei}: ${zeile}`).not.toBeNull();
      if (treffer?.[1]) expect(Number(treffer[1]), datei).toBeGreaterThanOrEqual(40);
      if (treffer?.[1]) expect(Number(treffer[1]), datei).toBeLessThanOrEqual(4000);
    }
  });

  it("Vorschauen ohne verbotene Elemente, ohne externe URLs, mit höchstens einem Skript", () => {
    for (const datei of vorschauen) {
      const text = lies(datei);
      expect(text, datei).not.toMatch(/<\s*(iframe|frame|object|embed|portal|noscript)\b/i);
      expect(text, datei).not.toMatch(/(https?:)?\/\/[a-z0-9-]+\.[a-z]/i);
      expect(text, datei).not.toMatch(/\bfetch\s*\(/);
      expect((text.match(/<script\b/gi) ?? []).length, datei).toBeLessThanOrEqual(1);
      expect(Buffer.byteLength(text), datei).toBeLessThanOrEqual(256 * 1024);
    }
  });

  it("Cover bleibt ohne README", () => {
    expect(dateien).toContain("components/Cover/preview.html");
    expect(dateien).not.toContain("components/Cover/README.md");
  });

  it("jede var(--x) in Vorschauen, Cover und bundle.css ist in tokens.css oder im selben Dokument definiert", () => {
    const global = definiert(tokens);
    for (const datei of [...vorschauen, "components/bundle.css"]) {
      const text = lies(datei);
      const eigene = definiert(text);
      const fehlt = benutzt(text).filter((v) => !global.has(v) && !eigene.has(v));
      expect(fehlt, datei).toEqual([]);
    }
  });

  it("kein Gedankenstrich in README-Dateien und Vorschauen", () => {
    for (const datei of [...readmes, ...vorschauen]) {
      const text = lies(datei);
      expect(text.includes("—"), `${datei}: langer Strich`).toBe(false);
      expect(text.includes(" – "), `${datei}: kurzer Strich mit Leerzeichen`).toBe(false);
    }
    for (const datei of readmes) expect(Buffer.byteLength(lies(datei)), datei).toBeLessThanOrEqual(64 * 1024);
  });

  it("keine verbotenen Pfade unter artifact/project/", () => {
    expect(dateien.length).toBeLessThanOrEqual(1008);
    for (const datei of dateien) {
      const teile = datei.split("/");
      for (const teil of teile) {
        expect(teil.startsWith("."), datei).toBe(false);
        expect(VERBOTENE_NAMEN.has(teil), datei).toBe(false);
      }
      if (teile.at(-1) === "design-system.json") expect(datei).toBe("design-system.json");
      if (teile[0] === "components" && teile.length === 3) expect(teile[1], datei).toMatch(/^[A-Za-z_$][A-Za-z0-9_$]*$/);
      expect(teile[0] === "components" && teile.length > 3, `${datei}: Unterordner im Baustein`).toBe(false);
      expect(statSync(join(PROJEKT, datei)).size, datei).toBeLessThanOrEqual(15 * 1024 * 1024);
    }
  });

  it("tokens.css beginnt mit dem Pflichtkopf des Typs", () => {
    expect(tokens.split("\n", 1)[0]).toBe(TOKENS_KOPF);
  });

  it("alle erzeugten Textdateien sind aktuell", () => {
    for (const [pfad, inhalt] of textDateien()) expect(lies(pfad), pfad).toBe(inhalt);
  });

  it("jede Leitlinie beginnt mit einem Satz, nicht mit einer Überschrift", () => {
    for (const name of bausteine) expect(lies(`components/${name}/README.md`), name).toMatch(/^[A-ZÄÖÜ][^\n]*\.\n/);
  });
});
