/** Keep the shared anchor dependency-free and usable in preview/SSR. */
export function hoverPrefetch(attrs: { href?: string | URL | null; target?: string | null; download?: unknown; [key: string]: unknown }, currentUrl: URL, site?: URL, preview = false) {
 if (preview || !attrs.href || attrs.download != null && attrs.download !== false || attrs.target && attrs.target !== '_self' || attrs['data-lm-action'] || attrs['data-lm-dialog-trigger'] || attrs['data-astro-prefetch'] === 'false' || attrs['data-astro-prefetch'] === false) return undefined
 const href = String(attrs.href)
 if (href.startsWith('#') || href.startsWith('?')) return undefined
 try {
  const base = new URL(currentUrl.pathname, site || currentUrl)
  const destination = new URL(href, base)
  if (!['http:', 'https:'].includes(destination.protocol) || destination.origin !== base.origin || destination.pathname === base.pathname) return undefined
  return attrs['data-astro-prefetch'] ?? 'hover'
 } catch { return undefined }
}
