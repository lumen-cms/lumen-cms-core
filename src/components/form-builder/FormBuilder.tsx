import { FormContainer } from 'react-hook-form-mui'
import { LmComponentRender } from '@LmComponentRender'
import { LmFormBuilderProps } from './formBuilderTypes'
import { useState } from 'react'
import Grid, { GridSpacing } from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert'
import { TextFieldElement } from '../google-form/GoogleFormElement'
import { FormHiddenFieldStoryblok } from '../../typings/generated/components-schema'

export default function LmFormBuilder({
  content,
  onSubmit,
  additional_fields,
  success_message
}: LmFormBuilderProps) {
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [error, setError] = useState<any>()
  const { fields, submit, endpoint, spacing, form_inline, ...options } = content
  const successMessage = success_message?.length
    ? success_message
    : options.success_message
  if (error) {
    return typeof error === 'string' ? (
      <Alert severity={'error'}>{error}</Alert>
    ) : (
      <Alert severity={'error'}>{JSON.stringify(error)}</Alert>
    )
  }
  return success ? (
    <div>
      {successMessage?.length
        ? successMessage.map((blok) => (
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
          const additionalData =
            [
              ...(content.additional_fields || []),
              ...(additional_fields || [])
            ]?.reduce<FormHiddenFieldStoryblok>(
              (previousValue, currentValue) => ({
                ...previousValue,
                [currentValue.name]: currentValue.is_number
                  ? Number(currentValue.value)
                  : currentValue.value
              }),
              {} as FormHiddenFieldStoryblok
            ) || {}
          const body = { ...data, ...additionalData }
          const cleanObj = Object.fromEntries(
            Object.entries(body).filter(([_, v]) => !!v)
          )
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
                body: JSON.stringify(cleanObj)
              }
            ).then((r) => r.json())
            console.log(res)
            setSuccess(true)
          } else {
            console.log('data submitted, no endpoint given.', cleanObj)
            setSuccess(true)
          }
          if (typeof onSubmit === 'function') {
            onSubmit(data)
          }
        } catch (e) {
          setError(e)
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
