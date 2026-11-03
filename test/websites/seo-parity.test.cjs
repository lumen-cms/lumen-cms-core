const { test } = require('node:test')
const assert = require('node:assert/strict')
const { footprint, sitemapFootprint } = require('../../scripts/check-seo-parity.cjs')
test('parity comparison preserves URL spelling, duplicate tags, image order and schema values', () => {
 const html = '<html lang="en"><title>Page</title><meta name="robots" content="index,follow"><link rel="canonical" href="https://example.com/"><meta property="og:image" content="first"><meta property="og:image" content="second"><script type="application/ld+json">{"@type":"Product","name":"Course"}</script></html>'
 for (const changed of [html.replace('index,follow','noindex,nofollow'), html.replace('example.com/','example.com'), html.replace('content="first"','content="second"'), html.replace('Course','Other'), html.replace('<title>','<meta name="robots" content="index,follow"><title>')]) assert.notDeepEqual(footprint(html), footprint(changed))
 assert.deepEqual(footprint(html), footprint(html.replace('{"@type":"Product","name":"Course"}', '{"name":"Course","@type":"Product"}').replace('<title>', '<meta name="next-head-count" content="5"><title>')))
})
test('sitemap comparison ignores entry order but preserves trailing slashes and lastmod', () => {
 const a='<url><loc>https://example.com/de/</loc><lastmod>2026-01-01</lastmod></url>'
 const b='<url><loc>https://example.com/page</loc></url>'
 assert.deepEqual(sitemapFootprint(`<urlset>${a}${b}</urlset>`),sitemapFootprint(`<urlset>${b}${a}</urlset>`))
 assert.notDeepEqual(sitemapFootprint(`<urlset>${a}</urlset>`),sitemapFootprint(`<urlset>${a.replace('/de/','/de')}</urlset>`))
 assert.throws(()=>sitemapFootprint('<html>Error</html>'))
})
