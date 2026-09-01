import Image from 'next/image';
import { BASE_PATH, BRAND } from '@/lib/brand';
import {
  ArrowUpRightIcon,
  SocialBlueskyIcon,
  SocialDiscordIcon,
  SocialFacebookIcon,
  SocialInstagramIcon,
  SocialLinkedinIcon,
  SocialMastodonIcon,
  SocialPinterestIcon,
  SocialTelegramIcon,
  SocialThreadsIcon,
  SocialTiktokIcon,
  SocialTwitterIcon,
  SocialYoutubeIcon,
  type IconComponent,
} from '@/components/icons';
import { FooterNewsletter } from '@/components/footer-newsletter';
import {
  LEGAL_LINKS,
  LINK_COLUMNS,
  SECONDARY_COLUMNS,
  SOCIAL_PROFILES,
  type FooterColumn,
  type FooterLink as FooterLinkData,
} from '@/lib/footer-links';

/* Only the glyphs the footer renders; the icon registry is server-only but
   would still name-check every icon for nothing. */
const SOCIAL_ICONS: Record<string, IconComponent> = {
  twitter: SocialTwitterIcon,
  linkedin: SocialLinkedinIcon,
  bluesky: SocialBlueskyIcon,
  discord: SocialDiscordIcon,
  instagram: SocialInstagramIcon,
  facebook: SocialFacebookIcon,
  threads: SocialThreadsIcon,
  tiktok: SocialTiktokIcon,
  youtube: SocialYoutubeIcon,
  pinterest: SocialPinterestIcon,
  mastodon: SocialMastodonIcon,
  telegram: SocialTelegramIcon,
};

function FooterLink({ label, href, external }: FooterLinkData) {
  return (
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="inline-flex items-center gap-1.5 transition-colors hover:text-fd-foreground"
      >
        {label}
      </a>
    </li>
  );
}

function Column({ column }: { column: FooterColumn }) {
  return (
    <div>
      <h4 className="mb-5 text-sm font-semibold text-fd-foreground">
        {column.href ? (
          <a href={column.href} className="inline-flex items-center gap-1 transition-colors hover:text-fd-muted-foreground">
            {column.title}
            <ArrowUpRightIcon className="text-xs opacity-50" />
          </a>
        ) : (
          column.title
        )}
      </h4>
      <ul className="flex flex-col gap-2.5 text-sm text-fd-muted-foreground">
        {column.links.map((link) => (
          <FooterLink key={link.label} {...link} />
        ))}
      </ul>
    </div>
  );
}

/**
 * The marketing site's footer, ported for the docs. Rendered below the docs
 * layout on every page so the docs end the way every other page on the
 * domain does: the link columns, the newsletter, the social row, and the
 * oversized outlined wordmark.
 */
export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-fd-border bg-fd-background px-6 pt-20">
      <div className="mx-auto max-w-7xl">
        {/* ── Top bar: brand + CTAs ── */}
        <div className="mb-14 flex flex-col justify-between gap-8 border-b border-fd-border pb-10 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
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
            <div>
              <span className="text-lg font-bold text-fd-foreground">{BRAND.name}</span>
              <p className="text-xs text-fd-muted-foreground">
                Plan, publish, reply, and measure. One workspace.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={BRAND.appUrl}
              className="inline-flex items-center gap-1.5 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              Start Free
              <ArrowUpRightIcon className="text-xs" />
            </a>
            <a
              href={`${BRAND.websiteUrl}/pricing`}
              className="inline-flex items-center rounded-lg border border-fd-border px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
            >
              See pricing
            </a>
          </div>
        </div>

        {/* ── Row 1: 4-column links ── */}
        <div className="mb-14 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-fd-border [&>div]:lg:pl-8 [&>div:first-child]:lg:pl-0">
          {LINK_COLUMNS.map((column) => (
            <Column key={column.title} column={column} />
          ))}
        </div>

        {/* ── Row 2: tools + compare + alternatives + newsletter ── */}
        <div className="mb-14 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-fd-border pt-14 sm:grid-cols-2 lg:grid-cols-4">
          {SECONDARY_COLUMNS.map((column) => (
            <Column key={column.title} column={column} />
          ))}
          <div>
            <h4 className="mb-5 text-sm font-semibold text-fd-foreground">Join Our Newsletter</h4>
            <p className="mb-3 text-xs leading-relaxed text-fd-muted-foreground">
              Get the latest social media news &amp; updates straight to your inbox.
            </p>
            <FooterNewsletter />

            <h4 className="mt-8 mb-3 text-sm font-semibold text-fd-foreground">
              Download {BRAND.name} App to manage socials anywhere!
            </h4>
            <div className="flex gap-2.5">
              {[
                { src: `${BASE_PATH}/images/appstore.svg`, alt: 'Download on the App Store' },
                { src: `${BASE_PATH}/images/googleplay.svg`, alt: 'Get it on Google Play' },
              ].map((badge) => (
                <div key={badge.alt} className="relative">
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    width={136}
                    height={40}
                    className="h-10 opacity-50 transition-opacity hover:opacity-70"
                  />
                  <span className="absolute -top-1.5 -right-1.5 rounded-full border border-fd-border bg-fd-background px-1 py-0.5 text-[7px] leading-none font-bold text-fd-muted-foreground">
                    Soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Social profiles (hidden when none are configured) ── */}
        {SOCIAL_PROFILES.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-2 border-t border-fd-border pt-10">
            {SOCIAL_PROFILES.map((profile) => {
              const Icon = SOCIAL_ICONS[profile.icon];
              if (!Icon) return null;
              return (
                <a
                  key={profile.label}
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={profile.label}
                  title={profile.label}
                  className="flex size-8 items-center justify-center text-base text-fd-muted-foreground/70 transition-colors hover:text-fd-foreground"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        )}

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-fd-muted-foreground md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {LEGAL_LINKS.map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="transition-colors hover:text-fd-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized outlined wordmark, the marketing footer's closing image.
          aria-hidden: the brand is already named right above. */}
      <div aria-hidden className="footer-wordmark -mx-6 mt-12">
        <span className="block text-center text-[clamp(3rem,22vw,20rem)] leading-[1.16] font-bold tracking-[-0.02em] whitespace-nowrap">
          {BRAND.name}
        </span>
      </div>
    </footer>
  );
}
