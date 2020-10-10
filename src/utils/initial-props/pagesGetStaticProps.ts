import { GetStaticProps } from 'next'
import { getBaseProps } from './getBaseProps'
import getPageProps from './getPageProps'
import { AppPageProps } from '../../typings/app'
import { LmStoryblokService } from './StoryblokService'

const pagesGetStaticProps: GetStaticProps = async (
  props
): Promise<{ props: AppPageProps; revalidate?: number }> => {
  // const slug = Array.isArray(currentSlug) ? currentSlug.join('/') : currentSlug
  const { params, preview, previewData } = props
  const slug = params?.index || 'home'
  console.log('static props', slug, params)
  // startMeasureTime('start get static props')
  if (Array.isArray(slug) && slug[0] === '_dev_') {
    return { props: getBaseProps({ type: 'not_supported' }) } // do nothing _dev_ mode is active
  }
  try {
    if (preview) {
      LmStoryblokService.setDevMode()
      LmStoryblokService.setQuery(previewData)
      await LmStoryblokService.setCacheVersion()
    }
    // console.log('pagesGetStaticProps', previewData, props)
    const pageProps = await getPageProps(slug, !!preview)
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
