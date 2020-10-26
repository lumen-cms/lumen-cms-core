import React, { useState } from 'react'
import { FormContainer, TextFieldElement } from 'react-form-hook-mui'
import { Button } from '@material-ui/core'
import { LmComponentRender } from '@LmComponentRender'
import { useAppContext } from '../provider/context/AppContext'
import { Auth0FormProps } from './authTypes'

export default function LmAuthForm({ content }: Auth0FormProps) {
  const appCtx = useAppContext()
  const [updating, setUpdating] = useState(false)
  const defaults = {
    email: appCtx.user?.email || '',
    given_name: appCtx.user?.given_name || '',
    family_name: appCtx.user?.family_name || ''
  }
  const translations = {
    de: {
      email: 'Email',
      given_name: 'Vorname',
      family_name: 'Nachname',
      submit: 'Aktualisieren',
      error_required: 'Bitte das Pflichtfeld ausfüllen',
      error_email: 'Das ist keine gültige Email-Adresse',
      email_helper: 'Die Email Adresse kann nicht verändert werden.'
    },
    en: {
      email: 'Email',
      given_name: 'First Name',
      family_name: 'Surname',
      submit: 'Update',
      error_required: 'This field is required',
      error_email: 'This is not a valid email address',
      email_helper: 'The email can not be changed.'
    }
  }
  const currentLocale = appCtx.locale || 'de'
  const parseError = (errorType: string) => {
    switch (errorType) {
      case 'required':
        return translations[currentLocale].error_required
      case 'pattern': {
        return translations[currentLocale].error_email
      }
      default:
        return `Error: ${errorType}`
    }
  }
  const onSuccess = async (data: any) => {
    setUpdating(true)
    const params = new URLSearchParams()
    params.append('sub', appCtx.user?.sub)
    Object.keys(data).forEach((key) => {
      params.append(key, data[key])
    })
    await fetch(`/api/auth0/update-user?${params.toString()}`)
    setUpdating(false)
    console.log(params.toString())
  }

  return (
    <>
      <FormContainer onSuccess={onSuccess as any} defaultValues={defaults}>
        <TextFieldElement
          name="given_name"
          fullWidth
          required
          parseError={parseError}
          margin="normal"
          variant="outlined"
          label={translations[currentLocale].given_name}
        />
        <TextFieldElement
          name="family_name"
          fullWidth
          parseError={parseError}
          required
          margin="normal"
          variant="outlined"
          label={translations[currentLocale].family_name}
        />
        <TextFieldElement
          name="email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          parseError={parseError}
          disabled
          helperText={translations[currentLocale].email_helper}
          label={translations[currentLocale].email}
        />
        {content.account_update_button?.length ? (
          content.account_update_button.map((blok) => (
            <LmComponentRender
              key={blok._uid}
              content={blok}
              type="submit"
              disabled={!updating}
            />
          ))
        ) : (
          <Button type="submit" fullWidth color="primary" disabled={updating}>
            {translations[currentLocale].submit}
          </Button>
        )}
      </FormContainer>
      {content.account_delete_body?.map((blok) => (
        <LmComponentRender key={blok._uid} content={blok} />
      ))}
      {content.account_delete_button?.map((blok) => (
        <LmComponentRender
          key={blok._uid}
          content={blok}
          onClick={async () => {
            await fetch(`/api/auth0/delete-user?sub=${appCtx.user?.sub || ''}`)
            await fetch(`/api/auth0/logout`)
          }}
        />
      ))}
    </>
  )
}
