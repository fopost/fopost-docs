import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Globe, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import { BRAND } from '@/lib/brand';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Root Layout: app/layout.tsx (includes docs layout)
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src={BRAND.logo}
            alt={`${BRAND.name} logo`}
            width={28}
            height={28}
            className="rounded-lg dark:hidden"
          />
          <Image
            src={BRAND.logoDark}
            alt=""
            aria-hidden
            width={28}
            height={28}
            className="hidden rounded-lg dark:block"
          />
          {BRAND.name} Docs
        </>
      ),
    },
    links: [
      {
        type: 'icon',
        label: 'Website',
        text: 'Website',
        icon: <Globe size={16} />,
        url: BRAND.websiteUrl,
        external: true,
      },
      {
        type: 'icon',
        label: 'Dashboard',
        text: 'Dashboard',
        icon: <LayoutDashboard size={16} />,
        url: BRAND.appUrl,
        external: true,
      },
    ],
    themeSwitch: {
      enabled: true,
      mode: 'light-dark',
    },
  };
}
