import { describe, expect, test, vi } from 'vitest'
import { googleFormGetData } from './googleFormData'
import { googleFormsToJson } from './googleFormsToJson'

// Minimal public-form HTML fixture covering the field shapes this renderer uses.
const formDefinition = [
  null,
  [
    'Application description',
    [
      [1, 'Name', null, 0, [[101, null, 1]]],
      [2, 'Interests', null, 4, [[102, [['Design'], ['Teaching']], 0]]],
      [3, 'Start date', null, 9, [[103, null, 1]]]
    ],
    null,
    null,
    null,
    null,
    null,
    null,
    'Application'
  ],
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  'test-form'
]
const formHtml = `<input name="fbzx" value="fixture-token"><script>var FB_PUBLIC_LOAD_DATA_ = ${JSON.stringify(
  formDefinition
)};</script>`
const url = 'https://docs.google.com/forms/d/e/test-form/viewform'

describe('Google Form parsing', () => {
  test('preserves labels, required fields, choices and date fields', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(formHtml))
    const data = await googleFormsToJson(url)
    expect(data.title).toBe('Application')
    expect(data.action).toBe('test-form')
    expect(data.fieldsOrder).toEqual({ '101': 0, '102': 1, '103': 2 })
    expect(data.fields).toEqual([
      {
        id: '101',
        label: 'Name',
        description: null,
        type: 'SHORT_ANSWER',
        required: true
      },
      {
        id: '102',
        label: 'Interests',
        description: null,
        type: 'CHECKBOX',
        required: false,
        options: [
          { label: 'Design', custom: false },
          { label: 'Teaching', custom: false }
        ]
      },
      {
        id: '103',
        label: 'Start date',
        description: null,
        type: 'DATE',
        required: true
      }
    ])
  })

  test('rejects unsupported URLs before making a request', async () => {
    await expect(
      googleFormsToJson('https://example.com/viewform')
    ).rejects.toThrow('Invalid google forms host')
    expect(fetch).not.toHaveBeenCalled()
  })

  test('returns null for a form that no longer exposes a schema', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('<html>Form unavailable</html>')
    )
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(
      await googleFormGetData({
        api: url,
        submit_button: [],
        _uid: 'test',
        component: 'form'
      })
    ).toBeNull()
    expect(log).toHaveBeenCalled()
  })

  test('does not fetch when no form URL is configured', async () => {
    expect(
      await googleFormGetData({
        submit_button: [],
        _uid: 'test',
        component: 'form'
      })
    ).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })
})

test.each([403, 404, 429, 500])(
  'rejects HTTP %s before parsing a form-shaped response and preserves the null fallback',
  async (status) => {
    const response = new Response(formHtml, { status })
    const text = vi.spyOn(response, 'text')
    vi.mocked(fetch).mockResolvedValue(response)
    await expect(googleFormsToJson(url)).rejects.toThrow(
      `Google Form request failed: ${status}`
    )
    expect(text).not.toHaveBeenCalled()
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(
      await googleFormGetData({
        api: url,
        submit_button: [],
        _uid: 'test',
        component: 'form'
      })
    ).toBeNull()
    expect(log).toHaveBeenCalled()
  }
)
