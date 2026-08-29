'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  AcronymMarkdownIcon,
  AgentClaudeIcon,
  SocialOpenaiIcon,
  ExternalSmallIcon,
} from '@/components/icons';

/**
 * Copy this page as Markdown, or hand it to a model.
 *
 * The Markdown is fetched rather than embedded: the same text is already served
 * at the page's `.md` URL, and shipping a second copy inside the HTML would
 * double the weight of every page for a control most readers never press.
 */
export function PageActions({ markdownUrl, pageUrl }: { markdownUrl: string; pageUrl: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    const response = await fetch(markdownUrl);
    await navigator.clipboard.writeText(await response.text());
    setCopied(true);
    setOpen(false);
  };

  const prompt = encodeURIComponent(`Read ${pageUrl} and answer my questions about it.`);

  return (
    <div className="not-prose mb-2 flex items-center gap-2" ref={menu}>
      <button
        type="button"
        onClick={copy}
        className={`${BUTTON} rounded-md px-2.5`}
        aria-label="Copy this page as Markdown"
      >
        {copied ? (
          <CheckIcon className="text-base text-ds-green-700" />
        ) : (
          <CopyIcon className="text-base" />
        )}
        {copied ? 'Copied' : 'Copy page'}
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="menu"
          className={`${BUTTON} rounded-md px-2`}
        >
          Open
          <ChevronDownIcon className="text-xs opacity-60" />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute start-0 top-9 z-30 w-60 rounded-xl bg-fd-popover p-1 shadow-menu"
          >
            <a href={markdownUrl} className={ITEM} role="menuitem" target="_blank" rel="noreferrer">
              <AcronymMarkdownIcon className="text-base opacity-70" />
              View as Markdown
              <ExternalSmallIcon className="ms-auto text-xs opacity-40" />
            </a>
            <a
              href={`https://chatgpt.com/?q=${prompt}`}
              className={ITEM}
              role="menuitem"
              target="_blank"
              rel="noreferrer"
            >
              <SocialOpenaiIcon className="text-base opacity-70" />
              Open in ChatGPT
              <ExternalSmallIcon className="ms-auto text-xs opacity-40" />
            </a>
            <a
              href={`https://claude.ai/new?q=${prompt}`}
              className={ITEM}
              role="menuitem"
              target="_blank"
              rel="noreferrer"
            >
              <AgentClaudeIcon className="text-base opacity-70" />
              Open in Claude
              <ExternalSmallIcon className="ms-auto text-xs opacity-40" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* One button size everywhere: 32px, 14px label, hairline edge, no drop shadow. */
const BUTTON =
  'inline-flex h-8 items-center gap-1.5 text-[14px] font-medium text-fd-foreground ' +
  'shadow-border bg-fd-background transition-colors hover:bg-fd-muted ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-blue-700';

const ITEM =
  'flex h-8 items-center gap-2 rounded-lg px-2 text-[13px] text-fd-foreground no-underline ' +
  'transition-colors hover:bg-fd-muted';
