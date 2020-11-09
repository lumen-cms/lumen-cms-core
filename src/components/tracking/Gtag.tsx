import React from 'react'
import Head from 'next/head'

type GtagProps = {
  googleAnalyticsId: string
}
export default function Gtag({ googleAnalyticsId }: GtagProps) {
  return (
    <Head>
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
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      />
      <script
        /* eslint-disable-next-line react/no-danger */
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
    </Head>
  )
}
