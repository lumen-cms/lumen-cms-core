import { GetStaticProps } from 'next'
import getPageProps from './getPageProps'
import { AppPageProps } from '../../typings/app'
import { getBaseProps } from './getBaseProps'

export const getStaticPropsError: GetStaticProps<AppPageProps> = async (
  context
) => {
  const { locale, defaultLocale, locales } = context
  try {
    const pageProps = await getPageProps('error-404', {
      locale,
      defaultLocale,
      locales,
      insideStoryblok: false
    })
    delete pageProps.notFoundLocale
    return {
      props: {
        ...pageProps,
        pageNotFound: true
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        ...getBaseProps(),
        error: e
      }
    }
  }
}
