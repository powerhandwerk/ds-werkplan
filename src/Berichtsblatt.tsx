import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

import { WERKPLAN_BAUSTEINE_SEITE } from "./Bausteine";
import css from "./berichtsblatt.module.css";
import { Kennzahlen, type KennzahlDaten } from "./Berichtsteile";
import { Fuss } from "./Fuss";
import { KapitelLeiste, type KapitelEintrag } from "./KapitelLeiste";
import { Logo } from "./Logo";
import { Plankopf, type PlankopfFeld } from "./Plankopf";
import { kapitelNummer } from "./standards";
import w from "./werkplan.module.css";
import { FUSS_VERSION } from "./ziele";

/**
 * Seitenhülle für Berichte, Analysen und Entscheidungsvorlagen (Vertrag
 * „Berichtsblatt“, 12.11.2026). Vorbild ist die Prüfbericht-Leseseite im Admin
 * (components/pruefbericht/): Titel auf Nacht über die volle Breite, Lesebereich
 * auf Papier mit Kapitelleiste (am Handy Chips, ab 1024 px links mitlaufend),
 * Abschluss auf Nacht. Das Blatt nummeriert seine `Position`-Kinder fortlaufend
 * und baut aus ihnen die Kapitel. Ohne eigenen Zustand; Client ist nur die
 * Kapitelleiste.
 */

export interface BerichtsblattTexte {
  /** Titel der Kapitelleiste. */
  kapitel: string;
  /** Vermerk im schmalen Fuß der Fassung „intern“. */
  vermerk: string;
  /** Kürzel vor der Nummer einer Position. */
  position: string;
}

export const BERICHTSBLATT_TEXTE: BerichtsblattTexte = {
  kapitel: "Inhalt",
  vermerk: "Internes Arbeitsblatt von powerhandwerk · nicht zur Weitergabe",
  position: "Pos.",
};

const klassen = (...teile: (string | false | null | undefined)[]) => teile.filter(Boolean).join(" ");

/** Sprungziel einer Position ohne eigene id: `pos-01`, `pos-02`, … */
const standardId = (nummer: number) => `pos-${kapitelNummer(nummer)}`;

export interface PositionProps {
  /** Kurzer Name für Kapitelleiste und Beschriftung. */
  name: string;
  /** Überschrift (`h2`). */
  titel: ReactNode;
  /** Einleitung unter der Überschrift. */
  text?: ReactNode;
  /** Sprungziel; Standard `pos-01`, `pos-02`, … */
  id?: string;
  /** Laufende Nummer; setzt das `Berichtsblatt`. */
  nummer?: number;
  /** Kürzel vor der Nummer; setzt das `Berichtsblatt` aus seinen Texten. */
  kuerzel?: string;
  children?: ReactNode;
}

/** Abschnitt im Lesebereich: Maßstrich, Beschriftung „Pos. 01 · Name“, `h2`, Lead, Inhalt. */
export function Position({ name, titel, text, id, nummer, kuerzel = BERICHTSBLATT_TEXTE.position, children }: PositionProps) {
  const anker = id ?? (nummer === undefined ? undefined : standardId(nummer));
  const titelId = anker === undefined ? undefined : `${anker}-titel`;
  return (
    <section id={anker} aria-labelledby={titelId} className={css.position}>
      <div className={css.positionKopf}>
        <div className={css.massstrich} aria-hidden="true" />
        <div className={css.positionKopfText}>
          <p className={w.beschriftung}>{nummer === undefined ? name : `${kuerzel} ${kapitelNummer(nummer)} · ${name}`}</p>
          <h2 className={klassen(w.h2, css.h2)} id={titelId}>
            {titel}
          </h2>
          {text ? <p className={w.lead}>{text}</p> : null}
        </div>
      </div>
      {children ? <div className={css.positionInhalt}>{children}</div> : null}
    </section>
  );
}

