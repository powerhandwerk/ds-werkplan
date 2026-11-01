import type React from "react";
import { Etikett } from "./Bausteine";
import css from "./modellkarte.module.css";
import { Produktzeichen } from "./Produktzeichen";
import type { ProduktzeichenName } from "./produktzeichen-verzeichnis";
import { SucherEcken } from "./SucherEcken";
import w from "./werkplan.module.css";

/** Eine Summe unter dem Preis: Beschriftung und fertig formatierter Wert. */
export type ModellkarteSumme = { label: string; wert: string };

export type ModellkarteProps = {
  /** Produktzeichen auf der Bühne, dekorativ (der Name steht daneben). */
  zeichen: ProduktzeichenName;
  /** Name des Angebots; zugleich der zugängliche Name der Karte. */
  name: string;
  /** Ebene der Überschrift. Standard: h3. */
  ueberschrift?: "h2" | "h3" | "h4";
  /** Etikett vor dem Namen, etwa der Umfang. */
  etikett?: React.ReactNode;
  text?: React.ReactNode;
  /** Preis, fertig formatiert vom Verbraucher. Der Baustein rechnet nichts. */
  preis: string;
  /** Einheit neben dem Preis. */
  einheit?: string;
  /** Summen unter dem Preis, bis zwei; Werte fertig formatiert. */
  summen?: readonly ModellkarteSumme[];
  /** Kantenlänge des Produktzeichens in px, gilt ab 420 px Kartenbreite. Standard: 172. Schmaler zeichnet das CSS es immer mit 150 px. */
  zeichenGroesse?: number;
  className?: string;
};

/**
 * Preiskarte eines Website-Angebots (Entwurf 1 „Modellkarte“, Flo 01.11.2026):
 * das Produktzeichen auf eigener Bühne, Etikett und Name, Text, Preis mit
 * Einheit, darunter die Summen. Steht auf Papier und rendert auf dem Server.
 * Die Karte schaltet über ihre eigene Breite (`modellkarte.module.css`); die
 * Textzeile wächst, damit Preis und Summen zweier Karten nebeneinander auf
 * einer Linie stehen.
 */
export function Modellkarte({
  zeichen,
  name,
  ueberschrift: Ueberschrift = "h3",
  etikett,
  text,
  preis,
  einheit,
  summen,
  zeichenGroesse = 172,
  className,
}: ModellkarteProps) {
  return (
    <SucherEcken as="section" aria-label={name} className={[css.karte, className].filter(Boolean).join(" ")}>
      <div className={css.buehne}>
        <Produktzeichen name={zeichen} untergrund="papier" groesse={zeichenGroesse} />
      </div>
      <div className={css.kopf}>
        {etikett !== undefined && <Etikett art="lead">{etikett}</Etikett>}
        <Ueberschrift className={`${w.h3} ${css.name}`}>{name}</Ueberschrift>
      </div>
      {text !== undefined && <p className={`${w.text} ${css.text}`}>{text}</p>}
      <div className={css.preis}>
        <span className={`${w.messwert} ${css.messwert}`}>{preis}</span>
        {einheit !== undefined && <span className={css.einheit}>{einheit}</span>}
      </div>
      {summen !== undefined && summen.length > 0 && (
        <dl className={css.summen}>
          {summen.map((summe, index) => (
            <div key={`${index}-${summe.label}`}>
              <dt className={w.beschriftung}>{summe.label}</dt>
              <dd className={w.plankopfWert}>{summe.wert}</dd>
            </div>
          ))}
        </dl>
      )}
    </SucherEcken>
  );
}
