// Erzeugt aus src/tokens.ts die Dateien src/tokens.css, src/schriften.css und
// artifact/project/tokens.json. Aufruf: `bun run erzeuge`. Die Funktionen sind
// rein, damit test/tokens.test.ts sie ohne Schreibzugriff gegen die Dateien
// prüfen kann; geschrieben wird nur beim direkten Aufruf.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  ABSTAENDE,
  FARBEN,
  FLAECHEN,
  GRADE,
  MASSE,
  NACHT_HELL_GRUND,
  PILLE_FAKTOR,
  RUNDUNGEN,
  SCHRIFTDATEIEN,
  SCHRIFTFAMILIEN,
  TYPO_ROLLEN,
  cssVon,
  familieStapel,
  hexVon,
  type Farbe,
  type FarbName,
  type Grad,
  type RollenWert,
  type SchriftFamilie,
  type WpRolle,
} from "../src/tokens";

const KOPF = "/* Erzeugt aus src/tokens.ts mit `bun run erzeuge`. Nicht von Hand ändern. */";

const farbNamen = Object.keys(FARBEN) as FarbName[];
const gradNamen = Object.keys(GRADE).map(Number) as Grad[];

/* ---- src/tokens.css -------------------------------------------------- */

export function tokensCss(): string {
  const zeilen: string[] = [KOPF, "", ":root {"];
  let ersteGruppe = true;
  const gruppe = (titel: string) => {
    zeilen.push(`${ersteGruppe ? "" : "\n"}  /* ${titel} */`);
    ersteGruppe = false;
  };

  gruppe("Farben (Ink-Rampe, Lime nur als Fläche, Rot nur für Fehler, Fokus)");
  for (const name of farbNamen) {
    const wert = cssVon(name);
    const hinweis = wert.startsWith("oklch") ? ` /* ${hexVon(name)} */` : "";
    zeilen.push(`  --${name}: ${wert};${hinweis}`);
  }

  gruppe("Schriftfamilien");
  for (const [name, { stapel }] of Object.entries(SCHRIFTFAMILIEN)) zeilen.push(`  --font-${name}: ${stapel};`);

  gruppe("Schriftgrade");
  for (const grad of gradNamen) zeilen.push(`  --grad-${grad}: ${grad}px;`);

  gruppe("Rundungen");
  for (const [name, { wert }] of Object.entries(RUNDUNGEN)) zeilen.push(`  --rund-${name}: ${wert};`);
  zeilen.push(`  --rund-pille-faktor: ${PILLE_FAKTOR};`);

  zeilen.push("}", "");
  return zeilen.join("\n");
}

/* ---- src/schriften.css ----------------------------------------------- */

export function schriftenCss(): string {
  const bloecke = SCHRIFTDATEIEN.map((s) =>
    [
      "@font-face {",
      `  font-family: "${s.familie}";`,
      "  font-style: normal;",
      `  font-weight: ${s.gewicht};`,
      "  font-display: swap;",
      `  src: url("../fonts/${s.datei}") format("woff2");`,
      "}",
    ].join("\n"),
  );
  return [KOPF, "/* Selbst gehostet, SIL Open Font License 1.1, Lizenztexte unter fonts/. */", "", bloecke.join("\n\n"), ""].join(
    "\n",
  );
}

/* ---- artifact/project/tokens.json ------------------------------------ */

type ThemaWert = string | { papier: string; nacht?: string };

/** Ein Rollenwert für tokens.json: Verweis `{farbe}` ohne Deckkraft, sonst Hex mit Alpha. */
function rolleJson(wert: RollenWert): string {
  return wert.anteil === undefined ? `{${wert.farbe}}` : hexVon(wert.farbe, wert.anteil);
}

const ROLLEN_TEXT: Record<WpRolle, string> = {
  grund: "Grund der Fläche (.papier, .nacht).",
  stark: "Starke Schrift: Überschriften, Messwerte, Werte im Schriftfeld.",
  text: "Fließtext und Einleitung.",
  gedaempft: "Beschriftungen (Versalien, gesperrt).",
  quelle: "Quellenzeilen, mindestens 4,5:1 auf ihrer Fläche.",
  linie: "Linien von Schriftfeld, Listen und Kästen.",
  "linie-fein": "Feine Trennlinien.",
  fokus: "Fokusring auf der Fläche.",
  blatt: "Fläche eines Blatts auf der Fläche (Schriftfeld, Karte).",
  raster: "Millimeterraster 24 px.",
};

