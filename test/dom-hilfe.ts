// Hilfen für Render-Tests in jsdom: ein Element einhängen und nach jedem Test
// wieder abbauen, Markup als Dokument lesen.

import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach } from "vitest";

const wurzeln: { root: Root; host: HTMLElement }[] = [];

afterEach(() => {
  for (const { root, host } of wurzeln.splice(0)) {
    act(() => root.unmount());
    host.remove();
  }
});

/** Rendert ein Element in einen eigenen Knoten im Dokument und gibt den Knoten zurück. */
export function zeige(element: ReactNode): HTMLElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  wurzeln.push({ root, host });
  act(() => root.render(element));
  return host;
}

/** Markup als Dokument, um es mit Selektoren zu lesen. */
export function dom(markup: string): Document {
  return new DOMParser().parseFromString(`<body>${markup}</body>`, "text/html");
}
