import { defineConfig } from "vitest/config";

// Bausteine rendern in jsdom (react-dom/server und react-dom/client, wie im Admin).
// JSX mit der automatischen Laufzeit von React; CSS-Module liefern Klassennamen.
export default defineConfig({
  oxc: {
    jsx: { runtime: "automatic", importSource: "react" },
  },
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.{ts,tsx}"],
    css: {
      include: [/\.module\.css$/],
      modules: { classNameStrategy: "non-scoped" },
    },
  },
});
