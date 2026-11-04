const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { spawn } = require('node:child_process')
const { chromium } = require('playwright')
async function main() {
 const root = path.resolve(__dirname, '..'), pkg = path.join(root, 'packages/lumen-cms-astro')
 const temp = await fs.mkdtemp(path.join(pkg, '.third-party-audit-')), out = path.join(temp, 'dist')
 let server, browser
 try {
  const config = path.join(temp, 'astro.config.mjs')
  await fs.writeFile(config, `import base from ${JSON.stringify(new URL(`file://${path.join(pkg, 'astro.config.mjs')}`).href)}; export default {...base,root:${JSON.stringify(pkg)},outDir:${JSON.stringify(out)}}`)
  const child = spawn('pnpm', ['--filter', 'lumen-cms-astro', 'build', '--config', path.relative(pkg, config)], { cwd: root, env: { ...process.env, LUMEN_SITE: '', LUMEN_THIRD_PARTY_AUDIT: '1', ASTRO_TELEMETRY_DISABLED: '1' }, stdio: ['ignore','pipe','pipe'] })
  let log = ''; child.stdout.on('data', data => log += data); child.stderr.on('data', data => log += data)
  assert.equal(await new Promise((resolve,reject) => { child.on('error',reject); child.on('exit',resolve) }), 0, log)
  server = http.createServer(async (req,res) => {
   try {
    const name = new URL(req.url, 'http://localhost').pathname
    const file = path.join(out, name === '/' ? 'third-party-audit/loading/index.html' : name)
    res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html')
    res.end(await fs.readFile(file))
   } catch { res.writeHead(404).end() }
  })
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage(), requests = [], errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
   const decode = HTMLImageElement.prototype.decode
   HTMLImageElement.prototype.decode = function () {
    if (this.getAttribute('fetchpriority') !== 'high') return decode.call(this)
    return new Promise(resolve => { window.releaseHeroDecode = resolve })
   }
  })
  let release
  const gate = new Promise(resolve => { release = resolve })
  await page.route('**/*', async route => {
   const url = new URL(route.request().url())
   if (url.pathname === '/audit-gate.png') { await gate; return route.fulfill({ status: 204 }) }
   if (url.origin === origin) return route.continue()
   if (/facebook|googletagmanager|hs-scripts/.test(url.href)) assert.equal(await page.evaluate(() => window.heroPaintOpportunity),true,'Vendors must follow a hero paint opportunity')
   requests.push(url.href)
   let body = ''
   if (url.hostname.endsWith('hs-scripts.com')) body = `
    window.auditChatLoads = 0;
    const events = {};
    window.HubSpotConversations = {on:(name,fn)=>events[name]=fn,off:name=>delete events[name],widget:{status:()=>({loaded:false}),open(){},remove(){},load(options){window.auditChatLoads++;window.auditChatOptions=options;events.widgetLoaded?.()}}};
    if(window.hsConversationsSettings?.loadImmediately !== false) window.HubSpotConversations.widget.load({});
    (window.hsConversationsOnReady||[]).forEach(fn=>fn());`
   if (url.hostname === 'js.hsforms.net') body = `window.hbspt={forms:{create(options){document.querySelector(options.target).textContent='Form loaded';window.auditForm=options;}}}`
   if (url.hostname === 'static.hsappstatic.net') body = `window.auditMeetings=[...document.querySelectorAll('.meetings-iframe-container')].map(el=>el.dataset.src);`
   return route.fulfill({ contentType: 'text/javascript', body })
  })
  await page.goto(origin, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => typeof window.gtag === 'function' && typeof window.fbq === 'function')
  assert.equal(requests.some(url => /facebook|googletagmanager|hs-scripts/.test(url)),false,'Vendor libraries must wait for load/idle')
  await page.evaluate(() => { window.gtag('event','early-conversion'); window.fbq('track','Lead') })
  release()
  await page.waitForFunction(() => typeof window.releaseHeroDecode === 'function')
  assert.equal(requests.some(url => /facebook|googletagmanager|hs-scripts/.test(url)),false,'Load alone must not release vendors before priority image decoding')
  await page.evaluate(() => {
   window.releaseHeroDecode()
   requestAnimationFrame(() => requestAnimationFrame(() => { window.heroPaintOpportunity = true }))
  })
  await page.waitForFunction(() => !!window.HubSpotConversations)
  assert.equal(await page.evaluate(() => window.auditChatLoads),0)
  assert.deepEqual(await page.evaluate(() => [...window.dataLayer.at(-1)]), ['event','early-conversion'])
  await page.evaluate(() => document.dispatchEvent(new Event('astro:page-load')))
  assert.equal(requests.filter(url => /gtag\/js/.test(url)).length,1,'Repeated initialization must not duplicate GA')
  assert.equal(requests.some(url => /hsforms|hsappstatic/.test(url)),false)
  const button = page.getByRole('button', { name:'Open chat', exact:true })
  await button.focus(); await button.press('Enter')
  await page.waitForFunction(() => window.auditChatLoads === 1)
  assert.deepEqual(await page.evaluate(() => window.auditChatOptions), { widgetOpen: true })
  await page.locator('#form_audit').scrollIntoViewIfNeeded()
  await page.waitForFunction(() => !!window.auditForm)
  assert.equal(requests.some(url => /hsappstatic/.test(url)),false,'Offscreen meetings must not activate with forms')
  await page.locator('#meeting_audit').scrollIntoViewIfNeeded()
  await page.waitForFunction(() => !!window.auditMeetings)
  assert.deepEqual(await page.evaluate(() => window.auditMeetings), ['https://app.hubspot.com/meetings/team/person?embed-true=true'])
  assert.equal(requests.filter(url => /hsforms/.test(url)).length,1)
  assert.deepEqual(errors,[])
  console.log('Third-party audit passed: deferred libraries, early event queues, click-only chat, viewport forms and meetings.')
 } finally {
  await browser?.close()
  if (server) await new Promise(resolve => server.close(resolve))
  await fs.rm(temp,{recursive:true,force:true})
 }
}
main().catch(error => { console.error(error);process.exitCode=1 })
