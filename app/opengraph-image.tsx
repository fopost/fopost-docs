import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE_PATH, BRAND } from '@/lib/brand';

export const alt = `${BRAND.name} Docs`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Read at module scope so the file hits disk once per build, not per route
// that inherits this image. Satori has no network, so the mark is inlined —
// and it is the raster copy, because satori does not rasterise SVG.
const logo = readFileSync(
  join(process.cwd(), 'public', BRAND.logoLarge.replace(`${BASE_PATH}/`, '')),
).toString('base64');

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#000000',
          padding: 72,
        }}
      >
        {/* accent wash, mirrors the marketing card */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND.color}8C 0%, ${BRAND.color}00 70%)`,
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* satori renders to a bitmap; the card's alt text is the `alt` export */}
          <img
            src={`data:image/png;base64,${logo}`}
            width={72}
            height={72}
            style={{ borderRadius: 16 }}
          />
          <span style={{ fontSize: 44, fontWeight: 700, color: '#ffffff', letterSpacing: -1 }}>
            {BRAND.name}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Documentation
          </span>
          <span style={{ fontSize: 32, color: '#94A3B8', maxWidth: 900, lineHeight: 1.35 }}>
            The dashboard, the REST API, the SDKs, and the platforms.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', width: 56, height: 6, background: BRAND.color }} />
          <span style={{ fontSize: 26, color: '#64748B' }}>{BRAND.domain}/docs</span>
        </div>
      </div>
    ),
    size,
  );
}
