const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { spawn } = require('node:child_process')
const { pathToFileURL } = require('node:url')
const sharp = require('sharp')
const { chromium } = require('playwright')
const { load } = require('cheerio')
async function listen(server) { await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});return server.address().port }
async function availablePort() { const server=http.createServer();const port=await listen(server);await new Promise(resolve=>server.close(resolve));return port }
async function main() {
 const root=path.resolve(__dirname,'..'), pkg=path.join(root,'packages/lumen-cms-astro')
 const temp=await fs.mkdtemp(path.join(pkg,'.story-image-audit-'))
 const children=[];let browser, upstream
 const requests=[];let imageRequests=0
 const png=await sharp({create:{width:640,height:320,channels:3,background:'#20a050'}}).png().toBuffer()
 const item=(page,image)=>({id:page,uuid:`story-${page}`,name:`Story ${page}`,slug:`story-${page}`,full_slug:`story-${page}`,content:{component:'page',_uid:`story-${page}`,preview_title:`Story ${page}`,preview_image:image}})
 const list={component:'list_stories',_uid:'image-list',enable_search:true,pagination:[{component:'pagination',_uid:'pagination',items_per_page:'1',position:'bottom'}],layout:[{component:'lists',_uid:'layout',image_size:'large'}]}
 const content={component:'page',_uid:'source-page',body:[list],property:['disable_promotion']}
 const settings={component:'global',_uid:'settings',website_title:'Pagination image audit'}
 const initial={locale:'en',defaultLocale:'en',locales:['en','de'],slug:'/pagination',settings,page:{...content,body:[{...list,list_stories_data:{total:2,perPage:1,data:{stories:[item(1)],cv:1}}}]}}
 try {
  upstream=http.createServer((req,res)=>{
   const url=new URL(req.url,'http://localhost');requests.push(url)
   if(url.pathname==='/new.png'){imageRequests++;res.setHeader('Content-Type','image/png');res.end(png);return}
   res.setHeader('Content-Type','application/json')
   if(url.pathname.endsWith('/spaces/me')){res.end(JSON.stringify({space:{id:1,version:1}}));return}
   const story=url.pathname.endsWith('/stories/settings')?{id:10,uuid:'settings',content:settings}:url.pathname.endsWith('/stories/pagination')?{id:11,uuid:'source',content}:undefined
   if(story){res.end(JSON.stringify({story,cv:1,rels:[],links:[]}));return}
   if(url.pathname.endsWith('/stories')){
    const page=Number(url.searchParams.get('page')||1), empty=url.searchParams.get('search_term')==='empty'
    res.setHeader('total',empty?'0':'2');res.setHeader('per-page','1')
    res.end(JSON.stringify({stories:empty?[]:[item(page,page===2?`http://127.0.0.1:${upstream.address().port}/new.png`:undefined)],cv:1,rels:[],links:[]}));return
   }
   res.writeHead(404).end(JSON.stringify({error:'not-found'}))
  })
  const upstreamPort=await listen(upstream), origin=`http://127.0.0.1:${upstreamPort}`
  const intercept=path.join(temp,'upstream.mjs')
  // Replace only the external CMS transport; the production route, page loader,
  // component renderer, pagination client and image optimizer are all real.
  await fs.writeFile(intercept,`const original=globalThis.fetch;globalThis.fetch=(input,init)=>{const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url);return original(url.hostname==='api.storyblok.com'?new URL(url.pathname+url.search,process.env.LUMEN_FIXTURE_UPSTREAM):input,init)}`)
  const publicDir=path.join(temp,'public'), staticSrc=path.join(temp,'src'), staticOut=path.join(temp,'static'), serverOut=path.join(temp,'server')
  await fs.mkdir(publicDir);await fs.mkdir(path.join(staticSrc,'pages'),{recursive:true})
  const documentPath=pathToFileURL(path.join(pkg,'src/layouts/SiteLayout.astro')).href
  await fs.writeFile(path.join(staticSrc,'pages/pagination.astro'),`---\nimport SiteLayout from ${JSON.stringify(documentPath)}\nconst page=${JSON.stringify(initial)}\n---\n<SiteLayout page={page} />`)
  const config=path.join(temp,'astro.config.mjs')
  const env={...process.env,NODE_ENV:'production',ASTRO_TELEMETRY_DISABLED:'1',LUMEN_SITE:'',LUMEN_LOCALES:'en,de',LUMEN_PUBLIC_DIR:publicDir,LUMEN_FIXTURE_UPSTREAM:origin,PUBLIC_STORYBLOK_TOKEN:'public-fixture-token',STORYBLOK_PREVIEW_TOKEN:'unused-preview-token',NODE_OPTIONS:`--import=${pathToFileURL(intercept).href}`}
  async function build(base,srcDir,outDir){
   await fs.writeFile(config,`import base from ${JSON.stringify(pathToFileURL(path.join(pkg,base)).href)};export default {...base,root:${JSON.stringify(pkg)},srcDir:${JSON.stringify(srcDir)},outDir:${JSON.stringify(outDir)},publicDir:${JSON.stringify(publicDir)},image:{...base.image,remotePatterns:[...base.image.remotePatterns,{protocol:'http',hostname:'127.0.0.1'}]}}`)
   const child=spawn('pnpm',['--filter','lumen-cms-astro','build','--config',path.relative(pkg,config)],{cwd:root,env,stdio:['ignore','pipe','pipe']});let log='';child.stdout.on('data',c=>log+=c);child.stderr.on('data',c=>log+=c)
   assert.equal(await new Promise((resolve,reject)=>{child.on('exit',resolve);child.on('error',reject)}),0,log)
  }
  await build('astro.config.mjs',staticSrc,staticOut)
  const initialHtml=await fs.readFile(path.join(staticOut,'pagination/index.html'),'utf8'), $=load(initialHtml)
  assert.equal(JSON.parse($('[data-story-list]').attr('data-story-config')).renderEndpoint,'/api/story-list')
  assert.equal($('[data-story-template]').length,0)
  assert.equal(initialHtml.includes('/new.png'),false)
  await build('astro.server.config.mjs',path.join(pkg,'src-server'),serverOut)
  const serverPort=await availablePort(), frontPort=await availablePort()
  function start(args,extra={}){const child=spawn(process.execPath,args,{cwd:pkg,env:{...env,...extra},stdio:['ignore','pipe','pipe']});children.push(child);child.log='';child.stdout.on('data',c=>child.log+=c);child.stderr.on('data',c=>child.log+=c);return child}
  const server=start([path.join(serverOut,'server/entry.mjs')],{HOST:'127.0.0.1',PORT:String(serverPort)})
  // Use the actual static serving/proxy script, with an isolated output root.
  const frontend=start([path.join(root,'scripts/serve-astro-site.cjs'),'fixture',String(frontPort)],{LUMEN_STATIC_DIR:staticOut,LUMEN_SERVER_ORIGIN:`http://127.0.0.1:${serverPort}`})
  async function ready(url,child){for(let i=0;i<100;i++){if(child.exitCode!==null)throw new Error(child.log);try{await fetch(url);return}catch{}await new Promise(r=>setTimeout(r,100))}throw new Error(child.log)}
  await ready(`http://127.0.0.1:${serverPort}/api/story-list`,server);await ready(`http://127.0.0.1:${frontPort}/pagination`,frontend)
  browser=await chromium.launch({headless:true});const page=await browser.newPage();const cmsBrowserRequests=[]
  page.on('request',request=>{if(new URL(request.url()).hostname==='api.storyblok.com')cmsBrowserRequests.push(request.url())})
  const site=`http://127.0.0.1:${frontPort}`
  await page.goto(`${site}/pagination`)
  assert.match(await page.locator('[data-story-results]').innerText(),/Story 1/)
  assert.equal(imageRequests,0,'new image must not have been requested during either build or initial render')
  const resultResponse=page.waitForResponse(r=>r.url().includes('/api/story-list?')&&new URL(r.url()).searchParams.get('page')==='2')
  await page.getByRole('button',{name:'Go to page 2',exact:true}).click()
  const response=await resultResponse;assert.equal(response.status(),200,server.log)
  const payload=await response.json();assert.equal(payload.count,1);assert.match(payload.html,/_image\?/)
  await page.waitForFunction(()=>{const img=document.querySelector('[data-story-results] img');return img?.complete&&img.naturalWidth>0})
  assert.match(await page.locator('[data-story-results]').innerText(),/Story 2/)
  const image=await page.locator('[data-story-results] img').evaluate(img=>({src:img.src,current:img.currentSrc,srcset:img.srcset}))
  assert.equal(new URL(image.current).origin,site)
  assert.equal(new URL(image.current).pathname,'/_image')
  assert.match(image.srcset,/52w.*104w/)
  const downloaded=await fetch(image.current);assert.equal(downloaded.status,200)
  const metadata=await sharp(Buffer.from(await downloaded.arrayBuffer())).metadata()
  assert.equal(metadata.format,'heif');assert.equal(metadata.compression,'av1');assert.ok(metadata.width<=104&&metadata.height<=104)
  assert.ok(imageRequests>0);assert.deepEqual(cmsBrowserRequests,[])
  assert.ok(requests.filter(url=>url.pathname.includes('/cdn/')).every(url=>url.searchParams.get('version')!=='draft'))
  assert.equal((await fetch(`${site}/api/story-list?source=/pagination&list=unknown&page=2`)).status,404)
  assert.equal((await fetch(`${site}/api/story-list?source=//evil.test&list=image-list&page=2`)).status,400)
  assert.equal((await fetch(`${site}/api/story-list?source=/pagination&list=image-list&page=0`)).status,400)
  // Same server path handles empty search, then history returns to the optimized page.
  await page.evaluate(()=>{const url=new URL(location.href);url.searchParams.set('search__text','empty');history.pushState({},'',url);document.dispatchEvent(new Event('lumen:search-change'))})
  await page.waitForFunction(()=>!document.querySelector('[data-story-empty]').hidden)
  await page.goBack();await page.waitForFunction(()=>document.querySelector('[data-story-results]')?.textContent?.includes('Story 2'))
  console.log('Published story images passed: static page → production pagination endpoint → rendered responsive markup → same-origin AVIF optimizer; empty/search/history and invalid requests verified.')
 } finally {
  await browser?.close()
  for(const child of children.reverse())if(child.exitCode===null){const done=new Promise(resolve=>child.once('exit',resolve));child.kill();await done}
  if(upstream)await new Promise(resolve=>upstream.close(resolve))
  await fs.rm(temp,{recursive:true,force:true})
 }
}
main().catch(error=>{console.error(error);process.exitCode=1})
