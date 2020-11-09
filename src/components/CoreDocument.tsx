/* eslint-disable react/no-danger */
import { Html, Main, NextScript, Head } from 'next/document'
import React from 'react'
import { CONFIG } from '@CONFIG'
import { AppPageProps } from '../typings/app'
import { LmStoryblokService } from '../utils/initial-props/StoryblokService'

type CoreDocumentProps = {
  props: AppPageProps
}

export function LmCoreDocument({ props }: CoreDocumentProps): JSX.Element {
  const { settings, locale } = props
  return (
    <Html
      lang={
        locale || settings?.setup_language || CONFIG.defaultLocale || undefined
      }
    >
      <Head />
      <body className="lm-body__root">
        <Main />
        <script
          dangerouslySetInnerHTML={{
            __html: `var StoryblokCacheVersion = '${LmStoryblokService.getCacheVersion()}';`
          }}
        />
        <NextScript />
      </body>
    </Html>
  )
}
