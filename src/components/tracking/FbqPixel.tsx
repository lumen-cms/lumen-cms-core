import React from 'react'
import Head from 'next/head'

type PixelProps = {
  facebookPixelId: string
}

export default function FbqPixel({ facebookPixelId }: PixelProps) {
  const multiPixel = facebookPixelId.split(',').map((i) => i.trim())
  return (
    <Head>
      <script
        /* eslint-disable-next-line react/no-danger */
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
            ${multiPixel.map((id) => `fbq('init', '${id}');`)}
            fbq('track', 'PageView');
          `
        }}
      />
      <noscript>
        {multiPixel.map((id) => (
          // eslint-disable-next-line  @next/next/no-img-element
          <img
            key={id}
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
          />
        ))}
      </noscript>
    </Head>
  )
}
