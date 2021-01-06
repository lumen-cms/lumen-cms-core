import React from 'react'
import { CorporateContactJsonLd } from 'next-seo'
import { useAppSettings } from '@context/AppSettingsContext'
import { SeoCorporateContactPointStoryblok } from '../../../typings/generated/components-schema'
import { AppSeoProps } from '../layoutTypes'

export function SeoCorporateContact({ page }: AppSeoProps) {
  const { settings } = useAppSettings()
  const business =
    page?.seo_body?.find((i) => i.component === 'seo_corporate_contact') ||
    settings.seo_body?.find((i) => i.component === 'seo_corporate_contact')
  if (!business) {
    return null
  }
  return (
    <CorporateContactJsonLd
      url={business.url}
      logo={business.logo}
      contactPoint={business.contact_point.map(
        (point: SeoCorporateContactPointStoryblok) => ({
          telephone: point.telephone,
          contactType: point.contact_type,
          areaServed: point.area_served?.split(',').map((i) => i.trim()),
          availableLanguage: point.available_language
            ?.split(',')
            .map((i) => i.trim())
        })
      )}
    />
  )
}
