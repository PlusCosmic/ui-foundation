import type { ComponentPropsWithRef } from "react";
import { cx } from "./cx";

type InputProps = ComponentPropsWithRef<"input"> & {
  compact?: boolean;
};

export function Input({ className, compact = false, ...props }: InputProps) {
  return (
    <input
      className={cx("ui-input", compact && "ui-input-compact", className)}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: ComponentPropsWithRef<"textarea">) {
  return (
    <textarea className={cx("ui-input ui-textarea", className)} {...props} />
  );
}
