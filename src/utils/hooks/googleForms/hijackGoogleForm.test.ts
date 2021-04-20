import parseHijackedFormData from './parseHijackedFormData'
import { fetchGoogleFormData } from '../../initial-props/fetchGoogleFormData'

const url =
  'https://docs.google.com/forms/d/e/1FAIpQLSes6yWGcxLs8whdFm4G0peQi0RxNvWsiUkn9jhT93rE9nLwUQ/viewform?embedded=true'

describe('Try fetch form on server', () => {
  test('hijack google form', async () => {
    const res = await fetchGoogleFormData(url)
    const parsedData = parseHijackedFormData(res)
    expect(typeof parsedData.title).toBe('string')
    expect(typeof parsedData.description).toBe('string')
    expect(typeof parsedData.formId).toBe('string')
    expect(Array.isArray(parsedData.fields)).toBeTruthy()
    expect(parsedData.fields.length > 1).toBeTruthy()
  })
})
