/**
 * Renders one or more schema.org graphs as ld+json. Server component: the
 * markup has to be in the prerendered HTML or crawlers never see it.
 *
 * `<` is escaped so a string in the data can never close the script tag early.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const graphs = Array.isArray(data) ? data : [data];

  return (
    <>
      {graphs.map((graph, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(graph).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}
