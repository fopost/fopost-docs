import { source } from '@/lib/source';
import { BRAND } from '@/lib/brand';

type Page = ReturnType<typeof source.getPages>[number];

/** The page's public URL, absolute, so a copied file still resolves. */
export function pageUrl(page: Page) {
  return `${BRAND.docsUrl}${page.url === '/' ? '' : page.url}`;
}

/** The same page as Markdown. `/` has no slug of its own, so it gets `index`. */
export function pageMarkdownUrl(page: Page) {
  return `${BRAND.docsUrl}${page.url === '/' ? '/index' : page.url}.md`;
}

/**
 * One page as Markdown: title, description, canonical URL, then the body.
 * The URL travels with the text because the text gets pasted somewhere else.
 */
export async function pageMarkdown(page: Page) {
  const body = await page.data.getText('processed');
  const description = page.data.description ? `> ${page.data.description}\n\n` : '';

  return `# ${page.data.title}\n\n${description}Source: ${pageUrl(page)}\n\n${body}`;
}

const SECTION_TITLES: Record<string, string> = {
  introduction: 'Introduction',
  guide: 'Guide',
  sdks: 'SDKs and integrations',
  api: 'API reference',
};

/**
 * The llms.txt index: one H2 per section, one bullet per page, in tree order.
 * Follows llmstxt.org, which is a link index rather than a content dump.
 */
export function llmsIndex() {
  const sections = new Map<string, Page[]>();

  for (const page of source.getPages()) {
    const section = SECTION_TITLES[page.slugs[0] ?? ''] ?? 'Introduction';
    const list = sections.get(section);
    if (list) list.push(page);
    else sections.set(section, [page]);
  }

  const body = [...sections]
    .map(([section, pages]) => {
      const lines = pages.map(
        (page) =>
          `- [${page.data.title}](${pageMarkdownUrl(page)})${
            page.data.description ? `: ${page.data.description}` : ''
          }`,
      );
      return `## ${section}\n\n${lines.join('\n')}`;
    })
    .join('\n\n');

  return `# ${BRAND.name} Documentation

> ${BRAND.name} publishes, schedules, and manages content across social networks from one place. Use the dashboard as a creator or a team; use the REST API, an SDK, or the MCP server if you are building something.

Append \`.md\` to any page URL for its Markdown source. The whole site as one file: ${BRAND.docsUrl}/llms-full.txt

${body}
`;
}

/** Every page, in tree order, as one file. */
export async function llmsFull() {
  const pages = await Promise.all(source.getPages().map(pageMarkdown));

  return `${pages.join('\n\n---\n\n')}\n`;
}
