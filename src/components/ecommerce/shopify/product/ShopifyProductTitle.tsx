import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { ShopifyProductItemProps } from '../shopifyTypes'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { HeadlineStoryblok } from '../../../../typings/generated/components-schema'

export function ShopifyProductTitle({ item }: ShopifyProductItemProps) {
  const { config } = useShopifySdkContext()

  return (
    <LmComponentRender
      content={
        {
          component: 'headline',
          _uid: '123',
          align: 'center',
          typography: 'headline4',
          ...((config?.product_title && config.product_title[0]) || {}),
          text: item.title
        } as HeadlineStoryblok
      }
    />
  )
}
