import { LOGO_INHALT, MESSLATTE_WORT, messlatteZeichen, schriftzugGeometrie } from "./messlatte-schriftzug";
import css from "./messlatte-schriftzug.module.css";
import { Produktzeichen, produktzeichenKlassen } from "./Produktzeichen";
import type { Untergrund } from "./tokens";

export type MesslatteSchriftzugProps = {
  /** Untergrund, auf dem der Schriftzug steht. Standard: Papier. */
  untergrund?: Untergrund;
  /** Logo über dem Wort; ab Versalhöhe 32 px, darunter fällt es weg. Standard: ohne. */
  mitLogo?: boolean;
  /** Versalhöhe X des Wortes in px; unter 20 px steht nur das Zeichen. Standard: 40. */
  versalhoehe?: number;
  /** Zugänglicher Name. Standard: „Messlatte“, mit Logo „powerhandwerk Messlatte“. */
  titel?: string;
  className?: string;
};

/** Optische Größe des Zeichens im Schriftzug: wie im Markenblatt, dort mit 96 px gerechnet. */
const ZEICHEN_OPTISCH = 96;

/**
 * Schriftzug des Standards „Messlatte“: das Produktzeichen ohne Boden, daneben
 * MESSLATTE als Pfad, auf Wunsch das Logo darüber; Schutzzone ½ X rundum.
 * Rendert auf dem Server, ohne Zustand; kein Text im Bild, der Name steht im
 * `aria-label`.
 */
export function MesslatteSchriftzug({ untergrund = "papier", mitLogo = false, versalhoehe = 40, titel, className }: MesslatteSchriftzugProps) {
  const g = schriftzugGeometrie({ versalhoehe, mitLogo, untergrund });
  const name = titel ?? (g.mitLogo ? "powerhandwerk Messlatte" : "Messlatte");
  if (g.nurZeichen) {
    return <Produktzeichen name="messlatte" untergrund={untergrund} groesse={g.groesse} titel={name} className={className} />;
  }
  const klassen = [css.schriftzug, css[untergrund], className].filter(Boolean).join(" ");
  return (
    <svg className={klassen} width={g.breite} height={g.hoehe} viewBox={g.viewBox} fill="none" focusable="false" role="img" aria-label={name} data-mit-logo={String(g.mitLogo)}>
      <g
        className={produktzeichenKlassen(untergrund, ZEICHEN_OPTISCH)}
        transform={g.zeichen.transform}
        dangerouslySetInnerHTML={{ __html: messlatteZeichen().markup }}
      />
      <path className={css.wort} transform={g.wort.transform} d={MESSLATTE_WORT.d} />
      {g.logo ? (
        <svg
          x={g.logo.x}
          y={g.logo.y}
          width={g.logo.breite}
          height={g.logo.hoehe}
          viewBox={LOGO_INHALT[g.logo.variante].viewBox}
          dangerouslySetInnerHTML={{ __html: LOGO_INHALT[g.logo.variante].inhalt }}
        />
      ) : null}
    </svg>
  );
}
