import Image from 'next/image';
import { BASE_PATH, BRAND } from '@/lib/brand';
import { MarketingFooter } from '@/components/marketing-footer';
import { DocsThemeSwitcher } from '@/components/theme-switcher';

/* Same env names the marketing site reads; listed literally because Next
   inlines NEXT_PUBLIC_* by text substitution. Empty means "no profile",
   and the row hides itself. */
const GITHUB_ORG_URL = process.env.NEXT_PUBLIC_GITHUB_ORG_URL || 'https://github.com/fopost';
const GITHUB_REPO_URL = `${GITHUB_ORG_URL}/fopost-social-core`;
const GITHUB_LICENSE_URL = `${GITHUB_REPO_URL}/blob/main/LICENSE`;

const SOCIAL_PROFILES = [
  { label: 'X', href: process.env.NEXT_PUBLIC_TWITTER_URL || '', icon: 'twitter' },
  { label: 'LinkedIn', href: process.env.NEXT_PUBLIC_LINKEDIN_URL || '', icon: 'linkedin' },
  { label: 'Bluesky', href: process.env.NEXT_PUBLIC_BLUESKY_URL || '', icon: 'bluesky' },
  { label: 'Discord', href: process.env.NEXT_PUBLIC_DISCORD_URL || '', icon: 'discord' },
  { label: 'Instagram', href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '', icon: 'instagram' },
  { label: 'Facebook', href: process.env.NEXT_PUBLIC_FACEBOOK_URL || '', icon: 'facebook' },
  { label: 'Threads', href: process.env.NEXT_PUBLIC_THREADS_URL || '', icon: 'threads' },
  { label: 'TikTok', href: process.env.NEXT_PUBLIC_TIKTOK_URL || '', icon: 'tiktok' },
  { label: 'YouTube', href: process.env.NEXT_PUBLIC_YOUTUBE_URL || '', icon: 'youtube' },
  { label: 'Pinterest', href: process.env.NEXT_PUBLIC_PINTEREST_URL || '', icon: 'pinterest' },
  { label: 'Mastodon', href: process.env.NEXT_PUBLIC_MASTODON_URL || '', icon: 'mastodon' },
  { label: 'Telegram', href: process.env.NEXT_PUBLIC_TELEGRAM_URL || '', icon: 'telegram' },
].filter((p) => Boolean(p.href));

/**
 * The one sitewide footer, from the shared package vendored in
 * components/marketing-footer/ (npm run sync-footer). This file only
 * translates this deployment's brand and env into the package's config:
 * docs links stay relative, marketing links resolve against the apex.
 */
export function SiteFooter() {
  return (
    <MarketingFooter
      config={{
        brandName: BRAND.name,
        urls: {
          website: BRAND.websiteUrl,
          dashboard: BRAND.appUrl,
          api: BRAND.apiUrl,
          docs: BRAND.docsUrl,
        },
        currentSite: 'docs',
        github: {
          orgUrl: GITHUB_ORG_URL,
          repoUrl: GITHUB_REPO_URL,
          licenseUrl: GITHUB_LICENSE_URL,
        },
        social: SOCIAL_PROFILES,
        newsletter: { source: 'docs-footer' },
        badges: {
          appStoreSrc: `${BASE_PATH}/images/appstore.svg`,
          googlePlaySrc: `${BASE_PATH}/images/googleplay.svg`,
        },
        brandMark: (
          <>
            {/* Both marks render and `dark:` picks one before paint, so the
                theme never flashes the wrong logo. */}
            <Image
              src={BRAND.logo}
              alt={`${BRAND.name} logo`}
              width={36}
              height={36}
              className="size-9 rounded-lg dark:hidden"
            />
            <Image
              src={BRAND.logoDark}
              alt=""
              aria-hidden
              width={36}
              height={36}
              className="hidden size-9 rounded-lg dark:block"
            />
          </>
        ),
        themeSwitcher: <DocsThemeSwitcher />,
      }}
    />
  );
}
