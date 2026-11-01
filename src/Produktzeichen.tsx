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
 * Isometrisches Produktzeichen mit genau einem Lime-Motiv, im Ruhezustand ohne
 * Bewegung. Rendert auf dem Server; Farben und Strichstärken kommen aus
 * `produktzeichen.module.css`.
 */
export function Produktzeichen({ name, untergrund = "papier", groesse = 64, titel, className }: ProduktzeichenProps) {
  const { viewBox, markup } = produktzeichenDaten(name);
  const klassen = [css.zeichen, css[untergrund], css[optischeGroesse(groesse)], className].filter(Boolean).join(" ");
  const zugang = titel ? { role: "img", "aria-label": titel } : { "aria-hidden": true as const };
  return (
    <svg className={klassen} width={groesse} height={groesse} viewBox={viewBox} fill="none" focusable="false" {...zugang}>
      <g dangerouslySetInnerHTML={{ __html: markup }} />
    </svg>
  );
}
