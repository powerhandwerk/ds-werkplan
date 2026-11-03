# DS Werkplan 2.0

Das Design-System von powerhandwerk: Farben, Schriften, Maße und Bausteine für das
Portal und die Website aus einer Quelle. Entscheidung und Pläne: ADR-261 sowie
`plans/ds-werkplan-paket.md` im Portal-Repo.

## Einbinden

Das Paket kommt als Git-Abhängigkeit mit fester Version, ohne Registry:

```json
"@powerhandwerk/ds-werkplan": "github:powerhandwerk/ds-werkplan#v2.6.0"
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
  Lime als Fläche mit dunkler Schrift oder als Linie, nie als Schrift auf hellem Grund,
  Rot nur für Fehler und Löschen, Fokusringe,
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
- **Produktzeichen** (`Produktzeichen`, Verzeichnis `PRODUKTZEICHEN`, Szenen in zwei
  Reihen, Bausteine in `produktzeichen-formen`): 14 isometrische Zeichen für Produkte
  und Werkzeuge, die Kunden beim Namen nennen, mit genau einem Lime-Motiv, auf Papier
  und Nacht. Die Strichstärke folgt der Größe (unter 56 px kräftig, ab 96 px fein).
  Sie teilen Werkzeug und Projektion mit Stil A, sind aber kein Stil A: keine Bühne,
  keine Geste. Ohne `titel` dekorativ, mit `titel` ein Bild mit Namen.

  ```tsx
  import { Produktzeichen } from "@powerhandwerk/ds-werkplan/Produktzeichen";

  <Produktzeichen name="feinschliff" untergrund="nacht" groesse={64} />
  ```
- **Preise** (`Modellkarte`): die Preiskarte eines Website-Angebots auf Papier, mit
  Produktzeichen auf eigener Bühne, Etikett, Name, Text, Preis mit Einheit und bis zu
  zwei Summen. Alle Zahlen kommen fertig formatiert aus dem Preisregister des
  Verbrauchers, der Baustein rechnet nichts. Die Karte schaltet über ihre eigene
  Breite (ab 420 px Summen nebeneinander); zwei Karten stehen nebeneinander.

  ```tsx
  import { Modellkarte } from "@powerhandwerk/ds-werkplan/Modellkarte";

  <Modellkarte zeichen="website" name="Website" etikett="4 Seiten" preis="00 €" einheit="im Monat, netto" />
  ```
- **Preise** (`Paketkarten`, `LaufzeitSchalter`, `LaufzeitBereich`): die drei
  Abo-Pakete nebeneinander, je Karte Emblem und Name, Nutzen, Für-wen, Preis beider
  Laufzeiten, Abschnittslabel und die Liste mit Produktzeichen in 44 px. Die
  empfohlene Karte steht im Gegenton zur Fläche, mit Lime-Rahmen und Etikett. Texte
  und Preise kommen fertig vom Verbraucher, das Paket enthält keine Preise und keine
  Paketinhalte. Die Karten schalten über ihre eigene Breite (unter 640 px
  untereinander, bis 1.080 px untereinander und innen zweispaltig, darüber drei
  Spalten). `Paketkarten` rendert auf dem Server; `LaufzeitBereich` (Client) zeigt
  darüber den Laufzeit-Schalter, 24 Monate zuerst, und wählt die Laufzeit per
  `data-laufzeit`.

  ```tsx
  import { LaufzeitBereich } from "@powerhandwerk/ds-werkplan/LaufzeitSchalter";
  import { Paketkarten } from "@powerhandwerk/ds-werkplan/Paketkarten";

  <LaufzeitBereich>
    <Paketkarten karten={karten} empfohlen="Profi" untergrund="papier" />
  </LaufzeitBereich>
  ```
- **Fuß** (`Fuss`, Daten in `ziele`, Links in `fuss-links`): der Fuß aller Flächen auf
  Nacht, aus einer Quelle für Website, Portal und Vermittlerseite. Version 2.6.0 bringt
  die Fassung `fokus`; Einbau im Abschnitt „Fuß einbauen“.
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

## Fuß einbauen

`Fuss` liefert den Inhalt des Seitenfußes auf Nacht. Das `<footer>` stellt die Seite
selbst, damit es genau eines gibt. Der Baustein rendert auf dem Server, ohne Skript
und ohne Hooks, und schaltet über seine eigene Breite, nicht über das Fenster: unter
640 px untereinander, ab 640 px der Kontakt in einer Zeile, ab 1.024 px der Plankopf
rechts. Die Fassung `fokus` gilt für Seiten mit einem Ziel: Kontakt in einer Zeile,
Impressum und Datenschutz, auf Wunsch die B2B-Zeile, Logo mit Markenzeile und
Plankopf.

```tsx
import { Fuss } from "@powerhandwerk/ds-werkplan/Fuss";

