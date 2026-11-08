import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconX } from "@tabler/icons-react";
import { useUiCopy } from "../copy/UiCopyProvider";
import { cx } from "./cx";
import { Kbd } from "./Misc";

export type ToastAction = {
  label: ReactNode;
  onAction: () => void | Promise<void>;
  icon?: ReactNode;
  /** A shortcut to show beside the label, such as "Ctrl+Z". Listening for it is the caller's job. */
  hint?: ReactNode;
  /** Closes the toast once the action has run. On by default. */
  closes?: boolean;
};

export type Toast = {
  message: ReactNode;
  tone?: "neutral" | "error";
  icon?: ReactNode;
  action?: ToastAction;
  /** A further control, such as a link to where the change can be seen. */
  extra?: ReactNode;
  /** How long it stays, in milliseconds, unless it's pointed at or has focus. */
  duration?: number;
};

type ToastApi = {
  /** Shows a toast in place of the one showing; resolves to its id. */
  show: (toast: Toast) => number;
  /** Closes the toast with this id, or whichever is showing. */
  close: (id?: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION = 10_000;

/**
 * One toast at a time, at the foot of the page, for news such as "Moved to the bin · Undo". It goes after a while,
 * but never from under a pointer or keyboard focus, and a newer toast replaces an older one.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(Toast & { id: number }) | null>(null);
  const [held, setHeld] = useState(false);
  const [running, setRunning] = useState(false);
  const nextId = useRef(0);

  const show = useCallback((next: Toast) => {
    nextId.current += 1;
    setToast({ ...next, id: nextId.current });
    return nextId.current;
  }, []);

  // Closing lets go of it too: focus or a pointer on a toast that's gone mustn't keep the next one up.
  const close = useCallback((id?: number) => {
    setToast((current) =>
      id === undefined || current?.id === id ? null : current,
    );
    setHeld(false);
  }, []);

  useEffect(() => {
    if (!toast || held) return;
    const timer = window.setTimeout(
      () => close(toast.id),
      toast.duration ?? DEFAULT_DURATION,
    );
    return () => window.clearTimeout(timer);
  }, [toast, held, close]);

  const runAction = async (shown: Toast & { id: number }) => {
    const action = shown.action;
    if (!action || running) return;
    setRunning(true);
    try {
      await action.onAction();
    } finally {
      setRunning(false);
      if (action.closes !== false) close(shown.id);
    }
  };

  const api = useMemo(() => ({ show, close }), [show, close]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastLayer onHeldChange={setHeld}>
        {toast ? (
          <ToastCard
            key={toast.id}
            tone={toast.tone}
            icon={toast.icon}
            message={toast.message}
            onClose={() => close(toast.id)}
          >
            {toast.action ? (
              <ToastButton
                onClick={() => void runAction(toast)}
                disabled={running}
                icon={toast.action.icon}
                hint={toast.action.hint}
              >
                {toast.action.label}
              </ToastButton>
            ) : null}
            {toast.extra}
          </ToastCard>
        ) : null}
      </ToastLayer>
    </ToastContext.Provider>
  );
}

/**
 * The pieces `ToastProvider` draws with, for an app whose toast keeps its own state (several kinds of news, an undo
 * that runs from a shortcut too). The layer is the live region and tells its owner while a pointer or focus is on it,
 * so the toast can wait.
 */
export function ToastLayer({
  children,
  onHeldChange,
}: {
  children?: ReactNode;
  onHeldChange?: (held: boolean) => void;
}) {
  return (
    <div
      className="ui-toast-layer"
      role="status"
      aria-live="polite"
      onPointerEnter={() => onHeldChange?.(true)}
      onPointerLeave={() => onHeldChange?.(false)}
      onFocus={() => onHeldChange?.(true)}
      onBlur={() => onHeldChange?.(false)}
    >
      {children}
    </div>
  );
}

/** One toast: its icon, message, whatever controls follow, and the close button. */
export function ToastCard({
  tone = "neutral",
  icon,
  message,
  children,
  onClose,
}: {
  tone?: "neutral" | "error";
  icon?: ReactNode;
  message: ReactNode;
  children?: ReactNode;
  onClose: () => void;
}) {
  const copy = useUiCopy();
  return (
    <div className={cx("ui-toast", tone === "error" && "error")}>
      {icon}
      <span className="ui-toast-message">{message}</span>
      {children}
      <button
        type="button"
        className="ui-icon-button ui-toast-close"
        aria-label={copy.toast.dismiss}
        onClick={onClose}
      >
        <IconX size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

/** A toast's action, such as Undo, with an optional shortcut beside its label. */
export function ToastButton({
  children,
  icon,
  hint,
  onClick,
  disabled,
}: {
  children: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="ui-toast-action"
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {children}
      {hint ? <Kbd>{hint}</Kbd> : null}
    </button>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast needs a ToastProvider");
  return api;
}
