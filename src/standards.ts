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

export interface PaketkartenTexte {
  /** Etikett der empfohlenen Karte. */
  empfehlung: string;
  /** Zugänglicher Name einer Karte; `{paket}` wird zum Namen des Pakets. */
  karte: string;
  /** Zugänglicher Name der empfohlenen Karte; `{paket}` wie oben. */
  karteEmpfohlen: string;
}

/** Texte der Paketkarten. Ohne Paketinhalte: Nutzen, Leistungen und Preise reicht der Verbraucher hinein. */
export const PAKETKARTEN_TEXTE: PaketkartenTexte = {
  empfehlung: "Unsere Empfehlung",
  karte: "Paket {paket}",
  karteEmpfohlen: "Paket {paket}, unsere Empfehlung",
};

export interface LaufzeitTexte {
  /** Beschriftung über dem Schalter. */
  label: string;
  /** Zugänglicher Name der Knopfgruppe. */
  gruppe: string;
  /** Text eines Knopfs; `{monate}` wird zur Zahl der Monate. */
  option: string;
}

/** Texte des Laufzeit-Schalters. Die Info-Zeilen haben keinen Standard (Sie und du unterscheiden sich). */
export const LAUFZEIT_TEXTE: LaufzeitTexte = {
  label: "Laufzeit",
  gruppe: "Laufzeit wählen",
  option: "{monate} Monate",
};

/** Die Laufzeiten in ihrer festen Reihenfolge: 24 zuerst und vorgewählt, 12 daneben. */
export const PAKET_LAUFZEITEN = [24, 12] as const;
