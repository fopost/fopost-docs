import { getPageByUrl, source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { PageActions } from '@/components/page-actions';
import { BASE_PATH, BRAND } from '@/lib/brand';
import { urlToParams } from '@/lib/page-url';
import { JsonLd } from '@/components/seo/json-ld';
import { pageGraph } from '@/lib/seo';

export default async function Page(props: PageProps<'/[[...slug]]'>) {
  const params = await props.params;
  const page = getPageByUrl(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const path = page.url === '/' ? '/index' : page.url;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      /* The section tab, the highlighted sidebar item and the title already
         say where the reader is; a crumb above the title only repeats one. */
      breadcrumb={{ enabled: false }}
      tableOfContent={{ style: 'clerk' }}
    >
      <JsonLd data={pageGraph(page)} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-6">{page.data.description}</DocsDescription>
      <PageActions
        markdownUrl={`${BASE_PATH}${path}.md`}
        pageUrl={`${BRAND.docsUrl}${page.url === '/' ? '' : page.url}`}
      />
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: urlToParams(page.url) }));
}

export async function generateMetadata(props: PageProps<'/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = getPageByUrl(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    // page.url is the public path under /docs; root ('/') must not end with a slash
    alternates: {
      canonical: `${BRAND.docsUrl}${page.url === '/' ? '' : page.url}`,
    },
  };
}
