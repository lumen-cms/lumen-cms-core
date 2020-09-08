import React from 'react'
import { FormContainer, TextFieldElement } from 'react-form-hook-mui'
import { Button, LinearProgress } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { LmGoogleFormProps } from './googleFormProps'
import {
  GoogleFormFieldTypes,
  useGoogleForm
} from '../../utils/hooks/googleForms/useGoogleForm'

export function LmGoogleForm({ content }: LmGoogleFormProps): JSX.Element {
  const { formStructure } = useGoogleForm(content.api || '')
  console.log(formStructure)

  const onSubmit = (data: any) => {
    console.log(data)
  }
  if (!formStructure) {
    return <LinearProgress variant="query" />
  }
  const defaultValues = {}
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  formStructure.fields.forEach((formField, i) => {
    defaultValues[`field_${i}`] = ''
  })
  return (
    <div>
      <Typography variant="h5">{formStructure.title}</Typography>
      <Typography variant="subtitle1">{formStructure.description}</Typography>
      <FormContainer defaultValues={defaultValues}>
        {formStructure?.fields?.map((formField, i) => {
          const baseFieldProps = {
            key: formField.answerSubmitIdValue,
            label: formField.questionTextValue,
            name: `field_${i}`,
            required: formField.isRequired,
            variant: content.border,
            fullWidth: content.fields_full_width
          }
          const additionalProps: Record<string, any> = {}
          formField.isRequired &&
            (additionalProps.validation = content.error_msg_required)

          if (
            [
              GoogleFormFieldTypes['0'].name,
              GoogleFormFieldTypes['1'].name
            ].includes(formField.questionTypeName.name)
          ) {
            if (formField.questionTypeCode === 1) {
              additionalProps.multiline = true
              additionalProps.rows = 2
            }
            return <TextFieldElement {...baseFieldProps} {...additionalProps} />
          }
          return <div />
        })}
        <Button
          type="submit"
          color="primary"
          fullWidth={content.fields_full_width}
        >
          Submit
        </Button>
      </FormContainer>
    </div>
  )
}
