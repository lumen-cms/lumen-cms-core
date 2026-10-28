import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import StoryblokClient, { type ISbStoriesParams } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { rootParams } from '../universal/storyblokParamsHelper'
import { fixtureFetch } from './__fixtures__/storyblokDelivery'
import { StoryblokServiceClass } from './StoryblokService'
import pagesGetStaticProps from './pagesGetStaticProps'

const backend = vi.hoisted(() => ({
  current: undefined as
    | Pick<StoryblokServiceClass, 'getStory' | 'getStories' | 'getAll'>
    | undefined
}))
vi.mock('./StoryblokService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./StoryblokService')>()
  return {
    ...actual,
    LmStoryblokService: {
      getStory: (...args: Parameters<StoryblokServiceClass['getStory']>) =>
        backend.current!.getStory(...args),
      getStories: (...args: Parameters<StoryblokServiceClass['getStories']>) =>
        backend.current!.getStories(...args),
      getAll: (...args: Parameters<StoryblokServiceClass['getAll']>) =>
        backend.current!.getAll(...args)
    }
  }
})
vi.mock('./processGoogleFonts', () => ({
  loadGoogleFontsCss: async () => undefined
}))
const serialized = (value: unknown) =>
  JSON.parse(
    JSON.stringify(value, (key, item) =>
      key === 'list_widget_data' ? { ...item, cv: '<build timestamp>' } : item
    )
  )
const originalConfig = { ...CONFIG }
let requests: URL[]
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('STORYBOOK', '')
  requests = []
  vi.stubGlobal('fetch', vi.fn(fixtureFetch(requests)))
})
afterEach(() => Object.assign(CONFIG, originalConfig))

// These language/settings modes mirror the three consumer environment files.
// Content is synthetic; the separate build-data gate compares every real route.
const sites = [
  {
    name: 'baliinternships',
    locales: ['en', 'de', 'id'],
    deep: ['internships', 'marketing'],
    settings: []
  },
  {
    name: 'planet.training',
    locales: ['en', 'de', 'it', 'es'],
    deep: ['support', 'getting-started'],
    settings: ['support', 'hilfe']
  },
  {
    name: 'upskill',
    locales: ['en', 'de'],
    deep: ['study-abroad', 'programme'],
    settings: []
  }
]

for (const site of sites)
  describe(`${site.name} server page loads`, () => {
    for (const locale of site.locales)
      it(`preserves complete serialized props for ${locale} home and deep routes`, async () => {
        Object.assign(CONFIG, {
          publicToken: `${site.name}-public-test`,
          previewToken: `${site.name}-preview-test`,
          rootDirectory: '',
          fieldLevelTranslation: false,
          enableLocaleSuffix: false,
          overwriteSettingsPaths: site.settings
        })
        const oldClient = new StoryblokClient({
          accessToken: CONFIG.publicToken,
          cache: { type: 'none' }
        })
        oldClient.resolveNestedRelations = true
        const params = (value: ISbStoriesParams = {}): ISbStoriesParams => ({
          ...rootParams,
          ...value,
          version: 'published',
          cv: 1
        })
        const result = ({
          data,
          perPage,
          total
        }: {
          data: unknown
          perPage?: number
          total?: number
        }) => ({
          data: data as import('./storyblokResponse').StoryblokPayload,
          perPage: perPage || 0,
          total: total || 0
        })
        const oldBackend = {
          getStory: async (slug: string, value?: ISbStoriesParams) =>
            result(await oldClient.getStory(slug, params(value))),
          getStories: async (value?: ISbStoriesParams) =>
            result(await oldClient.getStories(params(value))),
          getAll: (slug: string, value?: ISbStoriesParams) =>
            oldClient.getAll(slug, params(value), 'stories')
        }
        const current = new StoryblokServiceClass()
        for (const route of [[], site.deep]) {
          const context = {
            params: { index: route },
            locale,
            locales: site.locales,
            defaultLocale: 'en'
          }
          backend.current = oldBackend
          const before = await pagesGetStaticProps(context)
          backend.current = current
          const after = await pagesGetStaticProps(context)
          // Compare every client-provided value, including relation payloads and
          // list totals/items, rather than just matching component counts.
          expect(serialized(after)).toEqual(serialized(before))
          expect('props' in after).toBe(true)
          if (!('props' in after)) throw new Error('Expected page props')
          const props = await after.props
          expect(props.page?.body).toHaveLength(4)
          expect(props.settings?.uuid).toBe('settings-20')
          expect(
            requests.some((request) =>
              request.pathname.includes(
                locale === 'en' ? '/stories/' : `/stories/${locale}/`
              )
            )
          ).toBe(true)
        }
      })
  })

it('does not leak preview/release mode into the next public page load', async () => {
  Object.assign(CONFIG, {
    publicToken: 'public-test',
    previewToken: 'preview-test',
    overwriteSettingsPaths: []
  })
  backend.current = new StoryblokServiceClass()
  const context = {
    params: { index: [] },
    locale: 'en',
    locales: ['en'],
    defaultLocale: 'en'
  }
  await pagesGetStaticProps({
    ...context,
    preview: true,
    previewData: { _storyblok_release: '123' }
  })
  const previewRequests = [...requests]
  expect(previewRequests.length).toBeGreaterThan(2)
  for (const request of previewRequests) {
    expect(request.searchParams.get('version')).toBe('draft')
    expect(request.searchParams.get('from_release')).toBe('123')
  }
  await pagesGetStaticProps(context)
  const homeRequests = requests.filter((url) => url.pathname.endsWith('/home'))
  expect(homeRequests.map((url) => url.searchParams.get('version'))).toEqual([
    'draft',
    'published'
  ])
  expect(homeRequests[0].searchParams.get('from_release')).toBe('123')
  expect(homeRequests[1].searchParams.has('from_release')).toBe(false)
})

it('fails a page load when fetching fails instead of generating a false 404', async () => {
  backend.current = new StoryblokServiceClass()
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({}, { status: 401 }))
  )
  vi.spyOn(console, 'log').mockImplementation(() => {})
  await expect(pagesGetStaticProps({ params: { index: [] } })).rejects.toThrow()
})
