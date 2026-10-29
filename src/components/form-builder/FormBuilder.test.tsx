// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import FormBuilder from './FormBuilder'
import type { LmFormBuilderProps } from './formBuilderTypes'
const form = vi.hoisted(() => ({
  submit: undefined as undefined | ((data: any) => Promise<void>)
}))
vi.mock('react-hook-form-mui', () => ({
  FormContainer: ({ onSuccess, children }: any) => {
    form.submit = onSuccess
    return <div>{children}</div>
  }
}))
vi.mock('../google-form/GoogleFormElement', () => ({
  TextFieldElement: () => null
}))
vi.mock('../../vendor/grid', () => ({
  default: ({ children }: any) => <div>{children}</div>
}))
vi.mock('../CoreComponents', () => ({ LmComponentRender: () => null }))
it('preserves submitted payload precedence, falsy filtering and callback data', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.mocked(fetch).mockResolvedValue(new Response('{"ok":true}'))
  const root = createRoot(document.createElement('div'))
  const onSubmit = vi.fn()
  const content = {
    _uid: 'form',
    component: 'form_builder',
    endpoint: 'https://example.com/submit',
    additional_fields: [
      { name: 'source', value: 'CMS' },
      { name: 'zero', value: '0', is_number: true }
    ]
  } as unknown as LmFormBuilderProps['content']
  try {
    await act(async () =>
      root.render(
        <FormBuilder
          content={content}
          additional_fields={
            [
              { name: 'source', value: 'Caller' }
            ] as LmFormBuilderProps['additional_fields']
          }
          onSubmit={onSubmit}
        />
      )
    )
    const data = { source: 'Typed', name: 'Ada', current_address: '' }
    await act(async () => form.submit!(data))
    const [url, options] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe('https://example.com/submit')
    expect(options?.method).toBe('POST')
    expect(JSON.parse(options?.body as string)).toEqual({
      source: 'Caller',
      name: 'Ada'
    })
    expect(onSubmit).toHaveBeenCalledWith({ source: 'Typed', name: 'Ada' })
  } finally {
    await act(async () => root.unmount())
  }
})
