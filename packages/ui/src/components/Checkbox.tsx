import type { ComponentPropsWithRef } from "react";
import { cx } from "./cx";

export function Checkbox({
  className,
  ...props
}: Omit<ComponentPropsWithRef<"input">, "type">) {
  return (
    <input
      className={cx("ui-checkbox", className)}
      {...props}
      type="checkbox"
    />
  );
}
