import type React from "react";

import { Etikett } from "./Bausteine";
import css from "./berichtsblatt.module.css";
import w from "./werkplan.module.css";

/**
 * Teile eines Berichtsblatts (Vertrag „Berichtsblatt“, 12.11.2026): Lauftext,
 * Tabelle, Bildbeleg, Kennzahlen, Merksatz und Spalten. Vorbild ist die
 * Prüfbericht-Leseseite im Admin (components/pruefbericht/). Server-Komponenten
 * ohne Zustand; Farben kommen aus den Rollen der Fläche (`--wp-*`), damit jedes
 * Teil auf Papier und auf Nacht lesbar bleibt.
 */

/** Klassen verbinden, leere Teile fallen weg; auch für das Berichtsblatt. */
export const klassen = (...teile: (string | false | null | undefined)[]) => teile.filter(Boolean).join(" ");

/**
 * Lauftext in der Rolle `text`: Absätze, Listen, `strong`, Links und `h3`.
 * `html` wird unverändert eingesetzt; der Inhalt kommt vom Verfasser der Seite,
 * nie von außen.
 */
export function Fliesstext({ html, children }: { html?: string; children?: React.ReactNode }) {
  if (html !== undefined) return <div className={css.fliesstext} dangerouslySetInnerHTML={{ __html: html }} />;
  return <div className={css.fliesstext}>{children}</div>;
}

/**
 * Tabelle auf `wp-blatt` mit Haarlinien. Die erste Spalte ist der Zeilenkopf.
 * Bei Überbreite rollt der Bereich waagrecht; er trägt dafür einen Namen und
 * den Tastaturfokus.
 */
export function Tabelle({
  label,
  kopf,
  zeilen,
  breiten,
  quelle,
}: {
  label: string;
  kopf: readonly string[];
  zeilen: readonly (readonly React.ReactNode[])[];
  breiten?: readonly string[];
  quelle?: string;
}) {
  return (
    <div className={css.tabelle}>
      <div className={css.tabelleRolle} role="region" aria-label={label} tabIndex={0}>
        <table className={css.tabelleInhalt}>
          {breiten ? (
            <colgroup>
              {breiten.map((breite, i) => (
                <col key={i} style={{ width: breite }} />
              ))}
            </colgroup>
          ) : null}
          <thead>
            <tr>
              {kopf.map((spalte, i) => (
                <th key={i} scope="col">
                  {spalte}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {zeilen.map((zeile, z) => (
              <tr key={z}>
                {zeile.map((zelle, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {zelle}
                    </th>
                  ) : (
                    <td key={i}>{zelle}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {quelle ? <p className={w.quelle}>{quelle}</p> : null}
    </div>
  );
}

/** Bild im Rahmen (Haarlinie, Grund `wp-blatt`, eckig, ohne Schatten), darunter Text und Quelle. */
export function Bildbeleg({
  src,
  alt,
  titel,
  text,
  quelle,
}: {
  src: string;
  alt: string;
  titel?: string;
  text?: React.ReactNode;
  quelle?: string;
}) {
  return (
    <figure className={css.bild}>
      {titel ? <p className={w.beschriftung}>{titel}</p> : null}
      <div className={css.bildRahmen}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      {text || quelle ? (
        <figcaption className={css.bildUnter}>
          {text ? <span className={css.bildText}>{text}</span> : null}
          {quelle ? <span className={w.quelle}>{quelle}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Daten einer Kennzahl: Beschriftung, Wert fertig formatiert, Klartext. */
export type KennzahlDaten = { kopf?: string; wert: React.ReactNode; text?: React.ReactNode };

const ZAHL_KLASSE = { 32: css.zahl32, 48: css.zahl48, 64: css.zahl64 } as const;

/**
 * Beschriftung, große leichte Zahl in der Rolle `messwert` und Klartext. Die
 * Farbe kommt von der Fläche (`wp-stark`), anders als beim `Messwert` mit
 * festem `ink-950`; so ist sie auch auf Nacht lesbar.
 */
export function Kennzahl({ kopf, wert, text, groesse = 48 }: KennzahlDaten & { groesse?: 32 | 48 | 64 }) {
  return (
    <div className={css.kennzahl}>
      {kopf ? <p className={w.beschriftung}>{kopf}</p> : null}
      <p className={css.kennzahlWert}>
        <span className={klassen(w.messwert, ZAHL_KLASSE[groesse])}>{wert}</span>
      </p>
      {text ? <p className={klassen(w.text, css.kennzahlText)}>{text}</p> : null}
    </div>
  );
}

/** Reihe aus Kennzahlen: zwei bis vier nebeneinander, schmal untereinander (über die eigene Breite). */
export function Kennzahlen({ zahlen }: { zahlen: readonly KennzahlDaten[] }) {
  if (zahlen.length === 0) return null;
  // Lange Werte („12 von 40“) bekommen die kleinere Stufe, damit die Reihe ruhig bleibt.
  const groesse = zahlen.some((z) => typeof z.wert === "string" && z.wert.length > 8) ? 32 : 48;
  return (
    <div className={css.kennzahlen}>
      <div className={css.kennzahlenReihe} data-anzahl={Math.min(zahlen.length, 4)}>
        {zahlen.map((z, i) => (
          <Kennzahl key={i} {...z} groesse={groesse} />
        ))}
      </div>
    </div>
  );
}

/** Hervorgehobener Satz: Etikett `lead` mit dem Label, daneben der Satz stark. Kein Seitenstreifen. */
export function Merksatz({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className={css.merksatz}>
      {label ? <Etikett art="lead">{label}</Etikett> : null}
      <p className={css.merksatzText}>{children}</p>
    </div>
  );
}

/** Spalten für Text neben Bild oder für Bildreihen; schaltet über die eigene Breite, unter 720 px untereinander. */
export function Spalten({
  anzahl = 2,
  verhaeltnis = "1:1",
  children,
}: {
  anzahl?: 2 | 3;
  verhaeltnis?: "1:1" | "2:3" | "3:2";
  children: React.ReactNode;
}) {
  return (
    <div className={css.spalten}>
      <div className={css.spaltenInnen} data-anzahl={anzahl} data-verhaeltnis={anzahl === 2 ? verhaeltnis : undefined}>
        {children}
      </div>
    </div>
  );
}
