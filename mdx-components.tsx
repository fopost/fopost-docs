import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Card, Cards } from '@/components/mdx/card';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Geist surfaces, and an `icon` prop that takes a Geist slug.
    Card,
    Cards,
    ...components,
  };
}
