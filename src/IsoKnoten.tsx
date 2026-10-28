import { createElement, Fragment, type ReactNode } from "react";
import type { Knoten } from "./iso";

type KnotenEingabe = Knoten | string | readonly (Knoten | string)[];
type Slots = Readonly<Record<string, ReactNode>>;

/**
 * Renderer für den Knotenbaum aus `iso.ts`: macht aus `{ tag, attrs, kids }`
 * rekursiv SVG-Elemente. Server-tauglich, kein Zustand.
 *
 * Knoten mit `tag: "slot"` ersetzt er durch `slots[attrs.name]`; so setzt der
 * Verbraucher Inhalte ein, die erst zur Laufzeit feststehen (etwa getippter
 * Text). Texte kommen als Kinder an und werden von React escapt, nie als
 * Attribut. Zahlenattribute bleiben Zahlen, `style`-Objekte mit
 * CSS-Variablen reicht er unverändert durch.
 */
export function IsoKnoten({
  knoten,
  slots,
}: {
  knoten: KnotenEingabe;
  slots?: Slots;
}) {
  return <>{baue(knoten, slots)}</>;
}

function baue(
  knoten: KnotenEingabe,
  slots: Slots | undefined,
): ReactNode {
  if (typeof knoten === "string") return knoten;
  if (Array.isArray(knoten)) {
    return knoten.map((k, i) => <Fragment key={i}>{baue(k, slots)}</Fragment>);
  }
  const n = knoten as Knoten;
  if (n.tag === "slot") return slots?.[String(n.attrs.name)] ?? null;
  const props: Record<string, unknown> = {};
  for (const [schluessel, wert] of Object.entries(n.attrs)) {
    if (wert !== undefined) props[schluessel] = wert;
  }
  // Kinder als einzelne Argumente: feste Reihenfolge, React braucht dafür keine Schlüssel.
  return createElement(n.tag, props, ...n.kids.map((k) => baue(k, slots)));
}
