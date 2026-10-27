import type React from "react";

import css from "./bausteine.module.css";

/**
 * Kleine Werkplan-Bausteine des DS Werkplan 2.0 (ADR-261) für Arbeitsseiten
 * (Leinwand Gründungsradar, Tafel 0b): ruhiger und fester Knopf, Etiketten, Hinweisband, Tastenkappe,
 * Toast. Ohne "use client" und ohne Zustand; Icons kommen als Knoten vom
 * Aufrufer, damit die Bausteine keine Icon-Sammlung festlegen.
 */

/** Klassen für Aufrufer, die einen fremden Knopf so aussehen lassen (z. B. confirmProps). */
export const WERKPLAN_KNOPF = { fest: css.fest, ruhig: css.ruhig, lichtkanteKlein: css.lkKlein, lichtkanteVoll: css.lkVoll, lichtkanteHandy: css.lkHandy };

/** Setzt die Warnfarben und Linien, die die Bausteine lesen; an die Seite hängen. */
export const WERKPLAN_BAUSTEINE_SEITE = css.seite;

/** Hebt ein Wort mit dem Lime-Unterstrich hervor; ersetzt im Werkplan die Marker-Pille (Flo 24.10.2026). */
export function Unterstrich({ children }: { children: React.ReactNode }) {
  return <span className={css.unterstrich}>{children}</span>;
}

type KnopfGroesse = "normal" | "klein" | "handy";

export function RuhigerKnopf({
  icon,
  children,
  nacht = false,
  groesse = "normal",
  className,
  ...rest
}: {
  icon?: React.ReactNode;
  nacht?: boolean;
  groesse?: KnopfGroesse;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const klassen = [css.ruhig, nacht ? css.ruhigNacht : null, groesse === "klein" ? css.klein : null, groesse === "handy" ? css.handy : null, className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={klassen} {...rest}>
      {icon}
      {children}
    </button>
  );
}

/** Fester Knopf: nur als Bestätigung in Dialogen. */
export function FesterKnopf({ icon, children, className, ...rest }: { icon?: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={[css.fest, className].filter(Boolean).join(" ")} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export type EtikettArt = "linie" | "gestrichelt" | "voll" | "lead" | "warn" | "still";

const ETIKETT_KLASSE: Record<EtikettArt, string> = {
  linie: css.etikettLinie,
  gestrichelt: css.etikettGestrichelt,
  voll: css.etikettVoll,
  lead: css.etikettLead,
  warn: css.etikettWarn,
  still: css.etikettStill,
};

export function Etikett({ art = "linie", icon, children, className }: { art?: EtikettArt; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <span className={[css.etikett, ETIKETT_KLASSE[art], className].filter(Boolean).join(" ")}>
      {icon}
      {children}
    </span>
  );
}

/** Hinweisband: Rahmen und Fläche in Warnfarbe, Icon an der ersten Zeile, nie ein Seitenbalken. */
export function Hinweisband({ icon, titel, children, aktion }: { icon: React.ReactNode; titel: string; children?: React.ReactNode; aktion?: React.ReactNode }) {
  return (
    <div role="status" className={css.band}>
      <span className={css.bandIcon}>{icon}</span>
      <p className={css.bandText}>
        <strong>{titel}</strong> {children}
      </p>
      {aktion ? <span className={css.bandAktion}>{aktion}</span> : null}
    </div>
  );
}

export function Tastenkappe({ children, nacht = false }: { children: React.ReactNode; nacht?: boolean }) {
  return <kbd className={nacht ? `${css.kappe} ${css.kappeNacht}` : css.kappe}>{children}</kbd>;
}

/**
 * Bestätigung unten in der Mitte mit optionaler Aktion (etwa „Rückgängig“); role="status".
 * `ohneLiveRegion`: die Seite sagt den Text selbst über den StatusAnnouncer an (der Toast
 * kommt mit seinem Text ins DOM und bliebe als Live-Region in vielen Screenreadern stumm).
 */
export function Toast({
  haken,
  text,
  aktion,
  ohneLiveRegion = false,
}: {
  haken: React.ReactNode;
  text: string;
  aktion?: { label: string; icon?: React.ReactNode; taste?: string; onClick: () => void };
  ohneLiveRegion?: boolean;
}) {
  return (
    <div role={ohneLiveRegion ? undefined : "status"} aria-live={ohneLiveRegion ? undefined : "polite"} className={css.toast}>
      <span className={css.toastHaken}>{haken}</span>
      <span className={css.toastText}>{text}</span>
      {aktion ? (
        <>
          <button type="button" className={css.toastAktion} onClick={aktion.onClick}>
            {aktion.icon}
            {aktion.label}
          </button>
          {aktion.taste ? <Tastenkappe nacht>{aktion.taste}</Tastenkappe> : null}
        </>
      ) : null}
    </div>
  );
}
