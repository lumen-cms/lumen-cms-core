import React, { useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { getBaseProps } from '../utils/initial-props/getBaseProps'

export default function Logout() {
  const { logout } = useAuth0()
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (ref?.current) {
      ref.current.click()
    }
  }, [ref])
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          logout({
            returnTo: window.location.origin
          })
        }
        ref={ref}
        style={{
          display: 'none'
        }}
      >
        logout..
      </button>
    </div>
  )
}

export const getStaticProps = () => {
  return {
    props: getBaseProps()
  }
}
