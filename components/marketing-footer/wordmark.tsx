'use client';

import { useRef, type PointerEvent } from 'react';

/* Oversized outlined brand wordmark that closes the sitewide footer.

   Two stacked copies of the same text: a faint hairline base, and an inked
   copy revealed through a radial mask that follows the pointer, so hovering
   reads as a spotlight sweeping across the letters rather than a per-letter
   toggle. The mask center rides CSS custom properties, so tracking the
   pointer is one style write per move and never a re-render.

   The letters are filled in the footer's own background with
   `paint-order: stroke fill` (see .mf-wordmark in styles.css) — that hides
   the seams where a glyph's contours overlap, which a bare text-stroke
   exposes. The rise on scroll is .mf-wordmark-rise, driven by a view()
   timeline rather than an observer. */
const TYPE =
  'block text-center whitespace-nowrap font-bold leading-[1.16] tracking-[-0.02em] text-[clamp(3rem,28vw,28rem)]';

export function FooterWordmark({
  brandName,
  className = '',
}: {
  brandName: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    el.style.setProperty('--mf-spot-x', `${event.clientX - box.left}px`);
    el.style.setProperty('--mf-spot-y', `${event.clientY - box.top}px`);
  };

  const lit = (on: boolean) => () => ref.current?.style.setProperty('--mf-spot-on', on ? '1' : '0');

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerMove={move}
      onPointerEnter={lit(true)}
      onPointerLeave={lit(false)}
      className={`mf-wordmark relative ${className}`}
    >
      <span className={`mf-wordmark-rise ${TYPE}`}>{brandName}</span>
      <span className={`mf-wordmark-rise mf-wordmark-spot absolute inset-0 ${TYPE}`}>
        {brandName}
      </span>
    </div>
  );
}
