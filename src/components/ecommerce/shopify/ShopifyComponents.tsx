import dynamic from 'next/dynamic'
import { LmCoreComponents } from '@CONFIG'
import { LmShopifySdkProvider } from './ShopifySdkProvider'

LmCoreComponents.ecommerce_shopify_checkout = dynamic(
  () => import(/* webpackChunkName: 'shopify' */ './ShopifyProduct')
)
LmCoreComponents.lm_app_providers.push(LmShopifySdkProvider)
