import assert from 'node:assert/strict'
import { mkdir, writeFile, readFile, readdir, symlink, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { createRequire } from 'node:module'
const root = fileURLToPath(new URL('../', import.meta.url))
const requireAstro = createRequire(resolve(root, 'packages/lumen-cms-astro/package.json'))
const { build } = await import(requireAstro.resolve('astro'))
const base = resolve(root, '.website-tests/speed-insights')
await rm(base, { recursive: true, force: true })
async function files(path) {
 return (await Promise.all((await readdir(path, { withFileTypes: true })).map(e => e.isDirectory() ? files(resolve(path,e.name)) : resolve(path,e.name)))).flat()
}
const cases = [
 ['unset', undefined, 'production', 'public', false],
 ['zero', '0', 'production', 'public', false],
 ['false', 'false', 'production', 'public', false],
 ['true', 'true', 'production', 'public', true],
 ['uppercase', 'TRUE', 'production', 'public', true],
 ['one', '1', 'production', 'public', true],
 ['preview', '1', 'preview', 'preview', false],
 ['ssr-off', undefined, 'production', 'preview', false],
]
for (const [name, enabled, vercelEnv, buildMode, expected] of cases) {
 const fixture = resolve(base, name)
 await mkdir(resolve(fixture,'src/pages'), { recursive: true })
 await symlink(resolve(root,'packages/lumen-cms-astro/node_modules'), resolve(fixture,'node_modules'), 'dir')
 await writeFile(resolve(fixture,'package.json'), JSON.stringify({ type: 'module' }))
 const settings = { enabled, vercelEnv, buildMode }
 const definitions = { 'process.env.LUMEN_SPEED_INSIGHTS': enabled === undefined ? 'undefined' : JSON.stringify(enabled), 'process.env.VERCEL_ENV': JSON.stringify(vercelEnv), 'process.env.LUMEN_SPEED_INSIGHTS_SAMPLE_RATE': JSON.stringify('0.1') }
 await writeFile(resolve(fixture,'astro.config.mjs'), `
import { optionalSpeedInsights } from ${JSON.stringify(resolve(root,'packages/lumen-cms-astro/build/speed-insights.mjs'))}
import node from ${JSON.stringify(requireAstro.resolve('@astrojs/node'))}
export default { output: ${JSON.stringify(buildMode === 'preview' ? 'server' : 'static')}, adapter: ${buildMode === 'preview' ? "node({mode:'standalone'})" : 'undefined'}, vite: { define: ${JSON.stringify(definitions)}, plugins: [optionalSpeedInsights(${JSON.stringify(settings)}), {name:'assert-speed-insights-module-graph',generateBundle(options,bundle){const sdk=Object.values(bundle).filter(x=>x.type==='chunk').flatMap(x=>Object.keys(x.modules)).filter(id=>id.includes('@vercel/speed-insights'));if(!${expected}&&sdk.length)this.error('Disabled Speed Insights entered bundle: '+sdk.join(','))}}] } }
`)
 await writeFile(resolve(fixture,'src/pages/index.astro'), `---\nimport SpeedInsights from ${JSON.stringify(resolve(root,'packages/lumen-cms-astro/src/components/SpeedInsights.astro'))}\n---\n<html><body>Fixture<SpeedInsights preview={false} /></body></html>`)
 await build({ root: fixture, logLevel: 'error' })
 const output = (await Promise.all((await files(resolve(fixture,'dist'))).filter(f=>/\.(?:html|js|mjs)$/.test(f)).map(f=>readFile(f,'utf8')))).join('\n')
 const containsSdk = /vercel-speed-insights|speedInsightsBeforeSend|\/_vercel\/speed-insights/.test(output)
 assert.equal(containsSdk, expected, name + ': emitted HTML/JS must match explicit opt-in')
 console.log(`${name}: SDK ${expected ? 'included' : 'absent'} in emitted output`)
}
