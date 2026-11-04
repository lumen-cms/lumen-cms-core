import { fileURLToPath } from 'node:url'

/** Let Astro dispatch unmatched URLs to the CMS error page on every SSR adapter. */
export function localeErrorRouting() {
 return {
  name: 'lumen-locale-error-routing',
  hooks: {
   'astro:config:setup': ({ config, injectRoute }) => {
    if (config.output !== 'server' && !config.adapter) return
    injectRoute({
     pattern: '/404',
     entrypoint: fileURLToPath(new URL('../src/server/routes/404.astro', import.meta.url)),
     prerender: false,
    })
   },
  },
 }
}
