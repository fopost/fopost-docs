import type { IconComponent } from './icons';
import {
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
} from './icons';
import {
  DEFAULT_ALTERNATIVES,
  DEFAULT_COMPARE,
  DEFAULT_TAGLINE,
  type MarketingFooterConfig,
} from './config';
import { FooterNewsletter } from './newsletter';
import { FooterWordmark } from './wordmark';

/* Only the glyphs the footer actually renders. */
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

function SocialIconLink({
  href,
  label,
  icon,
  className,
}: {
  href: string;
  label: string;
  icon: string;
  className?: string;
}) {
  const Icon = SOCIAL_ICONS[icon];
  if (!Icon) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={className}
    >
      <Icon />
    </a>
  );
}

/* ───────────────────────── Helpers ───────────────────────── */

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="hover:text-ds-gray-1000 transition-colors inline-flex items-center gap-1.5"
      >
        {children}
      </a>
    </li>
  );
}

function SectionTitle({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <h4 className="text-heading-14 mb-5 text-ds-gray-1000">
      <a
        href={href}
        className="inline-flex items-center gap-1.5 hover:text-ds-blue-700 transition-colors"
      >
        {children}
        <svg
          className="w-3 h-3 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </a>
    </h4>
  );
}

/** Path portion of the docs URL, so docs links can stay relative on the docs host. */
function docsPathOf(docsUrl: string): string {
  try {
    return new URL(docsUrl).pathname.replace(/\/$/, '');
  } catch {
    return '';
  }
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */

export function MarketingFooter({ config }: { config: MarketingFooterConfig }) {
  const {
    brandName,
    tagline = DEFAULT_TAGLINE,
    urls,
    currentSite,
    github,
    social,
    newsletter,
    badges,
    compare = DEFAULT_COMPARE,
    compareTotal,
    alternatives = DEFAULT_ALTERNATIVES,
    alternativesTotal,
    brandMark,
    themeSwitcher,
    className = '',
  } = config;

  /* Marketing paths stay relative on the marketing site; the docs host links
     back to the apex. Docs paths do the reverse — and on the marketing site
     they open in a new tab, matching its long-standing behavior. */
  const site = (path: string) => (currentSite === 'website' ? path : `${urls.website}${path}`);
  const onDocs = currentSite === 'docs';
  const docsBase = onDocs ? docsPathOf(urls.docs) : urls.docs;
  const docs = (sub = '') => `${docsBase}${sub}` || '/';

  return (
    <footer
      className={`mf-footer bg-ds-background-100 border-t border-ds-gray-alpha-400 pt-20 px-6 overflow-hidden ${className}`}
    >
      <div className="max-w-[1448px] mx-auto">
        {/* ── Top bar: brand + CTAs ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-14 pb-10 border-b border-ds-gray-alpha-400">
          <div className="flex items-center gap-3">
            {brandMark}
            <div>
              <span className="text-lg font-bold text-ds-gray-1000">{brandName}</span>
              <p className="text-xs text-ds-gray-900">{tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={urls.dashboard}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ds-background-100 bg-ds-gray-1000 hover:bg-ds-gray-900 px-5 py-2.5 rounded-lg transition-colors"
            >
              Start Free
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
            <a
              href={site('/pricing')}
              className="inline-flex items-center text-sm font-semibold text-ds-gray-1000 px-5 py-2.5 rounded-lg border border-ds-gray-alpha-400 hover:bg-ds-background-200 transition-colors"
            >
              See pricing
            </a>
          </div>
        </div>

        {/* ── Row 1: 4-column links ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mb-14 lg:divide-x lg:divide-ds-gray-alpha-400 [&>div]:lg:pl-8 [&>div:first-child]:lg:pl-0">
          {/* Features */}
          <div>
            <SectionTitle href={site('/features')}>Features</SectionTitle>
            <ul className="flex flex-col gap-2.5 text-sm text-ds-gray-900">
              <FooterLink href={site('/features/ai-content')}>AI Content Engine</FooterLink>
              <FooterLink href={site('/features/cross-posting')}>Cross-Posting</FooterLink>
              <FooterLink href={site('/features/calendar')}>Content Calendar</FooterLink>
              <FooterLink href={site('/features/bulk-scheduling')}>Bulk Scheduling</FooterLink>
              <FooterLink href={site('/features/analytics')}>Analytics</FooterLink>
              <FooterLink href={site('/features/automations')}>Automations</FooterLink>
              <FooterLink href={site('/features/workspaces')}>Workspaces</FooterLink>
              <FooterLink href={site('/developers')}>REST API &amp; SDKs</FooterLink>
              <FooterLink href={site('/features/link-in-bio')}>Link in Bio</FooterLink>
              <FooterLink href={site('/features/browser-extension')}>Browser Extension</FooterLink>
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <SectionTitle href={site('/platforms')}>Integrations</SectionTitle>
            <ul className="flex flex-col gap-2.5 text-sm text-ds-gray-900">
              <FooterLink href={site('/platforms/facebook')}>Facebook</FooterLink>
              <FooterLink href={site('/platforms/instagram')}>Instagram</FooterLink>
              <FooterLink href={site('/platforms/linkedin')}>LinkedIn</FooterLink>
              <FooterLink href={site('/platforms/twitter')}>X (Twitter)</FooterLink>
              <FooterLink href={site('/platforms/tiktok')}>TikTok</FooterLink>
              <FooterLink href={site('/platforms/youtube')}>YouTube</FooterLink>
              <FooterLink href={site('/platforms/threads')}>Threads</FooterLink>
              <FooterLink href={site('/platforms/bluesky')}>Bluesky</FooterLink>
              <FooterLink href={site('/platforms/pinterest')}>Pinterest</FooterLink>
              <FooterLink href={site('/platforms/reddit')}>Reddit</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-heading-14 mb-5 text-ds-gray-1000">Resources</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-ds-gray-900">
              <FooterLink href={docs()} external={!onDocs}>
                Documentation
              </FooterLink>
              <FooterLink href={docs('/api')} external={!onDocs}>
                API Docs
              </FooterLink>
              <FooterLink href={github.orgUrl} external>
                GitHub
              </FooterLink>
              <FooterLink href={github.repoUrl} external>
                GitHub (SDK)
              </FooterLink>
              <FooterLink href={site('/tools')}>Free Tools</FooterLink>
              <FooterLink href={site('/changelog')}>Changelog</FooterLink>
              <FooterLink href={site('/blog')}>Blog</FooterLink>
              <FooterLink href={site('/features')}>What ships</FooterLink>
              <FooterLink href={site('/roadmap')}>Roadmap</FooterLink>
              <FooterLink href={site('/feature-requests')}>Feature Requests</FooterLink>
              <FooterLink href={site('/contact')}>Contact</FooterLink>
              <FooterLink href={site('/status')}>Status</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-heading-14 mb-5 text-ds-gray-1000">Company</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-ds-gray-900">
              <FooterLink href={site('/about')}>About Us</FooterLink>
              <FooterLink href={site('/pricing')}>Plans &amp; Pricing</FooterLink>
              <FooterLink href={site('/privacy-policy')}>Privacy Policy</FooterLink>
              <FooterLink href={site('/terms-of-service')}>Terms of Service</FooterLink>
              <FooterLink href={site('/data-deletion')}>Data Deletion</FooterLink>
              <FooterLink href={site('/gdpr')}>GDPR</FooterLink>
              <FooterLink href={site('/dpa')}>DPA</FooterLink>
              <FooterLink href={github.licenseUrl} external>
                License
              </FooterLink>
            </ul>
          </div>
        </div>

        {/* ── Row 2: Free Tools + Compare + Alternatives + Newsletter ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mb-14 pt-14 border-t border-ds-gray-alpha-400">
          {/* Free Social Media Tools */}
          <div>
            <SectionTitle href={site('/tools')}>Free Social Media Tools</SectionTitle>
            <ul className="flex flex-col gap-2.5 text-sm text-ds-gray-900">
              <FooterLink href={site('/tools/hashtag-generator')}>Hashtag Generator</FooterLink>
              <FooterLink href={site('/tools/utm-generator')}>UTM Generator</FooterLink>
              <FooterLink href={site('/tools/twitter-bold-italic')}>
                Bold &amp; Italic Text Generator
              </FooterLink>
              <FooterLink href={site('/tools/instagram-caption-generator')}>
                AI Caption Generator
              </FooterLink>
              <FooterLink href={site('/tools/twitter-character-counter')}>
                Character Counter
              </FooterLink>
              <FooterLink href={site('/tools/instagram-post-preview')}>
                Social Media Post Preview
              </FooterLink>
              <FooterLink href={site('/tools/instagram-feed-planner')}>
                Instagram Feed Planner
              </FooterLink>
              <FooterLink href={site('/tools/twitter-photo-resizer')}>Photo Resizer</FooterLink>
              <FooterLink href={site('/tools/twitter-thread-maker')}>Thread Maker</FooterLink>
              <FooterLink href={site('/tools/twitter-trends-notifier')}>Trends Notifier</FooterLink>
            </ul>
          </div>

          {/* Compare */}
          <div>
            <SectionTitle href={site('/compare')}>Compare</SectionTitle>
            <ul className="flex flex-col gap-2.5 text-sm text-ds-gray-900">
              {compare.map((c) => (
                <FooterLink key={c.slug} href={site(`/compare/${c.slug}`)}>
                  {brandName} vs. {c.shortName}
                </FooterLink>
              ))}
              <FooterLink href={site('/compare')}>
                See all {compareTotal != null ? `${compareTotal} ` : ''}comparisons
              </FooterLink>
            </ul>
          </div>

          {/* Alternatives */}
          <div>
            <SectionTitle href={site('/alternatives')}>Alternatives</SectionTitle>
            <ul className="flex flex-col gap-2.5 text-sm text-ds-gray-900">
              {alternatives.map((c) => (
                <FooterLink key={c.slug} href={site(`/alternatives/${c.slug}`)}>
                  {c.shortName} alternatives
                </FooterLink>
              ))}
              <FooterLink href={site('/alternatives')}>
                See all {alternativesTotal != null ? `${alternativesTotal} ` : ''}guides
              </FooterLink>
            </ul>
          </div>

          {/* Newsletter + App */}
          <div>
            <h4 className="text-heading-14 mb-5 text-ds-gray-1000">Join Our Newsletter</h4>
            <p className="text-xs text-ds-gray-900 mb-3 leading-relaxed">
              Get the latest social media news &amp; updates straight to your inbox.
            </p>
            <FooterNewsletter
              apiUrl={urls.api}
              source={newsletter.source}
              subscribedStorageKey={newsletter.subscribedStorageKey}
            />

            <h4 className="text-heading-14 mt-8 mb-3 text-ds-gray-1000">
              Download {brandName} App to manage socials anywhere!
            </h4>
            <div className="flex gap-2.5">
              <div className="relative">
                <img
                  src={badges.appStoreSrc}
                  alt="Download on the App Store"
                  width={136}
                  height={40}
                  className="h-10 opacity-50 hover:opacity-70 transition-opacity"
                />
                <span className="absolute -top-1.5 -right-1.5 text-[7px] font-bold text-ds-gray-900 bg-ds-background-100 border border-ds-gray-alpha-400 px-1 py-0.5 rounded-full leading-none">
                  Soon
                </span>
              </div>
              <div className="relative">
                <img
                  src={badges.googlePlaySrc}
                  alt="Get it on Google Play"
                  width={136}
                  height={40}
                  className="h-10 opacity-50 hover:opacity-70 transition-opacity"
                />
                <span className="absolute -top-1.5 -right-1.5 text-[7px] font-bold text-ds-gray-900 bg-ds-background-100 border border-ds-gray-alpha-400 px-1 py-0.5 rounded-full leading-none">
                  Soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Every profile, low in the page where breadth costs nothing ── */}
        <div className="flex flex-wrap justify-center gap-x-1 gap-y-2 pt-10 border-t border-ds-gray-alpha-400">
          {social.map((p) => (
            <SocialIconLink
              key={p.label}
              href={p.href}
              label={p.label}
              icon={p.icon}
              className="w-8 h-8 flex items-center justify-center text-base text-ds-gray-900/70 hover:text-ds-gray-1000 transition-colors"
            />
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ds-gray-900 pt-6">
          <p>
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href={site('/privacy-policy')} className="hover:text-ds-gray-1000 transition-colors">
              Privacy Policy
            </a>
            <a
              href={site('/terms-of-service')}
              className="hover:text-ds-gray-1000 transition-colors"
            >
              Terms of Service
            </a>
            <a href={site('/data-deletion')} className="hover:text-ds-gray-1000 transition-colors">
              Data Deletion
            </a>
            <a href={site('/gdpr')} className="hover:text-ds-gray-1000 transition-colors">
              GDPR
            </a>
            <a href={site('/dpa')} className="hover:text-ds-gray-1000 transition-colors">
              DPA
            </a>
            <a
              href={github.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ds-gray-1000 transition-colors"
            >
              License
            </a>
            <a href={site('/sitemap.xml')} className="hover:text-ds-gray-1000 transition-colors">
              Sitemap
            </a>
          </div>
          {themeSwitcher}
        </div>
      </div>

      <FooterWordmark brandName={brandName} className="-mx-6 mt-12" />
    </footer>
  );
}
