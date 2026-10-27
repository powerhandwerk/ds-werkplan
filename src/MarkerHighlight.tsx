// Marker des DS Werkplan 2.0 (ADR-261): die Lime-Fläche hinter einem Wort,
// dieselbe Form wie die Pille im Logo.
import React from "react";

import { PILLE_FAKTOR } from "./tokens";

/**
 * Überstand und Rundung der Lime-Fläche, in em der Schriftgröße des markierten
 * Wortes. Die Voreinstellung GEOMETRY_DEFAULT ist die am Logo VERMESSENE
 * Geometrie (Wegweiser `CLAUDE.md` im keteso-Repo, „Die Marker-Geometrie ist
 * vermessen“): die Fläche ist dieselbe Form wie die Pille im Logo, die Werte
 * hängen an der Versalhöhe von Big Shoulders Display (0,800em) — der Schrift
 * aller Marker-Stellen. Sie tragen nur, weil die Komponente ihren Kasten auf
 * `line-height: 1` festnagelt; Aufrufer brauchen dafür nichts zu tun.
 */
export interface MarkerGeometry {
  /** Oberkante der Fläche, negativ = Überstand über den Kasten hinaus. */
  top: string;
  /** Unterkante der Fläche, negativ = Überstand nach unten. */
  bottom: string;
  /** Seitlicher Überstand links und rechts (negativ). Nie zusätzlich padding. */
  side: string;
  /** Festes em-Maß: 0,433 × Flächenhöhe. Nie Prozent (bezöge sich auf die
   *  Breite) und nie --radius-marker (999px = volle Pille, sichtbar zu rund). */
  radius: string;
}

/**
 * Die vier CSS-Werte sind KEINE freien Zahlen, sondern fallen aus den Metriken
 * von Big Shoulders Display und der Messtabelle heraus (WB-af6cfb14, 13.08.2026).
 * Die Herleitung steht bei MARKER_CAP_HEIGHT_EM; `markerGeometry()` rechnet sie
 * aus, der Test hält beide Seiten aneinander.
 */
export const GEOMETRY_DEFAULT: MarkerGeometry = {
  top: "-0.072em",
  bottom: "-0.030em",
  side: "-0.232em",
  radius: "0.477em",
};

/** CD-Neigung der Marker-Fläche (CSS-Vorzeichen: negativ = steigt nach rechts
 *  an; in PDF/Canvas kippt dasselbe Vorzeichen andersherum, siehe
 *  Design-Referenz). Marke, kein Parameter. */
export const MARKER_TILT_DEG = -3.96;

/** Rundung der Logo-Pille: 0,433 × Flächenhöhe (rx=21.7 bei height=50.1).
 *  Die volle Pille (--radius-marker, 999px = 50 %) ist sichtbar zu rund. */
export const MARKER_RADIUS_FACTOR = PILLE_FAKTOR;

/** Luft über der Versal-Oberkante, × Versalhöhe. */
export const MARKER_CLEARANCE_TOP = 0.196;

/** Luft unter der Grundlinie, × Versalhöhe. Mehr Hub dürfen die Enden der Fläche
 *  nicht bekommen, sonst schneidet sie die Buchstaben an. */
export const MARKER_CLEARANCE_BOTTOM = 0.173;

/** Luft links und rechts, × Versalhöhe. Steckt allein im Überstand der Fläche. */
export const MARKER_CLEARANCE_SIDE = 0.288;

/**
 * Oberkante der Versalien von Big Shoulders Display, in em unter der
 * Kastenoberkante gerechnet ab der Grundlinie.
 *
 * GEMESSEN, nicht geschätzt (WB-af6cfb14): `OS/2.sCapHeight` = 1600 bei
 * `head.unitsPerEm` = 2000, identisch in der woff2 des DS und in der 700er-TTF;
 * die Ink-Bounding-Box von „H" reicht in beiden Dateien von 0 bis 1600. Bis
 * 13.08.2026 stand hier überall 0,81em — daraus war die gesamte Messtabelle
 * zurückgerechnet, also war jeder abgeleitete CSS-Wert falsch.
 */
export const MARKER_CAP_HEIGHT_EM = 0.8;

