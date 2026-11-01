/**
 * Verzeichnis der Produktzeichen: Name, Szene und Titel je Zeichen in fester
 * Reihenfolge. Rein, ohne React; die Komponente `Produktzeichen` liest von hier.
 */
import { zeichneRuhe, type Szene } from "./leistungskarten-engine";
import { zeichenAusschnitt } from "./produktzeichen-formen";
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
 * ohne sichtbaren Namen daneben steht.
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
} as const satisfies Record<string, { titel: string; szene: Szene }>;

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

const DATEN = new Map<ProduktzeichenName, { viewBox: string; markup: string }>();

/** Bildausschnitt und Markup eines Zeichens im Ruhezustand, einmal gerechnet. */
export function produktzeichenDaten(name: ProduktzeichenName): { viewBox: string; markup: string } {
  let daten = DATEN.get(name);
  if (!daten) {
    const { szene } = PRODUKTZEICHEN[name];
    daten = { viewBox: zeichenAusschnitt(szene), markup: zeichneRuhe(szene) };
    DATEN.set(name, daten);
  }
  return daten;
}
