import {
  ButtonStoryblok,
  EcommerceShopifyCheckoutStoryblok,
  EcommerceShopifyIframeStoryblok,
  HeadlineStoryblok,
  IconStoryblok,
  ImageStoryblok
} from '../../../typings/generated/components-schema'
import { ProductFragment } from './graphql/allProducts.graphql'
import { ProductVariantEdge } from './graphql/product.graphql'

export type LmShopifyIframeProps = {
  content: EcommerceShopifyIframeStoryblok
  trigger?: ButtonStoryblok | HeadlineStoryblok | ImageStoryblok | IconStoryblok
}

export type LmShopifyCheckoutProps = {
  content: EcommerceShopifyCheckoutStoryblok
  trigger: ButtonStoryblok | HeadlineStoryblok | ImageStoryblok | IconStoryblok
}

export type ShopifyProductItemProps = {
  item: ProductFragment
}

export type ShopifyProductOptionProps = {
  variant: ProductVariantEdge['node']
}
