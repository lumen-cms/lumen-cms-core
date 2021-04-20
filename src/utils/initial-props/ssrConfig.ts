import { SitemapStream } from 'sitemap'
import { AppPageProps } from '../../typings/app'

export type SSR_CONFIG_PROPS = {
  ssrHooks: {
    contentLookup: { lookup: string; callback: (data: any) => Promise<void> }[]
    pageProps: ((props: AppPageProps) => Promise<void>)[]
    sitemap: ((stream: SitemapStream, locale?: string) => Promise<void>)[]
  }
}

export const SSR_CONFIG: SSR_CONFIG_PROPS = {
  ssrHooks: {
    contentLookup: [],
    pageProps: [],
    sitemap: []
  }
}
