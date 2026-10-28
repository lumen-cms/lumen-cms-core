import { ProductJsonLd } from 'next-seo'
import {
  ImageCoreStoryblok,
  SeoProductOfferStoryblok
} from '../../../typings/generated/components-schema'
import { getImageCoreUrl } from '../../../utils/mapOpenGraphImage'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'

export function SeoProduct() {
  const settings = useSettings()
  const page = usePage()

  const product =
    page?.seo_body?.find((i) => i.component === 'seo_product') ||
    settings.seo_body?.find((i) => i.component === 'seo_product')
  if (!product) {
    return null
  }
  return (
    <ProductJsonLd
      scriptId="jsonld-product"
      name={product.product_name}
      brand={product.brand}
      description={product.description}
      image={product.images?.map((image: ImageCoreStoryblok) =>
        getImageCoreUrl(image)
      )}
      sku={product.sku}
      offers={product.offers.map((offer: SeoProductOfferStoryblok) => ({
        availability: offer.availability || undefined,
        itemCondition: offer.item_condition || undefined,
        price: `${offer.price}`,
        priceCurrency: offer.price_currency,
        url: offer.url,
        seller: {
          '@type': 'Organization' as const,
          name: offer.seller_name
        }
      }))}
    />
  )
}
