// Erzeugt die Lesefassung unter artifact/project/ für den Artifact-Typ
// „Design System“: tokens.css aus tokens.json, fonts/, assets/Logos/ und je
// Baustein aus dem Kopf von bundle.js components/<Name>/README.md und
// components/<Name>/preview.html, dazu die Schaukarte components/Icons/.
// Aufruf: `bun run artifact` (nach `bun run erzeuge` und `bun run bundle`).
// Markenbuch (README.md), Cover und Bündel schreibt dieses Skript nicht.
// Die Funktionen sind rein, damit test/artifact.test.ts sie ohne
// Schreibzugriff gegen die Dateien prüfen kann.

import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SCHRIFTDATEIEN } from "../src/tokens";
import { BAUSTEINE, ICONS_KARTE, type Baustein, type Prop } from "./artifact-daten";
import { iconNamen, moduleJeName } from "./bundle";

export const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const PROJEKT = join(WURZEL, "artifact/project");

/** Pflichtwortlaut der ersten Zeile von tokens.css (Layout „tokens.css as compiled“ des Typs). */
export const TOKENS_KOPF = "/* DS Werkplan — generated from tokens.json */";

/** Schriftdateien aus src/tokens.ts, dazu die Lizenztexte unter fonts/. */
export const SCHRIFTEN = [
  ...SCHRIFTDATEIEN.map((s) => s.datei),
  ...readdirSync(join(WURZEL, "fonts")).filter((d) => /^OFL-.+\.txt$/.test(d)).sort(),
];

export const LOGOS = ["logo-powerhandwerk.svg", "logo-powerhandwerk-dark.svg", "pin.svg"] as const;

const lies = (pfad: string) => readFileSync(join(WURZEL, pfad), "utf8");

/* ---- Bündel: Kopf ----------------------------------------------------- */

/** Namen der Bausteine aus dem Kopf `@ds-bundle` von bundle.js. */
export function kopfNamen(bundleJs: string): string[] {
  const kopf = bundleJs.split("\n", 1)[0].match(/^\/\* @ds-bundle: (\{.*\}) \*\/$/);
  if (!kopf) throw new Error("bundle.js ohne @ds-bundle-Kopf");
  return (JSON.parse(kopf[1]) as { components: { name: string }[] }).components.map((c) => c.name);
}

/* ---- tokens.css ------------------------------------------------------- */

interface TokenEintrag {
  name: string;
  value: string | Record<string, string>;
}

interface TokensJson {
  color: { themes: { id: string }[]; tokens: TokenEintrag[] };
  type: {
    fonts: { family: string; file: string; weight: string; style: string }[];
    families: Record<string, string>;
    groups: { name: string; family?: string; styles: { name: string; family?: string; fontSize: string; lineHeight?: number | string; fontWeight?: number | string; letterSpacing?: string }[] }[];
  };
  [familie: string]: unknown;
}

const cssName = (name: string) => name.replace(/\./g, "\\.");
const cssWert = (wert: string) => wert.replace(/^\{(.+)\}$/, (_z, ziel: string) => `var(--${cssName(ziel)})`);
const istAlias = (wert: string) => /^\{.+\}$/.test(wert);

/**
 * tokens.css im Layout „tokens.css as compiled“ des Typs: Farben je Thema,
 * dann Abstände, Rundungen, Abmessungen und Schriftfamilien auf :root, je
 * Typo-Stil eine Klasse, je Schriftdatei ein @font-face. Zusätzlich stehen die
 * Schriftgrade der Gruppe „Grade“ als `--grad-*` auf :root, weil bundle.css
 * sie liest.
 */
export function tokensCss(json: TokensJson): string {
  const [erstes, ...weitere] = json.color.themes.map((t) => t.id);
  const wertIn = (t: TokenEintrag, thema: string) => (typeof t.value === "string" ? t.value : (t.value[thema] ?? t.value[erstes]));
  const z: string[] = [TOKENS_KOPF, "", `:root, [data-theme="${erstes}"] {`];
  for (const t of json.color.tokens) z.push(`  --${cssName(t.name)}: ${cssWert(wertIn(t, erstes))};`);
  z.push("}");
  for (const thema of weitere) {
    z.push("", `[data-theme="${thema}"] {`);
    for (const t of json.color.tokens) {
      const wert = wertIn(t, thema);
      if (wert !== wertIn(t, erstes) || istAlias(wert)) z.push(`  --${cssName(t.name)}: ${cssWert(wert)};`);
    }
    z.push("}");
  }

  z.push("", ":root {");
  for (const familie of ["spacing", "radius", "abmessungen"]) {
    const block = json[familie] as { tokens: TokenEintrag[] } | undefined;
    for (const t of block?.tokens ?? []) z.push(`  --${cssName(t.name)}: ${cssWert(String(t.value))};`);
  }
  for (const [schluessel, stapel] of Object.entries(json.type.families)) z.push(`  --font-${cssName(schluessel)}: ${stapel};`);
  for (const stil of json.type.groups.find((g) => g.name === "Grade")?.styles ?? []) z.push(`  --${cssName(stil.name)}: ${stil.fontSize};`);
  z.push("}");

  for (const gruppe of json.type.groups) {
    for (const stil of gruppe.styles) {
      z.push("", `.${cssName(stil.name)} {`, `  font-family: var(--font-${stil.family ?? gruppe.family ?? "body"});`, `  font-size: ${stil.fontSize};`);
      if (stil.lineHeight !== undefined) z.push(`  line-height: ${stil.lineHeight};`);
      if (stil.fontWeight !== undefined) z.push(`  font-weight: ${stil.fontWeight};`);
      if (stil.letterSpacing !== undefined) z.push(`  letter-spacing: ${stil.letterSpacing};`);
      z.push("}");
    }
  }

  for (const f of json.type.fonts) {
    z.push(
      "",
      "@font-face {",
      `  font-family: "${f.family}";`,
      `  src: url("${f.file}") format("woff2");`,
      `  font-weight: ${f.weight};`,
      `  font-style: ${f.style};`,
      "  font-display: swap;",
      "}",
    );
  }
  return z.join("\n") + "\n";
}

