import { NhostAuthProvider, useAuth } from '@nhost/react-auth'
import React from 'react'
import { auth } from '../../utils/nhost/nhost'
import { LmDefaultPage } from './DefaultPage'
import { LmPagesIndexProps } from './AuthPage'
import { LoginForm } from '../auth/LoginForm'

function AuthContainer(props: LmPagesIndexProps) {
  const { signedIn } = useAuth()
  if (!signedIn) {
    return <LoginForm />
  }
  return <LmDefaultPage {...props} />
}

export default function LmAuthPageClient(
  props: LmPagesIndexProps
): JSX.Element {
  return (
    <NhostAuthProvider auth={auth}>
      <AuthContainer {...props} />
    </NhostAuthProvider>
  )
}
