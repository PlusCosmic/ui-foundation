import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useUiCopy } from "../copy/UiCopyProvider";
import { useAppearance } from "../theme/AppearanceProvider";
import { Avatar } from "./Avatar";
import { cx } from "./cx";

/**
 * The signed-in app's chrome: a sticky top bar with the brand, the navigation and the account's controls, then the
 * page. On phones the navigation drops under the brand as a strip that scrolls sideways. The bar's height is kept
 * in `--ui-topbar-height`, so sticky bars further down can sit under it.
 */
export function AppShell({
  brand,
  nav,
  actions,
  children,
  className,
}: {
  /** Usually a link home holding a `Wordmark`. */
  brand: ReactNode;
  /** Usually a `Nav` of the router's links. */
  nav?: ReactNode;
  /** The right-hand end: a `ProfileMenu`, buttons, a search box. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const topbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const topbar = topbarRef.current;
    if (!topbar || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--ui-topbar-height",
        `${topbar.offsetHeight}px`,
      );
    });
    observer.observe(topbar);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cx("ui-app", className)}>
      <header className="ui-topbar" ref={topbarRef}>
        <div className="ui-brand">{brand}</div>
        {nav ?? <span />}
        <div className="ui-topbar-actions">{actions}</div>
      </header>
      <main className="ui-main">{children}</main>
    </div>
  );
}

/**
 * The top bar's links. Mark the current one with `aria-current="page"` (TanStack Router and React Router's links
 * do) or the `active` class.
 */
export function Nav({
  className,
  "aria-label": ariaLabel,
  ...props
}: ComponentPropsWithoutRef<"nav">) {
  const copy = useUiCopy();
  return (
    <nav
      className={cx("ui-nav", className)}
      aria-label={ariaLabel ?? copy.shell.navLabel}
      {...props}
    />
  );
}

/** The app's name in the display face's italic, with an optional mark before it. */
export function Wordmark({
  children,
  mark,
  className,
}: {
  children: ReactNode;
  mark?: ReactNode;
  className?: string;
}) {
  return (
    <span className={cx("ui-wordmark", className)}>
      {mark ? <span className="ui-wordmark-mark">{mark}</span> : null}
      <span className="ui-wordmark-word">{children}</span>
    </span>
  );
}

/**
 * The account's avatar, opening a menu of `MenuItem`s (and links wearing `menuItemClass`). Choosing an item, Escape
 * or moving focus out of it closes the menu. `header` goes above the items, for something like a usage meter.
 */
export function ProfileMenu({
  name,
  src,
  header,
  children,
  onOpenChange,
}: {
  name?: string | null;
  src?: string | null;
  header?: ReactNode;
  children: ReactNode;
  /** Told when the menu opens or closes, say to fetch what `header` shows only once it's wanted. */
  onOpenChange?: (open: boolean) => void;
}) {
  const copy = useUiCopy();
  const [open, setOpenState] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const setOpen = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };

  return (
    <div
      className="ui-profile-menu"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
      onClick={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest('[role="menuitem"]')
        ) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        className="ui-profile-trigger"
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={copy.shell.profileMenu}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={name} src={src} />
      </button>
      {open ? (
        <div className="ui-profile-popover" role="menu">
          {header ? <div className="ui-menu-header">{header}</div> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}

export const menuItemClass = "ui-menu-item";

/** A button in a `ProfileMenu`. For a link, give the router's link `className={menuItemClass}` and `role="menuitem"`. */
export function MenuItem({
  className,
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cx(menuItemClass, className)}
      type={type}
      role="menuitem"
      {...props}
    />
  );
}

/** The menu item that switches between light and dark. */
export function ThemeMenuItem() {
  const copy = useUiCopy();
  const { theme, toggleTheme } = useAppearance();
  return (
    <MenuItem onClick={toggleTheme}>
      {theme === "dark" ? (
        <IconSun size={16} aria-hidden="true" />
      ) : (
        <IconMoon size={16} aria-hidden="true" />
      )}
      {copy.shell.themeToggle(theme)}
    </MenuItem>
  );
}
