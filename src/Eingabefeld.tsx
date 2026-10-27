import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

import css from "./eingabefeld.module.css";

// Text- und Mehrzeilenfeld (DS Werkplan 2.0, ADR-261) im Stil der Formulare
// der Kundenseite im Admin (Einwilligung in ZustimmungKarte, Fehler melden,
// Google-Aktionen). Label über dem Feld, darunter Hinweis und Fehlertext; beide
// hängen per `aria-describedby` am Feld, ein Fehler setzt `aria-invalid`. Alle
// übrigen Attribute gehen ans Feld. Ohne `id` vergibt React eine.

type Gemeinsam = {
  label: ReactNode;
  hinweis?: ReactNode;
  /** Fehlertext; vorhanden heißt ungültig. Angesagt über role="alert". */
  fehler?: ReactNode;
};

export type EingabefeldProps =
  | (Gemeinsam & { mehrzeilig?: false } & InputHTMLAttributes<HTMLInputElement>)
  | (Gemeinsam & { mehrzeilig: true } & TextareaHTMLAttributes<HTMLTextAreaElement>);

export function Eingabefeld(props: EingabefeldProps) {
  const eigeneId = useId();
  const { label, hinweis, fehler, mehrzeilig, id = eigeneId, className, ...feld } = props;
  const hinweisId = `${id}-hinweis`;
  const fehlerId = `${id}-fehler`;
  const beschrieben = [feld["aria-describedby"], hinweis ? hinweisId : null, fehler ? fehlerId : null].filter(Boolean).join(" ") || undefined;
  const gemeinsam = {
    id,
    className: [css.feld, className].filter(Boolean).join(" "),
    "aria-describedby": beschrieben,
    "aria-invalid": fehler ? true : feld["aria-invalid"],
  };

  return (
    <div className={css.eingabe}>
      <label htmlFor={id} className={css.label}>
        {label}
      </label>
      {mehrzeilig ? (
        <textarea {...(feld as TextareaHTMLAttributes<HTMLTextAreaElement>)} {...gemeinsam} />
      ) : (
        <input {...(feld as InputHTMLAttributes<HTMLInputElement>)} {...gemeinsam} />
      )}
      {hinweis ? (
        <p id={hinweisId} className={css.hinweis}>
          {hinweis}
        </p>
      ) : null}
      {fehler ? (
        <p id={fehlerId} className={css.fehler} role="alert">
          {fehler}
        </p>
      ) : null}
    </div>
  );
}
