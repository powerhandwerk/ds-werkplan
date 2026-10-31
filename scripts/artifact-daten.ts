// Datentabelle der Lesefassung: je Baustein aus dem Kopf von bundle.js die
// Gruppe, die Vorschau und die Leitlinie. `scripts/artifact.ts` baut daraus
// components/<Name>/README.md und components/<Name>/preview.html.
//
// Vorschau: `skript` definiert `function Beispiel(p)`, eine React-Komponente,
// die mit `p.u` ("papier" oder "nacht", bei `flaeche: "thema"` "thema") die
// Zustände des Bausteins rendert; `p.nacht` ist wahr, wenn `p.u` "nacht" ist. Im Skript stehen `h` (React.createElement),
// `D` (window.DsWerkplan), `W` (Klassen aus werkplan.module.css), `BS`
// (WERKPLAN_BAUSTEINE_SEITE) und `nichts` (leere Funktion) bereit. Kein JSX,
// keine Template-Literale, kein „</script“.
//
// Leitlinie: nur Belegtes aus Code, JSDoc, docs/inventur.md und dem Markenbuch
// (artifact/project/README.md). Keine Gedankenstriche, echte Umlaute. Werte
// wie Neigung und Maße kommen aus src/, nicht von Hand.

import { ABO_ICON_STROKE_WIDTH } from "../src/abo-icon";
import { EXPLOSION_STUFEN } from "../src/explosion";
import { MARKER_TILT_DEG } from "../src/MarkerHighlight";
import { GRAFIK, MASSE } from "../src/tokens";
import { komma } from "./erzeuge";

const GRUPPEN = ["Aktionen", "Status", "Hervorhebung", "Fakten", "Rahmen", "Listen", "Kundenseite", "Marke", "Grafik"] as const;
export type Gruppe = (typeof GRUPPEN)[number];

/** Wie die Vorschau ihre Fläche bekommt. */
export type Flaeche =
  /** direkt auf dem Grund des Frames, schaltet mit dem Thema Papier/Nacht um */
  | "thema"
  /** feste Papierfläche: der Baustein trägt feste Ink-Farben für Papier */
  | "papier"
  /** feste Nachtfläche: der Baustein trägt feste Ink-Farben für Nacht */
  | "nacht"
  /** beide Fassungen nebeneinander (Bausteine mit `untergrund` oder `nacht`) */
  | "beide";

/** Eine Zeile der Prop-Tabelle: Name, Typ, Standard („Pflicht“, „ohne“ oder Wert), Bedeutung. */
export type Prop = [name: string, typ: string, standard: string, bedeutung: string];

export interface Baustein {
  name: string;
  gruppe: Gruppe;
  hoehe: number;
  /** Layout-Breite der Vorschau, wenn der Baustein erst ab einer Breite seine Hauptform zeigt. */
  breite?: number;
  untertitel?: string;
  flaeche: Flaeche;
  skript: string;
  zusammenfassung: string;
  wann: string[];
  props: Prop[];
  lassen: string[];
}

const KINDER = "ReactNode";

