import { readFileSync } from 'node:fs'
import { defineConfig } from 'astro/config'
import base from './astro.server.config.mjs'

// Share the localhost certificate with Next.js; never load it in public or
// production server builds. See README.md for first-time mkcert setup.
function certificate(name) {
 try {
  return readFileSync(new URL(`../../certificates/${name}`, import.meta.url))
 } catch (cause) {
  throw new Error('CMS HTTPS requires certificates/localhost.pem and certificates/localhost-key.pem. Run the mkcert setup in README.md (or pnpm dev once to generate them).', { cause })
 }
}

export default defineConfig({
 ...base,
 server: { host: 'localhost', port: { bali: 4321, planet: 4322, upskill: 4323 }[process.env.LUMEN_SITE] || 4321 },
 vite: {
  ...base.vite,
  server: {
   ...base.vite?.server,
   strictPort: true,
   https: { cert: certificate('localhost.pem'), key: certificate('localhost-key.pem') },
  },
 },
})
