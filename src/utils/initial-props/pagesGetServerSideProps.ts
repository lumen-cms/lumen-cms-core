import { GetServerSideProps } from 'next'
import getPageProps from './getPageProps'

const pagesGetServerSideProps: GetServerSideProps = async (props) => {
  // const slug = Array.isArray(currentSlug) ? currentSlug.join('/') : currentSlug
  const { query } = props

  try {
    // startMeasureTime('start get server side props')

    const slug = query?.index || 'home'
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
