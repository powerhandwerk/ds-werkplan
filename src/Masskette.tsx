import css from "./werkplan.module.css";

/** Lage der Linien und Füllungen in viewBox-Einheiten (0 bis 100). */
export interface MassketteGeometrie {
  /** Lime-Füllungen, je eine für jede Folge geprüfter Positionen. */
  fuellungen: { x: number; breite: number }[];
  /** Kurze Teilstriche zwischen zwei Positionen desselben Abschnitts. */
  teilungen: number[];
  /** Lange Trennstriche zwischen zwei Abschnitten. */
  trenner: number[];
}

/**
 * Rechnet die Maßkette aus: jede Position ist ein gleich langes Teilstück,
 * `gruppen` sind die Abschnitte (z. B. Blatt 01 und Blatt 02), jeder Eintrag
 * sagt, ob die Position geprüft ist. Rein und ohne DOM, damit der Test die
 * Geometrie direkt prüft.
 */
export function massketteGeometrie(gruppen: readonly (readonly boolean[])[]): MassketteGeometrie {
  const gesamt = gruppen.reduce((summe, g) => summe + g.length, 0);
  const geo: MassketteGeometrie = { fuellungen: [], teilungen: [], trenner: [] };
  if (gesamt === 0) return geo;
  const teil = 100 / gesamt;
  let versatz = 0;
  gruppen.forEach((gruppe, gi) => {
    if (gi > 0 && gruppe.length > 0 && versatz > 0) geo.trenner.push(versatz * teil);
    let start: number | null = null;
    gruppe.forEach((geprueft, i) => {
      if (i > 0) geo.teilungen.push((versatz + i) * teil);
      if (geprueft && start === null) start = i;
      const endeDerFolge = !geprueft || i === gruppe.length - 1;
      if (start !== null && endeDerFolge) {
        const bis = geprueft ? i + 1 : i;
        geo.fuellungen.push({ x: (versatz + start) * teil, breite: (bis - start) * teil });
        start = null;
      }
    });
    versatz += gruppe.length;
  });
  return geo;
}

/**
 * Maßkette als Prüfstand (DS Werkplan 2.0, ADR-261; Entwurf „Plan-Blatt“): die
 * Maßlinie des Maßbalkens (./Massbalken.tsx) mit
 * einem Teilstrich je Position und einem langen Trennstrich zwischen den
 * Abschnitten; Lime füllt, was geprüft ist. `preserveAspectRatio="none"` zieht
 * die viewBox auf die volle Breite, die Striche bleiben 1 px (`vectorEffect`).
 */
export function Masskette({ gruppen, label }: { gruppen: readonly (readonly boolean[])[]; label: string }) {
  const geo = massketteGeometrie(gruppen);
  const strich = (x: number, kurz: boolean) => (
    <line
      key={`${kurz ? "t" : "s"}${x}`}
      className={kurz ? `${css.massbalkenLinie} ${css.teilung}` : css.massbalkenLinie}
      x1={x}
      y1={kurz ? 4 : 1}
      x2={x}
      y2={kurz ? 10 : 13}
      vectorEffect="non-scaling-stroke"
    />
  );
  return (
    <svg
      className={`${css.massbalken} ${css.aufPapier}`}
      viewBox="0 0 100 14"
      preserveAspectRatio="none"
      focusable="false"
      role="img"
      aria-label={label}
    >
      <line className={css.massbalkenLinie} x1="0" y1="7" x2="100" y2="7" vectorEffect="non-scaling-stroke" />
      {strich(0, false)}
      {strich(100, false)}
      {geo.fuellungen.map((f) => (
        <rect
          key={`f${f.x}`}
          className={css.massbalkenFuellung}
          x={f.x}
          y="4"
          width={f.breite}
          height="6"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {geo.trenner.map((x) => strich(x, false))}
      {geo.teilungen.map((x) => strich(x, true))}
    </svg>
  );
}
