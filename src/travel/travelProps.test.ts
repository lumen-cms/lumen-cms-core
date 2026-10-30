import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CONFIG } from '../utils/config'
const mocks = vi.hoisted(() => ({
  getStory: vi.fn(),
  fetchTravel: vi.fn(),
  fetchTravels: vi.fn(),
  components: vi.fn(),
  fonts: vi.fn()
}))
vi.mock('../utils/initial-props/StoryblokService', () => ({
  LmStoryblokService: { getStory: mocks.getStory }
}))
vi.mock('./utils/travel', () => ({ fetchTravel: mocks.fetchTravel }))
vi.mock('./utils/travels', () => ({ fetchTravels: mocks.fetchTravels }))
vi.mock('../utils/initial-props/component-data/traversePageContent', () => ({
  fetchComponentData: mocks.components
}))
vi.mock('../utils/initial-props/processGoogleFonts', () => ({
  loadGoogleFontsCss: mocks.fonts
}))
import { getStaticProps, getStaticPaths } from './utils/travelProps'
const original = { ...CONFIG }
beforeEach(() => {
  vi.clearAllMocks()
  Object.assign(CONFIG, {
    rootDirectory: 'de',
    fieldLevelTranslation: false,
    enableLocaleSuffix: false,
    overwriteSettingsPaths: []
  })
  mocks.getStory.mockResolvedValue({
    data: {
      story: {
        uuid: 'settings-id',
        content: { _uid: 'settings', component: 'global' }
      }
    }
  })
  mocks.fetchTravel.mockResolvedValue([
    {
      id: 1,
      slug: 'trip',
      title: 'Trip',
      page_title: 'Trip',
      meta_description: 'Description'
    }
  ])
  vi.stubEnv('TRAVELS_SLUG', 'reisen')
})
afterEach(() => Object.assign(CONFIG, original))
it('uses core settings resolution without a leading slash and prepares the page', async () => {
  const result = await getStaticProps({
    params: { slug: 'trip' },
    locale: 'de',
    defaultLocale: 'de',
    locales: ['de']
  })
  expect(mocks.getStory).toHaveBeenCalledWith('de/settings', {})
  expect(result).toMatchObject({
    props: {
      locale: 'de',
      defaultLocale: 'de',
      settings: { uuid: 'settings-id' },
      page: { component: 'page', body: [{ component: 'travel' }] }
    }
  })
  expect(mocks.components).toHaveBeenCalledTimes(1)
  expect(mocks.fonts).toHaveBeenCalledTimes(1)
})
it('resolves secondary locales and settings overrides with preview parameters', async () => {
  Object.assign(CONFIG, {
    rootDirectory: 'content',
    overwriteSettingsPaths: ['reisen/']
  })
  await getStaticProps({
    params: { slug: 'trip' },
    locale: 'fr',
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    preview: true,
    previewData: { _storyblok_release: 42 }
  })
  expect(mocks.getStory).toHaveBeenCalledWith('fr/content/reisen/settings', {
    version: 'draft',
    from_release: '42'
  })
})
it('returns a real 404 for missing travel records', async () => {
  mocks.fetchTravel.mockResolvedValue([])
  expect(await getStaticProps({ params: { slug: 'missing' } })).toEqual({
    notFound: true
  })
})
it('fails instead of publishing a 200 page displaying a 500 error when settings are missing', async () => {
  mocks.getStory.mockResolvedValue(null)
  await expect(
    getStaticProps({
      params: { slug: 'trip' },
      locale: 'de',
      defaultLocale: 'de'
    })
  ).rejects.toThrow('Travel settings not found')
})
it('supports a consumer without i18n configuration', async () => {
  vi.stubEnv('NODE_ENV', 'production')
  mocks.fetchTravels.mockResolvedValue([{ slug: 'trip' }])
  expect(await getStaticPaths({})).toEqual({
    paths: [{ params: { slug: 'trip' } }],
    fallback: 'blocking'
  })
})
