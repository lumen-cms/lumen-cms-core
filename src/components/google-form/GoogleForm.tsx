/* eslint-disable react/no-array-index-key */
import { CSSProperties, FC, useState } from 'react'
import { FormContainer } from 'react-hook-form-mui'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'
import { LmComponentRender } from '@LmComponentRender'
import dynamic from 'next/dynamic'
import { LmGoogleFormProps } from './googleFormProps'
import {
  ButtonStoryblok,
  RichTextEditorStoryblok
} from '../../typings/generated/components-schema'
import { GoogleFormDataProps } from '../../utils/hooks/googleForms/parseHijackedFormData'
import GoogleFormElement, { TextFieldElement } from './GoogleFormElement'

const DateFnsProvider = dynamic(() => import('./DateFnsProvider'))
// url(https://medium.com/@levvi/how-to-use-google-forms-as-a-free-email-service-for-your-custom-react-form-or-any-other-1aa837422a4)

const SimpleWrap: FC = ({ children }) => <>{children}</>
export default function LmGoogleForm({
  formStructure,
  content
}: {
  formStructure: GoogleFormDataProps
  content: LmGoogleFormProps['content']
}): JSX.Element {
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  // @TODO mode is no-cors, can't detect result status
  // const [submitError, setSubmitError] = useState<boolean>(false)

  const onSubmit = async (data: any) => {
    if (!formStructure?.formAction) {
      console.log(data)
      return
    }
    if (data.current_address) {
      return
    }
    delete data.current_address

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

    window.gtag && gtag('event', 'generate_lead')
    window.fbq && fbq('track', 'Lead')
    await fetch(formStructure.formAction, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })

    setSubmitSuccess(true)
  }

  const baseStyle: CSSProperties = {
    margin: `${Number(content.fields_gap) || 2}px`,
    maxWidth: `calc(100% - ${Number(content.fields_gap || 2) * 2}px)`,
    minWidth: `${content.fields_min_width || 180}px`
  }
  const defaultValues = {}
  // eslint-disable-next-line
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
  const hasDateField = formStructure?.fields?.find(
    (field) => field.questionTypeCode === 9
  )
  const Wrap = hasDateField ? DateFnsProvider : SimpleWrap
  return (
    <div>
      <Typography variant="h5">{formStructure?.title}</Typography>
      <Typography variant="subtitle1">{formStructure?.description}</Typography>
      <Wrap>
        <FormContainer
          defaultValues={defaultValues}
          // @ts-ignore
          onSuccess={onSubmit}
        >
          <div className={'d-none'}>
            <TextFieldElement
              name={'current_address'}
              label={'Current Address'}
            />
          </div>
          {formStructure?.fields?.map((formField, index) => (
            <GoogleFormElement
              formField={formField}
              options={content}
              baseStyle={baseStyle}
              key={`${formField.answerSubmitIdValue}_${index}`}
            />
          ))}
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
      </Wrap>
    </div>
  )
}
