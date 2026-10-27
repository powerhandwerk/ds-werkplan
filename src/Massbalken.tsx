import css from "./werkplan.module.css";

/**
 * Maßbalken des DS Werkplan 2.0 (ADR-261): Maßlinie mit Endstrichen; die Lime-Füllung zeigt `anteil` Prozent der Länge
 * (auf 0 bis 100 geklemmt). Die viewBox ist 100 Einheiten breit, damit der
 * Anteil direkt die Breite der Füllung ist; `preserveAspectRatio="none"` zieht
 * sie auf die volle Breite des Elternteils, die Striche bleiben 1 px
 * (`vectorEffect`). Maße und Farben stehen in werkplan.module.css.
 */
export function Massbalken({
  anteil,
  untergrund,
  label,
}: {
  anteil: number;
  untergrund: "nacht" | "papier";
  label?: string;
}) {
  const breite = Number.isFinite(anteil) ? Math.min(100, Math.max(0, anteil)) : 0;
  const zugang = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };
  return (
    <svg
      className={`${css.massbalken} ${untergrund === "papier" ? css.aufPapier : css.aufNacht}`}
      viewBox="0 0 100 14"
      preserveAspectRatio="none"
      focusable="false"
      {...zugang}
    >
      <line className={css.massbalkenLinie} x1="0" y1="7" x2="100" y2="7" vectorEffect="non-scaling-stroke" />
      <line className={css.massbalkenLinie} x1="0" y1="1" x2="0" y2="13" vectorEffect="non-scaling-stroke" />
      <line className={css.massbalkenLinie} x1="100" y1="1" x2="100" y2="13" vectorEffect="non-scaling-stroke" />
      {breite > 0 ? (
        <rect
          className={css.massbalkenFuellung}
          x="0"
          y="4"
          width={breite}
          height="6"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
    </svg>
  );
}
