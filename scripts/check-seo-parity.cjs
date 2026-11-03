// Compare complete SEO output, retaining duplicate tags and order within each
// property (notably OG images). JSON-LD object key and script order are irrelevant.
const fs = require('node:fs')
const path = require('node:path')
const { isDeepStrictEqual } = require('node:util')
const { load } = require('cheerio')
const sites = require('../test/websites/sites.json')
const root = path.resolve(__dirname, '..')
const output = path.join(root, '.website-tests/seo-parity')
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value
function footprint(html) {
 const $ = load(html), meta = {}, links = {}
 $('meta[name],meta[property]').each((_, element) => {
  const key = $(element).attr('name') || $(element).attr('property')
  // Framework bookkeeping is not SEO metadata.
  if (['viewport', 'next-head-count'].includes(key)) return
  ;(meta[key] ||= []).push($(element).attr('content'))
 })
 $('link[rel]').each((_, element) => {
  const rel = $(element).attr('rel')
  if (!['canonical','alternate','icon','apple-touch-icon','apple-touch-icon-precomposed','manifest'].includes(rel)) return
  const attributes = Object.fromEntries(['href','hreflang','sizes','type','media'].filter(key => $(element).attr(key) !== undefined).map(key => [key,$(element).attr(key)]))
  ;(links[rel] ||= []).push(attributes)
 })
 const schemas = $('script[type="application/ld+json"]').toArray().map(element => stable(JSON.parse($(element).text()))).sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
 return { title: $('title').text(), lang: $('html').attr('lang'), meta, links, schemas }
}
function sitemapFootprint(xml) {
 const $ = load(xml, { xmlMode: true })
 if (!$('urlset').length) throw new Error('Expected a sitemap urlset')
 return $('url').toArray().map(element => $(element).children().toArray().map(child => [child.tagName, $(child).text()])).sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
}
async function main() {
 fs.mkdirSync(output, { recursive: true })
 const results = []
 const discovery = []
 for (const [site, config] of Object.entries(sites)) {
  for (const endpoint of ['/sitemap.xml', '/api/sitemap']) {
   const referenceFile = path.join(output, site, endpoint.replaceAll('/', '_'))
   if (process.argv.includes('--fetch')) {
    const response = await fetch(config.origin + endpoint, { signal: AbortSignal.timeout(60000), redirect: 'manual' })
    if (response.status !== 200) throw new Error(`${site} ${endpoint}: reference status ${response.status}`)
    fs.mkdirSync(path.dirname(referenceFile), { recursive: true })
    fs.writeFileSync(referenceFile, await response.text())
   }
   if (!process.argv.includes('--fetch-only')) {
    const expected = sitemapFootprint(fs.readFileSync(referenceFile, 'utf8'))
    const actual = sitemapFootprint(fs.readFileSync(path.join(root, 'packages/lumen-cms-astro/dist', site, endpoint), 'utf8'))
    const matches = isDeepStrictEqual(expected, actual)
    discovery.push({ site, endpoint, expectedEntries: expected.length, actualEntries: actual.length, matches, ...(!matches && { expected, actual }) })
    console.log(`${site} ${endpoint}: ${matches ? 'PASS' : 'FAIL'} (${actual.length} entries)`)
   }
  }
  for (const route of config.routes) {
   const file = path.join(output, site, `${encodeURIComponent(route)}.html`)
   fs.mkdirSync(path.dirname(file), { recursive: true })
   let status = 200
   if (process.argv.includes('--fetch')) {
    const response = await fetch(config.origin + route, { signal: AbortSignal.timeout(60000), redirect: 'manual' })
    status = response.status
    if (status !== 200) throw new Error(`${site} ${route}: reference status ${status}`)
    fs.writeFileSync(file, await response.text())
   }
   if (process.argv.includes('--fetch-only')) { console.log(`${site} ${route}: captured`); continue }
   const expected = footprint(fs.readFileSync(file, 'utf8'))
   const actual = footprint(fs.readFileSync(path.join(root, 'packages/lumen-cms-astro/dist', site, route, 'index.html'), 'utf8'))
   const differences = Object.keys(expected).filter(key => !isDeepStrictEqual(expected[key], actual[key])).map(key => ({ field: key, expected: expected[key], actual: actual[key] }))
   results.push({ site, route, referenceStatus: status, differences })
   console.log(`${site} ${route}: ${differences.length ? differences.map(item => item.field).join(', ') : 'PASS'}`)
  }
 }
 if (!process.argv.includes('--fetch-only')) {
  const report = { checkedAt: new Date().toISOString(), reference: 'Published Next.js HTML and sitemaps', results, discovery }
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
  const failed = results.filter(item => item.differences.length)
  console.log(`${results.length - failed.length}/${results.length} routes match; report: ${path.join(output, 'report.json')}`)
  process.exitCode = failed.length || discovery.some(item => !item.matches) ? 1 : 0
 }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
module.exports = { footprint, sitemapFootprint }
