import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type ColorScheme,
  type Theme,
  type ThemePreference,
  appearanceKeys,
  applyColorScheme,
  darkSchemeQuery,
  defaultStorageKey,
  getStoredColorScheme,
  getStoredTheme,
  getSystemTheme,
  storeColorScheme,
  storeTheme,
} from "./appearance";

export interface Appearance {
  /** The theme in use: the stored pick, else the OS setting. */
  theme: Theme;
  /** What the person picked, or "system" to follow the OS. */
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  colorScheme: ColorScheme;
  /** Applies and remembers a scheme on this browser; saving it anywhere else (an account) is the caller's job. */
  setColorScheme: (scheme: ColorScheme) => void;
}

const AppearanceContext = createContext<Appearance | null>(null);

/**
 * Holds light/dark and the colour scheme, keeps `data-theme` and `data-color-scheme` on <html> in step, and follows
 * the OS while nothing is picked. `storageKey` must match the one given to the `appearance` Vite plugin.
 */
export function AppearanceProvider({
  children,
  storageKey = defaultStorageKey,
}: {
  children: ReactNode;
  storageKey?: string;
}) {
  const keys = useMemo(() => appearanceKeys(storageKey), [storageKey]);
  const [storedTheme, setStoredTheme] = useState<Theme | null>(() =>
    getStoredTheme(keys),
  );
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() =>
    getStoredColorScheme(keys),
  );
  const theme = storedTheme ?? systemTheme;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    applyColorScheme(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    const query = window.matchMedia(darkSchemeQuery);
    const followSystem = () => setSystemTheme(getSystemTheme());
    query.addEventListener("change", followSystem);
    return () => query.removeEventListener("change", followSystem);
  }, []);

  const setThemePreference = useCallback(
    (preference: ThemePreference) => {
      const stored = preference === "system" ? null : preference;
      storeTheme(stored, keys);
      setStoredTheme(stored);
    },
    [keys],
  );

  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      storeColorScheme(scheme, keys);
      setColorSchemeState(scheme);
    },
    [keys],
  );

  const value = useMemo<Appearance>(
    () => ({
      theme,
      themePreference: storedTheme ?? "system",
      setThemePreference,
      toggleTheme: () =>
        setThemePreference(theme === "dark" ? "light" : "dark"),
      colorScheme,
      setColorScheme,
    }),
    [theme, storedTheme, setThemePreference, colorScheme, setColorScheme],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): Appearance {
  const appearance = useContext(AppearanceContext);
  if (!appearance) {
    throw new Error("useAppearance needs an AppearanceProvider");
  }
  return appearance;
}
