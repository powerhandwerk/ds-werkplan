import type React from "react";
import { ChevronDownIcon } from "./icons";
import css from "./reiter.module.css";

// Navigation der Kundenseite (DS Werkplan 2.0, ADR-261). Herkunft ist die
// Kundenseite im Admin: die Reiter-Leiste aus components/kundenseite/Kopfband.tsx
// und das Handy-Menü aus components/kundenseite/HandyMenue.tsx. Logo, Pille
// „Sicher angemeldet“ und der Weg zu „Wer hat Zugriff“ bleiben Sache der App.
// Liest die Flächenrollen --wp-* und gehört deshalb in eine Fläche (.nacht,
// .papier, .aufNacht, .aufPapier aus werkplan.module.css).

/** Art des Stands neben einem Reiter im Menü. */
export type ReiterStandArt = "hervor" | "fehler" | "ruhig";

export interface ReiterEintrag {
  kennung: string;
  name: string;
  /** Ziel des Reiters; null heißt ohne Funktion (dann ein <span> statt Link). */
  href: string | null;
  /** Stand im Handy-Menü, etwa „2 warten auf Sie“; ohne Stand nur der Name. */
  stand?: { text: string; art: ReiterStandArt } | null;
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

export const REITER_TEXTE: ReiterTexte = {
  leiste: "Bereiche Ihrer Seite",
  menue: "Menü",
  menueLabel: (wartend) =>
    wartend === 0 ? "Menü" : wartend === 1 ? "Menü, ein Schritt wartet auf Sie" : `Menü, ${wartend} Schritte warten auf Sie`,
  menueListe: "Bereiche Ihrer Seite im Menü",
};

const STAND_KLASSE: Record<ReiterStandArt, string> = {
  hervor: css.standHervor,
  fehler: css.standFehler,
  ruhig: css.standRuhig,
};

/** Link oder, ohne Ziel, ein <span>; `aria-current="page"` am aktiven Reiter. */
function ReiterZiel({ href, aktiv, className, children }: { href: string | null; aktiv: boolean; className: string; children: React.ReactNode }) {
  const aktuell = aktiv ? ("page" as const) : undefined;
  return href ? (
    <a href={href} aria-current={aktuell} className={className}>
      {children}
    </a>
  ) : (
    <span aria-current={aktuell} className={className}>
      {children}
    </span>
  );
}

/**
 * Ab 1024 px die Reiter-Leiste, darunter das Menü als `<details>` und
 * `<summary>` ohne Client-JavaScript, damit es schon vor der Hydrierung
 * aufgeht. Der Knopf „Menü“ trägt die Zahl wartender Schritte, darunter
 * dieselben Reiter als Liste mit ihrem Stand. Beide stehen nebeneinander in
 * der Zeile der App, die positioniert sein muss (die Menütafel legt sich
 * darunter). `ende` steht als letztes Kind in der Menüliste und bringt sein
 * `<li>` selbst mit (etwa die Zeile „Neuigkeiten“).
 */
export function Reiter({
  eintraege,
  aktiv,
  wartend = 0,
  texte = REITER_TEXTE,
  ende,
}: {
  eintraege: readonly ReiterEintrag[];
  /** Kennung des aktiven Reiters; null, wenn keiner aktiv ist. */
  aktiv: string | null;
  /** Zahl wartender Schritte am Menüknopf. */
  wartend?: number;
  texte?: ReiterTexte;
  ende?: React.ReactNode;
}) {
  return (
    <>
      <nav aria-label={texte.leiste} className={css.reiterLeiste}>
        <ul className={css.reiter}>
          {eintraege.map((r) => {
            const istAktiv = r.kennung === aktiv;
            return (
              <li key={r.kennung}>
                <ReiterZiel href={r.href} aktiv={istAktiv} className={istAktiv ? css.reiterAktiv : css.reiterLink}>
                  {r.name}
                </ReiterZiel>
              </li>
            );
          })}
        </ul>
      </nav>
      <details className={css.menue}>
        <summary className={css.menueKnopf} aria-label={texte.menueLabel(wartend)}>
          <span>{texte.menue}</span>
          {wartend > 0 ? (
            <span className={css.menueZahl} aria-hidden="true">
              {wartend}
            </span>
          ) : null}
          <ChevronDownIcon size={18} strokeWidth={1.75} className={css.menuePfeil} />
        </summary>
        <nav aria-label={texte.menueListe} className={css.menueTafel}>
          <ul className={css.menueListe}>
            {eintraege.map((r) => {
              const istAktiv = r.kennung === aktiv;
              return (
                <li key={r.kennung}>
                  <ReiterZiel href={r.href} aktiv={istAktiv} className={istAktiv ? `${css.menueZeile} ${css.menueAktiv}` : css.menueZeile}>
                    <span className={css.menueName}>{r.name}</span>
                    {r.stand ? <span className={`${css.blickStand} ${STAND_KLASSE[r.stand.art]}`}>{r.stand.text}</span> : null}
                  </ReiterZiel>
                </li>
              );
            })}
            {ende}
          </ul>
        </nav>
      </details>
    </>
  );
}
