import React from 'react'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import AuthForm from './components/AuthForm'
import AuthWrap from './components/AuthWrap'
import { Button } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { RouteState } from '../../typings/router.def'

const Signup = () => {
  return (
    <AuthWrap>
      <CardHeader
        title={'Registrierung / Anmeldung'}
        titleTypographyProps={{
          align: 'center'
        }}
      />
      <CardContent>
        <Typography align={'center'}>
          Möchten Sie sich zum Altstadtfest Flohmarkt der Stadt Ladenburg
          anmelden? Bitte füllen Sie zunächst die Daten für Ihr Benutzerkonto
          aus.
        </Typography>

        <AuthForm authType={'new-user'} />
        <Box paddingTop={3} textAlign={'right'}>
          <Typography color={'textSecondary'} variant={'body2'}>
            Haben Sie schon einen Benutzeraccount?
          </Typography>
          <Button href={RouteState.Login}>Zum Login</Button>
        </Box>
      </CardContent>
    </AuthWrap>
  )
}

export default Signup
