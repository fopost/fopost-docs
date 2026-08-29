import { docs } from '../.source/server';
import { loader } from 'fumadocs-core/source';
import { Icon } from '@/components/icons/registry';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  url: (slugs) => {
    // Introduction pages use clean URLs without /introduction prefix
    if (slugs[0] === 'introduction') {
      const rest = slugs.slice(1);
      return rest.length === 0 ? '/' : '/' + rest.join('/');
    }
    return '/' + slugs.join('/');
  },
  // meta.json and frontmatter name a Geist icon by its slug ('rocket'), the
  // same names apps/web uses in its data files. The registry is server-only.
  icon: (icon) => (icon ? <Icon name={icon} className="text-[15px]" /> : undefined),
});
