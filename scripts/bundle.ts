// Erzeugt die Lesefassung der Bausteine unter artifact/project/components/:
//   bundle.js   ein klassisches Skript (IIFE) für React 18 als UMD, setzt window.DsWerkplan
//   bundle.css  das CSS der CSS-Module, Klassennamen passend zum Bündel
//   index.d.ts  eine Typdatei aller Exporte aus src/index.ts, lesbar als Doku
// Aufruf: `bun run bundle`. Tokens und Schriften liefert die Seite selbst, sie
// stehen deshalb nicht in bundle.css. Der Workflow `check` prüft, dass die drei
// Dateien aktuell sind.

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Schmale Typen für Bun.build: das Paket hat bewusst keine Bun-Typen als Abhängigkeit.
interface Aufloesung { path: string; namespace?: string }
interface Ladung { contents: string; loader: "js" | "ts" }
interface PluginBau {
  onResolve(o: { filter: RegExp; namespace?: string }, f: (a: { path: string }) => Aufloesung): void;
  onLoad(o: { filter: RegExp; namespace?: string }, f: (a: { path: string }) => Ladung): void;
}
interface BunPlugin { name: string; setup(build: PluginBau): void }
interface Ausgabe { path: string; kind: string; text(): Promise<string> }
declare const Bun: {
  build(o: {
    entrypoints: string[];
    root: string;
    format: "iife";
    target: "browser";
    minify: boolean;
    define: Record<string, string>;
    plugins: BunPlugin[];
  }): Promise<{ success: boolean; logs: unknown[]; outputs: Ausgabe[] }>;
};

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = join(WURZEL, "src/index.ts");
const ZIEL = join(WURZEL, "artifact/project/components");
const SHIM = join(WURZEL, "scripts/jsx-runtime-shim.ts");
const NAMESPACE = "DsWerkplan";
const HOECHSTGROESSE = 6 * 1024 * 1024;
const VERBOTEN = ["</script", "<!--"];

/* ---- Namen aus src/index.ts ------------------------------------------- */

/** Alle Wertexporte aus src/index.ts in ihrer Reihenfolge (ohne `type …`). */
export function exportNamen(indexQuelle: string): string[] {
  const namen: string[] = [];
  for (const block of indexQuelle.matchAll(/export\s*\{([^}]*)\}\s*from/g)) {
    for (const roh of block[1].split(",")) {
      const name = roh.trim();
      if (name !== "" && !name.startsWith("type ")) namen.push(name);
    }
  }
  return namen;
}

/**
 * React-Bausteine für den Kopf des Bündels: PascalCase, ohne die `*Icon`-
 * Komponenten (die bleiben im Namespace, stehen aber nicht einzeln im Kopf).
 * Konstanten (VERSALIEN) und Funktionen (kleiner Anfang) fallen heraus.
 */
export function kopfBausteine(indexQuelle: string): string[] {
  return exportNamen(indexQuelle).filter((n) => /^[A-Z][a-z]/.test(n) && !n.endsWith("Icon"));
}

export function kopfZeile(bausteine: string[]): string {
  const kopf = { format: 4, namespace: NAMESPACE, components: bausteine.map((name) => ({ name })) };
  return `/* @ds-bundle: ${JSON.stringify(kopf)} */`;
}

/* ---- Bündel ----------------------------------------------------------- */

const EINTRAG = "ds-werkplan:eintrag";

