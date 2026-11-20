import { writeFileSync } from 'node:fs'
import { expect, it, vi } from 'vitest'
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/processGoogleFonts', () => ({ loadGoogleFontsCss: vi.fn() }))
import { loadPage } from '../../packages/lumen-cms-astro/src/server/pages'
import { CONFIG } from '../../packages/lumen-cms-shared/src/core/utils/config'
import { LmStoryblokService, StoryblokServiceClass } from '../../packages/lumen-cms-shared/src/core/utils/initial-props/StoryblokService'
import type { ISbStoryData } from 'storyblok-js-client'

it('measures delivery HTTP calls through the real service and API client', async () => {
 const previous = { ...CONFIG }
 Object.assign(CONFIG, { previewToken: 'preview-test', rootDirectory: undefined, fieldLevelTranslation: false, enableLocaleSuffix: false, overwriteSettingsPaths: [] })
 const options = { locale: 'en', defaultLocale: 'en', locales: ['en'] }
 const live = { uuid: 'home-id', full_slug: 'home', content: { component: 'page', _uid: 'home', body: [], meta_title: 'Unsaved' } } as ISbStoryData<any>
 const samples: Record<string, { milliseconds: number; requests: string[] }[]> = { fallback: [], payload: [] }
 try {
  for (const mode of ['fallback', 'payload'] as const) {
   for (let i = 0; i < 5; i++) {
    const requests: string[] = []
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
     const url = new URL(input instanceof Request ? input.url : String(input))
     const slug = url.pathname.split('/cdn/stories/')[1]
     if (slug !== 'home' && slug !== 'settings') throw new Error(`Unexpected fixture request: ${url.pathname}`)
     expect(url.searchParams.get('version')).toBe('draft')
     requests.push(slug)
     await new Promise(resolve => setTimeout(resolve, slug === 'home' ? 40 : 5))
     return new Response(JSON.stringify({ story: { uuid: `${slug}-id`, full_slug: slug, content: { component: slug === 'settings' ? 'global' : 'page', _uid: slug, body: [], meta_title: 'Saved' } }, cv: 1 }), { headers: { 'Content-Type': 'application/json' } })
    }))
    // Fresh transport per sample: no warmed cache/rate-limiter advantage.
    const service = new StoryblokServiceClass()
    vi.spyOn(LmStoryblokService, 'getStory').mockImplementation(service.getStory.bind(service))
    const payload = structuredClone(live)
    if (mode === 'fallback') delete (payload as Partial<ISbStoryData>).full_slug
    const start = performance.now()
    const result = await loadPage('home', options, true, { version: 'draft' }, payload)
    samples[mode].push({ milliseconds: performance.now() - start, requests })
    expect(result.page?.meta_title).toBe('Unsaved')
    expect(requests).toEqual(mode === 'fallback' ? ['home', 'settings'] : ['settings'])
   }
  }
  if (process.env.PREVIEW_HTTP_BENCHMARK_OUTPUT) writeFileSync(process.env.PREVIEW_HTTP_BENCHMARK_OUTPUT, JSON.stringify(samples, null, 2))
 } finally { Object.assign(CONFIG, previous) }
})
