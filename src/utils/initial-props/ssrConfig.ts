import { SitemapStream } from 'sitemap'
import { AppPageProps } from '../../typings/app'

export type SSR_CONFIG_PROPS = {
  ssrHooks: {
    pageProps: ((props: AppPageProps) => Promise<void>)[]
    sitemap: ((stream: SitemapStream, locale?: string) => Promise<void>)[]
    componentData: {
      [k: string]: (item: any, props: AppPageProps) => Promise<any>
    }
  }
}

export const SSR_CONFIG: SSR_CONFIG_PROPS = {
  ssrHooks: {
    pageProps: [],
    sitemap: [],
    componentData: {}
  }
}
