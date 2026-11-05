import { fileURLToPath } from 'node:url'

export function trackingWorkerConfig({ google = true, facebook = true } = {}) {
 return {
  forward: [...(google ? ['gtag', 'dataLayer.push'] : []), ...(facebook ? ['fbq'] : [])],
  resolveUrl(url, location, type) {
   if (type === 'script' && url.hostname === 'connect.facebook.net') return new URL('/~facebook' + url.pathname + url.search, location)
   return url
  },
 }
}

export function facebookScriptProxy() {
 return {
  name: 'lumen-facebook-script-proxy',
  hooks: {
   'astro:config:setup': ({ injectRoute }) => injectRoute({
    pattern: '/~facebook/[...path]',
    entrypoint: fileURLToPath(new URL('../src/server/facebookScriptProxy.ts', import.meta.url)),
    prerender: false,
   }),
  },
 }
}
