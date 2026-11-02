import type { Metadata } from 'next'
import type { AppPageProps } from '../typings/app'
import { imageServiceNoWebp } from '../utils/imageServices'
import { CONFIG } from '../utils/config'

// Initial public content pilot. Fail rather than silently dropping advanced SEO
// schemas until their serializers have been migrated and verified.
export function publicMetadata(
  content: AppPageProps,
  pathname: string
): Metadata {
  const { page, settings } = content
  if (!page || !settings)
    return { title: 'Not Found', robots: 'noindex, nofollow' }
  if (
    page.seo_body?.length ||
    settings.seo_body?.length ||
    settings.pwa_app_name
  ) {
    throw new Error(
      'App Router pilot does not yet support advanced SEO or PWA metadata'
    )
  }
  const title =
    page.meta_title || settings.seo_title || 'Website made by Lumen Media'
  const description =
    page.meta_description ||
    settings.seo_description ||
    'Website made by Lumen Media'
  const noindex =
    CONFIG.overwriteDisableIndex || page.meta_robots || !settings.seo_robots
  const url = settings.seo_website_url
    ? settings.seo_website_url + pathname
    : undefined
  return {
    title,
    description,
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    alternates: url ? { canonical: url } : undefined,
    openGraph: { title, description, url },
    formatDetection: { telephone: false },
    verification: { google: settings.setup_google_site_verification },
    icons: settings.setup_favicon
      ? {
          icon: {
            url: imageServiceNoWebp(settings.setup_favicon, '32x32'),
            sizes: '32x32'
          },
          apple: {
            url: imageServiceNoWebp(settings.setup_favicon, '180x180'),
            sizes: '180x180'
          }
        }
      : undefined
  }
}
