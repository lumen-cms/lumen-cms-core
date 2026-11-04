import { fileURLToPath } from 'node:url'

export function discovery({ preview }) {
 return {
  name: 'lumen-discovery',
  hooks: {
   'astro:config:setup': ({ addMiddleware, injectRoute }) => {
    if (preview) addMiddleware({ entrypoint: fileURLToPath(new URL('../src/server/noindex.ts', import.meta.url)), order: 'pre' })
    injectRoute({
     pattern: '/sitemap.xml',
     entrypoint: fileURLToPath(new URL('../src/server/publicSitemap.ts', import.meta.url)),
     prerender: !preview,
    })
    injectRoute({
     pattern: '/robots.txt',
     entrypoint: fileURLToPath(new URL('../src/server/robots.ts', import.meta.url)),
     prerender: !preview,
    })
   },
  },
 }
}
