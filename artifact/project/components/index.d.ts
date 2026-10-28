// Typen des DS Werkplan 2.0, erzeugt aus src/ mit `bun run bundle`. Nicht von Hand ändern.
// Im Bündel (bundle.js) stehen alle Werte unter window.DsWerkplan.

import type React from "react";
import type { InputHTMLAttributes, ReactNode, SVGProps, TextareaHTMLAttributes } from "react";

/* ---- Bausteine ---- */

/**
 * Kleine Werkplan-Bausteine des DS Werkplan 2.0 (ADR-261) für Arbeitsseiten
 * (Leinwand Gründungsradar, Tafel 0b): ruhiger und fester Knopf, Etiketten, Hinweisband, Tastenkappe,
 * Toast. Ohne "use client" und ohne Zustand; Icons kommen als Knoten vom
 * Aufrufer, damit die Bausteine keine Icon-Sammlung festlegen.
 */
/** Klassen für Aufrufer, die einen fremden Knopf so aussehen lassen (z. B. confirmProps). */
export declare const WERKPLAN_KNOPF: {
    fest: string;
    ruhig: string;
    lichtkanteKlein: string;
    lichtkanteVoll: string;
    lichtkanteHandy: string;
};
/** Setzt die Warnfarben und Linien, die die Bausteine lesen; an die Seite hängen. */
export declare const WERKPLAN_BAUSTEINE_SEITE: string;
/** Hebt ein Wort mit dem Lime-Unterstrich hervor; ersetzt im Werkplan die Marker-Pille (Flo 24.10.2026). */
export declare function Unterstrich({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
type KnopfGroesse = "normal" | "klein" | "handy";
export declare function RuhigerKnopf({ icon, children, nacht, groesse, className, ...rest }: {
    icon?: React.ReactNode;
    nacht?: boolean;
    groesse?: KnopfGroesse;
} & React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element;
/** Fester Knopf: nur als Bestätigung in Dialogen. */
export declare function FesterKnopf({ icon, children, className, ...rest }: {
    icon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element;
export type EtikettArt = "linie" | "gestrichelt" | "voll" | "lead" | "warn" | "still";
export declare function Etikett({ art, icon, children, className }: {
    art?: EtikettArt;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
/** Hinweisband: Rahmen und Fläche in Warnfarbe, Icon an der ersten Zeile, nie ein Seitenbalken. */
export declare function Hinweisband({ icon, titel, children, aktion }: {
    icon: React.ReactNode;
    titel: string;
    children?: React.ReactNode;
    aktion?: React.ReactNode;
}): React.JSX.Element;
export declare function Tastenkappe({ children, nacht }: {
    children: React.ReactNode;
    nacht?: boolean;
}): React.JSX.Element;
/**
 * Bestätigung unten in der Mitte mit optionaler Aktion (etwa „Rückgängig“); role="status".
 * `ohneLiveRegion`: die Seite sagt den Text selbst über den StatusAnnouncer an (der Toast
 * kommt mit seinem Text ins DOM und bliebe als Live-Region in vielen Screenreadern stumm).
 */
export declare function Toast({ haken, text, aktion, ohneLiveRegion, }: {
    haken: React.ReactNode;
    text: string;
    aktion?: {
        label: string;
        icon?: React.ReactNode;
        taste?: string;
        onClick: () => void;
    };
    ohneLiveRegion?: boolean;
}): React.JSX.Element;

/* ---- LichtkanteButton ---- */

/**
 * Lichtkante: der Hauptknopf des DS Werkplan 2.0 (ADR-261). Mit `href` ein Link
 * (Monatsbericht „Ihr Schritt“, Zugangs-Seite), sonst ein echter <button>
 * (Standard `type="button"`). Bewusst ohne "use client" und ohne
 * Server-Importe, damit Client-Formulare ihn einbinden können. Alle Gestaltung
 * steckt in lichtkante.module.css. Mit `extern` öffnet der Link eine fremde
 * Seite in neuem Tab (Pfeil schräg nach oben; Agenten-Leitstand, ADR-228).
 */
export type LichtkanteButtonProps = {
    href?: string;
    type?: "submit" | "button";
    untergrund?: "nacht" | "papier";
    disabled?: boolean;
    className?: string;
    /** Nur mit `href`: fremde Seite, neuer Tab, Pfeil schräg nach oben. */
    extern?: boolean;
    /** Nur ohne `href` und nur aus Client-Komponenten (Rundgang der Kundenseite). */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
};
export declare function LichtkanteButton({ href, type, untergrund, disabled, className, extern, onClick, children, }: LichtkanteButtonProps): React.JSX.Element;

/* ---- Arbeitsflaeche ---- */

/**
 * Werkplan-Arbeitsfläche des DS Werkplan 2.0 (ADR-261) für Seiten mit Liste
 * links und Detail rechts (Leinwand Gründungsradar, Variante 1). Beschriftung, Messwert, Schriftfeld, Info-Zeile, Kasten, Schritte,
 * Icon-Knopf, Filterleiste, Fortschritt, Liste mit Gruppen und Zeilen,
 * Detailrahmen. Ohne "use client" und ohne Zustand; Icons kommen als Knoten vom
 * Aufrufer, damit die Bausteine keine Icon-Sammlung festlegen. Die Seite trägt
 * WERKPLAN_BAUSTEINE_SEITE und die .seite aus werkplan.module.css.
 */
/** Klassen für Aufrufer, die ein eigenes Element so aussehen lassen (Lade-Gerüst, Icon-Knopf als Link, Filterknopf als Schalter). */
export declare const WERKPLAN_FLAECHE: {
    liste: string;
    zeile: string;
    leer: string;
    info: string;
    textlink: string;
    zeileRueck: string;
    iconKnopf: string;
    filterKnopf: string;
    filterZahl: string;
};
/** Klick ohne Taste und mit links wählt ohne Neuladen; Meta, Strg, Umschalt oder Mittelklick öffnen den Link wie gewohnt. */
export declare function einfacherKlick(e: React.MouseEvent<HTMLAnchorElement>, waehle: () => void): void;
export declare function Besch({ children, gross, stark, className, as: Tag, }: {
    children: React.ReactNode;
    gross?: boolean;
    stark?: boolean;
    className?: string;
    as?: "span" | "p" | "h2" | "h3";
}): React.JSX.Element;
export declare function Messwert({ children, groesse, farbe }: {
    children: React.ReactNode;
    groesse: number;
    farbe?: string;
}): React.JSX.Element;
/**
 * Schriftfeld wie auf den Tafeln: Label in Beschriftung, Wert in Barlow-Versalien, 1-px-Fugen.
 * `letzteBreit`: das letzte Feld nimmt den Rest (Notiz, Online geprüft), wie die Tafeln mit max-content und 1fr.
 */
export declare function Schriftfeld({ felder, voll, letzteBreit, className, }: {
    felder: [string, React.ReactNode][];
    voll?: boolean;
    letzteBreit?: boolean;
    className?: string;
}): React.JSX.Element;
/** Info-Zeile: Icon an der ersten Zeile, Text daneben. */
export declare function Info({ icon, children, gross }: {
    icon: React.ReactNode;
    children: React.ReactNode;
    gross?: boolean;
}): React.JSX.Element;
/** Kasten mit Icon (Lead, Sperre): feiner Rahmen rundum. */
export declare function Kasten({ icon, dunkel, label, titel, children, rechts, }: {
    icon: React.ReactNode;
    dunkel?: boolean;
    label: string;
    titel: string;
    children: React.ReactNode;
    rechts?: React.ReactNode;
}): React.JSX.Element;
/** Nummerierte Schritte 01, 02, … mit optionalem Titel. */
export declare function Schritte({ schritte, gross }: {
    schritte: {
        titel?: string;
        text: string;
    }[];
    gross?: boolean;
}): React.JSX.Element;
/** Quadratischer Knopf nur mit Icon; das Label steht als aria-label und title. Als Link: WERKPLAN_FLAECHE.iconKnopf. */
export declare function IconKnopf({ icon, label, onClick, disabled, nacht, groesse, className, }: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    nacht?: boolean;
    groesse?: number;
    className?: string;
}): React.JSX.Element;
/** Rahmen der Detailfläche rechts; `spalte` stapelt den Inhalt. */
export declare function DetailRahmen({ children, label, spalte, className }: {
    children: React.ReactNode;
    label: string;
    spalte?: boolean;
    className?: string;
}): React.JSX.Element;
export type FilterEintrag<T extends string> = {
    wert: T;
    label: string;
    zahl: number;
};
/** Bereiche über der Liste: jeder Knopf ist ein echter Link, ein einfacher Klick wählt ohne Neuladen. */
export declare function Filterleiste<T extends string>({ label, eintraege, aktiv, hrefFuer, onWaehle, }: {
    label: string;
    eintraege: FilterEintrag<T>[];
    aktiv: T;
    hrefFuer: (wert: T) => string;
    onWaehle: (wert: T) => void;
}): React.JSX.Element;
/**
 * Kopfzeile links und rechts über einem Maßbalken (`anteil` in Prozent).
 * `className` hängt eine eigene Klasse an (die Lage stellt damit den Kopf am
 * Handy untereinander); ohne bleibt alles wie im Gründungsradar.
 */
export declare function Fortschritt({ links, rechts, anteil, label, className }: {
    links: string;
    rechts: string;
    anteil: number;
    label: string;
    className?: string;
}): React.JSX.Element;
/** `inKarte`: Liste sitzt in einer Karte mit Rahmen und läuft am Handy nicht randlos. */
export declare function Liste({ label, inKarte, children }: {
    label: string;
    inKarte?: boolean;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function Gruppe({ titel, zahl }: {
    titel: string;
    zahl: number;
}): React.JSX.Element;
/** Gruppenkopf mit den Zeilen darunter, ohne eigenes Element. */
export declare function GruppeBlock({ titel, zahl, children }: {
    titel: string;
    zahl: number;
    children: React.ReactNode;
}): React.JSX.Element;
/**
 * Listenzeile als echter Link; ein einfacher Klick wählt ohne Neuladen. Die
 * gewählte Zeile ist weiß mit 2-px-Innenlinie, kein Farbbalken. `nachLink`
 * steht neben dem Link (etwa „Rückgängig“ mit WERKPLAN_FLAECHE.textlink und
 * .zeileRueck), damit keine Links verschachtelt werden.
 */
export declare function Listenzeile({ id, href, aktiv, titel, unter, unterIcon, unterArt, rechts, gedimmt, nachLink, onWaehle, className, }: {
    id: string;
    href: string;
    aktiv: boolean;
    titel: string;
    unter: string;
    unterIcon?: React.ReactNode;
    unterArt?: "warn" | "haken";
    rechts?: React.ReactNode;
    gedimmt?: boolean;
    nachLink?: React.ReactNode;
    onWaehle: (id: string) => void;
    className?: string;
}): React.JSX.Element;

/* ---- Textlink ---- */

/** Textlink des DS Werkplan 2.0 (ADR-261), Zweitaktion neben der Lichtkante: Text mit 1 px Unterstrich, Hover/Fokus 3 px Lime. */
export declare function Textlink({ href, children, className }: {
    href: string;
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;

/* ---- Plankopf ---- */

/** Ein Feld des Schriftfelds; `breit` zieht es über beide Spalten. */
export interface PlankopfFeld {
    label: string;
    /** Text oder ein Element, etwa der Paket-Chip im Monatsbericht. */
    wert: React.ReactNode;
    breit?: boolean;
}
/**
 * Schriftfeld wie auf einem Bauplan (DS Werkplan 2.0, ADR-261): Label im
 * Beschriftungsstil, Wert darunter, zwei Spalten mit 1-px-Fugen. Als <dl>,
 * damit Label und Wert auch vorgelesen zusammengehören. Felder mit leerem
 * Text fallen weg, statt leer oder erfunden dazustehen. `untergrund` wählt
 * die Farben für Papier (Standard) oder Nacht. `anhang` steht als letztes Kind
 * im <dl> und bringt seine Felder selbst mit (etwa die Zeile „Neuigkeiten“
 * der Kundenseite, die ohne Daten ganz wegfällt).
 */
export declare function Plankopf({ felder, untergrund, className, anhang, }: {
    felder: readonly PlankopfFeld[];
    untergrund?: "nacht" | "papier";
    className?: string;
    anhang?: React.ReactNode;
}): React.JSX.Element;

/* ---- SucherEcken ---- */

type Tag = "div" | "section" | "form";
/**
 * Sucher-Ecken wie im Kamerasucher (DS Werkplan 2.0, ADR-261;
 * werkplan.module.css `.ecken`): vier 10-px-Winkel in den Ecken des Rahmens,
 * rein dekorativ (aria-hidden). Umschließt seinen Inhalt; `as` wählt das
 * Element, damit auch ein Formular den Rahmen tragen kann. Die Farbe ist
 * `--wp-stark`; eine eigene setzt `--ecken-farbe` an einem umgebenden Element.
 */
export declare function SucherEcken({ as: Element, className, children, ...rest }: {
    as?: Tag;
    className?: string;
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement> & Pick<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "noValidate">): React.JSX.Element;

/* ---- Massbalken ---- */

/**
 * Maßbalken des DS Werkplan 2.0 (ADR-261): Maßlinie mit Endstrichen; die Lime-Füllung zeigt `anteil` Prozent der Länge
 * (auf 0 bis 100 geklemmt). Die viewBox ist 100 Einheiten breit, damit der
 * Anteil direkt die Breite der Füllung ist; `preserveAspectRatio="none"` zieht
 * sie auf die volle Breite des Elternteils, die Striche bleiben 1 px
 * (`vectorEffect`). Maße und Farben stehen in werkplan.module.css.
 */
export declare function Massbalken({ anteil, untergrund, label, }: {
    anteil: number;
    untergrund: "nacht" | "papier";
    label?: string;
}): import("react").JSX.Element;

/* ---- Masskette ---- */

/** Lage der Linien und Füllungen in viewBox-Einheiten (0 bis 100). */
export interface MassketteGeometrie {
    /** Lime-Füllungen, je eine für jede Folge geprüfter Positionen. */
    fuellungen: {
        x: number;
        breite: number;
    }[];
    /** Kurze Teilstriche zwischen zwei Positionen desselben Abschnitts. */
    teilungen: number[];
    /** Lange Trennstriche zwischen zwei Abschnitten. */
    trenner: number[];
}
/**
 * Rechnet die Maßkette aus: jede Position ist ein gleich langes Teilstück,
 * `gruppen` sind die Abschnitte (z. B. Blatt 01 und Blatt 02), jeder Eintrag
 * sagt, ob die Position geprüft ist. Rein und ohne DOM, damit der Test die
 * Geometrie direkt prüft.
 */
export declare function massketteGeometrie(gruppen: readonly (readonly boolean[])[]): MassketteGeometrie;
/**
 * Maßkette als Prüfstand (DS Werkplan 2.0, ADR-261; Entwurf „Plan-Blatt“): die
 * Maßlinie des Maßbalkens (./Massbalken.tsx) mit
 * einem Teilstrich je Position und einem langen Trennstrich zwischen den
 * Abschnitten; Lime füllt, was geprüft ist. `preserveAspectRatio="none"` zieht
 * die viewBox auf die volle Breite, die Striche bleiben 1 px (`vectorEffect`).
 */
export declare function Masskette({ gruppen, label }: {
    gruppen: readonly (readonly boolean[])[];
    label: string;
}): import("react").JSX.Element;

/* ---- BlattZeile ---- */

/**
 * Blattkennung über einem Abschnitt, etwa „Blatt 02 · Zugänge“ (DS Werkplan 2.0,
 * ADR-261; nur Papier).
 * Ohne `nr` steht nur der Titel (Monatsbericht v3 zeigt keine Blatt-Nummer,
 * Plan z1-werkplan-bausteine Entscheidung 3). Versalien setzt das CSS.
 */
export declare function BlattZeile({ nr, titel, className }: {
    nr?: number;
    titel: string;
    className?: string;
}): import("react").JSX.Element;

/* ---- MarkerHighlight ---- */

/**
 * Überstand und Rundung der Lime-Fläche, in em der Schriftgröße des markierten
 * Wortes. Die Voreinstellung GEOMETRY_DEFAULT ist die am Logo VERMESSENE
 * Geometrie (Wegweiser `CLAUDE.md` im keteso-Repo, „Die Marker-Geometrie ist
 * vermessen“): die Fläche ist dieselbe Form wie die Pille im Logo, die Werte
 * hängen an der Versalhöhe von Big Shoulders Display (0,800em) — der Schrift
 * aller Marker-Stellen. Sie tragen nur, weil die Komponente ihren Kasten auf
 * `line-height: 1` festnagelt; Aufrufer brauchen dafür nichts zu tun.
 */
export interface MarkerGeometry {
    /** Oberkante der Fläche, negativ = Überstand über den Kasten hinaus. */
    top: string;
    /** Unterkante der Fläche, negativ = Überstand nach unten. */
    bottom: string;
    /** Seitlicher Überstand links und rechts (negativ). Nie zusätzlich padding. */
    side: string;
    /** Festes em-Maß: 0,433 × Flächenhöhe. Nie Prozent (bezöge sich auf die
     *  Breite) und nie --radius-marker (999px = volle Pille, sichtbar zu rund). */
    radius: string;
}
/**
 * Die vier CSS-Werte sind KEINE freien Zahlen, sondern fallen aus den Metriken
 * von Big Shoulders Display und der Messtabelle heraus (WB-af6cfb14, 13.08.2026).
 * Die Herleitung steht bei MARKER_CAP_HEIGHT_EM; `markerGeometry()` rechnet sie
 * aus, der Test hält beide Seiten aneinander.
 */
export declare const GEOMETRY_DEFAULT: MarkerGeometry;
/** CD-Neigung der Marker-Fläche (CSS-Vorzeichen: negativ = steigt nach rechts
 *  an; in PDF/Canvas kippt dasselbe Vorzeichen andersherum, siehe
 *  Design-Referenz). Marke, kein Parameter. */
export declare const MARKER_TILT_DEG = -3.96;
/** Rundung der Logo-Pille: 0,433 × Flächenhöhe (rx=21.7 bei height=50.1).
 *  Die volle Pille (--radius-marker, 999px = 50 %) ist sichtbar zu rund. */
export declare const MARKER_RADIUS_FACTOR = 0.433;
/** Luft über der Versal-Oberkante, × Versalhöhe. */
export declare const MARKER_CLEARANCE_TOP = 0.196;
/** Luft unter der BBox-Unterkante, × Versalhöhe. Mehr Hub dürfen die Enden der Fläche
 *  nicht bekommen, sonst schneidet sie die Buchstaben an. */
export declare const MARKER_CLEARANCE_BOTTOM = 0.173;
/** Luft links und rechts, × Versalhöhe. Steckt allein im Überstand der Fläche. */
export declare const MARKER_CLEARANCE_SIDE = 0.288;
/**
 * Oberkante der Versalien von Big Shoulders Display, in em unter der
 * Kastenoberkante gerechnet ab der Grundlinie.
 *
 * GEMESSEN, nicht geschätzt (WB-af6cfb14): `OS/2.sCapHeight` = 1600 bei
 * `head.unitsPerEm` = 2000, identisch in der woff2 des DS und in der 700er-TTF;
 * die Ink-Bounding-Box von „H" reicht in beiden Dateien von 0 bis 1600. Bis
 * 13.08.2026 stand hier überall 0,81em — daraus war die gesamte Messtabelle
 * zurückgerechnet, also war jeder abgeleitete CSS-Wert falsch.
 */
export declare const MARKER_CAP_HEIGHT_EM = 0.8;
/**
 * Unterkante der Rundungsüberschüsse, in em unter der Grundlinie.
 *
 * Ink-Bounding-Box der Glyphen von „handwerk" in der DS-woff2: „h", „d", „k"
 * reichen bis 0,800em hinauf, „a", „d", „e" bis -0,005em hinunter. Das ist der
 * Überschuss der runden Formen.
 */
export declare const MARKER_OVERSHOOT_EM = 0.005;
/**
 * Die Bezugsgröße der Messtabelle, in em.
 *
 * ACHTUNG, hier steckt die Falle, die WB-af6cfb14 ausgelöst hat: „Versalhöhe"
 * meint im keteso-Wegweiser `CLAUDE.md` NICHT die Cap-Height der
 * Schrift, sondern die **Bounding-Box des Wortes** — Oberkante Versal bis
 * Unterkante der Rundungsüberschüsse. Am Logo gemessen: `13.79 … 50.39` = 36,60
 * Einheiten, nicht bis zur geometrischen Grundlinie der geraden Stämme
 * (`49.77`). Alle sechs Werte der Tabelle stehen in dieser Konvention.
 *
 * Wer stattdessen mit der Cap-Height rechnet, bekommt eine um 0,6 % zu kleine
 * Fläche und verfehlt die Gegenprobe (Überhöhung 35,4 % statt der geforderten
 * 36,9 %) — genau daran hängt der Unterschied zwischen `bottom: -0.024em` und
 * `bottom: -0.030em`.
 */
export declare const MARKER_REFERENCE_HEIGHT_EM: number;
/**
 * Abstand Kastenoberkante → Grundlinie bei `line-height: 1`, in em.
 *
 * Ebenfalls aus der Schriftdatei: hhea = typo = +0,984 / -0,213 em, und
 * `fsSelection` Bit 7 (USE_TYPO_METRICS) ist gesetzt, also gilt der Halbdurchschuss
 * `(1 − 1,197) / 2`. Grundlinie = 0,984 − 0,0985 = 0,8855em. Bis 13.08.2026
 * stand hier 0,856em.
 */
export declare const MARKER_BASELINE_EM = 0.8855;
/** Höhe der Fläche, × Versalhöhe — Summe der drei senkrechten Anteile. */
export declare const MARKER_AREA_HEIGHT: number;
/**
 * Rechnet die vier CSS-Werte aus den Metriken oben aus. Bezugsrahmen ist die
 * 1em-Box des markierten Wortes (deshalb `line-height: 1` am Marker-Element),
 * Bezugsgröße der Faktoren ist MARKER_REFERENCE_HEIGHT_EM:
 *
 *   top    = Grundlinie − Versal-Oberkante − Bezug · Luft oben
 *   bottom = 1em − (Grundlinie + Überschuss + Bezug · Luft unten)
 *   side   = Bezug · Luft seitlich
 *   radius = 0,433 · Flächenhöhe
 *
 * Existiert, damit GEOMETRY_DEFAULT nachprüfbar bleibt statt nur behauptet.
 */
export declare function markerGeometry(): MarkerGeometry;
/** Mittlere Versalbreite je Zeichen, × Versalhöhe. Die Schrift ist stark
 *  kondensiert; 0,52 trifft sie gut genug für eine Breitenschätzung, die eine
 *  Server-Komponente nicht messen kann. */
export declare const MARKER_CHAR_WIDTH = 0.52;
/**
 * Wie viel Grad darf der Marker hinter DIESEM Wort kippen?
 *
 * Die einzige Neigungsrechnung im Haus (WB-8a5b45b3). Die Neigung hebt die Enden der Fläche um
 * `(Breite/2) · sin(Winkel)`; überschreitet dieser Hub die Luft unter der
 * BBox-Unterkante, schneidet die Fläche die Buchstaben an. Also
 * `Winkel = min(3,96°, asin(2 · 0,85 · Luft / Breite))`.
 *
 * Bezugsgröße ist die FLÄCHENbreite, nicht die Wortbreite: der Hub entsteht an
 * den Enden der Fläche, und die stehen um die seitliche Luft über dem Wort.
 * Alles in Versalhöhen, die em-Umrechnung kürzt sich weg.
 *
 * Kurze Wörter (bis 7 Zeichen) bekommen die vollen -3,96°, lange automatisch
 * weniger. Noch besser als flacher neigen ist ein kürzeres Wort.
 */
export declare function markerTiltDeg(word: string): number;
export interface MarkerHighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    /** Explizite Neigung in Grad; ohne Angabe gilt die CD-Neigung -3,96° mit
     *  automatischer Abflachung bei langen Wörtern. */
    rotate?: number;
    animate?: boolean;
    color?: string;
    geometry?: MarkerGeometry;
}
/**
 * MarkerHighlight: leicht geneigte Lime-Fläche hinter genau EINEM Wort; die
 * Schrift darauf ist immer dunkel.
 */
export declare function MarkerHighlight({ children, rotate, animate, color, geometry, style, ...rest }: MarkerHighlightProps): React.JSX.Element;

/* ---- icons ---- */

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
    size?: number;
};
export declare function MapPinIcon(props: IconProps): import("react").JSX.Element;
export declare function GlobeIcon(props: IconProps): import("react").JSX.Element;
export declare function FileTextIcon(props: IconProps): import("react").JSX.Element;
export declare function ScanIcon(props: IconProps): import("react").JSX.Element;
/** Browserfenster: steht für eine gebaute Seite (Website-Entwurf am Lead). */
export declare function BrowserIcon(props: IconProps): import("react").JSX.Element;
export declare function AlertTriangleIcon(props: IconProps): import("react").JSX.Element;
export declare function AlertCircleIcon(props: IconProps): import("react").JSX.Element;
export declare function CheckCircleIcon(props: IconProps): import("react").JSX.Element;
export declare function InfoIcon(props: IconProps): import("react").JSX.Element;
export declare function CopyIcon(props: IconProps): import("react").JSX.Element;
export declare function UploadIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „check“: einfacher Haken. */
export declare function CheckIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „plus“. */
export declare function PlusIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „images“: Bilderstapel (Leerzustand Datei-Eingang). */
export declare function ImagesIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „video“: Kamera (Videodatei im Sichttisch). */
export declare function VideoIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „message-square“: Angabe des Kunden an einer Datei. */
export declare function MessageSquareIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „clock“. */
export declare function ClockIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „x“. */
export declare function XIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „sparkles“: Neuigkeiten der Kundenseite (ADR-250). */
export declare function FunkenIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „undo“: Rücknahme. */
export declare function UndoIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „arrow-up-right“: Link, der eine fremde Seite in neuem Tab öffnet. */
export declare function ArrowUpRightIcon(props: IconProps): import("react").JSX.Element;
/** Lucide „arrow-right“. */
export declare function ArrowRightIcon(props: IconProps): import("react").JSX.Element;
export declare function ChevronRightIcon(props: IconProps): import("react").JSX.Element;
export declare function SearchIcon(props: IconProps): import("react").JSX.Element;
export declare function PhoneIcon(props: IconProps): import("react").JSX.Element;
export declare function MailIcon(props: IconProps): import("react").JSX.Element;
export declare function ChevronDownIcon(props: IconProps): import("react").JSX.Element;
export declare function DownloadIcon(props: IconProps): import("react").JSX.Element;
export declare function TrashIcon(props: IconProps): import("react").JSX.Element;
export declare function LockIcon(props: IconProps): import("react").JSX.Element;
export declare function LinkIcon(props: IconProps): import("react").JSX.Element;
export declare function SendIcon(props: IconProps): import("react").JSX.Element;
export declare function ShieldIcon(props: IconProps): import("react").JSX.Element;
export declare function CircleIcon(props: IconProps): import("react").JSX.Element;
/** Gefüllter Kreis mit Haken; der Umriss-Kreis bleibt CheckCircleIcon. */
export declare function CircleCheckFilledIcon(props: IconProps): import("react").JSX.Element;
export declare function CircleMinusIcon(props: IconProps): import("react").JSX.Element;
export declare function CircleDashedIcon(props: IconProps): import("react").JSX.Element;
export declare function CalendarClockIcon(props: IconProps): import("react").JSX.Element;
export declare function HourglassIcon(props: IconProps): import("react").JSX.Element;
export declare function BanIcon(props: IconProps): import("react").JSX.Element;
/**
 * Zwei Personen: dieser Lead kam über eine Empfehlung, nicht über den Funnel.
 * Bewusst kein Handschlag und kein Megafon — beide zerfallen bei 15px zu einem
 * Fleck. Die Bedeutung trägt ohnehin das Wort daneben, das Zeichen trägt nur
 * die Wiedererkennung in der Zeile (dieselbe Arbeitsteilung wie beim
 * Browserfenster des Website-Entwurfs).
 */
export declare function EmpfehlungIcon(props: IconProps): import("react").JSX.Element;
/**
 * Festes Abo-Icon eines Pakets: Radar-Reichweite in drei Stufen (Geometrie und
 * Entscheidung in ./abo-icon.ts). Eigenes <svg> statt `Icon`: das Radar braucht
 * eine eigene Strichstärke und gefüllte Teile, `Icon` zeichnet nur Striche der
 * Stärke 2. Ringe und Mitte nehmen currentColor, damit das Icon auf heller und
 * dunkler Karte gleich liest; nur der Schwenk ist fest Lime. Dekorativ: der
 * Paketname steht als Text daneben, also aria-hidden und kein eigenes Label.
 */
export declare function AboIcon({ paket, size, ...rest }: IconProps & {
    paket: Paket;
}): import("react").JSX.Element;

/* ---- Logo ---- */

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
export declare function Logo({ variant, height, className, style, href, linkLabel, as: Element, }: LogoProps): React.JSX.Element;

/* ---- abo-icon ---- */

/** Die drei Pakete in ihrer festen Reihenfolge. Nur Namen, keine Preise. */
export declare const PAKETE: readonly ["Standard", "Profi", "Platzhirsch"];
export type Paket = (typeof PAKETE)[number];
/** Quadratisches Icon-Raster; alle Maße unten in diesen Einheiten. */
export declare const ABO_ICON_VIEWBOX = 24;
/** Ringradien von innen nach außen. Kompakte Fassung: Strich auf 1,6 gehoben und
 *  die Trefferpunkte weggelassen, bei 16 bis 20 px fiele ihr r 1,25 unter ein Pixel. */
export declare const ABO_ICON_RING_RADII: readonly [3.8, 7.2, 10.4];
export declare const ABO_ICON_STROKE_WIDTH = 1.6;
/** Ringe jenseits der erreichten Stufe bleiben sichtbar, aber blass (möglich, nicht abwesend). */
export declare const ABO_ICON_FAINT_OPACITY = 0.28;
/** Mitte der Ringe; das Raster sitzt 0,5 tiefer, damit unten Platz für den Schwenk bleibt. */
export declare const ABO_ICON_CENTER: {
    readonly x: 12;
    readonly y: 12.5;
    readonly r: 1.9;
};
/** Der Schwenk ist eine Lime-Pille auf der Mittellinie der Ringe: y 10,7 plus Höhe
 *  3,6 zentriert sie auf cy 12,5, rx = Höhe / 2 macht beide Enden rund. */
export declare const ABO_ICON_SWEEP: {
    readonly y: 10.7;
    readonly height: 3.6;
    readonly rx: 1.8;
    readonly angle: -42;
};
/** Länge des Schwenks je Stufe, der zweite Träger der Stufe neben den Ringen. */
export declare const ABO_ICON_SWEEP_WIDTHS: Record<Paket, number>;
/** Reichweitenstufe 1 bis 3 = Zahl der vollen Ringe, aus der Reihenfolge in PAKETE. */
export declare function aboIconStage(paket: Paket): number;
/** Die gedrehte Schwenk-Pille als Linie mit runden Enden: geometrisch gleich dem
 *  SVG-rect (rx = Höhe / 2), aber in @react-pdf/renderer darstellbar, das keine
 *  verlässliche Gruppen-Transformation kennt. Die Achse der Pille läuft von der
 *  Ringmitte nach außen; die Linie verbindet die Mittelpunkte der beiden Enden. */
export declare function aboIconSweepLine(paket: Paket): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    strokeWidth: number;
};

/* ---- werte ---- */

/**
 * Hex-Wert eines Farb-Tokens, etwa `farbe("--ink-950")`. Sucht in den Farben
 * aus ./tokens; ein unbekannter Token wirft, statt still schwarz zu drucken.
 */
export declare function farbe(token: string): string;
/** Die Rollen einer Fläche, die Seitenrahmen und PDF brauchen. */
declare const PDF_ROLLEN: readonly ["grund", "stark", "text", "gedaempft", "quelle"];
export type FlaechenRolle = (typeof PDF_ROLLEN)[number];
type FlaechenTokens = {
    readonly [U in Untergrund]: {
        readonly [R in FlaechenRolle]: `--${(typeof FLAECHEN)[U][R]["farbe"]}`;
    };
};
/**
 * Rollen einer Fläche als Token-Namen (`--ink-…`), abgeleitet aus FLAECHEN in
 * ./tokens; die `--wp-*`-Rollen in werkplan.module.css folgen derselben Tabelle.
 */
export declare const FLAECHEN_TOKENS: FlaechenTokens;
/** Hex-Werte der Rollen einer Fläche, fürs PDF. */
export declare function flaechenFarben(untergrund: Untergrund): Record<FlaechenRolle, string>;
/** Maße in Pixeln (Web) bzw. Punkten (PDF, gleiche Zahl), aus ./tokens. */
export declare const WERKPLAN_MASSE: {
    readonly linie: 1;
    readonly ecke: 10;
    readonly eckeLinie: 1.5;
    readonly raster: 24;
    readonly massbalkenHoehe: 14;
    readonly massbalkenFuellung: 6;
    readonly lichtkanteHoehe: 54;
    readonly lichtkanteChip: 38;
    readonly rundungsFaktor: 0.433;
    readonly lichtkanteUmlauf: 3.2;
};
/** Ein Element eines Icons in Lucide-Geometrie (viewBox 24, Strich 2). */
export type IconElement = {
    art: "pfad";
    d: string;
    aufFuellung?: true;
} | {
    art: "kreis";
    cx: number;
    cy: number;
    r: number;
    gefuellt?: true;
};
export declare const ICON_VIEWBOX = 24;
export declare const ICON_STRICH = 2;
/**
 * Icons des Monatsberichts (Step 16a). `gefuellt` heißt: Fläche in der
 * Strichfarbe; `aufFuellung` heißt: Strich in der Gegenfarbe, weil er auf
 * einer gefüllten Fläche liegt (Haken im gefüllten Kreis).
 */
export declare const WERKPLAN_ICONS: {
    readonly circle: readonly [{
        art: "kreis";
        cx: number;
        cy: number;
        r: number;
        gefuellt?: true;
    }];
    readonly "circle-check-gefuellt": readonly [{
        readonly art: "kreis";
        readonly cx: 12;
        readonly cy: 12;
        readonly r: 10;
        readonly gefuellt: true;
    }, {
        readonly art: "pfad";
        readonly d: "m9 12 2 2 4-4";
        readonly aufFuellung: true;
    }];
    readonly "circle-minus": readonly [{
        art: "kreis";
        cx: number;
        cy: number;
        r: number;
        gefuellt?: true;
    }, {
        readonly art: "pfad";
        readonly d: "M8 12h8";
    }];
    readonly "circle-dashed": readonly [{
        readonly art: "pfad";
        readonly d: "M10.1 2.182a10 10 0 0 1 3.8 0";
    }, {
        readonly art: "pfad";
        readonly d: "M13.9 21.818a10 10 0 0 1-3.8 0";
    }, {
        readonly art: "pfad";
        readonly d: "M17.609 3.721a10 10 0 0 1 2.69 2.7";
    }, {
        readonly art: "pfad";
        readonly d: "M2.182 13.9a10 10 0 0 1 0-3.8";
    }, {
        readonly art: "pfad";
        readonly d: "M20.279 17.609a10 10 0 0 1-2.7 2.69";
    }, {
        readonly art: "pfad";
        readonly d: "M21.818 10.1a10 10 0 0 1 0 3.8";
    }, {
        readonly art: "pfad";
        readonly d: "M3.721 6.391a10 10 0 0 1 2.7-2.69";
    }, {
        readonly art: "pfad";
        readonly d: "M6.391 20.279a10 10 0 0 1-2.69-2.7";
    }];
    readonly "calendar-clock": readonly [{
        readonly art: "pfad";
        readonly d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5";
    }, {
        readonly art: "pfad";
        readonly d: "M16 2v4";
    }, {
        readonly art: "pfad";
        readonly d: "M8 2v4";
    }, {
        readonly art: "pfad";
        readonly d: "M3 10h5";
    }, {
        readonly art: "pfad";
        readonly d: "M17.5 17.5 16 16.3V14";
    }, {
        readonly art: "kreis";
        readonly cx: 16;
        readonly cy: 16;
        readonly r: 6;
    }];
    readonly hourglass: readonly [{
        readonly art: "pfad";
        readonly d: "M5 22h14";
    }, {
        readonly art: "pfad";
        readonly d: "M5 2h14";
    }, {
        readonly art: "pfad";
        readonly d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22";
    }, {
        readonly art: "pfad";
        readonly d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2";
    }];
    readonly ban: readonly [{
        readonly art: "pfad";
        readonly d: "M4.929 4.929 19.07 19.071";
    }, {
        art: "kreis";
        cx: number;
        cy: number;
        r: number;
        gefuellt?: true;
    }];
    readonly "file-text": readonly [{
        readonly art: "pfad";
        readonly d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z";
    }, {
        readonly art: "pfad";
        readonly d: "M14 2v6h6";
    }, {
        readonly art: "pfad";
        readonly d: "M9 13h6M9 17h4";
    }];
};
export type WerkplanIconName = keyof typeof WERKPLAN_ICONS;

/* ---- tokens ---- */

/** oklch-Koordinaten wie in CSS: Helligkeit 0 bis 1, Buntheit, Farbton in Grad. */
export type Oklch = readonly [helligkeit: number, buntheit: number, farbton: number];
type FarbQuelle = {
    readonly oklch: Oklch;
} | {
    readonly hex: string;
} | {
    readonly rgba: readonly [rot: number, gruen: number, blau: number, deckkraft: number];
} | {
    readonly alias: string;
};
/** Eine Farbe mit ihrer Rolle; `alias` verweist auf eine andere Farbe der Tabelle. */
export type Farbe = FarbQuelle & {
    readonly rolle: string;
};
/**
 * Alle Farben. Die Namen der Ink- und Lime-Stufen sind dieselben wie im Admin
 * (`app/globals.css`), die Werte auch; die Ink-Rampe hat zehn Stufen. Was
 * dazwischen liegt, entsteht mit `color-mix()` aus zwei Stufen (docs/inventur.md).
 */
export declare const FARBEN: {
    readonly "ink-950": {
        readonly oklch: readonly [0.17, 0.012, 78];
        readonly rolle: "Starke Schrift auf Papier, Nachtfläche, Fokusring auf Papier.";
    };
    readonly "ink-900": {
        readonly oklch: readonly [0.21, 0.013, 78];
        readonly rolle: "Nachtfläche eine Stufe heller (.nachtHell).";
    };
    readonly "ink-800": {
        readonly oklch: readonly [0.27, 0.013, 78];
        readonly rolle: "Fließtext auf Papier, Hover auf Nacht.";
    };
    readonly "ink-600": {
        readonly oklch: readonly [0.46, 0.011, 80];
        readonly rolle: "Quellenzeile auf Papier.";
    };
    readonly "ink-500": {
        readonly oklch: readonly [0.5, 0.011, 80];
        readonly rolle: "Gedämpfte Schrift auf Papier.";
    };
    readonly "ink-400": {
        readonly oklch: readonly [0.68, 0.01, 82];
        readonly rolle: "Gedämpfte Schrift und Linien auf Nacht.";
    };
    readonly "ink-300": {
        readonly oklch: readonly [0.8, 0.009, 83];
        readonly rolle: "Quellenzeile auf Nacht.";
    };
    readonly "ink-200": {
        readonly oklch: readonly [0.89, 0.008, 84];
        readonly rolle: "Fließtext auf Nacht, Haarlinie auf Papier.";
    };
    readonly "ink-100": {
        readonly oklch: readonly [0.96, 0.006, 85];
        readonly rolle: "Papier.";
    };
    readonly "ink-050": {
        readonly oklch: readonly [0.975, 0.006, 85];
        readonly rolle: "Karte und Schriftfeld auf Papier, starke Schrift auf Nacht.";
    };
    readonly lime: {
        readonly hex: "#b5e545";
        readonly rolle: "Signalfarbe des Logos. Nur als Fläche mit dunkler Schrift (ink-950) darauf; auf Nacht auch Fokusring.";
    };
    readonly "lime-deep": {
        readonly hex: "#a3d137";
        readonly rolle: "Gedrückter Zustand einer Lime-Fläche.";
    };
    readonly "lime-soft": {
        readonly hex: "#dcf2a0";
        readonly rolle: "Helle Lime-Fläche mit dunkler Schrift: Etikett, Icon im Kasten, Glanz der Lichtkante.";
    };
    readonly "lime-glow": {
        readonly rgba: readonly [181, 229, 69, 0.45];
        readonly rolle: "Leuchten um Lime-Flächen.";
    };
    readonly danger: {
        readonly hex: "#ce2324";
        readonly rolle: "Fehler und Löschen als Fläche (Etikett, Hover). Rot gibt es nur dafür.";
    };
    readonly "danger-ink": {
        readonly oklch: readonly [0.5, 0.13, 30];
        readonly rolle: "Fehlertext auf Papier.";
    };
    readonly "focus-ring": {
        readonly alias: "ink-950";
        readonly rolle: "Fokusring auf Papier (WCAG 2.2 AA).";
    };
    readonly "focus-ring-on-dark": {
        readonly alias: "lime";
        readonly rolle: "Fokusring auf Nacht.";
    };
};
export type FarbName = keyof typeof FARBEN;
/**
 * oklch nach sRGB (0 bis 255), dieselbe Rechnung wie im Browser: OKLab nach
 * Björn Ottosson, über den LMS-Raum in lineares sRGB, dann die Übertragungskurve.
 */
export declare function oklchZuRgb([helligkeit, buntheit, farbton]: Oklch): [number, number, number];
/** sRGB-Werte 0 bis 255 und Deckkraft 0 bis 1 einer Farbe. */
export declare function rgbVon(name: FarbName): {
    rgb: [number, number, number];
    deckkraft: number;
};
/**
 * Hex-Wert einer Farbe (`#rrggbb`, mit Deckkraft unter 1 `#rrggbbaa`). Mit
 * `anteil` (Prozent) die Farbe mit dieser Deckkraft, also das Ergebnis von
 * `color-mix(in oklch, var(--name) <anteil>%, transparent)`.
 */
export declare function hexVon(name: FarbName, anteil?: number): string;
/** Deckkraft einer Farbe, mit `anteil` (Prozent) wie bei `color-mix(…, transparent)`. */
export declare function deckkraftVon(name: FarbName, anteil?: number): number;
/** CSS-Wert einer Farbe, wie src/tokens.css ihn schreibt. */
export declare function cssVon(name: FarbName): string;
export type Untergrund = "papier" | "nacht";
/** Wert einer Flächenrolle: eine Farbe, wahlweise mit Deckkraft in Prozent. */
export interface RollenWert {
    readonly farbe: FarbName;
    readonly anteil?: number;
}
/**
 * Rollen der zwei Flächen. In CSS stehen sie als `--wp-<rolle>` nur in den
 * Flächenklassen von src/werkplan.module.css (`.papier`, `.aufPapier`, `.nacht`,
 * `.nachtHell`, `.aufNacht`), nie auf `:root`. `grund` ist die Hintergrundfarbe
 * der Fläche selbst, `raster` das Millimeterraster darauf.
 */
export declare const FLAECHEN: {
    readonly papier: {
        readonly grund: {
            readonly farbe: "ink-100";
        };
        readonly stark: {
            readonly farbe: "ink-950";
        };
        readonly text: {
            readonly farbe: "ink-800";
        };
        readonly gedaempft: {
            readonly farbe: "ink-500";
        };
        readonly quelle: {
            readonly farbe: "ink-600";
        };
        readonly linie: {
            readonly farbe: "ink-950";
            readonly anteil: 40;
        };
        readonly "linie-fein": {
            readonly farbe: "ink-950";
            readonly anteil: 20;
        };
        readonly fokus: {
            readonly farbe: "focus-ring";
        };
        readonly blatt: {
            readonly farbe: "ink-050";
        };
        readonly raster: {
            readonly farbe: "ink-950";
            readonly anteil: 6;
        };
    };
    readonly nacht: {
        readonly grund: {
            readonly farbe: "ink-950";
        };
        readonly stark: {
            readonly farbe: "ink-050";
        };
        readonly text: {
            readonly farbe: "ink-200";
        };
        readonly gedaempft: {
            readonly farbe: "ink-400";
        };
        readonly quelle: {
            readonly farbe: "ink-300";
        };
        readonly linie: {
            readonly farbe: "ink-400";
            readonly anteil: 50;
        };
        readonly "linie-fein": {
            readonly farbe: "ink-400";
            readonly anteil: 22;
        };
        readonly fokus: {
            readonly farbe: "focus-ring-on-dark";
        };
        readonly blatt: {
            readonly farbe: "ink-900";
            readonly anteil: 60;
        };
        readonly raster: {
            readonly farbe: "ink-400";
            readonly anteil: 7;
        };
    };
};
export type WpRolle = keyof (typeof FLAECHEN)["papier"];
/** `.nachtHell` ist Nacht eine Stufe heller: nur der Grund weicht ab. */
export declare const NACHT_HELL_GRUND = "ink-900";
/** Eine Flächenrolle als CSS-Wert, so wie src/werkplan.module.css sie setzt. */
export declare function rolleCss(wert: RollenWert): string;
/** Schriftfamilien als CSS-Stapel; in CSS `--font-display`, `--font-body`, `--font-werkplan`. */
export declare const SCHRIFTFAMILIEN: {
    readonly display: {
        readonly stapel: "\"Big Shoulders Display\", \"Arial Narrow\", sans-serif";
        readonly rolle: "Überschriften: Versalien, Gewicht 800.";
    };
    readonly body: {
        readonly stapel: "\"Hanken Grotesk\", system-ui, sans-serif";
        readonly rolle: "Fließtext, Einleitung, Knöpfe, Textlink.";
    };
    readonly werkplan: {
        readonly stapel: "\"Barlow Semi Condensed\"";
        readonly rueckfall: "body";
        readonly rolle: "Beschriftung, Quelle und Schriftfeld (600), Messwert (300).";
    };
};
export type SchriftFamilie = keyof typeof SCHRIFTFAMILIEN;
/** Schriftfamilie als CSS-Wert der Typo-Rollen, mit Rückfall: `var(--font-werkplan), var(--font-body)`. */
export declare function familieCss(familie: SchriftFamilie): string;
/** Schriftfamilie als vollständiger Stapel mit Rückfall, etwa für tokens.json. */
export declare function familieStapel(familie: SchriftFamilie): string;
/** Selbst gehostete Schriftdateien unter fonts/ (SIL OFL 1.1, Lizenztexte daneben). */
export declare const SCHRIFTDATEIEN: readonly [{
    readonly familie: "Big Shoulders Display";
    readonly datei: "big-shoulders-display.woff2";
    readonly gewicht: "100 900";
}, {
    readonly familie: "Hanken Grotesk";
    readonly datei: "hanken-grotesk.woff2";
    readonly gewicht: "100 900";
}, {
    readonly familie: "Barlow Semi Condensed";
    readonly datei: "barlow-semi-condensed-300.woff2";
    readonly gewicht: "300";
}, {
    readonly familie: "Barlow Semi Condensed";
    readonly datei: "barlow-semi-condensed-600.woff2";
    readonly gewicht: "600";
}];
/**
 * Schriftgrade in Pixeln, in CSS `--grad-<n>`. Acht Grade von 12 bis 64 plus
 * die Messwert-Stufe 80 (die Kundenseite setzt große Messwerte mit 76 und 84 px).
 */
export declare const GRADE: {
    readonly 12: "Beschriftung, Quelle, Etikett, Schriftfeld-Label.";
    readonly 14: "Kleintext, Beschriftung ab 768 px, Listenzeilen.";
    readonly 16: "Fließtext, Knöpfe, Textlink, Schriftfeld-Wert.";
    readonly 18: "Einleitung.";
    readonly 24: "Zwischenüberschrift.";
    readonly 32: "Überschrift am Handy.";
    readonly 48: "Überschrift.";
    readonly 64: "Große Überschrift.";
    readonly 80: "Großer Messwert.";
};
export type Grad = keyof typeof GRADE;
/** Eine Typo-Rolle; ihre Klasse in src/werkplan.module.css heißt wie `name`, sonst steht sie in `klasse`. */
export interface TypoRolle {
    readonly name: string;
    readonly klasse?: string;
    readonly familie: SchriftFamilie;
    readonly gewicht: number;
    /** Schriftgrad; bei Überschriften der Richtwert, die Größe setzt dort die Seite. */
    readonly grad: Grad;
    /** Schriftgrad ab 768 px Breite, falls die Rolle dort wächst. */
    readonly gradAb768?: Grad;
    readonly groesseSetztSeite?: true;
    readonly zeilenhoehe: number;
    readonly sperrung?: string;
    readonly versalien?: true;
    readonly beispiel: string;
    readonly rolle: string;
}
/**
 * Typo-Rollen des Werkplans. Schrift, Gewicht, Grad, Zeilenhöhe und Sperrung
 * stehen hier; src/werkplan.module.css setzt dieselben Werte in den Klassen
 * (test/typo-rollen.test.ts hält beides gleich).
 */
export declare const TYPO_ROLLEN: readonly TypoRolle[];
/** Rundungsrollen, in CSS `--rund-<rolle>`. */
export declare const RUNDUNGEN: {
    readonly eckig: {
        readonly wert: "0";
        readonly rolle: "Kästen, Karten, Schriftfeld, Listen.";
    };
    readonly fein: {
        readonly wert: "2px";
        readonly rolle: "Etikett, Eingabefeld, Fokusrahmen, Textlink.";
    };
    readonly kreis: {
        readonly wert: "999px";
        readonly rolle: "Punkte, Avatare und Pillen ohne feste Höhe: an einem Quadrat ein Kreis, sonst runde Enden.";
    };
};
/**
 * Knöpfe und Chips mit fester Höhe runden mit 0,433 × Höhe, der Form der Pille
 * im Logo (`rx=21.7` bei `height=50.1`); in CSS `--rund-pille-faktor`.
 */
export declare const PILLE_FAKTOR = 0.433;
/** Abstände im 4-px-Raster. */
export declare const ABSTAENDE: readonly [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];
/**
 * Bewegung: Übergänge, Lichtumlauf der Lichtkante, Leistungskarte.
 * `prefers-reduced-motion` schaltet alles ab.
 */
export declare const BEWEGUNG: {
    readonly uebergangMs: 180;
    readonly kurve: "ease-out";
    readonly lichtUmlaufS: 3.2;
    /** Leistungskarte: Farbwechsel beim Aktivieren. */
    readonly karteMs: 320;
    /** Leistungskarte: Kippen und Anheben. */
    readonly kippenMs: 380;
    /** Kurve der Leistungskarte für Farbe und Kippen (auf der Website `--ease-marker`). */
    readonly kurveKarte: "cubic-bezier(0.22, 0.61, 0.36, 1)";
};
/**
 * Grafikstile (ADR-262): Striche der Zeichnungen in SVG-Einheiten, Zustand der
 * aktiven Leistungskarte, Ablauf der Iso-Szene. `leistungskarten.module.css` und
 * die Standardwerte von `Leistungskarten` und `IsoSzene` tragen dieselben Zahlen;
 * `test/grafik-werte.test.ts` hält sie gleich.
 */
export declare const GRAFIK: {
    /** Kontur der Zeichnung. */
    readonly strich: 1.1;
    /** Feine Linien: Fugen, Schraffur, Nebenlinien. */
    readonly strichFein: 0.7;
    /** Lime-Linie. */
    readonly strichLime: 1.6;
    /** Zeiger einer Uhr oder Messnadel. */
    readonly strichZeiger: 2;
    /** Leuchtsaum um Lime-Teile der aktiven Karte, in px. */
    readonly leuchtsaumPx: 6;
    /** Aktive Karte: Neigung in Grad, Anheben in px, Vergrößerung. */
    readonly kippGrad: -1.6;
    readonly hebenPx: 6;
    readonly skalierung: 1.02;
    /** Aktive breite Karte (Querformat): flacher, weniger angehoben, ohne Vergrößerung. */
    readonly kippGradBreit: -0.6;
    readonly hebenPxBreit: 4;
    /** Leistungskarte ohne Hover (Handy): Sichtanteil, ab dem die Geste einmal abläuft. */
    readonly handyStartAnteil: 0.6;
    /** Iso-Szene: Sichtanteil für den Start und Takt, in dem die Stufen einrasten. */
    readonly isoStartAnteil: 0.5;
    readonly isoTaktMs: 700;
};
/**
 * Maße in Pixeln (Web) bzw. Punkten (PDF, gleiche Zahl). Dieselben Zahlen stehen
 * in werkplan.module.css und lichtkante.module.css; test/masse.test.tsx hält sie gleich.
 */
export declare const MASSE: {
    /** Maßlinie, Endstriche, Schriftfeld-Fugen. */
    readonly linie: 1;
    /** Kantenlänge und Linienstärke der Sucher-Ecken. */
    readonly ecke: 10;
    readonly eckeLinie: 1.5;
    /** Millimeterraster der Flächen. */
    readonly raster: 24;
    /** Höhe des Maßbalkens und seiner Lime-Füllung. */
    readonly massbalkenHoehe: 14;
    readonly massbalkenFuellung: 6;
    /** Lichtkante: Höhe, Chip, Rundung als Anteil der Höhe (Form der Logo-Pille). */
    readonly lichtkanteHoehe: 54;
    readonly lichtkanteChip: 38;
    readonly rundungsFaktor: 0.433;
    /** Umlaufzeit des Lichts in Sekunden. */
    readonly lichtkanteUmlauf: 3.2;
};

/* ---- Reiter ---- */

/** Art des Stands neben einem Reiter im Menü. */
export type ReiterStandArt = "hervor" | "fehler" | "ruhig";
export interface ReiterEintrag {
    kennung: string;
    name: string;
    /** Ziel des Reiters; null heißt ohne Funktion (dann ein <span> statt Link). */
    href: string | null;
    /** Stand im Handy-Menü, etwa „2 warten auf Sie“; ohne Stand nur der Name. */
    stand?: {
        text: string;
        art: ReiterStandArt;
    } | null;
}
export interface ReiterTexte {
    /** Name der Reiter-Leiste. */
    leiste: string;
    /** Sichtbarer Text des Menüknopfs. */
    menue: string;
    /** Name des Menüknopfs mit der Zahl wartender Schritte. */
    menueLabel: (wartend: number) => string;
    /** Name der Liste im Menü. */
    menueListe: string;
}
export declare const REITER_TEXTE: ReiterTexte;
/**
 * Ab 1024 px die Reiter-Leiste, darunter das Menü als `<details>` und
 * `<summary>` ohne Client-JavaScript, damit es schon vor der Hydrierung
 * aufgeht. Der Knopf „Menü“ trägt die Zahl wartender Schritte, darunter
 * dieselben Reiter als Liste mit ihrem Stand. Beide stehen nebeneinander in
 * der Zeile der App, die positioniert sein muss (die Menütafel legt sich
 * darunter). `ende` steht als letztes Kind in der Menüliste und bringt sein
 * `<li>` selbst mit (etwa die Zeile „Neuigkeiten“).
 */
export declare function Reiter({ eintraege, aktiv, wartend, texte, ende, }: {
    eintraege: readonly ReiterEintrag[];
    /** Kennung des aktiven Reiters; null, wenn keiner aktiv ist. */
    aktiv: string | null;
    /** Zahl wartender Schritte am Menüknopf. */
    wartend?: number;
    texte?: ReiterTexte;
    ende?: React.ReactNode;
}): React.JSX.Element;

/* ---- KapitelLeiste ---- */

export type KapitelEintrag = {
    id: string;
    name: string;
};
export declare function KapitelLeiste({ titel, kapitel, stand, kapitelNr, }: {
    titel: string;
    kapitel: readonly KapitelEintrag[];
    stand: string;
    kapitelNr?: (nummer: number) => string;
}): import("react").JSX.Element;

/* ---- ZiffernFelder ---- */

export declare function ZiffernFelder({ ziffern, aendern, fehlerId, fokusAnlass, zifferLabel, }: {
    ziffern: readonly string[];
    aendern: (neu: (vorher: string[]) => string[]) => void;
    /** id des Fehlertexts, oder null ohne Fehler. */
    fehlerId: string | null;
    /** Jede neue Antwort der Action: Fokus ins erste Feld, Inhalt markiert. */
    fokusAnlass: unknown;
    zifferLabel?: (nummer: number, laenge: number) => string;
}): import("react").JSX.Element;

/* ---- KopierenKnopf ---- */

export declare function KopierenKnopf({ wert, label, zusatz, ohneFunktion, kompakt, texte, }: {
    wert: string;
    /** Name des Werts, etwa „Adresse des Dienstkontos“; benennt Wert und Knopf („…: Kopieren“). */
    label?: string;
    /**
     * Hängt visuell versteckt an den sichtbaren Knopftext an („Kopieren Satz 2“),
     * damit mehrere Knöpfe unterscheidbare Namen tragen; der Name beginnt so mit
     * dem sichtbaren Text (WCAG 2.5.3). Ersetzt den Namen aus `label` am Knopf.
     */
    zusatz?: string;
    ohneFunktion?: boolean;
    kompakt?: boolean;
    texte?: KopierenTexte;
}): import("react").JSX.Element;

/* ---- standards ---- */

/** Länge des Codes auf der Kundenseite. */
export declare const CODE_LAENGE_STANDARD = 6;
/** Leere Ziffern für einen Code der Länge `laenge`. */
export declare function leereZiffern(laenge?: number): string[];
/** Name eines Ziffernfelds: „Ziffer 1 von 6“. */
export declare function zifferLabelStandard(nummer: number, laenge: number): string;
/** Nummer eines Kapitels, zweistellig: „01“. */
export declare function kapitelNummer(nummer: number): string;
export interface KopierenTexte {
    kopieren: string;
    kopiert: string;
    /** Hinweis am gesperrten Knopf. */
    ohneFunktion: string;
    /** Ansage, wenn das Kopieren scheitert. */
    manuell: string;
    /** Name des Rückfall-Felds. */
    feld: string;
}
/** Texte des Kopieren-Knopfs in Sie-Form, wie auf der Kundenseite. */
export declare const KOPIEREN_TEXTE: KopierenTexte;

/* ---- Eingabefeld ---- */

type Gemeinsam = {
    label: ReactNode;
    hinweis?: ReactNode;
    /** Fehlertext; vorhanden heißt ungültig. Angesagt über role="alert". */
    fehler?: ReactNode;
};
export type EingabefeldProps = (Gemeinsam & {
    mehrzeilig?: false;
} & InputHTMLAttributes<HTMLInputElement>) | (Gemeinsam & {
    mehrzeilig: true;
} & TextareaHTMLAttributes<HTMLTextAreaElement>);
export declare function Eingabefeld(props: EingabefeldProps): import("react").JSX.Element;

/* ---- Leistungskarten ---- */

/** Szenen-Register: Schlüssel aus `LeistungsKarte.szene` auf die Szene. */
export type SzenenRegister = Readonly<Record<string, Szene>>;
/**
 * Raster animierter Leistungskarten. Im Server-HTML steht jede Szene im
 * Ruhezustand, mit Bildausschnitt aus den vermessenen Proben; der Motor im
 * Client übernimmt Hover, Tastaturfokus und auf dem Handy das einmalige
 * Abspielen. Die Karten sind fokussierbar, aber kein Link. `breit` legt eine
 * einzelne Karte quer über die volle Breite (Bühne links, Text rechts).
 *
 * `szenen` ist das Szenen-Register; Karten, deren `szene` dort fehlt, fallen
 * weg. Das Register sollte eine feste Referenz sein (Modulkonstante): ein neues
 * Objekt startet den Motor neu. Next.js-Verbraucher legen ein eigenes
 * Client-Modul (`"use client"`) an, das `Leistungskarten` mit ihrem Register
 * rendert, denn Szenen sind Funktionen und überqueren die Server-Client-Grenze
 * nicht. Beispiele: `LEISTUNGSKARTEN_BEISPIELE`.
 */
export declare function Leistungskarten({ karten, szenen, untergrund, breit, }: {
    karten: readonly LeistungsKarte[];
    szenen: SzenenRegister;
    untergrund: "papier" | "nacht";
    breit?: boolean;
}): import("react").JSX.Element;

/* ---- leistungskarten-engine ---- */

/**
 * Zeichen-Engine der animierten Leistungskarten (Grafikstil A, ADR-262).
 * Port aus powerhandwerk-website, lib/werkplan/leistungskarten/engine.ts (keteso 923a5c4).
 *
 * Alles hier ist reine Funktion: kein DOM, kein globaler Zustand. Die
 * Ausdehnung einer Szene steckt in einem expliziten Mess-Objekt, das
 * `werkzeug()` gebunden bekommt. So rechnet der Server den Bildausschnitt aus
 * den projizierten Proben-Punkten, ohne Layout (Layout-Messungen liefern in
 * versteckten Rahmen und beim Server-Rendern nur Nullen).
 *
 * Neu gegenüber der Website: `flaeche()`, `linie()` und `text()` escapen die
 * Klasse (`text()` auch den Inhalt) und lassen als `stil` nur harmlose
 * Attribute zu. Im Paket sind Szenen Eingabe des Verbrauchers, und das Markup
 * geht per `innerHTML` ins SVG.
 */
declare const C: number;
export declare const TAU: number;
/** Ein Punkt im Szenenraum: x nach rechts unten, y nach links unten, z nach oben. */
export type Pkt = readonly number[];
/** Ausdehnung einer Szene in Bildkoordinaten, gesammelt beim Vermessen. */
type Mess = {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
};
/**
 * Parameter einer Szene. `t` ist der Fortschritt der Geste (0 Ruhe, 1 Ende).
 *
 * `px`, `mx` und `ang` belegt der Motor, sobald die Szene sie in `ruhe` oder
 * `start` führt: Er setzt sie aus dem Zeiger, auf dem Handy fährt er sie selbst.
 */
export type SzenenWert = {
    t: number;
    /** Zeigerposition waagerecht, 0 bis 1. Handy: läuft beim Abspielen von 0 auf 0,85. */
    px?: number;
    /** Zeigerposition waagerecht, -1 bis 1. Handy: steht beim Abspielen auf 0,35. */
    mx?: number;
    /** Zeigerwinkel einer Uhr (siehe `uhrWinkel` in leistungskarten-formen); in Ruhe die Uhrzeit per `ruheImClient`. */
    ang?: number;
    /** Laufende Uhr in Sekunden für Szenen mit Dauerbewegung. */
    clk?: number;
    /** Bitmaske abgehakter Punkte, wird beim Zeichnen fortgeschrieben. */
    gepr?: number;
};
export type SzenenSchluessel = keyof SzenenWert;
export type Szene = {
    /** Szene bewegt sich dauerhaft, solange die Karte aktiv ist. */
    laufend?: boolean;
    /** Startwerte beim Einblenden. */
    start: () => SzenenWert;
    /** Ruhezustand, wie ihn der Server rendert. Muss deterministisch sein. */
    ruhe: SzenenWert;
    /** Ruhezustand, den nur der Client kennt (Uhrzeit), überschreibt `ruhe` nach dem Laden. */
    ruheImClient?: () => Partial<SzenenWert>;
    /** Extremzustände für die Vermessung des Bildausschnitts. */
    proben: readonly SzenenWert[];
    /**
     * Liefert das SVG-Innen-Markup. Darf `s.gepr` fortschreiben.
     *
     * Szenen liefern Geometrie, also Pfade und Kreise aus dem Werkzeug `w`.
     * Text kommt nur über `w.text()` ins Bild: das escapt Inhalt und Klasse.
     * Eigenes Markup mit Text darin umginge das Escapen, denn das Ergebnis geht
     * per `innerHTML` ins SVG.
     */
    zeichne: (s: SzenenWert, w: Werkzeug) => string;
};
/**
 * Eine Karte im Raster von `Leistungskarten`. `szene` ist ein Schlüssel im
 * Szenen-Register, das der Verbraucher übergibt.
 */
export type LeistungsKarte = {
    szene: string;
    titel: string;
    /** Kartentext unter der Bühne. */
    teaser: string;
    /** Laufende Nummer, etwa „001“, optional. */
    nr?: string;
    /** Bezug unter dem Text, etwa „schließt Pos. 01 und 02“, optional. */
    schliesst?: string;
};
export declare const klemm: (v: number, a?: number, b?: number) => number;
export declare const plus: (p: Pkt, v: Pkt, f?: number) => number[];
export declare const kreis: (cx: number, cy: number, z: number, r: number, n?: number) => number[][];
/** Deckkraft als Attribut-Zusatz für `flaeche`, `linie` und `text`. */
export declare const deck: (o: number) => string;
/** Escapt `& < > " '` für Text und Attributwerte im Markup. */
export declare const maskiere: (wert: string) => string;
/** Textanker im SVG. */
export type Anker = "start" | "middle" | "end";
declare const TEXT_ZEICHENBREITE = 4.4;
/**
 * Zeichenwerkzeug, gebunden an ein Mess-Objekt (oder `null` beim normalen
 * Zeichnen). Jede Projektion erweitert beim Vermessen die Ausdehnung.
 */
declare function werkzeug(mess: Mess | null): {
    P: (x: number, y: number, z: number) => [number, number];
    pfad: (arr: readonly Pkt[], zu: boolean) => string;
    flaeche: (arr: readonly Pkt[], cls: string, stil?: string) => string;
    linie: (arr: readonly Pkt[], cls: string, stil?: string) => string;
    staub: (liste: readonly Pkt[]) => string;
    text: (p: Pkt, dx: number, dy: number, inhalt: string, cls: string, stil?: string, anker?: Anker) => string;
};
export type Werkzeug = ReturnType<typeof werkzeug>;
/** Grundwerte einer Szene: Start, überschrieben vom Ruhezustand des Servers. */
declare function ruheWert(szene: Szene): SzenenWert;
/** Bildausschnitt einer Szene als viewBox-String, allein aus den Proben gerechnet. */
declare function vermesse(szene: Szene): string;
/** SVG-Innen-Markup einer Szene im Zustand `wert` (der Motor übergibt seinen eigenen Wert, `gepr` bleibt so erhalten). */
declare function zeichne(szene: Szene, wert: SzenenWert): string;
/** Ruhezustand für das Server-HTML: deterministisch, auf einer Kopie gezeichnet. */
declare function zeichneRuhe(szene: Szene): string;
/**
 * Zieht jeden Wert einen Schritt in Richtung Ziel. Bei reduzierter Bewegung
 * springt er sofort. Liefert, ob sich etwas bewegt hat.
 *
 * Der Zeigerwinkel `ang` nimmt den kürzeren Weg auf dem Kreis (von 23 auf 0 Uhr
 * eine Stunde vorwärts, nicht fast eine Runde zurück). Unterwegs kann er
 * deshalb kurz außerhalb des Bereichs von `uhrWinkel` liegen; am Ziel steht
 * wieder genau der Zielwert.
 */
declare function naehere(wert: SzenenWert, ziel: SzenenWert, reduziert: boolean): boolean;
/** Zeigerparameter aus der relativen Zeigerposition in der Karte (0 bis 1). */
declare function zeigerZiel(ziel: SzenenWert, relX: number): void;
/** Kippwinkel der Karte (Grad) aus der relativen Zeigerposition. */
declare function kippung(relX: number, relY: number): {
    rx: number;
    ry: number;
};
/** Umkehrung der Projektion auf die Ebene z = 0: Bildpunkt zu Szenenpunkt (x, y). */
declare function ebeneAusBild(bx: number, by: number): [number, number];

/* ---- leistungskarten-formen ---- */

/**
 * Formen-Helfer für neue Szenen der Leistungskarten (Grafikstil A, ADR-262).
 * Port aus powerhandwerk-website, lib/werkplan/leistungskarten/szenen.ts (keteso 923a5c4).
 *
 * Jede neue Figur entsteht mit diesen Helfern und dem Werkzeug der Engine,
 * nie freihand: so bleiben Isometrie (30°), Strichstärken und Klassen gleich.
 * Klassen im Markup (Stil im CSS-Modul der Karten): f Fläche, l Linie,
 * d gestrichelt, th fein, a Lime-Fläche, al Lime-Linie, ag Lime ohne Kontur,
 * gl Schein, zeiger, pt Staubpunkt, lbl Beschriftung, uhr Zeitanzeige.
 */
/** Abbildung einer senkrechten Ebene: a entlang x, b nach oben, Ergebnis ein Szenenpunkt. */
export type Ebene = (a: number, b: number) => number[];
/**
 * Punkt in einer senkrechten Ebene y = konstant: a entlang x, b nach oben.
 * Für alles, was wie ein Blatt, Schild oder Bildschirm zum Betrachter steht.
 */
export declare const inEbene: (y: number) => Ebene;
/** Rechteck in einer Ebene, etwa ein Bildfeld, ein Knopf oder ein Fenster. */
export declare const rechteck: (E: Ebene, a0: number, a1: number, b0: number, b1: number) => number[][];
/**
 * Zackenfigur in einer Ebene: n Spitzen, Innenradius als Anteil von r. Liefert
 * eine Funktion für Mittelpunkt und Radius; Grundlage von `stern`.
 */
export declare const zacken: (n: number, innen: number) => (E: Ebene, ca: number, cb: number, r: number) => number[][];
/** Stern mit fünf Zacken in einer Ebene, etwa für Bewertungen. */
export declare const stern: (E: Ebene, ca: number, cb: number, r: number) => number[][];
/** Sprechblase mit abgerundeten Ecken und Zipfel an der Unterkante, für Nachrichten und Antworten. */
export declare const blase: (E: Ebene, a0: number, a1: number, b0: number, b1: number, zipfel: number, r?: number) => number[][];
/**
 * Senkrechte Platte mit sichtbarer Stirnseite rechts und Oberkante, etwa eine
 * Profilkarte, ein Bildschirm oder ein Schild mit Tiefe.
 */
export declare const platte: (w: Werkzeug, y: number, a0: number, a1: number, b0: number, b1: number, tiefe: number, cls?: string, stil?: string) => string;
/** Maße eines Hauses: Länge X, Tiefe Y, Traufhöhe H, Firsthöhe F, Dachüberstand ue, Versatz ox/oy. */
export type HausMasse = {
    X: number;
    Y: number;
    H: number;
    F: number;
    ue?: number;
    ox?: number;
    oy?: number;
    oeffnungen?: boolean;
};
/**
 * Satteldach-Haus, First parallel zu x, für Szenen rund um Dach und Gebäude.
 * Liefert die Hülle als Markup (`o`), die vordere Dachfläche als Funktion
 * (`dach`) und Hilfen, um Teile auf das Dach zu setzen (`vorn`, `zDach`).
 */
export declare function haus(w: Werkzeug, { X, Y, H, F, ue, ox, oy, oeffnungen }: HausMasse): {
    o: string;
    vorn: (u: number, x: number) => number[];
    zDach: (y: number) => number;
    ym: number;
    zE: number;
    Q: (x: number, y: number, z: number) => number[];
    dach: () => string;
};
/** Winkel von 0 Uhr auf einem 24-Stunden-Zifferblatt: zeigt im Bild nach oben. */
export declare const A0: number;
/**
 * Winkel der aktuellen Uhrzeit, für `ruheImClient` einer Szene mit Uhr. Nur
 * im Client aufrufen: im Server-HTML wiche die Hydration je nach Minute ab,
 * dort steht ein fester Winkel in `ruhe`.
 */
export declare function jetztWinkel(d: Date): number;
/**
 * Zeigerwinkel aus einem Punkt der Zifferblatt-Ebene (z = 0), auf volle
 * Stunden gerastert. Der Motor ruft das mit `ebeneAusBild` der Zeigerposition,
 * sobald eine Szene `ang` trägt.
 */
export declare function uhrWinkel(x: number, y: number): number;

/* ---- leistungskarten-beispiele ---- */

/**
 * Zwei Beispielszenen der Leistungskarten (Grafikstil A, ADR-262) und
 * Musterkarten dazu. Port aus powerhandwerk-website,
 * lib/werkplan/leistungskarten/szenen.ts (keteso 923a5c4): `profil` ist dort
 * `googleProfil`, `sanierung` heißt gleich.
 *
 * Bewusst ohne "use client": Server-Komponenten lesen die Musterkarten als
 * Werte. Die Szenen sind Funktionen und überqueren die Server-Client-Grenze
 * nicht; ein Verbraucher in Next.js reicht sie deshalb aus einem eigenen
 * Client-Modul an `Leistungskarten` (siehe dort).
 *
 * Jede Szene zeigt eine Geste (`t` von 0 nach 1) und ein Lime-Motiv, das aus
 * mehreren Flächen bestehen darf (fünf Sterne; Eindeckung und Ziegel).
 */
/** Beispielszenen der Leistungskarten: `profil` für Papier, `sanierung` für Nacht. */
export declare const LEISTUNGSKARTEN_BEISPIELE: Readonly<Record<"profil" | "sanierung", Szene>>;
/** Musterkarten zu den Beispielszenen, neutral getextet. */
export declare const LEISTUNGSKARTEN_MUSTER: readonly LeistungsKarte[];

/* ---- iso ---- */

/*!
 * Iso-Kern des Design-Systems, Projektion nach iso-glow.
 * Copyright (c) 2026 April Zhu (iso-glow: lighting, palettes, gallery shell, examples)
 * Copyright (c) 2026 Tolga Cohce (iso-figure, on which iso-glow is based)
 * MIT-Lizenz, voller Text in LICENSE-iso-glow.txt (Wurzel des Pakets).
 * Port aus powerhandwerk-website, lib/grafiken/iso.ts (keteso 923a5c4).
 */
/**
 * Isometrische Projektion als reine Funktionen, Ausgabe als Knotenbaum
 * `{ tag, attrs, kids }`. Kein DOM, keine Zufallszahlen: Die Komponente
 * `IsoKnoten` macht daraus React-Elemente, auf dem Server wie im Browser.
 *
 * Projektion wie in der Vorlage (siehe Kopf), zusätzlich mit Drehung der ganzen
 * Platte um die Hochachse (`rot` in Bogenmaß; negativ = Fronten drehen zum
 * Betrachter).
 *
 * Attribute stehen in React-Schreibweise (`className`, `strokeWidth`,
 * `textAnchor`, …), damit der Renderer sie unverändert durchreichen kann.
 */
export type AttrWert = string | number | Record<string, string> | undefined;
export type Knoten = {
    tag: string;
    attrs: Record<string, AttrWert>;
    kids: (Knoten | string)[];
};
/** Was `h()` als Kind annimmt: verschachtelte Listen werden flachgeklopft, Leeres fällt weg. */
export type Kind = Knoten | string | number | null | undefined | false | readonly Kind[];
export type Punkt2 = [number, number];
export type Punkt3 = [number, number, number];
/** Auf zwei Nachkommastellen gerundet, damit das SVG kurz und stabil bleibt. */
declare const f: (n: number) => number;
/** Kinder flachklopfen wie `h()`: verschachtelte Listen auflösen, Leeres weglassen, Zahlen als Text. */
declare function flach(kids: readonly Kind[], aus: (Knoten | string)[]): (Knoten | string)[];
/** Knoten bauen wie `createElement`, nur ohne React. */
declare function h(tag: string, attrs?: Record<string, AttrWert> | null, ...kids: Kind[]): Knoten;
/** Fünfzackiger Stern um (x, y) als Pfad, Spitze oben; Innenradius 45 % von r. */
export declare function sternPfad(x: number, y: number, r: number): string;
/**
 * Leuchtfilter einer Zeichnung, in Nutzerkoordinaten mit `rand` um die
 * bbox: `soft` (Blur 2,2 plus Original), `bloom` (nur Blur) und, wenn
 * `glow` und seine ID gesetzt sind, davor `glow` (Blur doppelt plus Original).
 */
export declare function filterDefs(bb: {
    x0: number;
    y0: number;
    w: number;
    h: number;
}, ids: {
    soft: string;
    bloom: string;
    glow?: string;
}, { rand, bloom, glow }: {
    rand: number;
    bloom: number;
    glow?: number;
}): Knoten[];
export type IsoKernel = ReturnType<typeof isoKernel>;
/**
 * Ein Kernel je Zeichnung: `rot` dreht die Platte um (cx, cy), `K` bildet
 * Klassennamen auf CSS-Modul-Namen ab (unbekannte bleiben, wie sie sind).
 * `merk`/`merkSchirm` sammeln Punkte für `bbox()`.
 */
export declare function isoKernel({ rot, cx, cy, K, }?: {
    rot?: number;
    cx?: number;
    cy?: number;
    K?: Readonly<Record<string, string>>;
}): {
    P: (x: number, y: number, z: number) => Punkt2;
    D: (x: number, y: number, z: number) => Punkt2;
    merk: (...p: Punkt3[]) => void;
    merkSchirm: (...p: Punkt2[]) => void;
    cls: (...ns: (string | false | null | undefined)[]) => string;
    mat: (O: Punkt3, U: Punkt3, V: Punkt3) => string;
    matInv: (U: Punkt3, V: Punkt3) => (dx: number, dy: number) => Punkt2;
    TOP: (x: number, y: number, z: number) => string;
    FRONT: (x: number, y: number, z: number) => string;
    SIDE: (x: number, y: number, z: number) => string;
    d2: (pts: readonly Punkt2[]) => string;
    path3: (arr: readonly Punkt3[]) => string;
    auf: (t: string, ...kids: Kind[]) => Knoten;
    rect: (t: string, w: number, hh: number, r?: number, c?: string) => Knoten;
    ring: (x: number, y: number, w: number, d: number, r: number, n?: number) => Punkt2[];
    huelle: (pts: readonly Punkt2[]) => Punkt2[];
    box: (x: number, y: number, z: number, w: number, d: number, hh: number, r?: number, c?: string) => Knoten[];
    bbox: (rand?: number) => {
        x0: number;
        y0: number;
        w: number;
        h: number;
        viewBox: string;
    };
    f: (n: number) => number;
    h: typeof h;
};

export { h as isoElement };
/* ---- IsoKnoten ---- */

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
 *
 * Er verwirft `script`, `foreignObject`, `animate` und `set` samt Kindern,
 * Ereignis-Attribute (`on…`) und `dangerouslySetInnerHTML`. Adressen prüft er
 * nicht (javascript: in href sperrt erst React 19, React 18 warnt nur); der
 * Baum gehört aus Code, nicht aus fremden Eingaben.
 */
export declare function IsoKnoten({ knoten, slots, }: {
    knoten: KnotenEingabe;
    slots?: Slots;
}): import("react").JSX.Element;

/* ---- useSvgPraefix ---- */

/**
 * Präfix für Filter-, Clip- und Verlaufs-IDs eines SVGs: `useId` ohne die
 * Zeichen, die in `url(#…)` und CSS-Selektoren stören. So kommen sich
 * mehrere Grafiken auf einer Seite nicht in die Quere.
 */
export declare function useSvgPraefix(): string;

/* ---- IsoSzene ---- */

/**
 * Zeichnung für `IsoSzene`, nur serialisierbare Daten: So kann eine
 * Server-Komponente sie rechnen (etwa mit `explosionProfil`) und an die
 * Client-Komponente geben.
 */
export type IsoZeichnung = {
    viewBox: string;
    knoten: readonly (Knoten | string)[];
    /** Klasse der Zeichnung aus ihrem CSS-Modul; steht neben der Palette am SVG. */
    klasse?: string;
    /** CSS-Variablen am SVG, etwa die Filter-URLs mit dem Präfix des Verbrauchers. */
    stil?: Readonly<Record<string, string>>;
};
export type IsoSzeneProps = {
    zeichnung: IsoZeichnung;
    /** So viele Stufen rasten nacheinander ein (`data-stand` 0 bis `stufen`). */
    stufen: number;
    /** Was die Grafik zeigt, für Vorleser (`aria-label`). Pflicht. */
    beschreibung: string;
    /** Unterschrift unter der Zeichnung. */
    unterschrift?: ReactNode;
    /** Hebt eine Stufe hervor (`data-fokus`), ohne den Ablauf zu ändern. */
    fokus?: number;
    className?: string;
};
/**
 * Ablauf der Iso-Szene (Stil B): Zeichnung auf Nacht, die Stufe für Stufe
 * einrastet. Das Server-HTML zeigt `data-stand="0"`. Ist die Zeichnung zum
 * Anteil `GRAFIK.isoStartAnteil` im Bild, rastet einmal Stufe 1 bis
 * `stufen` im Takt `GRAFIK.isoTaktMs` ein. Bei reduzierter Bewegung, ohne
 * `matchMedia` oder ohne `IntersectionObserver` stehen sofort alle Stufen.
 *
 * Eindeutige Filter-IDs liefert der Verbraucher beim Rechnen der Zeichnung
 * über ihr `idPraefix` (im Client per `useSvgPraefix`).
 */
export declare function IsoSzene({ zeichnung, stufen, beschreibung, unterschrift, fokus, className }: IsoSzeneProps): import("react").JSX.Element;

/* ---- explosion ---- */

/*!
 * Explosionszeichnung (Stil B, Iso-Szene), gezeichnet mit dem Iso-Kern nach iso-glow.
 * Copyright (c) 2026 April Zhu (iso-glow: lighting, palettes, gallery shell, examples)
 * Copyright (c) 2026 Tolga Cohce (iso-figure, on which iso-glow is based)
 * MIT-Lizenz, voller Text in LICENSE-iso-glow.txt (Wurzel des Pakets).
 * Port aus powerhandwerk-website, lib/grafiken/befund-profil.ts (keteso 923a5c4).
 */
/** Musterinhalte der Explosionszeichnung. */
export declare const EXPLOSION_MUSTER: {
    readonly name: "Betrieb Muster";
    readonly kategorie: "Gewerk · Musterstadt";
    readonly wertung: "4,8";
    readonly anzahl: "38";
};
/** So viele Stufen hat der Ablauf: vier Teile rasten nacheinander ein. */
export declare const EXPLOSION_STUFEN = 4;
export type ExplosionEingabe = {
    name?: string;
    kategorie?: string;
    wertung?: string;
    anzahl?: string;
    /**
     * Vorsatz für Filter-IDs. Pflicht, sobald mehr als eine Zeichnung auf einer
     * Seite steht, sonst teilen sich zwei Zeichnungen die Filter-IDs. Im Client
     * per `useSvgPraefix`, auf dem Server ein fester, je Zeichnung eindeutiger
     * Präfix.
     */
    idPraefix?: string;
    /** Drehung der Platte in Grad; negativ dreht die Front zum Betrachter. */
    rot?: number;
};
export type ExplosionProfil = {
    viewBox: string;
    /** Klasse der Zeichnung aus explosion.module.css, gehört neben die Palette ans SVG. */
    klasse: string;
    /**
     * IDs der beiden Filter. `stil` setzt sie als `url(#…)` in die
     * CSS-Variablen `--f-bp-soft` und `--f-bp-bloom`; das CSS-Modul nennt nie
     * eine feste ID.
     */
    ids: {
        soft: string;
        bloom: string;
    };
    stil: Readonly<Record<string, string>>;
    knoten: Knoten[];
};
export declare function explosionProfil({ name, kategorie, wertung, anzahl, idPraefix, rot, }?: ExplosionEingabe): ExplosionProfil;

/* ---- nur im Bündel ---- */

/** Klassen aus werkplan.module.css: lokaler Name auf den Namen in bundle.css. Kein Export des Pakets. */
export declare const WERKPLAN_KLASSEN: Readonly<Record<string, string>>;
