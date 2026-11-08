import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./cx";

/** A small spinning ring for work in progress; pair it with words for screen readers. */
export function Spinner({ className }: { className?: string }) {
  return <span className={cx("ui-spinner", className)} aria-hidden="true" />;
}

/** Read by screen readers, never shown. */
export function VisuallyHidden({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return <span className={cx("ui-visually-hidden", className)} {...props} />;
}

/** A key on the keyboard, as in a shortcut hint. */
export function Kbd({ className, ...props }: ComponentPropsWithoutRef<"kbd">) {
  return <kbd className={cx("ui-kbd", className)} {...props} />;
}

/** The small capitals over a heading that say what part of the app it's in. */
export function Eyebrow({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return <p className={cx("ui-eyebrow", className)} {...props} />;
}

/** In place of a list with nothing in it yet: what would be here and how to add it. */
export function EmptyState({
  title,
  children,
  actions,
  className,
}: {
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("ui-empty", className)}>
      {title ? <p className="ui-empty-title">{title}</p> : null}
      {children ? <div className="ui-empty-body">{children}</div> : null}
      {actions ? <div className="ui-actions">{actions}</div> : null}
    </div>
  );
}

/**
 * The top of a page: an eyebrow, the title in the display face (an `<em>` in it takes the accent), a line under
 * it, and the page's actions on the right.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cx("ui-page-header", className)}>
      <div className="ui-page-header-text">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="ui-display ui-page-title">{title}</h1>
        {description ? (
          <p className="ui-page-description">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="ui-actions">{actions}</div> : null}
    </header>
  );
}

/** One section of a settings page: a heading, a line about it, then its controls. */
export function SettingsSection({
  title,
  description,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("ui-settings-section", className)}>
      <h2 className="ui-eyebrow">{title}</h2>
      {description ? (
        <p className="ui-settings-description">{description}</p>
      ) : null}
      {children}
    </section>
  );
}
