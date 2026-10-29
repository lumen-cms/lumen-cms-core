import { beforeEach, describe, expect, test } from 'vitest'
import { CONFIG } from '../config'
import getPageProps from './getPageProps'

const initialConfig = { ...CONFIG }
beforeEach(() => Object.assign(CONFIG, initialConfig))

function configureSpace(space: string) {
  const previewToken = process.env[`TEST_${space}_PREVIEW_TOKEN`]
  const publicToken = process.env[`TEST_${space}_PUBLIC_TOKEN`]
  if (!previewToken || !publicToken) {
    throw new Error(
      `Configure TEST_${space}_PREVIEW_TOKEN and TEST_${space}_PUBLIC_TOKEN in .env.test.local`
    )
  }
  Object.assign(CONFIG, { previewToken, publicToken, rootDirectory: '' })
}
const defaultOptions = {
  locale: 'en',
  insideStoryblok: false,
  defaultLocale: 'en',
  locales: ['en']
}

describe('Get page props of a certain URL', () => {
  test('fetch url that consists list widget data', async () => {
    configureSpace('DEMO')
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

  describe('fetch serialized widget data', () => {
    test('fetch url that consists list widget data search', async () => {
      configureSpace('UPSKILL')
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
  })

  test('fetch url that consists category data', async () => {
    configureSpace('UPSKILL')
    const data = await getPageProps('search', defaultOptions)
    expect(!!data.page).toBeTruthy()
    const callback = (item: any) => {
      expect(item.category_box_data?.length).toBeGreaterThan(0)
    }
    recursiveTestCallback(data.page?.right_body ?? [], 'category_box', callback)
  })

  test('fetch url that consists form data', async () => {
    configureSpace('PLANET')
    const data = await getPageProps('request-demo', defaultOptions)
    expect(!!data.page).toBeTruthy()

    recursiveTestCallback(data.page?.body ?? [], 'form', callbackFormTest)
  })
  test('fetch calendar entries', async () => {
    configureSpace('DEMO')
    const data = await getPageProps(
      'demo-content/event-calendar',
      defaultOptions
    )
    expect(!!data.page).toBeTruthy()
  })

  test('fetch list_stories entries', async () => {
    configureSpace('DEMO')
    const data = await getPageProps(
      'demo-content/list-stories-demo',
      defaultOptions
    )
    const callback = (item: any) => {
      const storyData = item.list_stories_data
      expect(typeof storyData?.total).toBe('number')
      expect(typeof storyData?.perPage).toBe('number')
      expect(typeof storyData?.data?.cv).toBe('number')
      expect(storyData?.data?.stories?.length > 0).toBeTruthy()
    }
    recursiveTestCallback(data.page?.body ?? [], 'list_stories', callback)
  })

  test('test translated page of home in ladenburg', async () => {
    configureSpace('LADENBURG')
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
    configureSpace('DEMO')
    const data = await getPageProps(
      'demo-content/example-of-static-content',
      defaultOptions
    )
    expect(!!data.page).toBeTruthy()
    expect(!!data.settings).toBeTruthy()
  })
  test('support category box data', async () => {
    configureSpace('UPSKILL')
    const data = await getPageProps('/search', defaultOptions)
    const callback = (item: any) => {
      expect(item.category_box_data?.length).toBeGreaterThan(0)
    }
    recursiveTestCallback(data.page?.right_body ?? [], 'category_box', callback)
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
  // expect(typeof currentFormToTest?.formId).toBe('string')
  expect(typeof currentFormToTest?.title).toBe('string')
  expect(typeof currentFormToTest?.action).toBe('string')
  expect((currentFormToTest?.fields?.length || 0) > 1).toBeTruthy()
}
