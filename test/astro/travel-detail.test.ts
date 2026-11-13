import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { build } from 'esbuild'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { Window } from 'happy-dom'
import { TravelHeader } from '../../src/travel/components/travel/TravelHeader'
import { TravelOverview } from '../../src/travel/components/travel/TravelOverview'
import { TravelGallery } from '../../src/travel/components/travel/TravelGallery'
import { TravelServices } from '../../src/travel/components/travel/TravelServices'
import type { TravelSectionProps } from '../../src/travel/components/travel/travelSectionContent'
import { getTravelHeaderContent, getTravelOverviewContent, getTravelGalleryContent, getTravelServicesContent } from '../../packages/lumen-cms-shared/src/travelDetail'

const captured = vi.hoisted(() => ({ content: undefined as unknown }))
vi.mock('../../src/components/CoreComponents', () => ({ LmComponentRender: ({ content }: { content: unknown }) => { captured.content = content; return null } }))

it.each(['DE', 'EN'] as const)('preserves travel section data and links in %s', langKey => {
 const content = { id: 42, title: 'Trip', city: { title: 'City', title_de: 'Stadt', country: { title: 'Country', title_de: 'Land' } }, mn_travel_travel_types: [{ travel_type: { title: 'Internship', title_de: 'Praktikum' } }], product: { product_price: { eur: 1200, usd: 1500 } }, file_storybloks: [{ id: 1, url_new: 'https://example.test/gallery.jpg' }, { id: 2, url_new: '' }], overview: '<p>Overview</p>', description: '<p>Description</p>', travel_accommodation: { description: '<p>Accommodation</p>' }, travel_service: { description: '<p>Services</p>' } } as unknown as TravelSectionProps['content']
 const props = { content, langKey }
 for (const [reference, factory] of [[TravelHeader, getTravelHeaderContent], [TravelOverview, getTravelOverviewContent], [TravelGallery, getTravelGalleryContent], [TravelServices, getTravelServicesContent]] as const) {
  captured.content = undefined
  renderToStaticMarkup(createElement(reference as ComponentType<TravelSectionProps>, props))
  expect(factory(props)).toEqual(captured.content)
 }
 expect(JSON.stringify(getTravelOverviewContent(props, 'usd'))).toContain('1500 USD')
 expect(getTravelGalleryContent({ content: { ...content, file_storybloks: [] } })).toBeNull()
})

it('bundles travel section builders without React, Next or MUI runtime', async () => {
 const result = await build({ entryPoints: ['packages/lumen-cms-shared/src/travelDetail.ts'], bundle: true, write: false, metafile: true, platform: 'browser', logLevel: 'silent' })
 expect(Object.keys(result.metafile!.inputs).filter(path => /node_modules\/(?:.*\/)?(?:react|react-dom|next|@mui|@emotion)\//.test(path))).toEqual([])
})

it.each(['DE', 'EN'] as const)('updates only the booking price and preserves facts in %s', async langKey => {
 const content = { id: 42, title: 'Chichester', product: { product_price: { eur: 2390, usd: 2600 } }, travel_fast_fact: { duration: 'ab 3 Wochen', minimum_age: 1, language_skill: 2 } } as unknown as TravelSectionProps['content']
 const window = new Window()
 try {
  const root = window.document.createElement('div')
  root.dataset.lmTravelDetail = ''
  root.dataset.language = langKey
  root.dataset.prices = JSON.stringify(content.product?.product_price)
  window.document.body.append(root)
  function appendHeadlines(value: unknown) {
   if (!value || typeof value !== 'object') return
   const node = value as { component?: string; text?: string; class_names?: { values?: string[] } }
   if (node.component === 'headline') {
    const element = window.document.createElement('p')
    element.textContent = node.text || ''
    element.className = node.class_names?.values?.join(' ') || ''
    root.append(element)
   }
   Object.values(value).forEach(appendHeadlines)
  }
  appendHeadlines(getTravelOverviewContent({ content, langKey }))
  const prices = root.querySelectorAll('.lm-travel-price')
  expect(prices).toHaveLength(1)
  expect(prices[0].textContent).toBe('2390 EUR')
  const facts = [...root.querySelectorAll('p:not(.lm-travel-price)')]
  const originalFacts = facts.map(node => node.textContent)
  expect(originalFacts).toContain(langKey === 'DE' ? 'Zeitraum frei wählbar' : 'Flexible dates')
  expect(originalFacts).toContain('ab 3 Wochen')
  expect(originalFacts).toContain(langKey === 'DE' ? 'ab 18 Jahren' : 'from 18 years')
  expect(originalFacts).toContain(langKey === 'DE' ? 'Gute Englischkenntnisse' : 'Good english knowledge')
  const source = readFileSync('packages/lumen-cms-astro/src/travel/Travel.astro', 'utf8')
  const script = source.match(/<script>([\s\S]*?)<\/script>/)![1]
  const result = await build({ stdin: { contents: script, loader: 'ts', resolveDir: process.cwd() }, bundle: true, write: false, format: 'iife', platform: 'browser' })
  runInNewContext(result.outputFiles[0].text, { document: window.document, navigator: { language: 'en-US' } })
  expect(prices[0].textContent).toBe(langKey === 'DE' ? '2390 EUR' : '2600 USD')
  expect(facts.map(node => node.textContent)).toEqual(originalFacts)
 } finally {
  await window.happyDOM.close()
 }
})