export const BAUSTEINE: Baustein[] = [
  /* ---------------- Aktionen ---------------- */
  {
    name: "LichtkanteButton",
    gruppe: "Aktionen",
    hoehe: 216,
    flaeche: "beide",
    skript: `
function Beispiel(p) {
  return h("div", { className: "stapel" },
    h("div", { className: "reihe" },
      h(D.LichtkanteButton, { untergrund: p.u }, "Schritt ansehen"),
      h(D.LichtkanteButton, { untergrund: p.u, href: "#profil", extern: true }, "Profil öffnen")),
    h("div", { className: "reihe" },
      h(D.LichtkanteButton, { untergrund: p.u, className: D.WERKPLAN_KNOPF.lichtkanteKlein }, "Klein"),
      h(D.LichtkanteButton, { untergrund: p.u, disabled: true }, "Gesperrt")));
}`,
    zusammenfassung:
      "Die Lichtkante ist der Hauptknopf des DS Werkplan: ein dunkler Körper mit 1 px Kante, ein Lime-Licht, das bei Hover und Fokus um die Kante läuft, und der Pfeil in einer Lime-Kapsel.",
    wann: [
      "Für die Hauptaktion einer Fläche, etwa „Ihr Schritt“ im Monatsbericht oder auf der Zugangs-Seite.",
      "Mit `href` ist sie ein Link, ohne `href` ein echter `<button>` mit `type=\"button\"`.",
      "Mit `extern` öffnet der Link eine fremde Seite in neuem Tab, der Pfeil zeigt dann schräg nach oben.",
      "Auf Papier mit `untergrund=\"papier\"`: Der Körper bleibt dunkel, die Innenkante verschwindet, der Schatten wird weicher und der Fokusring dunkel.",
      "Kleinere Fassungen über `className`: `WERKPLAN_KNOPF.lichtkanteKlein` (40 px, Chip 28 px), `WERKPLAN_KNOPF.lichtkanteVoll` (füllt am Handy ihre Spalte), `WERKPLAN_KNOPF.lichtkanteHandy` (feste 48 px).",
      "Bei reduzierter Bewegung steht das Licht still.",
    ],
    props: [
      ["href", "string", "ohne", "Ziel; mit `href` ein Link."],
      ["type", "\"submit\" \\| \"button\"", "\"button\"", "Typ des Knopfs ohne `href`."],
      ["untergrund", "\"nacht\" \\| \"papier\"", "\"nacht\"", "Fläche, auf der die Lichtkante steht."],
      ["disabled", "boolean", "false", "Gesperrt; ein gesperrter Link hat kein Ziel, bleibt aber per Tastatur erreichbar (`aria-disabled`)."],
      ["extern", "boolean", "false", "Nur mit `href`: fremde Seite, neuer Tab, Pfeil schräg nach oben."],
      ["onClick", "MouseEventHandler", "ohne", "Nur ohne `href` und nur aus Client-Komponenten."],
      ["className", "string", "ohne", "Zusätzliche Klasse, etwa eine Größe aus `WERKPLAN_KNOPF`."],
      ["children", KINDER, "Pflicht", "Beschriftung."],
    ],
    lassen: [
      "Die Lime-Pille als Hauptknopf: Die Hauptaktion ist die Lichtkante.",
      "Eine zweite Lichtkante für eine Nebenaktion; dafür gibt es `RuhigerKnopf` und `Textlink`.",
      "`untergrund=\"nacht\"` auf Papier.",
    ],
  },
  {
    name: "RuhigerKnopf",
    gruppe: "Aktionen",
    hoehe: 200,
    flaeche: "beide",
    skript: `
function Beispiel(p) {
  return h("div", { className: "stapel" },
    h("div", { className: "reihe" },
      h(D.RuhigerKnopf, { nacht: p.nacht }, "Abbrechen"),
      h(D.RuhigerKnopf, { nacht: p.nacht, icon: h(D.PlusIcon, { size: 16 }) }, "Hinzufügen"),
      h(D.RuhigerKnopf, { nacht: p.nacht, disabled: true }, "Gesperrt")),
    h("div", { className: "reihe" },
      h(D.RuhigerKnopf, { nacht: p.nacht, groesse: "klein" }, "Klein"),
      h(D.RuhigerKnopf, { nacht: p.nacht, groesse: "handy" }, "Handy")));
}`,
    zusammenfassung:
      "Der ruhige Knopf ist der Knopf für Nebenaktionen: transparenter Grund, 1 px Rahmen und eine Rundung wie die Pille im Logo.",
    wann: [
      "Für Nebenaktionen neben der Lichtkante, in Dialogen als „Abbrechen“ und als Aktion in `Hinweisband` oder `Kasten`.",
      "Auf Nacht mit `nacht`.",
      "Drei Größen: `normal` 40 px, `klein` 34 px, `handy` 48 px hoch.",
      "Alle übrigen Attribute gehen an den `<button>`; `type` ist `\"button\"`, solange der Verbraucher keinen anderen setzt.",
      "`WERKPLAN_KNOPF.ruhig` gibt einem fremden Knopf dasselbe Aussehen.",
    ],
    props: [
      ["icon", KINDER, "ohne", "Icon vor dem Text."],
      ["nacht", "boolean", "false", "Fassung für Nacht."],
      ["groesse", "\"normal\" \\| \"klein\" \\| \"handy\"", "\"normal\"", "Höhe 40, 34 oder 48 px."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
      ["children", KINDER, "ohne", "Beschriftung."],
      ["…", "ButtonHTMLAttributes", "ohne", "Alle Attribute eines `<button>`."],
    ],
    lassen: [
      "Den ruhigen Knopf als Hauptaktion: Die trägt die Lichtkante.",
      "Eine eigene Farbe auf Nacht; dort `nacht` setzen.",
    ],
  },
  {
    name: "FesterKnopf",
    gruppe: "Aktionen",
    hoehe: 136,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "reihe" },
    h(D.RuhigerKnopf, null, "Abbrechen"),
    h(D.FesterKnopf, null, "Löschen bestätigen"),
    h(D.FesterKnopf, { icon: h(D.CheckIcon, { size: 16 }) }, "Übernehmen"),
    h(D.FesterKnopf, { disabled: true }, "Gesperrt"));
}`,
    zusammenfassung: "Der feste Knopf ist dunkel gefüllt und steht nur als Bestätigung in Dialogen.",
    wann: [
      "Als Bestätigung eines Dialogs, neben „Abbrechen“ als `RuhigerKnopf`.",
      "`WERKPLAN_KNOPF.fest` gibt einem fremden Knopf dasselbe Aussehen, etwa über `confirmProps`.",
      "Alle übrigen Attribute gehen an den `<button>`; `type` ist `\"button\"`, solange der Verbraucher keinen anderen setzt.",
    ],
    props: [
      ["icon", KINDER, "ohne", "Icon vor dem Text."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
      ["children", KINDER, "ohne", "Beschriftung."],
      ["…", "ButtonHTMLAttributes", "ohne", "Alle Attribute eines `<button>`."],
    ],
    lassen: [
      "Den festen Knopf außerhalb von Dialogen oder als Hauptaktion einer Seite.",
      "Den festen Knopf auf Nacht: Sein Körper ist `ink-950`, er ist für Papier gesetzt.",
    ],
  },
  {
    name: "IconKnopf",
    gruppe: "Aktionen",
    hoehe: 136,
    flaeche: "beide",
    skript: `
function Beispiel(p) {
  return h("div", { className: "reihe" },
    h(D.IconKnopf, { nacht: p.nacht, label: "Kopieren", icon: h(D.CopyIcon, { size: 16 }), onClick: nichts }),
    h(D.IconKnopf, { nacht: p.nacht, label: "Löschen", icon: h(D.TrashIcon, { size: 16 }), onClick: nichts }),
    h(D.IconKnopf, { nacht: p.nacht, label: "Schließen", icon: h(D.XIcon, { size: 18 }), groesse: 40, onClick: nichts }),
    h(D.IconKnopf, { nacht: p.nacht, label: "Gesperrt", icon: h(D.LockIcon, { size: 16 }), disabled: true }));
}`,
    zusammenfassung: "Der Icon-Knopf ist quadratisch und trägt nur ein Icon; sein Label steht als `aria-label` und `title`.",
    wann: [
      "Für Werkzeugaktionen in Listen, im Detailrahmen und in Kopfzeilen, etwa Kopieren, Löschen oder Schließen.",
      "Auf Nacht mit `nacht`.",
      "Als Link: die Klasse `WERKPLAN_FLAECHE.iconKnopf` an einem eigenen `<a>`.",
    ],
    props: [
      ["icon", KINDER, "Pflicht", "Das Icon."],
      ["label", "string", "Pflicht", "Name des Knopfs, steht als `aria-label` und `title`."],
      ["onClick", "() => void", "ohne", "Aktion."],
      ["disabled", "boolean", "ohne", "Gesperrt."],
      ["nacht", "boolean", "false", "Fassung für Nacht."],
      ["groesse", "number", "32", "Kantenlänge in px."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
    ],
    lassen: ["Ein Icon-Knopf ohne sprechendes `label`.", "Den Icon-Knopf für die Hauptaktion."],
  },
  {
    name: "Textlink",
    gruppe: "Aktionen",
    hoehe: 120,
    flaeche: "thema",
    skript: `
function Beispiel() {
  return h("div", { className: "reihe" },
    h(D.Textlink, { href: "#schritte" }, "Alle Schritte ansehen"),
    h(D.Textlink, { href: "#bericht" }, "Bericht lesen"));
}`,
    zusammenfassung:
      "Der Textlink ist die Zweitaktion neben der Lichtkante: Text mit 1 px Unterstrich, der bei Hover und Fokus zu 3 px Lime wird.",
    wann: [
      "Für die Zweitaktion neben der Lichtkante.",
      "Die Schrift erbt ihre Farbe, der Fokusring folgt `wp-fokus`; der Textlink steht deshalb auf Papier und Nacht.",
    ],
    props: [
      ["href", "string", "Pflicht", "Ziel."],
      ["children", KINDER, "Pflicht", "Text."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
    ],
    lassen: ["Den Textlink für die Hauptaktion.", "Lime als Schriftfarbe: Lime ist nur der Unterstrich."],
  },
  {
    name: "KopierenKnopf",
    gruppe: "Aktionen",
    hoehe: 232,
    flaeche: "thema",
    skript: `
function Beispiel() {
  return h("div", { className: "stapel schmal" },
    h(D.KopierenKnopf, { wert: "Musterstraße 1, 12345 Musterstadt", label: "Anschrift" }),
    h(D.KopierenKnopf, { wert: "MUSTER-2026-01", label: "Kennung", kompakt: true }),
    h(D.KopierenKnopf, { wert: "MUSTER-2026-02", label: "Kennung", ohneFunktion: true }));
}`,
    zusammenfassung: "Der Kopieren-Knopf zeigt einen Wert sichtbar an und kopiert ihn auf Knopfdruck in die Zwischenablage.",
    wann: [
      "Für Werte, die ein Betrieb einfügen oder abschreiben muss, etwa die Adresse eines Dienstkontos auf der Seite Zugänge.",
      "Der Wert steht neben dem Knopf und bleibt ohne Zwischenablage abtippbar.",
      "Nach dem Kopieren zeigt der Knopf 2,5 s lang „Kopiert“; die Ansage läuft über eine Live-Region.",
      "Scheitert das Kopieren, steht der Wert zusätzlich in einem Feld zum Markieren.",
      "`kompakt` setzt Wert und Knopf in eine Zeile, den Wert ohne Rahmen und den Knopf als kleine Pille.",
      "Die Standardtexte sind in Sie-Form (`KOPIEREN_TEXTE`). Client-Komponente.",
    ],
    props: [
      ["wert", "string", "Pflicht", "Der Text, der kopiert wird."],
      ["label", "string", "ohne", "Name des Werts; benennt Wert und Knopf („Anschrift: Kopieren“)."],
      ["zusatz", "string", "ohne", "Hängt versteckt an den Knopftext an („Kopieren Satz 2“) und ersetzt den Namen aus `label` am Knopf."],
      ["ohneFunktion", "boolean", "false", "Sperrt den Knopf, Hinweis „In der Kundenansicht ohne Funktion“."],
      ["kompakt", "boolean", "false", "Wert und Knopf in einer Zeile."],
      ["texte", "KopierenTexte", "KOPIEREN_TEXTE", "Alle Texte des Knopfs."],
    ],
    lassen: [
      "Den Wert verstecken: Er bleibt neben dem Knopf sichtbar.",
      "Mehrere Kopieren-Knöpfe mit gleichem Namen auf einer Seite; `zusatz` unterscheidet sie.",
    ],
  },

  /* ---------------- Status ---------------- */
  {
    name: "Etikett",
    gruppe: "Status",
    hoehe: 120,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "reihe" },
    h(D.Etikett, null, "Linie"),
    h(D.Etikett, { art: "gestrichelt" }, "Gestrichelt"),
    h(D.Etikett, { art: "voll" }, "Voll"),
    h(D.Etikett, { art: "lead", icon: h(D.FunkenIcon, { size: 12 }) }, "Lead"),
    h(D.Etikett, { art: "warn", icon: h(D.AlertTriangleIcon, { size: 12 }) }, "Warn"),
    h(D.Etikett, { art: "still" }, "Still"));
}`,
    zusammenfassung: "Das Etikett ist ein kleines Schild in Versalien für Stand und Art eines Eintrags, in sechs Arten.",
    wann: [
      "`linie` mit Rahmen, `gestrichelt` mit gestricheltem Rahmen, `voll` als dunkle Fläche mit heller Schrift, `lead` als helle Lime-Fläche mit dunkler Schrift, `warn` in Warnfarbe, `still` leise.",
      "Eine Hervorhebung auf Papier ist das Etikett `lead`: Lime als Fläche, die Schrift bleibt dunkel.",
      "Die Warnfarben setzt `WERKPLAN_BAUSTEINE_SEITE` an der Seite; ohne sie gelten Rückfallwerte.",
    ],
    props: [
      ["art", "\"linie\" \\| \"gestrichelt\" \\| \"voll\" \\| \"lead\" \\| \"warn\" \\| \"still\"", "\"linie\"", "Art des Etiketts."],
      ["icon", KINDER, "ohne", "Icon vor dem Text."],
      ["children", KINDER, "Pflicht", "Text; die Versalien setzt das CSS."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
    ],
    lassen: [
      "Lime als Schriftfarbe: `lead` ist eine Lime-Fläche mit dunkler Schrift.",
      "Eigene Farben neben den sechs Arten.",
      "Etiketten auf Nacht: Sie tragen feste Ink-Farben für Papier.",
    ],
  },
  {
    name: "Hinweisband",
    gruppe: "Status",
    hoehe: 176,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "stapel" },
    h(D.Hinweisband, {
      icon: h(D.AlertTriangleIcon, { size: 14 }),
      titel: "Zugang fehlt.",
      aktion: h(D.RuhigerKnopf, { groesse: "klein" }, "Verbinden")
    }, "Das Google-Profil ist noch nicht verbunden."),
    h(D.Hinweisband, { icon: h(D.ClockIcon, { size: 14 }), titel: "Prüfung offen." }, "Muster, keine echten Daten."));
}`,
    zusammenfassung:
      "Das Hinweisband meldet eine Warnung mit Rahmen und Fläche in Warnfarbe und dem Icon an der ersten Zeile.",
    wann: [
      "Für eine Warnung auf einer Arbeitsseite, mit optionaler Aktion rechts; am Handy rutscht die Aktion unter den Text.",
      "Der Titel steht fett in Warnfarbe vor dem Text. Das Band trägt `role=\"status\"`.",
      "Die Warnfarben setzt `WERKPLAN_BAUSTEINE_SEITE` an der Seite; ohne sie gelten Rückfallwerte.",
    ],
    props: [
      ["icon", KINDER, "Pflicht", "Icon an der ersten Zeile."],
      ["titel", "string", "Pflicht", "Fetter Anfang in Warnfarbe."],
      ["children", KINDER, "ohne", "Text nach dem Titel."],
      ["aktion", KINDER, "ohne", "Aktion rechts, etwa ein `RuhigerKnopf` in `klein`."],
    ],
    lassen: ["Einen farbigen Seitenbalken statt Rahmen und Fläche.", "Das Hinweisband auf Nacht: Es trägt feste Farben für Papier."],
  },
  {
    name: "Toast",
    gruppe: "Status",
    hoehe: 176,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "schwebe" },
    h(D.Toast, {
      haken: h(D.CheckIcon, { size: 14 }),
      text: "Schritt erledigt.",
      aktion: { label: "Rückgängig", icon: h(D.UndoIcon, { size: 14 }), taste: "Z", onClick: nichts }
    }));
}`,
    zusammenfassung:
      "Der Toast ist eine kurze Bestätigung unten in der Mitte, dunkel, mit Lime-Haken und optionaler Aktion wie „Rückgängig“.",
    wann: [
      "Als Rückmeldung nach einer Aktion, mit Aktion und Tastenkappe für die Abkürzung.",
      "Er steht fest 22 px über dem unteren Rand; unter 880 px läuft er über die volle Breite, 96 px über dem Rand.",
      "Er trägt `role=\"status\"` und `aria-live=\"polite\"`, außer mit `ohneLiveRegion`.",
    ],
    props: [
      ["haken", KINDER, "Pflicht", "Inhalt des Lime-Kreises, meist ein Haken-Icon."],
      ["text", "string", "Pflicht", "Die Bestätigung."],
      ["aktion", "{ label, icon?, taste?, onClick }", "ohne", "Aktion rechts; `taste` erscheint als Tastenkappe."],
      ["ohneLiveRegion", "boolean", "false", "Ohne Live-Region, wenn die Seite den Text selbst über den StatusAnnouncer ansagt."],
    ],
    lassen: ["`ohneLiveRegion`, wenn die Seite den Text nicht selbst ansagt."],
  },
  {
    name: "Tastenkappe",
    gruppe: "Status",
    hoehe: 120,
    flaeche: "beide",
    skript: `
function Beispiel(p) {
  return h("p", { className: W.text },
    "Mit ", h(D.Tastenkappe, { nacht: p.nacht }, "Z"), " rückgängig, mit ",
    h(D.Tastenkappe, { nacht: p.nacht }, "Esc"), " schließen.");
}`,
    zusammenfassung: "Die Tastenkappe zeigt eine Taste im Text, etwa die Abkürzung zu einer Aktion.",
    wann: ["Im Fließtext und im `Toast` neben der Aktion.", "Auf Nacht mit `nacht`."],
    props: [
      ["children", KINDER, "Pflicht", "Name der Taste."],
      ["nacht", "boolean", "false", "Fassung für Nacht."],
    ],
    lassen: ["Die Tastenkappe als Knopf: Sie ist ein `<kbd>` ohne Funktion."],
  },

  /* ---------------- Hervorhebung ---------------- */
  {
    name: "Unterstrich",
    gruppe: "Hervorhebung",
    hoehe: 120,
    flaeche: "thema",
    skript: `
function Beispiel() {
  return h("p", { className: W.h2, style: { fontSize: "var(--grad-32)" } },
    "Ein Schritt ", h(D.Unterstrich, null, "wartet"), " auf Sie.");
}`,
    zusammenfassung: "Der Unterstrich hebt ein Wort mit einer 4 px dicken Lime-Linie hervor.",
    wann: [
      "Für die Hervorhebung eines Worts in Oberflächen; er ersetzt im Werkplan die Marker-Pille.",
      "Die Schrift behält ihre Farbe, der Unterstrich steht auf Papier und Nacht.",
    ],
    props: [["children", KINDER, "Pflicht", "Das hervorgehobene Wort."]],
    lassen: ["Die Marker-Pille in Oberflächen: Sie gehört dem Logo und dem Hero der Website.", "Ganze Sätze unterstreichen."],
  },
  {
    name: "MarkerHighlight",
    gruppe: "Hervorhebung",
    hoehe: 240,
    flaeche: "thema",
    skript: `
function Beispiel() {
  var grad = String(D.markerTiltDeg("Handwerk")).replace(".", ",");
  return h("div", { className: "stapel" },
    h("p", { className: W.h1, style: { fontSize: "var(--grad-64)", lineHeight: 1.2 } },
      "Gutes", h("br"), h(D.MarkerHighlight, null, "Handwerk")),
    h("p", { className: W.beschriftung }, "Neigung für „Handwerk“: " + grad + "°"));
}`,
    zusammenfassung:
      "Der Marker legt die schräge Lime-Pille des Logos hinter genau ein Wort; die Schrift darauf ist immer dunkel.",
    wann: [
      "Nur im Logo und im Hero der Website, dort einmal und hinter einem kurzen Wort.",
      "Die Fläche ist dieselbe Form wie die Pille im Logo: `markerGeometry()` rechnet sie aus der Versalhöhe von Big Shoulders Display, die Buchstaben stehen immer frei.",
      `Die Neigung ist ${komma(MARKER_TILT_DEG)}°; \`markerTiltDeg()\` macht sie bei langen Wörtern flacher.`,
      "Der Marker hält seinen Kasten auf `line-height: 1`; die Geometrie hängt daran.",
      "`animate` wischt die Fläche ein; die `@keyframes marker-wisch` liefert bis Phase 1b die App.",
    ],
    props: [
      ["children", KINDER, "Pflicht", "Das Wort."],
      ["rotate", "number", "ohne", `Neigung in Grad; ohne Angabe ${komma(MARKER_TILT_DEG)}°, bei langen Wörtern flacher.`],
      ["animate", "boolean", "false", "Fläche wischt ein."],
      ["color", "string", "ohne", "Farbe der Fläche; ohne Angabe `var(--lime)`."],
      ["geometry", "MarkerGeometry", "GEOMETRY_DEFAULT", "Überstand und Rundung in em; die Voreinstellung ist am Logo vermessen."],
      ["…", "HTMLAttributes<HTMLSpanElement>", "ohne", "Alle Attribute eines `<span>`."],
    ],
    lassen: [
      "Den Marker in Oberflächen: Dort hebt der `Unterstrich` hervor.",
      "Ein langes Wort markieren; besser ein kürzeres Wort wählen.",
      "Geschätzte Werte, zusätzliches `padding` oder eine Rundung in Prozent.",
    ],
  },

  /* ---------------- Fakten ---------------- */
  {
    name: "Plankopf",
    gruppe: "Fakten",
    hoehe: 264,
    flaeche: "beide",
    skript: `
function Beispiel(p) {
  return h(D.Plankopf, {
    untergrund: p.u,
    felder: [
      { label: "Betrieb", wert: "Dachdeckerei Muster", breit: true },
      { label: "Abo", wert: h("span", { className: "mitIcon" }, h(D.AboIcon, { paket: "Profi", size: 16 }), "Profi") },
      { label: "Stand", wert: "28.10.2026" },
      { label: "Ort", wert: "Musterstadt", breit: true },
      { label: "Notiz", wert: "" }
    ]
  });
}`,
    zusammenfassung:
      "Der Plankopf ist das Schriftfeld einer Seite: Label im Beschriftungsstil, Wert darunter, zwei Spalten mit 1-px-Fugen.",
    wann: [
      "Für Fakten wie Seite, Abo und Stand, statt sie in den Fließtext zu schreiben.",
      "Als `<dl>`, damit Label und Wert vorgelesen zusammengehören. Werte stehen in normaler Schreibung, damit Namen und Adressen lesbar bleiben.",
      "Felder mit leerem Text fallen weg. `breit` zieht ein Feld über beide Spalten.",
      "`anhang` steht als letztes Kind im `<dl>` und bringt seine Felder selbst mit.",
    ],
    props: [
      ["felder", "readonly PlankopfFeld[]", "Pflicht", "Je Feld `label`, `wert` (Text oder Element) und optional `breit`."],
      ["untergrund", "\"nacht\" \\| \"papier\"", "\"papier\"", "Fläche, auf der der Plankopf steht."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
      ["anhang", KINDER, "ohne", "Weitere Felder am Ende."],
    ],
    lassen: [
      "Leere oder erfundene Werte: Leere Felder fallen von selbst weg.",
      "Einen Abo-Namen ohne sein `AboIcon`.",
      "Werte in Versalien; das ist das `Schriftfeld` der Arbeitsfläche.",
    ],
  },
  {
    name: "Schriftfeld",
    gruppe: "Fakten",
    hoehe: 200,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "stapel" },
    h(D.Schriftfeld, { felder: [["Betrieb", "Dachdeckerei Muster"], ["Ort", "Musterstadt"], ["Stand", "28.10.2026"]] }),
    h(D.Schriftfeld, { voll: true, letzteBreit: true, felder: [["Gewerk", "Dachdecker"], ["Gegründet", "01.03.2026"], ["Notiz", "Muster, keine echten Daten"]] }));
}`,
    zusammenfassung:
      "Das Schriftfeld der Arbeitsfläche zeigt Label und Wert wie auf den Tafeln, die Werte in Barlow-Versalien, mit 1-px-Fugen.",
    wann: [
      "Für Fakten auf Arbeitsseiten mit Liste links und Detail rechts.",
      "`voll` streckt die Felder auf die ganze Breite; mit `letzteBreit` nimmt das letzte Feld den Rest, etwa für eine Notiz.",
    ],
    props: [
      ["felder", "[string, ReactNode][]", "Pflicht", "Paare aus Label und Wert; das Label ist der Schlüssel und muss eindeutig sein."],
      ["voll", "boolean", "false", "Felder auf ganzer Breite."],
      ["letzteBreit", "boolean", "false", "Das letzte Feld nimmt den Rest."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
    ],
    lassen: [
      "Das Schriftfeld für Namen und Adressen auf Seiten für Betriebe; dort steht der `Plankopf` in normaler Schreibung.",
      "Das Schriftfeld auf Nacht: Es trägt feste Farben für Papier.",
    ],
  },
  {
    name: "Messwert",
    gruppe: "Fakten",
    hoehe: 216,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "stapel eng" },
    h(D.Besch, null, "Anrufe über das Profil"),
    h(D.Messwert, { groesse: 80 }, "18"),
    h("p", { className: W.quelle }, "Gemessen 06/2026 · Vormonat: 11 · Quelle Google"));
}`,
    zusammenfassung: "Der Messwert setzt eine große, leichte Zahl in Barlow Semi Condensed 300 mit proportionalen Versalziffern.",
    wann: [
      "Für eine Kennzahl, mit `Besch` als Beschriftung und einer Quellenzeile darunter.",
      "Die Größe kommt aus den Graden, Richtwert `grad-80`.",
      "Fehlt eine Messung, steht das da: „Noch keine Messung“.",
    ],
    props: [
      ["children", KINDER, "Pflicht", "Die Zahl."],
      ["groesse", "number", "Pflicht", "Schriftgröße in px."],
      ["farbe", "string", "ohne", "Schriftfarbe; ohne Angabe `ink-950`."],
    ],
    lassen: [
      "Eine Mono-Schrift oder tabellarische Ziffern.",
      "Eine Zahl, die eine Wirkung zeigt, ohne Messzeitraum und Quelle.",
    ],
  },
  {
    name: "Besch",
    gruppe: "Fakten",
    hoehe: 136,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "stapel eng" },
    h(D.Besch, null, "Pos. 01 · Profil"),
    h(D.Besch, { stark: true }, "Pos. 02 · Bewertungen"),
    h(D.Besch, { as: "p", gross: true }, "Blatt 02 · Zugänge"));
}`,
    zusammenfassung:
      "Besch ist die Beschriftung der Arbeitsfläche: Barlow Semi Condensed 600 in 12 px, Versalien, gesperrt.",
    wann: [
      "Für Labels, Positionsnummern, Gruppenköpfe und Kopfzeilen auf Arbeitsseiten.",
      "`stark` setzt `ink-950` statt `ink-600`. `gross` setzt die Klasse `beschGross`, heute ebenfalls `grad-12`.",
      "`as` wählt das Element, etwa `h2` für einen Abschnittskopf.",
    ],
    props: [
      ["children", KINDER, "Pflicht", "Text; die Versalien setzt das CSS."],
      ["gross", "boolean", "false", "Klasse `beschGross`."],
      ["stark", "boolean", "false", "Starke Farbe."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
      ["as", "\"span\" \\| \"p\" \\| \"h2\" \\| \"h3\"", "\"span\"", "Element."],
    ],
    lassen: ["Besch für Fließtext.", "Eine freie Farbe; die starke Fassung kommt über `stark`."],
  },
  {
    name: "Massbalken",
    gruppe: "Fakten",
    hoehe: 200,
    flaeche: "beide",
    skript: `
