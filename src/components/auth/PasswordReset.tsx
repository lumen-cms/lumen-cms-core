import React, { FunctionComponent, useState } from 'react'
import AuthWrap from './components/AuthWrap'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import FormContainer from 'react-form-hook-material-ui/dist/FormContainer'
import { Button } from '@material-ui/core'
import TextFieldElement from 'react-form-hook-material-ui/dist/TextFieldElement'
import Box from '@material-ui/core/Box'
import { fetchApi, WEBHOOK_API_PATHS } from '../../utils/fetchApi'
import { setNotification } from '../../state/actions'
import { RouteState } from '../../typings/router.def'
import { parseError } from '../../utils/errorMessage'
import SpinnerButton from '../../components/partials/SpinnerButton'
import { Alert } from '@material-ui/lab'

type PasswordResetForm = {
  email: string
}

const form: PasswordResetForm = {
  email: ''
}

const PasswordReset: FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  const onSubmit = async ({ email }: PasswordResetForm) => {
    setLoading(true)
    try {
      await fetchApi(WEBHOOK_API_PATHS.passwordForget, {
        email
      })
      setSuccess(true)
    } catch (e) {
      console.error(e)
      if (e.status < 500) {
        setNotification({
          message: 'Email scheint nicht korrekt zu sein',
          type: 'error'
        })
      } else {
        setNotification({
          message: 'Ein Fehler ist aufgetreten',
          type: 'error'
        })
      }
    }
    setLoading(false)
  }
  return (
    <AuthWrap>
      <CardHeader
        title={'Passwort zurücksetzen'}
        titleTypographyProps={{
          align: 'center'
        }}
      />
      <CardContent>
        <Typography align={'center'}>
          Sie haben Ihr Passwort zum Ladenburger Altstadtfest vergessen oder
          wollen ein Neues erstellen?
          <br />
          Bitte tragen Sie ihre Email Adresse ein und folgen anschließend den
          Anweisungen der Email.
          <br />
        </Typography>

        {!success && (
          <FormContainer defaultValues={form} onSuccess={onSubmit}>
            <Box>
              <TextFieldElement
                margin={'normal'}
                name={'email'}
                label={'Email'}
                type={'email'}
                required
                fullWidth
                parseError={parseError}
              />{' '}
              <br />
              <SpinnerButton
                label={'Anfordern'}
                loading={loading}
                fullWidth
                variant={'contained'}
              />
            </Box>
          </FormContainer>
        )}
        {success && (
          <Box paddingTop={3}>
            <Alert severity="success">
              Eine Email wurde an Sie verschickt!
            </Alert>
          </Box>
        )}
        <Box paddingTop={3} textAlign={'right'}>
          <Typography color={'textSecondary'} variant={'body2'}>
            Zurück zur Anmeldung
          </Typography>
          <Button href={RouteState.Login}>Zum Login</Button>
        </Box>
      </CardContent>
    </AuthWrap>
  )
}

export default PasswordReset
