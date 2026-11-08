import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./cx";

type FieldProps = Omit<ComponentPropsWithoutRef<"label">, "children"> & {
  label: ReactNode;
  /** A line under the control saying what it's for. */
  hint?: ReactNode;
  /** What's wrong with the value, in place of the hint. */
  error?: ReactNode;
  children: ReactNode;
};

/** A label over one control, with an optional hint or error under it. */
export function Field({
  children,
  className,
  error,
  hint,
  label,
  ...props
}: FieldProps) {
  return (
    <label className={cx("ui-field", className)} {...props}>
      <span className="ui-field-label">{label}</span>
      {children}
      {error ? (
        <span className="ui-field-error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="ui-field-hint">{hint}</span>
      ) : null}
    </label>
  );
}
