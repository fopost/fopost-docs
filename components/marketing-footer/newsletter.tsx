'use client';

import { useState } from 'react';

/**
 * The only interactive part of the footer. Split out so the footer's link
 * columns — a large share of the site's internal linking — render on the
 * server and never wait on hydration.
 */
export function FooterNewsletter({
  apiUrl,
  source,
  subscribedStorageKey,
}: {
  apiUrl: string;
  source: string;
  /** Written as `{"state":"subscribed","at":<now>}` so a host popup stays away. */
  subscribedStorageKey?: string;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/v1/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok) {
        if (subscribedStorageKey) {
          try {
            localStorage.setItem(
              subscribedStorageKey,
              JSON.stringify({ state: 'subscribed', at: Date.now() }),
            );
          } catch {
            /* private mode — the host popup just shows again next visit */
          }
        }
        setSubmitted(true);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <p className="text-sm text-ds-green-900 flex items-center gap-1.5">
        <svg
          className="w-4 h-4"
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
        className="flex-1 min-w-0 px-3.5 py-2 rounded-lg bg-ds-background-100 border border-ds-gray-alpha-400 text-sm text-ds-gray-1000 placeholder-ds-gray-900 outline-none focus:border-ds-gray-alpha-600 transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-md bg-ds-gray-1000 text-ds-background-100 text-sm font-semibold hover:bg-ds-gray-900 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
      >
        {loading ? '...' : 'Subscribe'}
      </button>
    </form>
  );
}
