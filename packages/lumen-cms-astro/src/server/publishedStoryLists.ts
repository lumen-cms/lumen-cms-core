import { loadPage } from './pages'
import { CmsPageNotFoundError, CmsPageProtectedError } from './notFound'
import { createRenderContext } from '../lib/renderContext'
import { createStoryListEndpoint } from './storyLists'

export async function loadPublishedStoryContext(source: string) {
 let slug: string
 try { slug = decodeURIComponent(source).replace(/^\/+|\/+$/g, '') } catch { return null }
 if (/[?#\\]/.test(slug) || slug.split('/').some(part => part === '.' || part === '..')) return null
 const locales = (process.env.LUMEN_LOCALES || 'en,de').split(',')
 const first = slug.split('/')[0]
 const locale = locales.includes(first) ? first : locales[0]
 try {
  const page = await loadPage(slug || undefined, { locale, defaultLocale: locales[0], locales, cmsSlug: slug || 'home' }, false, { version: 'published' })
  return createRenderContext(page)
 } catch (error) {
  if (error instanceof CmsPageNotFoundError || error instanceof CmsPageProtectedError) return null
  throw error
 }
}
export const publishedStoryListEndpoint = createStoryListEndpoint({ loadContext: loadPublishedStoryContext })
