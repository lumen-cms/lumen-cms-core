import React from 'react'
import { FormContainer, TextFieldElement } from 'react-form-hook-mui'
import { Button } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { LmComponentRender } from '@LmComponentRender'
import { useAppContext } from '../provider/context/AppContext'
import { Auth0FormProps } from './authTypes'

export default function LmAuthForm({ content }: Auth0FormProps) {
  const appCtx = useAppContext()
  console.log(appCtx)
  if (!appCtx.user?.email) {
    return null // user not logged in
  }
  const defaults = {
    email: appCtx.user.email,
    given_name: appCtx.user.given_name,
    family_name: appCtx.user.family_name
  }
  const translations = {
    de: {
      email: 'Email',
      given_name: 'Vorname',
      family_name: 'Nachname',
      submit: 'Aktualisieren',
      error_required: 'Bitte das Pflichtfeld ausfüllen',
      error_email: 'Das ist keine gültige Email-Adresse'
    },
    en: {
      email: 'Email',
      given_name: 'First Name',
      family_name: 'Surname',
      submit: 'Update',
      error_required: 'This field is required',
      error_email: 'This is not a valid email address'
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
  const onSuccess = (data) => {
    console.log(data)
  }

  return (
    <>
      <FormContainer onSuccess={onSuccess} defaultValues={defaults}>
        <TextFieldElement
          name="email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          parseError={parseError}
          required
          label={translations[currentLocale].email}
        />
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
        {content.account_update_button?.length ? (
          content.account_update_button.map((blok) => (
            <LmComponentRender key={blok._uid} content={blok} type="submit" />
          ))
        ) : (
          <Button type="submit" fullWidth color="primary">
            {translations[currentLocale].submit}
          </Button>
        )}
      </FormContainer>
      <Divider />
      <Typography />
    </>
  )
}
