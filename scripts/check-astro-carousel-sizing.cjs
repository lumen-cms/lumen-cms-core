const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { spawnSync } = require('node:child_process')
const { chromium } = require('playwright')
const sharp = require('sharp')
async function main() {
 const pkg = path.resolve(__dirname, '../packages/lumen-cms-astro')
 const temp = await fs.mkdtemp(path.join(pkg, '.carousel-sizing-'))
 let server, browser
 try {
  const out = path.join(temp, 'dist')
  const config = path.join(temp, 'config.mjs')
  await fs.writeFile(config, `import base from ${JSON.stringify(new URL('file://' + path.join(pkg, 'astro.config.mjs')).href)};export default {...base,root:${JSON.stringify(pkg)},outDir:${JSON.stringify(out)}}`)
  const build = spawnSync('pnpm', ['--filter','lumen-cms-astro','build','--config',path.relative(pkg,config)], {cwd:path.resolve(__dirname,'..'), env:{...process.env,LUMEN_SITE:'',LUMEN_CAROUSEL_SIZE_AUDIT:'1',ASTRO_TELEMETRY_DISABLED:'1'},encoding:'utf8'})
  assert.equal(build.status, 0, build.stdout + build.stderr)
  server = http.createServer(async(req,res)=>{try{let file=path.join(out,new URL(req.url,'http://localhost').pathname);if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(await fs.readFile(file))}catch{res.writeHead(404).end()}})
  await new Promise(r=>server.listen(0,'127.0.0.1',r))
  browser=await chromium.launch()
  for(const width of [390,600,899,900,1280]) {
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1.75})
   let release
   const gate=new Promise(r=>release=r)
   await page.route('**/*',async route=>{
    const req=route.request()
    if(req.resourceType()==='script') {await gate;return route.continue()}
    if(req.url().startsWith('https://a.storyblok.com/')) {const w=Number(/\/m\/(\d+)x0/.exec(req.url())?.[1]||1000);return route.fulfill({contentType:'image/webp',body:await sharp({create:{width:w,height:w,channels:3,background:'#667788'}}).webp().toBuffer()})}
    if(!req.url().startsWith('http://127.0.0.1:'))return route.abort()
    return route.continue()
   })
   await page.goto(`http://127.0.0.1:${server.address().port}/carousel-sizing/images/`,{waitUntil:'commit'})
   const measure=id=>page.locator(`#${id} .swiper`).evaluate(el=>({width:el.clientWidth,slide:el.querySelector('.swiper-slide').getBoundingClientRect().width,gap:parseFloat(getComputedStyle(el.querySelector('.swiper-wrapper')).gap)||0}))
   await page.waitForFunction(()=>{const el=document.querySelector('#planet .swiper-wrapper');return el && getComputedStyle(el).gap==='24px'})
   const before={}
   for(const [id,counts,gaps] of [['planet',[3,5,9],[24,24,24]],['fractional',[1.5,2.5,3.5],[8,16,32]],['narrow',[2,3,4],[12,12,12]]]) {
    const index=width>=900?2:width>=600?1:0
    before[id]=await measure(id)
    assert(Math.abs(before[id].slide-(before[id].width-(counts[index]-1)*gaps[index])/counts[index])<1,`${id} initial width at ${width}`)
   }
   const logo=page.locator('#planet img').first()
   await logo.evaluate(img=>img.decode())
   const selected=await logo.evaluate(img=>({src:img.currentSrc,width:img.clientWidth}))
   const candidate=Number(/\/m\/(\d+)x0/.exec(selected.src)[1])
   assert(candidate <= Math.max(240,selected.width*1.75*1.6),`Oversized initial logo ${candidate} for ${selected.width} at ${width}`)
   assert.equal(await page.locator('#fade [data-lm-slide-layout],#coverflow [data-lm-slide-layout]').count(),0)
   release()
   for(const id of ['planet','fractional','narrow']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.waitForFunction(id=>document.querySelector(`#${id} .swiper`).swiper,id)
    const after=await measure(id)
    assert(Math.abs(after.slide-before[id].slide)<1,`${id} shifted on initialization at ${width}`)
    assert.equal(after.gap,0,'CSS gap must yield to Swiper margins')
   }
   await page.close()
  }
  console.log('Carousel sizes passed: 5 viewport widths, integer/fractional counts, narrow containers, effect exclusions, initial image requests and post-init parity.')
 } finally {await browser?.close();if(server)await new Promise(r=>server.close(r));await fs.rm(temp,{recursive:true,force:true})}
}
main().catch(e=>{console.error(e);process.exitCode=1})
