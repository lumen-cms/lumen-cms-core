import { JsonLdScript, processors } from 'next-seo'
import {
  ImageCoreStoryblok,
  SeoLocalBusinessOpeningHourStoryblok
} from '../../../typings/generated/components-schema'
import { getImageCoreUrl } from '../../../utils/mapOpenGraphImage'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'

export function SeoLocalBusiness() {
  const settings = useSettings()
  const page = usePage()

  const business =
    page?.seo_body?.find((i) => i.component === 'seo_local_business') ||
    settings.seo_body?.find((i) => i.component === 'seo_local_business')
  if (!business) {
    return null
  }
  const images = business.images?.map((image: ImageCoreStoryblok) =>
    getImageCoreUrl(image)
  )
  const openingHours = business.opening_hours?.map(
    (opening: SeoLocalBusinessOpeningHourStoryblok) =>
      processors.processOpeningHours({
        closes: opening.closes,
        dayOfWeek: opening.day_of_week,
        opens: opening.opens,
        validFrom: opening.valid_from,
        validThrough: opening.valid_through
      })
  )
  // LocalBusinessJsonLd in next-seo 7 cannot emit "@id"
  return (
    <JsonLdScript
      scriptKey="jsonld-local-business"
      data={{
        '@context': 'https://schema.org',
        '@type': business.type,
        ...(business.id && { '@id': business.id }),
        name: business.name,
        ...(business.description && { description: business.description }),
        ...(business.url && { url: business.url }),
        ...(business.telephone && { telephone: business.telephone }),
        ...(images?.length && { image: images }),
        address: processors.processAddress({
          addressCountry: business.address_country,
          addressLocality: business.address_locality,
          addressRegion: business.address_region,
          postalCode: business.address_postal_code,
          streetAddress: business.address_street
        }),
        ...(business.geo_longitude &&
          business.geo_latitude && {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: business.geo_latitude,
              longitude: business.geo_longitude
            }
          }),
        ...(openingHours?.length && {
          openingHoursSpecification: openingHours
        })
      }}
    />
  )
}
