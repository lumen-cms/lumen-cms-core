import { JsonLdScript, OrganizationJsonLd } from 'next-seo'
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
  const sameAs = profile.same_as.split(',').map((str: string) => str.trim())
  if (profile.type === 'Person') {
    return (
      <JsonLdScript
        scriptKey="jsonld-social"
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.name,
          url: profile.url,
          sameAs
        }}
      />
    )
  }
  return (
    <OrganizationJsonLd
      scriptId="jsonld-social"
      name={profile.name}
      url={profile.url}
      sameAs={sameAs}
    />
  )
}
