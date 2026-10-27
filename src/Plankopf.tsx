import type React from "react";
import css from "./werkplan.module.css";

/** Ein Feld des Schriftfelds; `breit` zieht es über beide Spalten. */
export interface PlankopfFeld {
  label: string;
  /** Text oder ein Element, etwa der Paket-Chip im Monatsbericht. */
  wert: React.ReactNode;
  breit?: boolean;
}

/**
 * Schriftfeld wie auf einem Bauplan (DS Werkplan 2.0, ADR-261): Label im
 * Beschriftungsstil, Wert darunter, zwei Spalten mit 1-px-Fugen. Als <dl>,
 * damit Label und Wert auch vorgelesen zusammengehören. Felder mit leerem
 * Text fallen weg, statt leer oder erfunden dazustehen. `untergrund` wählt
 * die Farben für Papier (Standard) oder Nacht. `anhang` steht als letztes Kind
 * im <dl> und bringt seine Felder selbst mit (etwa die Zeile „Neuigkeiten“
 * der Kundenseite, die ohne Daten ganz wegfällt).
 */
export function Plankopf({
  felder,
  untergrund = "papier",
  className,
  anhang,
}: {
  felder: readonly PlankopfFeld[];
  untergrund?: "nacht" | "papier";
  className?: string;
  anhang?: React.ReactNode;
}) {
  return (
    <dl className={[css.plankopf, untergrund === "nacht" ? css.aufNacht : css.aufPapier, className].filter(Boolean).join(" ")}>
      {felder
        .filter((feld) => typeof feld.wert !== "string" || feld.wert.trim().length > 0)
        .map((feld) => (
          <div key={feld.label} className={feld.breit ? `${css.plankopfFeld} ${css.plankopfBreit}` : css.plankopfFeld}>
            <dt className={css.plankopfLabel}>{feld.label}</dt>
            <dd className={css.plankopfWert}>{feld.wert}</dd>
          </div>
        ))}
      {anhang}
    </dl>
  );
}
