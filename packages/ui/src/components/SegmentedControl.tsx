import type { ReactNode } from "react";
import { cx } from "./cx";

export type Segment<T extends string> = { value: T; label: ReactNode };

/** One outlined track of choices, the chosen one raised out of it. Each choice is a pressed or unpressed button. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: {
  options: readonly Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  return (
    <div
      className={cx("ui-segmented", className)}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="ui-segment"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