/**
 * Unterkante der Rundungsüberschüsse, in em unter der Grundlinie.
 *
 * Ink-Bounding-Box der Glyphen von „handwerk" in der DS-woff2: „h", „d", „k"
 * reichen bis 0,800em hinauf, „a", „d", „e" bis -0,005em hinunter. Das ist der
 * Überschuss der runden Formen.
 */
export const MARKER_OVERSHOOT_EM = 0.005;

/**
 * Die Bezugsgröße der Messtabelle, in em.
 *
 * ACHTUNG, hier steckt die Falle, die WB-af6cfb14 ausgelöst hat: „Versalhöhe"
 * meint im keteso-Wegweiser `CLAUDE.md` NICHT die Cap-Height der
 * Schrift, sondern die **Bounding-Box des Wortes** — Oberkante Versal bis
 * Unterkante der Rundungsüberschüsse. Am Logo gemessen: `13.79 … 50.39` = 36,60
 * Einheiten, nicht bis zur geometrischen Grundlinie der geraden Stämme
 * (`49.77`). Alle sechs Werte der Tabelle stehen in dieser Konvention.
 *
 * Wer stattdessen mit der Cap-Height rechnet, bekommt eine um 0,6 % zu kleine
 * Fläche und verfehlt die Gegenprobe (Überhöhung 35,4 % statt der geforderten
 * 36,9 %) — genau daran hängt der Unterschied zwischen `bottom: -0.024em` und
 * `bottom: -0.030em`.
 */
export const MARKER_REFERENCE_HEIGHT_EM = MARKER_CAP_HEIGHT_EM + MARKER_OVERSHOOT_EM;

/**
 * Abstand Kastenoberkante → Grundlinie bei `line-height: 1`, in em.
 *
 * Ebenfalls aus der Schriftdatei: hhea = typo = +0,984 / -0,213 em, und
 * `fsSelection` Bit 7 (USE_TYPO_METRICS) ist gesetzt, also gilt der Halbdurchschuss
 * `(1 − 1,197) / 2`. Grundlinie = 0,984 − 0,0985 = 0,8855em. Bis 13.08.2026
 * stand hier 0,856em.
 */
export const MARKER_BASELINE_EM = 0.8855;

/** Höhe der Fläche, × Versalhöhe — Summe der drei senkrechten Anteile. */
export const MARKER_AREA_HEIGHT = 1 + MARKER_CLEARANCE_TOP + MARKER_CLEARANCE_BOTTOM;

/**
 * Rechnet die vier CSS-Werte aus den Metriken oben aus. Bezugsrahmen ist die
 * 1em-Box des markierten Wortes (deshalb `line-height: 1` am Marker-Element),
 * Bezugsgröße der Faktoren ist MARKER_REFERENCE_HEIGHT_EM:
 *
 *   top    = Grundlinie − Versal-Oberkante − Bezug · Luft oben
 *   bottom = 1em − (Grundlinie + Überschuss + Bezug · Luft unten)
 *   side   = Bezug · Luft seitlich
 *   radius = 0,433 · Flächenhöhe
 *
 * Existiert, damit GEOMETRY_DEFAULT nachprüfbar bleibt statt nur behauptet.
 */
export function markerGeometry(): MarkerGeometry {
  const em = (value: number) => `${value.toFixed(3)}em`;
  const bezug = MARKER_REFERENCE_HEIGHT_EM;
  return {
    top: em(MARKER_BASELINE_EM - MARKER_CAP_HEIGHT_EM - bezug * MARKER_CLEARANCE_TOP),
    bottom: em(1 - (MARKER_BASELINE_EM + MARKER_OVERSHOOT_EM + bezug * MARKER_CLEARANCE_BOTTOM)),
    side: em(-bezug * MARKER_CLEARANCE_SIDE),
    radius: em(MARKER_RADIUS_FACTOR * MARKER_AREA_HEIGHT * bezug),
  };
}

/** Mittlere Versalbreite je Zeichen, × Versalhöhe. Die Schrift ist stark
 *  kondensiert; 0,52 trifft sie gut genug für eine Breitenschätzung, die eine
 *  Server-Komponente nicht messen kann. */
export const MARKER_CHAR_WIDTH = 0.52;

