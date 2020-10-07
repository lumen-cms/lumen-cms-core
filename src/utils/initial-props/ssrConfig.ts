import { AppPageProps } from '../../typings/app'
import { SitemapStream } from 'sitemap'

export type SSR_CONFIG_PROPS = {
  ssrHooks: {
    pageProps: ((props: AppPageProps) => Promise<void>)[]
    sitemap: ((stream: SitemapStream) => Promise<void>)[]
  }
}

export const SSR_CONFIG: SSR_CONFIG_PROPS = {
  ssrHooks: {
    pageProps: [],
    sitemap: []
  }
}