function Beispiel(p) {
  return h("div", { className: "stapel" },
    h(D.Massbalken, { untergrund: p.u, anteil: 0, label: "0 Prozent" }),
    h(D.Massbalken, { untergrund: p.u, anteil: 40, label: "40 Prozent" }),
    h(D.Massbalken, { untergrund: p.u, anteil: 100, label: "100 Prozent" }));
}`,
    zusammenfassung: "Der Maßbalken zeigt einen Anteil als Maßlinie mit Endstrichen und einer Lime-Füllung.",
    wann: [
      "Für Anteile und Stände, die wie Vermessung aussehen sollen, statt eines Balkendiagramms.",
      `Er füllt die Breite seines Elternteils; die Striche bleiben in jeder Breite 1 px. Höhe ${komma(MASSE.massbalkenHoehe)} px, Füllung ${komma(MASSE.massbalkenFuellung)} px.`,
      "Mit `label` ist er ein Bild mit Namen (`role=\"img\"`), ohne ist er für Vorleser versteckt.",
      "Die Füllfarbe setzt die Stellschraube `--fuell-farbe` an einem umgebenden Element, Standard Lime.",
    ],
    props: [
      ["anteil", "number", "Pflicht", "Anteil in Prozent, auf 0 bis 100 geklemmt."],
      ["untergrund", "\"nacht\" \\| \"papier\"", "Pflicht", "Fläche, auf der der Balken steht."],
      ["label", "string", "ohne", "Name für Vorleser."],
    ],
    lassen: [
      "Bunte Balkendiagramme.",
      "Einen Balken ohne `label`, wenn der Anteil nicht daneben im Text steht.",
    ],
  },
  {
    name: "Masskette",
    gruppe: "Fakten",
    hoehe: 136,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "stapel eng" },
    h(D.Besch, null, "Blatt 01 · 2 von 3 · Blatt 02 · 1 von 4"),
    h(D.Masskette, { gruppen: [[true, true, false], [true, false, false, false]], label: "Blatt 01: 2 von 3 geprüft, Blatt 02: 1 von 4 geprüft" }));
}`,
    zusammenfassung:
      "Die Maßkette zeigt einen Prüfstand: ein Teilstück je Position, lange Trennstriche zwischen Abschnitten, Lime füllt, was geprüft ist.",
    wann: [
      "Für den Stand mehrerer Positionen in Abschnitten, etwa Blatt 01 und Blatt 02.",
      "`massketteGeometrie()` rechnet Füllungen, Teilstriche und Trenner aus; der Test prüft sie ohne DOM.",
      "Sie steht auf Papier.",
      "Die Füllfarbe setzt die Stellschraube `--fuell-farbe` an einem umgebenden Element, Standard Lime.",
    ],
    props: [
      ["gruppen", "readonly (readonly boolean[])[]", "Pflicht", "Je Abschnitt eine Liste; `true` heißt geprüft."],
      ["label", "string", "Pflicht", "Name für Vorleser."],
    ],
    lassen: ["Die Maßkette auf Nacht.", "Bunte Balkendiagramme."],
  },
  {
    name: "Fortschritt",
    gruppe: "Fakten",
    hoehe: 120,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h(D.Fortschritt, { links: "Prüfung", rechts: "3 von 7", anteil: 43, label: "3 von 7 geprüft" });
}`,
    zusammenfassung: "Der Fortschritt stellt eine Kopfzeile links und rechts über einen Maßbalken.",
    wann: [
      "Für einen Stand mit Text, etwa „3 von 7“ über dem Balken.",
      "Links steht `Besch`, rechts `Besch` in der starken Fassung. Der Maßbalken steht auf Papier.",
    ],
    props: [
      ["links", "string", "Pflicht", "Text links."],
      ["rechts", "string", "Pflicht", "Text rechts."],
      ["anteil", "number", "Pflicht", "Anteil in Prozent."],
      ["label", "string", "Pflicht", "Name des Balkens für Vorleser."],
      ["className", "string", "ohne", "Zusätzliche Klasse, etwa für den Kopf untereinander am Handy."],
    ],
    lassen: ["Den Fortschritt auf Nacht."],
  },
  {
    name: "BlattZeile",
    gruppe: "Fakten",
    hoehe: 120,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "stapel eng" },
    h(D.BlattZeile, { nr: 2, titel: "Zugänge" }),
    h(D.BlattZeile, { titel: "Monatsbericht" }));
}`,
    zusammenfassung: "Die Blattzeile steht über einem Abschnitt und nennt das Blatt, etwa „Blatt 02 · Zugänge“.",
    wann: [
      "Über einem Abschnitt auf Papier. Die Nummer wird zweistellig.",
      "Ohne `nr` steht nur der Titel.",
      "Die Versalien setzt das CSS.",
    ],
    props: [
      ["nr", "number", "ohne", "Blattnummer."],
      ["titel", "string", "Pflicht", "Titel des Blatts."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
    ],
    lassen: ["Versalien in den Text schreiben.", "Die Blattzeile auf Nacht; die Nacht-Fassung kommt in Phase 2."],
  },

  /* ---------------- Rahmen ---------------- */
  {
    name: "Kasten",
    gruppe: "Rahmen",
    hoehe: 248,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "stapel" },
    h(D.Kasten, {
      icon: h(D.FunkenIcon, { size: 16 }),
      label: "Lead",
      titel: "Dachdeckerei Muster",
      rechts: h(D.RuhigerKnopf, { groesse: "klein" }, "Öffnen")
    }, "Muster, keine echten Daten."),
    h(D.Kasten, { icon: h(D.LockIcon, { size: 16 }), dunkel: true, label: "Sperre", titel: "Zugang gesperrt" },
      "Der Betrieb hat den Zugang noch nicht freigegeben."));
}`,
    zusammenfassung: "Der Kasten rahmt einen Eintrag mit Icon fein rundum, etwa einen Lead oder eine Sperre.",
    wann: [
      "Für einen hervorgehobenen Eintrag auf einer Arbeitsseite: Icon links, Label, Titel und Unterzeile daneben, rechts optional eine Aktion.",
      "Das Icon steht auf `lime-soft`, mit `dunkel` auf `ink-950`.",
    ],
    props: [
      ["icon", KINDER, "Pflicht", "Icon im Feld links."],
      ["dunkel", "boolean", "false", "Icon-Feld dunkel."],
      ["label", "string", "Pflicht", "Beschriftung über dem Titel."],
      ["titel", "string", "Pflicht", "Titel."],
      ["children", KINDER, "Pflicht", "Unterzeile."],
      ["rechts", KINDER, "ohne", "Aktion rechts."],
    ],
    lassen: ["Rundung, Schatten oder einen farbigen Seitenstreifen: Kästen sind eckig.", "Den Kasten auf Nacht."],
  },
  {
    name: "SucherEcken",
    gruppe: "Rahmen",
    hoehe: 176,
    flaeche: "thema",
    skript: `
function Beispiel() {
  return h(D.SucherEcken, { className: "sucher" },
    h("p", { className: W.beschriftung }, "Pos. 01 · Nächster Schritt"),
    h("p", { className: W.text }, "Die Hauptkarte trägt die Sucher-Ecken."));
}`,
    zusammenfassung: "Die Sucher-Ecken setzen vier 10-px-Winkel in die Ecken eines Rahmens, wie im Kamerasucher.",
    wann: [
      "Für die Hauptkarte einer Fläche.",
      `Die Ecken zeichnen in \`wp-stark\` mit ${komma(MASSE.eckeLinie)} px und sind rein dekorativ (\`aria-hidden\`). Sie stehen auf Papier und Nacht.`,
      "Eine eigene Farbe kommt über die Stellschraube `--ecken-farbe` an einem umgebenden Element, nicht über die Flächenrolle. So folgen die Ecken der Leistungskarte ihrer Linienfarbe.",
      "Sie umschließen ihren Inhalt; `as` wählt das Element, damit auch ein Formular den Rahmen tragen kann. Das Polster setzt der Verbraucher.",
    ],
    props: [
      ["as", "\"div\" \\| \"section\" \\| \"form\"", "\"div\"", "Element."],
      ["className", "string", "ohne", "Zusätzliche Klasse, etwa für das Polster."],
      ["children", KINDER, "Pflicht", "Inhalt."],
      ["…", "HTMLAttributes, onSubmit, noValidate", "ohne", "Attribute des Elements."],
    ],
    lassen: ["Sucher-Ecken an jeder Karte: Sie markieren die Hauptkarte."],
  },
  {
    name: "Info",
    gruppe: "Rahmen",
    hoehe: 120,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "stapel eng" },
    h(D.Info, { icon: h(D.InfoIcon, { size: 14 }) }, "Muster, keine echten Daten."),
    h(D.Info, { icon: h(D.ClockIcon, { size: 14 }), gross: true }, "Nächste Prüfung am 01.11.2026."));
}`,
    zusammenfassung: "Die Info-Zeile stellt ein Icon an die erste Zeile und den Text daneben.",
    wann: ["Für kurze Zusatzangaben auf Arbeitsseiten.", "`gross` setzt `grad-14` und eine dunklere Schrift."],
    props: [
      ["icon", KINDER, "Pflicht", "Icon an der ersten Zeile."],
      ["children", KINDER, "Pflicht", "Text."],
      ["gross", "boolean", "false", "Größere Fassung."],
    ],
    lassen: ["Icons vor jeder Zeile: Icons stehen dort, wo sie etwas bedeuten."],
  },
  {
    name: "Schritte",
    gruppe: "Rahmen",
    hoehe: 216,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h(D.Schritte, {
    schritte: [
      { titel: "Profil prüfen", text: "Name, Anschrift und Öffnungszeiten abgleichen." },
      { text: "Fotos ergänzen." },
      { titel: "Bericht", text: "Muster, keine echten Daten." }
    ]
  });
}`,
    zusammenfassung: "Schritte nummerieren Arbeitsschritte mit 01, 02 und folgenden, je mit optionalem Titel.",
    wann: [
      "Für eine kurze Abfolge in einem Detail oder Kasten.",
      "Die Liste ist ein `<ol>`; die Nummer ist für Vorleser versteckt. `gross` vergrößert den Kreis der Nummer auf 24 px.",
    ],
    props: [
      ["schritte", "{ titel?: string; text: string }[]", "Pflicht", "Die Schritte in Reihenfolge."],
      ["gross", "boolean", "false", "Größere Nummer."],
    ],
    lassen: ["Nummern in den Text schreiben; die Zählung kommt aus der Liste."],
  },
  {
    name: "DetailRahmen",
    gruppe: "Rahmen",
    hoehe: 232,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h(D.DetailRahmen, { label: "Detail Dachdeckerei Muster", spalte: true },
    h(D.Besch, null, "Lead · Musterstadt"),
    h("h3", { className: W.h3, style: { fontSize: "var(--grad-24)" } }, "Dachdeckerei Muster"),
    h(D.Schriftfeld, { felder: [["Gewerk", "Dachdecker"], ["Gegründet", "01.03.2026"]] }));
}`,
    zusammenfassung: "Der Detailrahmen fasst die Detailfläche rechts neben der Liste ein.",
    wann: [
      "Auf Arbeitsseiten mit Liste links und Detail rechts, als `<section>` mit Namen.",
      "`spalte` stapelt den Inhalt. Unter 880 px fallen Rahmen und Polster weg, der Inhalt steht untereinander.",
    ],
    props: [
      ["children", KINDER, "Pflicht", "Inhalt."],
      ["label", "string", "Pflicht", "Name der Fläche (`aria-label`)."],
      ["spalte", "boolean", "false", "Inhalt untereinander."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
    ],
    lassen: ["Schatten oder Rundung: Der Rahmen ist eckig mit Haarlinie."],
  },

  /* ---------------- Listen ---------------- */
  {
    name: "Liste",
    gruppe: "Listen",
    hoehe: 216,
    flaeche: "papier",
    skript: `
