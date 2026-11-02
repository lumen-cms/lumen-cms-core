import 'server-only'

import Script from 'next/script'
import { OrganizationJsonLd } from 'next-seo'
import type { GlobalStoryblok } from '../typings/generated/components-schema'
import { DocumentGoogleFonts } from '../components/pages/DocumentGoogleFonts'
import { imageServiceNoWebp } from '../utils/imageServices'
import { parseToAttributes } from '../components/layout/scriptAttributes'
import Gtag from '../components/tracking/Gtag'
import FbqPixel from '../components/tracking/FbqPixel'
import AdRoll from '../components/tracking/AdRoll'
import GtmManager from '../components/tracking/GtmManager'

export function ResourceHead({ settings }: { settings: GlobalStoryblok }) {
  return (
    <>
      <DocumentGoogleFonts settings={settings} />
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
      {settings.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: settings.custom_css }} />
      )}
      {settings.setup_favicon && (
        <link
          rel="apple-touch-icon-precomposed"
          href={imageServiceNoWebp(settings.setup_favicon, '152x152')}
        />
      )}
    </>
  )
}

export function ResourceScripts({ settings }: { settings: GlobalStoryblok }) {
  return (
    <>
      {settings.website_logo && settings.seo_website_url && (
        <OrganizationJsonLd
          scriptId="jsonld-logo"
          logo={imageServiceNoWebp(settings.website_logo)}
          url={settings.seo_website_url}
        />
      )}
      {settings.setup_google_analytics && (
        <Gtag googleAnalyticsId={settings.setup_google_analytics} />
      )}
      {settings.setup_facebook_pixel && (
        <>
          <FbqPixel
            facebookPixelId={settings.setup_facebook_pixel}
            headFallback={false}
          />
          {/* next/head does not collect output in App Router. Keep the fallback
              in the generated document when JavaScript is disabled. */}
          <noscript>
            {settings.setup_facebook_pixel
              .split(',')
              .map((value) => value.trim())
              .map((id) => (
                // eslint-disable-next-line @next/next/no-img-element -- A hidden tracking fallback, not page imagery.
                <img
                  key={id}
                  alt=""
                  height="1"
                  width="1"
                  style={{ display: 'none' }}
                  src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
                />
              ))}
          </noscript>
        </>
      )}
      {settings.setup_ad_roll_adv_id && settings.setup_ad_roll_pix_id && (
        <AdRoll
          advId={settings.setup_ad_roll_adv_id}
          pixId={settings.setup_ad_roll_pix_id}
        />
      )}
      {process.env.NEXT_PUBLIC_GTM_CONTAINER && <GtmManager />}
      {settings.scripts?.map((item) => (
        <Script
          key={item._uid}
          id={item.id || item._uid}
          strategy={item.strategy || 'afterInteractive'}
          {...parseToAttributes(item.attributes)}
          {...(item.url
            ? { src: item.url }
            : { dangerouslySetInnerHTML: { __html: item.script_body || '' } })}
        />
      ))}
    </>
  )
}
