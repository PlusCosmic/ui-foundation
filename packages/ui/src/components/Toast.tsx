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
  const copy = useUiCopy();
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
      <div
        className="ui-toast-layer"
        role="status"
        aria-live="polite"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        {toast ? (
          <div
            key={toast.id}
            className={cx("ui-toast", toast.tone === "error" && "error")}
          >
            {toast.icon}
            <span className="ui-toast-message">{toast.message}</span>
            {toast.action ? (
              <button
                type="button"
                className="ui-toast-action"
                onClick={() => void runAction(toast)}
                disabled={running}
              >
                {toast.action.icon}
                {toast.action.label}
                {toast.action.hint ? <Kbd>{toast.action.hint}</Kbd> : null}
              </button>
            ) : null}
            {toast.extra}
            <button
              type="button"
              className="ui-icon-button ui-toast-close"
              aria-label={copy.toast.dismiss}
              onClick={() => close(toast.id)}
            >
              <IconX size={14} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast needs a ToastProvider");
  return api;
}
