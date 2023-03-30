import NextHead from 'next/head'
import NextScript from 'next/script'
import { MetaTag } from 'next-seo/lib/types'
import { LogoJsonLd } from 'next-seo'
import { imageServiceNoWebp } from '../../utils/imageServices'
import FbqPixel from '../tracking/FbqPixel'
import Gtag from '../tracking/Gtag'
import AdRoll from '../tracking/AdRoll'
import { useSettings } from '../provider/SettingsPageProvider'
import GtmManager from '../tracking/GtmManager'
import { useAppContext } from '@context/AppContext'
import React from 'react'
import { getFontBasedOnSetting } from '../../utils/parseFont'

const isDevelopment = process.env.NODE_ENV !== 'production'

function AppHead(): JSX.Element {
  const settings = useSettings()
  const favicon = settings.setup_favicon
  const { insideStoryblok } = useAppContext()

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
          href="https://a.storyblok.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://img2.storyblok.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
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
        {!process.env.NEXT_PUBLIC_DISABLE_GOOGLE_FONTS && (
          <link href={getFontBasedOnSetting(settings)} rel={'stylesheet'} />
        )}
      </NextHead>

      {!isDevelopment && !insideStoryblok && settings?.setup_facebook_pixel && (
        <FbqPixel facebookPixelId={settings.setup_facebook_pixel} />
      )}
      {!isDevelopment &&
        !insideStoryblok &&
        settings?.setup_ad_roll_adv_id &&
        settings?.setup_ad_roll_pix_id && (
          <AdRoll
            advId={settings.setup_ad_roll_adv_id}
            pixId={settings.setup_ad_roll_pix_id}
          />
        )}
      {!isDevelopment &&
        !insideStoryblok &&
        settings?.setup_google_analytics && (
          <Gtag googleAnalyticsId={settings.setup_google_analytics} />
        )}
      {!isDevelopment &&
        !insideStoryblok &&
        process.env.NEXT_PUBLIC_GTM_CONTAINER && <GtmManager />}
      {settings.scripts?.map((item) =>
        item.url ? (
          <NextScript
            key={item._uid}
            id={item.id || item._uid}
            src={item.url || undefined}
            strategy={item.strategy || 'afterInteractive'}
            {...parseToAttributes(item.attributes)}
          />
        ) : (
          <NextScript
            key={item._uid}
            id={item.id || item._uid}
            dangerouslySetInnerHTML={{ __html: item.script_body || '' }}
            strategy={item.strategy || 'afterInteractive'}
            {...parseToAttributes(item.attributes)}
          />
        )
      )}
    </>
  )
}

function parseToAttributes(attributes?: string) {
  if (attributes) {
    const stripped = attributes.split(',').map((i) => i.trim())
    return stripped.reduce((previousValue, currentValue) => {
      const val = currentValue.split('=')
      return {
        ...previousValue,
        [val[0]]: val[1]
      }
    }, {})
  }
  return undefined
}

export default AppHead
