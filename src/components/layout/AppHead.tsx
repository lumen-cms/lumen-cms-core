import NextHead from 'next/head'
import { MetaTag } from 'next-seo/lib/types'
import { LogoJsonLd } from 'next-seo'
import { useRouter } from 'next/router'
import { imageServiceNoWebp } from '../../utils/imageServices'
import FbqPixel from '../tracking/FbqPixel'
import Gtag from '../tracking/Gtag'
import AdRoll from '../tracking/AdRoll'
import { useSettings } from '../provider/SettingsPageProvider'
import GtmManager from '../tracking/GtmManager'

const isDevelopment = process.env.NODE_ENV !== 'production'

function AppHead(): JSX.Element {
  const settings = useSettings()
  const favicon = settings.setup_favicon
  const { isPreview } = useRouter() || {}

  if (process.env.NODE_ENV === 'development') {
    console.log('render app head better only once')
  }
  const additionalMetaTags: MetaTag[] = []
  if (settings?.pwa_app_name && settings?.pwa_app_description) {
    additionalMetaTags.push(
      {
        name: 'application-name',
        content: settings.pwa_app_name
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default'
      },
      {
        name: 'apple-mobile-web-app-title',
        content: settings.pwa_app_name
      },
      {
        name: 'description',
        content: settings.pwa_app_description
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'theme-color',
        content: '#FFFFFF'
      }
    )
  }
  if (settings.setup_google_site_verification) {
    additionalMetaTags.push({
      name: 'google-site-verification',
      content: settings.setup_google_site_verification
    })
  }

  return (
    <>
      {settings.website_logo && settings.seo_website_url && (
        <LogoJsonLd
          logo={imageServiceNoWebp(settings.website_logo)}
          url={settings.seo_website_url}
        />
      )}
      <NextHead>
        {additionalMetaTags.map((item) => (
          <meta content={item.content} name={item.name} key={item.name} />
        ))}
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://img2.storyblok.com"
          crossOrigin="anonymous"
        />
        {favicon && (
          <>
            <link
              rel="icon"
              href={imageServiceNoWebp(favicon, '32x32')}
              sizes="32x32"
              key="favicon"
            />
            <link
              rel="apple-touch-icon-precomposed"
              href={imageServiceNoWebp(favicon, '152x152')}
              key="apple-touch-icon-precomposed"
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href={imageServiceNoWebp(favicon, '180x180')}
              key="apple-touch-icon"
            />
          </>
        )}
        {settings?.pwa_app_name && settings?.pwa_app_description && (
          <link rel="manifest" href="/manifest.json" />
        )}

        {settings?.custom_css && (
          <style
            dangerouslySetInnerHTML={{
              __html: settings.custom_css
            }}
          />
        )}
      </NextHead>
      {!isDevelopment && !isPreview && settings?.setup_facebook_pixel && (
        <FbqPixel facebookPixelId={settings.setup_facebook_pixel} />
      )}
      {!isDevelopment &&
        !isPreview &&
        settings?.setup_ad_roll_adv_id &&
        settings?.setup_ad_roll_pix_id && (
          <AdRoll
            advId={settings.setup_ad_roll_adv_id}
            pixId={settings.setup_ad_roll_pix_id}
          />
        )}
      {!isDevelopment && !isPreview && settings?.setup_google_analytics && (
        <Gtag googleAnalyticsId={settings.setup_google_analytics} />
      )}
      {!isDevelopment &&
        !isPreview &&
        process.env.NEXT_PUBLIC_GTM_CONTAINER && <GtmManager />}
    </>
  )
}

export default AppHead
