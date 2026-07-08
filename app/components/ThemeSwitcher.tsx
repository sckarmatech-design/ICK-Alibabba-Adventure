import { useEffect, useRef, useState } from "react";
import { THEMES, useTheme, type ThemeName } from "~/lib/theme";

interface ThemeSwitcherProps {
  variant: "desktop" | "mobile";
}

function ChevronDown({ size = 10 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 4l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 6l3 3 5-6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeSwitcher({ variant }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[0];

  if (variant === "mobile") {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border">
        <span className="text-xs uppercase tracking-wider text-muted">
          Theme
        </span>
        <div className="flex items-center gap-2 cursor-pointer">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTheme(t.value)}
              aria-label={`Switch to ${t.label}`}
              aria-pressed={theme === t.value}
              className={`h-6 w-6 rounded-full border-2 transition ${
                theme === t.value
                  ? "border-ink scale-110"
                  : "border-border hover:scale-105"
              }`}
              style={{ backgroundColor: t.swatch }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-xs text-ink hover:border-accent transition"
      >
        <span
          className="h-3 w-3 rounded-full shrink-0 ring-1 ring-border"
          style={{ backgroundColor: current.swatch }}
          aria-hidden="true"
        />
        <span className="font-medium">{current.label}</span>
        <ChevronDown />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Theme selection"
          className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-surface shadow-lg overflow-hidden z-50"
        >
          {THEMES.map((t) => {
            const isActive = theme === t.value;
            return (
              <li key={t.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setTheme(t.value as ThemeName);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition ${
                    isActive
                      ? "bg-primary text-ink"
                      : "text-muted hover:bg-primary hover:text-ink"
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full shrink-0 ring-1 ring-border"
                    style={{ backgroundColor: t.swatch }}
                    aria-hidden="true"
                  />
                  <span className="grow">{t.label}</span>
                  {isActive && <CheckIcon />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
