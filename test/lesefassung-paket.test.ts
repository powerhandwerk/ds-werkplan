// @vitest-environment node
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LOGOS, PROJEKT, WURZEL } from "../scripts/artifact";
import {
  abweichungen,
  lesefassungDateien,
  lesefassungPaket,
  sha256Datei,
  zielOrdnerSperre,
  type IstIndex,
  type Ziel,
} from "../scripts/lesefassung-paket";
import { lies } from "./css-hilfe";

// Vorbereitung der Lesefassung fürs Hochladen (scripts/lesefassung-paket.ts):
// Logos bleiben hochgeladene Bilder, alles andere geht als Datei, der Index
// trägt Ziel, Schreibschutz und Herkunft. Geprüft gegen die echte Lesefassung
// und das echte artifact/ziel.json.

const ZIEL = JSON.parse(lies("artifact/ziel.json")) as Ziel;
const DATEIEN = lesefassungDateien();
const LOGO_PFADE = LOGOS.map((name) => `assets/Logos/${name}`);

const paket = (pruefsumme = sha256Datei) =>
  lesefassungPaket({
    dateien: DATEIEN,
    ziel: ZIEL,
    pruefsumme,
    jetzt: "2026-11-03T09:00:00Z",
    quelle: "powerhandwerk/ds-werkplan@c91b443",
    von: "Flo",
    notiz: "DS Werkplan 2.6.0",
  });

describe("artifact/ziel.json", () => {
  it("nennt ein Artifact und führt jedes Logo der Lesefassung mit Blob und Prüfsumme", () => {
    expect(ZIEL.url).toMatch(/^https:\/\/claude\.ai\/artifact\/[A-Za-z0-9]+$/);
    expect(ZIEL.assetGruppen.Logos.dateien.map((asset) => asset.name)).toEqual([...LOGOS]);
    for (const asset of ZIEL.assetGruppen.Logos.dateien) {
      expect(asset.blob, asset.name).toMatch(/^[0-9a-f]{32}$/);
      expect(asset.sha256, asset.name).toMatch(/^[0-9a-f]{64}$/);
    }
  });
});

describe("lesefassungPaket", () => {
  const { kopieren, index, files } = paket();

  it("nimmt jede Datei der Lesefassung außer den hochgeladenen Logos", () => {
    expect([...kopieren, ...LOGO_PFADE].sort()).toEqual([...DATEIEN].sort());
    expect(kopieren).toContain("assets/Logos/README.md");
  });

  it("gibt Dateien mit unbekannter Endung als Text weiter", () => {
    expect(files["project/components/index.d.ts"]).toEqual({ from: "project/components/index.d.ts", contentType: "text/plain" });
    expect(files["project/components/bundle.js"]).toBe("project/components/bundle.js");
  });

  it("schreibt den Index schreibgeschützt mit Ziel, Assets und Herkunft", () => {
    expect(index).toMatchObject({
      v: 3,
      layout: "files",
      editing: "code",
      title: ZIEL.titel,
      namespace: "DsWerkplan",
      createdOnFiles: ZIEL.createdOnFiles,
      groups: ["Logos"],
      docs: { readme: "project/README.md", sections: [] },
      lastChange: { by: "Flo", at: "2026-11-03T09:00:00Z", via: "GitHub · powerhandwerk/ds-werkplan@c91b443" },
    });
  });

  it("bricht ab, wenn ein Logo vom hochgeladenen Stand abweicht", () => {
    expect(() => paket(() => "0".repeat(64))).toThrow(/neu hochladen/);
  });
});

describe("zielOrdnerSperre", () => {
  it("erlaubt nur neue oder leere Ordner außerhalb des Repos", () => {
    expect(zielOrdnerSperre(WURZEL)).toMatch(/im Repo/);
    expect(zielOrdnerSperre(PROJEKT)).toMatch(/im Repo/);
    const leer = mkdtempSync(join(tmpdir(), "lesefassung-"));
    expect(zielOrdnerSperre(leer)).toBeUndefined();
    expect(zielOrdnerSperre(join(leer, "neu"))).toBeUndefined();
    writeFileSync(join(leer, "notiz.txt"), "x");
    expect(zielOrdnerSperre(leer)).toMatch(/nicht leer/);
  });
});

describe("abweichungen", () => {
  const ist = paket().index as IstIndex;

  it("findet nichts, wenn das Artifact den Index trägt, den das Skript schreibt, auch mit anderer Schlüsselfolge", () => {
    expect(abweichungen(ist, ZIEL)).toEqual([]);
    const umgestellt = { ...ist, createdOnFiles: { at: ZIEL.createdOnFiles.at, v: ZIEL.createdOnFiles.v } };
    expect(abweichungen(umgestellt, ZIEL)).toEqual([]);
  });

  it("nennt einen anderen Marker und einen anderen Blob im Artifact", () => {
    const anders: IstIndex = {
      createdOnFiles: { v: 1, at: "2026-12-01T00:00:00Z" },
      assetGroups: { Logos: { files: { ...ist.assetGroups?.Logos.files, "pin.svg": { blob: "f".repeat(32) } } } },
    };
    const liste = abweichungen(anders, ZIEL);
    expect(liste).toHaveLength(2);
    expect(liste[0]).toMatch(/^createdOnFiles/);
    expect(liste[1]).toMatch(/^Logos\/pin\.svg/);
  });
});