function Beispiel() {
  var s = React.useState("a");
  return h(D.Liste, { label: "Leads", inKarte: true },
    h(D.Gruppe, { titel: "Heute", zahl: 2 }),
    h(D.Listenzeile, { id: "a", href: "#a", aktiv: s[0] === "a", titel: "Dachdeckerei Muster", unter: "Musterstadt", onWaehle: s[1] }),
    h(D.Listenzeile, { id: "b", href: "#b", aktiv: s[0] === "b", titel: "Musterbetrieb", unter: "Musterdorf", onWaehle: s[1] }));
}`,
    zusammenfassung: "Die Liste ist die linke Spalte der Arbeitsfläche: ein `<ul>` mit Gruppenköpfen und Listenzeilen.",
    wann: [
      "Für Einträge, aus denen einer ins Detail rechts gewählt wird.",
      "Kinder sind `Gruppe`, `GruppeBlock` und `Listenzeile`.",
      "`inKarte` setzt die Liste in eine Karte mit Rahmen; am Handy läuft sie dann nicht randlos.",
    ],
    props: [
      ["label", "string", "Pflicht", "Name der Liste (`aria-label`)."],
      ["inKarte", "boolean", "false", "Liste in einer Karte."],
      ["children", KINDER, "Pflicht", "Gruppenköpfe und Zeilen."],
    ],
    lassen: ["Andere Elemente als `<li>` direkt in der Liste."],
  },
  {
    name: "Gruppe",
    gruppe: "Listen",
    hoehe: 176,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h(D.Liste, { label: "Leads", inKarte: true },
    h(D.Gruppe, { titel: "Heute", zahl: 1 }),
    h(D.Listenzeile, { id: "a", href: "#a", aktiv: false, titel: "Dachdeckerei Muster", unter: "Musterstadt", onWaehle: nichts }),
    h(D.Gruppe, { titel: "Diese Woche", zahl: 0 }));
}`,
    zusammenfassung: "Die Gruppe ist ein Gruppenkopf in der Liste, mit Titel links und Zahl rechts.",
    wann: ["Zwischen Listenzeilen, um sie zu ordnen. Sie ist ein `<li>` und steht direkt in `Liste`."],
    props: [
      ["titel", "string", "Pflicht", "Titel der Gruppe."],
      ["zahl", "number", "Pflicht", "Zahl der Einträge."],
    ],
    lassen: ["Die Gruppe außerhalb einer `Liste`."],
  },
  {
    name: "GruppeBlock",
    gruppe: "Listen",
    hoehe: 208,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h(D.Liste, { label: "Leads", inKarte: true },
    h(D.GruppeBlock, { titel: "Heute", zahl: 2 },
      h(D.Listenzeile, { id: "a", href: "#a", aktiv: false, titel: "Dachdeckerei Muster", unter: "Musterstadt", onWaehle: nichts }),
      h(D.Listenzeile, { id: "b", href: "#b", aktiv: false, titel: "Musterbetrieb", unter: "Musterdorf", onWaehle: nichts })));
}`,
    zusammenfassung: "Der Gruppenblock setzt einen Gruppenkopf und die Zeilen darunter, ohne eigenes Element.",
    wann: ["Wenn Gruppen aus Daten entstehen: je Gruppe ein Block mit ihren Zeilen in einer `Liste`."],
    props: [
      ["titel", "string", "Pflicht", "Titel der Gruppe."],
      ["zahl", "number", "Pflicht", "Zahl der Einträge."],
      ["children", KINDER, "Pflicht", "Die Listenzeilen der Gruppe."],
    ],
    lassen: ["Den Gruppenblock außerhalb einer `Liste`."],
  },
  {
    name: "Listenzeile",
    gruppe: "Listen",
    hoehe: 296,
    flaeche: "papier",
    skript: `
