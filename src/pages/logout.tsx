import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { getBaseProps } from '../utils/initial-props/getBaseProps'

export default function Logout() {
  const { logout } = useAuth0()

  useEffect(() => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    })
  }, [logout])

  return null
}

export const getStaticProps = () => {
  return {
    props: getBaseProps()
  }
}
