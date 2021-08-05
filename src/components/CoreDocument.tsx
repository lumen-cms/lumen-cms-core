/* eslint-disable react/no-danger */
import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import { AppPageProps } from '../typings/app'
import { LmStoryblokService } from '../utils/initial-props/StoryblokService'

type CoreDocumentProps = {
  props: AppPageProps
}

export function LmCoreDocument(_ctx: CoreDocumentProps): JSX.Element {
  const cacheVersion = LmStoryblokService.getCacheVersion()
  return (
    <Html>
      <Head />
      <body className="lm-body__root">
        <Main />
        <script
          dangerouslySetInnerHTML={{
            __html: `var StoryblokCacheVersion = '${cacheVersion}';`
          }}
        />
        <NextScript />
      </body>
    </Html>
  )
}
