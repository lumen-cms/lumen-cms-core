import React from 'react'
import dynamic from 'next/dynamic'
import { AppPageProps } from '../../typings/app'

export type LmPagesIndexProps = AppPageProps & Record<string, unknown>

const BridgedAuth = dynamic(() => import('./ClientAuthPage'), {
  ssr: false
})

export function LmAuthPage(props: LmPagesIndexProps) {
  return <BridgedAuth {...props} />
}
