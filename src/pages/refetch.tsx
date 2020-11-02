import React, { useEffect } from 'react'
import { getBaseProps } from '../utils/initial-props/getBaseProps'

export default function Refetch() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [])
  return <div />
}

export const getStaticProps = () => {
  return {
    props: getBaseProps()
  }
}
