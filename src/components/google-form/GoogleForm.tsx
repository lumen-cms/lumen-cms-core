/* eslint-disable react/no-array-index-key */
import { CSSProperties, FC, useState } from 'react'
import { FormContainer } from 'react-hook-form-mui'
import Alert from '@mui/material/Alert'
import { LmComponentRender } from '@LmComponentRender'
import dynamic from 'next/dynamic'
import { LmGoogleFormProps } from './googleFormProps'
import {
  ButtonStoryblok,
  RichTextEditorStoryblok
} from '../../typings/generated/components-schema'
import GoogleFormElement, { TextFieldElement } from './GoogleFormElement'
import { GoogleForm, submitToGoogleForms } from 'react-google-forms-hooks'
import { useFormColorStyles } from '../../utils/jss/formColorStyles'
import clsx from 'clsx'

const DateFnsProvider = dynamic(() => import('./DateFnsProvider'))
// url(https://medium.com/@levvi/how-to-use-google-forms-as-a-free-email-service-for-your-custom-react-form-or-any-other-1aa837422a4)
const SimpleWrap: FC = ({ children }) => <>{children}</>

export default function LmGoogleForm({
  formStructure,
  content
}: {
  formStructure: GoogleForm
  content: LmGoogleFormProps['content']
}): JSX.Element {
  const classes = useFormColorStyles()
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  // @TODO mode is no-cors, can't detect result status
  // const [submitError, setSubmitError] = useState<boolean>(false)

  const onSubmit = async (data: any) => {
    if (!(formStructure?.action && content.api)) {
      console.log(data)
      return
    }
    if (data.current_address) {
      return
    }
    delete data.current_address

    const success = await submitToGoogleForms(formStructure, data)

    if (!success) {
      console.error('not successful submitted')
    } else {
      window.gtag &&
        gtag('event', 'generate_lead', {
          event_category: 'Google Form Submit',
          event_label: formStructure.action,
          content_id: window.location.pathname
        })
      window.fbq && fbq('track', 'Lead')
    }
    setSubmitSuccess(true)
  }

  const baseStyle: CSSProperties = {
    margin: `${Number(content.fields_gap) || 2}px`,
    maxWidth: `calc(100% - ${Number(content.fields_gap || 2) * 2}px)`,
    minWidth: `${content.fields_min_width || 180}px`
  }
  const defaultValues = {}

  formStructure?.fields.forEach((formField) => {
    // if ([2, 4].includes(formField.questionTypeCode)) {
    //   defaultValues[`${formField.answerSubmitIdValue}_sentinel`] = ''
    // }
    // defaultValues[`${formField.answerSubmitIdValue}`] =
    //   formField.questionTypeCode === 9 ? null : ''
    defaultValues[formField.id] = formField.type === 'DATE' ? null : ''
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
    (field) => field.type === 'DATE'
  )
  const Wrap = hasDateField ? DateFnsProvider : SimpleWrap
  let submitButtonEl = content.submit_button[0]

  return (
    <div
      style={{
        color: content.color?.rgba || undefined
      }}
      className={clsx({
        [classes.dark]: content.color?.rgba
      })}
    >
      <Wrap>
        <FormContainer
          defaultValues={defaultValues}
          // @ts-ignore
          onSuccess={onSubmit}
        >
          <div
            style={{
              ...(content.inline
                ? {
                    display: 'flex'
                  }
                : {})
            }}
          >
            <div className={'d-none'}>
              <TextFieldElement
                name={'current_address'}
                label={'Current Address'}
              />
            </div>
            {formStructure?.fields?.map((formField) => (
              <GoogleFormElement
                formField={formField}
                options={content}
                baseStyle={baseStyle}
                key={`${formField.id}`}
              />
            ))}
            {content?.submit_button?.length > 0 && (
              <div
                style={{
                  ...(content.inline
                    ? {
                        alignSelf: 'center',
                        marginLeft: content.fields_gap
                          ? Number(content.fields_gap)
                          : '8px'
                      }
                    : {
                        display: 'flex',
                        width: '100%',
                        justifyContent: submitButtonEl.align || 'center',
                        marginTop: content.fields_gap
                          ? Number(content.fields_gap)
                          : '8px'
                      })
                }}
              >
                <LmComponentRender
                  content={
                    {
                      color: 'primary',
                      variant: 'contained',
                      label: 'Submit',
                      ...submitButtonEl,
                      link: undefined
                    } as ButtonStoryblok
                  }
                  type="submit"
                  key={submitButtonEl._uid}
                />
              </div>
            )}
          </div>
        </FormContainer>
      </Wrap>
    </div>
  )
}
