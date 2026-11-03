// Ziele und Firmendaten des Fußes (Plan fuss-baustein, Teil A): eine Quelle für
// Text, Adresse und Namen jedes Links, damit Website, Portal und Vermittlerseite
// dieselben Angaben zeigen (WCAG 3.2.4: gleiches Ziel, gleicher Text). Bewusst
// ohne React und ohne "use client": Server-Komponenten und Skripte lesen die
// Werte direkt.

/** Firmendaten, öffentlich wie im Impressum. */
export interface Firma {
  /** Herausgeber im Schriftfeld. */
  herausgeber: string;
  ansprechpartner: string;
  /** Anzeige und `tel:`-Adresse derselben Nummer. */
  telefon: { anzeige: string; href: string };
  email: string;
  /** WhatsApp-Adresse (`wa.me`, nur Ziffern). */
  whatsapp: string;
  /** Zeile neben dem Logo (E3 der Entscheidungsvorlage). */
  markenzeile: string;
}

/** Firmendaten in der Schreibweise der Website (`lib/site.ts`). */
export const FIRMA: Firma = {
  herausgeber: "KETESO GmbH",
  ansprechpartner: "Andreas Keller",
  telefon: { anzeige: "+49 152 295 409 46", href: "tel:+4915229540946" },
  email: "kontakt@powerhandwerk.de",
  whatsapp: "https://wa.me/4915229540946",
  markenzeile: "powerhandwerk ist eine Marke der KETESO GmbH",
};

/** Art eines Ziels: eigene Seite, fremde Adresse, Anruf oder Mail. */
export type ZielArt = "seite" | "extern" | "telefon" | "mail";

/**
 * Ein Ziel: sichtbarer Text, Adresse und, wo der Text allein nicht reicht, ein
 * zugänglicher Name, der den sichtbaren Text enthält (WCAG 2.5.3). Ohne `href`
 * kommt die Adresse vom Verbraucher (Leistungsschein).
 */
export interface Ziel {
  text: string;
  href?: string;
  name?: string;
  art: ZielArt;
}

/** Schlüssel der Ziele; Teil B ergänzt die Ziele der Fassungen „voll“ und „tippgeber“. */
export type ZielSchluessel = "telefon" | "email" | "whatsapp" | "impressum" | "datenschutz" | "agb" | "leistungsschein";

/**
 * Verzeichnis aller Ziele. Kopf und Fuß teilen Schlüssel, Text und Adresse; die
 * Reihenfolge führt jeder Baustein selbst (`FUSS_REIHENFOLGE`).
 */
export const ZIELE: Readonly<Record<ZielSchluessel, Ziel>> = {
  telefon: { text: FIRMA.telefon.anzeige, href: FIRMA.telefon.href, art: "telefon" },
  email: { text: FIRMA.email, href: `mailto:${FIRMA.email}`, art: "mail" },
  whatsapp: { text: "WhatsApp", href: FIRMA.whatsapp, name: "WhatsApp Chat starten", art: "extern" },
  impressum: { text: "Impressum", href: "/impressum", art: "seite" },
  datenschutz: { text: "Datenschutz", href: "/datenschutz", art: "seite" },
  agb: { text: "AGB", href: "/agb", art: "seite" },
  leistungsschein: { text: "Leistungsschein", art: "seite" },
};

/** Ziele, die jede Fassung des Fußes zeigt. */
export const PFLICHT = ["impressum", "datenschutz"] as const satisfies readonly ZielSchluessel[];

/**
 * Reihenfolge der Ziele im Fuß. Eine Fassung lässt nur weg und sortiert nie um
 * (WCAG 3.2.3); neue Schlüssel kommen an ihrer Stelle hinzu.
 */
export const FUSS_REIHENFOLGE: readonly ZielSchluessel[] = [
  "telefon",
  "email",
  "whatsapp",
  "impressum",
  "datenschutz",
  "agb",
  "leistungsschein",
];

/** Texte des Fußes; der Kontaktsatz je Anrede. */
export const FUSS_TEXTE = {
  kontakt: "Kontakt",
  kontaktSatz: { du: "Ruf an oder schreib uns.", sie: "Rufen Sie an oder schreiben Sie uns." },
  b2b: "Nur für Unternehmer · Alle Preise netto zzgl. USt.",
  /** Name der Navigation mit den Rechtsseiten. */
  recht: "Rechtliches",
  plankopf: { herausgeber: "Herausgeber", blatt: "Blatt", stand: "Stand", ansprechpartner: "Ansprechpartner" },
} as const;

/** Version des Fußes, gleich der Paketversion; steht als `data-fuss-version` an jedem Fuß. */
export const FUSS_VERSION = "2.6.0";
