import { writeFileSync } from 'node:fs'
import { beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ getStory: vi.fn(), fonts: vi.fn(), hook: vi.fn() }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/StoryblokService', () => ({ LmStoryblokService: { getStory: mocks.getStory, getAll: vi.fn(async () => []), requestCount: 0 } }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/processGoogleFonts', () => ({ loadGoogleFontsCss: mocks.fonts }))
import { loadPage } from '../../packages/lumen-cms-astro/src/server/pages'
import { CONFIG } from '../../packages/lumen-cms-shared/src/core/utils/config'
import { SSR_CONFIG } from '../../packages/lumen-cms-shared/src/core/utils/initial-props/ssrConfig'
import type { ISbStoryData } from 'storyblok-js-client'
const options = { locale: 'en', defaultLocale: 'en', locales: ['en', 'de'] }
const story = (full_slug = 'home', component = 'page') => ({ uuid: full_slug, full_slug, content: { component, _uid: full_slug, body: [], meta_title: 'Unsaved' } }) as ISbStoryData<any>
beforeEach(() => {
 vi.clearAllMocks()
 Object.assign(CONFIG, { rootDirectory: undefined, fieldLevelTranslation: false, enableLocaleSuffix: false, overwriteSettingsPaths: [] })
 SSR_CONFIG.ssrHooks.pageProps = [mocks.hook]
 mocks.getStory.mockImplementation(async (slug: string) => ({ data: { story: { ...story(slug, slug.endsWith('settings') ? 'global' : 'page'), content: { ...story(slug, slug.endsWith('settings') ? 'global' : 'page').content, meta_title: 'Saved' } } } }))
})
it('measures the real preview loader with controlled delivery latency', async () => {
 const response = mocks.getStory.getMockImplementation()!
 mocks.getStory.mockImplementation(async (slug: string) => {
  await new Promise(resolve => setTimeout(resolve, slug === 'home' ? 40 : 5))
  return response(slug)
 })
 const durations: number[] = [], calls: number[] = []
 for (let i = 0; i < 5; i++) {
  const before = mocks.getStory.mock.calls.length, start = performance.now()
  const page = await loadPage('home', options, true, { version: 'draft' }, story())
  durations.push(performance.now() - start); calls.push(mocks.getStory.mock.calls.length - before)
  expect(page.page?.meta_title).toBe('Unsaved')
 }
 console.info('Preview loader measurement (controlled upstream: page 40ms, settings 5ms):', JSON.stringify({ calls, milliseconds: durations.map(n => +n.toFixed(2)) }))
 if (process.env.PREVIEW_BENCHMARK_OUTPUT) writeFileSync(process.env.PREVIEW_BENCHMARK_OUTPUT, JSON.stringify({ calls, milliseconds: durations }, null, 2))
 expect(calls).toEqual([1, 1, 1, 1, 1])
 expect(mocks.hook).toHaveBeenCalledTimes(5)
})

it.each(['page', 'news', 'event'])('uses %s payload without reading its saved story and enriches once', async component => {
 const live = story('home', component)
 const original = structuredClone(live)
 const loader = vi.fn(async (block: Record<string, unknown>) => { block.enriched = true; return { ok: true } })
 SSR_CONFIG.ssrHooks.componentData.preview_test = loader
 live.content.body = [{ component: 'preview_test', _uid: 'child' }]
 original.content.body = structuredClone(live.content.body)
 try {
  const result = await loadPage('home', options, true, { version: 'draft', from_release: '42' }, live)
  expect(mocks.getStory.mock.calls.map(call => call[0])).toEqual(['settings'])
  expect(mocks.getStory.mock.calls[0][1]).toMatchObject({ version: 'draft', from_release: '42' })
  expect(result.page?.component).toBe(component)
  expect(result.page?.meta_title).toBe('Unsaved')
  expect(loader).toHaveBeenCalledOnce()
  expect(mocks.fonts).toHaveBeenCalledOnce()
  expect(mocks.hook).toHaveBeenCalledOnce()
  expect(live).toEqual(original)
 } finally { delete SSR_CONFIG.ssrHooks.componentData.preview_test }
})
it('uses global settings payload without fetching the saved settings', async () => {
 const result = await loadPage('home', options, true, undefined, story('settings', 'global'))
 expect(mocks.getStory.mock.calls.map(call => call[0])).toEqual(['home'])
 expect(result.settings?.meta_title).toBe('Unsaved')
 expect(result.page?.meta_title).toBe('Saved')
})
it('needs no delivery requests when the global settings story is itself the preview route', async () => {
 const result = await loadPage('settings', options, true, undefined, story('settings', 'global'))
 expect(mocks.getStory).not.toHaveBeenCalled()
 expect(result.settings?.meta_title).toBe('Unsaved')
 expect(mocks.hook).toHaveBeenCalledOnce()
})
it.each(['unrelated', 'missing-slug', 'public', 'initial'])('keeps the delivery fallback for %s', async scenario => {
 const live = scenario === 'initial' ? undefined : story(scenario === 'unrelated' ? 'other' : 'home')
 if (scenario === 'missing-slug') delete (live as Partial<ISbStoryData>).full_slug
 await loadPage('home', options, scenario !== 'public', undefined, live)
 expect(mocks.getStory.mock.calls.map(call => call[0])).toEqual(['home', 'settings'])
})
it('resolves locale/root/settings overrides before matching payload paths', async () => {
 Object.assign(CONFIG, { rootDirectory: 'site', overwriteSettingsPaths: ['special/'] })
 const result = await loadPage('de/special/home', { ...options, locale: 'de' }, true, undefined, story('de/site/special/home'))
 expect(mocks.getStory.mock.calls.map(call => call[0])).toEqual(['de/site/special/settings'])
 expect(result.page?.meta_title).toBe('Unsaved')
})
it('requires the matching field-level language before skipping delivery', async () => {
 CONFIG.fieldLevelTranslation = true
 const live = { ...story('home'), lang: 'de' }
 await loadPage('home', { ...options, locale: 'de' }, true, undefined, live)
 expect(mocks.getStory.mock.calls.map(call => call[0])).toEqual(['settings'])
 expect(mocks.getStory.mock.calls[0][1].language).toBe('de')
 mocks.getStory.mockClear()
 const fallback = await loadPage('home', { ...options, locale: 'de' }, true, undefined, { ...live, lang: 'en' })
 expect(fallback.page?.meta_title).toBe('Saved')
 expect(mocks.getStory).toHaveBeenCalledTimes(2)
})
