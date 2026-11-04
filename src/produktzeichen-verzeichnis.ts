/**
 * Verzeichnis der Produktzeichen: Name, Szene und Titel je Zeichen in fester
 * Reihenfolge. Rein, ohne React; die Komponente `Produktzeichen` liest von hier.
 */
import { zeichneRuhe, type Szene } from "./leistungskarten-engine";
import { zeichenAusschnitt, type FlacheFassung } from "./produktzeichen-formen";
import { MESSLATTE_FLACH, ZEICHEN_MESSLATTE } from "./produktzeichen-messlatte";
import {
  ZEICHEN_DATEI_ANFRAGE,
  ZEICHEN_FEINSCHLIFF,
  ZEICHEN_KUNDENSEITE,
  ZEICHEN_MONATSBERICHT,
  ZEICHEN_ONEPAGER,
  ZEICHEN_WEBSITE,
} from "./produktzeichen-reihe1";
import {
  ZEICHEN_BEWERTUNGSSEITE,
  ZEICHEN_ERSCHEINUNGSBILD,
  ZEICHEN_GOOGLE_PROFIL,
  ZEICHEN_GOOGLE_SUCHE,
  ZEICHEN_KI_SICHTBARKEIT,
  ZEICHEN_KOMPAKT_CHECK,
  ZEICHEN_PRUEFBERICHT,
  ZEICHEN_WEBSITE_BEREICH,
} from "./produktzeichen-reihe2";

/**
 * Die Produktzeichen in fester Reihenfolge. `titel` ist der Name des Produkts,
 * wie ihn Kunden kennen; er taugt als `titel` der Komponente, wenn das Zeichen
 * ohne sichtbaren Namen daneben steht. `flach` beschreibt, wo es eine gibt, die
 * flache Fassung für kleine Größen; heute nur `messlatte`.
 */
export const PRODUKTZEICHEN = {
  onepager: { titel: "One-Pager", szene: ZEICHEN_ONEPAGER },
  website: { titel: "Website · 4 Seiten", szene: ZEICHEN_WEBSITE },
  feinschliff: { titel: "Feinschliff", szene: ZEICHEN_FEINSCHLIFF },
  "datei-anfrage": { titel: "Datei-Anfrage", szene: ZEICHEN_DATEI_ANFRAGE },
  kundenseite: { titel: "Kundenseite", szene: ZEICHEN_KUNDENSEITE },
  monatsbericht: { titel: "Monatsbericht", szene: ZEICHEN_MONATSBERICHT },
  bewertungsseite: { titel: "Bewertungs-Seite", szene: ZEICHEN_BEWERTUNGSSEITE },
  erscheinungsbild: { titel: "Erscheinungsbild-Handbuch", szene: ZEICHEN_ERSCHEINUNGSBILD },
  "google-profil": { titel: "Bereich Google-Profil", szene: ZEICHEN_GOOGLE_PROFIL },
  "google-suche": { titel: "Bereich Google-Suche", szene: ZEICHEN_GOOGLE_SUCHE },
  "ki-sichtbarkeit": { titel: "Bereich KI-Sichtbarkeit", szene: ZEICHEN_KI_SICHTBARKEIT },
  "website-bereich": { titel: "Bereich Website", szene: ZEICHEN_WEBSITE_BEREICH },
  pruefbericht: { titel: "Prüfbericht", szene: ZEICHEN_PRUEFBERICHT },
  "kompakt-check": { titel: "Kompakt-Check", szene: ZEICHEN_KOMPAKT_CHECK },
  messlatte: { titel: "Messlatte", szene: ZEICHEN_MESSLATTE, flach: MESSLATTE_FLACH },
} as const satisfies Record<string, { titel: string; szene: Szene; flach?: FlacheFassung }>;

export type ProduktzeichenName = keyof typeof PRODUKTZEICHEN;

/** Alle Namen in der Reihenfolge des Verzeichnisses. */
export const PRODUKTZEICHEN_NAMEN = Object.keys(PRODUKTZEICHEN) as ProduktzeichenName[];

/** Optische Größe: unter 56 px kräftige Linien, ab 96 px Haarlinien, dazwischen mittel. */
export type OptischeGroesse = "klein" | "mittel" | "gross";

export function optischeGroesse(groesse: number): OptischeGroesse {
  if (groesse < 56) return "klein";
  if (groesse < 96) return "mittel";
  return "gross";
}

/** Bildausschnitt und Markup; `flach` nur an der flachen Fassung. */
export type ProduktzeichenDaten = { viewBox: string; markup: string; flach?: true };

const DATEN = new Map<string, ProduktzeichenDaten>();

/**
 * Bildausschnitt und Markup eines Zeichens im Ruhezustand, je Fassung einmal
 * gerechnet. Ein Zeichen mit `flach` liefert unter 40 px die flache Fassung
 * (viewBox 0 0 24 24); alle übrigen bleiben in jeder Größe Iso.
 */
export function produktzeichenDaten(name: ProduktzeichenName, groesse = 64): ProduktzeichenDaten {
  const eintrag = PRODUKTZEICHEN[name];
  const flach = "flach" in eintrag && groesse < eintrag.flach.unter ? eintrag.flach : null;
  const stufe = flach?.stufe(groesse);
  const schluessel = flach ? `${name}|flach-${stufe}` : `${name}|iso`;
  let daten = DATEN.get(schluessel);
  if (!daten) {
    daten =
      flach && stufe !== undefined
        ? { viewBox: "0 0 24 24", markup: flach.zeichne(stufe), flach: true }
        : { viewBox: zeichenAusschnitt(eintrag.szene), markup: zeichneRuhe(eintrag.szene) };
    DATEN.set(schluessel, daten);
  }
  return daten;
}
