// Stored on globalThis because the page bundle (getStaticProps) and the
// _document bundle may hold separate module instances in the same process.
const globalCache = globalThis as typeof globalThis & {
  __lmGoogleFontsCss?: Map<string, string>
}

function getCache() {
  if (!globalCache.__lmGoogleFontsCss) {
    globalCache.__lmGoogleFontsCss = new Map()
  }
  return globalCache.__lmGoogleFontsCss
}

export const getGoogleFontsCss = (href: string): string | undefined =>
  getCache().get(href)

export const setGoogleFontsCss = (href: string, css: string) => {
  getCache().set(href, css)
}

export const clearGoogleFontsCss = () => {
  getCache().clear()
}
