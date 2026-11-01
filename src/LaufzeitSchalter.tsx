"use client";

// Laufzeit-Schalter der Paketkarten (Abokacheln Variante D, Flo 01.11.2026),
// wie auf der Preisseite der Website (components/preisseite/Laufzeit.tsx, E6):
// 24 zuerst und vorgewählt, zwei gleich breite Knöpfe, darunter die Info-Zeile.
// LaufzeitSchalter nimmt eine Funktion und geht deshalb nur aus
// Client-Komponenten; Server-Seiten nehmen LaufzeitBereich, der den Zustand
// hält und data-laufzeit um seine Kinder setzt. Die Karten bleiben Server-Inhalt.

import { useState } from "react";
import type React from "react";

import type { PaketLaufzeit } from "./Paketkarten";
import css from "./paketkarten.module.css";
import { LAUFZEIT_TEXTE, PAKET_LAUFZEITEN, type LaufzeitTexte } from "./standards";
import w from "./werkplan.module.css";

export type LaufzeitSchalterProps = {
  wert: PaketLaufzeit;
  onWechsel: (laufzeit: PaketLaufzeit) => void;
  /** Info-Zeile je Laufzeit. Ohne `info` entfällt die Zeile. */
  info?: Record<PaketLaufzeit, string>;
  texte?: Partial<LaufzeitTexte>;
};

export function LaufzeitSchalter({ wert, onWechsel, info, texte }: LaufzeitSchalterProps) {
  const t = { ...LAUFZEIT_TEXTE, ...texte };
  return (
    <div className={css.laufzeit}>
      <p className={w.beschriftung}>{t.label}</p>
      <div className={css.segmente} role="group" aria-label={t.gruppe}>
        {PAKET_LAUFZEITEN.map((monate) => (
          <button key={monate} type="button" aria-pressed={wert === monate} onClick={() => onWechsel(monate)}>
            {t.option.replace("{monate}", String(monate))}
          </button>
        ))}
      </div>
      {/* Beide Info-Zeilen liegen verdeckt in derselben Zelle und halten die
          Höhe; die Live-Zeile darüber wechselt ihren TEXT, das sagen
          Screenreader verlässlich an (Sichtbarkeit allein nicht überall). */}
      {info !== undefined && (
        <div className={css.laufzeitInfo}>
          {PAKET_LAUFZEITEN.map((monate) => (
            <p key={monate} aria-hidden="true">
              {info[monate]}
            </p>
          ))}
          <p aria-live="polite">{info[wert]}</p>
        </div>
      )}
    </div>
  );
}

export type LaufzeitBereichProps = {
  /** Laufzeit beim ersten Rendern. Standard: 24. */
  start?: PaketLaufzeit;
  info?: Record<PaketLaufzeit, string>;
  texte?: Partial<LaufzeitTexte>;
  children: React.ReactNode;
};

/** Hält die Laufzeit, zeigt oben den Schalter und setzt data-laufzeit auf den Rahmen um die Kinder. */
export function LaufzeitBereich({ start = 24, info, texte, children }: LaufzeitBereichProps) {
  const [wert, setWert] = useState<PaketLaufzeit>(start);
  return (
    <div className={css.bereich} data-laufzeit={wert}>
      <LaufzeitSchalter wert={wert} onWechsel={setWert} info={info} texte={texte} />
      {children}
    </div>
  );
}
