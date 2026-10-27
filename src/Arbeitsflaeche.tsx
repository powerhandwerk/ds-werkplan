import type React from "react";

import css from "./arbeitsflaeche.module.css";
import { Massbalken } from "./Massbalken";

/**
 * Werkplan-Arbeitsfläche des DS Werkplan 2.0 (ADR-261) für Seiten mit Liste
 * links und Detail rechts (Leinwand Gründungsradar, Variante 1). Beschriftung, Messwert, Schriftfeld, Info-Zeile, Kasten, Schritte,
 * Icon-Knopf, Filterleiste, Fortschritt, Liste mit Gruppen und Zeilen,
 * Detailrahmen. Ohne "use client" und ohne Zustand; Icons kommen als Knoten vom
 * Aufrufer, damit die Bausteine keine Icon-Sammlung festlegen. Die Seite trägt
 * WERKPLAN_BAUSTEINE_SEITE und die .seite aus werkplan.module.css.
 */

/** Klassen für Aufrufer, die ein eigenes Element so aussehen lassen (Lade-Gerüst, Icon-Knopf als Link, Filterknopf als Schalter). */
export const WERKPLAN_FLAECHE = {
  liste: css.liste,
  zeile: css.zeile,
  leer: css.leer,
  info: css.info,
  textlink: css.textlink,
  zeileRueck: css.zeileRueck,
  iconKnopf: css.iconKnopf,
  filterKnopf: css.filterKnopf,
  filterZahl: css.filterZahl,
};

function klassen(...teile: (string | false | null | undefined)[]): string {
  return teile.filter(Boolean).join(" ");
}

/** Klick ohne Taste und mit links wählt ohne Neuladen; Meta, Strg, Umschalt oder Mittelklick öffnen den Link wie gewohnt. */
export function einfacherKlick(e: React.MouseEvent<HTMLAnchorElement>, waehle: () => void) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  waehle();
}

export function Besch({
  children,
  gross = false,
  stark = false,
  className,
  as: Tag = "span",
}: {
  children: React.ReactNode;
  gross?: boolean;
  stark?: boolean;
  className?: string;
  as?: "span" | "p" | "h2" | "h3";
}) {
  return <Tag className={klassen(css.besch, gross && css.beschGross, stark && css.beschStark, className)}>{children}</Tag>;
}

export function Messwert({ children, groesse, farbe }: { children: React.ReactNode; groesse: number; farbe?: string }) {
  return (
    <span className={css.messwert} style={{ fontSize: groesse, color: farbe }}>
      {children}
    </span>
  );
}

/**
 * Schriftfeld wie auf den Tafeln: Label in Beschriftung, Wert in Barlow-Versalien, 1-px-Fugen.
 * `letzteBreit`: das letzte Feld nimmt den Rest (Notiz, Online geprüft), wie die Tafeln mit max-content und 1fr.
 */
