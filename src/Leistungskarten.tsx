"use client";

// Animierte Leistungskarten (Grafikstil A, ADR-262).
// Port aus powerhandwerk-website, components/werkplan/Leistungskarten.tsx (keteso 923a5c4).
// Neu gegenüber der Website: das Szenen-Register kommt als Prop, Karten mit
// unbekanntem Szenen-Schlüssel fallen weg, und ohne matchMedia oder
// IntersectionObserver steht die Geste sofort am Ende.

import { useEffect, useId, useRef, type MutableRefObject } from "react";

import css from "./leistungskarten.module.css";
import {
  ebeneAusBild,
  kippung,
  naehere,
  ruheWert,
  vermesse,
  zeichne,
  zeichneRuhe,
  zeigerZiel,
  type LeistungsKarte,
  type Szene,
  type SzenenWert,
} from "./leistungskarten-engine";
import { uhrWinkel } from "./leistungskarten-formen";
import { SucherEcken } from "./SucherEcken";
import { GRAFIK } from "./tokens";
import w from "./werkplan.module.css";

/** Längster Zeitschritt pro Bild, damit ein Tab-Wechsel keinen Sprung erzeugt (Sekunden). */
const MAX_DT = 0.05;
/** Nachführen der Uhr im Ruhezustand (Millisekunden). */
const UHR_TAKT = 60_000;
/** Bei genau vier Karten greift das eigene Raster (2 × 2 bzw. eine Reihe). */
const VIER = 4;

/** Szenen-Register: Schlüssel aus `LeistungsKarte.szene` auf die Szene. */
export type SzenenRegister = Readonly<Record<string, Szene>>;

const hatSzene = (szenen: SzenenRegister, schluessel: string | undefined): schluessel is string =>
  schluessel !== undefined && Object.prototype.hasOwnProperty.call(szenen, schluessel);

type KartenZustand = {
  el: HTMLElement;
  svg: SVGSVGElement;
  g: SVGGElement;
  szene: Szene;
  wert: SzenenWert;
  ziel: SzenenWert;
  /** Handy: Karte ist im Bild, die Dauerbewegung läuft. */
  spielt: boolean;
  /** Markup muss unabhängig von Wertänderungen neu gezeichnet werden. */
  neu: boolean;
};

/**
 * Motor für alle Karten eines Rasters: ein gemeinsamer rAF-Takt, der nur
 * läuft, solange sich etwas bewegt. Hover und Tastaturfokus aktivieren eine
 * Karte, auf Geräten ohne Hover spielt die Geste einmal ab, sobald die Karte
 * im Bild ist. Bei reduzierter Bewegung steht jede Szene im Endzustand, ebenso
 * ohne Hover, wenn der Browser keinen IntersectionObserver kennt.
 */
