"use client";

// Gesteuerte Ziffernfelder für einen Code (DS Werkplan 2.0, ADR-261). Herkunft
// ist die Anmeldung der Kundenseite im Admin
// (components/kundenseite/ZiffernFelder.tsx, Tafel S-Sicherheit). Einfügen
// eines ganzen Codes in ein beliebiges Feld und Autofill („one-time-code“) ins
// erste Feld verteilen den Code auf alle Felder; Rücktaste und Pfeile springen
// zwischen den Feldern. Kein `name`: abgeschickt wird ein verborgenes Feld, das
// die App aus `ziffern` setzt.

import { useEffect, useRef, type ClipboardEvent, type CSSProperties, type KeyboardEvent } from "react";

import { CODE_LAENGE_STANDARD, zifferLabelStandard } from "./standards";
import css from "./ziffernfelder.module.css";

function nurZiffern(wert: string): string {
  return wert.replace(/\D/g, "");
}

export function ZiffernFelder({
  ziffern,
  aendern,
  fehlerId,
  fokusAnlass,
  zifferLabel = zifferLabelStandard,
}: {
  ziffern: readonly string[];
  aendern: (neu: (vorher: string[]) => string[]) => void;
  /** id des Fehlertexts, oder null ohne Fehler. */
  fehlerId: string | null;
  /** Jede neue Antwort der Action: Fokus ins erste Feld, Inhalt markiert. */
  fokusAnlass: unknown;
  zifferLabel?: (nummer: number, laenge: number) => string;
}) {
  const laenge = ziffern.length;
  const felder = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const erstes = felder.current[0];
    erstes?.focus();
    erstes?.select();
  }, [fokusAnlass]);

  function setze(i: number, wert: string) {
    aendern((vorher) => {
      const neu = [...vorher];
      neu[i] = wert;
      return neu;
    });
  }

  function verteile(ab: number, ziffernText: string) {
    aendern((vorher) => {
      const neu = [...vorher];
      for (let i = 0; i < ziffernText.length && ab + i < laenge; i++) neu[ab + i] = ziffernText[i]!;
      return neu;
    });
    felder.current[Math.min(ab + ziffernText.length, laenge - 1)]?.focus();
  }

  /** Ein ganzer Code beginnt vorn, ein Teil ab Feld `i`. */
  function verteileCode(i: number, z: string) {
    verteile(z.length >= laenge ? 0 : i, z.slice(0, laenge));
  }

  function weiter(i: number) {
    if (i < laenge - 1) felder.current[i + 1]?.focus();
  }

  function beiEingabe(i: number, wert: string) {
    const z = nurZiffern(wert);
    // Gefülltes Feld ohne Markierung: der Browser hängt die neue Ziffer vor oder
    // hinter die alte. Das ist eine Korrektur, kein Einfügen; die alte fällt weg.
    const alt = ziffern[i];
    if (z.length === 2 && alt) {
      const neu = z[0] === alt ? z[1]! : z[0]!;
      setze(i, neu);
      weiter(i);
      return;
    }
    if (z.length > 1) {
      // Autofill oder Einfügen ohne Paste-Ereignis.
      verteileCode(i, z);
      return;
    }
    setze(i, z);
    if (z) weiter(i);
  }

  function beiEinfuegen(i: number, e: ClipboardEvent<HTMLInputElement>) {
    const z = nurZiffern(e.clipboardData.getData("text"));
    if (!z) return;
    e.preventDefault();
    verteileCode(i, z);
  }

  function beiTaste(i: number, e: KeyboardEvent<HTMLInputElement>) {
    const ziel = e.key === "Backspace" && !ziffern[i] ? i - 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "ArrowRight" ? i + 1 : null;
    if (ziel === null || ziel < 0 || ziel >= laenge) return;
    e.preventDefault();
    if (e.key === "Backspace") setze(ziel, "");
    felder.current[ziel]?.focus();
  }

  // Die Spaltenzahl steht im CSS (6); nur eine andere Länge setzt sie am Element.
  const stil = laenge === CODE_LAENGE_STANDARD ? undefined : ({ "--zf-anzahl": laenge } as CSSProperties);

  return (
    <div className={css.ziffern} style={stil}>
      {ziffern.map((ziffer, i) => (
        <input
          key={i}
          ref={(el) => {
            felder.current[i] = el;
          }}
          className={css.ziffer}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={laenge}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={zifferLabel(i + 1, laenge)}
          aria-invalid={fehlerId ? true : undefined}
          aria-describedby={fehlerId ?? undefined}
          value={ziffer}
          onChange={(e) => beiEingabe(i, e.target.value)}
          onPaste={(e) => beiEinfuegen(i, e)}
          onKeyDown={(e) => beiTaste(i, e)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
