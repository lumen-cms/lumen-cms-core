import { formHandling } from './formHandling'
// import { FormattedOption, Select } from '@rmwc/select'
import * as React from 'react'
import { ChangeEvent, FunctionComponent, useState } from 'react'
import { FormSelectStoryblok } from '../../typings/generated/components-schema'
import Select from '@form/material-ui/dist/SelectElement'

const FormSelect: FunctionComponent<FormSelectStoryblok> = (content) => {
  let inputRef: HTMLInputElement
  const { msg, onInputChange } = formHandling({
    helpText: content.help_text,
    helpTextPersistent: content.help_text_persistent,
    errorMsgRequired: content.errorMsgRequired,
    errorMsgEmail: content.errorMsgEmail
  })
  let [value, setValue] = useState('')

  function onChange(ev: ChangeEvent<HTMLInputElement>) {
    setValue(ev.target.value)
  }

  //  outlined={content.border.includes('outlined')}
  return <Select id={content._uid}
                 name={content.name}
                 label={content.label}
                 enhanced={false}
                 required={!!content.required}
                 value={value}
                 options={(content.options && content.options.map((i: any) => ({
                   value: i.value,
                   label: i.label
                 }))) || []}
                 inputRef={(el: any) => inputRef = el}
                 helpText={msg}
                 onBlur={() => onInputChange(inputRef)}
                 onChange={(ev: ChangeEvent<HTMLInputElement>) => onChange(ev)} />
}

export default FormSelect
