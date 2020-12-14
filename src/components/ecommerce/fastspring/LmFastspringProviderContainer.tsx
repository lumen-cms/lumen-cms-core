import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import { GlobalStoryblok } from '../../../typings/generated/components-schema'

const LmFastSpringProvider = dynamic(
  () => import(/* webpackChunkName: 'fastspring' */ './LmFastspringProvider')
)

const LmFastSpringProviderContainer: FC<{ settings: GlobalStoryblok }> = ({
  settings,
  children
}) => {
  const fastSpring = (settings.ecommerce || []).find(
    (i) => i.component === 'ecommerce_fastspring_config'
  )
  if (fastSpring) {
    return (
      <LmFastSpringProvider settings={settings}>
        {children}
      </LmFastSpringProvider>
    )
  }
  return <>{children}</>
}
export default LmFastSpringProviderContainer
