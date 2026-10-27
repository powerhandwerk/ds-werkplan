"use client";

// Inhaltsleiste mit Kapiteln (DS Werkplan 2.0, ADR-261). Herkunft ist das
// Erscheinungsbild der Kundenseite im Admin
// (components/kundenseite/KapitelLeiste.tsx, ADR-245): am Rechner links neben
// den Kapiteln und mitlaufend, am Handy eine Chip-Leiste über den Kapiteln.
// Markiert (`aria-current`) das letzte Kapitel, dessen Kopf das obere Drittel
// erreicht hat, am Seitenende das letzte. Ohne JavaScript bleibt es eine Liste
// von Sprungmarken.

import { useEffect, useState } from "react";

import css from "./kapitel-leiste.module.css";
import { kapitelNummer } from "./standards";

export type KapitelEintrag = { id: string; name: string };

export function KapitelLeiste({
  titel,
  kapitel,
  stand,
  kapitelNr = kapitelNummer,
}: {
  titel: string;
  kapitel: readonly KapitelEintrag[];
  stand: string;
  kapitelNr?: (nummer: number) => string;
}) {
  const [aktiv, setAktiv] = useState(kapitel[0]?.id ?? null);

  useEffect(() => {
    const ziele = kapitel.map((k) => document.getElementById(k.id)).filter((el): el is HTMLElement => el !== null);
    if (ziele.length === 0) return;
    // Aktiv ist das letzte Kapitel, dessen Kopf das obere Drittel des Fensters
    // erreicht hat; am Seitenende das letzte (es erreicht das Drittel sonst nie).
    // Gemessen bei jedem Scrollen über alle Kapitel, damit auch Zurückscrollen stimmt.
    const aktualisiere = () => {
      const amEnde = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const oben = ziele.filter((z) => z.getBoundingClientRect().top <= window.innerHeight / 3);
      setAktiv((amEnde ? ziele[ziele.length - 1] : (oben[oben.length - 1] ?? ziele[0]))!.id);
    };
    aktualisiere();
    window.addEventListener("scroll", aktualisiere, { passive: true });
    // Drehen des Handys oder nachladende Bilder verschieben die Kapitel ohne Scrollen.
    window.addEventListener("resize", aktualisiere);
    return () => {
      window.removeEventListener("scroll", aktualisiere);
      window.removeEventListener("resize", aktualisiere);
    };
  }, [kapitel]);

  return (
    <nav className={css.inhalt} aria-label={titel}>
      <p className={css.inhaltTitel}>{titel}</p>
      <ol className={css.inhaltListe}>
        {kapitel.map((k, i) => (
          <li key={k.id}>
            <a href={`#${k.id}`} aria-current={aktiv === k.id ? "true" : undefined} onClick={() => setAktiv(k.id)}>
              <span className={css.inhaltNr}>{kapitelNr(i + 1)}</span>
              <span className={css.inhaltName}>{k.name}</span>
            </a>
          </li>
        ))}
      </ol>
      <p className={css.inhaltStand}>{stand}</p>
    </nav>
  );
}
