import type { ComponentPropsWithRef } from "react";
import { cx } from "./cx";

type IconButtonProps = ComponentPropsWithRef<"button"> & {
  /** An icon has no words of its own, so the button needs a name. */
  "aria-label": string;
};

/** A square button holding one icon. */
export function IconButton({
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cx("ui-icon-button", className)}
      type={type}
      {...props}
    />
  );
}
