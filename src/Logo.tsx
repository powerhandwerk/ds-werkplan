import type React from "react";

import logoHell from "../assets/logo-powerhandwerk.svg";
import logoDunkel from "../assets/logo-powerhandwerk-dark.svg";

export interface LogoProps {
  /** `light` für helle Flächen („power“ in Ink), `dark` für dunkle Flächen („power“ hell). */
  variant?: "light" | "dark";
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  /** Mit `href` ein Link, ohne ein reines Bild. */
  href?: string;
  /** Name des Links für Screenreader, passend zum Ziel von `href`. */
  linkLabel?: string;
  /** Element des Links, Standard `"a"`; eine App reicht hier etwa ihre Link-Komponente durch. */
  as?: React.ElementType;
}

/**
 * Logo des DS Werkplan 2.0 (ADR-261): die echte Wortmarke von powerhandwerk
 * (Standort-Pin und „handwerk“ auf der Lime-Pille), aus Illustrator exportiert,
 * je eine Fassung für helle und dunkle Flächen. Ohne Abhängigkeit auf ein
 * Framework: die SVGs kommen per Import, der Link über `as`.
 */
export function Logo({
  variant = "light",
  height = 34,
  className,
  style,
  href,
  linkLabel = "powerhandwerk Startseite",
  as: Element = "a",
}: LogoProps) {
  const bild = variant === "dark" ? logoDunkel : logoHell;
  // Next.js liefert beim SVG-Import ein Objekt mit `src`, Vite und Bun eine URL.
  const src = typeof bild === "string" ? bild : bild.src;
  const img = <img src={src} alt="powerhandwerk" style={{ height, width: "auto", display: "block" }} />;
  const Huelle = href === undefined ? "span" : Element;
  const link = href === undefined ? {} : { href, "aria-label": linkLabel };
  return (
    <Huelle {...link} className={className} style={{ display: "inline-flex", ...style }}>
      {img}
    </Huelle>
  );
}
