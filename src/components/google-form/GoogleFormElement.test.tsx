import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import GoogleFormElement from './GoogleFormElement'
import type { FieldWithDate } from '../../utils/initial-props/component-data/googleFormsToJsonTypes'

const fields = vi.hoisted(() => ({
  options: undefined as unknown,
  props: {} as Record<string, any>
}))
vi.mock('react-hook-form-mui', () => ({
  SelectElement: (props: Record<string, any>) => {
    const { options } = props
    fields.props = props
    fields.options = options
    return <select />
  },
  MultiSelectElement: (props: Record<string, any>) => {
    const { options } = props
    fields.props = props
    fields.options = options
    return <select multiple />
  },
  TextFieldElement: (props: Record<string, any>) => {
    fields.props = props
    return <input />
  }
}))
vi.mock('next/dynamic', () => ({
  default: () => (props: Record<string, any>) => {
    fields.props = props
    return <input type="date" />
  }
}))

it.each(['DROPDOWN', 'RADIO', 'CHECKBOX'])(
  'renders %s from frozen shared options without changing ordering or blank-label handling',
  (type) => {
    const options = Object.freeze([
      Object.freeze({ label: 'Zulu' }),
      Object.freeze({ label: 'Alpha' }),
      Object.freeze({ label: '' })
    ])
    const field = Object.freeze({
      id: 'choice',
      label: 'Choose',
      required: true,
      type,
      options
    })
    renderToStaticMarkup(
      <GoogleFormElement
        formField={field as unknown as FieldWithDate}
        options={{
          component: 'form',
          _uid: 'form',
          submit_button: [],
          form_data: {
            title: 'Test',
            action: '',
            fvv: 1,
            pageHistory: 0,
            fbzx: '',
            fields: [],
            fieldsOrder: {}
          }
        }}
        baseStyle={{}}
      />
    )
    expect(field.options).toBe(options)
    expect(options.map((option) => option.label)).toEqual(['Zulu', 'Alpha', ''])
    expect(fields.options).toEqual(
      type === 'CHECKBOX'
        ? ['Zulu', 'Alpha']
        : [
            { id: 'Zulu', label: 'Zulu' },
            { id: 'Alpha', label: 'Alpha' },
            { id: '', label: '--' }
          ]
    )
  }
)

it.each([
  'SHORT_ANSWER',
  'LONG_ANSWER',
  'DROPDOWN',
  'RADIO',
  'CHECKBOX',
  'DATE'
])('preserves shared styling, labels and validation for %s', (type) => {
  const baseStyle = { margin: '2px' }
  const formField = {
    id: 'field',
    label: 'Question',
    required: true,
    type,
    options: [{ label: 'One' }]
  } as FieldWithDate
  const options = {
    component: 'form',
    _uid: 'form',
    submit_button: [],
    fields_full_width: true,
    fields_border: 'outlined',
    error_msg_required: 'Required please'
  } as unknown as Parameters<typeof GoogleFormElement>[0]['options']
  for (const placeholder of [false, true]) {
    renderToStaticMarkup(
      <GoogleFormElement
        formField={formField}
        options={{ ...options, label_as_placeholder: placeholder }}
        baseStyle={baseStyle}
      />
    )
    expect(fields.props.name).toBe('field')
    expect(fields.props.required).toBe(true)
    expect(fields.props.style).toBe(baseStyle)
    expect(fields.props.fullWidth).toBe(true)
    expect(fields.props.parseError()).toBe('Required please')
    expect(fields.props[placeholder ? 'placeholder' : 'label']).toBe('Question')
    expect(fields.props[placeholder ? 'label' : 'placeholder']).toBeUndefined()
    expect(fields.props.variant).toBe(type === 'DATE' ? undefined : 'outlined')
    expect(fields.props.multiline).toBe(
      type === 'LONG_ANSWER' ? true : undefined
    )
    expect(fields.props.rows).toBe(type === 'LONG_ANSWER' ? 2 : undefined)
    if (type === 'DATE')
      expect(fields.props.inputProps).toEqual({
        fullWidth: true,
        style: baseStyle
      })
  }
  renderToStaticMarkup(
    <GoogleFormElement
      formField={{ ...formField, required: false }}
      options={{ ...options, error_msg_required: '' }}
      baseStyle={baseStyle}
    />
  )
  expect(fields.props.parseError).toBeUndefined()
  expect(fields.props.required).toBe(false)
})
