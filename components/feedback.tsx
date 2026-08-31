'use client';

import { useState } from 'react';
import { BRAND } from '@/lib/brand';

const RATINGS = [
  { rating: 'terrible', emoji: '\u{1F62D}', label: 'Terrible' },
  { rating: 'bad', emoji: '\u{1F641}', label: 'Bad' },
  { rating: 'good', emoji: '\u{1F642}', label: 'Good' },
  { rating: 'great', emoji: '\u{1F929}', label: 'Great' },
] as const;

type Rating = (typeof RATINGS)[number]['rating'];

/* The page must never break because feedback is down, so failures only warn. */
async function post(path: string, rating: Rating, message?: string) {
  try {
    const response = await fetch(`${BRAND.apiUrl}/v1/docs-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, rating, ...(message ? { message } : {}) }),
    });
    if (!response.ok) {
      console.warn(`Feedback endpoint answered ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Could not send feedback:', error);
    return false;
  }
}

/**
 * "Was this helpful?" at the bottom of every page. An emoji click records the
 * rating immediately; a written message is a second append-only row, so a
 * reader who never presses Send still counts.
 */
export function Feedback({ path }: { path: string }) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const rate = (value: Rating) => {
    if (sent || value === rating) return;
    setRating(value);
    void post(path, value);
  };

  const submit = async () => {
    if (!rating || sent) return;
    const text = message.trim();
    if (text) await post(path, rating, text);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="not-prose inline-flex h-10 items-center rounded-full px-4 text-[13px] text-fd-muted-foreground shadow-border">
        Thanks for your feedback.
      </div>
    );
  }

  return (
    <div className="not-prose flex flex-col items-start gap-3">
      <div className="inline-flex h-10 items-center gap-2 rounded-full ps-4 pe-2 shadow-border">
        <span className="text-[13px] text-fd-muted-foreground">Was this helpful?</span>
        <div className="flex items-center gap-0.5">
          {RATINGS.map(({ rating: value, emoji, label }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={rating === value}
              onClick={() => rate(value)}
              className={`inline-flex size-8 items-center justify-center rounded-full text-base transition-colors ${
                rating === value
                  ? 'bg-fd-accent'
                  : 'grayscale hover:bg-fd-muted hover:grayscale-0'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      {rating && (
        <div className="flex w-full max-w-md flex-col gap-2 rounded-xl p-3 shadow-border">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Your feedback..."
            rows={3}
            className="w-full resize-y rounded-md bg-fd-background p-2.5 text-[13px] text-fd-foreground shadow-border-inset placeholder:text-fd-muted-foreground focus:outline-none focus:ring-2 focus:ring-fd-ring"
          />
          <button
            type="button"
            onClick={submit}
            className="inline-flex h-8 items-center self-end rounded-md bg-fd-primary px-3 text-[13px] font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
