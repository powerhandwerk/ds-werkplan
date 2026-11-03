// Bereitet die Lesefassung (artifact/project/) zum Hochladen ins
// Design-System-Artifact vor (Artifact-Typ „Design System“, Skill ds-baustein).
// Schreibt unter <ziel>/project/ alle Dateien der Lesefassung, dazu den Index
// project/design-system.json aus artifact/ziel.json und <ziel>/files.json, die
// Dateiliste für den Aufruf des Artifact-Werkzeugs. Hochgeladene Bilder (Logos)
// gehen nicht als Datei mit, sie stehen als Asset im Index; weicht ein Logo von
// seinem hochgeladenen Stand ab, bricht das Skript ab. Mit `--ist` prüft es
// vorher, ob artifact/ziel.json zum gelesenen Index des Artifacts passt.
// Aufruf: `bun run lesefassung -- <zielordner> [--ist <index.json>] [--notiz "…"] [--von "Flo"]`.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { PROJEKT, WURZEL } from "./artifact";

/** Ein hochgeladenes Asset, wie es im Index steht, dazu die Prüfsumme der Datei beim Hochladen. */
export interface ZielAsset {
  name: string;
  blob: string;
  size: number;
  type: string;
  sha256: string;
}

/** artifact/ziel.json: wohin die Lesefassung geht und was dort schon liegt. */
export interface Ziel {
  url: string;
  titel: string;
  namespace: string;
  bibliotheken: { name: string; version: string }[];
  createdOnFiles: { v: number; at: string };
  assetGruppen: Record<string, { tile: string; dateien: ZielAsset[] }>;
}

/** Der Teil eines gelesenen Index, den `abweichungen` vergleicht. */
export interface IstIndex {
  createdOnFiles?: { v?: unknown; at?: unknown };
  assetGroups?: Record<string, { files?: Record<string, { blob?: string }> }>;
}

/** Ein Eintrag der Dateiliste: Pfad im Ordner, bei unbekannter Endung mit Inhaltstyp. */
export type DateiEintrag = string | { from: string; contentType: string };

/** Endungen, die das Artifact ohne Inhaltstyp ausliefert. */
const BEDIENT = /\.(html|css|js|mjs|json|txt|md|svg|png|jpe?g|gif|webp|woff2?|ttf|otf|pdf)$/i;

/** Höchstens so viele Dateien gehen neben dem Index in einen Aufruf. */
export const DATEIEN_JE_AUFRUF = 254;

/** sha256 einer Datei der Lesefassung. */
export function sha256Datei(pfad: string): string {
  return createHash("sha256").update(readFileSync(join(PROJEKT, pfad))).digest("hex");
}

/** Die committeten Dateien der Lesefassung, relativ zu artifact/project; liegengebliebenes wie .DS_Store fehlt. */
export function lesefassungDateien(): string[] {
  return execFileSync("git", ["ls-files", "-z"], { cwd: PROJEKT, encoding: "utf8" }).split("\0").filter(Boolean);
}

/** Wo artifact/ziel.json vom gelesenen Index des Artifacts abweicht; leer heißt: passt. */
export function abweichungen(ist: IstIndex, ziel: Ziel): string[] {
  const liste: string[] = [];
  if (ist.createdOnFiles?.v !== ziel.createdOnFiles.v || ist.createdOnFiles?.at !== ziel.createdOnFiles.at) {
    liste.push(`createdOnFiles: im Artifact ${JSON.stringify(ist.createdOnFiles)}, in ziel.json ${JSON.stringify(ziel.createdOnFiles)}`);
  }
  for (const [gruppe, { dateien }] of Object.entries(ziel.assetGruppen)) {
    for (const { name, blob } of dateien) {
      const istBlob = ist.assetGroups?.[gruppe]?.files?.[name]?.blob;
      if (istBlob !== blob) liste.push(`${gruppe}/${name}: Blob im Artifact ${istBlob ?? "fehlt"}, in ziel.json ${blob}`);
    }
  }
  return liste;
}

/**
 * Dateien, Index und Dateiliste der Lesefassung. Rein: liest und schreibt
 * nichts selbst, die Prüfsummen der Dateien kommen über `pruefsumme`.
 */