function Beispiel() {
  var s = React.useState("a");
  return h(D.Liste, { label: "Leads", inKarte: true },
    h(D.Listenzeile, { id: "a", href: "#a", aktiv: s[0] === "a", titel: "Dachdeckerei Muster", unter: "Gewählt", onWaehle: s[1],
      rechts: h(D.Etikett, { art: "lead" }, "Neu") }),
    h(D.Listenzeile, { id: "b", href: "#b", aktiv: s[0] === "b", titel: "Musterbetrieb", unter: "Zugang fehlt", unterArt: "warn",
      unterIcon: h(D.AlertTriangleIcon, { size: 12 }), onWaehle: s[1] }),
    h(D.Listenzeile, { id: "c", href: "#c", aktiv: s[0] === "c", titel: "Muster Bau", unter: "Geprüft", unterArt: "haken",
      unterIcon: h(D.CheckIcon, { size: 12 }), onWaehle: s[1] }),
    h(D.Listenzeile, { id: "d", href: "#d", aktiv: s[0] === "d", titel: "Muster Holz", unter: "Verworfen", gedimmt: true, onWaehle: s[1],
      nachLink: h("button", { type: "button", className: D.WERKPLAN_FLAECHE.textlink + " " + D.WERKPLAN_FLAECHE.zeileRueck }, "Rückgängig") }));
}`,
    zusammenfassung: "Die Listenzeile ist ein echter Link; ein einfacher Klick wählt den Eintrag ohne Neuladen.",
    wann: [
      "Als Zeile in `Liste`: Titel, Unterzeile mit optionalem Icon, rechts optional ein Etikett oder eine Zahl.",
      "Die gewählte Zeile (`aktiv`) ist weiß mit 2 px Innenlinie und trägt `aria-current`.",
      "Meta, Strg, Umschalt oder Mittelklick öffnen den Link wie gewohnt (`einfacherKlick`).",
      "`unterArt` färbt die Unterzeile als Warnung oder Haken, `gedimmt` setzt die Zeile zurück.",
      "`nachLink` steht neben dem Link, etwa „Rückgängig“ mit `WERKPLAN_FLAECHE.textlink` und `WERKPLAN_FLAECHE.zeileRueck`.",
    ],
    props: [
      ["id", "string", "Pflicht", "Kennung; der Link bekommt die id `zeile-<id>`."],
      ["href", "string", "Pflicht", "Ziel des Links."],
      ["aktiv", "boolean", "Pflicht", "Gewählte Zeile."],
      ["titel", "string", "Pflicht", "Titel."],
      ["unter", "string", "Pflicht", "Unterzeile."],
      ["unterIcon", KINDER, "ohne", "Icon vor der Unterzeile."],
      ["unterArt", "\"warn\" \\| \"haken\"", "ohne", "Art der Unterzeile."],
      ["rechts", KINDER, "ohne", "Inhalt rechts."],
      ["gedimmt", "boolean", "false", "Zeile zurückgesetzt."],
      ["nachLink", KINDER, "ohne", "Element neben dem Link."],
      ["onWaehle", "(id: string) => void", "Pflicht", "Wählt die Zeile ohne Neuladen."],
      ["className", "string", "ohne", "Zusätzliche Klasse am Link."],
    ],
    lassen: ["Links oder Knöpfe im Link: Zusatzaktionen gehören in `nachLink`.", "Einen Farbbalken für die gewählte Zeile."],
  },
  {
    name: "Filterleiste",
    gruppe: "Listen",
    hoehe: 120,
    flaeche: "papier",
    skript: `
