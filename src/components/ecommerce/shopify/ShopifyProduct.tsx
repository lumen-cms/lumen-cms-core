import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useShopifySdkContext } from './context/ShopifySdkContext'
import { ShopifyProductItem } from './product/ShopifyProductItem'
import { LmShopifyCheckoutProps, ShopifyProductItemProps } from './shopifyTypes'

export default function LmShopifyProduct({ content }: LmShopifyCheckoutProps) {
  const { products } = useShopifySdkContext()
  const product = products.find((p) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return p.handle === content.handle
  })
  if (process.env.NODE_ENV !== 'production') {
    console.log(products)
  }
  return !product ? (
    <LinearProgress variant="query" />
  ) : (
    <ShopifyProductItem item={product as ShopifyProductItemProps['item']} />
  )
}