function useLeistungskartenMotor(
  kartenRefs: MutableRefObject<(HTMLElement | null)[]>,
  szenen: SzenenRegister,
  szenenSchluessel: string,
  aktivKlasse: string,
) {
  useEffect(() => {
    const medien = typeof window.matchMedia === "function" ? (abfrage: string) => window.matchMedia(abfrage) : null;
    const reduziert = medien?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    // Ohne matchMedia ist das Gerät unbekannt: wie ein Handy behandeln.
    const ohneHover = medien?.("(hover: none)")?.matches ?? true;
    const mitBeobachter = typeof IntersectionObserver === "function";
    // Endzustand ohne Anlauf: reduzierte Bewegung, oder ohne Hover keine Möglichkeit, die Geste auszulösen.
    const sofortEnde = reduziert || (ohneHover && !mitBeobachter);
    const aufraeumen: (() => void)[] = [];

    const karten: KartenZustand[] = [];
    for (const el of kartenRefs.current) {
      const id = el?.dataset.szene;
      const svg = el?.querySelector("svg");
      const g = svg?.querySelector("g");
      if (!el || !hatSzene(szenen, id) || !svg || !g) continue;
      const szene = szenen[id];
      karten.push({ el, svg, g, szene, wert: ruheWert(szene), ziel: ruheWert(szene), spielt: false, neu: false });
    }

    /** Ruhezustand im Client: Uhrzeit statt festem Server-Winkel, bei `sofortEnde` gleich das Ende. */
    const ruhe = (k: KartenZustand): SzenenWert => ({
      ...k.szene.ruhe,
      ...k.szene.ruheImClient?.(),
      ...(sofortEnde ? { t: 1 } : {}),
    });

    let laeuft = false;
    let letzte = 0;
    let rahmen = 0;

    const tick = (ts: number) => {
      const dt = letzte ? Math.min(MAX_DT, (ts - letzte) / 1000) : 1 / 60;
      letzte = ts;
      let ruhig = true;
      for (const k of karten) {
        let bewegt = false;
        if (k.szene.laufend && !reduziert && (k.el.classList.contains(aktivKlasse) || k.spielt)) {
          k.wert.clk = (k.wert.clk ?? 0) + dt;
          bewegt = true;
        }
        if (naehere(k.wert, k.ziel, reduziert)) bewegt = true;
        if (bewegt || k.neu) {
          k.g.innerHTML = zeichne(k.szene, k.wert);
          k.neu = false;
        }
        if (bewegt) ruhig = false;
      }
      laeuft = !ruhig;
      if (laeuft) rahmen = requestAnimationFrame(tick);
      else letzte = 0;
    };
    const wecken = () => {
      if (!laeuft) {
        laeuft = true;
        rahmen = requestAnimationFrame(tick);
      }
    };

    // Client-Ruhezustand ohne Anlauf übernehmen (Uhrzeit, Endzustand)
    for (const k of karten) {
      const r = ruhe(k);
      Object.assign(k.wert, r);
      Object.assign(k.ziel, r);
      k.neu = true;
    }
    wecken();

    const aktiv = (k: KartenZustand, an: boolean) => {
      k.el.classList.toggle(aktivKlasse, an);
      if (an) k.ziel.t = 1;
      else {
        Object.assign(k.ziel, ruhe(k));
        k.el.style.setProperty("--lk-rx", "0deg");
        k.el.style.setProperty("--lk-ry", "0deg");
      }
      wecken();
    };

    /** Zeigerposition in Szenenkoordinaten (Ebene z = 0), über die Bildschirm-Matrix des SVG. */
    const aufEbene = (k: KartenZustand, e: PointerEvent): [number, number] | null => {
      const matrix = k.svg.getScreenCTM?.();
      if (!matrix || typeof DOMPoint !== "function") return null;
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
      return ebeneAusBild(pt.x, pt.y);
    };

    for (const k of karten) {
      const betreten = (e: PointerEvent) => {
        if (e.pointerType !== "touch") aktiv(k, true);
      };
      const verlassen = (e: PointerEvent) => {
        if (e.pointerType !== "touch") aktiv(k, false);
      };
      const bewegen = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const r = k.el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const relX = (e.clientX - r.left) / r.width;
        const relY = (e.clientY - r.top) / r.height;
        if (!reduziert) {
          const { rx, ry } = kippung(relX, relY);
          k.el.style.setProperty("--lk-ry", `${ry.toFixed(2)}deg`);
          k.el.style.setProperty("--lk-rx", `${rx.toFixed(2)}deg`);
        }
        zeigerZiel(k.ziel, relX);
        if ("ang" in k.ziel) {
          const ebene = aufEbene(k, e);
          if (ebene) k.ziel.ang = uhrWinkel(ebene[0], ebene[1]);
        }
        wecken();
      };
      const fokus = () => {
        let sichtbar = true;
        try {
          sichtbar = k.el.matches(":focus-visible");
        } catch {
          // ältere Browser kennen :focus-visible nicht; dann zählt jeder Fokus
        }
        if (sichtbar) aktiv(k, true);
      };
      const unfokus = () => aktiv(k, false);
      k.el.addEventListener("pointerenter", betreten);
      k.el.addEventListener("pointerleave", verlassen);
      k.el.addEventListener("pointermove", bewegen);
      k.el.addEventListener("focus", fokus);
      k.el.addEventListener("blur", unfokus);
      aufraeumen.push(() => {
        k.el.removeEventListener("pointerenter", betreten);
        k.el.removeEventListener("pointerleave", verlassen);
        k.el.removeEventListener("pointermove", bewegen);
        k.el.removeEventListener("focus", fokus);
        k.el.removeEventListener("blur", unfokus);
      });
    }

    // Handy: kein Hover, die Geste läuft einmal ab, sobald die Karte im Bild ist
    if (ohneHover && !sofortEnde) {
      const io = new IntersectionObserver(
        (eintraege) => {
          for (const e of eintraege) {
            const k = karten.find((x) => x.el === e.target);
            if (!k) continue;
            k.spielt = e.isIntersecting;
            if (e.isIntersecting) {
              Object.assign(k.wert, k.szene.start());
              Object.assign(k.ziel, ruhe(k), { t: 1 });
              if ("mx" in k.ziel) k.ziel.mx = 0.35;
              if ("px" in k.ziel) {
                k.wert.px = 0;
                k.ziel.px = 0.85;
              }
              k.neu = true;
            } else Object.assign(k.ziel, ruhe(k));
            wecken();
          }
        },
        { threshold: GRAFIK.handyStartAnteil },
      );
      for (const k of karten) io.observe(k.el);
      aufraeumen.push(() => io.disconnect());
    }

    // Ruhezustand der Uhr jede Minute nachziehen
    const uhr = window.setInterval(() => {
      for (const k of karten) {
        const client = k.szene.ruheImClient?.();
        if (client && !k.el.classList.contains(aktivKlasse) && !k.spielt) {
          Object.assign(k.ziel, client);
          wecken();
        }
      }
    }, UHR_TAKT);
    aufraeumen.push(() => window.clearInterval(uhr));

    // Beschriftungen nach dem Laden der Schrift neu setzen
    let aktuell = true;
    document.fonts?.ready.then(() => {
      if (!aktuell) return;
      for (const k of karten) k.neu = true;
      wecken();
    });
    aufraeumen.push(() => {
      aktuell = false;
    });

    return () => {
      cancelAnimationFrame(rahmen);
      laeuft = false;
      for (const f of aufraeumen) f();
    };
  }, [kartenRefs, szenen, szenenSchluessel, aktivKlasse]);
}

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
export function Leistungskarten({
  karten,
  szenen,
  untergrund,
  breit = false,
}: {
  karten: readonly LeistungsKarte[];
  szenen: SzenenRegister;
  untergrund: "papier" | "nacht";
  breit?: boolean;
}) {
  const basisId = useId();
  const kartenRefs = useRef<(HTMLElement | null)[]>([]);
  const gueltig = karten.filter((k) => hatSzene(szenen, k.szene));
  useLeistungskartenMotor(kartenRefs, szenen, gueltig.map((k) => k.szene).join(","), css.an);
  const flaeche = untergrund === "papier" ? css.untergrundPapier : css.untergrundNacht;

  const variante = breit ? css.rasterBreit : gueltig.length === VIER ? css.rasterVier : undefined;

  return (
    <ul className={variante ? `${css.raster} ${variante}` : css.raster}>
      {gueltig.map((k, i) => {
        const szene = szenen[k.szene];
        const titelId = `${basisId}-${k.szene}`;
        return (
          <li key={k.szene} className={css.eintrag}>
            <article
              ref={(el) => {
                kartenRefs.current[i] = el;
              }}
              className={`${css.karte} ${flaeche}`}
              data-szene={k.szene}
              tabIndex={0}
              aria-labelledby={titelId}
            >
              <div className={css.kopf}>
                <h3 id={titelId} className={css.titel}>
                  {k.titel}
                </h3>
                {k.nr ? <span className={css.nr}>{k.nr}</span> : null}
              </div>
              <SucherEcken className={css.buehne} aria-hidden="true">
                <svg viewBox={vermesse(szene)} focusable="false">
                  <g dangerouslySetInnerHTML={{ __html: zeichneRuhe(szene) }} />
                </svg>
              </SucherEcken>
              <p className={css.teaser}>{k.teaser}</p>
              {k.schliesst ? <p className={`${w.beschriftung} ${css.schliesst}`}>{k.schliesst}</p> : null}
            </article>
          </li>
        );
      })}
    </ul>
  );
}
