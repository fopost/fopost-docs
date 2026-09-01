import type { ReactNode } from 'react';

export interface FooterCompareItem {
  slug: string;
  shortName: string;
}

export interface FooterSocialProfile {
  label: string;
  href: string;
  /** Icon slug; a slug with no glyph in the package renders nothing. */
  icon: string;
}

/**
 * Everything the footer needs from its host, in one serializable object (plus
 * two ReactNode slots). No field is read from the environment inside the
 * package — the host resolves its own env and brand config and passes the
 * results in.
 */
export interface MarketingFooterConfig {
  /** Brand display name; also what the giant outlined wordmark renders. */
  brandName: string;
  /** One-liner under the brand name in the top bar. */
  tagline?: string;
  urls: {
    /** Marketing site apex, e.g. https://example.com */
    website: string;
    /** Dashboard / start-free target. */
    dashboard: string;
    /** REST API base the newsletter form posts to. */
    api: string;
    /** Docs site, e.g. https://example.com/docs */
    docs: string;
  };
  /** Which host is rendering: links to that host's own site stay relative. */
  currentSite: 'website' | 'docs';
  github: {
    orgUrl: string;
    repoUrl: string;
    licenseUrl: string;
  };
  /** Rendered in order; profiles with no URL should be filtered by the host. */
  social: FooterSocialProfile[];
  newsletter: {
    /** Source tag sent with the subscribe request. */
    source: string;
    /**
     * Optional localStorage key written as `{"state":"subscribed","at":<now>}`
     * after a successful signup, so a host's newsletter popup stays away.
     */
    subscribedStorageKey?: string;
  };
  /** Store badge image paths, host-resolved (basePath applied by the host). */
  badges: {
    appStoreSrc: string;
    googlePlaySrc: string;
  };
  /** "Brand vs. X" column. Defaults to the package's snapshot list. */
  compare?: FooterCompareItem[];
  /** Live comparison count for the "See all" link; omitted → no number. */
  compareTotal?: number;
  /** "X alternatives" column. Defaults to the package's snapshot list. */
  alternatives?: FooterCompareItem[];
  /** Live guide count for the "See all" link; omitted → no number. */
  alternativesTotal?: number;
  /** Square brand mark tile in the top bar (host handles theme swap). */
  brandMark?: ReactNode;
  /** Theme trio in the legal row, wired to the host's theme state. */
  themeSwitcher?: ReactNode;
  /** Extra classes on the <footer> element. */
  className?: string;
}

export const DEFAULT_TAGLINE = 'Plan, publish, reply, and measure. One workspace.';

/* Snapshot of the highest-demand lists; a host with live data passes its own. */
export const DEFAULT_COMPARE: FooterCompareItem[] = [
  { slug: 'hootsuite', shortName: 'Hootsuite' },
  { slug: 'buffer', shortName: 'Buffer' },
  { slug: 'later', shortName: 'Later' },
  { slug: 'sprout-social', shortName: 'Sprout Social' },
  { slug: 'socialpilot', shortName: 'SocialPilot' },
  { slug: 'agorapulse', shortName: 'Agorapulse' },
  { slug: 'publer', shortName: 'Publer' },
  { slug: 'postiz', shortName: 'Postiz' },
];

export const DEFAULT_ALTERNATIVES: FooterCompareItem[] = [
  { slug: 'buffer', shortName: 'Buffer' },
  { slug: 'hootsuite', shortName: 'Hootsuite' },
  { slug: 'later', shortName: 'Later' },
  { slug: 'sprout-social', shortName: 'Sprout Social' },
  { slug: 'socialpilot', shortName: 'SocialPilot' },
  { slug: 'sendible', shortName: 'Sendible' },
  { slug: 'loomly', shortName: 'Loomly' },
  { slug: 'metricool', shortName: 'Metricool' },
];
