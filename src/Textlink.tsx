import type React from "react";
import css from "./werkplan.module.css";

/** Textlink des DS Werkplan 2.0 (ADR-261), Zweitaktion neben der Lichtkante: Text mit 1 px Unterstrich, Hover/Fokus 3 px Lime. */
export function Textlink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={className ? `${css.textlink} ${className}` : css.textlink} href={href}>
      {children}
    </a>
  );
}
