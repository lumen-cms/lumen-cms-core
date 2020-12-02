import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import { ShopifyProductItem } from './product/ShopifyProductItem'
import { LmShopifyCheckoutProps } from './shopifyTypes'
import { useAllProductsQuery } from './graphql/allProducts.graphql'

export default function LmShopifyProduct({ content }: LmShopifyCheckoutProps) {
  const { data } = useAllProductsQuery()
  const edges = data?.products.edges || []
  const product = edges.find((p) => {
    return p.node.handle === content.handle
  })

  return product?.node ? (
    <ShopifyProductItem item={product.node} />
  ) : (
    <LinearProgress variant="query" />
  )
}
