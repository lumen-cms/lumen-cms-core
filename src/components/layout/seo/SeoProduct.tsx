import { AppSeoProps } from '../layoutTypes'
import {
  ImageCoreStoryblok,
  SeoProductOfferStoryblok,
  SeoProductStoryblok
} from '../../../typings/generated/components-schema'
import { ProductJsonLd } from 'next-seo'
import { getImageCoreUrl } from '../../../utils/mapOpenGraphImage'
import React from 'react'

export function SeoProduct({ settings, page }: AppSeoProps) {
  const product: SeoProductStoryblok | undefined =
    page?.seo_body?.find((i) => i.component === 'seo_product') ||
    settings.seo_body?.find((i) => i.component === 'seo_product')
  if (!product) {
    return null
  }
  return (
    <ProductJsonLd
      productName={product.product_name}
      brand={product.brand}
      description={product.description}
      images={product.images?.map((image: ImageCoreStoryblok) =>
        getImageCoreUrl(image)
      )}
      sku={product.sku}
      offers={product.offers.map((offer: SeoProductOfferStoryblok) => ({
        availability: offer.availability,
        itemCondition: offer.item_condition,
        price: `${offer.price}`,
        priceCurrency: offer.price_currency,
        url: offer.url,
        seller: {
          name: offer.seller_name
        }
      }))}
    />
  )
}
