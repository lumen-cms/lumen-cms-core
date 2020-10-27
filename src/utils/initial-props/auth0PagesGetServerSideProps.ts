import { GetServerSideProps } from 'next'
import {
  createLoginUrl,
  fetchUser,
  hasAuth0PathCredentials
} from '../auth0/auth0Helpers'
import auth0 from '../auth0/auth0'
import { LmStoryblokService } from './StoryblokService'
import getPageProps from './getPageProps'

export const auth0GetServerSideProps: GetServerSideProps = async (ctx) => {
  const { preview, query, req, res } = ctx
  // const params: string[] = (ctx.params?.index as string[]) || []

  const headers = req?.headers
  const inStoryblokBackend =
    headers?.referer?.includes('app.storyblok.com') ||
    headers?.['sec-fetch-dest'] === 'iframe'
  const queryPath = query?.index
  if (process.env.NEXT_PUBLIC_AUTH0_PATH) {
    Array.isArray(queryPath) &&
      queryPath[0] !== process.env.NEXT_PUBLIC_AUTH0_PATH &&
      queryPath.unshift(process.env.NEXT_PUBLIC_AUTH0_PATH as string) // need to re-add auth to catchAll in case env var exists
  }
  const slug = queryPath || 'home'
  if (preview && inStoryblokBackend) {
    LmStoryblokService.setDevMode()
    LmStoryblokService.setQuery(query)
  }

  const pageProps = {
    props: await getPageProps(slug, inStoryblokBackend)
  }

  if (inStoryblokBackend || (!req && preview)) {
    const userAdminCredentials = {
      [process.env.NEXT_PUBLIC_AUTH_PERMISSION ?? '']: [
        process.env.NEXT_PUBLIC_AUTH_PERMISSION_KEY
          ? {
              [process.env.NEXT_PUBLIC_AUTH_PERMISSION_KEY]: ['admin']
            }
          : 'admin'
      ]
    }
    return {
      props: {
        ...pageProps.props,
        user: userAdminCredentials
      }
    }
  }
  const user = req
    ? await auth0.getSession(req).then((r) => r?.user)
    : await fetchUser()
  console.log(user)
  if (!req) {
    return {
      props: {
        ...pageProps.props,
        user
      }
    }
  }

  if (!user) {
    res.writeHead(302, {
      Location: createLoginUrl(req.url)
    })
    res.end()
    return pageProps
  }

  if (!hasAuth0PathCredentials(queryPath, user)) {
    res.writeHead(302, {
      Location: process.env.NEXT_PUBLIC_AUTH0_LANDING_PAGE
    })
    res.end()
    return pageProps
  }

  return {
    props: {
      ...pageProps.props,
      user
    }
  }
}
