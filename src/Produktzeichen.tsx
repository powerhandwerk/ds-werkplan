import { optischeGroesse, produktzeichenDaten, type ProduktzeichenName } from "./produktzeichen-verzeichnis";
import css from "./produktzeichen.module.css";
import type { Untergrund } from "./tokens";

export type ProduktzeichenProps = {
  name: ProduktzeichenName;
  /** Untergrund, auf dem das Zeichen steht. Standard: Papier. */
  untergrund?: Untergrund;
  /** Kantenlänge in px. Bestimmt auch die optische Größe (Strichstärken). Standard: 64. */
  groesse?: number;
  /**
   * Zugänglicher Name, wenn das Zeichen allein steht. Ohne `titel` ist es
   * dekorativ und der Name steht daneben (Vorschlag: `PRODUKTZEICHEN[name].titel`).
   */
  titel?: string;
  className?: string;
};

/**
 * Klassen eines Produktzeichens: Wurzel, Untergrund, optische Größe aus
 * `groesse`, `flach` an der flachen Fassung. Auch der Schriftzug der Messlatte
 * setzt sie an sein Zeichen.
 */
export function produktzeichenKlassen(untergrund: Untergrund, groesse: number, flach?: boolean, className?: string): string {
  return [css.zeichen, css[untergrund], css[optischeGroesse(groesse)], flach && css.flach, className].filter(Boolean).join(" ");
}

/**
 * Isometrisches Produktzeichen mit genau einem Lime-Motiv, im Ruhezustand ohne
 * Bewegung. Rendert auf dem Server; Farben und Strichstärken kommen aus
 * `produktzeichen.module.css`. Ein Zeichen mit flacher Fassung (`messlatte`)
 * steht unter 40 px flach im 24er-Raster, mit der Klasse `flach`.
 */
export function Produktzeichen({ name, untergrund = "papier", groesse = 64, titel, className }: ProduktzeichenProps) {
  const { viewBox, markup, flach } = produktzeichenDaten(name, groesse);
  const klassen = produktzeichenKlassen(untergrund, groesse, flach, className);
  const zugang = titel ? { role: "img", "aria-label": titel } : { "aria-hidden": true as const };
  return (
    <svg className={klassen} width={groesse} height={groesse} viewBox={viewBox} fill="none" focusable="false" {...zugang}>
      <g dangerouslySetInnerHTML={{ __html: markup }} />
    </svg>
  );
}
