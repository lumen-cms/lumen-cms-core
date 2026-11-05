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
const fixture = resolve(root, '.website-tests/facebook-worker')
await mkdir(resolve(fixture,'src/pages'),{recursive:true})
await mkdir(resolve(fixture,'node_modules'),{recursive:true})
for(const name of ['astro','lumen-cms-shared']) await symlink(resolve(root,'packages/lumen-cms-astro/node_modules',name),resolve(fixture,'node_modules',name),'dir').catch(e=>{if(e.code!=='EEXIST')throw e})
await writeFile(resolve(fixture,'package.json'),JSON.stringify({type:'module'}))
await writeFile(resolve(fixture,'astro.config.mjs'),`import partytown from ${JSON.stringify(requireAstro.resolve('@astrojs/partytown'))};import {trackingWorkerConfig} from ${JSON.stringify(resolve(root,'packages/lumen-cms-astro/build/tracking-workers.mjs'))};export default {integrations:[partytown({config:trackingWorkerConfig()})],vite:{ssr:{noExternal:['lumen-cms-shared']}}};`)
await writeFile(resolve(fixture,'src/pages/index.astro'),`---
import FacebookWorker from ${JSON.stringify(resolve(root,'packages/lumen-cms-astro/src/components/FacebookWorker.astro'))}
import {trackingScripts} from ${JSON.stringify(resolve(root,'packages/lumen-cms-shared/src/tracking.ts'))}
const {scripts}=trackingScripts({setup_facebook_pixel:'123,456'},{production:true,deferLibraries:true})
scripts.find(s=>s.id==='fbq-library').url='/facebook-test.js'
---
<html><head><FacebookWorker scripts={scripts}/></head><body><script is:inline>fbq('track','Lead',{content_name:'early'},{eventID:'early-lead'});</script>Facebook fixture</body></html>`)
process.chdir(fixture);await build({root:fixture,logLevel:'error'})
const events=[]
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/events'){let body='';for await(const c of req)body+=c;events.push(JSON.parse(body));res.writeHead(204).end();return}if(url.pathname==='/facebook-test.js'){res.setHeader('Content-Type','text/javascript');res.end(`const consume=args=>fetch('/events',{method:'POST',body:JSON.stringify(Array.from(args))});window.fbq.callMethod=function(){consume(arguments)};window.fbq.queue.splice(0).forEach(consume);`);return}const file=resolve(fixture,'dist','.'+(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(resolve(fixture,'dist')+'/')){res.writeHead(403).end();return}res.setHeader('Content-Type',extname(file)==='.js'?'text/javascript':'text/html');res.end(await readFile(file))}catch{res.writeHead(404).end()}})
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'chrome'})
try{for(const fallback of [false,true,'registration-error']){events.length=0;const context=await browser.newContext();if(fallback===true)await context.addInitScript(()=>Object.defineProperty(navigator,'serviceWorker',{value:undefined}));if(fallback==='registration-error')await context.addInitScript(()=>Object.defineProperty(navigator,'serviceWorker',{value:{register:()=>Promise.reject(new Error('fixture registration denied'))}}));const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/`);await eventually(()=>events.some(e=>e[0]==='init'));await page.evaluate(()=>{fbq('track','InitiateCheckout',{value:12.34,currency:'EUR',content_ids:['course']});fbq('track','Purchase',{value:12.34,currency:'EUR',content_ids:['course']},{eventID:'order'});fbq('trackCustom','AuditCustom',{test_parameter:'retained'})});await eventually(()=>events.some(e=>e[1]==='AuditCustom'));assert.equal(events.filter(e=>e[0]==='init').length,2);assert.equal(events.filter(e=>e[1]==='PageView').length,1);assert.equal(events.filter(e=>e[1]==='Lead').length,1);assert.deepEqual(events.find(e=>e[1]==='Lead'),['track','Lead',{content_name:'early'},{eventID:'early-lead'}]);assert.deepEqual(events.find(e=>e[1]==='Purchase'),['track','Purchase',{value:12.34,currency:'EUR',content_ids:['course']},{eventID:'order'}]);assert.deepEqual(errors,[]);console.log(`${fallback===true?'unsupported fallback':fallback||'worker'}: two pixels, one page view, early lead and conversions passed`);await context.close()}}finally{await browser.close();await new Promise(r=>server.close(r))}
async function eventually(check){for(let i=0;i<150;i++){if(check())return;await new Promise(r=>setTimeout(r,100))}assert.ok(check(),JSON.stringify(events))}
