import type React from "react";
import type { Paket } from "./abo-icon";
import { Etikett } from "./Bausteine";
import { AboIcon } from "./icons";
import css from "./paketkarten.module.css";
import { Produktzeichen } from "./Produktzeichen";
import type { ProduktzeichenName } from "./produktzeichen-verzeichnis";
import type { Untergrund } from "./tokens";
import { PAKET_LAUFZEITEN, PAKETKARTEN_TEXTE, type PaketkartenTexte } from "./standards";
import w from "./werkplan.module.css";

/** Laufzeit in Monaten. */
export type PaketLaufzeit = 12 | 24;

/** Grund, auf dem eine Karte steht. */
export type PaketGrund = Untergrund;

/** Preis einer Laufzeit, fertig formatiert vom Verbraucher. Der Baustein rechnet nichts. */
export type PaketPreis = { betrag: string; einheit: string; zusatz?: string };

/** Eine Leistung der Liste: Produktzeichen (dekorativ), Titel und Text. */
export type PaketReihe = { zeichen: ProduktzeichenName; titel: string; text: React.ReactNode };

export type Paketkarte = {
  /** Paket, zugleich Emblem und Name. */
  paket: Paket;
  /** Nutzen-Satz; das markierte Wort setzt der Verbraucher mit <Unterstrich>. */
  nutzen: React.ReactNode;
  fuerWen: React.ReactNode;
  preis: Record<PaketLaufzeit, PaketPreis>;
  /** Abschnittslabel über der Liste. */
  label: string;
  reihen: PaketReihe[];
  /** Knopf unter dem Preis; bekommt den Grund seiner Karte, die Empfehlung steht im Gegenton. */
  aktion?: (grund: PaketGrund) => React.ReactNode;
};

export type PaketkartenProps = {
  karten: Paketkarte[];
  /** Diese Karte trägt Etikett, Lime-Rahmen und Gegenton. */
  empfohlen?: Paket;
  /** Fläche unter den Karten. Standard: Papier. */
  untergrund?: PaketGrund;
  /** Nur wenn gesetzt, trägt der Baustein data-laufzeit; sonst gilt ein Vorfahr oder 24. */
  laufzeit?: PaketLaufzeit;
  texte?: Partial<PaketkartenTexte>;
};

/** Zeilen je Karte im Raster: Kopf, Nutzen, Für-wen, Preis, Label, Liste. */
const GRUNDZEILEN = 6;

/**
 * Abokacheln Variante D (Flo 01.11.2026): je Paket Emblem und Name, Nutzen,
 * Für-wen, Preis beider Laufzeiten, Zusatz und Aktion, Abschnittslabel und die
 * Liste mit Produktzeichen. Rendert auf dem Server; die Laufzeit wählt ein
 * Vorfahr mit data-laufzeit (LaufzeitBereich) oder die Prop `laufzeit`.
 * Jede Karte rendert jeden Rasterplatz, leer wenn ihr der Inhalt fehlt, damit
 * Label und Liste aller Karten auf einer Linie stehen, auch beim Umschalten.
 */
export function Paketkarten({ karten, empfohlen, untergrund = "papier", laufzeit, texte }: PaketkartenProps) {
  const t = { ...PAKETKARTEN_TEXTE, ...texte };
  const mitZusatz = karten.some((karte) => PAKET_LAUFZEITEN.some((monate) => Boolean(karte.preis[monate].zusatz)));
  const mitAktion = karten.some((karte) => karte.aktion !== undefined);
  const zeilen = GRUNDZEILEN + (mitZusatz ? 1 : 0) + (mitAktion ? 1 : 0);
  const gegenton: PaketGrund = untergrund === "papier" ? "nacht" : "papier";

  return (
    <div className={css.paketkarten} style={{ "--pk-zeilen": zeilen } as React.CSSProperties} data-laufzeit={laufzeit}>
      <div className={css.raster}>
        {karten.map((karte) => {
          const istEmpfohlen = karte.paket === empfohlen;
          const grund = istEmpfohlen ? gegenton : untergrund;
          const klassen = [
            css.karte,
            istEmpfohlen && css.empfohlen,
            istEmpfohlen && (gegenton === "nacht" ? `${css.nachtKarte} ${w.aufNacht}` : `${css.papierKarte} ${w.aufPapier}`),
          ]
            .filter(Boolean)
            .join(" ");
          const name = (istEmpfohlen ? t.karteEmpfohlen : t.karte).replace("{paket}", karte.paket);
          return (
            <section key={karte.paket} className={klassen} aria-label={name}>
              {istEmpfohlen && <Etikett className={css.etikett}>{t.empfehlung}</Etikett>}
              <div className={css.links}>
                <div className={css.kopf}>
                  <AboIcon paket={karte.paket} size={28} />
                  <h3 className={css.name}>{karte.paket}</h3>
                </div>
                <p className={css.nutzen}>{karte.nutzen}</p>
                <p className={css.wer}>{karte.fuerWen}</p>
                <div className={css.preis}>
                  {PAKET_LAUFZEITEN.map((monate) => (
                    <span key={monate} className={css.preisLaufzeit} data-nur={monate}>
                      <span className={css.mess}>{karte.preis[monate].betrag}</span>
                      <span className={css.einheit}>{karte.preis[monate].einheit}</span>
                    </span>
                  ))}
                </div>
                {mitZusatz && (
                  <p className={css.zusatz}>
                    {PAKET_LAUFZEITEN.map((monate) => {
                      const zusatz = karte.preis[monate].zusatz;
                      return zusatz ? (
                        <span key={monate} data-nur={monate}>
                          {zusatz}
                        </span>
                      ) : null;
                    })}
                  </p>
                )}
                {mitAktion && <div className={css.aktion}>{karte.aktion?.(grund)}</div>}
              </div>
              <div className={css.rechts}>
                <p className={css.label}>{karte.label}</p>
                <ul className={css.liste}>
                  {karte.reihen.map((reihe, index) => (
                    <li key={`${index}-${reihe.titel}`} className={css.reihe}>
                      <Produktzeichen name={reihe.zeichen} untergrund={grund} groesse={44} />
                      <div>
                        <p className={css.titel}>{reihe.titel}</p>
                        <p className={css.text}>{reihe.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