export function Schriftfeld({
  felder,
  voll = false,
  letzteBreit = false,
  className,
}: {
  felder: [string, React.ReactNode][];
  voll?: boolean;
  letzteBreit?: boolean;
  className?: string;
}) {
  return (
    <dl className={klassen(css.plankopf, voll && css.plankopfVoll, letzteBreit && css.plankopfLetzteBreit, className)}>
      {felder.map(([label, wert]) => (
        <div key={label} className={css.plankopfFeld}>
          <dt>
            <Besch>{label}</Besch>
          </dt>
          <dd>{wert}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Info-Zeile: Icon an der ersten Zeile, Text daneben. */
export function Info({ icon, children, gross = false }: { icon: React.ReactNode; children: React.ReactNode; gross?: boolean }) {
  return (
    <p className={gross ? `${css.info} ${css.infoGross}` : css.info}>
      {icon}
      <span>{children}</span>
    </p>
  );
}

/** Kasten mit Icon (Lead, Sperre): feiner Rahmen rundum. */
export function Kasten({
  icon,
  dunkel = false,
  label,
  titel,
  children,
  rechts,
}: {
  icon: React.ReactNode;
  dunkel?: boolean;
  label: string;
  titel: string;
  children: React.ReactNode;
  rechts?: React.ReactNode;
}) {
  return (
    <div className={css.kasten}>
      <span className={dunkel ? `${css.kastenIcon} ${css.kastenIconDunkel}` : css.kastenIcon}>{icon}</span>
      <div className={css.kastenText}>
        <Besch>{label}</Besch>
        <span className={css.kastenTitel}>{titel}</span>
        <span className={css.kastenUnter}>{children}</span>
      </div>
      {rechts}
    </div>
  );
}

/** Nummerierte Schritte 01, 02, … mit optionalem Titel. */
export function Schritte({ schritte, gross = false }: { schritte: { titel?: string; text: string }[]; gross?: boolean }) {
  return (
    <ol className={css.schritte}>
      {schritte.map((s, i) => (
        <li key={i} className={css.schritt}>
          <span aria-hidden="true" className={gross ? `${css.schrittNr} ${css.schrittNrGross}` : css.schrittNr}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={css.schrittText}>
            {s.titel ? <Besch stark>{s.titel}</Besch> : null}
            <span>{s.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Quadratischer Knopf nur mit Icon; das Label steht als aria-label und title. Als Link: WERKPLAN_FLAECHE.iconKnopf. */
export function IconKnopf({
  icon,
  label,
  onClick,
  disabled,
  nacht = false,
  groesse = 32,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  nacht?: boolean;
  groesse?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={klassen(css.iconKnopf, nacht && css.iconKnopfNacht, className)}
      style={{ width: groesse, height: groesse }}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}

/** Rahmen der Detailfläche rechts; `spalte` stapelt den Inhalt. */
export function DetailRahmen({ children, label, spalte = false, className }: { children: React.ReactNode; label: string; spalte?: boolean; className?: string }) {
  return (
    <section aria-label={label} className={klassen(css.detail, spalte && css.detailSpalte, className)}>
      {children}
    </section>
  );
}

// ---- Liste ------------------------------------------------------------------------

export type FilterEintrag<T extends string> = { wert: T; label: string; zahl: number };

/** Bereiche über der Liste: jeder Knopf ist ein echter Link, ein einfacher Klick wählt ohne Neuladen. */
export function Filterleiste<T extends string>({
  label,
  eintraege,
  aktiv,
  hrefFuer,
  onWaehle,
}: {
  label: string;
  eintraege: FilterEintrag<T>[];
  aktiv: T;
  hrefFuer: (wert: T) => string;
  onWaehle: (wert: T) => void;
}) {
  return (
    <nav aria-label={label} className={css.filter}>
      {eintraege.map((e) => (
        <a
          key={e.wert}
          href={hrefFuer(e.wert)}
          className={css.filterKnopf}
          aria-current={e.wert === aktiv ? "page" : undefined}
          onClick={(ev) => einfacherKlick(ev, () => onWaehle(e.wert))}
        >
          {e.label}
          <span className={css.filterZahl}>{e.zahl}</span>
        </a>
      ))}
    </nav>
  );
}

/**
 * Kopfzeile links und rechts über einem Maßbalken (`anteil` in Prozent).
 * `className` hängt eine eigene Klasse an (die Lage stellt damit den Kopf am
 * Handy untereinander); ohne bleibt alles wie im Gründungsradar.
 */
export function Fortschritt({ links, rechts, anteil, label, className }: { links: string; rechts: string; anteil: number; label: string; className?: string }) {
  return (
    <div className={klassen(css.fortschritt, className)}>
      <div className={css.fortschrittKopf}>
        <Besch>{links}</Besch>
        <Besch stark>{rechts}</Besch>
      </div>
      <Massbalken anteil={anteil} untergrund="papier" label={label} />
    </div>
  );
}

/** `inKarte`: Liste sitzt in einer Karte mit Rahmen und läuft am Handy nicht randlos. */
export function Liste({ label, inKarte = false, children }: { label: string; inKarte?: boolean; children: React.ReactNode }) {
  return (
    <ul className={inKarte ? `${css.liste} ${css.listeInKarte}` : css.liste} aria-label={label}>
      {children}
    </ul>
  );
}

export function Gruppe({ titel, zahl }: { titel: string; zahl: number }) {
  return (
    <li className={css.gruppe} aria-hidden="false">
      <Besch>{titel}</Besch>
      <Besch>{zahl}</Besch>
    </li>
  );
}

/** Gruppenkopf mit den Zeilen darunter, ohne eigenes Element. */
export function GruppeBlock({ titel, zahl, children }: { titel: string; zahl: number; children: React.ReactNode }) {
  return (
    <>
      <Gruppe titel={titel} zahl={zahl} />
      {children}
    </>
  );
}

/**
 * Listenzeile als echter Link; ein einfacher Klick wählt ohne Neuladen. Die
 * gewählte Zeile ist weiß mit 2-px-Innenlinie, kein Farbbalken. `nachLink`
 * steht neben dem Link (etwa „Rückgängig“ mit WERKPLAN_FLAECHE.textlink und
 * .zeileRueck), damit keine Links verschachtelt werden.
 */
export function Listenzeile({
  id,
  href,
  aktiv,
  titel,
  unter,
  unterIcon,
  unterArt,
  rechts,
  gedimmt = false,
  nachLink,
  onWaehle,
  className,
}: {
  id: string;
  href: string;
  aktiv: boolean;
  titel: string;
  unter: string;
  unterIcon?: React.ReactNode;
  unterArt?: "warn" | "haken";
  rechts?: React.ReactNode;
  gedimmt?: boolean;
  nachLink?: React.ReactNode;
  onWaehle: (id: string) => void;
  className?: string;
}) {
  return (
    <li className={css.zeileLi}>
      <a
        id={`zeile-${id}`}
        href={href}
        className={klassen(css.zeile, gedimmt && css.zeileGedimmt, className)}
        aria-current={aktiv ? "true" : undefined}
        onClick={(e) => einfacherKlick(e, () => onWaehle(id))}
      >
        <span className={css.zeileText}>
          <span className={css.zeileTitel}>{titel}</span>
          <span className={klassen(css.zeileUnter, unterArt === "warn" && css.zeileUnterWarn, unterArt === "haken" && css.zeileUnterHaken)}>
            {unterIcon}
            <span className={css.zeileUnterText}>{unter}</span>
          </span>
        </span>
        {rechts ? <span className={css.zeileRechts}>{rechts}</span> : null}
      </a>
      {nachLink}
    </li>
  );
}
