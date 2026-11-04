const fs = require('node:fs/promises')
const path = require('node:path')
const Module = require('node:module')
const { build } = require('esbuild')

async function main() {
  const root = path.resolve(__dirname, '..')
  const result = await build({
    stdin: { contents: `export { staticRoutes, loadPage } from './packages/lumen-cms-astro/src/server/pages'; export { publishedRouteStories } from './packages/lumen-cms-astro/src/server/linkInventory'`, resolveDir: root, loader: 'ts' },
    bundle: true, platform: 'node', format: 'cjs', write: false,
    define: { 'import.meta.env.DEV': 'false' }
  })
  const filename = path.join(root, 'astro-inventory-runtime.cjs')
  const runtime = new Module(filename, module)
  runtime.filename = filename
  runtime.paths = Module._nodeModulePaths(root)
  runtime._compile(result.outputFiles[0].text, filename)
  const { staticRoutes, loadPage } = runtime.exports
  const routes = await staticRoutes()
  if (process.env.LUMEN_ROUTE_AUDIT) {
    const locales = process.env.LUMEN_LOCALES.split(',')
    const stories = await runtime.exports.publishedRouteStories(locales, !!process.env.PUBLIC_FIELD_LEVEL_TRANSLATION)
    const missing = stories.filter(story => !routes.some(route => route.props.cmsSlug === story.full_slug && (!story.locale || route.props.locale === story.locale)))
    if (missing.length) throw new Error(`${missing.length} published stories are missing from getStaticPaths`)
    const byLocale = Object.fromEntries(locales.map(locale => [locale, 0]))
    for (const route of routes) byLocale[route.props.locale]++
    const syntheticHomes = routes.filter(route => !stories.some(story => story.full_slug === route.props.cmsSlug && (!story.locale || story.locale === route.props.locale))).map(route => '/' + (route.params.slug || ''))
    const report = { site: process.env.LUMEN_SITE, capturedAt: new Date().toISOString(), publishedStories: stories.length, missing: missing.length, syntheticHomes, total: routes.length, byLocale, routes }
    const output = path.join(root, '.website-tests/astro-content', process.env.LUMEN_SITE)
    await fs.mkdir(output, { recursive: true })
    await fs.writeFile(path.join(output, 'routes.json'), JSON.stringify(report, null, 2))
    console.log(JSON.stringify({ site: report.site, publishedStories: stories.length, missing: missing.length, syntheticHomes, total: report.total, byLocale, report: path.join(output, 'routes.json') }, null, 2))
    return
  }
  const limit = Number(process.env.LUMEN_INVENTORY_LIMIT || routes.length)
  const output = path.join(root, '.website-tests/astro-content', process.env.LUMEN_SITE)
  await fs.mkdir(output, { recursive: true })
  const counts = {}
  const inspect = value => {
    if (!value || typeof value !== 'object') return
    if (typeof value.component === 'string') counts[value.component] = (counts[value.component] || 0) + 1
    Object.values(value).forEach(inspect)
  }
  const results = []
  for (const [index, route] of routes.slice(0, limit).entries()) {
    const props = await loadPage(route.params.slug, route.props)
    inspect(props)
    const file = `${index}.json`
    await fs.writeFile(path.join(output, file), JSON.stringify(props))
    results.push({ path: '/' + (route.params.slug || ''), file })
    console.log(`${process.env.LUMEN_SITE}: ${index + 1}/${Math.min(limit, routes.length)} ${results.at(-1).path}`)
  }
  await fs.writeFile(path.join(output, 'inventory.json'), JSON.stringify({ site: process.env.LUMEN_SITE, capturedAt: new Date().toISOString(), routes: results, components: counts }, null, 2))
  console.log(JSON.stringify({ routes: results.length, components: counts }, null, 2))
}
main().catch(error => { console.error(JSON.stringify({ message: error.message, status: error.response?.status || error.status, statusCode: error.statusCode, code: error.code, cause: error.cause?.code, causeName: error.cause?.name, causeMessage: Object.entries(process.env).filter(([key, value]) => /TOKEN|KEY/.test(key) && value).reduce((message, [, value]) => message.split(value).join('[redacted]').split(encodeURIComponent(value)).join('[redacted]'), error.cause?.message || '') })); process.exitCode = 1 })