/* ---- Vorschauen ------------------------------------------------------- */

const STIL = `
  html, body { margin: 0; }
  body { background: var(--wp-grund); color: var(--wp-text); font-family: var(--font-body); }
  .flaeche { box-sizing: border-box; min-height: 100vh; padding: var(--abstand-24); }
  .beide { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); min-height: 100vh; }
  .titel { margin: 0 0 var(--abstand-16); }
  .stapel { display: flex; flex-direction: column; gap: var(--abstand-16); }
  .stapel.eng { gap: var(--abstand-8); }
  .schmal { max-width: 560px; }
  .reihe { display: flex; flex-wrap: wrap; align-items: center; gap: var(--abstand-12); }
  .mitIcon { display: inline-flex; align-items: center; gap: var(--abstand-8); }
  .schwebe { position: relative; transform: translateZ(0); height: 128px; }
  .sucher { padding: var(--abstand-24); max-width: 560px; }
  .seitenluft { padding-inline: var(--abstand-8); }
  .kopfzeile { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: var(--abstand-32); }
  .icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(208px, 1fr)); }
  .icon { margin: 0; display: flex; align-items: center; gap: var(--abstand-12); padding: var(--abstand-12) var(--abstand-8); border-bottom: 1px solid var(--wp-linie-fein); color: var(--wp-stark); }
  .icon figcaption { font-family: var(--font-werkplan); font-weight: 600; font-size: var(--grad-12); letter-spacing: 0.06em; color: var(--wp-text); }
`;

function marker(o: { gruppe: string; hoehe: number; breite?: number; untertitel?: string; page?: boolean }): string {
  const teile = [`group="${o.gruppe}"`, `height=${o.hoehe}`];
  if (o.breite !== undefined) teile.push(`width=${o.breite}`);
  if (o.untertitel !== undefined) teile.push(`subtitle="${o.untertitel}"`);
  if (o.page) teile.push("page");
  return `<!-- @dsCard ${teile.join(" ")} -->`;
}

