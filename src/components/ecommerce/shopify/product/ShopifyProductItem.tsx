import React from 'react'
import { ShopifyProductItemProps } from '../shopifyTypes'
import { ShopifyProductOptions } from './ShopifyProductOption'
import { ShopifyProductCarousel } from './ShopifyProductCarousel'
import { ShopifyItemActions } from './ShopifyItemActions'
import { ShopifyProductTitle } from './ShopifyProductTitle'
import { ShopifyProductContainer } from './ShopifyProductContainer'

export function ShopifyProductItem({ item }: ShopifyProductItemProps) {
  return (
    <ShopifyProductContainer
      LeftColumn={<ShopifyProductCarousel item={item} />}
      RightColumn={
        <>
          <ShopifyProductTitle item={item} />
          <ShopifyProductOptions item={item} />
          <ShopifyItemActions item={item} />
        </>
      }
    />
  )
}
