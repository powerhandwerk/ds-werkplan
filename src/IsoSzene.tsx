"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Knoten } from "./iso";
import { IsoKnoten } from "./IsoKnoten";
import pal from "./isopalette.module.css";
import { GRAFIK } from "./tokens";
import w from "./werkplan.module.css";

/**
 * Zeichnung für `IsoSzene`, nur serialisierbare Daten: So kann eine
 * Server-Komponente sie rechnen (etwa mit `explosionProfil`) und an die
 * Client-Komponente geben.
 */
export type IsoZeichnung = {
  viewBox: string;
  knoten: readonly (Knoten | string)[];
  /** Klasse der Zeichnung aus ihrem CSS-Modul; steht neben der Palette am SVG. */
  klasse?: string;
  /** CSS-Variablen am SVG, etwa die Filter-URLs mit dem Präfix des Verbrauchers. */
  stil?: Readonly<Record<string, string>>;
};

export type IsoSzeneProps = {
  zeichnung: IsoZeichnung;
  /** So viele Stufen rasten nacheinander ein (`data-stand` 0 bis `stufen`). */
  stufen: number;
  /** Was die Grafik zeigt, für Vorleser (`aria-label`). Pflicht. */
  beschreibung: string;
  /** Unterschrift unter der Zeichnung. */
  unterschrift?: ReactNode;
  /** Hebt eine Stufe hervor (`data-fokus`), ohne den Ablauf zu ändern. */
  fokus?: number;
  className?: string;
};

/**
 * Ablauf der Iso-Szene (Stil B): Zeichnung auf Nacht, die Stufe für Stufe
 * einrastet. Das Server-HTML zeigt `data-stand="0"`. Ist die Zeichnung zum
 * Anteil `GRAFIK.isoStartAnteil` im Bild, rastet einmal Stufe 1 bis
 * `stufen` im Takt `GRAFIK.isoTaktMs` ein. Bei reduzierter Bewegung, ohne
 * `matchMedia` oder ohne `IntersectionObserver` stehen sofort alle Stufen.
 *
 * Eindeutige Filter-IDs liefert der Verbraucher beim Rechnen der Zeichnung
 * über ihr `idPraefix` (im Client per `useSvgPraefix`).
 */
export function IsoSzene({ zeichnung, stufen, beschreibung, unterschrift, fokus, className }: IsoSzeneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [stand, setStand] = useState(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduziert = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (reduziert || typeof window.matchMedia !== "function" || typeof IntersectionObserver === "undefined") {
      setStand(stufen);
      return;
    }
    const timer: number[] = [];
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        if (!eintraege.some((e) => e.isIntersecting && e.intersectionRatio >= GRAFIK.isoStartAnteil)) return;
        beobachter.disconnect();
        for (let i = 1; i <= stufen; i++) {
          timer.push(window.setTimeout(() => setStand(i), (i - 1) * GRAFIK.isoTaktMs));
        }
      },
      { threshold: GRAFIK.isoStartAnteil },
    );
    beobachter.observe(svg);
    return () => {
      beobachter.disconnect();
      for (const t of timer) window.clearTimeout(t);
    };
  }, [stufen]);

  return (
    <figure className={className ? `${pal.buehne} ${className}` : pal.buehne}>
      <svg
        ref={svgRef}
        className={zeichnung.klasse ? `${pal.palette} ${zeichnung.klasse}` : pal.palette}
        viewBox={zeichnung.viewBox}
        data-stand={Math.min(stand, stufen)}
        data-fokus={fokus}
        role="img"
        aria-label={beschreibung}
        style={zeichnung.stil as CSSProperties | undefined}
      >
        <IsoKnoten knoten={zeichnung.knoten} />
      </svg>
      {unterschrift ? <figcaption className={w.beschriftung}>{unterschrift}</figcaption> : null}
    </figure>
  );
}
