import { defineMiddleware } from 'astro:middleware'
import { authEnabled, createAuth } from './auth'
import { isPreviewRequest } from './request'
export const onRequest = defineMiddleware(async (context, next) => {
 if (authEnabled() && !context.isPrerendered && !isPreviewRequest(context.cookies)) {
  const locals = context.locals as Record<string, unknown>
  locals.lumenAuth = { user: await createAuth(context.cookies, context.request).user(), accountAvailable: !!process.env.AUTH_API }
 }
 const response = await next()
 if ((context.locals as Record<string, unknown>).lumenAuth) response.headers.set('Cache-Control', 'private, no-store')
 return response
})
