import { LocalBusinessJsonLd } from 'next-seo'
import React from 'react'
import {
  ImageCoreStoryblok,
  SeoLocalBusinessOpeningHourStoryblok
} from '../../../typings/generated/components-schema'
import { getImageCoreUrl } from '../../../utils/mapOpenGraphImage'
import { useAppStore } from '../../../utils/state/appState'

export function SeoLocalBusiness() {
  const { page, settings } = useAppStore((state) => ({
    page: state.page,
    settings: state.settings
  }))
  const business =
    page?.seo_body?.find((i) => i.component === 'seo_local_business') ||
    settings.seo_body?.find((i) => i.component === 'seo_local_business')
  if (!business) {
    return null
  }
  return (
    <LocalBusinessJsonLd
      id={business.id}
      name={business.name}
      type={business.type}
      images={business.images?.map((image: ImageCoreStoryblok) =>
        getImageCoreUrl(image)
      )}
      description={business.description}
      url={business.url}
      geo={
        business.geo_longitude && business.geo_latitude
          ? {
              latitude: business.geo_latitude,
              longitude: business.geo_longitude
            }
          : undefined
      }
      telephone={business.telephone}
      openingHours={business.opening_hours?.map(
        (opening: SeoLocalBusinessOpeningHourStoryblok) => ({
          closes: opening.closes,
          dayOfWeek: opening.day_of_week,
          opens: opening.opens,
          validFrom: opening.valid_from,
          validThrough: opening.valid_through
        })
      )}
      address={{
        addressCountry: business.address_country,
        addressLocality: business.address_locality,
        addressRegion: business.address_region,
        postalCode: business.address_postal_code,
        streetAddress: business.address_street
      }}
    />
  )
}
