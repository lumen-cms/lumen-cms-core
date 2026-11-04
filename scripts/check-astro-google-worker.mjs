import assert from 'node:assert/strict'
import { mkdir, writeFile, readFile, symlink } from 'node:fs/promises'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { resolve, extname } from 'node:path'
import { createRequire } from 'node:module'
import { chromium } from 'playwright'

const root = fileURLToPath(new URL('../', import.meta.url))
const requireAstro = createRequire(resolve(root, 'packages/lumen-cms-astro/package.json'))
const { build } = await import(requireAstro.resolve('astro'))
const fixture = resolve(root, '.website-tests/google-worker')
await mkdir(resolve(fixture, 'src/pages'), { recursive: true })
await mkdir(resolve(fixture, 'node_modules'), { recursive: true })
for (const name of ['astro','lumen-cms-shared']) await symlink(resolve(root, 'packages/lumen-cms-astro/node_modules',name), resolve(fixture, 'node_modules',name), 'dir').catch(error => { if (error.code !== 'EEXIST') throw error })
await writeFile(resolve(fixture, 'package.json'), JSON.stringify({ type: 'module' }))
await writeFile(resolve(fixture, 'astro.config.mjs'), `import partytown from ${JSON.stringify(requireAstro.resolve('@astrojs/partytown'))}; export default { integrations: [partytown({config:{forward:['gtag','dataLayer.push'],resolveUrl(url,location){if(url.hostname.endsWith('.google-analytics.com'))return new URL('/collect'+url.search,location);return url}}})], vite: {ssr:{noExternal:['lumen-cms-shared']}} };`)
await writeFile(resolve(fixture, 'src/pages/index.astro'), `---
import GoogleAnalyticsWorker from ${JSON.stringify(resolve(root, 'packages/lumen-cms-astro/src/components/GoogleAnalyticsWorker.astro'))}
import { trackingScripts } from ${JSON.stringify(resolve(root, 'packages/lumen-cms-shared/src/tracking.ts'))}
const { scripts } = trackingScripts({setup_google_analytics:'G-WORKERTEST'}, {production:true,deferLibraries:true})
scripts.find(s => s.id === 'gtag-library').url = '/google-test.js'
---
<html><head><GoogleAnalyticsWorker scripts={scripts}/></head><body><script is:inline>gtag('event','generate_lead',{value:10,currency:'EUR'});</script>Tracking fixture</body></html>`)
process.chdir(fixture)
await build({ root: fixture, logLevel: 'error' })
const events = []
const hits = []
const sdk = `window.sdkThreadMarker = true;
const consume = args => fetch('/events', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Array.from(args))});
const pending = window.dataLayer.slice(); window.dataLayer.push = function(args) { consume(args); return Array.prototype.push.call(this,args); }; pending.forEach(consume);`
const server = createServer(async (req,res) => {
 try {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/favicon.ico') { res.writeHead(204).end(); return }
  if (url.pathname === '/real' || url.pathname === '/real-main') {
   let html=(await readFile(resolve(fixture,'dist/index.html'),'utf8')).replace('/google-test.js','https://www.googletagmanager.com/gtag/js?id=G-E5T41KXD1F').replaceAll('G-WORKERTEST','G-E5T41KXD1F')
   if(url.pathname==='/real-main') html=html.replace(/<script>([\s\S]*?)<\/script>/g,(tag,body)=>body.includes('Partytown 1.')?'':tag).replaceAll('type="text/partytown"','')
   res.setHeader('Content-Type','text/html');res.end(html);return
  }
  if (url.pathname === '/collect') { let body=''; for await (const chunk of req) body+=chunk; for (const line of body.split('\n')) hits.push(new URLSearchParams(url.search.slice(1)+'&'+line));res.writeHead(204,{'access-control-allow-origin':'*'}).end();return }
  if (url.pathname === '/events') { let body=''; for await (const chunk of req) body+=chunk; events.push(JSON.parse(body)); res.writeHead(204).end(); return }
  if (url.pathname === '/google-test.js') { res.setHeader('Content-Type','text/javascript');res.end(sdk);return }
  const file = resolve(fixture, 'dist', '.' + (url.pathname === '/' ? '/index.html' : url.pathname))
  if (!file.startsWith(resolve(fixture,'dist') + '/')) {res.writeHead(403).end();return}
  res.setHeader('Content-Type', extname(file) === '.js' ? 'text/javascript' : 'text/html')
  res.end(await readFile(file))
 } catch {res.writeHead(404).end()}
})
await new Promise(r => server.listen(0,'127.0.0.1',r))
const browser = await chromium.launch({headless:true,channel:'chrome'})
try {
 for (const fallback of [false,true]) {
  events.length=0
  const context=await browser.newContext()
  // Disable the browser feature in this fixture to exercise Partytown's documented fallback.
  if(fallback) await context.addInitScript(() => { Object.defineProperty(navigator,'serviceWorker',{value:undefined}); })
  const page=await context.newPage()
  const workers=[];page.on('worker',worker=>workers.push(worker.url()))
  const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error(e.message)});page.on('console',m=>{if(m.type()==='error')console.error(m.text())})
  await page.goto(`http://127.0.0.1:${server.address().port}/`)
  await assertEventually(()=>events.some(e=>e[0]==='config'))
  await page.evaluate(()=>gtag('event','purchase',{transaction_id:'test-order',value:12.34,currency:'EUR',items:[{item_id:'course',quantity:1}]}))
  await page.evaluate(()=>gtag('event','custom_conversion',{custom_parameter:'retained'}))
  await assertEventually(()=>events.filter(e=>e[0]==='event').length===3)
  assert.equal(events.filter(e=>e[0]==='config').length,1)
  assert.deepEqual(events.find(e=>e[1]==='generate_lead'),['event','generate_lead',{value:10,currency:'EUR'}])
  assert.deepEqual(events.find(e=>e[1]==='purchase'),['event','purchase',{transaction_id:'test-order',value:12.34,currency:'EUR',items:[{item_id:'course',quantity:1}]}])
  assert.deepEqual(events.find(e=>e[1]==='custom_conversion'),['event','custom_conversion',{custom_parameter:'retained'}])
  assert.equal(workers.length > 0,!fallback,'Worker must start unless falling back')
  if (!fallback) assert.equal(await page.locator('#gtag-library').getAttribute('type'),'text/partytown-x')
  assert.deepEqual(errors,[])
  console.log(`${fallback?'fallback':'worker'}: early lead, purchase, custom conversion and single config passed`)
  await context.close()
 }
 if (process.env.TEST_REAL_GOOGLE === '1') for(const mode of ['real-main','real']) {
  const context=await browser.newContext()
  hits.length=0
  await context.route(/https:\/\/[^/]*google-analytics\.com\//, async route => {
   const request=route.request(); const url=new URL(request.url())
   const body=request.postData() || ''
   for(const line of (body || '').split('\n')) hits.push(new URLSearchParams(url.search.slice(1)+'&'+line))
   await route.fulfill({status:204,headers:{'access-control-allow-origin':'*'}})
  })

  const page=await context.newPage()
  page.on('pageerror',e=>console.error(e.message));page.on('console',m=>{if(m.type()==='error')console.error(m.text())});
  await page.goto(`http://127.0.0.1:${server.address().port}/${mode}`)

  await assertEventually(()=>hits.some(h=>h.get('en')==='page_view')).catch(async error => { console.log('SDK requests collected',hits.map(h=>Object.fromEntries(h))); throw error })
  await page.evaluate(()=>{gtag('event','purchase',{transaction_id:'worker-audit',value:12.34,currency:'EUR'});gtag('event','custom_conversion',{custom_parameter:'retained'})})
  await assertEventually(()=>hits.some(h=>h.get('en')==='purchase') && hits.some(h=>h.get('en')==='custom_conversion'))
  assert.equal(hits.filter(h=>h.get('en')==='page_view').length,1)
  assert.ok(hits.some(h=>h.get('en')==='generate_lead'))
  const purchase=hits.find(h=>h.get('en')==='purchase')
  assert.equal(purchase.get('ep.transaction_id'),'worker-audit')
  assert.equal(purchase.get('epn.value'),'12.34')
  assert.equal(purchase.get('cu'),'EUR')
  assert.equal(hits.find(h=>h.get('en')==='custom_conversion').get('ep.custom_parameter'),'retained')
  console.log(`${mode} Google SDK: page_view, early lead, purchase value/currency/transaction ID and custom parameters verified; collection intercepted`)
  await context.close()
 }
} finally {await browser.close(); await new Promise(r=>server.close(r))}
async function assertEventually(check) {for(let i=0;i<450;i++){if(check())return;await new Promise(r=>setTimeout(r,100))}assert.ok(check(),JSON.stringify(events))}
