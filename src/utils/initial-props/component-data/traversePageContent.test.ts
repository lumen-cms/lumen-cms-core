import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CONFIG } from '@CONFIG'
import { SSR_CONFIG } from '@SSR_CONFIG'
import { fetchComponentData } from './traversePageContent'
import { listWidgetGetData } from './listWidgetData'
import { fixtureFetch } from '../__fixtures__/storyblokDelivery'
import type { AppPageProps } from '../../../typings/app'

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
  const props = {
    insideStoryblok: true,
    page: {
      body: [
        { component: 'list_widget', _uid: 'a' },
        {
          component: 'section',
          _uid: 'section',
          body: [{ component: 'list_widget', _uid: 'nested' }]
        }
      ],
      right_body: [{ component: 'list_widget', _uid: 'b' }]
    }
  } as unknown as AppPageProps

  await fetchComponentData(props)

  const page = props.page as any
  const widgets = [
    page.body[0],
    page.body[1].body[0],
    page.right_body[0]
  ]
  for (const widget of widgets) {
    expect(widget.list_widget_data.items.map((i: any) => i.uuid)).toEqual([
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
