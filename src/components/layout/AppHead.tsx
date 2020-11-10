import NextHead from 'next/head'
import React, { memo } from 'react'
import GoogleFonts from 'next-google-fonts'
import { useAppContext } from '@context/AppContext'
import { MetaTag } from 'next-seo/lib/types'
import { DefaultSeo, LogoJsonLd } from 'next-seo'
import imageService, { imageServiceNoWebp } from '../../utils/ImageService'
import { getFontBasedOnSetting } from '../../utils/parseFont'
import { GlobalStoryblok } from '../../typings/generated/components-schema'
import FbqPixel from '../tracking/FbqPixel'
import Gtag from '../tracking/Gtag'
import AdRoll from '../tracking/AdRoll'

const isDevelopment = process.env.NODE_ENV !== 'production'

type AppHeadProps = {
  settings: GlobalStoryblok
}

function AppHead({ settings }: AppHeadProps): JSX.Element {
  const favicon = settings.setup_favicon
  const loadFonts: string[] = getFontBasedOnSetting(settings)
  const appContext = useAppContext()
  const { insideStoryblok } = appContext
  if (process.env.NODE_ENV === 'development') {
    console.log('render app head')
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
      <DefaultSeo additionalMetaTags={additionalMetaTags} />
      <GoogleFonts
        href={`https://fonts.googleapis.com/css?family=${loadFonts.join(
          '|'
        )}&display=swap`}
      />
      {settings.website_logo && settings.seo_website_url && (
        <LogoJsonLd
          logo={imageServiceNoWebp(settings.website_logo)}
          url={settings.seo_website_url}
        />
      )}
      <NextHead>
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
              href={imageService(favicon, `32x32`)}
              sizes="32x32"
              key="favicon"
            />
            <link
              rel="apple-touch-icon-precomposed"
              href={imageService(favicon, `152x152`)}
              key="apple-touch-icon-precomposed"
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href={imageService(favicon, `180x180`)}
              key="apple-touch-icon"
            />
          </>
        )}
        {settings?.pwa_app_name && settings?.pwa_app_description && (
          <link rel="manifest" href="/manifest.json" />
        )}
        {insideStoryblok && (
          <script src="//app.storyblok.com/f/storyblok-latest.js" />
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
    </>
  )
}

export default memo(AppHead)
