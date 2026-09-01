'use client';

import { DesktopDeviceIcon, MoonIcon, SunIcon } from './icons';

export type FooterThemeMode = 'system' | 'light' | 'dark';

const OPTIONS: { mode: FooterThemeMode; label: string; icon: typeof SunIcon }[] = [
  { mode: 'system', label: 'System theme', icon: DesktopDeviceIcon },
  { mode: 'light', label: 'Light theme', icon: SunIcon },
  { mode: 'dark', label: 'Dark theme', icon: MoonIcon },
];

/**
 * Presentational three-way theme trio: system, light, dark. Controlled — the
 * host owns theme state (its own storage key, provider, or media tracking)
 * and passes it in, so the package never touches the host's theme machinery.
 */
export function FooterThemeSwitcher({
  mode,
  onModeChange,
  className = '',
}: {
  mode: FooterThemeMode;
  onModeChange: (mode: FooterThemeMode) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={`inline-flex items-center gap-0.5 rounded-full border border-ds-gray-alpha-400 bg-ds-background-100 p-0.5 ${className}`}
    >
      {OPTIONS.map((o) => {
        const active = o.mode === mode;
        return (
          <button
            key={o.mode}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            title={o.label}
            onClick={() => onModeChange(o.mode)}
            suppressHydrationWarning
            className={`inline-flex size-7 items-center justify-center rounded-full text-sm transition-colors ${
              active
                ? 'bg-ds-background-200 text-ds-gray-1000 shadow-border'
                : 'text-ds-gray-900 hover:text-ds-gray-1000'
            }`}
          >
            <o.icon />
          </button>
        );
      })}
    </div>
  );
}
