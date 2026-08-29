import { BASE_PATH, BRAND } from '@/lib/brand';
import { AcronymMarkdownIcon, ArrowUpRightIcon } from '@/components/icons';

/**
 * The bottom of the sidebar: where a reader goes next, and where a model goes
 * first. Both are one row, so the tree above keeps the height it needs.
 */
export function SidebarFooter() {
  return (
    <div className="flex items-center gap-2 border-t pt-3">
      <a
        href={BRAND.appUrl}
        className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-fd-primary px-3 text-[13px] font-medium text-fd-primary-foreground no-underline transition-opacity hover:opacity-90"
      >
        Dashboard
        <ArrowUpRightIcon className="text-xs" />
      </a>
      <a
        href={`${BASE_PATH}/llms.txt`}
        title="The whole site as one file, for AI tools"
        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-fd-muted-foreground no-underline shadow-border transition-colors hover:bg-fd-muted hover:text-fd-foreground"
      >
        <AcronymMarkdownIcon className="text-base" />
        llms.txt
      </a>
    </div>
  );
}