function Beispiel() {
  var s = React.useState("neu");
  return h(D.Filterleiste, {
    label: "Bereiche",
    eintraege: [{ wert: "neu", label: "Neu", zahl: 4 }, { wert: "offen", label: "Offen", zahl: 2 }, { wert: "erledigt", label: "Erledigt", zahl: 7 }],
    aktiv: s[0],
    hrefFuer: function (w) { return "#" + w; },
    onWaehle: s[1]
  });
}`,
    zusammenfassung: "Die Filterleiste wählt Bereiche über der Liste; jeder Knopf ist ein echter Link mit einer Zahl.",
    wann: [
      "Über einer `Liste`, um zwischen Bereichen zu wechseln.",
      "Ein einfacher Klick wählt ohne Neuladen, der aktive Bereich trägt `aria-current=\"page\"`.",
      "`WERKPLAN_FLAECHE.filterKnopf` und `WERKPLAN_FLAECHE.filterZahl` geben einem eigenen Schalter dasselbe Aussehen.",
    ],
    props: [
      ["label", "string", "Pflicht", "Name der Leiste (`aria-label`)."],
      ["eintraege", "FilterEintrag[]", "Pflicht", "Je Bereich `wert`, `label` und `zahl`."],
      ["aktiv", "T", "Pflicht", "Wert des aktiven Bereichs."],
      ["hrefFuer", "(wert: T) => string", "Pflicht", "Ziel je Bereich."],
      ["onWaehle", "(wert: T) => void", "Pflicht", "Wählt den Bereich ohne Neuladen."],
    ],
    lassen: ["Knöpfe ohne Ziel: Jeder Bereich ist ein Link."],
  },

  /* ---------------- Kundenseite ---------------- */
  {
    name: "Reiter",
    gruppe: "Kundenseite",
    hoehe: 160,
    breite: 1100,
    untertitel: "Ab 1024 px die Reiter-Leiste",
    flaeche: "nacht",
    skript: `
function Beispiel() {
  return h("div", { className: "kopfzeile" },
    h(D.Logo, { variant: "dark", height: 28 }),
    h(D.Reiter, {
      aktiv: "start",
      wartend: 2,
      eintraege: [
        { kennung: "start", name: "Start", href: "#start" },
        { kennung: "profil", name: "Profil", href: "#profil", stand: { text: "2 warten auf Sie", art: "hervor" } },
        { kennung: "bewertungen", name: "Bewertungen", href: "#bewertungen" },
        { kennung: "zugaenge", name: "Zugänge", href: "#zugaenge", stand: { text: "Fehlt", art: "fehler" } },
        { kennung: "bericht", name: "Bericht", href: null }
      ]
    }));
}`,
    zusammenfassung:
      "Der Reiter ist die Navigation der Kundenseite: ab 1024 px eine Reiter-Leiste, darunter ein Menü als `<details>` ohne Client-JavaScript.",
    wann: [
      "Im Kopf der Kundenseite auf Nacht. Der aktive Reiter trägt den Lime-Unterstrich und `aria-current=\"page\"`.",
      "Unter 1024 px steht der Knopf „Menü“ mit der Zahl wartender Schritte; die Menütafel zeigt dieselben Reiter mit ihrem Stand.",
      "Die Zeile der App muss positioniert sein (`position: relative`), denn die Menütafel legt sich darunter über die volle Breite.",
      "Logo, Pille „Sicher angemeldet“ und der Weg zu „Wer hat Zugriff“ setzt die App.",
      "Die Standardtexte sind in Sie-Form (`REITER_TEXTE`).",
    ],
    props: [
      ["eintraege", "readonly ReiterEintrag[]", "Pflicht", "Je Reiter `kennung`, `name`, `href` (null heißt ohne Funktion) und optional `stand` mit `text` und `art`."],
      ["aktiv", "string \\| null", "Pflicht", "Kennung des aktiven Reiters."],
      ["wartend", "number", "0", "Zahl wartender Schritte am Menüknopf."],
      ["texte", "ReiterTexte", "REITER_TEXTE", "Namen von Leiste, Menü und Menüliste."],
      ["ende", KINDER, "ohne", "Letztes Kind der Menüliste, bringt sein `<li>` selbst mit."],
    ],
    lassen: [
      "Den Reiter auf Papier: Die nicht aktiven Reiter (`ink-300`) und die Menütafel (`ink-950`) sind für Nacht gesetzt.",
      "Eine Zeile ohne Positionierung um den Reiter.",
    ],
  },
  {
    name: "KapitelLeiste",
    gruppe: "Kundenseite",
    hoehe: 176,
    flaeche: "papier",
    skript: `
function Beispiel() {
  return h("div", { className: "seitenluft" },
    h(D.KapitelLeiste, {
      titel: "Inhalt",
      stand: "Stand 28.10.2026",
      kapitel: [{ id: "k-profil", name: "Profil" }, { id: "k-bewertungen", name: "Bewertungen" }, { id: "k-bericht", name: "Bericht" }]
    }));
}`,
    zusammenfassung:
      "Die Kapitelleiste listet die Kapitel einer langen Seite: am Handy als Chip-Leiste über den Kapiteln, ab 1024 px links daneben und mitlaufend.",
    wann: [
      "Auf langen Seiten der Kundenseite mit mehreren Kapiteln, deren Köpfe die ids aus `kapitel` tragen.",
      "Markiert ist das letzte Kapitel, dessen Kopf das obere Drittel des Fensters erreicht hat, am Seitenende das letzte. Ohne JavaScript bleibt sie eine Liste von Sprungmarken.",
      "Die negativen Ränder am Handy gleichen die Seitenluft der Kundenseite aus (20 px, ab 768 px 32 px). Das Raster daneben setzt die Seite. Client-Komponente.",
    ],
    props: [
      ["titel", "string", "Pflicht", "Titel und Name der Leiste."],
      ["kapitel", "readonly KapitelEintrag[]", "Pflicht", "Je Kapitel `id` und `name`."],
      ["stand", "string", "Pflicht", "Zeile unter der Liste, etwa der Stand."],
      ["kapitelNr", "(nummer: number) => string", "kapitelNummer", "Nummer je Kapitel, Standard zweistellig („01“)."],
    ],
    lassen: ["Die Kapitelleiste auf Nacht: Ihr Grund ist `ink-100`."],
  },
  {
    name: "ZiffernFelder",
    gruppe: "Kundenseite",
    hoehe: 216,
    flaeche: "nacht",
    skript: `
function Beispiel() {
  var a = React.useState(["4", "2", "", "", "", ""]);
  var b = React.useState(["1", "2", "3", "4", "5", "6"]);
  return h("div", { className: "stapel" },
    h(D.ZiffernFelder, { ziffern: a[0], aendern: function (f) { a[1](f); }, fehlerId: null, fokusAnlass: 0 }),
    h("div", { className: "stapel eng" },
      h(D.ZiffernFelder, { ziffern: b[0], aendern: function (f) { b[1](f); }, fehlerId: "code-fehler", fokusAnlass: 0 }),
      h("p", { id: "code-fehler", className: W.text }, "Der Code stimmt nicht. Bitte prüfen Sie die Ziffern.")));
}`,
    zusammenfassung:
      "Die Ziffernfelder nehmen einen Code Ziffer für Ziffer auf; Einfügen oder Autofill verteilen einen ganzen Code auf alle Felder.",
    wann: [
      "Für die Code-Eingabe der Kundenseite, etwa bei der Anmeldung auf Nacht.",
      "Die Felder sind gesteuert: `ziffern` kommt von der App, `aendern` bekommt eine Funktion vom alten zum neuen Stand.",
      "Rücktaste und Pfeile springen zwischen den Feldern; jede neue Antwort (`fokusAnlass`) setzt den Fokus ins erste Feld.",
      "Die Länge ist die Länge von `ziffern`, Standard 6 (`CODE_LAENGE_STANDARD`, `leereZiffern()`).",
      "Die Felder haben keinen `name`; abgeschickt wird ein verborgenes Feld, das die App aus `ziffern` setzt. Client-Komponente.",
    ],
    props: [
      ["ziffern", "readonly string[]", "Pflicht", "Je Feld eine Ziffer oder leer."],
      ["aendern", "(neu: (vorher: string[]) => string[]) => void", "Pflicht", "Übernimmt eine Änderung."],
      ["fehlerId", "string \\| null", "Pflicht", "id des Fehlertexts; gesetzt heißt ungültig."],
      ["fokusAnlass", "unknown", "Pflicht", "Jeder neue Wert setzt den Fokus ins erste Feld."],
      ["zifferLabel", "(nummer, laenge) => string", "zifferLabelStandard", "Name je Feld, Standard „Ziffer 1 von 6“."],
    ],
    lassen: [
      "Die Ziffernfelder auf Papier: Das helle Rot am ungültigen Feld ist für Nacht gesetzt.",
      "Einen `name` an den Feldern erwarten.",
    ],
  },
  {
    name: "Eingabefeld",
    gruppe: "Kundenseite",
    hoehe: 336,
    flaeche: "thema",
    skript: `
function Beispiel() {
  return h("div", { className: "stapel schmal" },
    h(D.Eingabefeld, { label: "Name des Betriebs", hinweis: "So steht er im Google-Profil.", defaultValue: "Dachdeckerei Muster" }),
    h(D.Eingabefeld, { label: "Was stimmt nicht?", mehrzeilig: true, fehler: "Bitte beschreiben Sie den Fehler in einem Satz." }));
}`,
    zusammenfassung:
      "Das Eingabefeld setzt das Label über das Feld und darunter Hinweis und Fehlertext, beide per `aria-describedby` am Feld.",
    wann: [
      "Für Text- und Mehrzeilenfelder der Kundenseite.",
      "Das Feld ist weiß mit dunkler Schrift, auf Papier wie auf Nacht; Label und Texte folgen der Fläche.",
      "Ein Fehler setzt `aria-invalid` und wird über `role=\"alert\"` angesagt. Ohne `id` vergibt React eine.",
      "Alle übrigen Attribute gehen an das Feld.",
    ],
    props: [
      ["label", KINDER, "Pflicht", "Label über dem Feld."],
      ["hinweis", KINDER, "ohne", "Hinweis unter dem Feld, im Stil der Quellenzeile."],
      ["fehler", KINDER, "ohne", "Fehlertext; vorhanden heißt ungültig."],
      ["mehrzeilig", "boolean", "false", "Mehrzeiliges Feld (`<textarea>`, mindestens 96 px hoch)."],
      ["id", "string", "ohne", "id des Felds."],
      ["className", "string", "ohne", "Zusätzliche Klasse am Feld."],
      ["…", "Input- oder TextareaHTMLAttributes", "ohne", "Alle Attribute des Felds."],
    ],
    lassen: ["Ein eigenes Label daneben: `label` ist Pflicht und hängt am Feld."],
  },

  /* ---------------- Marke ---------------- */
  {
    name: "Logo",
    gruppe: "Marke",
    hoehe: 136,
    flaeche: "beide",
    skript: `
function Beispiel(p) {
  var variant = p.nacht ? "dark" : "light";
  return h("div", { className: "reihe" },
    h(D.Logo, { variant: variant }),
    h(D.Logo, { variant: variant, height: 24, href: "#start" }));
}`,
    zusammenfassung:
      "Das Logo ist die echte Wortmarke von powerhandwerk mit Standort-Pin und „handwerk“ auf der Lime-Pille, je eine Fassung für helle und dunkle Flächen.",
    wann: [
      "`variant=\"light\"` auf Papier („power“ in Ink), `variant=\"dark\"` auf Nacht („power“ hell, freigestellt).",
      "Mit `href` ist es ein Link mit dem Namen aus `linkLabel`, ohne ein reines Bild. `as` reicht eine Link-Komponente der App durch.",
    ],
    props: [
      ["variant", "\"light\" \\| \"dark\"", "\"light\"", "Fassung für helle oder dunkle Flächen."],
      ["height", "number \\| string", "34", "Höhe; die Breite folgt."],
      ["className", "string", "ohne", "Zusätzliche Klasse."],
      ["style", "CSSProperties", "ohne", "Stil der Hülle."],
      ["href", "string", "ohne", "Ziel; mit `href` ein Link."],
      ["linkLabel", "string", "\"powerhandwerk Startseite\"", "Name des Links für Vorleser."],
      ["as", "ElementType", "\"a\"", "Element des Links."],
    ],
    lassen: ["Das Logo nachzeichnen.", "Die helle Fassung auf Nacht oder die dunkle auf Papier."],
  },

  /* ---------------- Grafik ---------------- */
  {
    name: "Leistungskarten",
    gruppe: "Grafik",
    hoehe: 740,
    flaeche: "beide",
    skript: `
function Beispiel(p) {
  var szene = p.nacht ? "sanierung" : "profil";
  var karten = D.LEISTUNGSKARTEN_MUSTER.filter(function (k) { return k.szene === szene; });
  return h("div", { className: "stapel schmal" },
    h(D.Leistungskarten, { karten: karten, szenen: D.LEISTUNGSKARTEN_BEISPIELE, untergrund: p.u }),
    h("p", { className: W.beschriftung }, "Muster, keine echten Daten."));
}`,
    zusammenfassung:
      "Die Leistungskarte erklärt eine Leistung mit einer animierten isometrischen Figur auf einer Bühne mit Sucher-Ecken, darüber Titel und Nummer, darunter der Text (Grafikstil A).",
    wann: [
      "Um Leistungen und Angebote zu erklären, auf Papier oder auf Nacht.",
      "Jede Figur hat eine Geste: Der Wert `t` läuft von 0 (Ruhe) bis 1 (Geste fertig).",
      `Aktiv wird eine Karte bei Hover, bei Tastaturfokus und am Handy einmal beim Hineinscrollen. Dann kippt sie um ${komma(GRAFIK.kippGrad)}°, hebt sich ohne Schatten um ${GRAFIK.hebenPx} px an und wechselt auf die Gegenfläche. Die breite Karte kippt ab 600 px Breite flacher: um ${komma(GRAFIK.kippGradBreit)}°, ${GRAFIK.hebenPxBreit} px angehoben, ohne Vergrößerung; darunter kippt sie wie jede andere Karte.`,
      "Im Server-HTML steht jede Szene im Ruhezustand. Bei reduzierter Bewegung steht die Geste sofort am Ende. Ohne `matchMedia` gilt das Gerät als ohne Hover. Ohne Hover spielt die Geste, sobald die Karte zum Sichtanteil im Bild ist; fehlt dort der `IntersectionObserver`, steht sofort das Ende. Mit Hover bleibt die Karte in Ruhe bis Hover oder Fokus.",
      "Szenen sind Funktionen und überqueren die Grenze zwischen Server und Client nicht. Das Szenen-Register liegt deshalb in einem eigenen Client-Modul (`\"use client\"`) als feste Modulkonstante; die Seite reicht nur `karten` weiter.",
      "Karten, deren `szene` im Register fehlt, fallen weg. Vier Karten stehen 2 × 2 oder in einer Reihe; `breit` legt eine einzelne Karte quer über die volle Breite.",
      "Neue Szenen zeichnen mit dem Werkzeug `w` der Engine (`leistungskarten-engine`) und den Formen-Helfern (`leistungskarten-formen`). Beispiele: `LEISTUNGSKARTEN_BEISPIELE` mit `profil` und `sanierung`, Musterkarten `LEISTUNGSKARTEN_MUSTER`.",
    ],
    props: [
      ["karten", "readonly LeistungsKarte[]", "Pflicht", "Karten mit `szene`, `titel`, `teaser` und optional `nr` und `schliesst`."],
      ["szenen", "SzenenRegister", "Pflicht", "Szenen-Register: Schlüssel aus `szene` auf die Szene, als feste Referenz."],
      ["untergrund", "\"papier\" \\| \"nacht\"", "Pflicht", "Fläche, auf der die Karten stehen."],
      ["breit", "boolean", "false", "Eine Karte quer über die volle Breite, Bühne links, Text rechts."],
    ],
    lassen: [
      "Mehr als ein Lime-Motiv in einer Figur. Ein Motiv darf aus mehreren Flächen bestehen, wenn sie zusammen eine Aussage tragen, etwa fünf Sterne.",
      "Eine Figur ohne Geste.",
      "Eine Szene freihand statt mit Engine und Formen-Helfern.",
      "Text an `w.text()` vorbei: Eigenes Markup mit Text umginge das Escapen, das Markup geht per `innerHTML` ins SVG.",
    ],
  },
  {
    name: "IsoSzene",
    gruppe: "Grafik",
    hoehe: 600,
    flaeche: "nacht",
    skript: `
var ZEICHNUNG = D.explosionProfil({ idPraefix: "vorschau-" });
function Beispiel() {
  return h("div", { className: "schmal" },
    h(D.IsoSzene, {
      zeichnung: ZEICHNUNG,
      stufen: D.EXPLOSION_STUFEN,
      beschreibung: "Explosionszeichnung eines Profils: vier Bauteile rasten nacheinander in die Profil-Tafel ein.",
      unterschrift: "Muster, keine echten Daten."
    }));
}`,
    zusammenfassung:
      "Die Iso-Szene erklärt einen Ablauf in Stufen: eine isometrische Zeichnung auf Nacht, deren Teile nacheinander einrasten und leuchten (Grafikstil B).",
    wann: [
      "Um Abläufe und Zerlegungen zu erklären, etwa die Explosionszeichnung eines Profils (`explosionProfil`, " + EXPLOSION_STUFEN + " Stufen in `EXPLOSION_STUFEN`).",
      `Ist die Zeichnung zu ${GRAFIK.isoStartAnteil * 100} % im Bild, rastet einmal Stufe 1 bis \`stufen\` im Takt von ${GRAFIK.isoTaktMs} ms ein (\`data-stand\` 0 bis \`stufen\`).`,
      "Im Server-HTML steht `data-stand=\"0\"`. Bei reduzierter Bewegung, ohne `matchMedia` oder ohne `IntersectionObserver` stehen sofort alle Stufen.",
      "Die Zeichnung ist nur Daten (`viewBox`, `knoten`, `klasse`, `stil`): Eine Server-Komponente rechnet sie und reicht sie an `IsoSzene`. `idPraefix` beim Rechnen macht die Filter-IDs je Seite eindeutig, im Client liefert es `useSvgPraefix`.",
      "Lime heißt „eingeschaltet“ und darf an mehreren Teilen leuchten. `fokus` hebt eine Stufe hervor, ohne den Ablauf zu ändern.",
    ],
    props: [
      ["zeichnung", "IsoZeichnung", "Pflicht", "`{ viewBox, knoten, klasse?, stil? }`, etwa aus `explosionProfil()`."],
      ["stufen", "number", "Pflicht", "So viele Stufen rasten nacheinander ein."],
      ["beschreibung", "string", "Pflicht", "Was die Grafik zeigt, für Vorleser (`aria-label`)."],
      ["unterschrift", KINDER, "ohne", "Unterschrift unter der Zeichnung."],
      ["fokus", "number", "ohne", "Hebt eine Stufe hervor (`data-fokus`)."],
      ["className", "string", "ohne", "Zusätzliche Klasse der Bühne."],
    ],
    lassen: [
      "Lime ohne Bedeutung: Lime heißt „eingeschaltet“.",
      "Text als Attribut. Texte stehen als Kinder im Knotenbaum, React escapt sie.",
      "Eine Grafik ohne Beschreibung.",
    ],
  },
  {
    name: "IsoKnoten",
    gruppe: "Grafik",
    hoehe: 300,
    flaeche: "nacht",
    skript: `
var E = D.isoElement;
var KERN = D.isoKernel({ rot: -0.35, cx: 60, cy: 60 });
KERN.merk([0, 0, 0], [120, 0, 0], [0, 120, 0], [120, 120, 0]);
var KNOTEN = [
  E("style", null, ".face { fill: var(--ink-900); stroke: var(--ink-500); stroke-width: 1; } .top { fill: var(--ink-800); } .platte { fill: none; stroke: var(--ink-500); stroke-dasharray: 3 3; } .an { fill: var(--lime); }"),
  KERN.auf(KERN.TOP(0, 0, 0), E("rect", { className: "platte", width: 120, height: 120 })),
  KERN.box(30, 30, 0, 60, 60, 44),
  KERN.auf(KERN.TOP(50, 50, 44), E("rect", { className: "an", width: 20, height: 20 }))
];
var RAHMEN = KERN.bbox(8);
function Beispiel() {
  return h("figure", { className: "stapel eng" },
    h("svg", { viewBox: RAHMEN.viewBox, width: 280, role: "img", "aria-label": "Quader mit Lime-Fläche auf einer Grundplatte" },
      h(D.IsoKnoten, { knoten: KNOTEN })),
    h("figcaption", { className: W.beschriftung }, "Grundplatte und Quader aus dem Iso-Kern."));
}`,
    zusammenfassung:
      "Der Renderer `IsoKnoten` macht aus dem Knotenbaum des Iso-Kerns SVG-Elemente, auf dem Server wie im Browser und ohne Zustand.",
    wann: [
      "So zeichnet man mit dem Kern: `isoKernel({ rot, cx, cy, K })` liefert je Zeichnung die Projektion `P`, die Flächen `TOP`, `FRONT` und `SIDE`, Quader mit `box`, Pfade mit `path3` und aus allen gemerkten Punkten mit `bbox()` die viewBox.",
      "Knoten baut `isoElement(tag, attrs, ...kinder)` wie `createElement`, nur ohne React. Attribute stehen in React-Schreibweise (`className`, `strokeWidth`).",
      "`K` bildet Klassennamen auf die Namen des eigenen CSS-Moduls ab. Die Farben liefert die Iso-Palette (`isopalette.module.css`), die `IsoSzene` ans SVG setzt.",
      "Leuchtfilter mit `filterDefs`, Sterne mit `sternPfad`. Knoten mit `tag: \"slot\"` ersetzt `IsoKnoten` durch `slots[name]`, für Inhalte, die erst zur Laufzeit feststehen.",
    ],
    props: [
      ["knoten", "Knoten \\| string \\| readonly (Knoten \\| string)[]", "Pflicht", "Knotenbaum `{ tag, attrs, kids }` aus dem Iso-Kern."],
      ["slots", "Readonly<Record<string, ReactNode>>", "ohne", "Inhalte für die Knoten mit `tag: \"slot\"`."],
    ],
    lassen: [
      "Eine Figur freihand als SVG statt mit dem Iso-Kern.",
      "Text als Attribut statt als Kind.",
      "Feste Filter-IDs: Sie bekommen ein Präfix je Seite.",
    ],
  },
];