// react und react-dom kommen aus den UMD-Skripten der Seite, die JSX-Laufzeit
// aus dem Ersatzmodul; SVGs werden zu base64-Daten-URLs (kein `<` im Bündel).
const aufloeser: BunPlugin = {
  name: "ds-werkplan-lesefassung",
  setup(build) {
    build.onResolve({ filter: /^ds-werkplan:eintrag$/ }, () => ({ path: EINTRAG, namespace: "eintrag" }));
    build.onLoad({ filter: /.*/, namespace: "eintrag" }, () => ({
      contents: `import * as ds from ${JSON.stringify(INDEX)};\nwindow.${NAMESPACE} = { ...ds };\n`,
      loader: "ts",
    }));
    build.onResolve({ filter: /^react\/jsx(-dev)?-runtime$/ }, () => ({ path: SHIM }));
    build.onResolve({ filter: /^react$/ }, () => ({ path: "React", namespace: "global" }));
    build.onResolve({ filter: /^react-dom(\/.*)?$/ }, () => ({ path: "ReactDOM", namespace: "global" }));
    build.onLoad({ filter: /.*/, namespace: "global" }, (args) => ({
      contents: `module.exports = window.${args.path};`,
      loader: "js",
    }));
    build.onLoad({ filter: /\.svg$/ }, (args) => ({
      contents: `export default ${JSON.stringify(`data:image/svg+xml;base64,${readFileSync(args.path).toString("base64")}`)};`,
      loader: "js",
    }));
  },
};

async function buendel(): Promise<{ js: string; css: string }> {
  const ergebnis = await Bun.build({
    entrypoints: [EINTRAG],
    root: WURZEL,
    format: "iife",
    target: "browser",
    minify: true,
    define: { "process.env.NODE_ENV": '"production"' },
    plugins: [aufloeser],
  });
  if (!ergebnis.success) throw new Error(`bun build fehlgeschlagen:\n${ergebnis.logs.join("\n")}`);
  const js = ergebnis.outputs.filter((o) => o.kind === "entry-point");
  const css = ergebnis.outputs.filter((o) => o.path.endsWith(".css"));
  if (js.length !== 1 || css.length !== 1) {
    throw new Error(`Erwartet ein Skript und eine CSS-Datei, erhalten: ${ergebnis.outputs.map((o) => o.path).join(", ")}`);
  }
  return { js: await js[0].text(), css: await css[0].text() };
}

/* ---- Typen ------------------------------------------------------------ */

/**
 * Deklarationen per tsc in ein Temp-Verzeichnis, dann zu einer Datei: relative
 * Importe entfallen (alles steht danach in derselben Datei), Importe aus Paketen
 * werden je Modul zusammengefasst, und was src/index.ts nicht exportiert,
 * verliert sein `export`.
 */
