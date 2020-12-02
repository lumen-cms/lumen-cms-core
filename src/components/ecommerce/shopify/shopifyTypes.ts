import {
  ButtonStoryblok,
  EcommerceShopifyCheckoutStoryblok,
  EcommerceShopifyIframeStoryblok,
  HeadlineStoryblok,
  IconStoryblok,
  ImageStoryblok
} from '../../../typings/generated/components-schema'
import {
  ProductFragment,
  ProductVariantEdge
} from '../../../typings/generated/shopify-schema'

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