export function tokensJson(): string {
  const farbTokens: { name: string; value: ThemaWert; usage: string }[] = farbNamen.map((name) => {
    const farbe: Farbe = FARBEN[name];
    const herkunft = "oklch" in farbe ? ` oklch(${farbe.oklch.join(" ")}).` : "";
    return { name, value: "alias" in farbe ? `{${farbe.alias}}` : hexVon(name), usage: farbe.rolle + herkunft };
  });

  for (const rolle of Object.keys(FLAECHEN.papier) as WpRolle[]) {
    farbTokens.push({
      name: `wp-${rolle}`,
      value: { papier: rolleJson(FLAECHEN.papier[rolle]), nacht: rolleJson(FLAECHEN.nacht[rolle]) },
      usage: `${ROLLEN_TEXT[rolle]} In CSS nur in den Flächenklassen, nie auf :root.`,
    });
  }
  farbTokens.push({
    name: "wp-grund-hell",
    value: { papier: `{${FLAECHEN.papier.grund.farbe}}`, nacht: `{${NACHT_HELL_GRUND}}` },
    usage: "Grund von .nachtHell (Nacht eine Stufe heller); auf Papier gleich wp-grund.",
  });

  const familien = Object.fromEntries(
    (Object.keys(SCHRIFTFAMILIEN) as SchriftFamilie[]).map((k) => [k, familieStapel(k)]),
  );

  const json = {
    name: "DS Werkplan",
    version: 1,
    meta: {
      source: "github",
      repo: "powerhandwerk/ds-werkplan",
      ref: "main",
      paths: { tokens: ["src/tokens.ts"], fonts: ["fonts"], assets: ["assets"], docs: ["README.md", "docs/inventur.md"] },
    },
    color: {
      themes: [
        { id: "papier", name: "Papier" },
        { id: "nacht", name: "Nacht" },
      ],
      tokens: farbTokens,
    },
    type: {
      fonts: SCHRIFTDATEIEN.map((s) => ({ family: s.familie, file: `fonts/${s.datei}`, weight: s.gewicht, style: "normal" })),
      families: familien,
      groups: [
        {
          name: "Grade",
          family: "body",
          note: `Schriftgrade ${gradNamen.join(", ")} px; der größte ist für Messwerte. In CSS var(--grad-<n>).`,
          styles: gradNamen.map((grad) => ({ name: `grad-${grad}`, fontSize: `${grad}px`, usage: GRADE[grad] })),
        },
        {
          name: "Rollen",
          family: "body",
          note: "Typo-Rollen aus src/werkplan.module.css; Versalien setzt dort text-transform.",
          styles: TYPO_ROLLEN.map((r) => ({
            name: r.name,
            family: r.familie,
            fontSize: `${r.grad}px`,
            lineHeight: r.zeilenhoehe,
            fontWeight: r.gewicht,
            ...(r.sperrung ? { letterSpacing: r.sperrung } : {}),
            sample: r.beispiel,
            usage: r.rolle,
          })),
        },
      ],
    },
    spacing: {
      note: "4-px-Raster.",
      tokens: ABSTAENDE.map((px) => ({ name: `abstand-${px}`, value: `${px}px`, usage: `${px} px.` })),
    },
    radius: {
      note: `Rollen ${Object.keys(RUNDUNGEN).join(", ")}; Knöpfe und Chips mit fester Höhe runden mit Höhe × ${String(PILLE_FAKTOR).replace(".", ",")} wie die Pille im Logo (rund-pille-faktor).`,
      tokens: Object.entries(RUNDUNGEN).map(([name, { wert, rolle }]) => ({ name: `rund-${name}`, value: wert, usage: rolle })),
    },
    abmessungen: {
      note: "Feste Maße der Bausteine in Pixeln, im PDF dieselbe Zahl in Punkten.",
      tokens: [
        { name: "rund-pille-faktor", value: String(PILLE_FAKTOR), usage: "Rundung von Knöpfen und Chips mit fester Höhe: calc(<Höhe> * var(--rund-pille-faktor))." },
        { name: "mass-linie", value: `${MASSE.linie}px`, usage: "Maßlinie, Endstriche, Schriftfeld-Fugen." },
        { name: "mass-ecke", value: `${MASSE.ecke}px`, usage: `Kantenlänge der Sucher-Ecken, Linie ${MASSE.eckeLinie} px.` },
        { name: "mass-raster", value: `${MASSE.raster}px`, usage: "Millimeterraster der Flächen." },
        { name: "mass-massbalken", value: `${MASSE.massbalkenHoehe}px`, usage: `Höhe des Maßbalkens, Füllung ${MASSE.massbalkenFuellung} px.` },
        { name: "mass-lichtkante", value: `${MASSE.lichtkanteHoehe}px`, usage: `Höhe der Lichtkante, Chip ${MASSE.lichtkanteChip} px, Lichtumlauf ${MASSE.lichtkanteUmlauf} s.` },
      ],
    },
  };
  return JSON.stringify(json, null, 2) + "\n";
}

/* ---- Schreiben --------------------------------------------------------- */

export const ZIELE = {
  "src/tokens.css": tokensCss,
  "src/schriften.css": schriftenCss,
  "artifact/project/tokens.json": tokensJson,
} as const;

if ((import.meta as { main?: boolean }).main) {
  const wurzel = fileURLToPath(new URL("../", import.meta.url));
  for (const [pfad, erzeuge] of Object.entries(ZIELE)) {
    writeFileSync(wurzel + pfad, erzeuge());
    console.log(`geschrieben: ${pfad}`);
  }
}
