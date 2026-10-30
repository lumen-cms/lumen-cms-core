import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  fetchTravels: vi.fn(),
  pagesGetStaticProps: vi.fn(),
  hooks: { componentData: {} as Record<string, unknown> },
  components: { lm_app_providers: [] } as Record<string, any>
}))
vi.mock('./utils/travels', () => ({ fetchTravels: mocks.fetchTravels }))
vi.mock('./utils/travelProps', () => ({
  getStaticPaths: vi.fn(),
  getStaticProps: vi.fn()
}))
vi.mock('./utils/travel', () => ({ fetchTravel: vi.fn() }))
vi.mock('../utils/initial-props/pagesGetStaticProps', () => ({
  default: mocks.pagesGetStaticProps
}))
vi.mock('../utils/initial-props/ssrConfig', () => ({
  SSR_CONFIG: { ssrHooks: mocks.hooks }
}))
vi.mock('../utils/config', () => ({ LmCoreComponents: mocks.components }))
vi.mock('next/dynamic', () => ({ default: () => () => null }))

import { getTravelListData, travelPagesGetStaticProps } from './server'
import { registerTravelComponents } from './client'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('core integration', () => {
  it('registers loaders after core resets its hook registry', async () => {
    mocks.hooks.componentData = { existing: 'preserved' }
    mocks.pagesGetStaticProps.mockImplementation(async () => {
      expect(mocks.hooks.componentData.travels_list_widget).toBe(
        getTravelListData
      )
      expect(mocks.hooks.componentData.auslandszeit_list_widget).toBeUndefined()
      return { props: { locale: 'de' } }
    })
    expect(await travelPagesGetStaticProps({} as never)).toEqual({
      props: { locale: 'de' }
    })
    expect(mocks.hooks.componentData.existing).toBe('preserved')
  })

  it('does not duplicate providers when registration repeats', () => {
    const count = mocks.components.lm_app_providers.length
    registerTravelComponents()
    registerTravelComponents()
    expect(count).toBe(1)
    expect(mocks.components.lm_app_providers).toHaveLength(1)
    expect(mocks.components.travel).toBeTypeOf('function')
    expect(mocks.components.auslandszeit_list_widget).toBeUndefined()
  })

  it('keeps sequential and concurrent locale requests separate', async () => {
    mocks.fetchTravels.mockImplementation(async (locale) => [
      { id: locale, title: locale }
    ])
    const read = (locale: string) =>
      getTravelListData({} as never, { locale } as never)
    expect(await read('de')).toEqual([{ id: 'de', title: 'de' }])
    expect(await read('en')).toEqual([{ id: 'en', title: 'en' }])
    expect(await Promise.all([read('de'), read('en')])).toEqual([
      [{ id: 'de', title: 'de' }],
      [{ id: 'en', title: 'en' }]
    ])
  })
})
