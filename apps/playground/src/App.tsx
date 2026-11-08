import { useEffect, useState } from "react";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import {
  AppShell,
  AppearanceSettings,
  MenuItem,
  Nav,
  PageHeader,
  ProfileMenu,
  SettingsSection,
  ThemeMenuItem,
  Wordmark,
} from "@pluscosmic/ui";
import { playgroundCopy as copy } from "./copy/playground";
import { ComponentsPage } from "./ComponentsPage";

type Page = "components" | "appearance";

/** A two-page app on a hash, so the playground needs no router; a real app passes its router's links to `Nav`. */
function usePage(): [Page, (page: Page) => void] {
  const read = (): Page =>
    window.location.hash === "#appearance" ? "appearance" : "components";
  const [page, setPage] = useState<Page>(read);
  useEffect(() => {
    const onHashChange = () => setPage(read());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return [page, (next) => (window.location.hash = next)];
}

export function App() {
  const [page, setPage] = usePage();
  const link = (target: Page, label: string) => (
    <a
      href={`#${target}`}
      aria-current={page === target ? "page" : undefined}
      onClick={(event) => {
        event.preventDefault();
        setPage(target);
      }}
    >
      {label}
    </a>
  );

  return (
    <AppShell
      brand={
        <a href="#components" aria-label={copy.brandLink}>
          <Wordmark>{copy.brand}</Wordmark>
        </a>
      }
      nav={
        <Nav>
          {link("components", copy.nav.components)}
          {link("appearance", copy.nav.appearance)}
        </Nav>
      }
      actions={
        <ProfileMenu
          name={copy.person}
          header={copy.menu.signedInAs(copy.person)}
        >
          <MenuItem onClick={() => setPage("appearance")}>
            <IconSettings size={16} aria-hidden="true" />
            {copy.menu.settings}
          </MenuItem>
          <ThemeMenuItem />
          <MenuItem>
            <IconLogout size={16} aria-hidden="true" />
            {copy.menu.signOut}
          </MenuItem>
        </ProfileMenu>
      }
    >
      {page === "components" ? (
        <ComponentsPage />
      ) : (
        <>
          <PageHeader
            eyebrow={copy.appearance.eyebrow}
            title={copy.appearance.title}
            description={copy.appearance.description}
          />
          <div className="ui-settings">
            <SettingsSection title={copy.appearance.section}>
              <AppearanceSettings />
            </SettingsSection>
          </div>
        </>
      )}
    </AppShell>
  );
}
