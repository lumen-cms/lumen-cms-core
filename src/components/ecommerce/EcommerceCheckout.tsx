import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { LmEcommerceCheckoutProps } from './ecommerceTpyes'

export default function LmEcommerceCheckout({
  content
}: LmEcommerceCheckoutProps) {
  const trigger = content.trigger && content.trigger[0]
  const integration = content.integration && content.integration[0]
  return <LmComponentRender content={integration} trigger={trigger} />
}
