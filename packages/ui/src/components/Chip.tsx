import type { ComponentPropsWithoutRef } from "react";
import { cx } from "./cx";

type ChipProps = ComponentPropsWithoutRef<"button"> & {
  /** A chip that's on, such as the filter in use. */
  active?: boolean;
};

/** A small toggle, such as a filter; give a row of them `ChipRow`. */
export function Chip({ active = false, className, ...props }: ChipProps) {
  return (
    <button
      className={cx("ui-chip", active && "active", className)}
      type="button"
      aria-pressed={active}
      {...props}
    />
  );
}

export function ChipRow({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={cx("ui-chip-row", className)} {...props} />;
}
