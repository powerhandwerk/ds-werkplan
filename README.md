# DS Werkplan 2.0

Das Design-System von powerhandwerk: Farben, Schriften, Maße und Bausteine für das
Portal und die Website aus einer Quelle. Entscheidung und Pläne: ADR-261 sowie
`plans/ds-werkplan-paket.md` im Portal-Repo.

## Einbinden

Das Paket kommt als Git-Abhängigkeit mit fester Version, ohne Registry:

```json
"@powerhandwerk/ds-werkplan": "github:powerhandwerk/ds-werkplan#v2.2.0"
```

Es liefert TypeScript, TSX und CSS ohne eigenen Build. Next.js übersetzt es mit:

```js
// next.config.mjs
transpilePackages: ["@powerhandwerk/ds-werkplan"],
```

Einmal global laden, etwa in `app/layout.tsx`:

```ts
import "@powerhandwerk/ds-werkplan/tokens.css";
// Nur, wenn die App die Schriften nicht selbst lädt:
import "@powerhandwerk/ds-werkplan/schriften.css";
```

Bausteine und CSS-Module einzeln importieren:

```tsx
import { LichtkanteButton } from "@powerhandwerk/ds-werkplan/LichtkanteButton";
import wp from "@powerhandwerk/ds-werkplan/werkplan.module.css";

export function Beispiel() {
  return (
    <section className={`${wp.seite} ${wp.papier}`}>
      <h2 className={wp.h2}>Google-Profil</h2>
      <LichtkanteButton href="/weiter">Weiter</LichtkanteButton>
    </section>
  );
}
```

Für PDFs (react-pdf kennt weder oklch noch CSS-Variablen) liefert
`@powerhandwerk/ds-werkplan/werte` Hex-Werte, Flächenrollen, Maße und Icon-Pfade.

## Was drin ist

- **Tokens** (`src/tokens.ts`, daraus `src/tokens.css`): Ink-Rampe mit zehn Stufen,
  Lime nur als Fläche mit dunkler Schrift, Rot nur für Fehler und Löschen, Fokusringe,
  drei Schriftfamilien, Schriftgrade `--grad-12` bis `--grad-64` plus `--grad-80` für
  große Messwerte, Rundungsrollen `--rund-eckig`, `--rund-fein`, `--rund-kreis` und
  `--rund-pille-faktor` (die Form der Pille im Logo).
- **Flächen und Typo** (`werkplan.module.css`): Papier und Nacht mit Millimeterraster,
  die Flächenrollen `--wp-*` darin, Typo-Rollen, Textlink, Schriftfeld, Maßbalken,
  Sucher-Ecken.
- **Bausteine:** Lichtkante, ruhiger und fester Knopf, Unterstrich, Etikett,
  Hinweisband, Tastenkappe, Toast, Arbeitsfläche (Liste, Detail, Filter, Kasten,
  Schritte, Fortschritt), Maßbalken, Maßkette, Blattzeile, Schriftfeld, Sucher-Ecken,
  Marker, Icons, Abo-Zeichen, Logo.
- **Bausteine der Kundenseite:** Reiter mit Handy-Menü, Kapitelleiste, Ziffernfelder
  für Codes, Kopieren-Knopf, Eingabefeld. Texte kommen als Props mit Standardwert in
  Sie-Form.
- **Grafik:** zwei animierte Stile für Erklärgrafiken. Stil A, die Leistungskarte
  (`Leistungskarten`, Engine, Formen-Helfer, Beispiele `profil` und `sanierung`).
  Stil B, die Iso-Szene (Iso-Kern nach iso-glow, `IsoKnoten`, Iso-Palette, Ablauf
  `IsoSzene`, Beispiel `explosionProfil`). Regeln im Markenbuch, Abschnitt „Bild und
  Grafik“.
- **Schriften und Marken:** `fonts/` (Big Shoulders Display, Hanken Grotesk, Barlow Semi
  Condensed, je mit OFL-Lizenztext), `assets/` (Logo hell und dunkel, Standort-Pin).

## Grafik

Beide Stile rendern im Server-HTML den Ruhezustand und bewegen sich erst im Client. In
Next.js gilt dabei: Die Seite (Server-Komponente) reicht nur serialisierbare Daten
weiter. Funktionen überqueren die Grenze zwischen Server und Client nicht.

**Stil A, Leistungskarte.** Szenen sind Funktionen. Das Szenen-Register liegt deshalb
in einem eigenen Client-Modul, als feste Modulkonstante:

