const { chromium } = require('playwright')
const assert = require('node:assert/strict')

async function main() {
 const url = new URL(process.argv[2] || 'http://127.0.0.1:4321/fees')
 if (!['127.0.0.1', 'localhost'].includes(url.hostname)) throw new Error('Use a local Astro sample URL')
 const browser = await chromium.launch()
 try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await page.goto(url.href)
  const menus = page.locator('.navbar [data-lm-menu]')
  const observations = []
  for (let index = 0; index < await menus.count(); index++) {
   const menu = menus.nth(index)
   if (!await menu.isVisible()) continue
   const trigger = menu.locator('[data-menu-trigger]').first()
   const panel = menu.locator('[data-menu-panel]').first()
   await trigger.focus()
   assert.equal(await panel.isVisible(), false, 'Focus alone must not open a dismissed menu')
   await trigger.press('Enter')
   await panel.waitFor({ state: 'visible' })
   const state = await panel.evaluate(element => {
    const rect = element.getBoundingClientRect()
    return { width: rect.width, left: rect.left, right: rect.right, links: element.querySelectorAll('a').length }
   })
   assert(state.left >= 0 && state.right <= 1280, 'Menu must stay inside the viewport')
   assert(state.links > 0, 'Menu must retain its CMS links')
   observations.push(state)
   await trigger.press('Escape')
   await panel.waitFor({ state: 'hidden' })
   assert.equal(await panel.isVisible(), false)
   assert.equal(await trigger.getAttribute('aria-expanded'), 'false')
   assert.equal(await trigger.evaluate(element => element === document.activeElement), true)
  }
  assert(observations.length > 0, 'Sample must exercise a desktop dropdown')
  await page.setViewportSize({ width: 375, height: 812 })
  await page.getByRole('button', { name: 'Drawer left toggle' }).click()
  assert.equal(await page.locator('#lm-left-drawer').evaluate(element => element.open), true)
  if (await page.locator('#lm-left-drawer').evaluate(element => element.matches(':modal'))) await page.keyboard.press('Escape')
  else await page.getByRole('button', { name: 'Drawer left toggle' }).click()
  await page.waitForFunction(() => !document.querySelector('#lm-left-drawer').open)
  assert.equal(await page.locator('#lm-left-drawer').evaluate(element => element.open), false)
  console.log(JSON.stringify({ menus: observations, mobileDrawer: 'passed' }))
 } finally { await browser.close() }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
