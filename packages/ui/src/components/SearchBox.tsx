import { IconSearch } from "@tabler/icons-react";
import { useUiCopy } from "../copy/UiCopyProvider";
import { cx } from "./cx";

export function SearchBox({
  className,
  value,
  onChange,
  placeholder,
  "aria-label": ariaLabel,
}: {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
}) {
  const copy = useUiCopy();
  const shown = placeholder ?? copy.searchPlaceholder;
  return (
    <label className={cx("ui-search", className)}>
      <IconSearch size={15} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={shown}
        aria-label={ariaLabel ?? shown}
      />
    </label>
  );
}
