import { GetStaticProps } from 'next'
import { getBaseProps } from './getBaseProps'
import getPageProps from './getPageProps'
import { AppPageProps } from '../../typings/app'
import { LmStoryblokService } from './StoryblokService'

const pagesGetStaticProps: GetStaticProps<AppPageProps> = async (props) => {
  // const slug = Array.isArray(currentSlug) ? currentSlug.join('/') : currentSlug
  const { params, preview, previewData, locale, locales, defaultLocale } = props
  const slug = params?.index?.length
    ? params.index !== 'index'
      ? params.index
      : 'home'
    : 'home'
  console.log('static props', slug, defaultLocale, locales)
  // startMeasureTime('start get static props')
  if (Array.isArray(slug) && slug[0] === '_dev_') {
    return { props: getBaseProps({ type: 'not_supported' }) } // do nothing _dev_ mode is active
  }
  try {
    if (preview) {
      LmStoryblokService.setDevMode()
      LmStoryblokService.setQuery(previewData)
    }
    const { notFoundLocale, ...pageProps } = await getPageProps(slug, {
      locale,
      defaultLocale,
      locales,
      insideStoryblok: preview
    })
    if (!pageProps.page && notFoundLocale) {
      return {
        redirect: {
          destination: notFoundLocale,
          permanent: true
        }
      }
    }
    if (!(pageProps.page && pageProps.settings)) {
      return {
        notFound: true
      }
    }
    return {
      props: pageProps,
      revalidate: 300
    }
  } catch (e) {
    console.log('error', e)
    throw new Error('error occured')
  }
}

export default pagesGetStaticProps
