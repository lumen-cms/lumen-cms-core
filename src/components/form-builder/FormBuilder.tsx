import { FormContainer } from 'react-hook-form-mui'
import { LmComponentRender } from '@LmComponentRender'
import { LmFormBuilderProps } from './formBuilderTypes'
import { useState } from 'react'
import Grid, { GridSpacing } from '@material-ui/core/Grid'
import { TextFieldElement } from '../google-form/GoogleFormElement'

export default function LmFormBuilder({
  content,
  onSubmit
}: LmFormBuilderProps) {
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const {
    fields,
    submit,
    success_message,
    endpoint,
    spacing,
    form_inline,
    ...options
  } = content

  // const renderField = (field: FormBuilderStoryblok['fields'][0]) => {
  //   switch (field.component) {
  //     case 'form_textfield':
  //       return <LmFormTextField content={field} options={options} />
  //     default:
  //       return <LmComponentRender content={field} />
  //   }
  // }

  return success ? (
    <div>
      {success_message?.length
        ? success_message.map((blok) => (
            <LmComponentRender key={blok._uid} content={blok} />
          ))
        : 'successful submit..'}
    </div>
  ) : (
    <FormContainer
      FormProps={{
        ...(content.full_width
          ? {
              style: {
                width: '100%'
              }
            }
          : {})
      }}
      onSuccess={async (data) => {
        setLoading(true)
        try {
          if (data.current_address) {
            setSuccess(true)
            setLoading(false)
            return
          }
          delete data.current_address
          if (endpoint) {
            const res = await fetch(
              endpoint.startsWith('http')
                ? endpoint
                : location.origin + endpoint,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(data)
              }
            ).then((r) => r.json())
            console.log(res)
            setSuccess(true)
          } else {
            console.log('data submitted, no endpoint given.', data)
            setSuccess(true)
          }
          if (typeof onSubmit === 'function') {
            onSubmit(data)
          }
        } catch (e) {
          console.error(e)
        }
        setLoading(false)
      }}
    >
      <Grid
        spacing={spacing ? (Number(spacing) as GridSpacing) : undefined}
        container
        direction={form_inline ? 'row' : 'column'}
      >
        <Grid item style={{ display: 'none' }}>
          <TextFieldElement
            name={'current_address'}
            label={'Current Address'}
          />
        </Grid>
        {fields?.map((field) => (
          <Grid item key={field._uid}>
            <LmComponentRender content={field} options={options} />
          </Grid>
        ))}

        {submit?.map((blok) => (
          <Grid
            item
            key={blok._uid}
            style={{ alignSelf: form_inline ? 'center' : undefined }}
          >
            <LmComponentRender
              type={'submit'}
              content={blok}
              disabled={loading}
            />
          </Grid>
        ))}
      </Grid>
    </FormContainer>
  )
}
