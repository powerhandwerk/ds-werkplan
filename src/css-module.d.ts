// Typen für Importe, die TypeScript selbst nicht kennt. Gilt nur für den
// Typecheck des Pakets: Im Admin liefert Next.js eigene Deklarationen.

declare module "*.module.css" {
  const klassen: { readonly [klasse: string]: string };
  export default klassen;
}

// SVG-Importe (Logo): Next.js liefert ein Objekt mit `src`, Vite und Bun eine URL.
declare module "*.svg" {
  const bild: string | { src: string; width?: number; height?: number };
  export default bild;
}
