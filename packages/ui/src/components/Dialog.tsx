import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useEffect, useEffectEvent, useId, useRef } from "react";
import { IconX } from "@tabler/icons-react";
import { useUiCopy } from "../copy/UiCopyProvider";
import { cx } from "./cx";
import { Eyebrow } from "./Misc";

/**
 * A modal dialog: eyebrow, title and a close button over the content. Escape or a click outside closes it unless
 * `busy` says a save is in flight. It takes focus when it opens and gives it back when it closes. Put the content
 * in `DialogBody` (which scrolls on short screens) and the buttons in `DialogActions`.
 */
export function Dialog({
  eyebrow,
  title,
  busy = false,
  onClose,
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  busy?: boolean;
  onClose: () => void;
  className?: string;
  /** The content, or a function given the title's id, for a form that wants `aria-labelledby`. */
  children: ReactNode | ((titleId: string) => ReactNode);
}) {
  const copy = useUiCopy();
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const close = () => {
    if (!busy) onClose();
  };
  const closeOnEscape = useEffectEvent(close);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOnEscape();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const dialog = dialogRef.current;
    if (dialog && !dialog.contains(document.activeElement)) {
      dialog.focus({ preventScroll: true });
    }
    return () => opener?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="ui-modal-layer" role="presentation" onMouseDown={close}>
      <section
        ref={dialogRef}
        className={cx("ui-modal", className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ui-modal-header">
          <div>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h2 className="ui-modal-title" id={titleId}>
              {title}
            </h2>
          </div>
          <button
            className="ui-icon-button"
            type="button"
            aria-label={copy.close}
            onClick={close}
            disabled={busy}
          >
            <IconX size={16} aria-hidden="true" />
          </button>
        </header>
        {typeof children === "function" ? children(titleId) : children}
      </section>
    </div>
  );
}

export function DialogBody({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={cx("ui-modal-body", className)} {...props} />;
}

/** The dialog's buttons; the first child sits on the left, the rest on the right. */
export function DialogActions({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={cx("ui-modal-actions", className)} {...props} />;
}
