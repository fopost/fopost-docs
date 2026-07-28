import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Globe, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import logo from '@/public/logo.png';

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
            src={logo}
            alt="OwlStack Logo"
            width={28}
            height={28}
            className="rounded-lg"
          />
          OwlStack Docs
        </>
      ),
    },
    links: [
      {
        type: 'icon',
        label: 'Website',
        text: 'Website',
        icon: <Globe size={16} />,
        url: 'https://owlstack.app',
        external: true,
      },
      {
        type: 'icon',
        label: 'Dashboard',
        text: 'Dashboard',
        icon: <LayoutDashboard size={16} />,
        url: 'https://app.owlstack.app',
        external: true,
      },
    ],
    themeSwitch: {
      enabled: true,
      mode: 'light-dark',
    },
  };
}
