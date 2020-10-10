import { GetServerSideProps } from 'next'
import getPageProps from './getPageProps'
import { LmStoryblokService } from './StoryblokService'

const pagesGetServerSideProps: GetServerSideProps = async (props) => {
  // const slug = Array.isArray(currentSlug) ? currentSlug.join('/') : currentSlug
  const { query } = props

  try {
    // startMeasureTime('start get server side props')

    const slug = query?.index || 'home'
    LmStoryblokService.setDevMode()
    LmStoryblokService.setQuery(query)
    await LmStoryblokService.setCacheVersion()

    // console.log('pagesGetServerSideProps', hostname, slug)
    const pageProps = await getPageProps(slug, true)
    // endMeasureTime()

    return {
      props: pageProps
    }
  } catch (e) {
    console.log('error', e)
    throw new Error('error occured')
  }
}

export default pagesGetServerSideProps
