import type React from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "./icons";
import css from "./lichtkante.module.css";

/**
 * Lichtkante: der Hauptknopf des DS Werkplan 2.0 (ADR-261). Mit `href` ein Link
 * (Monatsbericht „Ihr Schritt“, Zugangs-Seite), sonst ein echter <button>
 * (Standard `type="button"`). Bewusst ohne "use client" und ohne
 * Server-Importe, damit Client-Formulare ihn einbinden können. Alle Gestaltung
 * steckt in lichtkante.module.css. Mit `extern` öffnet der Link eine fremde
 * Seite in neuem Tab (Pfeil schräg nach oben; Agenten-Leitstand, ADR-228).
 */
export type LichtkanteButtonProps = {
  href?: string;
  type?: "submit" | "button";
  untergrund?: "nacht" | "papier";
  disabled?: boolean;
  className?: string;
  /** Nur mit `href`: fremde Seite, neuer Tab, Pfeil schräg nach oben. */
  extern?: boolean;
  /** Nur ohne `href` und nur aus Client-Komponenten (Rundgang der Kundenseite). */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

export function LichtkanteButton({
  href,
  type = "button",
  untergrund = "nacht",
  disabled = false,
  className,
  extern = false,
  onClick,
  children,
}: LichtkanteButtonProps) {
  const klassen = [css.lk, untergrund === "papier" ? css.papier : null, className].filter(Boolean).join(" ");
  const inhalt = (
    <>
      <span className={css.label}>{children}</span>
      <span className={css.chip}>
        {extern ? (
          <ArrowUpRightIcon size={18} strokeWidth={2.2} focusable="false" />
        ) : (
          <ArrowRightIcon size={18} strokeWidth={2.2} focusable="false" />
        )}
      </span>
    </>
  );

  if (href !== undefined) {
    // Ein gesperrter Link führt nirgends hin (kein href), bleibt aber per
    // Tastatur erreichbar, damit Screenreader ihn als gesperrt vorlesen.
    return disabled ? (
      <a className={klassen} aria-disabled="true" role="link" tabIndex={0}>
        {inhalt}
      </a>
    ) : (
      <a className={klassen} href={href} {...(extern ? { target: "_blank", rel: "noopener" } : {})}>
        {inhalt}
      </a>
    );
  }

  return (
    <button className={klassen} type={type} disabled={disabled} onClick={onClick}>
      {inhalt}
    </button>
  );
}
