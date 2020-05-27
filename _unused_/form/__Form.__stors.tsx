import { storiesOf } from '@storybook/react'
import Form from './Form'
import {
  ButtonStoryblok,
  FormCheckboxStoryblok,
  FormSelectOptionStoryblok,
  FormSelectStoryblok,
  FormStoryblok,
  FormTextfieldStoryblok
} from '../../typings/generated/components-schema'

const field1: FormTextfieldStoryblok = {
  _uid: '123',
  component: 'form_textfield',
  label: 'First text',
  name: 'first'
}
const field2: FormTextfieldStoryblok = {
  _uid: '1123',
  component: 'form_textfield',
  label: 'Second text',
  name: 'second'
}

const email: FormTextfieldStoryblok = {
  _uid: '123123',
  component: 'form_textfield',
  label: 'Email',
  name: 'email',
  required: true
}

const select: FormSelectStoryblok = {
  _uid: '234234',
  component: 'form_select',
  name: 'select',
  label: 'Select',
  options: [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }] as FormSelectOptionStoryblok[]
}

const check: FormCheckboxStoryblok = {
  _uid: '2314124',
  component: 'form_checkbox',
  label: 'Checkbox',
  name: 'check'
}

const button: ButtonStoryblok = {
  _uid: '23423',
  component: 'button',
  label: 'Submit'
}

const props: FormStoryblok = {
  _uid: '123312',
  component: 'form',
  body: [field1, field2, email, select, check, button]
}

const props2: FormStoryblok = {
  _uid: '3545234',
  component: 'form',
  border: ['outlined'],
  body: [field1, field2, email, select, check, button]
}

const props3: FormStoryblok = {
  _uid: '32424322',
  component: 'form',
  border: ['shaped', 'outlined'],
  body: [field1, field2, email, select, check, button]
}

storiesOf('Form', module)
  .add(
    'Form',
    () => (
      <>
        <Form content={props} />
      </>
    )
  )
  .add(
    'Outlined Form',
    () => (
      <>
        <Form content={props2} />
      </>
    )
  )
  .add(
    'Shaped Outlined Form',
    () => (
      <>
        <Form content={props3} />
      </>
    )
  )
