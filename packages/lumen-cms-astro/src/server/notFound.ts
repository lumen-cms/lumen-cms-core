export class CmsPageProtectedError extends Error {
 constructor(slug?: string) { super(`Protected route cannot be statically published: /${slug || ''}`); this.name = 'CmsPageProtectedError' }
}

export class CmsPageNotFoundError extends Error {
 constructor(slug?: string) {
  super(`Missing CMS page/settings: /${slug || ''}`)
  this.name = 'CmsPageNotFoundError'
 }
}

export function isUnsupportedPageSlug(slug?: string) {
 return ['_dev_', '[object Object]'].includes(slug?.split('/')[0] || '')
}

export function notFoundResponse() {
 return new Response('<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Not Found</title><meta property="og:title" content="Not Found" /></head><body><div>not found...</div></body></html>', {
  status: 404,
  headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' },
 })
}
