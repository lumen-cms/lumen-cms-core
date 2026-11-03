const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { spawn } = require('node:child_process')
const sharp = require('sharp')
const { load } = require('cheerio')
const { chromium } = require('playwright')
async function main() {
 const root = path.resolve(__dirname, '..'), pkg = path.join(root, 'packages/lumen-cms-astro')
 const temp = await fs.mkdtemp(path.join(pkg, '.image-audit-'))
 const png = await sharp({ create: { width: 240, height: 120, channels: 3, background: '#e05020' } }).png().toBuffer()
 const publicDir = path.join(temp, 'public')
 await fs.mkdir(publicDir)
 await fs.writeFile(path.join(publicDir, 'image-audit.png'), png)
 let browser, ssr
 const remote = http.createServer((req,res) => { res.setHeader('Content-Type', 'image/png'); res.end(png) })
 await new Promise(resolve => remote.listen(0, '127.0.0.1', resolve))
 const origin = `http://127.0.0.1:${remote.address().port}`
 const config = path.join(temp, 'astro.config.mjs'), out = path.join(temp, 'dist')
 const base = new URL(`file://${path.join(pkg, 'astro.config.mjs')}`).href
 await fs.writeFile(config, `import base from ${JSON.stringify(base)}; export default {...base, root:${JSON.stringify(pkg)}, srcDir:${JSON.stringify(path.join(pkg,'src'))}, publicDir:${JSON.stringify(publicDir)}, outDir:${JSON.stringify(out)}, image:{...base.image, remotePatterns:[...base.image.remotePatterns,{protocol:'http',hostname:'127.0.0.1'}]}}`)
 let web
 try {
  const child = spawn('pnpm', ['--filter','lumen-cms-astro','build','--config',path.relative(pkg, config)], { cwd:root, env:{...process.env, ASTRO_TELEMETRY_DISABLED:'1', LUMEN_IMAGE_AUDIT_ORIGIN:origin, LUMEN_PUBLIC_DIR:publicDir}, stdio:['ignore','pipe','pipe'] })
  let output=''; child.stdout.on('data',c=>output+=c); child.stderr.on('data',c=>output+=c)
  const code = await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve)})
  assert.equal(code,0,output)
  const html=await fs.readFile(path.join(out,'image-audit/images/index.html'),'utf8'), $=load(html)
  assert.equal($('#remote').attr('width'),'240'); assert.equal($('#remote').attr('height'),'120')
  assert.match($('#remote').attr('srcset'), /120w, .*240w/)
  assert.match($('#density').attr('srcset'), /1x, .*2x/)
  assert.equal($('#remote').parent().find('source').attr('type'), 'image/avif')
  assert.equal($('#fill').attr('width'),undefined); assert.equal($('#fill').attr('height'),undefined)
  assert.equal($('#priority').attr('loading'),'eager'); assert.match($('#priority').attr('src'), /a.storyblok.com.*quality\(75\)/)
  assert.equal($('link[rel=preload]').attr('imagesrcset'),$('#priority').attr('srcset'))
  assert.equal($('#svg').attr('src'),'https://a.storyblok.com/f/logo.svg?v=2'); assert.equal($('#svg').attr('srcset'),undefined)
  for (const [id,format,width,height] of [['remote','webp',240,120],['density','webp',120,60],['avif','avif',120,60],['crop','webp',60,60],['public','webp',120,60]]) {
   const src=$(`#${id}`).attr('src'); assert.match(src, id === 'public' ? /^\/image-audit_.*\.webp$/ : /^\/_astro\//)
   const metadata=await sharp(await fs.readFile(path.join(out,src))).metadata()
   if (format === 'avif') assert.equal(metadata.compression, 'av1')
   assert.deepEqual([metadata.format,metadata.width,metadata.height],[format === 'avif' ? 'heif' : format,width,height],id)
  }
  web=http.createServer(async(req,res)=>{try { const name=new URL(req.url,'http://localhost').pathname; const file=path.join(out,name==='/'?'image-audit/images/index.html':name);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':file.endsWith('.avif')?'image/avif':'image/webp');res.end(await fs.readFile(file)) }catch{res.writeHead(404).end()} })
  await new Promise(resolve=>web.listen(0,'127.0.0.1',resolve))
  browser=await chromium.launch({headless:true});const page=await browser.newPage()
  for (const width of [375,1280]) {
   await page.setViewportSize({width,height:800});await page.goto(`http://127.0.0.1:${web.address().port}/`)
   await page.waitForFunction(()=>!document.querySelector('#blur').hasAttribute('data-lm-image-blur'))
   const state=await page.locator('#fill').evaluate(img=>({width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height,fit:getComputedStyle(img).objectFit}))
   assert.deepEqual(state,{width:180,height:180,fit:'contain'})
   assert.equal(await page.locator('#remote').evaluate(img=>img.naturalWidth>0),true)
   assert.match(await page.locator('#remote').evaluate(img=>img.currentSrc), /\.avif$/)
  }
  // Exercise the same pipeline in an on-demand Node deployment.
  const serverBase = new URL(`file://${path.join(pkg, 'astro.server.config.mjs')}`).href
  const serverOut = path.join(temp, 'server-dist')
  await fs.writeFile(config, `import base from ${JSON.stringify(serverBase)}; export default {...base, root:${JSON.stringify(pkg)}, srcDir:${JSON.stringify(path.join(pkg,'src'))}, publicDir:${JSON.stringify(publicDir)}, outDir:${JSON.stringify(serverOut)}, image:{...base.image, remotePatterns:[...base.image.remotePatterns,{protocol:'http',hostname:'127.0.0.1'}]}}`)
  const buildServer = spawn('pnpm', ['--filter','lumen-cms-astro','build','--config',path.relative(pkg,config)], { cwd:root, env:{...process.env, ASTRO_TELEMETRY_DISABLED:'1', LUMEN_IMAGE_AUDIT_ORIGIN:origin, LUMEN_PUBLIC_DIR:publicDir}, stdio:['ignore','pipe','pipe'] })
  let serverBuildOutput='';buildServer.stdout.on('data',c=>serverBuildOutput+=c);buildServer.stderr.on('data',c=>serverBuildOutput+=c)
  assert.equal(await new Promise((resolve,reject)=>{buildServer.on('error',reject);buildServer.on('exit',resolve)}),0,serverBuildOutput)
  const reservation=http.createServer();await new Promise(resolve=>reservation.listen(0,'127.0.0.1',resolve));const port=reservation.address().port;await new Promise(resolve=>reservation.close(resolve))
  ssr=spawn(process.execPath,[path.join(serverOut,'server/entry.mjs')],{cwd:pkg,env:{...process.env,HOST:'127.0.0.1',PORT:String(port),LUMEN_IMAGE_AUDIT_ORIGIN:origin,LUMEN_PUBLIC_DIR:publicDir},stdio:['ignore','pipe','pipe']})
  let serverLog='';ssr.stdout.on('data',c=>serverLog+=c);ssr.stderr.on('data',c=>serverLog+=c)
  let response
  for(let i=0;i<100;i++){try{response=await fetch(`http://127.0.0.1:${port}/image-audit/images`);break}catch{await new Promise(resolve=>setTimeout(resolve,100))}}
  assert.equal(response?.status,200,serverLog)
  const serverHtml=load(await response.text())
  for(const id of ['remote','density','public','avif','crop']) {
   const src=serverHtml(`#${id}`).attr('src');assert.match(src,/^\/_image\?/)
   const optimized=await fetch(new URL(src,`http://127.0.0.1:${port}`));assert.equal(optimized.status,200,`${id}: ${serverLog}`)
   const metadata=await sharp(Buffer.from(await optimized.arrayBuffer())).metadata()
   assert.equal(metadata.format,id==='avif'?'heif':'webp')
   if(id==='crop')assert.deepEqual([metadata.width,metadata.height],[60,60])
  }
  console.log('Image audit passed (static and SSR): emitted Sharp assets, formats, sizing, density, preload, SVG, public images, fill and blur lifecycle at mobile/desktop widths.')
 } finally { await browser?.close(); if(ssr && ssr.exitCode === null) { const exited=new Promise(resolve=>ssr.once('exit',resolve));ssr.kill();await exited } await new Promise(resolve=>remote.close(resolve)); if(web) await new Promise(resolve=>web.close(resolve)); await fs.rm(temp,{recursive:true,force:true}) }
}
main().catch(error=>{console.error(error);process.exitCode=1})
