import { GetStaticProps } from 'next'
import { getBaseProps } from './getBaseProps'
import getPageProps from './getPageProps'
import { AppPageProps } from '../../typings/app'
import { LmStoryblokService } from './StoryblokService'

const pagesGetStaticProps: GetStaticProps = async (
  props
): Promise<{ props: AppPageProps; revalidate?: number }> => {
  // const slug = Array.isArray(currentSlug) ? currentSlug.join('/') : currentSlug
  const { params, preview, previewData, locale, locales, defaultLocale } = props
  const slug =
    params?.index?.length && params.index[0] !== defaultLocale
      ? params.index
      : 'home'
  console.log('static props', slug, params, locale, defaultLocale, locales)
  // startMeasureTime('start get static props')
  if (Array.isArray(slug) && slug[0] === '_dev_') {
    return { props: getBaseProps({ type: 'not_supported' }) } // do nothing _dev_ mode is active
  }
  try {
    if (preview) {
      LmStoryblokService.setDevMode()
      LmStoryblokService.setQuery(previewData)
    }
    const pageProps = await getPageProps(slug, {
      locale,
      defaultLocale,
      locales,
      insideStoryblok: preview
    })
    // endMeasureTime()
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
