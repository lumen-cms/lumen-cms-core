/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react'
import {
  DatePickerElement,
  FormContainer,
  MultiSelectElement,
  SelectElement,
  TextFieldElement
} from 'react-form-hook-mui'
import { LinearProgress } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Box from '@material-ui/core/Box'
import { LmGoogleFormProps } from './googleFormProps'
import { useGoogleForm } from '../../utils/hooks/googleForms/useGoogleForm'
import { LmComponentRender } from '../CoreComponents'

class LocalizedUtils extends DateFnsUtils {
  dateFormat = 'P'
}

export function LmGoogleForm({ content }: LmGoogleFormProps): JSX.Element {
  const { formStructure } = useGoogleForm(content.api || '')
  // console.log(content, formStructure)

  const onSubmit = async (data: any) => {
    if (!formStructure?.formAction) {
      return
    }
    // url(https://medium.com/@levvi/how-to-use-google-forms-as-a-free-email-service-for-your-custom-react-form-or-any-other-1aa837422a4)

    const formData = new FormData()

    Object.keys(data).forEach((entryId) => {
      if (Array.isArray(data[entryId])) {
        data[entryId].forEach((str: string) => {
          formData.append(`entry.${entryId}`, str)
        })
      } else if (typeof data[entryId] === 'string') {
        formData.append(`entry.${entryId}`, data[entryId])
      } else if (typeof data[entryId] === 'object') {
        const d = new Date(data[entryId])
        if (!d) {
          // setError(true)
          return
        }
        formData.append(`entry.${entryId}_year`, `${d.getFullYear()}`)
        formData.append(`entry.${entryId}_month`, `${d.getMonth()}`)
        formData.append(`entry.${entryId}_day`, `${d.getDay()}`)
      }
    })
    await fetch(formStructure.formAction, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })
  }
  if (!formStructure) {
    return <LinearProgress variant="query" />
  }

  const baseStyle: React.CSSProperties = {
    margin: `${Number(content.fields_gap) || 2}px`,
    maxWidth: `calc(100% - ${Number(content.fields_gap || 2) * 2}px)`,
    minWidth: `${content.fields_min_width || 180}px`
  }
  const defaultValues = {}
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  formStructure.fields.forEach((formField) => {
    if ([2, 4].includes(formField.questionTypeCode)) {
      defaultValues[`${formField.answerSubmitIdValue}_sentinel`] = ''
    }
    defaultValues[`${formField.answerSubmitIdValue}`] =
      formField.questionTypeCode === 9 ? null : ''
  })
  return (
    <div>
      <Typography variant="h5">{formStructure.title}</Typography>
      <Typography variant="subtitle1">{formStructure.description}</Typography>
      <MuiPickersUtilsProvider utils={LocalizedUtils}>
        <FormContainer
          defaultValues={defaultValues}
          // @ts-ignore
          onSuccess={onSubmit}
        >
          {formStructure?.fields?.map((formField) => {
            const hasVariant = ![9].includes(formField.questionTypeCode)
            const baseFieldProps = {
              key: formField.answerSubmitIdValue,
              label: formField.questionTextValue,
              name: `${formField.answerSubmitIdValue}`,
              // required: formField.isRequired,
              // parserError: formField.isRequired // @TODO - not working yet
              //   ? () => content.error_msg_required
              //   : undefined,
              fullWidth: content.fields_full_width,
              style:
                formField.questionTypeCode === 4
                  ? {
                      maxWidth: baseStyle.maxWidth,
                      minWidth: baseStyle.minWidth
                    }
                  : baseStyle
            }
            const additionalProps: Record<string, any> = {}
            formField.isRequired &&
              (additionalProps.validation = content.error_msg_required)
            if (hasVariant) {
              additionalProps.variant = content.fields_border
            }

            if ([0, 1].includes(formField.questionTypeCode)) {
              if (formField.questionTypeCode === 1) {
                additionalProps.multiline = true
                additionalProps.rows = 2
              }
              return (
                <TextFieldElement {...baseFieldProps} {...additionalProps} />
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
                    options={formField.answerOptionsList.sort().map((opt) => ({
                      id: opt,
                      title: opt || '--'
                    }))}
                    {...baseFieldProps}
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
                    menuItems={formField.answerOptionsList
                      .sort()
                      .filter((opt) => !!opt)}
                    {...baseFieldProps}
                  />
                </div>
              )
            }
            if (formField.questionTypeCode === 9) {
              return (
                <DatePickerElement
                  {...baseFieldProps}
                  inputVariant={content.fields_border}
                />
              )
            }
            return null
          })}
          <Box>
            {(content?.submit_button || []).map((blok) => (
              <LmComponentRender
                content={{
                  color: 'primary',
                  variant: 'contained',
                  label: 'Submit',
                  ...blok
                }}
                key={blok._uid}
                type="submit"
              />
            ))}
          </Box>
        </FormContainer>
      </MuiPickersUtilsProvider>
    </div>
  )
}
