import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemeName =
  | "midnight-summit"
  | "golden-hour"
  | "glacier-blue"
  | "pine-shadow";

export const DEFAULT_THEME: ThemeName = "midnight-summit";

export const THEMES: ReadonlyArray<{
  value: ThemeName;
  label: string;
  swatch: string;
}> = [
  { value: "midnight-summit", label: "Midnight Summit", swatch: "#16a34a" },
  { value: "golden-hour", label: "Golden Hour", swatch: "#c2410c" },
  { value: "glacier-blue", label: "Glacier Blue", swatch: "#0284c7" },
  { value: "pine-shadow", label: "Pine Shadow", swatch: "#22c55e" },
];

const COOKIE_NAME = "theme";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year
const THEME_ATTR = "data-theme";

function isValidTheme(value: unknown): value is ThemeName {
  return THEMES.some((t) => t.value === value);
}

/**
 * Parse the theme cookie from a raw `Cookie` request header.
 * Used in the root loader for SSR (no FOUC).
 */
export function parseThemeFromCookieHeader(
  cookieHeader: string | null | undefined,
): ThemeName {
  if (!cookieHeader) return DEFAULT_THEME;
  const match = cookieHeader.match(/(?:^|;\s*)theme=([^;]+)/);
  if (!match) return DEFAULT_THEME;
  try {
    const value = decodeURIComponent(match[1]) as ThemeName;
    return isValidTheme(value) ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function readThemeCookieFromDocument(): ThemeName | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/);
  if (!match) return null;
  try {
    const value = decodeURIComponent(match[1]) as ThemeName;
    return isValidTheme(value) ? value : null;
  } catch {
    return null;
  }
}

function writeThemeCookieToDocument(theme: ThemeName): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(theme);
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {
    /* no-op default */
  },
});

export interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * Theme value resolved on the server from the cookie. Used for the initial
   * render so SSR markup already has the right `data-theme` attribute on
   * `<html>` and there is no flash of the wrong theme.
   */
  initialTheme?: ThemeName;
}

export function ThemeProvider({
  children,
  initialTheme = DEFAULT_THEME,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(initialTheme);

  // On hydration, re-read the cookie in case the client value differs
  // from what the server saw (e.g. user changed it in another tab).
  useEffect(() => {
    const cookieTheme = readThemeCookieFromDocument();
    if (cookieTheme && cookieTheme !== theme) {
      setThemeState(cookieTheme);
      document.documentElement.setAttribute(THEME_ATTR, cookieTheme);
    }
    // Run once on mount; theme comparison handled inside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((next: ThemeName) => {
    if (!isValidTheme(next)) return;
    setThemeState(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute(THEME_ATTR, next);
    }
    writeThemeCookieToDocument(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
