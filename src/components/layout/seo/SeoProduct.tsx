import { ProductJsonLd } from 'next-seo'
import React from 'react'
import shallow from 'zustand/shallow'
import {
  ImageCoreStoryblok,
  SeoProductOfferStoryblok
} from '../../../typings/generated/components-schema'
import { getImageCoreUrl } from '../../../utils/mapOpenGraphImage'
import {
  pageSelector,
  settingsSelector,
  useAppStore
} from '../../../utils/state/appState'

export function SeoProduct() {
  const settings = useAppStore(settingsSelector)
  const page = useAppStore(pageSelector)

  const product =
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
