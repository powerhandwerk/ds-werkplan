import type React from "react";
import css from "./werkplan.module.css";

type Tag = "div" | "section" | "form";

/**
 * Sucher-Ecken wie im Kamerasucher (DS Werkplan 2.0, ADR-261;
 * werkplan.module.css `.ecken`): vier 10-px-Winkel in den Ecken des Rahmens,
 * rein dekorativ (aria-hidden). Umschließt seinen Inhalt; `as` wählt das
 * Element, damit auch ein Formular den Rahmen tragen kann.
 */
export function SucherEcken({
  as: Element = "div",
  className,
  children,
  ...rest
}: { as?: Tag; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLElement> &
  Pick<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "noValidate">) {
  return (
    <Element className={[css.ecken, className].filter(Boolean).join(" ")} {...rest}>
      <span className={css.eckeOl} aria-hidden="true" />
      <span className={css.eckeOr} aria-hidden="true" />
      <span className={css.eckeUl} aria-hidden="true" />
      <span className={css.eckeUr} aria-hidden="true" />
      {children}
    </Element>
  );
}
