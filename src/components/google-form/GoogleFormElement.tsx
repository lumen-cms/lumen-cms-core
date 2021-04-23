import {
  DatePickerElement,
  MultiSelectElement,
  SelectElement,
  TextFieldElement
} from 'react-form-hook-mui'
import React, { CSSProperties } from 'react'
import { StructuredFormFieldProps } from '../../utils/hooks/googleForms/parseHijackedFormData'
import { LmGoogleFormProps } from './googleFormProps'

type GoogleFormElementProps = {
  formField: StructuredFormFieldProps
  options: LmGoogleFormProps['content']
  baseStyle: CSSProperties
}

export default function GoogleFormElement({
  formField,
  options,
  baseStyle
}: GoogleFormElementProps): JSX.Element | null {
  const hasVariant = ![9].includes(formField.questionTypeCode)
  const baseFieldProps = {
    label: formField.questionTextValue,
    name: `${formField.answerSubmitIdValue}`,
    fullWidth: options.fields_full_width,
    style:
      formField.questionTypeCode === 4
        ? {
            maxWidth: baseStyle.maxWidth,
            minWidth: baseStyle.minWidth
          }
        : baseStyle
  }
  const additionalProps: Record<string, any> = {}
  if (hasVariant) {
    additionalProps.variant = options.fields_border
  }

  if ([0, 1].includes(formField.questionTypeCode)) {
    if (formField.questionTypeCode === 1) {
      additionalProps.multiline = true
      additionalProps.rows = 2
    }
    return (
      <TextFieldElement
        {...baseFieldProps}
        {...additionalProps}
        required={formField.isRequired}
        parseError={
          options?.error_msg_required
            ? () => options.error_msg_required
            : undefined
        }
      />
    )
  }
  if ([2, 3].includes(formField.questionTypeCode)) {
    return (
      <>
        {formField.questionTypeCode === 2 && (
          <TextFieldElement
            name={`${formField.answerSubmitIdValue}_sentinel`}
            hidden
            style={{ display: 'none' }}
          />
        )}

        <SelectElement
          required={formField.isRequired}
          parseError={
            options?.error_msg_required
              ? () => options.error_msg_required
              : undefined
          }
          options={formField.answerOptionsList.sort().map((opt) => ({
            id: opt,
            title: opt || '--'
          }))}
          {...baseFieldProps}
          {...additionalProps}
        />
      </>
    )
  }
  if (formField.questionTypeCode === 4) {
    return (
      <div
        style={{
          margin: baseStyle.margin,
          display: 'inline-flex',
          width: baseFieldProps.fullWidth ? '100%' : 'inherit'
        }}
      >
        <TextFieldElement
          name={`${formField.answerSubmitIdValue}_sentinel`}
          hidden
          style={{ display: 'none' }}
        />
        <MultiSelectElement
          required={formField.isRequired}
          parseError={
            options?.error_msg_required
              ? () => options.error_msg_required
              : undefined
          }
          menuItems={formField.answerOptionsList.sort().filter((opt) => !!opt)}
          {...baseFieldProps}
          {...additionalProps}
        />
      </div>
    )
  }
  if (formField.questionTypeCode === 9) {
    return (
      <DatePickerElement
        required={formField.isRequired}
        parseError={
          options?.error_msg_required
            ? () => options.error_msg_required
            : undefined
        }
        {...baseFieldProps}
        inputVariant={options.fields_border}
      />
    )
  }
  return null
}