function dokument(kopf: string, titel: string, skript: string): string {
  return [
    kopf,
    "<!doctype html>",
    '<html lang="de">',
    "<head>",
    '<meta charset="utf-8">',
    `<title>${titel}</title>`,
    `<style>${STIL}</style>`,
    "</head>",
    "<body>",
    '<div id="wurzel"></div>',
    "<script>",
    skript.trim(),
    "</script>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

// W: Klassen aus werkplan.module.css, vom Bündel selbst bereitgestellt.
const VORSPANN = `(function () {
  "use strict";
  var h = React.createElement;
  var D = window.DsWerkplan;
  var W = D.WERKPLAN_KLASSEN;
  var BS = D.WERKPLAN_BAUSTEINE_SEITE;
  function nichts() {}`;

const ABSPANN = `
  function Flaeche(p) {
    return h("div", { className: [p.klasse, W.seite, BS, "flaeche"].join(" ") },
      p.titel ? h("p", { className: W.beschriftung + " titel" }, p.titel) : null,
      h(Beispiel, { u: p.u, nacht: p.u === "nacht" }));
  }
  ReactDOM.createRoot(document.getElementById("wurzel")).render(INHALT);
})();`;

const INHALT: Record<Baustein["flaeche"], string> = {
  thema: 'h("div", { className: [W.seite, BS, "flaeche"].join(" ") }, h(Beispiel, { u: "thema" }))',
  papier: 'h(Flaeche, { klasse: W.papier, u: "papier" })',
  nacht: 'h(Flaeche, { klasse: W.nacht, u: "nacht" })',
  beide:
    'h("div", { className: "beide" }, h(Flaeche, { klasse: W.papier, u: "papier", titel: "Papier" }), h(Flaeche, { klasse: W.nacht, u: "nacht", titel: "Nacht" }))',
};

export function vorschau(b: Baustein): string {
  const skript = [VORSPANN, b.skript.trim().replace(/^/gm, "  "), ABSPANN.replace("INHALT", INHALT[b.flaeche])].join("\n");
  return dokument(marker(b), b.name, skript);
}

/** Schaukarte der Icons: `NAMEN` sind alle `*Icon`-Exporte, das Beispiel steht in den Daten der Karte. */
export function iconsVorschau(namen: string[]): string {
  const skript = [
    VORSPANN,
    `  var NAMEN = ${JSON.stringify(namen)};`,
    ICONS_KARTE.skript.trim().replace(/^/gm, "  "),
    ABSPANN.replace("INHALT", INHALT.thema),
  ].join("\n");
  return dokument(marker({ ...ICONS_KARTE, page: true }), ICONS_KARTE.name, skript);
}

/* ---- Leitlinien ------------------------------------------------------- */

const code = (text: string) => `\`${text}\``;

function propZeile([name, typ, standard, bedeutung]: Prop): string {
  const std = standard === "Pflicht" || standard === "ohne" ? standard : code(standard);
  return `| ${name === "…" ? "…" : code(name)} | ${code(typ)} | ${std} | ${bedeutung} |`;
}

export function leitlinie(b: Baustein, modul: string): string {
  return [
    b.zusammenfassung,
    "",
    "## Wann",
    "",
    ...b.wann.map((s) => `- ${s}`),
    "",
    "## Was der Verbraucher liefert",
    "",
    "| Prop | Typ | Standard | Bedeutung |",
    "|---|---|---|---|",
    ...b.props.map(propZeile),
    "",
    `Import aus ${code(`@powerhandwerk/ds-werkplan/${modul}`)}, im Bündel ${code(`DsWerkplan.${b.name}`)}.`,
    "",
    "## Was man lässt",
    "",
    ...b.lassen.map((s) => `- ${s}`),
    "",
  ].join("\n");
}

export const LOGOS_README = [
  "Logos und Bildmarke von powerhandwerk. Die Dateien sind die Quelle und werden nie nachgezeichnet.",
  "",
  "- `logo-powerhandwerk.svg`: Wortmarke für Papier und helle Flächen, „power“ dunkel, „handwerk“ auf der Lime-Pille.",
  "- `logo-powerhandwerk-dark.svg`: freigestellte Wortmarke ohne schwarzen Block für Nacht und dunkle Flächen, „power“ hell.",
  "- `pin.svg`: Bildmarke (Standort-Pin in Lime) auf Papier und Nacht, überall dort, wo powerhandwerk selbst auf einer Karte oder in einer Grafik auftaucht, statt einer Kartennadel.",
  "",
].join("\n");

/* ---- Gesamtheit ------------------------------------------------------- */

/** Alle erzeugten Textdateien, Pfad relativ zu artifact/project/. */
export function textDateien(): Map<string, string> {
  const bundleJs = lies("artifact/project/components/bundle.js");
  const indexTs = lies("src/index.ts");
  const module = moduleJeName(indexTs);
  const tabelle = new Map(BAUSTEINE.map((b) => [b.name, b]));

  const dateien = new Map<string, string>();
  dateien.set("tokens.css", tokensCss(JSON.parse(lies("artifact/project/tokens.json")) as TokensJson));
  dateien.set("assets/Logos/README.md", LOGOS_README);
  for (const name of kopfNamen(bundleJs)) {
    const b = tabelle.get(name);
    const modul = module.get(name);
    if (!b) throw new Error(`Baustein ${name} fehlt in scripts/artifact-daten.ts`);
    if (!modul) throw new Error(`Baustein ${name} fehlt in src/index.ts`);
    dateien.set(`components/${name}/README.md`, leitlinie(b, modul));
    dateien.set(`components/${name}/preview.html`, vorschau(b));
  }
  for (const b of BAUSTEINE) if (!dateien.has(`components/${b.name}/README.md`)) throw new Error(`${b.name} steht nicht im Kopf von bundle.js`);
  dateien.set(`components/${ICONS_KARTE.name}/preview.html`, iconsVorschau(iconNamen(indexTs)));
  return dateien;
}

/** Kopierte Dateien: Ziel relativ zu artifact/project/ auf Quelle relativ zum Repo. */
export function kopien(): Map<string, string> {
  return new Map([
    ...SCHRIFTEN.map((d) => [`fonts/${d}`, `fonts/${d}`] as const),
    ...LOGOS.map((d) => [`assets/Logos/${d}`, `assets/${d}`] as const),
  ]);
}

if ((import.meta as { main?: boolean }).main) {
  const ziel = (pfad: string) => {
    const voll = join(PROJEKT, pfad);
    mkdirSync(dirname(voll), { recursive: true });
    return voll;
  };
  const dateien = textDateien();
  const kopiert = kopien();
  for (const [pfad, inhalt] of dateien) writeFileSync(ziel(pfad), inhalt);
  for (const [pfad, quelle] of kopiert) copyFileSync(join(WURZEL, quelle), ziel(pfad));
  console.log(`geschrieben: ${dateien.size} Textdateien, ${kopiert.size} Kopien unter artifact/project/`);
}
