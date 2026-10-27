// Derive public URLs from built page props, not prerender-manifest keys: the
// existing consumers also build aliases containing a repeated locale prefix.
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const [consumerArg, outputArg, observationsArg] = process.argv.slice(2)
if (!consumerArg || !outputArg) {
  throw new Error('Usage: node scripts/visual-site-inventory.cjs <consumer workspace> <output.json> [prior observations.json]')
}
const consumer = fs.realpathSync(consumerArg)
const previous = observationsArg ? JSON.parse(fs.readFileSync(observationsArg, 'utf8')) : []
const sites = {
  bali: { pkg: 'baliinternships', host: 'baliinternships.com', port: 3020 },
  planet: { pkg: 'planet-training', host: 'planet.training', port: 3021 },
  upskill: { pkg: 'upskill', host: 'upskill.study', port: 3022 }
}
const canonical = (value) => value.replace(/^\/en(?=\/|$)/, '')
  .replace(/\/home$/, '/').replace(/\/$/, '') || '/'
const routes = []
for (const [site, spec] of Object.entries(sites)) {
  const build = path.join(consumer, 'packages', spec.pkg, '.next')
  const manifest = JSON.parse(fs.readFileSync(path.join(build, 'prerender-manifest.json'), 'utf8'))
  const unique = new Map()
  for (const alias of Object.keys(manifest.routes)) {
    const file = path.join(build, 'server/pages', `${alias}.json`)
    if (!fs.existsSync(file)) continue
    const props = JSON.parse(fs.readFileSync(file, 'utf8')).pageProps
    if (!props?.page) continue
    const locale = props.locale || 'en'
    const slug = props.slug || '/'
    const route = canonical((locale === 'en' ? '' : `/${locale}`) + (slug.startsWith('/') ? slug : `/${slug}`))
    if (!unique.has(route)) {
      const components = {}
      const visit = (value) => {
        if (!value || typeof value !== 'object') return
        if (typeof value.component === 'string') components[value.component] = (components[value.component] || 0) + 1
        for (const child of Object.values(value)) {
          if (Array.isArray(child)) child.forEach(visit)
          else if (typeof child === 'object') visit(child)
        }
      }
      visit(props.page)
      const covered = previous.filter((r) => r.label === 'live' && r.full &&
        new URL(r.url).hostname === spec.host && canonical(new URL(r.url).pathname) === route)
      unique.set(route, {
        id: `${site}-${crypto.createHash('sha1').update(route).digest('hex').slice(0, 10)}`,
        site, locale, path: route, live: `https://${spec.host}${route}`,
        local: `http://127.0.0.1:${spec.port}${route}`,
        title: props.page.meta_title || '', components, buildAliases: [],
        previousWidths: [...new Set(covered.map((r) => r.width))],
        priority: (locale !== 'en' ? 100 : 0) +
          (/faq|fees|gebuehren|fristen|coaching-app|preise|pricing|unterkunft|accommodation|sommerkurs|magang|kontak|cara-mendaftar|infos\//.test(route) ? 80 : 0)
      })
    }
    unique.get(route).buildAliases.push(alias)
  }
  routes.push(...unique.values())
}
routes.sort((a, b) => b.priority - a.priority || a.path.localeCompare(b.path))
fs.writeFileSync(path.resolve(outputArg), JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: 'Canonical locale + slug from built page props; build aliases retained. Reconcile separately with live sitemaps and observed links.',
  sites, routes
}, null, 2))
console.log(JSON.stringify({ routes: routes.length,
  sites: Object.fromEntries(Object.keys(sites).map((site) => [site, routes.filter((r) => r.site === site).length])) }))
