import { useId } from "react";

/**
 * Präfix für Filter-, Clip- und Verlaufs-IDs eines SVGs: `useId` ohne die
 * Zeichen, die in `url(#…)` und CSS-Selektoren stören. So kommen sich
 * mehrere Grafiken auf einer Seite nicht in die Quere.
 */
export function useSvgPraefix(): string {
  return useId().replace(/[^a-zA-Z0-9]/g, "");
}