/**
 * Schaukarte ohne README und ohne Export des Bündels; Vorschau wie bei einem
 * Baustein. `name` ist der Ordnername unter components/, nur Buchstaben.
 */
export type Schaukarte = Pick<Baustein, "name" | "gruppe" | "hoehe" | "untertitel" | "flaeche" | "skript">;

/**
 * Schaukarten (`page`). Im Skript steht zusätzlich `NAMEN`, alle `*Icon`-
 * Exporte. Die Icons-Karte zeigt `AboIcon` je Paket statt einmal.
 */
export const SCHAUKARTEN: Schaukarte[] = [
  {
    name: "Icons",
    gruppe: "Marke",
    hoehe: 600,
    flaeche: "thema",
    skript: `
function Beispiel() {
  return h("div", { className: "icons" },
    NAMEN.filter(function (n) { return n !== "AboIcon"; }).map(function (n) {
      return h("figure", { key: n, className: "icon" }, h(D[n], { size: 24 }), h("figcaption", null, n));
    }),
    D.PAKETE.map(function (paket) {
      return h("figure", { key: "abo-" + paket, className: "icon" }, h(D.AboIcon, { paket: paket, size: 24 }), h("figcaption", null, "AboIcon " + paket));
    }));
}`,
  },
  {
    name: "PaketEmbleme",
    gruppe: "Grafik",
    hoehe: 340,
    untertitel: "Paket-Embleme",
    flaeche: "beide",
    skript: `
var GROESSEN = [44, 28, 20, 16];
function Beispiel() {
  return h("div", { className: "stapel" },
    D.PAKETE.map(function (paket) {
      return h("div", { key: paket, className: "reihe" },
        GROESSEN.map(function (g) { return h(D.AboIcon, { key: g, paket: paket, size: g }); }),
        h("span", { className: W.beschriftung }, paket));
    }),
    h("p", { className: W.text + " schmal" },
      "Ein Abo-Name steht nie ohne sein Emblem. Die Ringe nehmen die Schriftfarbe der Fläche, der Schwenk ist Lime. Der Strich misst ${komma(ABO_ICON_STROKE_WIDTH)} im 24er-Raster (ABO_ICON_STROKE_WIDTH), so bleibt er auch bei 16 px über einem Pixel."));
}`,
  },
];
