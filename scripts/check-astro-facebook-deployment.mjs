import { chromium } from 'playwright'

// Real page visits only: never generate synthetic conversions on deployed sites.
const sites = process.argv.slice(2)
if (!sites.length) throw new Error('Pass deployed website URLs')
const browser = await chromium.launch({headless:true,channel:'chrome'})
try {
 for (const site of sites) {
  const context = await browser.newContext()
  const page = await context.newPage()
  const proxy = [], errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('response', response => {
   const url = new URL(response.url())
   if (url.pathname.startsWith('/~facebook/')) proxy.push({path:url.pathname,status:response.status()})
  })
  try {
   await page.goto(site,{waitUntil:'load',timeout:60000})
   const expected = await page.locator('#fbq-init').count() > 0
   await page.waitForTimeout(expected?12000:2000)
   const scripts = await page.locator('#fbq-init,#fbq-library').evaluateAll(nodes=>nodes.map(node=>({id:node.id,type:node.type})))
   const state = await page.evaluate(()=>({fbq:typeof window.fbq,facebookCookie:document.cookie.split(';').some(c=>c.trim().startsWith('_fbp=')),hubspotMain:[...document.scripts].filter(s=>/hs-scripts\.com/.test(s.src)).map(s=>({src:s.src,type:s.type})),chatwootMain:[...document.scripts].filter(s=>s.src.includes('/packs/js/sdk.js')).map(s=>({src:s.src,type:s.type}))}))
   const passed = expected ? scripts.length===2 && scripts.every(s=>s.type==='text/partytown-x') && state.fbq==='function' && proxy.some(p=>p.path.endsWith('/fbevents.js')&&p.status===200) && proxy.some(p=>p.path.includes('/signals/config/')&&p.status===200) && errors.length===0 : scripts.length===0 && proxy.length===0 && errors.length===0
   console.log(JSON.stringify({site,expected,scripts,proxy,state,errors,passed}))
   if(!passed)process.exitCode=1
  } catch(error) { console.log(JSON.stringify({site,passed:false,error:error.message}));process.exitCode=1 }
  finally { await context.close() }
 }
} finally { await browser.close() }
