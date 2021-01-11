import { SocialProfileJsonLd } from 'next-seo'
import React from 'react'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'

export function SeoSocialProfile() {
  const settings = useSettings()
  const page = usePage()

  const profile =
    page?.seo_body?.find((i) => i.component === 'seo_social_profile') ||
    settings.seo_body?.find((i) => i.component === 'seo_social_profile')
  if (!profile) {
    return null
  }
  return (
    <SocialProfileJsonLd
      url={profile.url}
      type={profile.type}
      name={profile.name}
      sameAs={profile.same_as.split(',').map((str: string) => str.trim())}
    />
  )
}
