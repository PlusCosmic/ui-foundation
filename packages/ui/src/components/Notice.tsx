import type { ReactNode } from "react";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
} from "@tabler/icons-react";
import { cx } from "./cx";

export type NoticeTone = "info" | "success" | "warning" | "error";

const toneIcons = {
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  error: IconCircleX,
} as const;

/**
 * A message in one of four tones; the icon and the tinted edge carry the tone as well as the colour. `compact` is
 * the one-line form for under a form or inside a card. Errors are announced as alerts, the rest as status.
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
        {children ? <div className="ui-notice-text">{children}</div> : null}
        {actions ? <div className="ui-actions">{actions}</div> : null}
      </div>
    </div>
  );
}
