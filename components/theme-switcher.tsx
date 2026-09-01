'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import {
  FooterThemeSwitcher,
  type FooterThemeMode,
} from '@/components/marketing-footer/theme-switcher';

const noopSubscribe = () => () => {};

/**
 * The footer's theme trio, wired to the fumadocs theme provider (next-themes,
 * which RootProvider mounts). next-themes only knows the theme after mount,
 * so until then the trio renders with "system" active and
 * suppressHydrationWarning (set inside the shared trio) keeps React quiet.
 */
export function DocsThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  /* false during SSR and hydration, true right after — same pattern the
     search dialog's ⌘/Ctrl label uses. */
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const mode: FooterThemeMode =
    mounted && (theme === 'light' || theme === 'dark') ? theme : 'system';

  return <FooterThemeSwitcher mode={mode} onModeChange={setTheme} />;
}
