import NextHead from 'next/head'
import React, { memo } from 'react'
import GoogleFonts from 'next-google-fonts'
import { CONFIG } from '@CONFIG'
import { useAppContext } from '@context/AppContext'
import imageService from '../../utils/ImageService'
import { getFontBasedOnSetting } from '../../utils/parseFont'
import { GlobalStoryblok } from '../../typings/generated/components-schema'

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
  return (
    <>
      <GoogleFonts
        href={`https://fonts.googleapis.com/css?family=${loadFonts.join(
          '|'
        )}&display=swap`}
      />
      <NextHead>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          key="viewport"
        />
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
        {CONFIG.GA && (
          <>
            <link
              rel="preconnect"
              href="https://www.googletagmanager.com"
              crossOrigin="anonymous"
            />
            <link
              rel="preconnect"
              href="https://www.google-analytics.com"
              crossOrigin="anonymous"
            />
          </>
        )}
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
        {settings.setup_google_site_verification && (
          <meta
            name="google-site-verification"
            content={settings.setup_google_site_verification}
            key="google-site-verification"
          />
        )}
        {insideStoryblok && (
          <script src="//app.storyblok.com/f/storyblok-latest.js" />
        )}
      </NextHead>
    </>
  )
}

export default memo(AppHead)
