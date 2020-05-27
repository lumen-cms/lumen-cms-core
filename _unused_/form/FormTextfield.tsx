import { formHandling } from './formHandling'
import { TextField } from '@rmwc/textfield'
import { FunctionComponent } from 'react'
import { FormTextfieldStoryblok } from '../../typings/generated/components-schema'
import * as React from 'react'

const FormTextfield: FunctionComponent<FormTextfieldStoryblok> = (content) => {
  let inputRef: HTMLInputElement
  const { msg, onInputChange } = formHandling({
    helpText: content.help_text,
    helpTextPersistent: content.help_text_persistent,
    errorMsgRequired: content.errorMsgRequired,
    errorMsgEmail: content.errorMsgEmail
  })

  const fieldProps = {
    id: content._uid,
    name: content.name,
    label: content.label || 'label',
    type: content.type || 'text',
    required: !!content.required,
    outlined: content.border.includes('outlined'),
    textarea: content.textarea,
    inputRef: (el: any) => inputRef = el,
    helpText: msg,
    onBlur: () => onInputChange(inputRef)
  }

  if (fieldProps.textarea) {
    delete fieldProps.type
    fieldProps.outlined = true
  }
  return <TextField {...fieldProps} />
}

export default FormTextfield
