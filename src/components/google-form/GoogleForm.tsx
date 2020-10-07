/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useState } from 'react'
import {
  DatePickerElement,
  FormContainer,
  MultiSelectElement,
  SelectElement,
  TextFieldElement
} from 'react-form-hook-mui'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Alert from '@material-ui/lab/Alert'
import { LmComponentRender } from '@LmComponentRender'
import { LmGoogleFormProps } from './googleFormProps'
import { useGoogleForm } from '../../utils/hooks/googleForms/useGoogleForm'
import {
  ButtonStoryblok,
  RichTextEditorStoryblok
} from '../../typings/generated/components-schema'
import { hasFacebookPixel, hasGtag } from '../../utils/analyticsHelper'

class LocalizedUtils extends DateFnsUtils {
  dateFormat = 'P'
}

export default function LmGoogleForm({
  content
}: LmGoogleFormProps): JSX.Element {
  const { formStructure } = useGoogleForm(content.api || '')
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  // @TODO mode is no-cors, can't detect result status
  // const [submitError, setSubmitError] = useState<boolean>(false)

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
    if (hasGtag()) {
      window.gtag('event', 'generate_lead')
    }
    if (hasFacebookPixel()) {
      window.fbq('track', 'GoogleForm')
    }
    await fetch(formStructure.formAction, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })

    setSubmitSuccess(true)
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

  if (submitSuccess) {
    return (
      <Alert severity="success">
        {content?.success_body?.length ? (
          <LmComponentRender
            content={
              {
                ...content.success_body[0]
              } as RichTextEditorStoryblok
            }
            type="submit"
            key={content.success_body[0]._uid}
          />
        ) : (
          'Submit successfull'
        )}
      </Alert>
    )
  }

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
            const key = `${formField.answerSubmitIdValue}`
            const hasVariant = ![9].includes(formField.questionTypeCode)
            const baseFieldProps = {
              key,
              label: formField.questionTextValue,
              name: `${formField.answerSubmitIdValue}`,
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
            if (hasVariant) {
              additionalProps.variant = content.fields_border
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
                    content?.error_msg_required
                      ? () => content.error_msg_required
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
                      key={`${key}_sentinel`}
                    />
                  )}

                  <SelectElement
                    required={formField.isRequired}
                    parseError={
                      content?.error_msg_required
                        ? () => content.error_msg_required
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
                  key={`${key}_parent`}
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
                    key={`${key}_sentinel`}
                  />
                  <MultiSelectElement
                    required={formField.isRequired}
                    parseError={
                      content?.error_msg_required
                        ? () => content.error_msg_required
                        : undefined
                    }
                    menuItems={formField.answerOptionsList
                      .sort()
                      .filter((opt) => !!opt)}
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
                    content?.error_msg_required
                      ? () => content.error_msg_required
                      : undefined
                  }
                  {...baseFieldProps}
                  inputVariant={content.fields_border}
                />
              )
            }
            return null
          })}
          {content?.submit_button?.length && (
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: content.submit_button[0].align || 'center'
              }}
            >
              <LmComponentRender
                content={
                  {
                    color: 'primary',
                    variant: 'contained',
                    label: 'Submit',
                    ...content.submit_button[0]
                  } as ButtonStoryblok
                }
                type="submit"
                key={content.submit_button[0]._uid}
              />
            </div>
          )}
        </FormContainer>
      </MuiPickersUtilsProvider>
    </div>
  )
}
