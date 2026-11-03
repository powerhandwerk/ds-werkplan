// Einträge des Fußes je Fassung als reine Funktion (Plan fuss-baustein, D3):
// Der Vertragstest prüft sie ohne Rendern, der Baustein `Fuss` rendert sie.
// Ohne React und ohne "use client".

import { FUSS_REIHENFOLGE, ZIELE, type ZielArt, type ZielSchluessel } from "./ziele";

/** Fassung des Fußes; Teil B ergänzt „voll“ und „tippgeber“. */
export type FussVariante = "fokus";

/** Schicht des Fußes nach dem Spezifikationsblatt: 02 Kontakt, 04 Rechtszeile. */
export type FussSchicht = "02" | "04";

/** Ein Link des Fußes mit fertiger Adresse. */
export interface FussEintrag {
  schluessel: ZielSchluessel;
  text: string;
  href: string;
  /** Zugänglicher Name, wo der Text allein nicht reicht. */
  name?: string;
  art: ZielArt;
  schicht: FussSchicht;
}

export interface FussLinksOptionen {
  variante: FussVariante;
  /**
   * Vorsatz für eigene Seiten (Ziele mit „/“ vorn), etwa `https://powerhandwerk.de`
   * auf Subdomains, ohne Schrägstrich am Ende. Standard: leer, also relativ.
   */
  basis?: string;
  /** Fertige Adresse des Leistungsscheins. In „fokus“ zeigt der Fuß AGB und Leistungsschein nur mit ihr (Bestellen). */
  leistungsschein?: string;
}

/**
 * Schicht je Ziel und Fassung. `mitLeistungsschein` zeigt ein Ziel nur zusammen
 * mit dem Leistungsschein (AGB beim Bestellen); der Leistungsschein selbst fällt
 * ohne Adresse von allein weg.
 */
const FASSUNGEN: Record<FussVariante, Partial<Record<ZielSchluessel, { schicht: FussSchicht; mitLeistungsschein?: true }>>> = {
  fokus: {
    telefon: { schicht: "02" },
    email: { schicht: "02" },
    whatsapp: { schicht: "02" },
    impressum: { schicht: "04" },
    datenschutz: { schicht: "04" },
    agb: { schicht: "04", mitLeistungsschein: true },
    leistungsschein: { schicht: "04" },
  },
};

/** Die Links einer Fassung in der festen Reihenfolge `FUSS_REIHENFOLGE`. */
export function fussLinks({ variante, basis = "", leistungsschein }: FussLinksOptionen): FussEintrag[] {
  const fassung = FASSUNGEN[variante];
  return FUSS_REIHENFOLGE.flatMap((schluessel) => {
    const regel = fassung[schluessel];
    if (regel === undefined || (regel.mitLeistungsschein && leistungsschein === undefined)) return [];
    const { href, ...ziel } = ZIELE[schluessel];
    // Ein Ziel ohne eigene Adresse bekommt sie vom Verbraucher; `basis` gilt nur für eigene Seiten.
    const adresse = href === undefined ? leistungsschein : href.startsWith("/") ? basis + href : href;
    return adresse === undefined ? [] : [{ schluessel, ...ziel, href: adresse, schicht: regel.schicht }];
  });
}
