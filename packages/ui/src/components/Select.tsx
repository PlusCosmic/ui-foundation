import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IconChevronDown } from "@tabler/icons-react";
import { useUiCopy } from "../copy/UiCopyProvider";
import { cx } from "./cx";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectProps = {
  "aria-label"?: string;
  className?: string;
  disabled?: boolean;
  options: SelectOption[];
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
};

type SelectPosition = {
  bottom?: number;
  left: number;
  maxHeight: number;
  top?: number;
  width: number;
};

// Matches .ui-select-list's max-height in styles/components.css.
const listMaxHeight = 320;
const listGap = 6;
const viewportMargin = 12;

/**
 * A drop-down of options in the app's own style. Arrow keys move through the options, Enter or Space picks one and
 * Escape closes the list, which opens upwards when there's more room above. The list is portalled to <body>.
 */
export function Select({
  "aria-label": ariaLabel,
  className,
  disabled = false,
  options,
  placeholder,
  value,
  onValueChange,
}: SelectProps) {
  const copy = useUiCopy();
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState("");
  const [position, setPosition] = useState<SelectPosition | null>(null);
  const selectedOption = options.find((option) => option.value === value);
  const enabledOptions = useMemo(
    () => options.filter((option) => !option.disabled),
    [options],
  );

  useLayoutEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const spaceBelow =
        window.innerHeight - rect.bottom - listGap - viewportMargin;
      const spaceAbove = rect.top - listGap - viewportMargin;
      // Open upwards when the list won't fit below the trigger and there's more room above it.
      const openUp = spaceBelow < listMaxHeight && spaceAbove > spaceBelow;
      setPosition({
        left: rect.left,
        width: rect.width,
        maxHeight: Math.min(listMaxHeight, openUp ? spaceAbove : spaceBelow),
        ...(openUp
          ? { bottom: window.innerHeight - rect.top + listGap }
          : { top: rect.bottom + listGap }),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setActiveValue(value || enabledOptions[0]?.value || "");

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [enabledOptions, open, value]);

  function moveActive(direction: 1 | -1) {
    if (!enabledOptions.length) return;
    const currentIndex = Math.max(
      0,
      enabledOptions.findIndex((option) => option.value === activeValue),
    );
    const next =
      enabledOptions[
        (currentIndex + direction + enabledOptions.length) %
          enabledOptions.length
      ];
    setActiveValue(next.value);
  }

  function commit(nextValue: string) {
    onValueChange(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        aria-activedescendant={open ? `${id}-${activeValue}` : undefined}
        aria-controls={`${id}-listbox`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cx("ui-select-trigger", className)}
        disabled={disabled}
        type="button"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) setOpen(true);
            else moveActive(1);
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) setOpen(true);
            else moveActive(-1);
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!open) setOpen(true);
            else commit(activeValue);
          }
          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        <span
          className={selectedOption ? undefined : "ui-select-placeholder"}
          title={selectedOption?.label}
        >
          {selectedOption?.label ?? placeholder ?? copy.selectPlaceholder}
        </span>
        <IconChevronDown size={15} aria-hidden="true" />
      </button>

      {open && position
        ? createPortal(
            <div
              ref={listRef}
              className="ui-select-list"
              id={`${id}-listbox`}
              role="listbox"
              style={{
                bottom: position.bottom,
                left: position.left,
                maxHeight: position.maxHeight,
                top: position.top,
                width: position.width,
              }}
            >
              {options.map((option) => (
                <button
                  id={`${id}-${option.value}`}
                  className={cx(
                    "ui-select-option",
                    option.value === value && "selected",
                    option.value === activeValue && "active",
                  )}
                  disabled={option.disabled}
                  key={option.value}
                  role="option"
                  type="button"
                  aria-selected={option.value === value}
                  onClick={() => commit(option.value)}
                  onMouseEnter={() => setActiveValue(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
