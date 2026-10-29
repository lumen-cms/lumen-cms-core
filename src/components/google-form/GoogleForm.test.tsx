// @vitest-environment happy-dom
import { act, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import Form from './GoogleForm'
const seen = vi.hoisted(() => ({
  form: {} as Record<string, any>,
  button: {} as Record<string, any>,
  fields: [] as Record<string, any>[],
  submit: vi.fn(async () => true)
}))
vi.mock('react-hook-form-mui', () => ({
  FormContainer: ({ children, ...p }: { children: ReactNode }) => {
    seen.form = p
    return <form>{children}</form>
  }
}))
vi.mock('../../vendor/google-forms', () => ({
  submitToGoogleForms: seen.submit
}))
vi.mock('./GoogleFormElement', () => ({
  default: (p: Record<string, any>) => {
    seen.fields.push(p)
    return <input data-field={p.formField.id} />
  },
  TextFieldElement: () => <input name="current_address" />
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content, ...p }: Record<string, any>) => {
    seen.button = { content, ...p }
    return <button type={p.type}>{content.label || content._uid}</button>
  }
}))
vi.mock('next/dynamic', () => ({
  default:
    () =>
    ({ children }: { children: ReactNode }) =>
      <div data-date-provider>{children}</div>
}))
type Content = Parameters<typeof Form>[0]['content']
const structure = {
  action: 'https://example.com/submit',
  title: 'Form',
  fields: [
    { id: 'text', type: 'SHORT_ANSWER' },
    { id: 'date', type: 'DATE' }
  ],
  fieldsOrder: {},
  fvv: 1,
  pageHistory: 0,
  fbzx: ''
} as Parameters<typeof Form>[0]['formStructure']
const content = {
  _uid: 'form',
  component: 'form',
  api: true,
  submit_button: [
    {
      _uid: 'submit',
      component: 'button',
      label: 'Send',
      align: 'right',
      link: { url: '/wrong' }
    }
  ],
  form_data: structure
} as unknown as Content
async function check(
  test: (
    render: (c?: Partial<Content>) => Promise<void>,
    host: HTMLDivElement
  ) => Promise<void>
) {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  seen.submit.mockClear()
  seen.submit.mockResolvedValue(true)
  seen.fields = []
  const host = document.createElement('div'),
    root = createRoot(host)
  const render = async (c: Partial<Content> = {}) => {
    await act(async () =>
      root.render(
        <Form formStructure={structure} content={{ ...content, ...c }} />
      )
    )
  }
  try {
    await test(render, host)
  } finally {
    await act(async () => root.unmount())
  }
}
it('preserves date defaults, submit overrides, field styles and inline spacing', async () =>
  check(async (render, host) => {
    await render({ fields_gap: '0', fields_min_width: '240' })
    expect(seen.form.defaultValues).toEqual({ text: '', date: null })
    expect(host.querySelector('[data-date-provider]')).not.toBeNull()
    expect(seen.button).toMatchObject({
      type: 'submit',
      content: {
        label: 'Send',
        color: 'primary',
        variant: 'contained',
        link: undefined
      }
    })
    expect(seen.fields[0].baseStyle).toEqual({
      margin: '2px',
      maxWidth: 'calc(100% - 0px)',
      minWidth: '240px'
    })
    expect(
      host.querySelector('button')!.parentElement!.style.justifyContent
    ).toBe('right')
    expect(host.querySelector('button')!.parentElement!.style.marginTop).toBe(
      '0px'
    )
    await render({ inline: true, fields_gap: undefined })
    expect(host.querySelector('button')!.parentElement!.style.marginLeft).toBe(
      '8px'
    )
    await render({ submit_button: [] })
    expect(host.querySelector('button')).toBeNull()
  }))
it('preserves honeypot rejection and successful submission transition', async () =>
  check(async (render, host) => {
    await render()
    await act(async () =>
      seen.form.onSuccess({ current_address: 'bot', text: 'Hi' })
    )
    expect(seen.submit).not.toHaveBeenCalled()
    const data = { current_address: '', text: 'Hi' }
    await act(async () => seen.form.onSuccess(data))
    expect(seen.submit).toHaveBeenCalledWith(structure, { text: 'Hi' })
    expect(host.textContent).toContain('Submit successfull')
  }))
it('preserves configured success content and the existing unsuccessful-result behavior', async () =>
  check(async (render, host) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    seen.submit.mockResolvedValue(false)
    try {
      await render({
        success_body: [{ _uid: 'thanks', component: 'paragraph' }]
      } as unknown as Partial<Content>)
      await act(async () => seen.form.onSuccess({ text: 'Hi' }))
      expect(error).toHaveBeenCalledWith('not successful submitted')
      expect(host.textContent).toContain('thanks')
    } finally {
      error.mockRestore()
    }
  }))