function typen(indexQuelle: string): string {
  const temp = mkdtempSync(join(tmpdir(), "ds-werkplan-dts-"));
  try {
    const konfig = join(temp, "tsconfig.json");
    writeFileSync(
      konfig,
      JSON.stringify({
        extends: join(WURZEL, "tsconfig.json"),
        compilerOptions: { noEmit: false, declaration: true, emitDeclarationOnly: true, outDir: join(temp, "out"), rootDir: join(WURZEL, "src") },
        include: [],
        files: [INDEX, join(WURZEL, "src/css-module.d.ts")],
      }),
    );
    execFileSync(join(WURZEL, "node_modules/.bin/tsc"), ["-p", konfig], { stdio: "inherit" });
    return typenZusammenfuehren(join(temp, "out"), indexQuelle);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

function typenZusammenfuehren(verzeichnis: string, indexQuelle: string): string {
  const reihenfolge = [...indexQuelle.matchAll(/\}\s*from\s*"\.\/([^"]+)"/g)].map((m) => m[1]);
  const vorhanden = new Set(readdirSync(verzeichnis).filter((d) => d.endsWith(".d.ts")).map((d) => d.slice(0, -5)));
  const exportiert = new Set([
    ...exportNamen(indexQuelle),
    ...[...indexQuelle.matchAll(/\btype\s+([A-Za-z0-9_]+)/g)].map((m) => m[1]),
  ]);

  const standardImporte = new Map<string, string>();
  const benannteImporte = new Map<string, Set<string>>();
  const teile: string[] = [];

  for (const modul of reihenfolge) {
    if (!vorhanden.has(modul)) throw new Error(`Keine Deklaration für ./${modul}`);
    let text = readFileSync(join(verzeichnis, `${modul}.d.ts`), "utf8");
    text = text.replace(/^import\s+(type\s+)?(.+?)\s+from\s+"([^"]+)";\n/gm, (_z, _t, was: string, quelle: string) => {
      if (quelle.startsWith(".")) return "";
      const benannt = was.match(/\{([^}]*)\}/);
      if (benannt) {
        const satz = benannteImporte.get(quelle) ?? new Set<string>();
        for (const n of benannt[1].split(",")) if (n.trim() !== "") satz.add(n.trim().replace(/^type\s+/, ""));
        benannteImporte.set(quelle, satz);
      }
      const standard = was.replace(/,?\s*\{[^}]*\}/, "").trim();
      if (standard !== "") standardImporte.set(quelle, standard);
      return "";
    });
    // Weiterreichungen aus einem anderen Modul entfallen: der Name steht ohnehin in dieser Datei.
    text = text.replace(/^export\s+(type\s+)?\{[^}]*\}\s*from\s*"\.[^"]*";\n?/gm, "");
    if (/from\s*"\./.test(text) || /import\(\s*"\./.test(text)) {
      throw new Error(`./${modul}.d.ts verweist auf ein anderes Modul, das Zusammenführen kennt das nicht`);
    }
    text = text.replace(/^export \{\};\n?/gm, "");
    text = text.replace(
      /^export (declare (?:function|const|let|class|enum)|interface|type|declare namespace) ([A-Za-z0-9_]+)/gm,
      (zeile, art: string, name: string) => (exportiert.has(name) ? zeile : `${art} ${name}`),
    );
    teile.push(`/* ---- ${modul} ---- */\n\n${text.trim()}\n`);
  }

  // Ein `import type` darf nicht Standard und Benanntes zugleich tragen: je eine Zeile.
  const importe = [...new Set([...standardImporte.keys(), ...benannteImporte.keys()])].sort().flatMap((quelle) => {
    const standard = standardImporte.get(quelle);
    const benannt = [...(benannteImporte.get(quelle) ?? [])].sort();
    return [
      ...(standard === undefined ? [] : [`import type ${standard} from "${quelle}";`]),
      ...(benannt.length === 0 ? [] : [`import type { ${benannt.join(", ")} } from "${quelle}";`]),
    ];
  });

  return [
    "// Typen des DS Werkplan 2.0, erzeugt aus src/ mit `bun run bundle`. Nicht von Hand ändern.",
    `// Im Bündel (bundle.js) stehen alle Werte unter window.${NAMESPACE}.`,
    "",
    ...importe,
    "",
    ...teile,
  ].join("\n");
}

/* ---- Schreiben -------------------------------------------------------- */

export async function erzeugeBuendel(): Promise<void> {
  const indexQuelle = readFileSync(INDEX, "utf8");
  const { js, css } = await buendel();
  const skript = `${kopfZeile(kopfBausteine(indexQuelle))}\n${js}`;
  for (const wort of VERBOTEN) {
    if (skript.toLowerCase().includes(wort)) throw new Error(`bundle.js enthält „${wort}“`);
  }
  if (Buffer.byteLength(skript) > HOECHSTGROESSE) throw new Error("bundle.js ist größer als 6 MB");
  mkdirSync(ZIEL, { recursive: true });
  writeFileSync(join(ZIEL, "bundle.js"), skript);
  writeFileSync(join(ZIEL, "bundle.css"), `/* CSS der Bausteine, erzeugt mit \`bun run bundle\`. Tokens und Schriften liefert die Seite. */\n${css}`);
  writeFileSync(join(ZIEL, "index.d.ts"), typen(indexQuelle));
}

if ((import.meta as { main?: boolean }).main) await erzeugeBuendel();
