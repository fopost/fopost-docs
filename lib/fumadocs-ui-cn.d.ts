// fumadocs-ui ships `./utils/cn` (tailwind-merge) without a declaration file.
declare module 'fumadocs-ui/utils/cn' {
  export function cn(...inputs: Array<string | number | false | null | undefined>): string;
}