export function lesefassungPaket(o: {
  dateien: readonly string[];
  ziel: Ziel;
  pruefsumme: (pfad: string) => string;
  jetzt: string;
  quelle: string;
  von: string;
  notiz: string;
}): { kopieren: string[]; index: Record<string, unknown>; files: Record<string, DateiEintrag> } {
  const assets = Object.entries(o.ziel.assetGruppen).flatMap(([gruppe, { dateien }]) =>
    dateien.map((asset) => ({ pfad: `assets/${gruppe}/${asset.name}`, asset })),
  );
  for (const { pfad, asset } of assets) {
    if (!o.dateien.includes(pfad) || o.pruefsumme(pfad) !== asset.sha256) {
      throw new Error(`${pfad} fehlt oder weicht vom hochgeladenen Stand ab: neu hochladen und artifact/ziel.json erneuern`);
    }
  }
  const assetPfade = new Set(assets.map(({ pfad }) => pfad));
  const kopieren = o.dateien.filter((pfad) => !assetPfade.has(pfad)).sort();
  if (kopieren.length > DATEIEN_JE_AUFRUF) {
    throw new Error(`${kopieren.length} Dateien, ein Aufruf trägt höchstens ${DATEIEN_JE_AUFRUF}: das Skript teilt noch nicht auf und muss erweitert werden`);
  }
  const files = Object.fromEntries(
    kopieren.map((pfad): [string, DateiEintrag] => [
      `project/${pfad}`,
      BEDIENT.test(pfad) ? `project/${pfad}` : { from: `project/${pfad}`, contentType: "text/plain" },
    ]),
  );
  const index = {
    v: 3,
    layout: "files",
    createdOnFiles: o.ziel.createdOnFiles,
    title: o.ziel.titel,
    namespace: o.ziel.namespace,
    libraries: o.ziel.bibliotheken,
    // Die Seite ist schreibgeschützt: geändert wird nur im Paket.
    editing: "code",
    sections: {},
    groups: Object.keys(o.ziel.assetGruppen),
    assetGroups: Object.fromEntries(
      Object.entries(o.ziel.assetGruppen).map(([gruppe, { tile, dateien }]) => [
        gruppe,
        {
          name: gruppe,
          tile,
          order: dateien.map((asset) => asset.name),
          files: Object.fromEntries(
            dateien.map(({ name, blob, size, type }) => [name, { name, blob, size, type }]),
          ),
        },
      ]),
    ),
    blobs: {},
    docs: { readme: "project/README.md", sections: [] },
    lastChange: { by: o.von, at: o.jetzt, via: `GitHub · ${o.quelle}`, note: o.notiz },
  };
  return { kopieren, index, files };
}

/**
 * Warum in diesen Ordner nicht geschrieben werden darf, sonst `undefined`. Das Skript
 * schreibt nur in einen neuen oder leeren Ordner außerhalb des Repos und löscht nie.
 */
export function zielOrdnerSperre(zielOrdner: string): string | undefined {
  if (zielOrdner === WURZEL || zielOrdner.startsWith(WURZEL + sep)) return "liegt im Repo; einen Ordner außerhalb nehmen, etwa im Scratchpad";
  if (existsSync(zielOrdner) && readdirSync(zielOrdner).length > 0) return "ist nicht leer; einen neuen oder leeren Ordner nehmen";
  return undefined;
}

function wert(argumente: string[], schalter: string): string | undefined {
  const stelle = argumente.indexOf(schalter);
  return stelle === -1 ? undefined : argumente[stelle + 1];
}

if ((import.meta as { main?: boolean }).main) {
  const argumente = process.argv.slice(2);
  const ordner = argumente[0];
  if (!ordner || ordner.startsWith("--")) {
    console.error('Aufruf: bun run lesefassung -- <zielordner> [--ist <index.json>] [--notiz "…"] [--von "Flo"]');
    process.exit(2);
  }
  const git = (...teile: string[]) => execFileSync("git", teile, { cwd: WURZEL, encoding: "utf8" }).trim();
  if (git("status", "--porcelain", "--", "artifact/project") !== "") {
    console.error("Die Lesefassung hat nicht committete Änderungen. Erst committen, dann veröffentlichen.");
    process.exit(1);
  }
  const zielOrdner = resolve(ordner);
  const sperre = zielOrdnerSperre(zielOrdner);
  if (sperre) {
    console.error(`Zielordner ${zielOrdner} ${sperre}.`);
    process.exit(1);
  }
  const ziel = JSON.parse(readFileSync(join(WURZEL, "artifact/ziel.json"), "utf8")) as Ziel;
  const istPfad = wert(argumente, "--ist");
  if (istPfad) {
    const liste = abweichungen(JSON.parse(readFileSync(istPfad, "utf8")) as IstIndex, ziel);
    if (liste.length > 0) {
      console.error(`artifact/ziel.json passt nicht zum Artifact:\n- ${liste.join("\n- ")}\nErst ziel.json angleichen (PR), dann neu.`);
      process.exit(1);
    }
  }
  const version = (JSON.parse(readFileSync(join(WURZEL, "package.json"), "utf8")) as { version: string }).version;
  const { kopieren, index, files } = lesefassungPaket({
    dateien: lesefassungDateien(),
    ziel,
    pruefsumme: sha256Datei,
    jetzt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    quelle: `powerhandwerk/ds-werkplan@${git("rev-parse", "--short", "HEAD")}`,
    von: wert(argumente, "--von") ?? "Flo",
    notiz: wert(argumente, "--notiz") ?? `DS Werkplan ${version}`,
  });
  for (const pfad of kopieren) {
    const nach = join(zielOrdner, "project", pfad);
    mkdirSync(dirname(nach), { recursive: true });
    copyFileSync(join(PROJEKT, pfad), nach);
  }
  writeFileSync(join(zielOrdner, "project/design-system.json"), JSON.stringify(index, null, 2) + "\n");
  writeFileSync(join(zielOrdner, "files.json"), JSON.stringify(files, null, 2) + "\n");
  console.log(`url: ${ziel.url}`);
  console.log(`root: ${zielOrdner}`);
  console.log(`file_path: ${join(zielOrdner, "project/design-system.json")}`);
  console.log(`files: ${join(zielOrdner, "files.json")} (${kopieren.length} Dateien)`);
}
