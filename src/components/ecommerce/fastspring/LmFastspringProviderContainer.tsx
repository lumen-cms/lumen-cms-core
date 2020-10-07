import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import {
  EcommerceFastspringConfigStoryblok,
  GlobalStoryblok
} from '../../../typings/generated/components-schema'

const LmFastSpringProvider = dynamic(
  () => import(/* webpackChunkName: 'fastspring' */ './LmFastspringProvider')
)

const LmFastSpringProviderContainer: FC<{ settings: GlobalStoryblok }> = ({
  settings,
  children
}) => {
  const fastSpring: EcommerceFastspringConfigStoryblok | undefined = (
    settings.ecommerce || []
  ).find((i) => i.component === 'ecommerce_fastspring_config')
  if (fastSpring) {
    return (
      <LmFastSpringProvider fastSpring={fastSpring}>
        {children}
      </LmFastSpringProvider>
    )
  }
  return <>{children}</>
}
export default LmFastSpringProviderContainer
