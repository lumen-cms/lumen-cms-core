import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { getBaseProps } from '../utils/initial-props/getBaseProps'

export default function Refetch() {
  const { loginWithPopup } = useAuth0()
  useEffect(() => {
    loginWithPopup({
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  }, [loginWithPopup])
  return null
}

export const getStaticProps = () => {
  return {
    props: getBaseProps()
  }
}
