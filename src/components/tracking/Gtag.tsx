import React from 'react'
import Script from 'next/script'

type GtagProps = {
  googleAnalyticsId: string
}
export default function Gtag({ googleAnalyticsId }: GtagProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      />
      <Script
        id={'gtag-init'}
        strategy="afterInteractive"
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
  )
}