```tsx
// app/leistungen/LeistungsRaster.tsx
"use client";

import { Leistungskarten } from "@powerhandwerk/ds-werkplan/Leistungskarten";
import { LEISTUNGSKARTEN_BEISPIELE } from "@powerhandwerk/ds-werkplan/leistungskarten-beispiele";
import type { LeistungsKarte } from "@powerhandwerk/ds-werkplan/leistungskarten-engine";

const SZENEN = { ...LEISTUNGSKARTEN_BEISPIELE /*, eigene Szenen */ };

export function LeistungsRaster({ karten }: { karten: readonly LeistungsKarte[] }) {
  return <Leistungskarten karten={karten} szenen={SZENEN} untergrund="papier" />;
}
```

```tsx
// app/leistungen/page.tsx (Server-Komponente): nur Daten
import { LEISTUNGSKARTEN_MUSTER } from "@powerhandwerk/ds-werkplan/leistungskarten-beispiele";
import { LeistungsRaster } from "./LeistungsRaster";

export default function Seite() {
  return <LeistungsRaster karten={LEISTUNGSKARTEN_MUSTER} />;
}
```

Eigene Szenen zeichnen mit dem Werkzeug der Engine und den Formen-Helfern
(`leistungskarten-formen`); Text kommt nur über `w.text()` ins Bild.

**Stil B, Iso-Szene.** Die Server-Komponente rechnet die Zeichnung und reicht sie als
`zeichnung` an `IsoSzene`. `idPraefix` muss je Seite eindeutig sein, sonst teilen sich
zwei Zeichnungen ihre Filter:

```tsx
// Server-Komponente
import { IsoSzene } from "@powerhandwerk/ds-werkplan/IsoSzene";
import { EXPLOSION_STUFEN, explosionProfil } from "@powerhandwerk/ds-werkplan/explosion";

export function Profilgrafik() {
  const zeichnung = explosionProfil({ idPraefix: "profil-" });
  return (
    <IsoSzene
      zeichnung={zeichnung}
      stufen={EXPLOSION_STUFEN}
      beschreibung="Ein Profil in vier Bauteilen, die nacheinander einrasten."
    />
  );
}
```

Rechnet ein Client die Zeichnung, liefert `useSvgPraefix()` (`@powerhandwerk/ds-werkplan/useSvgPraefix`)
das Präfix.

## Regeln

Die Regeln stehen in `CLAUDE.md`, die Herkunft jedes Werts in `docs/inventur.md`.
Kurz: Werte nur aus `src/tokens.ts`; Schriftgrößen und Rundungen nur über Tokens; die
Flächenrollen `--wp-*` nur in den Flächenklassen; Lime nie als Schrift auf hellem
Grund.

## Lesefassung in Claude

Das Design-System in Claude zeigt dieses Paket als Lesefassung: Markenbuch, Tokens für
Papier und Nacht, jeden Baustein mit Live-Vorschau und Leitlinie, Logos und Schriften:
https://claude.ai/artifact/VEtPJU9f39nEtauqCZedqN

Die Seite ist schreibgeschützt (`"editing": "code"`). Ihre Dateien liegen unter
`artifact/project/` und entstehen aus dem Paket: `bun run erzeuge` (Tokens), `bun run
bundle` (Bündel für React 18 als `window.DsWerkplan`), `bun run artifact` (`tokens.css`,
Schriften, Logos, Vorschauen und Leitlinien). Markenbuch (`artifact/project/README.md`)
und Cover sind von Hand geschrieben. Geändert wird nur im Paket, danach werden die
Dateien neu veröffentlicht.

## Entwickeln

```bash
bun install
bun run erzeuge      # tokens.css, schriften.css und tokens.json aus src/tokens.ts
bun run bundle       # Bündel der Lesefassung (artifact/project/components/)
bun run artifact     # übrige Dateien der Lesefassung
bun x tsc --noEmit
bun x vitest run
```

Versionen sind Git-Tags. Ein Tag wird nie verschoben, ein Fix bekommt einen neuen.

## Lizenz

Alle Rechte vorbehalten, KETESO GmbH (`LICENSE`). Die Schriften unter `fonts/` stehen
unter der SIL Open Font License 1.1, die Lizenztexte liegen daneben. Iso-Kern
(`src/iso.ts`) und Explosionszeichnung (`src/explosion.ts`) beruhen auf iso-glow und
stehen unter der MIT-Lizenz (`LICENSE-iso-glow.txt`).
