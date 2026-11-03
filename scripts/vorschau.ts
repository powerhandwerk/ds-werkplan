// Lokale Vorschau der Lesefassung: liefert artifact/project/ mit React 18 aus
// node_modules, so wie das Design-System-Artifact die Karten zeigt. Startseite
// mit allen Karten, je Karte /galerie/<Name>. Nur lesend, nur auf 127.0.0.1.
// Aufruf: `bun run vorschau [-- <port>]`, Standard 4387.

import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { PROJEKT, WURZEL } from "./artifact";

const KARTEN = join(PROJEKT, "components");

/** Was jede Vorschau im Artifact vorgeladen bekommt: Tokens, Bündel und React 18. */
const KOPF = [
  '<link rel="stylesheet" href="/artifact/project/tokens.css">',
  '<link rel="stylesheet" href="/artifact/project/components/bundle.css">',
  '<script src="/node_modules/react18/umd/react.development.js"></script>',
  '<script src="/node_modules/react-dom18/umd/react-dom.development.js"></script>',
  '<script src="/artifact/project/components/bundle.js"></script>',
].join("\n");

/** Nur diese Ordner liefert die Vorschau aus. */
const FREI = /^\/(?:artifact\/project|node_modules\/react18\/umd|node_modules\/react-dom18\/umd)\//;

const TYPEN: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function startseite(): string {
  const namen = readdirSync(KARTEN, { withFileTypes: true })
    .filter((eintrag) => eintrag.isDirectory())
    .map((eintrag) => eintrag.name)
    .sort();
  const liste = namen.map((name) => `<li><a href="/galerie/${name}">${name}</a></li>`).join("\n");
  return `<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<title>Lesefassung DS Werkplan</title>\n</head>\n<body>\n<h1>Lesefassung DS Werkplan</h1>\n<ul>\n${liste}\n</ul>\n</body>\n</html>\n`;
}

const port = Number(process.argv[2] ?? 4387);

createServer((anfrage, antwort) => {
  const text = (status: number, inhalt: string) => {
    antwort.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
    antwort.end(inhalt);
  };
  const html = (inhalt: string) => {
    antwort.writeHead(200, { "content-type": TYPEN[".html"] });
    antwort.end(inhalt);
  };
  let pfad: string;
  try {
    pfad = decodeURIComponent(new URL(anfrage.url ?? "/", "http://127.0.0.1").pathname);
  } catch {
    return text(400, "Ungültige Adresse");
  }
  if (pfad === "/") return html(startseite());
  const karte = pfad.match(/^\/galerie\/([A-Za-z]+)$/);
  if (karte) {
    const vorschau = join(KARTEN, karte[1], "preview.html");
    if (existsSync(vorschau)) return html(readFileSync(vorschau, "utf8").replace("<head>", `<head>\n${KOPF}`));
  }
  const datei = join(WURZEL, pfad);
  if (!FREI.test(pfad) || pfad.includes("..") || !statSync(datei, { throwIfNoEntry: false })?.isFile()) {
    return text(404, "Nicht gefunden");
  }
  antwort.writeHead(200, { "content-type": TYPEN[extname(datei)] ?? "application/octet-stream" });
  createReadStream(datei)
    .on("error", () => antwort.destroy())
    .pipe(antwort);
}).listen(port, "127.0.0.1", () => console.log(`Vorschau: http://127.0.0.1:${port}/`));
