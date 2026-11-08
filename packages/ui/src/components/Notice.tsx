import type { ReactNode } from "react";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
} from "@tabler/icons-react";
import { cx } from "./cx";

export type NoticeTone = "neutral" | "info" | "success" | "warning" | "error";

const toneIcons = {
  neutral: IconInfoCircle,
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  error: IconCircleX,
} as const;

/**
 * A message in a tone (`neutral` grey, `info` blue, `success`, `warning`, `error`); the icon and the tinted edge carry
 * the tone as well as the colour. `compact` is the one-line form for under a form or inside a card. Errors are
 * announced as alerts, the rest as status. Plain text children go in a paragraph; elements (paragraphs, a row of
 * actions) sit directly in the body, a gap apart.
 */
export function Notice({
  tone = "info",
  title,
  children,
  actions,
  icon,
  compact = false,
  className,
}: {
  tone?: NoticeTone;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  /** In place of the tone's icon; `false` for none. */
  icon?: ReactNode | false;
  compact?: boolean;
  className?: string;
}) {
  const role = tone === "error" ? "alert" : "status";
  if (compact) {
    return (
      <p
        className={cx("ui-notice-compact", className)}
        data-tone={tone}
        role={role}
      >
        {children ?? title}
      </p>
    );
  }
  const ToneIcon = toneIcons[tone];
  const shownIcon =
    icon === false ? null : (icon ?? <ToneIcon size={18} aria-hidden="true" />);
  return (
    <div
      className={cx("ui-notice", className)}
      data-tone={tone}
      data-iconless={shownIcon ? undefined : ""}
      role={role}
    >
      {shownIcon ? <span className="ui-notice-icon">{shownIcon}</span> : null}
      <div className="ui-notice-body">
        {title ? <p className="ui-notice-title">{title}</p> : null}
        {typeof children === "string" || typeof children === "number" ? (
          <p className="ui-notice-text">{children}</p>
        ) : (
          children
        )}
        {actions ? <div className="ui-actions">{actions}</div> : null}
      </div>
    </div>
  );
}
