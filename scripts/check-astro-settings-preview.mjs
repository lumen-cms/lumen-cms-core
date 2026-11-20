import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import lumenStoryblok from '../packages/lumen-cms-astro/integration.mjs'
const root = resolve('packages/lumen-cms-astro')
const require = createRequire(join(root, 'package.json'))
const { build } = await import(pathToFileURL(require.resolve('astro')))
const { default: node } = await import(pathToFileURL(require.resolve('@astrojs/node')))
const temp = await mkdtemp(join(root, '.settings-preview-test-'))
let server
try {
 await symlink(join(root, 'node_modules'), join(temp, 'node_modules'), 'dir')
 await mkdir(join(temp, 'src/pages'), { recursive: true })
 await writeFile(join(temp, 'src/pages/[...slug].astro'), `---
import SiteLayout from '${join(root, 'src/layouts/SiteLayout.astro')}'
const settings = { component: 'global', _uid: 'settings', uuid: 'settings', theme_base: 'base', website_title: 'Settings preview', multi_toolbar: [{ component: 'headline', _uid: 'header', text: 'Preview header' }], footer: [{ component: 'headline', _uid: 'footer', text: 'Preview footer' }] }
const page = { locale: 'en', defaultLocale: 'en', insideStoryblok: true, settings, page: Astro.params.slug === 'content' ? { component: 'page', _uid: 'content', body: [{ component: 'headline', _uid: 'body', text: 'Normal content' }] } : settings }
---
<SiteLayout page={page} />`)
 await build({ root, configFile: false, srcDir: join(temp, 'src/'), outDir: join(temp, 'dist/'), publicDir: join(temp, 'public/'), output: 'server', adapter: node({ mode: 'standalone' }), integrations: [lumenStoryblok({ preview: true })], vite: { ssr: { noExternal: ['lumen-cms-shared'] } } })
 const socket = createServer()
 await new Promise((resolve, reject) => { socket.once('error', reject); socket.listen(0, '127.0.0.1', resolve) })
 const port = socket.address().port
 await new Promise(resolve => socket.close(resolve))
 server = spawn(process.execPath, [join(temp, 'dist/server/entry.mjs')], { env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) }, stdio: ['ignore', 'pipe', 'inherit'] })
 await new Promise((resolve, reject) => { const timer = setTimeout(() => reject(new Error('Server startup timeout')), 15000); server.stdout.on('data', () => { clearTimeout(timer); resolve() }); server.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited: ${code}`)) }) })
 for (const path of ['/settings', '/de/settings', '/content']) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`)
  const html = await response.text()
  assert.equal(response.status, 200, path)
  assert(html.includes('Preview header'), `${path}: header missing`)
  assert(html.includes('Preview footer'), `${path}: footer missing`)
  assert(html.includes('data-lumen-preview'), `${path}: preview bridge marker missing`)
  assert(!html.includes('Unmigrated component'), path)
  if (path === '/content') assert(html.includes('Normal content'))
 }
 console.log('Settings preview renders header/footer for default and localized routes; normal pages retain content.')
} finally {
 if (server && server.exitCode === null) { server.kill(); await new Promise(resolve => server.once('exit', resolve)) }
 await rm(temp, { recursive: true, force: true })
}
