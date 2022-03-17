import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import { useAppContext } from '@context/AppContext'
import { ShopifyProductItem } from './product/ShopifyProductItem'
import { LmShopifyCheckoutProps } from './shopifyTypes'
import { AllProductsQuery } from '../../../typings/generated/shopify-schema'

export default function LmShopifyProduct({ content }: LmShopifyCheckoutProps) {
  const ctx = useAppContext()
  const products: AllProductsQuery['products']['edges'] = ctx.allShopifyProducts

  // const { data } = useAllProductsQuery()
  // const edges = data?.products.edges || []
  const product = products?.find((p) => {
    return p.node.handle === content.handle
  })
  if (!product && typeof window !== 'undefined') {
    console.info(products)
  }

  return product?.node ? (
    <ShopifyProductItem item={product.node} />
  ) : (
    <LinearProgress variant="query" />
  )
}