<footer>
  <Fuss variante="fokus" anrede="sie" b2b={false} blatt="Gründung · Website" stand="03.11.2026" />
</footer>
```

- `b2b` ist Pflicht und hat keinen Standard: Die Seite entscheidet, ob „Nur für
  Unternehmer · Alle Preise netto zzgl. USt.“ dasteht.
- `basis` setzt eigenen Seiten einen Vorsatz voran, etwa `https://powerhandwerk.de` auf
  Subdomains, damit Impressum und Datenschutz auf die zentralen Seiten zeigen; ein
  Schrägstrich am Ende fällt weg.
- `leistungsschein` nimmt die fertige Adresse des Leistungsscheins; mit ihr zeigt die
  Rechtszeile auch AGB und Leistungsschein. Leerer Text zählt nicht als Adresse.
- `texte` ersetzt einzelne Texte außerhalb der Links (Überschrift, Kontaktsatz,
  B2B-Zeile, Name der Navigation, Plankopf), Standard `FUSS_TEXTE`.
- Firmendaten, Text und Ziel jedes Links stehen einmal in `ziele` (`FIRMA`, `ZIELE`),
  die Reihenfolge in `FUSS_REIHENFOLGE`. `fussLinks()` liefert die Links einer Fassung
  ohne Rendern, etwa für einen Crawler-Test. Jeder Fuß trägt `data-fuss` und
  `data-fuss-version`.

## Regeln

Die Regeln stehen in `CLAUDE.md`, die Herkunft jedes Werts in `docs/inventur.md`.
Kurz: Werte nur aus `src/tokens.ts`; Schriftgrößen und Rundungen nur über Tokens; die
Flächenrollen `--wp-*` nur in den Flächenklassen; Lime nie als Schrift auf hellem
Grund.

## Lesefassung in Claude

Das Design-System in Claude zeigt dieses Paket als Lesefassung: Markenbuch, Tokens für
Papier und Nacht, jeden Baustein mit Live-Vorschau und Leitlinie, Logos und Schriften.
Die Adresse steht in `artifact/ziel.json`.

Die Seite ist schreibgeschützt (`"editing": "code"`). Ihre Dateien liegen unter
`artifact/project/` und entstehen aus dem Paket: `bun run erzeuge` (Tokens), `bun run
bundle` (Bündel für React 18 als `window.DsWerkplan`), `bun run artifact` (`tokens.css`,
Schriften, Logos, Vorschauen und Leitlinien). Markenbuch (`artifact/project/README.md`)
und Cover sind von Hand geschrieben. Geändert wird nur im Paket, danach werden die
Dateien neu veröffentlicht.

Veröffentlichen: `bun run lesefassung -- <ordner>` legt die Dateien, den Index
`project/design-system.json` und die Dateiliste `files.json` in einen Ordner. Hochladen
kann nur eine Claude-Session mit dem Artifact-Werkzeug, Ablauf im Skill `ds-baustein`.
Die Logos liegen als hochgeladene Bilder im Artifact; ändert sich eins, bricht das
Skript ab, bis es neu hochgeladen und in `artifact/ziel.json` eingetragen ist. Welcher
Baustein gerade entworfen, freigegeben oder gebaut ist, steht in `docs/bausteine.md`.

## Entwickeln

```bash
bun install
bun run erzeuge      # tokens.css, schriften.css und tokens.json aus src/tokens.ts
bun run bundle       # Bündel der Lesefassung (artifact/project/components/)
bun run artifact     # übrige Dateien der Lesefassung
bun run vorschau     # Lesefassung lokal ansehen, http://127.0.0.1:4387/
bun run lesefassung -- <ordner>   # Lesefassung zum Hochladen vorbereiten
bun x tsc --noEmit
bun x vitest run
```

Versionen sind Git-Tags. Ein Tag wird nie verschoben, ein Fix bekommt einen neuen.

## Lizenz

Alle Rechte vorbehalten, KETESO GmbH (`LICENSE`). Die Schriften unter `fonts/` stehen
unter der SIL Open Font License 1.1, die Lizenztexte liegen daneben. Iso-Kern
(`src/iso.ts`) und Explosionszeichnung (`src/explosion.ts`) beruhen auf iso-glow und
stehen unter der MIT-Lizenz (`LICENSE-iso-glow.txt`).
