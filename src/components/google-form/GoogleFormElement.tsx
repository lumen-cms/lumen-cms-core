import React, { CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import {
  DatePickerElementProps,
  MultiSelectElementProps,
  SelectElementProps,
  TextFieldElementProps
} from 'react-hook-form-mui'
import { LmGoogleFormProps } from './googleFormProps'
import { FieldWithDate } from '../../utils/initial-props/component-data/googleFormsToJsonTypes'

export const TextFieldElement = dynamic<TextFieldElementProps>(() =>
  import('react-hook-form-mui').then((mod) => mod.TextFieldElement)
)
const SelectElement = dynamic<SelectElementProps<any>>(() =>
  import('react-hook-form-mui').then((mod) => mod.SelectElement)
)
const DatePickerElement = dynamic<DatePickerElementProps<any, any>>(() =>
  import('react-hook-form-mui').then((mod) => mod.DatePickerElement)
)
const MultiSelectElement = dynamic<MultiSelectElementProps<any>>(() =>
  import('react-hook-form-mui').then((mod) => mod.MultiSelectElement)
)

type GoogleFormElementProps = {
  formField: FieldWithDate
  options: LmGoogleFormProps['content']
  baseStyle: CSSProperties
}

/*

questionTypeCode 4: multi select
questionTypeCode 9: date picker
questionTypeCode 1: textarea
questionTypeCode 0: text field
questionTypeCode 2,3: select
4 = DROPDOWN


 */

export default function GoogleFormElement({
  formField,
  options,
  baseStyle
}: GoogleFormElementProps): JSX.Element | null {
  const hasVariant = !['DATE'].includes(formField.type)
  const baseFieldProps = {
    ...(options.label_as_placeholder
      ? {
          placeholder: formField.label
        }
      : {
          label: formField.label
        }),
    name: `${formField.id}`,
    fullWidth: options.fields_full_width,
    style: baseStyle
    /* formField.questionTypeCode === 4
      formField.type === 'DROPDOWN'
        ? {
            maxWidth: baseStyle.maxWidth,
            minWidth: baseStyle.minWidth
          }
        : baseStyle*/
  }
  const additionalProps: Record<string, any> = {}
  if (hasVariant) {
    additionalProps.variant = options.fields_border
  }

  if (formField.type === 'SHORT_ANSWER' || formField.type === 'LONG_ANSWER') {
    if (formField.type === 'LONG_ANSWER') {
      additionalProps.multiline = true
      additionalProps.rows = 2
    }
    return (
      <TextFieldElement
        {...baseFieldProps}
        {...additionalProps}
        required={formField.required}
        parseError={
          options?.error_msg_required
            ? () => options.error_msg_required as string
            : undefined
        }
      />
    )
  }
  if (formField.type === 'DROPDOWN' || formField.type === 'RADIO') {
    return (
      <SelectElement
        {...baseFieldProps}
        {...additionalProps}
        options={formField.options.sort().map((opt) => ({
          id: opt.label,
          title: opt.label || '--'
        }))}
        required={formField.required}
        parseError={
          options?.error_msg_required
            ? () => options.error_msg_required as string
            : undefined
        }
      />
    )
  }

  if (formField.type === 'CHECKBOX') {
    return (
      <MultiSelectElement
        required={formField.required}
        parseError={
          options?.error_msg_required
            ? () => options.error_msg_required as string
            : undefined
        }
        options={formField.options
          .sort()
          .filter((opt) => !!opt.label)
          .map((opt) => opt.label)}
        {...baseFieldProps}
        {...additionalProps}
      />
    )
  }

  if (formField.type === 'DATE') {
    return (
      <DatePickerElement
        required={formField.required}
        parseError={
          options?.error_msg_required
            ? () => options.error_msg_required as string
            : undefined
        }
        {...baseFieldProps}
      />
    )
  }
  console.log('i am here')
  return null
}
