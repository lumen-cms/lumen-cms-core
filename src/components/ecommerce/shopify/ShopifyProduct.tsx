import LinearProgress from '@mui/material/LinearProgress'
import { useAppContext } from '../../provider/context/AppContext'
import { ShopifyProductItem } from './product/ShopifyProductItem'
import { LmShopifyCheckoutProps } from './shopifyTypes'

export default function LmShopifyProduct({ content }: LmShopifyCheckoutProps) {
  const ctx = useAppContext()
  const products = ctx.allShopifyProducts

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
