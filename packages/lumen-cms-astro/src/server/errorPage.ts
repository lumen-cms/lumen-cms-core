import getPageProps from 'lumen-cms-shared/core/utils/initial-props/getPageProps'
import type { CmsRoute } from 'lumen-cms-shared/server/routes'
import type { ISbStoryParams } from 'storyblok-js-client'
import type { RenderContext } from '../lib/context'

/** The shared delivery resolver applies locale, root folder and field translations. */
export async function loadErrorPage(options: CmsRoute['props'], preview = false, requestParams?: ISbStoryParams): Promise<RenderContext['page'] | undefined> {
 const page = await getPageProps('error-404', {
  locale: options.locale, defaultLocale: options.defaultLocale, locales: options.locales, insideStoryblok: preview,
 }, { version: preview ? 'draft' : 'published', ...requestParams })
 // Even without a custom error story, retain the site's shell when settings exist.
 if (!page.settings || page.needAuth) return undefined
 return { ...page, pageNotFound: true }
}
