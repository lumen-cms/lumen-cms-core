/* eslint-disable react/no-danger */
import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import { CONFIG } from '@CONFIG'
import { AppPageProps } from '../typings/app'
import { LmStoryblokService } from '../utils/initial-props/StoryblokService'

type CoreDocumentProps = {
  props: AppPageProps
  isDevelopment: boolean
}

export function LmCoreDocument({
  props,
  isDevelopment
}: CoreDocumentProps): JSX.Element {
  const { settings } = props
  const googleAnalyticsId = settings?.setup_google_analytics || CONFIG.GA
  const facebookPixelId = settings?.setup_facebook_pixel
  const locale = settings?.setup_language || CONFIG.defaultLocale
  return (
    <Html lang={locale || undefined}>
      <Head>
        {settings?.pwa_app_name && settings?.pwa_app_description && (
          <>
            <meta name="application-name" content={settings.pwa_app_name} />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="default"
            />
            <meta
              name="apple-mobile-web-app-title"
              content={settings.pwa_app_name}
            />
            <meta name="description" content={settings.pwa_app_description} />
            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="theme-color" content="#FFFFFF" />
            <link rel="manifest" href="/manifest.json" />
          </>
        )}
      </Head>
      <body className="lm-body__root">
        <Main />
        <script
          dangerouslySetInnerHTML={{
            __html: `var StoryblokCacheVersion = '${LmStoryblokService.getCacheVersion()}';`
          }}
        />
        <NextScript />
        {!isDevelopment && facebookPixelId && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
          !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${facebookPixelId}');
            fbq('track', 'PageView');
          `
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}
        {!isDevelopment && googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${googleAnalyticsId}', {
          page_path: window.location.pathname
        });
      `
              }}
            />
          </>
        )}
      </body>
    </Html>
  )
}
