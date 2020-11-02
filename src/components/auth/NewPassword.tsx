import React, { FunctionComponent, useState } from 'react'
import CardHeader from '@material-ui/core/CardHeader'
import AuthWrap from './components/AuthWrap'
import CardContent from '@material-ui/core/CardContent'
import {
  FormContainer,
  PasswordElement
} from 'react-form-hook-material-ui/dist'
import SpinnerButton from '../../components/partials/SpinnerButton'
import { parseError } from '../../utils/errorMessage'
import { useFormContext } from 'react-hook-form'
import { fetchApi, WEBHOOK_API_PATHS } from '../../utils/fetchApi'
import { setNotification } from '../../state/actions'
import { RouteState } from '../../typings/router.def'
import useFetch from 'react-fetch-hook'
import CONFIG from '../../config'
import CircularProgress from '@material-ui/core/CircularProgress'
import Alert from '@material-ui/lab/Alert'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { Button } from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom'

type NewPasswordForm = {
  password: string
  password_repeat: string
}

const formValues: NewPasswordForm = {
  password: '',
  password_repeat: ''
}

export const PasswordRepeat: FunctionComponent = () => {
  const { getValues } = useFormContext()
  return (
    <PasswordElement
      label={'Passwort Wiederholen'}
      required
      fullWidth
      parseError={parseError}
      validation={{
        validate: {
          passwordMismatch: (value: string) => {
            const { password } = getValues()
            return value === password || 'Password should match'
          }
        }
      }}
      name={'password-repeat'}
    />
  )
}

const NewPassword: FunctionComponent = () => {
  const location = useLocation()
  const history = useHistory()
  const query = new URLSearchParams(location.search)
  const token = query.get('token')
  const { isLoading, error } = useFetch(
    `${CONFIG.REACT_APP_WEBHOOK_SERVER}${WEBHOOK_API_PATHS.passwordTokenVerify}?token=${token}`,
    {
      depends: [token]
    }
  )
  const [loading, setLoading] = useState<boolean>(false)
  const onSubmit = async (form: NewPasswordForm) => {
    setLoading(true)
    try {
      await fetchApi(WEBHOOK_API_PATHS.newPassword, {
        token,
        password: form.password
      })
      setLoading(false)
      history.push(RouteState.Login)
    } catch (e) {
      setLoading(false)
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
  }
  if (isLoading) {
    return (
      <AuthWrap>
        <CircularProgress />
      </AuthWrap>
    )
  }
  if (error) {
    console.error(error)
    return (
      <AuthWrap>
        <CardContent>
          <Alert severity={'error'}>Ein Fehler ist aufgetreten</Alert>
          <Box paddingTop={3}>
            <Typography align={'center'}>
              <strong>
                Der Link ist nicht korrekt oder nicht mehr gültig.
              </strong>{' '}
              <br />
              Bitte wenden Sie sich an den Support falls Sie Probleme haben Ihr
              Passwort zurück zu setzen.
            </Typography>
          </Box>
          <Box paddingTop={3} textAlign={'right'}>
            <Typography color={'textSecondary'} variant={'body2'}>
              Zurück zum Login?
            </Typography>
            <Button href={RouteState.Login}>Zum Login</Button>
          </Box>
        </CardContent>
      </AuthWrap>
    )
  }
  return (
    <AuthWrap>
      <CardHeader
        title={'Neues Passwort vergeben'}
        titleTypographyProps={{
          align: 'center'
        }}
      />
      <CardContent>
        <FormContainer onSuccess={onSubmit} defaultValues={formValues}>
          <PasswordElement
            name={'password'}
            label="Neues Password"
            required
            fullWidth
          />
          <PasswordRepeat />
          <SpinnerButton
            label="Neues Password setzen"
            variant={'contained'}
            fullWidth
            loading={loading}
          />
        </FormContainer>
      </CardContent>
    </AuthWrap>
  )
}

export default NewPassword
