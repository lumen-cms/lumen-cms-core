import React, { FunctionComponent } from 'react'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { Button, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import AuthForm from './components/AuthForm'
import AuthWrap from './components/AuthWrap'

const Login: FunctionComponent = () => {
  return (
    <AuthWrap>
      <CardHeader
        title="Login"
        titleTypographyProps={{
          align: 'center'
        }}
      />
      <CardContent>
        <Typography align="center">
          Für die Anmeldung zum Altstadtfest Ladenburg bitte die Zugangsdaten
          eingeben.
        </Typography>
        <AuthForm authType="authenticate" />

        <Box paddingTop={3} textAlign="right">
          <Typography color="textSecondary" variant="body2">
            Haben Sie noch keinen Account?
          </Typography>
          <Button href={RouteState.Signup}>Zum Registrieren</Button>
          <Typography color="textSecondary" variant="body2">
            Passwort vergessen oder zurücksetzen?
          </Typography>
          <Button href={RouteState.PasswordReset}>Passwort zurücksetzen</Button>
        </Box>
      </CardContent>
    </AuthWrap>
  )
}

export default Login
