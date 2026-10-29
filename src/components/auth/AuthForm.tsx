import { useState } from 'react'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import { Alert, Button } from '@mui/material'
import { LmComponentRender } from '../CoreComponents'
import { useAuth0 } from '@auth0/auth0-react'
import { FieldError } from 'react-hook-form'
import { Auth0FormProps } from './authTypes'
import { auth0Endpoint } from '../../utils/auth0/auth0Helpers'
import { useUserData } from './useAuth'
import { useRouter } from 'next/router'

export default function LmAuthForm({ content }: Auth0FormProps) {
  // const appCtx = useAppContext()
  const router = useRouter()
  const user = useUserData()
  const locale = router.locale
  const auth0Hook = useAuth0()
  const [updating, setUpdating] = useState(false)
  const [failed, setFailed] = useState(false)
  const defaults = {
    email: user?.email || '',
    given_name: user?.firstName || '',
    family_name: user?.lastName || ''
  }
  const translations = {
    de: {
      email: 'Email',
      given_name: 'Vorname',
      family_name: 'Nachname',
      submit: 'Aktualisieren',
      request_error: 'Die Anfrage ist fehlgeschlagen. Bitte erneut versuchen.',
      error_required: 'Bitte das Pflichtfeld ausfüllen',
      error_email: 'Das ist keine gültige Email-Adresse',
      email_helper: 'Die Email Adresse kann nicht verändert werden.'
    },
    en: {
      email: 'Email',
      given_name: 'First Name',
      family_name: 'Surname',
      submit: 'Update',
      request_error: 'The request failed. Please try again.',
      error_required: 'This field is required',
      error_email: 'This is not a valid email address',
      email_helper: 'The email can not be changed.'
    }
  }
  const currentLocale = locale === 'en' ? 'en' : 'de'
  const parseError = (fieldError: FieldError) => {
    switch (fieldError.type) {
      case 'required':
        return translations[currentLocale].error_required
      case 'pattern': {
        return translations[currentLocale].error_email
      }
      default:
        return fieldError.message || ''
    }
  }
  const requestAccountChange = async (url: string) => {
    if (!auth0Hook) return false // Storyblok preview has no authenticated user.
    setUpdating(true)
    setFailed(false)
    try {
      const accessToken = await auth0Hook.getAccessTokenSilently()
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (!response.ok) throw new Error('Account request failed')
      return true
    } catch {
      setFailed(true)
      return false
    } finally {
      setUpdating(false)
    }
  }
  const onSuccess = async (data: any) => {
    const params = new URLSearchParams()
    params.append('sub', user?.sub as string)
    Object.keys(data).forEach((key) => {
      params.append(key, data[key])
    })
    await requestAccountChange(
      `${auth0Endpoint.api}/api/update-user?${params.toString()}`
    )
  }

  return (
    <>
      {failed && (
        <Alert severity="error">
          {translations[currentLocale].request_error}
        </Alert>
      )}
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
              disabled={updating}
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
          disabled={updating}
          onClick={async () => {
            const deleted = await requestAccountChange(
              `${auth0Endpoint.api}/api/delete-user?sub=${encodeURIComponent(
                user?.sub || ''
              )}`
            )
            if (deleted) window.location.reload()
          }}
        />
      ))}
    </>
  )
}
