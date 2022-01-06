import { CONFIG } from '@CONFIG'
import getPageProps from './getPageProps'

// make sure tokens of theme.lumen.media
const defaultOptions = {
  locale: 'en',
  insideStoryblok: false,
  defaultLocale: 'en',
  locales: ['en']
}

describe('Get page props of a certain URL', () => {
  test('fetch url that consists list widget data', async () => {
    CONFIG.previewToken = 'irBTkf8Yqq6UJvRRQH8Bmwtt'
    CONFIG.publicToken = 'HvyhDYHDPgo3U4lB7s44jgtt'
    const data = await getPageProps(
      'demo-content/playground/testing-list-widget',
      defaultOptions
    )
    expect(!!data.page).toBeTruthy()
    const callback = (item: any) => {
      expect(typeof item.list_widget_data?.total).toBe('number')
      expect(typeof item.list_widget_data?.cv).toBe('number')
      expect(typeof item.list_widget_data?.perPage).toBe('number')
      expect(item.list_widget_data?.items?.length > 0).toBeTruthy()
    }
    recursiveTestCallback(data.page?.body ?? [], 'list_widget', callback)
  })

  test('fetch url that consists list widget data search', async () => {
    CONFIG.previewToken = 'IQrhrTP6aL0WYgDXmersbgtt'
    CONFIG.publicToken = 'Xzl0aUdUwWqtCsD37fHMmQtt'
    const data = await getPageProps('search', defaultOptions)
    expect(!!data.page).toBeTruthy()
    const callback = (item: any) => {
      expect(typeof item.list_widget_data?.total).toBe('number')
      expect(typeof item.list_widget_data?.cv).toBe('number')
      expect(typeof item.list_widget_data?.perPage).toBe('number')
      expect(item.list_widget_data?.items?.length > 0).toBeTruthy()
    }
    recursiveTestCallback(data.page?.body ?? [], 'list_widget', callback)
  })

  test('fetch url that consists category data', async () => {
    CONFIG.previewToken = 'IQrhrTP6aL0WYgDXmersbgtt'
    CONFIG.publicToken = 'Xzl0aUdUwWqtCsD37fHMmQtt'
    const data = await getPageProps('search', defaultOptions)
    expect(!!data.page).toBeTruthy()
    const callback = (item: any) => {
      expect(item.category_box_data?.length).toBeGreaterThan(0)
    }
    recursiveTestCallback(data.page?.right_body ?? [], 'category_box', callback)
  })

  test('fetch url that consists form data', async () => {
    CONFIG.previewToken = 'irBTkf8Yqq6UJvRRQH8Bmwtt'
    CONFIG.publicToken = 'HvyhDYHDPgo3U4lB7s44jgtt'
    const data = await getPageProps('request-demo', defaultOptions)
    expect(!!data.page).toBeTruthy()

    recursiveTestCallback(data.page?.body ?? [], 'form', callbackFormTest)
  })
  test('fetch url that consists form data in the footer', async () => {
    // commercentric uses it
    CONFIG.previewToken = '2mjT0ume8F2Oo232GKgRxgtt'
    CONFIG.publicToken = 'ogW5NFWib7hFRkHdzc56ewtt'
    const data = await getPageProps('/', defaultOptions)
    expect(!!data.page).toBeTruthy()

    recursiveTestCallback(data.settings?.footer ?? [], 'form', callbackFormTest)
  })
  test('fetch planet training and check existence of google font string', async () => {
    // commercentric uses it
    CONFIG.previewToken = 'MbZE9l5hGQp6BHIMkooB9Qtt'
    CONFIG.publicToken = 'itXwOvXYhANlzgPbwrA2Nwtt'
    const data = await getPageProps(
      'support/team-management/add-members',
      defaultOptions
    )
    expect(!!data.page).toBeTruthy()
    expect(typeof data.googleFontString).toBe('string')
  })

  test('fetch calendar entries', async () => {
    CONFIG.previewToken = 'irBTkf8Yqq6UJvRRQH8Bmwtt'
    CONFIG.publicToken = 'HvyhDYHDPgo3U4lB7s44jgtt'
    const data = await getPageProps(
      'demo-content/event-calendar',
      defaultOptions
    )
    console.log(data)
  })

  test('fetch list_stories entries', async () => {
    CONFIG.previewToken = 'irBTkf8Yqq6UJvRRQH8Bmwtt'
    CONFIG.publicToken = 'HvyhDYHDPgo3U4lB7s44jgtt'
    const data = await getPageProps(
      'demo-content/demo-list-stories',
      defaultOptions
    )
    const callback = (item: any) => {
      expect(typeof item.list_stories?.total).toBe('number')
      expect(typeof item.list_widget_data?.cv).toBe('number')
      expect(typeof item.list_widget_data?.perPage).toBe('number')
      expect(item.list_widget_data?.items?.length > 0).toBeTruthy()
    }
    recursiveTestCallback(data.page?.body ?? [], 'list_stories', callback)
  })

  test('test translated page of home in ladenburg', async () => {
    CONFIG.previewToken = 'GFikQ82LaPjNVcPNQVJzQgtt'
    CONFIG.publicToken = 'pe6FESyaNxKq7t1NpxZ0hwtt'
    CONFIG.fieldLevelTranslation = true
    const data = await getPageProps('home', {
      locale: 'en',
      defaultLocale: 'de',
      locales: ['en', 'de']
    })
    expect(!!data.page).toBeTruthy()
    expect(!!data.settings).toBeTruthy()
  })
  test('support list widget in static content', async () => {
    CONFIG.previewToken = 'irBTkf8Yqq6UJvRRQH8Bmwtt'
    CONFIG.publicToken = 'HvyhDYHDPgo3U4lB7s44jgtt'
    const data = await getPageProps(
      'demo-content/example-of-static-content',
      defaultOptions
    )
    expect(!!data.page).toBeTruthy()
    expect(!!data.settings).toBeTruthy()
  })
  test('support category box data', async () => {
    CONFIG.previewToken = 'kzEzh7cCQiMQAiu0hprJvAtt'
    CONFIG.publicToken = 'fqRVxeOrsSaQMUz203q3zgtt'
    const data = await getPageProps('/drilling-fluids', defaultOptions)
    const callback = (item: any) => {
      expect(item.category_box_data?.length).toBeGreaterThan(0)
    }
    recursiveTestCallback(data.page?.body ?? [], 'category_box', callback)
  })
})

function recursiveTestCallback(
  elements: any[],
  lookup: string,
  callback: (item: any) => void
) {
  let found = false
  const walkArray = (elements: any[]) => {
    for (const item of elements) {
      if (item.component === lookup) {
        callback(item)
        found = true
        // listWidgets.push(item)
      } else if (Array.isArray(item.body)) {
        walkArray(item.body)
      }
    }
  }
  walkArray(elements)
  expect(found).toBeTruthy()
}

function callbackFormTest(item: any) {
  const currentFormToTest = item.form_data
  expect(!!currentFormToTest).toBeTruthy()
  expect(typeof currentFormToTest?.formId).toBe('string')
  expect(typeof currentFormToTest?.title).toBe('string')
  expect(typeof currentFormToTest?.formAction).toBe('string')
  expect((currentFormToTest?.fields?.length || 0) > 1).toBeTruthy()
}
