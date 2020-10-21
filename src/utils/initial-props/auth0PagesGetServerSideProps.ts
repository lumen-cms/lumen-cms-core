import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import {
  createLoginUrl,
  fetchUser,
  hasAuth0PathCredentials
} from '../auth0/auth0Helpers'
import auth0 from '../auth0/auth0'
import pagesGetServerSideProps from './pagesGetServerSideProps'

export const auth0GetServerSideProps: GetServerSideProps = async (ctx) => {
  const params: string[] = (ctx.params?.index as string[]) || []
  const newContext = {
    ...ctx
  }
  if (process.env.NEXT_PUBLIC_AUTH0_PATH) {
    newContext.params = (params.unshift(
      process.env.NEXT_PUBLIC_AUTH0_PATH as string
    ) as unknown) as ParsedUrlQuery // need to re-add auth to catchAll in case env var exists
  }

  const isPreviewMode = ctx.preview

  const pageProps = await pagesGetServerSideProps(newContext as any)
  if (isPreviewMode) {
    return pageProps // bypass authentication
  }
  if (!ctx.req) {
    const user = await fetchUser()
    return {
      props: {
        ...pageProps.props,
        user
      }
    }
  }

  const session = await auth0.getSession(ctx.req)
  // console.log('inside session of index', session)

  if (!session || !session.user) {
    ctx.res.writeHead(302, {
      Location: createLoginUrl(ctx.req.url)
    })
    ctx.res.end()
    return pageProps
  }

  const { user } = session
  const currentPath = params.join('/')

  if (!hasAuth0PathCredentials(currentPath, user)) {
    ctx.res.writeHead(302, {
      Location: process.env.NEXT_PUBLIC_AUTH0_LANDING_PAGE
    })
    ctx.res.end()
    return pageProps
  }

  return {
    props: {
      ...pageProps.props,
      user
    }
  }
}
