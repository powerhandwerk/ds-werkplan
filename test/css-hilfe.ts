// Hilfen für die CSS-Tests: Dateien lesen und Regeln grob zerlegen. Kein
// vollständiger CSS-Parser; er reicht für die Module dieses Pakets.

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const WURZEL = fileURLToPath(new URL("../", import.meta.url));

export function lies(pfad: string): string {
  return readFileSync(WURZEL + pfad, "utf8");
}

/** Alle CSS-Dateien unter src/, relativ zur Wurzel. */
export function cssDateien(): string[] {
  return readdirSync(WURZEL + "src")
    .filter((datei) => datei.endsWith(".css"))
    .map((datei) => `src/${datei}`);
}

export function ohneKommentare(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

export interface Regel {
  /** Umgebende @-Regel, etwa `@media (min-width: 768px)`; leer auf oberster Ebene. */
  rahmen: string;
  selektoren: string[];
  deklarationen: Map<string, string>;
}

/** Alle Regeln mit Deklarationen, auch innerhalb von @media; @keyframes und @property bleiben außen vor. */
export function regeln(css: string): Regel[] {
  const quelle = ohneKommentare(css);
  const ergebnis: Regel[] = [];
  const lauf = (text: string, rahmen: string) => {
    let i = 0;
    while (i < text.length) {
      const auf = text.indexOf("{", i);
      if (auf === -1) break;
      const kopf = text.slice(i, auf).trim();
      let tiefe = 1;
      let j = auf + 1;
      while (j < text.length && tiefe > 0) {
        if (text[j] === "{") tiefe++;
        else if (text[j] === "}") tiefe--;
        j++;
      }
      const koerper = text.slice(auf + 1, j - 1);
      if (kopf.startsWith("@media") || kopf.startsWith("@supports")) {
        lauf(koerper, kopf.replace(/\s+/g, " "));
      } else if (!kopf.startsWith("@")) {
        const deklarationen = new Map<string, string>();
        for (const teil of koerper.split(/;(?![^(]*\))/)) {
          const doppelpunkt = teil.indexOf(":");
          if (doppelpunkt === -1) continue;
          const name = teil.slice(0, doppelpunkt).trim();
          if (name) deklarationen.set(name, teil.slice(doppelpunkt + 1).replace(/\s+/g, " ").trim());
        }
        ergebnis.push({ rahmen, selektoren: kopf.split(",").map((s) => s.replace(/\s+/g, " ").trim()), deklarationen });
      }
      i = j;
    }
  };
  lauf(quelle, "");
  return ergebnis;
}

/** Alle Deklarationen, die ein Selektor in einem Rahmen bekommt (spätere überschreiben frühere). */
export function werte(css: string, selektor: string, rahmen = ""): Record<string, string> {
  const aus: Record<string, string> = {};
  for (const regel of regeln(css)) {
    if (regel.rahmen !== rahmen || !regel.selektoren.includes(selektor)) continue;
    for (const [name, wert] of regel.deklarationen) aus[name] = wert;
  }
  return aus;
}

// Stellschrauben: Variablen, die das Paket nur liest und ein Verbraucher an einem
// umgebenden Element setzt. Das Paket definiert sie nicht; ihr Standard steht als
// Rückfallwert im var() selbst.
export const STELLSCHRAUBEN: ReadonlySet<string> = new Set(["--fuell-farbe"]);
