// Read-only baseline measurement of an existing Pages Router production build.
// Usage: node scripts/audit-pages-footprint.cjs <dist-directory> [report.json]
const fs = require('node:fs')
const path = require('node:path')
const { gzipSync, brotliCompressSync } = require('node:zlib')

const [directory, destination] = process.argv.slice(2)
if (!directory)
  throw new Error(
    'Usage: node scripts/audit-pages-footprint.cjs <dist-directory> [report.json]'
  )
const dist = path.resolve(directory)
const read = (file) => fs.readFileSync(path.join(dist, file), 'utf8')
const manifest = JSON.parse(read('prerender-manifest.json'))
const sizes = (value) => ({
  raw: Buffer.byteLength(value),
  gzip: gzipSync(value).length,
  brotli: brotliCompressSync(value).length
})
const routes = []
for (const [route, config] of Object.entries(manifest.routes)) {
  if (!config.srcRoute) continue
  const file = `server/pages/${route === '/' ? 'index' : route.slice(1)}.html`
  const html = read(file)
  const data = html.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
  )?.[1]
  if (!data) throw new Error(`Missing Pages Router payload in ${file}`)
  const sources = [
    ...new Set(
      [...html.matchAll(/<script\b[^>]*\bsrc="([^"?]+\.js)(?:\?[^"]*)?"/g)]
        .map((match) => match[1])
        .filter((src) => src.startsWith('/_next/'))
    )
  ]
  const js = sources.map((src) => sizes(read(src.replace('/_next/', ''))))
  routes.push({
    route,
    sourceRoute: config.srcRoute,
    revalidate: config.initialRevalidateSeconds,
    html: sizes(html),
    embeddedNextData: sizes(data),
    initialJavaScriptFiles: sources.length,
    initialJavaScript: js.reduce(
      (sum, size) => ({
        raw: sum.raw + size.raw,
        gzip: sum.gzip + size.gzip,
        brotli: sum.brotli + size.brotli
      }),
      { raw: 0, gzip: 0, brotli: 0 }
    )
  })
}
const report = {
  measuredAt: new Date().toISOString(),
  buildDirectory: directory,
  buildId: read('BUILD_ID').trim(),
  buildModifiedAt: fs.statSync(path.join(dist, 'BUILD_ID')).mtime.toISOString(),
  method:
    'Existing build; not rebuilt by this command. Bytes, not KB. HTML includes embedded data and CSS. JS sums each unique local script referenced by the initial HTML, compressed independently with Node defaults. Embedded data compression is diagnostic and cannot be subtracted from compressed HTML. Excludes later hydration chunks, prefetched scripts and third-party requests; not HTTP transfer or Web Vitals.',
  routes,
  fallbacks: Object.fromEntries(
    Object.entries(manifest.dynamicRoutes).map(([route, config]) => [
      route,
      {
        fallback: config.fallback,
        compute: config.compute
      }
    ])
  )
}
const json = JSON.stringify(report, null, 2) + '\n'
if (destination) fs.writeFileSync(path.resolve(destination), json)
process.stdout.write(json)
