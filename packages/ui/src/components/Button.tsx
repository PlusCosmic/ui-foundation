import type { ComponentPropsWithRef } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

type ButtonProps = ComponentPropsWithRef<"button"> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

/** The class names a button of this kind wears, for links and other elements that should look like one. */
export function buttonClass(
  variant: ButtonVariant = "secondary",
  size: ButtonSize = "md",
) {
  return cx("ui-button", `ui-button-${variant}`, `ui-button-${size}`);
}

export function Button({
  className,
  size = "md",
  type = "button",
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(buttonClass(variant, size), className)}
      type={type}
      {...props}
    />
  );
}
