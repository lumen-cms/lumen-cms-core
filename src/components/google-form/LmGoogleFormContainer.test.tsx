// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import Container from './LmGoogleFormContainer'
import type { LmGoogleFormProps } from './googleFormProps'
type FormProps = {
  formStructure: LmGoogleFormProps['content']['form_data']
  content: LmGoogleFormProps['content']
}
const observed = vi.hoisted(() => ({ props: {} as FormProps }))
vi.mock('next/dynamic', () => ({
  default: () =>
    function Form(props: FormProps) {
      observed.props = props
      return (
        <div>
          <input defaultValue="" />
          <span>{props.formStructure.title}</span>
        </div>
      )
    }
}))
it('passes current form data without remounting the form on schema updates', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  const first = { title: 'First', action: 'first', fields: [] }
  const content = {
    _uid: 'form',
    component: 'form',
    submit_button: [],
    form_data: first
  } as unknown as LmGoogleFormProps['content']
  try {
    await act(async () => root.render(<Container content={content} />))
    const input = host.querySelector('input')!
    input.value = 'Unsaved'
    input.focus()
    const next = {
      ...content,
      form_data: { ...content.form_data, title: 'Updated', action: 'updated' }
    }
    await act(async () => root.render(<Container content={next} />))
    expect(observed.props.formStructure).toBe(next.form_data)
    expect(observed.props.content).toBe(next)
    expect(host.textContent).toBe('Updated')
    expect(host.querySelector('input')).toBe(input)
    expect(input.value).toBe('Unsaved')
    expect(document.activeElement).toBe(input)
  } finally {
    await act(async () => root.unmount())
    host.remove()
  }
})
