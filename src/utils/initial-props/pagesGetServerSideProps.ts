import { GetServerSideProps } from 'next'
import getPageProps from './getPageProps'
import { LmStoryblokService } from './StoryblokService'
import { AppPageProps } from '../../typings/app'

const pagesGetServerSideProps: GetServerSideProps = async (
  props
): Promise<{ props: AppPageProps }> => {
  // const slug = Array.isArray(currentSlug) ? currentSlug.join('/') : currentSlug
  const { query } = props

  try {
    // startMeasureTime('start get server side props')

    const slug = query?.index || 'home'
    LmStoryblokService.setDevMode()
    LmStoryblokService.setQuery(query)

    // console.log('pagesGetServerSideProps', hostname, slug)
    const pageProps = await getPageProps(slug, true)
    // endMeasureTime()

    return {
      props: pageProps
    }
  } catch (e) {
    console.log('error', e)
    throw new Error('error occurred')
  }
}

export default pagesGetServerSideProps
