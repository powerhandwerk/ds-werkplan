// Standardwerte der Kundenseiten-Bausteine (DS Werkplan 2.0, ADR-261): Texte,
// Codelänge, Kapitelnummer. Bewusst ohne "use client": Die Bausteine, die sie
// nutzen, sind Client-Komponenten, und ein Wert aus einem Client-Modul käme in
// einer Server-Komponente nur als Client-Verweis an, nicht als Wert.

/** Länge des Codes auf der Kundenseite. */
export const CODE_LAENGE_STANDARD = 6;

/** Leere Ziffern für einen Code der Länge `laenge`. */
export function leereZiffern(laenge: number = CODE_LAENGE_STANDARD): string[] {
  return Array.from({ length: laenge }, () => "");
}

/** Name eines Ziffernfelds: „Ziffer 1 von 6“. */
export function zifferLabelStandard(nummer: number, laenge: number): string {
  return `Ziffer ${nummer} von ${laenge}`;
}

/** Nummer eines Kapitels, zweistellig: „01“. */
export function kapitelNummer(nummer: number): string {
  return String(nummer).padStart(2, "0");
}

export interface KopierenTexte {
  kopieren: string;
  kopiert: string;
  /** Hinweis am gesperrten Knopf. */
  ohneFunktion: string;
  /** Ansage, wenn das Kopieren scheitert. */
  manuell: string;
  /** Name des Rückfall-Felds. */
  feld: string;
}

/** Texte des Kopieren-Knopfs in Sie-Form, wie auf der Kundenseite. */
export const KOPIEREN_TEXTE: KopierenTexte = {
  kopieren: "Kopieren",
  kopiert: "Kopiert",
  ohneFunktion: "In der Kundenansicht ohne Funktion",
  manuell: "Kopieren ging nicht. Markieren Sie den Text im Feld und kopieren Sie ihn selbst.",
  feld: "Text zum Kopieren",
};
