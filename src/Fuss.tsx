import css from "./fuss.module.css";
import { fussLinks, type FussEintrag, type FussVariante } from "./fuss-links";
import { Logo } from "./Logo";
import { Plankopf, type PlankopfFeld } from "./Plankopf";
import w from "./werkplan.module.css";
import { FIRMA, FUSS_TEXTE, FUSS_VERSION } from "./ziele";

export interface FussProps {
  /** Fassung; Teil A kennt nur „fokus“. */
  variante: FussVariante;
  /**
   * Zeile „Nur für Unternehmer · Alle Preise netto zzgl. USt.“. Pflicht ohne
   * Standard, damit kein Einbau sie still ein- oder ausschaltet.
   */
  b2b: boolean;
  /** Blatt im Schriftfeld, etwa „Gründung · Website“. */
  blatt: string;
  /** Stand im Schriftfeld; ohne Wert fällt das Feld weg. */
  stand?: string;
  /** Anrede des Kontaktsatzes. Standard: „du“. */
  anrede?: "du" | "sie";
  /** Vorsatz für eigene Seiten, etwa `https://powerhandwerk.de` auf Subdomains. */
  basis?: string;
  /** Fertige Adresse des Leistungsscheins; mit ihr zeigt der Fuß AGB und Leistungsschein. */
  leistungsschein?: string;
  className?: string;
}

/**
 * Fuß aller powerhandwerk-Flächen (Plan fuss-baustein, Entwurf „Footer-Entwurf
 * im DS Werkplan“), Teil A: die Fassung „fokus“ für Seiten mit einem Ziel, etwa
 * /gruendung. Kontakt in einer Zeile, Rechtszeile, B2B-Zeile nach `b2b`, Logo
 * mit Markenzeile und Plankopf. Server-Komponente ohne Hooks und ohne Skript;
 * das `<footer>` stellt der Verbraucher, damit es genau eines je Seite gibt.
 * Der Fuß steht auf Nacht und schaltet über seine eigene Breite.
 */
export function Fuss({ variante, b2b, blatt, stand, anrede = "du", basis, leistungsschein, className }: FussProps) {
  const eintraege = fussLinks({ variante, basis, leistungsschein });
  const mitStand = Boolean(stand?.trim());
  const t = FUSS_TEXTE.plankopf;
  const felder: PlankopfFeld[] = [
    { label: t.herausgeber, wert: FIRMA.herausgeber },
    { label: t.blatt, wert: blatt },
    ...(mitStand ? [{ label: t.stand, wert: stand }] : []),
    // Ohne Stand zieht der Ansprechpartner über beide Spalten, statt eine leere Zelle zu lassen.
    { label: t.ansprechpartner, wert: FIRMA.ansprechpartner, breit: !mitStand },
  ];
  const liste = (schicht: FussEintrag["schicht"], klasse: string) => (
    <ul className={css.zeile}>
      {eintraege
        .filter((eintrag) => eintrag.schicht === schicht)
        .map((eintrag) => (
          <li key={eintrag.schluessel}>
            <a className={klasse} href={eintrag.href} aria-label={eintrag.name}>
              {eintrag.text}
            </a>
          </li>
        ))}
    </ul>
  );
  return (
    <div className={[w.nacht, css.fuss, className].filter(Boolean).join(" ")} data-fuss={variante} data-fuss-version={FUSS_VERSION}>
      <div className={css.innen}>
        <section className={css.kontakt}>
          <h2 className={w.beschriftung}>{FUSS_TEXTE.kontakt}</h2>
          <p className={w.text}>{FUSS_TEXTE.kontaktSatz[anrede]}</p>
          {liste("02", css.ziel)}
        </section>
        <div className={css.unten}>
          <div className={css.recht}>
            <nav aria-label={FUSS_TEXTE.recht}>{liste("04", `${css.ziel} ${css.klein}`)}</nav>
            {b2b && <p className={`${w.quelle} ${css.b2b}`}>{FUSS_TEXTE.b2b}</p>}
            <div className={css.marke}>
              <Logo variant="dark" height="var(--fuss-logo)" />
              <p className={css.markenzeile}>{FIRMA.markenzeile}</p>
            </div>
          </div>
          <Plankopf untergrund="nacht" felder={felder} className={css.planfeld} />
        </div>
      </div>
    </div>
  );
}
