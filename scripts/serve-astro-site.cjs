// Serve an already-built sample without adding directory redirects. Each site
// has its own root/port, allowing comparisons while another site is built.
const http = require('node:http')
const { Readable } = require('node:stream')
const fs = require('node:fs/promises')
const path = require('node:path')
const [site, portValue] = process.argv.slice(2)
const port = Number(portValue)
if (!['bali', 'planet', 'upskill', 'fixture'].includes(site) || !Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Usage: node scripts/serve-astro-site.cjs <bali|planet|upskill|fixture> <port>')
const root = process.env.LUMEN_STATIC_DIR ? path.resolve(process.env.LUMEN_STATIC_DIR) : path.resolve(__dirname, '../packages/lumen-cms-astro/dist', site)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon' }
http.createServer(async (request, response) => {
 try {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return }
  const incoming = new URL(request.url, 'http://localhost')
  const pathname = decodeURIComponent(incoming.pathname)
  if (pathname === '/api/story-list' || pathname === '/_image') {
   if (!process.env.LUMEN_SERVER_ORIGIN) { response.writeHead(503).end('Set LUMEN_SERVER_ORIGIN to the companion Astro server'); return }
   const upstream = await fetch(new URL(incoming.pathname + incoming.search, process.env.LUMEN_SERVER_ORIGIN), { method: request.method, headers: { Accept: request.headers.accept || '*/*' } })
   response.writeHead(upstream.status, Object.fromEntries([...upstream.headers].filter(([name]) => !['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(name))))
   if (upstream.body && request.method !== 'HEAD') Readable.fromWeb(upstream.body).pipe(response)
   else response.end()
   return
  }
  let file = path.resolve(root, '.' + pathname)
  if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return }
  if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html')
  const body = await fs.readFile(file)
  response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
  response.end(request.method === 'HEAD' ? undefined : body)
 } catch {
  try {
   const locale = new URL(request.url, 'http://localhost').pathname.split('/')[1]
   const localized = /^[a-z]{2}(?:-[A-Za-z]{2})?$/.test(locale) ? path.join(root, locale, '404', 'index.html') : undefined
   const body = await (localized ? fs.readFile(localized).catch(() => fs.readFile(path.join(root, '404.html'))) : fs.readFile(path.join(root, '404.html')))
   response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
   response.end(request.method === 'HEAD' ? undefined : body)
  } catch { response.writeHead(404).end('Not found') }
 }
}).listen(port, '127.0.0.1', () => console.log(`Serving ${site} at http://127.0.0.1:${port}`))
