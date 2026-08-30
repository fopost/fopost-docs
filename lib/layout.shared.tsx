import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { BRAND } from '@/lib/brand';
import { GlobeIcon, LayoutIcon } from '@/components/icons';

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
          {/* Both marks render and `dark:` picks one before paint, so the
              theme never flashes the wrong logo. Black mark on light, white
              mark on dark, the same pair the marketing header uses. */}
          <Image
            src={BRAND.logo}
            alt={`${BRAND.name} logo`}
            width={28}
            height={28}
            className="size-7 rounded-lg dark:hidden"
          />
          <Image
            src={BRAND.logoDark}
            alt=""
            aria-hidden
            width={28}
            height={28}
            className="hidden size-7 rounded-lg dark:block"
          />
          <span className="font-semibold tracking-[-0.32px]">{BRAND.name} Docs</span>
        </>
      ),
    },
    links: [
      {
        type: 'icon',
        label: 'Website',
        text: 'Website',
        icon: <GlobeIcon className="text-base" />,
        url: BRAND.websiteUrl,
        external: true,
      },
      {
        type: 'icon',
        label: 'Dashboard',
        text: 'Dashboard',
        icon: <LayoutIcon className="text-base" />,
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
