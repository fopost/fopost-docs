import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';
import remarkBrand, { brandText } from './lib/remark-brand.mjs';

/* Frontmatter and meta.json never reach a remark plugin — fumadocs parses
   them before MDX compiles — so the brand is applied here instead. These are
   the page titles, the descriptions in <head>, and the sidebar labels. */
const branded = z.string().transform(brandText);

export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      order: z.number().optional(),
      title: branded,
      description: branded.optional(),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      title: branded.optional(),
      pages: z.array(z.string()).optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    // Applies the deployment's brand to prose and service URLs as the docs
    // compile, so content/** can keep naming the product the normal way.
    remarkPlugins: [remarkBrand],
  },
});
