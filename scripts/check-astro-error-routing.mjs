import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import lumenStoryblok from '../packages/lumen-cms-astro/integration.mjs'
import { localeErrorRouting } from '../packages/lumen-cms-astro/build/error-routing.mjs'
const root = resolve('packages/lumen-cms-astro')
const require = createRequire(join(root, 'package.json'))
const { build } = await import(pathToFileURL(require.resolve('astro')))
const { default: node } = await import(pathToFileURL(require.resolve('@astrojs/node')))
const temp = await mkdtemp(join(root, '.error-routing-test-'))
let server
try {
 await symlink(join(root, 'node_modules'), join(temp, 'node_modules'), 'dir')
 await mkdir(join(temp, 'src/pages'), { recursive: true })
 await writeFile(join(temp, 'src/pages/index.astro'), '<h1>Existing page</h1>')
 // Replace only CMS delivery; exercise the real route, layout and Astro dispatcher.
 const mock = join(temp, 'error-page.ts')
 await writeFile(mock, `export async function loadErrorPage(options) { return {
  ...options, pageNotFound: true, insideStoryblok: false,
  settings: { component: 'global', theme_base: 'base', footer: [{component: 'headline', text: 'Site footer'}] },
  page: {component: 'page', property: ['disable_promotion'], body: [{ component: 'headline', tag: 'h1', text: 'Missing page in ' + options.locale }]}
 } }`)
 await build({ root, configFile: false, srcDir: join(temp, 'src/'), outDir: join(temp, 'dist/'), publicDir: join(temp, 'public/'), output: 'server', adapter: node({ mode: 'standalone' }), integrations: [lumenStoryblok({ preview: true }), localeErrorRouting()], vite: { define: { 'process.env.LUMEN_LOCALES': JSON.stringify('en,de,it') }, plugins: [{ name: 'fixture-cms', enforce: 'pre', resolveId(source, importer) { if (source === '../errorPage' && importer?.endsWith('/server/routes/404.astro')) return mock } }], ssr: { noExternal: ['lumen-cms-shared'] } } })
 const socket = createServer()
 await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve))
 const port = socket.address().port
 await new Promise(resolve => socket.close(resolve))
 server = spawn(process.execPath, [join(temp, 'dist/server/entry.mjs')], { env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) }, stdio: ['ignore', 'pipe', 'inherit'] })
 await new Promise((resolve, reject) => { const timer = setTimeout(() => reject(new Error('Server startup timeout')), 15000); server.stdout.on('data', () => { clearTimeout(timer); resolve() }); server.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited: ${code}`)) }) })
 for (const [path, locale] of [['/missing','en'], ['/de/missing','de'], ['/it/deep/missing','it'], ['/unknown/missing','en']]) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, { redirect: 'manual' })
  assert.equal(response.status, 404, path)
  assert.equal(response.headers.get('location'), null)
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow')
  const html = await response.text()
  assert(html.includes(`Missing page in ${locale}`), path)
  assert(html.includes('Site footer'), path)
 }
 assert.equal((await fetch(`http://127.0.0.1:${port}/`)).status, 200)
 assert.equal((await fetch(`http://127.0.0.1:${port}/de/missing`, { method: 'HEAD' })).status, 404)
 console.log('Locale-aware SSR 404 routing passed: default, de, it, unknown locale, HEAD, and existing page.')
} finally {
 if (server && server.exitCode === null) { server.kill(); await new Promise(resolve => server.once('exit', resolve)) }
 await rm(temp, { recursive: true, force: true })
}
