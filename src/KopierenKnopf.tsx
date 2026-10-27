"use client";

// Kopierfeld (DS Werkplan 2.0, ADR-261). Herkunft ist die Kundenseite im Admin
// (components/kundenseite/KopierenKnopf.tsx, Bereichsseite Zugänge, ADR-229),
// zusammengeführt mit den Fähigkeiten des früheren DS-KopierenKnopf
// (components/ds/KopierenKnopf.tsx): Namenszusatz, Rückfall-Feld, Ansage.
// Der Wert steht sichtbar neben dem Knopf, damit er auch ohne Zwischenablage
// abtippbar bleibt. Scheitert das Kopieren (App-Ansichten, alte Browser, kein
// sicherer Kontext), steht er zusätzlich in einem Feld zum Markieren. Die
// Ansage läuft über eine Live-Region. `ohneFunktion` sperrt den Knopf
// (Kundenansicht im Admin). `kompakt`: Wert und Knopf in einer Zeile.

import { useEffect, useState } from "react";

import css from "./kopieren-knopf.module.css";

export interface KopierenTexte {
  kopieren: string;
  kopiert: string;
  /** Hinweis am gesperrten Knopf. */
  ohneFunktion: string;
  /** Ansage, wenn das Kopieren scheitert. */
  manuell: string;
  /** Name des Rückfall-Felds. */
  feld: string;
}

export const KOPIEREN_TEXTE: KopierenTexte = {
  kopieren: "Kopieren",
  kopiert: "Kopiert",
  ohneFunktion: "In der Kundenansicht ohne Funktion",
  manuell: "Kopieren ging nicht. Markieren Sie den Text im Feld und kopieren Sie ihn selbst.",
  feld: "Text zum Kopieren",
};

type Zustand = "bereit" | "kopiert" | "manuell";

export function KopierenKnopf({
  wert,
  label,
  zusatz,
  ohneFunktion = false,
  kompakt = false,
  texte = KOPIEREN_TEXTE,
}: {
  wert: string;
  /** Name des Werts, etwa „Adresse des Dienstkontos“; benennt Wert und Knopf („…: Kopieren“). */
  label?: string;
  /**
   * Hängt visuell versteckt an den sichtbaren Knopftext an („Kopieren Satz 2“),
   * damit mehrere Knöpfe unterscheidbare Namen tragen; der Name beginnt so mit
   * dem sichtbaren Text (WCAG 2.5.3). Ersetzt den Namen aus `label` am Knopf.
   */
  zusatz?: string;
  ohneFunktion?: boolean;
  kompakt?: boolean;
  texte?: KopierenTexte;
}) {
  const [zustand, setZustand] = useState<Zustand>("bereit");
  const kopiert = zustand === "kopiert";

  useEffect(() => {
    if (!kopiert) return;
    const uhr = setTimeout(() => setZustand("bereit"), 2500);
    return () => clearTimeout(uhr);
  }, [kopiert]);

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(wert);
      setZustand("kopiert");
    } catch {
      setZustand("manuell");
    }
  }

  const knopfText = kopiert ? texte.kopiert : texte.kopieren;
  const ansage = zustand === "kopiert" ? texte.kopiert : zustand === "manuell" ? texte.manuell : "";

  return (
    <div className={kompakt ? css.kopierenKompakt : css.kopieren}>
      <span className={kompakt ? css.wertKompakt : css.wert} aria-label={label}>
        {wert}
      </span>
      <button
        type="button"
        className={kompakt ? css.knopfKompakt : css.knopf}
        onClick={ohneFunktion ? undefined : kopieren}
        disabled={ohneFunktion}
        aria-label={label && !zusatz ? `${label}: ${knopfText}` : undefined}
        title={ohneFunktion ? texte.ohneFunktion : undefined}
      >
        {knopfText}
        {zusatz ? <span className={css.versteckt}>{` ${zusatz}`}</span> : null}
      </button>
      {zustand === "manuell" ? (
        <textarea
          readOnly
          value={wert}
          rows={Math.min(8, wert.split("\n").length + 1)}
          onFocus={(e) => e.currentTarget.select()}
          aria-label={texte.feld}
          className={css.feld}
        />
      ) : null}
      <span role="status" className={css.versteckt}>
        {ansage}
      </span>
    </div>
  );
}
