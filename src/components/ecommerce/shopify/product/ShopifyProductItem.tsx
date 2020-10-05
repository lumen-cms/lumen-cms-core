import React from 'react'
import { ShopifyProductItemProps } from '../shopifyTypes'
import { ShopifyProductOption } from './ShopifyProductOption'
import { ShopifyProductSlider } from './ShopifyProductSlider'
import { ShopifyItemActions } from './ShopifyItemActions'
import { ShopifyProductTitle } from './ShopifyProductTitle'
import { ShopifyProductContainer } from './ShopifyProductContainer'

export function ShopifyProductItem({ item }: ShopifyProductItemProps) {
  const options =
    item.options?.map((option) => {
      return {
        ...option,
        variants: item.variants.filter((i) =>
          option.values.find((val) => i.title === val.value)
        )
      }
    }) || []

  return (
    <ShopifyProductContainer
      LeftColumn={
        <>
          {options.length > 0 && (
            <ShopifyProductSlider variants={options[0].variants} />
          )}
        </>
      }
      RightColumn={
        <>
          <ShopifyProductTitle item={item} />
          {options.length > 0 &&
            options.map((option) => (
              <ShopifyProductOption option={option} key={option.name} />
            ))}
          <ShopifyItemActions item={item} />
        </>
      }
    />
  )
}
