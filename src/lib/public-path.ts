/** Prefix public files and plain links when hosted under a GitHub Pages subdirectory. */
export function publicPath(url: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!url.startsWith('/') || url.startsWith('//') || (base && (url === base || url.startsWith(`${base}/`)))) return url;
  return `${base}${url}`;
}
