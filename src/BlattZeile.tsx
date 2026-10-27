import css from "./werkplan.module.css";

/**
 * Blattkennung über einem Abschnitt, etwa „Blatt 02 · Zugänge“ (DS Werkplan 2.0,
 * ADR-261; nur Papier).
 * Ohne `nr` steht nur der Titel (Monatsbericht v3 zeigt keine Blatt-Nummer,
 * Plan z1-werkplan-bausteine Entscheidung 3). Versalien setzt das CSS.
 */
export function BlattZeile({ nr, titel, className }: { nr?: number; titel: string; className?: string }) {
  return (
    <p className={[css.blattZeile, css.aufPapier, className].filter(Boolean).join(" ")}>
      {nr === undefined ? titel : `Blatt ${String(nr).padStart(2, "0")} · ${titel}`}
    </p>
  );
}
