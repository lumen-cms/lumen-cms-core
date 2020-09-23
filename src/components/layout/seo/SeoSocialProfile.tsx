import { AppSeoProps } from '../layoutTypes'
import { SeoSocialProfileStoryblok } from '../../../typings/generated/components-schema'
import { SocialProfileJsonLd } from 'next-seo'
import React from 'react'

export function SeoSocialProfile({ settings, page }: AppSeoProps) {
  const profile: SeoSocialProfileStoryblok | undefined =
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
      sameAs={profile.same_as.split(',').map((str) => str.trim())}
    />
  )
}
