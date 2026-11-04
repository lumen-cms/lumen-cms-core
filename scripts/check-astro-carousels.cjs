const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { build } = require('esbuild')
const { chromium } = require('playwright')
async function main() {
 const result = await build({ stdin: { resolveDir: path.resolve(__dirname, '..'), loader: 'tsx', contents: `
 import React from 'react'; import { createRoot } from 'react-dom/client'
 import { ThemeProvider, createTheme } from '@mui/material/styles'; import CssBaseline from '@mui/material/CssBaseline'
 import Carousel from './src/components/slider/LmNukaCarousel'
 import { carouselSlides } from './test/astro/fixtures/carousel-parity.mjs'
 const variant = location.pathname.split('/').filter(Boolean).pop()
 createRoot(document.getElementById('root')).render(<ThemeProvider theme={createTheme()}><CssBaseline/><Carousel wrapAround={variant !== 'bounded'} autoplay={variant === 'autoplay'} autoplayInterval={1000}>{(variant === 'single' ? carouselSlides.slice(0,1) : carouselSlides).map(slide => <div key={slide._uid} dangerouslySetInnerHTML={{__html:slide.body}} />)}</Carousel></ThemeProvider>)
 ` }, bundle: true, platform: 'browser', format: 'esm', jsx: 'automatic', outdir: '/virtual', write: false, define: { 'process.env.NODE_ENV': '"production"' } })
 const assets = { '/legacy.js': result.outputFiles.find(f => f.path.endsWith('.js')).text, '/legacy.css': result.outputFiles.find(f => f.path.endsWith('.css'))?.text || '' }
 const root = path.resolve(__dirname, '../packages/lumen-cms-astro/dist/fixture')
 const server = http.createServer(async (req, res) => {
  try {
   const pathname = new URL(req.url, 'http://localhost').pathname
   if (assets[pathname] !== undefined) { res.setHeader('Content-Type', pathname.endsWith('.js') ? 'text/javascript' : 'text/css'); res.end(assets[pathname]); return }
   if (pathname.startsWith('/legacy/')) { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/legacy.css"></head><body><main id="root" style="width:100%;max-width:900px;margin:auto;padding-top:80px"></main><script type="module" src="/legacy.js"></script></body></html>'); return }
   let file = path.resolve(root, '.' + pathname)
   if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return }
   if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html')
   res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html'); res.end(await fs.readFile(file))
  } catch { res.writeHead(404).end() }
 })
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
 const origin = `http://127.0.0.1:${server.address().port}`
 let browser
 const errors = []
 const selected = async (page, index) => {
  await page.waitForFunction(index => {
   const v = document.querySelector('.lm-native-carousel,.swiper'), current = v?.swiper?.realIndex ?? Number(v?.dataset.carouselIndex)
   const slide = document.querySelector(`[data-parity-slide="${index}"]`) || v?.children[index]
   return current === index && !v?.swiper?.animating && Math.abs(slide.getBoundingClientRect().left - v.getBoundingClientRect().left) < 2
  }, index, { timeout: 10000 }).catch(async error => { console.error(page.url(), index, await page.locator('.lm-native-carousel,.swiper').evaluate(v => ({index:v.swiper?.realIndex ?? v.dataset.carouselIndex, rect:v.getBoundingClientRect().toJSON(), slides:[...document.querySelectorAll('[data-parity-slide]')].map(s=>s.getBoundingClientRect().toJSON())}))); throw error })
 }
 const gesture = async (page, forward, touch) => {
  const rect = await page.locator('.lm-native-carousel,.swiper').boundingBox(), y = rect.y + 70
  const start = rect.x + rect.width * (forward ? .8 : .2), end = start + rect.width * (forward ? -.65 : .65)
  if (touch) {
   const cdp = await page.context().newCDPSession(page)
   await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x:start,y }] })
   for (let i=1;i<=10;i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x:start+(end-start)*i/10,y }] }); await page.waitForTimeout(20) }
   await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await cdp.detach()
  } else { await page.mouse.move(start,y); await page.mouse.down(); await page.mouse.move(end,y,{steps:12}); await page.mouse.up() }
  await page.waitForTimeout(650)
 }
 try {
  browser = await chromium.launch()
  for (const variant of ['loop','bounded','single','autoplay']) for (const renderer of ['legacy','astro']) {
   console.log(`Checking ${renderer} carousel ${variant}`)
   const context = await browser.newContext({ viewport: {width:900,height:700}, hasTouch:true })
   const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message))
   await page.goto(`${origin}/${renderer === 'legacy' ? 'legacy' : 'carousel-parity'}/${variant}/`, {waitUntil:'networkidle'})
   await selected(page,0)
   if (variant === 'autoplay') {
    await page.mouse.move(0,0); await selected(page,1)
    await page.locator('[data-parity-slide="1"]').hover(); await page.waitForTimeout(1800); await selected(page,1)
    await page.mouse.move(0,0); await selected(page,2)
    if (renderer === 'astro') {
     assert.equal(await page.locator('[data-carousel-pause]').count(), 0, 'CMS carousels must not show the removed pause/start control')
     await page.emulateMedia({reducedMotion:'reduce'})
     await page.waitForTimeout(1800); await selected(page,2)
     await page.getByRole('button',{name:'Next slide',exact:true}).click(); await selected(page,0)
    }
   } else if (variant === 'single') {
    await gesture(page,true,true); await selected(page,0)
   } else {
    await page.getByRole('button',{name:/^slide 3$/i}).click(); await selected(page,2)
    await page.getByRole('button',{name:/^slide 1$/i}).click(); await selected(page,0)
    await page.getByRole('button',{name:/^next slide$/i}).click(); await selected(page,1)
    await page.getByRole('button',{name:/^slide 3$/i}).click(); await selected(page,2)
    if (variant === 'loop') { await gesture(page,true,true); await selected(page,0); await gesture(page,false,true); await selected(page,2) }
    else assert(await page.getByRole('button',{name:/^next slide$/i}).isDisabled())
    await page.getByRole('button',{name:/^slide 1$/i}).click(); await selected(page,0)
    await gesture(page,true,false); await selected(page,1)
    await page.setViewportSize({width:375,height:700}); await page.waitForTimeout(300); await selected(page,1)
    await gesture(page,true,true); await selected(page,2)
    assert(Math.abs((await page.locator('.lm-native-carousel,.swiper').boundingBox()).height-240)<2)
    if (renderer === 'astro') {
     await page.locator('.lm-swiper').evaluate(root => { root.dispatchEvent(new CustomEvent('lumen:content-unmount', {bubbles:true})); document.dispatchEvent(new Event('lumen:content-mounted')); document.dispatchEvent(new Event('lumen:content-mounted')) })
     await selected(page,0)
     await page.getByRole('button',{name:/^next slide$/i}).click(); await selected(page,1)
    }
   }
   await context.close()
  }
  for (const feature of ['swiper', 'advanced']) for (const width of [390, 1280]) {
   const context = await browser.newContext({ viewport: { width, height: 800 } })
   const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message))
   await page.goto(`${origin}/bundle-fixtures/${feature}/`, { waitUntil: 'networkidle' })
   const next = page.getByRole('button', { name: 'Next slide', exact: true })
   await next.scrollIntoViewIfNeeded()
   await page.waitForFunction(() => {
    const viewport = document.querySelector('.swiper,.lm-native-carousel')
    return !!(viewport?.swiper || viewport?.dataset.initialized)
   })
   assert.equal(await page.locator('[data-carousel-pause]').count(), 0)
   assert.deepEqual(await next.evaluate(el => {
    const style = getComputedStyle(el), svg = el.querySelector('svg')
    return [style.borderWidth, style.backgroundColor, !!svg, svg && getComputedStyle(svg).fill]
   }), ['0px', 'rgba(0, 0, 0, 0)', true, 'none'])
   await next.click()
   await page.waitForFunction(() => {
    const viewport = document.querySelector('.swiper,.lm-native-carousel')
    return (viewport?.swiper?.realIndex ?? Number(viewport?.dataset.carouselIndex)) === 1
   })
   await context.close()
  }
  for (const feature of ['lightbox', 'shopify']) {
   console.log(`Checking Astro ${feature} wiring and touch gestures`)
   const context = await browser.newContext({ viewport:{width:375,height:700}, hasTouch:true })
   const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message))
   await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort())
   await page.goto(`${origin}/bundle-fixtures/${feature}/`, {waitUntil:'networkidle'})
   if (feature === 'lightbox') await page.getByRole('button',{name:'Image two',exact:true}).click()
   else await page.getByRole('button',{name:'Large',exact:true}).click()
   await selected(page,1)
   await gesture(page,true,true); await selected(page,0)
   if (feature === 'lightbox') {
    assert.equal(await page.locator('.lm-lightbox-pagination').innerText(),'1 / 2')
    await page.keyboard.press('ArrowLeft'); await selected(page,1)
    await page.keyboard.press('Escape'); assert.equal(await page.locator('.lm-image-lightbox').isVisible(),false)
    await page.getByRole('button',{name:'Image one',exact:true}).press('Enter'); await selected(page,0)
   } else {
    assert.equal(await page.getByRole('button',{name:'Small',exact:true}).getAttribute('aria-pressed'),'true')
    await page.getByRole('button',{name:'Go to slide 2',exact:true}).click(); await selected(page,1)
    assert.equal(await page.getByRole('button',{name:'Large',exact:true}).getAttribute('aria-pressed'),'true')
   }
   await context.close()
  }
  assert.deepEqual(errors,[])
  console.log('Carousel parity passed: real Next.js LmNukaCarousel vs Astro; controls, mouse/touch, wrapping, bounds, resize, autoplay and reduced motion.')
 } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)) }
}
main().catch(error => { console.error(error); process.exitCode=1 })
