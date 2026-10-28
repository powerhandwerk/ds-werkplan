// Ersatz für `react/jsx-runtime` im Bündel der Lesefassung (scripts/bundle.ts).
// React 18 als UMD-Skript bringt kein `jsx` mit, nur `createElement`. Die
// automatische JSX-Laufzeit ruft `jsx(typ, props, key)` auf; hier wird daraus
// `createElement`, der Schlüssel aus dem dritten Argument wandert dabei zurück
// in die Props.

import { createElement, Fragment } from "react";

type Props = Record<string, unknown>;
type Erzeuge = (typ: unknown, props: Props | null, ...kinder: unknown[]) => unknown;
const erzeuge = createElement as unknown as Erzeuge;

function mitSchluessel(props: Props | null, key: unknown): Props | null {
  return key === undefined ? props : { ...props, key };
}

/** Ein Kind oder dynamische Kinder: `children` bleibt in den Props. */
export function jsx(typ: unknown, props: Props | null, key?: unknown): unknown {
  return erzeuge(typ, mitSchluessel(props, key));
}

/**
 * Feste Kinder im Quelltext (`<a>{x}{y}</a>`): als einzelne Argumente, wie es
 * das echte `jsxs` meint. Sonst hielte React 18 sie für eine Liste ohne `key`.
 */
export function jsxs(typ: unknown, props: Props | null, key?: unknown): unknown {
  const { children, ...rest } = props ?? {};
  return erzeuge(typ, mitSchluessel(rest, key), ...(Array.isArray(children) ? children : [children]));
}

/** Entwicklungsfassung: das vierte Argument sagt, ob die Kinder fest sind. */
export function jsxDEV(typ: unknown, props: Props | null, key?: unknown, fest?: boolean): unknown {
  return fest ? jsxs(typ, props, key) : jsx(typ, props, key);
}
export { Fragment };
