import { Product } from 'shopify-buy'
import {
  ButtonStoryblok,
  EcommerceShopifyCheckoutStoryblok,
  EcommerceShopifyIframeStoryblok,
  HeadlineStoryblok,
  IconStoryblok,
  ImageStoryblok
} from '../../../typings/generated/components-schema'

export type LmShopifyIframeProps = {
  content: EcommerceShopifyIframeStoryblok
  trigger?: ButtonStoryblok | HeadlineStoryblok | ImageStoryblok | IconStoryblok
}

export type LmShopifyCheckoutProps = {
  content: EcommerceShopifyCheckoutStoryblok
  trigger: ButtonStoryblok | HeadlineStoryblok | ImageStoryblok | IconStoryblok
}

export type ShopifyProductItemProps = {
  item: Product & { descriptionHtml: string }
}

export type ShopifyProductOptionProps = {
  option: ShopifyBuy.Option & {
    variants: ShopifyBuy.ProductVariant[]
  }
}
