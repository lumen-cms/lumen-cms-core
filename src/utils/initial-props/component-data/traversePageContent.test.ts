import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CONFIG } from '../../config'
import { SSR_CONFIG } from '../ssrConfig'
import { fetchComponentData } from './traversePageContent'
import { listWidgetGetData } from './listWidgetData'
import { fixtureFetch } from '../__fixtures__/storyblokDelivery'
import type { AppPageProps } from '../../../typings/app'

type EnrichedWidget = {
  component: 'list_widget'
  _uid: string
  list_widget_data?: Awaited<ReturnType<typeof listWidgetGetData>>
}
const originalConfig = { ...CONFIG }
const originalComponentData = SSR_CONFIG.ssrHooks.componentData
let requests: URL[]

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('STORYBOOK', '')
  Object.assign(CONFIG, {
    publicToken: 'public-test',
    previewToken: 'preview-test'
  })
  requests = []
  vi.stubGlobal('fetch', vi.fn(fixtureFetch(requests)))
  SSR_CONFIG.ssrHooks.componentData = { list_widget: listWidgetGetData }
})
afterEach(() => {
  Object.assign(CONFIG, originalConfig)
  SSR_CONFIG.ssrHooks.componentData = originalComponentData
})

it('shares one uncached story listing between concurrent list widgets', async () => {
  const first: EnrichedWidget = { component: 'list_widget', _uid: 'a' }
  const nested: EnrichedWidget = { component: 'list_widget', _uid: 'nested' }
  const right: EnrichedWidget = { component: 'list_widget', _uid: 'b' }
  const props = {
    insideStoryblok: true,
    page: {
      body: [
        first,
        {
          component: 'section',
          _uid: 'section',
          body: [nested]
        }
      ],
      right_body: [right]
    }
  } as unknown as AppPageProps

  await fetchComponentData(props)

  const widgets = [first, nested, right]
  for (const widget of widgets) {
    expect(widget.list_widget_data!.items.map((i) => i.uuid)).toEqual([
      'item-1',
      'item-2',
      'item-3'
    ])
  }
  const listRequests = requests.filter((url) =>
    url.pathname.endsWith('/stories')
  )
  expect(listRequests).toHaveLength(1)
  expect(listRequests[0].searchParams.get('version')).toBe('draft')
})
