import type { ComponentProps } from 'react';
import { cn } from 'fumadocs-ui/utils/cn';
import { SidebarFooter } from './sidebar-footer';

/**
 * Replaces the layout's footer slot wrapper so the footer shows on every
 * viewport (the default wrapper hides it on desktop). `children` carries the
 * layout's own rows — the drawer's icon links and theme switch — and keeps
 * rendering above ours.
 */
export function SidebarFooterArea({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div {...props} className={cn(className, 'flex flex-col gap-2 border-t p-4 pt-3')}>
      <div className="flex flex-row items-center text-fd-muted-foreground empty:hidden">
        {children}
      </div>
      <SidebarFooter />
    </div>
  );
}
