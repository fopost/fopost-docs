'use client';

import { useState } from 'react';
import { BRAND } from '@/lib/brand';

/**
 * The only interactive part of the footer, split out so the link columns
 * render on the server. Posts to the same subscribe endpoint the marketing
 * site's footer uses; only the source tag differs.
 */
export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BRAND.apiUrl}/v1/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'docs-footer' }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <p className="flex items-center gap-1.5 text-sm text-fd-foreground">
        <svg
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Check your inbox to confirm.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email here"
        className="min-w-0 flex-1 rounded-lg border border-fd-border bg-fd-background px-3.5 py-2 text-sm text-fd-foreground outline-none transition-colors placeholder:text-fd-muted-foreground focus:border-ds-gray-alpha-600"
      />
      <button
        type="submit"
        disabled={loading}
        className="shrink-0 cursor-pointer rounded-md bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? '...' : 'Subscribe'}
      </button>
    </form>
  );
}
