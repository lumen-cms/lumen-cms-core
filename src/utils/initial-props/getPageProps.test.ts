import { CONFIG } from '@CONFIG'
import getPageProps from './getPageProps'

// make sure tokens of theme.lumen.media
CONFIG.previewToken = 'irBTkf8Yqq6UJvRRQH8Bmwtt'
CONFIG.publicToken = 'HvyhDYHDPgo3U4lB7s44jgtt'
const defaultOptions = {
  locale: 'en',
  insideStoryblok: false,
  defaultLocale: 'en',
  locales: ['en']
}
describe('Get page props of a certain URL', () => {
  test('fetch url that consists list widget data', async () => {
    const data = await getPageProps(
      'demo-content/playground/testing-list-widget',
      defaultOptions
    )
    expect(!!data.page).toBeTruthy()
    expect(!!data.listWidgetData).toBeTruthy()
    expect(
      !!data.listWidgetData?.['6fb9accb-0c7f-4f43-95bb-66d642b304ab']
    ).toBeTruthy() // make sure that the _uid of the list widget actually exist and did not change
  })

  test('fetch url that consists form data', async () => {
    const data = await getPageProps('request-demo', defaultOptions)
    expect(!!data.page).toBeTruthy()
    const currentFormToTest =
      data.formData?.['a5597a5f-96d4-4cc1-b2a2-389f6c02e0c2']
    expect(!!currentFormToTest).toBeTruthy()
    expect(typeof currentFormToTest?.formId).toBe('string')
    expect(typeof currentFormToTest?.description).toBe('string')
    expect(typeof currentFormToTest?.title).toBe('string')
    expect(typeof currentFormToTest?.formAction).toBe('string')
    // @ts-ignore
    expect(currentFormToTest?.fields?.length > 1).toBeTruthy()
  })
  test('fetch url that consists form data in the footer', async () => {
    // commercentric uses it
    CONFIG.previewToken = '2mjT0ume8F2Oo232GKgRxgtt'
    CONFIG.publicToken = 'ogW5NFWib7hFRkHdzc56ewtt'
    const data = await getPageProps('/', defaultOptions)
    expect(!!data.page).toBeTruthy()
    const currentFormToTest =
      data.formData?.['63584b1a-06be-425a-a48c-da9accd8d440']
    expect(!!currentFormToTest).toBeTruthy()
    expect(typeof currentFormToTest?.formId).toBe('string')
    // expect(typeof currentFormToTest?.description).toBe('string') // has no description
    expect(typeof currentFormToTest?.title).toBe('string')
    expect(typeof currentFormToTest?.formAction).toBe('string')
    // @ts-ignore
    expect(currentFormToTest?.fields?.length > 1).toBeTruthy()
  })
})
