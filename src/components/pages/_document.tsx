import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import { SSR_CONFIG } from '@SSR_CONFIG'
import { augmentDocumentWithEmotionCache_mui } from '../global-theme/muiCache'

// build of storybook fails..
SSR_CONFIG.ssrHooks.componentData = {
  ...SSR_CONFIG.ssrHooks.componentData
}

function AppDocument() {
  return (
    <Html>
      <Head />
      <body className="lm-body__root">
        {process.env.NEXT_PUBLIC_GTM_CONTAINER && (
          <noscript>
            <iframe
              title="googletagmanager"
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_CONTAINER}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

augmentDocumentWithEmotionCache_mui(AppDocument)
export default AppDocument
