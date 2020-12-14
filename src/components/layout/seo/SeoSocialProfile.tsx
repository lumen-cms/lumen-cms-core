import { SocialProfileJsonLd } from 'next-seo'
import React from 'react'
import { AppSeoProps } from '../layoutTypes'

export function SeoSocialProfile({ settings, page }: AppSeoProps) {
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
