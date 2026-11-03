import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { build } from 'esbuild'
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
