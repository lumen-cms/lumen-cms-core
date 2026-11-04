import type { AstroGlobal } from 'astro'
import { getPayload } from '@storyblok/astro'
import type { ISbStoryData } from 'storyblok-js-client'
import type { PageStoryblok, GlobalStoryblok, NewsStoryblok, EventStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import type { PreviewServerData } from '../lib/previewServerData'
import { loadPage, staticRoutes } from './pages'
import { loadErrorPage } from './errorPage'
import { loadTravelPage, travelStaticRoutes } from './travelPages'
import { CmsPageNotFoundError, CmsPageProtectedError, notFoundResponse } from './notFound'
import { isPreviewRequest, pageOptions } from './request'

type RequestContext = Pick<AstroGlobal, 'cookies' | 'locals' | 'url' | 'params' | 'response'> & Partial<Pick<AstroGlobal, 'isPrerendered' | 'props'>>

export const getConsumerStaticPaths = staticRoutes

/** Dedicated /reisen/[slug] and /travels/[slug] routes take only the final slug. */
export async function getConsumerTravelStaticPaths() {
 const routes = await travelStaticRoutes(pageOptions())
 return routes.map(route => {
  if (!route.props.travelSlug || route.props.travelSlug.includes('/')) throw new Error('Travel detail slugs must be single path segments')
  return { ...route, params: { slug: route.props.travelSlug } }
 })
}
function prepare(context: RequestContext) {
 const preview = isPreviewRequest(context.cookies)
 context.response.headers.set('Cache-Control', 'private, no-store')
 if (preview || (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production')) context.response.headers.set('X-Robots-Tag', 'noindex, nofollow')
 return preview
}
async function handleError(error: unknown, context: RequestContext, preview: boolean) {
 if (error instanceof CmsPageNotFoundError) {
  context.response.status = 404
  context.response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return await loadErrorPage(pageOptions(context.url.pathname.replace(/^\/+/, '')), preview, preview ? { from_release: context.url.searchParams.get('_storyblok_release') || undefined } : undefined) || notFoundResponse()
 }
 if (error instanceof CmsPageProtectedError) return new Response('Authentication required', { status: 401, headers: { 'Cache-Control': 'private, no-store' } })
 throw error
}

/** Call from route frontmatter, before HTML streaming starts, to retain HTTP errors. */
export async function loadConsumerPage(context: RequestContext) {
 if (context.isPrerendered) {
  // Fail the build on missing/protected pages instead of emitting a 200 error page.
  return loadPage(context.params.slug, context.props as Parameters<typeof loadPage>[1], false, { version: 'published' })
 }
 const preview = prepare(context)
 const payload = preview ? await getPayload<PreviewServerData, ISbStoryData<PageStoryblok | GlobalStoryblok | NewsStoryblok | EventStoryblok>>({ locals: context.locals }) : undefined
 try {
  return await loadPage(context.params.slug, pageOptions(context.params.slug), preview, {
   version: preview ? 'draft' : 'published',
   ...(preview ? { from_release: context.url.searchParams.get('_storyblok_release') || undefined } : {}),
  }, payload?.story, payload?.serverData)
 } catch (error) { return handleError(error, context, preview) }
}

export async function loadConsumerTravelPage(context: RequestContext) {
 if (context.isPrerendered) return loadTravelPage(context.params.slug, { ...pageOptions(), ...context.props, preview: false })
 const preview = prepare(context)
 try {
  return await loadTravelPage(context.params.slug, {
   ...pageOptions(), preview,
   ...(preview ? { release: context.url.searchParams.get('_storyblok_release') || undefined } : {}),
  })
 } catch (error) { return handleError(error, context, preview) }
}
