import { GetStaticProps } from 'next'
import getPageProps from './getPageProps'
import { AppPageProps } from '../../typings/app'

export const getStaticPropsError: GetStaticProps<AppPageProps> = async (
  context
) => {
  const { locale, defaultLocale, locales } = context

  const pageProps = await getPageProps('error-404', {
    locale,
    defaultLocale,
    locales,
    insideStoryblok: false
  })
  return {
    props: {
      ...pageProps,
      pageNotFound: true
    }
  }
}
