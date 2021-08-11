import { Meta } from '@storybook/react'
import LmFormBuilder from './FormBuilder'
import { FormBuilderStoryblok } from '../../typings/generated/components-schema'

export default {
  title: 'Design/Inputs/FormBuilder'
} as Meta

const endpoint = 'http://localhost:3000/api/form-endpoint'

const formFields = [
  {
    component: 'form_textfield',
    _uid: 'name',
    name: 'name',
    label: 'Text Field',
    required: true
  },
  {
    component: 'form_textfield',
    _uid: 'email',
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true
  },
  {
    component: 'form_textfield',
    _uid: 'phone',
    name: 'phone',
    label: 'Phone'
  },
  {
    component: 'form_select',
    _uid: 'select',
    name: 'select',
    label: 'Select option',
    options: [
      {
        _uid: '1',
        component: 'form_select_option',
        value: '1',
        label: 'Mrs.'
      },
      {
        _uid: '2',
        component: 'form_select_option',
        value: '2',
        label: 'Mr.'
      }
    ]
  },
  {
    component: 'form_textfield',
    _uid: 'comment',
    name: 'comment',
    label: 'Comment',
    textarea: true
  },
  {
    component: 'form_checkbox',
    _uid: 'checkbox',
    name: 'agb',
    label: 'Accept AGB',
    required: true
  }
] as FormBuilderStoryblok['fields']
const submit = [
  {
    component: 'button',
    _uid: 'button_submit',
    label: 'Submit'
  }
] as FormBuilderStoryblok['submit']
export const Basic = () => {
  return (
    <LmFormBuilder
      content={{
        _uid: 'basic',
        component: 'form_builder',
        submit: submit,
        fields: formFields?.slice(0)
      }}
    />
  )
}
export const Spacing = () => {
  return (
    <LmFormBuilder
      content={{
        _uid: 'spacing',
        component: 'form_builder',
        spacing: 2,
        variant: 'outlined',
        submit: submit,
        fields: formFields?.slice(0)
      }}
    />
  )
}
export const InlineForm = () => (
  <LmFormBuilder
    content={{
      _uid: 'inline',
      component: 'form_builder',
      form_inline: true,
      endpoint,
      submit: submit,
      fields: formFields?.slice(0, 2).map((i) => {
        i.placeholder = i.label
        i._uid = i._uid + 'inline'
        delete i.label
        return i
      })
    }}
  />
)
