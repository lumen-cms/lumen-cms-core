const fs = require('node:fs')
const path = require('node:path')

/** Carry explicit, locale-independent legacy paths into the static Astro site.
 * Next-specific parameter patterns require a hosting rule, not a static page. */
function consumerRedirects(consumer) {
 const file = path.join(consumer, 'redirects.js')
 if (!fs.existsSync(file)) return {}
 const { urls = [] } = require(file)
 return Object.fromEntries(urls.filter(rule =>
  rule.locale === false && typeof rule.source === 'string' &&
  rule.source.startsWith('/') && !rule.source.startsWith('//') &&
  !/[:*?()[\]{}]/.test(rule.source) &&
  typeof rule.destination === 'string' && rule.destination.startsWith('/') && !rule.destination.startsWith('//')
 ).map(rule => [rule.source, { destination: rule.destination, status: rule.permanent ? 308 : 307 }]))
}
module.exports = { consumerRedirects }
