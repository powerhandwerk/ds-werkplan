// Attrappen für Browser-APIs, die jsdom nicht kennt: matchMedia und
// IntersectionObserver. requestAnimationFrame fälscht
// `vi.useFakeTimers({ toFake: [..., "requestAnimationFrame"] })`.
// Jede Attrappe gilt bis zum Ende des Tests; afterEach stellt den Ausgangszustand
// wieder her (ohne Attrappe fehlen beide APIs, wie in jsdom und alten Browsern).

import { afterEach } from "vitest";

const aufraeumen: (() => void)[] = [];

afterEach(() => {
  for (const zurueck of aufraeumen.splice(0).reverse()) zurueck();
});

function setzeGlobal(name: string, wert: unknown): void {
  const ziel = globalThis as unknown as Record<string, unknown>;
  const hatte = Object.prototype.hasOwnProperty.call(ziel, name);
  const vorher = ziel[name];
  ziel[name] = wert;
  aufraeumen.push(() => {
    if (hatte) ziel[name] = vorher;
    else delete ziel[name];
  });
}

/** matchMedia: `trifft(abfrage)` entscheidet, ob eine Media-Abfrage zutrifft. */
function attrappeMatchMedia(trifft: (abfrage: string) => boolean): void {
  setzeGlobal("matchMedia", (abfrage: string) => ({
    matches: trifft(abfrage),
    media: abfrage,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  }));
}

/**
 * Gerät für matchMedia: reduzierte Bewegung an oder aus, Zeiger mit oder ohne
 * Hover (ohne Hover = Handy). Unbekannte Abfragen treffen nicht.
 */
export function attrappeGeraet({ reduziert = false, hover = true }: { reduziert?: boolean; hover?: boolean } = {}): void {
  attrappeMatchMedia((abfrage) => {
    if (/prefers-reduced-motion:\s*reduce/.test(abfrage)) return reduziert;
    if (/prefers-reduced-motion:\s*no-preference/.test(abfrage)) return !reduziert;
    if (/\((any-)?hover:\s*hover\)/.test(abfrage)) return hover;
    if (/\((any-)?hover:\s*none\)/.test(abfrage)) return !hover;
    return false;
  });
}

/** Ein angelegter IntersectionObserver der Attrappe. */
export interface Beobachter {
  rueckruf: IntersectionObserverCallback;
  optionen: IntersectionObserverInit | undefined;
  ziele: Set<Element>;
  getrennt: boolean;
  /** Die Instanz selbst, wie sie der Rückruf als zweites Argument bekommt. */
  instanz: IntersectionObserver;
}

export interface BeobachterAttrappe {
  /** Alle angelegten Beobachter, in der Reihenfolge des Anlegens. */
  beobachter: Beobachter[];
  /**
   * Meldet allen Beobachtern dieses Ziels den sichtbaren Anteil (0 bis 1).
   * In Render-Tests in `act()` aufrufen.
   */
  melde(ziel: Element, anteil: number): void;
}

/** IntersectionObserver, den der Test selbst auslöst. */
export function attrappeBeobachter(): BeobachterAttrappe {
  const beobachter: Beobachter[] = [];
  class IntersectionObserverAttrappe {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds: readonly number[];
    private readonly eintrag: Beobachter;
    constructor(rueckruf: IntersectionObserverCallback, optionen?: IntersectionObserverInit) {
      const schwelle = optionen?.threshold ?? 0;
      this.thresholds = Array.isArray(schwelle) ? schwelle : [schwelle];
      this.eintrag = {
        rueckruf,
        optionen,
        ziele: new Set(),
        getrennt: false,
        instanz: this as unknown as IntersectionObserver,
      };
      beobachter.push(this.eintrag);
    }
    observe(ziel: Element) {
      this.eintrag.ziele.add(ziel);
    }
    unobserve(ziel: Element) {
      this.eintrag.ziele.delete(ziel);
    }
    disconnect() {
      this.eintrag.ziele.clear();
      this.eintrag.getrennt = true;
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  setzeGlobal("IntersectionObserver", IntersectionObserverAttrappe);
  return {
    beobachter,
    melde(ziel, anteil) {
      for (const b of beobachter) {
        if (b.getrennt || !b.ziele.has(ziel)) continue;
        const rechteck = ziel.getBoundingClientRect();
        const eintrag = {
          target: ziel,
          intersectionRatio: anteil,
          isIntersecting: anteil > 0,
          boundingClientRect: rechteck,
          intersectionRect: rechteck,
          rootBounds: null,
          time: 0,
        } as IntersectionObserverEntry;
        b.rueckruf([eintrag], b.instanz);
      }
    },
  };
}