/** Sicherheitsmarge auf den zulässigen Hub. */
const LIFT_MARGIN = 0.85;

/**
 * Wie viel Grad darf der Marker hinter DIESEM Wort kippen?
 *
 * Die einzige Neigungsrechnung im Haus (WB-8a5b45b3). Die Neigung hebt die Enden der Fläche um
 * `(Breite/2) · sin(Winkel)`; überschreitet dieser Hub die Luft unter der
 * Grundlinie, schneidet die Fläche die Buchstaben an. Also
 * `Winkel = min(3,96°, asin(2 · 0,85 · Luft / Breite))`.
 *
 * Bezugsgröße ist die FLÄCHENbreite, nicht die Wortbreite: der Hub entsteht an
 * den Enden der Fläche, und die stehen um die seitliche Luft über dem Wort.
 * Alles in Versalhöhen, die em-Umrechnung kürzt sich weg.
 *
 * Kurze Wörter (bis 7 Zeichen) bekommen die vollen -3,96°, lange automatisch
 * weniger. Noch besser als flacher neigen ist ein kürzeres Wort.
 */
export function markerTiltDeg(word: string): number {
  const chars = word.trim().length;
  if (chars === 0) return MARKER_TILT_DEG;
  const areaWidth = chars * MARKER_CHAR_WIDTH + 2 * MARKER_CLEARANCE_SIDE;
  const headroom = (2 * LIFT_MARGIN * MARKER_CLEARANCE_BOTTOM) / areaWidth;
  // Bei sehr kurzen Wörtern liegt das Argument über 1 — dann greift ohnehin die
  // größte erlaubte Neigung.
  const degrees = headroom >= 1 ? 90 : (Math.asin(headroom) * 180) / Math.PI;
  return -Math.min(Math.abs(MARKER_TILT_DEG), Math.round(degrees * 100) / 100);
}

export interface MarkerHighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /** Explizite Neigung in Grad; ohne Angabe gilt die CD-Neigung -3,96° mit
   *  automatischer Abflachung bei langen Wörtern. */
  rotate?: number;
  animate?: boolean;
  color?: string;
  geometry?: MarkerGeometry;
}

/**
 * MarkerHighlight: leicht geneigte Lime-Fläche hinter genau EINEM Wort; die
 * Schrift darauf ist immer dunkel.
 */
export function MarkerHighlight({
  children,
  rotate,
  animate = false,
  color,
  geometry = GEOMETRY_DEFAULT,
  style,
  ...rest
}: MarkerHighlightProps) {
  // Bei nicht-String-Children lässt sich die Breite nicht schätzen — dann bleibt
  // es bei der vollen CD-Neigung.
  const angle = rotate ?? (typeof children === "string" ? markerTiltDeg(children) : MARKER_TILT_DEG);
  return (
    <span
      // lineHeight steht NACH dem Spread: die Geometrie hängt an line-height 1,
      // ein Aufrufer-Override würde sie lautlos brechen. Abweichende Geometrie
      // läuft über das geometry-Prop, nicht über die Zeilenhöhe.
      style={{ position: "relative", display: "inline-block", isolation: "isolate", ...style, lineHeight: 1 }}
      {...rest}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: geometry.side,
          right: geometry.side,
          top: geometry.top,
          bottom: geometry.bottom,
          transform: `rotate(${angle}deg)`,
          // Drehpunkt ist die MITTE, wie im DS-Original (.ds-staging-3c4926).
          // Die Neigungs-Budgetierung (markerTiltDeg) rechnet mit
          // Hub = (Breite/2)·sin(Winkel) je Ende — um die linke Kante gedreht
          // wäre der Hub rechts doppelt so groß und schnitte die Buchstaben an.
          transformOrigin: "center",
          zIndex: -1,
          overflow: "hidden",
          borderRadius: geometry.radius,
        }}
      >
        <span
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            background: color || "var(--lime)",
            transformOrigin: "left center",
            animation: animate
              ? "marker-wisch var(--dur-marker, 520ms) var(--ease-marker, cubic-bezier(0.22,0.61,0.36,1)) both"
              : "none",
          }}
        />
      </span>
      <span style={{ position: "relative", color: "var(--ink-950)" }}>{children}</span>
    </span>
  );
}
