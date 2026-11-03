import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'
import { mdiIcons } from '../packages/lumen-cms-astro/build/mdi-icons.mjs'

const root = resolve(import.meta.dirname, '..')
const directory = await mkdtemp(join(tmpdir(), 'lumen-icons-'))
const originalFetch = globalThis.fetch
try {
 await symlink(join(root, 'node_modules'), join(directory, 'node_modules'), 'dir')
 await build({
  configFile: false, logLevel: 'error', plugins: [mdiIcons()],
  build: { ssr: join(root, 'packages/lumen-cms-astro/src/lib/icons.ts'), outDir: directory, emptyOutDir: false, minify: false, rolldownOptions: { output: { entryFileNames: 'icons.mjs' } } },
 })
 const { iconSvg } = await import(pathToFileURL(join(directory, 'icons.mjs')).href)
 globalThis.fetch = async () => { throw new Error('Named icons must not access the network') }
 for (const name of ['plus', 'chevron-down', 'account-check-outline', 'call', 'people', 'access_time', 'compare_arrows', 'keyboard_arrow_down']) {
  assert.match(await iconSvg(name), /<svg[\s>]/)
 }
 assert.equal(await iconSvg('keyboard_arrow_down'), await iconSvg('chevron-down'))
 assert.equal(await iconSvg(), '')
 await assert.rejects(iconSvg('__proto__'), /Unknown MDI icon/)
 await assert.rejects(iconSvg('../../secret'), /Unknown MDI icon/)
 let requests = 0
 globalThis.fetch = async source => {
  requests++
  assert.equal(source, 'https://example.test/custom.svg')
  return new Response('<svg viewBox="0 0 24 24" onload="alert(1)"><script>alert(1)</script><path d="M0 0h24" /></svg>')
 }
 const custom = await iconSvg('plus', '//example.test/custom.svg')
 assert.match(custom, /M0 0h24/)
 assert.doesNotMatch(custom, /script|onload|alert/)
 assert.equal(await iconSvg('plus', '//example.test/custom.svg'), custom)
 assert.equal(requests, 1, 'Custom SVG URLs retain the existing cache')
 const manifest = JSON.parse(await readFile(join(root, 'packages/lumen-cms-astro/package.json'), 'utf8'))
 const legacy = await readFile(join(root, 'src/components/icon/LmIcon.tsx'), 'utf8')
 assert(legacy.includes(`@mdi/svg@${manifest.dependencies['@mdi/svg']}/svg/`), 'Next CDN icons must match the Astro package version')
 const plugin = mdiIcons()
 await assert.rejects(plugin.load(plugin.resolveId('virtual:lumen-mdi-icons'), { ssr: false }), /server-only/)
 console.log('Bundled MDI icons work offline; custom URLs remain sanitized/cached; Next version matches; client imports are rejected.')
} finally {
 globalThis.fetch = originalFetch
 await rm(directory, { recursive: true, force: true })
}