export interface BerichtsblattProps {
  /** Blattzeile im Titel, etwa „Berichtsvergleich“; auch Blatt im Fuß der Fassung „betrieb“. */
  blatt: string;
  /** Beschriftung über dem Titel. */
  art?: string;
  /** Seitentitel (`h1`), darf `Unterstrich` enthalten. */
  titel: ReactNode;
  lead?: ReactNode;
  /** Felder des Schriftfelds im Titel. */
  felder: readonly PlankopfFeld[];
  /** Kennzahlen unter dem Titel, auf Nacht. */
  kennzahlen?: readonly KennzahlDaten[];
  /** Stand, etwa „Stand 12.11.2026“. */
  stand: string;
  /** `intern`: schmaler Fuß mit Vermerk; `betrieb`: der `Fuss` in der Fassung `fokus`, Anrede Sie. */
  adressat?: "intern" | "betrieb";
  /** Kapitelleiste zeigen; Standard: ab drei Positionen. */
  kapitelleiste?: boolean;
  texte?: Partial<BerichtsblattTexte>;
  /** Nur `Position`-Elemente. */
  children?: ReactNode;
}

export function Berichtsblatt({
  blatt,
  art = "Analyse",
  titel,
  lead,
  felder,
  kennzahlen,
  stand,
  adressat = "intern",
  kapitelleiste,
  texte,
  children,
}: BerichtsblattProps) {
  const t = { ...BERICHTSBLATT_TEXTE, ...texte };
  const positionen = Children.toArray(children).filter(
    (kind): kind is ReactElement<PositionProps> => isValidElement(kind) && kind.type === Position,
  );
  const kapitel: KapitelEintrag[] = positionen.map((p, i) => ({ id: p.props.id ?? standardId(i + 1), name: p.props.name }));
  const mitLeiste = kapitelleiste ?? positionen.length >= 3;

  return (
    <div className={klassen(w.seite, WERKPLAN_BAUSTEINE_SEITE, css.blatt)} data-berichtsblatt={FUSS_VERSION}>
      <header className={klassen(w.nacht, css.titelFlaeche)}>
        <div className={css.marke}>
          <Logo variant="dark" height={24} />
          <p className={w.blattZeile}>{blatt}</p>
        </div>
        <div className={css.titelRaster}>
          <div className={css.titel}>
            <p className={w.beschriftung}>{art}</p>
            <h1 className={klassen(w.h1, css.h1)}>{titel}</h1>
            {lead ? <p className={w.lead}>{lead}</p> : null}
          </div>
          {felder.length > 0 ? (
            <div className={css.plan}>
              <Plankopf untergrund="nacht" felder={felder} />
            </div>
          ) : null}
        </div>
        {kennzahlen && kennzahlen.length > 0 ? (
          <div className={css.titelZahlen}>
            <Kennzahlen zahlen={kennzahlen} />
          </div>
        ) : null}
      </header>
      <main className={klassen(w.papier, css.lesebereich)}>
        <div className={klassen(css.leseRaster, mitLeiste && css.leseRasterMitLeiste)}>
          {mitLeiste ? (
            <div className={css.kapitelSpalte}>
              <KapitelLeiste titel={t.kapitel} kapitel={kapitel} stand={stand} />
            </div>
          ) : null}
          <div className={css.positionen}>
            {positionen.map((p, i) =>
              cloneElement(p, { id: kapitel[i]!.id, nummer: i + 1, kuerzel: t.position }),
            )}
          </div>
        </div>
      </main>
      <footer>
        {adressat === "betrieb" ? (
          <Fuss
            variante="fokus"
            anrede="sie"
            b2b={false}
            blatt={blatt}
            stand={stand.replace(/^Stand\s+/i, "")}
            basis="https://powerhandwerk.de"
          />
        ) : (
          <div className={klassen(w.nacht, css.abschluss)}>
            <Logo variant="dark" height={20} />
            <p className={w.quelle}>{t.vermerk}</p>
            <p className={w.quelle}>{stand}</p>
          </div>
        )}
      </footer>
    </div>
  );
}
