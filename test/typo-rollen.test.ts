// @vitest-environment node
import { describe, expect, it } from "vitest";
import { TYPO_ROLLEN, type SchriftFamilie } from "../src/tokens";
import { lies, werte } from "./css-hilfe";

// Die Typo-Rollen stehen zweimal: als Daten in src/tokens.ts (für tokens.json
// und die Lesefassung) und als Klassen in src/werkplan.module.css. Dieser Test
// hält beide gleich.

const CSS = lies("src/werkplan.module.css");

const FAMILIE: Record<SchriftFamilie, string> = {
  display: "var(--font-display)",
  body: "var(--font-body)",
  werkplan: "var(--font-werkplan), var(--font-body)",
};

describe("Typo-Rollen in werkplan.module.css", () => {
  it.each(TYPO_ROLLEN.map((r) => [r.name, r] as const))("%s", (_name, rolle) => {
    const css = werte(CSS, `.${rolle.klasse}`);
    expect(css["font-family"]).toBe(FAMILIE[rolle.familie]);
    expect(css["font-weight"]).toBe(String(rolle.gewicht));
    expect(css["line-height"]).toBe(String(rolle.zeilenhoehe));
    expect(css["letter-spacing"]).toBe(rolle.sperrung);
    expect(css["text-transform"]).toBe(rolle.versalien ? "uppercase" : undefined);
    expect(css["font-size"]).toBe(rolle.groesseSetztSeite ? undefined : `var(--grad-${rolle.grad})`);
    const ab768 = werte(CSS, `.${rolle.klasse}`, "@media (min-width: 768px)")["font-size"];
    expect(ab768).toBe(rolle.gradAb768 ? `var(--grad-${rolle.gradAb768})` : undefined);
  });
});
