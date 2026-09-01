/**
 * Data for the sitewide marketing footer, ported from the marketing site.
 *
 * The docs app has no marketing routes, so every path here is resolved
 * against `BRAND.websiteUrl` at render time; only the docs' own pages
 * (`docs: true`) stay on this deployment. The lists mirror the curated
 * footer columns on the marketing site rather than its full data files —
 * the source of truth for what exists is still `apps/web` in the monorepo.
 */
import { BASE_PATH, BRAND } from '@/lib/brand';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  /** Optional link on the column title itself. */
  href?: string;
  links: FooterLink[];
}

const site = (path: string) => `${BRAND.websiteUrl}${path}`;

/* Same env names the marketing site reads; listed literally because Next
   inlines NEXT_PUBLIC_* by text substitution. Empty means "no profile",
   and the row hides itself. */
export const GITHUB_ORG_URL =
  process.env.NEXT_PUBLIC_GITHUB_ORG_URL || 'https://github.com/fopost';
const GITHUB_REPO_URL = `${GITHUB_ORG_URL}/fopost-social-core`;
export const GITHUB_LICENSE_URL = `${GITHUB_REPO_URL}/blob/main/LICENSE`;

export interface SocialProfile {
  label: string;
  href: string;
  /** Icon slug in `components/icons`. */
  icon: string;
}

export const SOCIAL_PROFILES: SocialProfile[] = [
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

export const LINK_COLUMNS: FooterColumn[] = [
  {
    title: 'Features',
    href: site('/features'),
    links: [
      { label: 'AI Content Engine', href: site('/features/ai-content') },
      { label: 'Cross-Posting', href: site('/features/cross-posting') },
      { label: 'Content Calendar', href: site('/features/calendar') },
      { label: 'Bulk Scheduling', href: site('/features/bulk-scheduling') },
      { label: 'Analytics', href: site('/features/analytics') },
      { label: 'Automations', href: site('/features/automations') },
      { label: 'Workspaces', href: site('/features/workspaces') },
      { label: 'REST API & SDKs', href: site('/developers') },
      { label: 'Link in Bio', href: site('/features/link-in-bio') },
      { label: 'Browser Extension', href: site('/features/browser-extension') },
    ],
  },
  {
    title: 'Integrations',
    href: site('/platforms'),
    links: [
      { label: 'Facebook', href: site('/platforms/facebook') },
      { label: 'Instagram', href: site('/platforms/instagram') },
      { label: 'LinkedIn', href: site('/platforms/linkedin') },
      { label: 'X (Twitter)', href: site('/platforms/twitter') },
      { label: 'TikTok', href: site('/platforms/tiktok') },
      { label: 'YouTube', href: site('/platforms/youtube') },
      { label: 'Threads', href: site('/platforms/threads') },
      { label: 'Bluesky', href: site('/platforms/bluesky') },
      { label: 'Pinterest', href: site('/platforms/pinterest') },
      { label: 'Reddit', href: site('/platforms/reddit') },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: BASE_PATH },
      { label: 'API Docs', href: `${BASE_PATH}/api` },
      { label: 'GitHub', href: GITHUB_ORG_URL, external: true },
      { label: 'GitHub (SDK)', href: GITHUB_REPO_URL, external: true },
      { label: 'Free Tools', href: site('/tools') },
      { label: 'Changelog', href: site('/changelog') },
      { label: 'Blog', href: site('/blog') },
      { label: 'What ships', href: site('/features') },
      { label: 'Roadmap', href: site('/roadmap') },
      { label: 'Feature Requests', href: site('/feature-requests') },
      { label: 'Contact', href: site('/contact') },
      { label: 'Status', href: site('/status') },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: site('/about') },
      { label: 'Plans & Pricing', href: site('/pricing') },
      { label: 'Privacy Policy', href: site('/privacy-policy') },
      { label: 'Terms of Service', href: site('/terms-of-service') },
      { label: 'Data Deletion', href: site('/data-deletion') },
      { label: 'GDPR', href: site('/gdpr') },
      { label: 'DPA', href: site('/dpa') },
      { label: 'License', href: GITHUB_LICENSE_URL, external: true },
    ],
  },
];

const FOOTER_COMPARE = [
  { slug: 'hootsuite', shortName: 'Hootsuite' },
  { slug: 'buffer', shortName: 'Buffer' },
  { slug: 'later', shortName: 'Later' },
  { slug: 'sprout-social', shortName: 'Sprout Social' },
  { slug: 'socialpilot', shortName: 'SocialPilot' },
  { slug: 'agorapulse', shortName: 'Agorapulse' },
  { slug: 'publer', shortName: 'Publer' },
  { slug: 'postiz', shortName: 'Postiz' },
];

const FOOTER_ALTERNATIVES = [
  { slug: 'buffer', shortName: 'Buffer' },
  { slug: 'hootsuite', shortName: 'Hootsuite' },
  { slug: 'later', shortName: 'Later' },
  { slug: 'sprout-social', shortName: 'Sprout Social' },
  { slug: 'socialpilot', shortName: 'SocialPilot' },
  { slug: 'sendible', shortName: 'Sendible' },
  { slug: 'loomly', shortName: 'Loomly' },
  { slug: 'metricool', shortName: 'Metricool' },
];

export const SECONDARY_COLUMNS: FooterColumn[] = [
  {
    title: 'Free Social Media Tools',
    href: site('/tools'),
    links: [
      { label: 'Hashtag Generator', href: site('/tools/hashtag-generator') },
      { label: 'UTM Generator', href: site('/tools/utm-generator') },
      { label: 'Bold & Italic Text Generator', href: site('/tools/twitter-bold-italic') },
      { label: 'AI Caption Generator', href: site('/tools/instagram-caption-generator') },
      { label: 'Character Counter', href: site('/tools/twitter-character-counter') },
      { label: 'Social Media Post Preview', href: site('/tools/instagram-post-preview') },
      { label: 'Instagram Feed Planner', href: site('/tools/instagram-feed-planner') },
      { label: 'Photo Resizer', href: site('/tools/twitter-photo-resizer') },
      { label: 'Thread Maker', href: site('/tools/twitter-thread-maker') },
      { label: 'Trends Notifier', href: site('/tools/twitter-trends-notifier') },
    ],
  },
  {
    title: 'Compare',
    href: site('/compare'),
    links: [
      ...FOOTER_COMPARE.map((c) => ({
        label: `${BRAND.name} vs. ${c.shortName}`,
        href: site(`/compare/${c.slug}`),
      })),
      { label: 'See all comparisons', href: site('/compare') },
    ],
  },
  {
    title: 'Alternatives',
    href: site('/alternatives'),
    links: [
      ...FOOTER_ALTERNATIVES.map((c) => ({
        label: `${c.shortName} alternatives`,
        href: site(`/alternatives/${c.slug}`),
      })),
      { label: 'See all guides', href: site('/alternatives') },
    ],
  },
];

export const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: site('/privacy-policy') },
  { label: 'Terms of Service', href: site('/terms-of-service') },
  { label: 'Data Deletion', href: site('/data-deletion') },
  { label: 'GDPR', href: site('/gdpr') },
  { label: 'DPA', href: site('/dpa') },
  { label: 'License', href: GITHUB_LICENSE_URL, external: true },
  { label: 'Sitemap', href: site('/sitemap.xml') },
];
