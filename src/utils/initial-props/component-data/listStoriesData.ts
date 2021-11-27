import { StoriesParams } from 'storyblok-js-client'
import { LmStoryblokService } from '../StoryblokService'
import { ListStoriesStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { LmListStoriesData } from '../../../components/list-widget/listWidgetTypes'
import { getListStoriesParams } from '../../universal/getListStoriesParams'
import { getPlaiceholder } from 'plaiceholder'
import { getRootImageUrl } from '../../imageServices'

export const listStoriesData = async (
  item: ListStoriesStoryblok,
  pageProps: AppPageProps
) => {
  const params: StoriesParams = getListStoriesParams(item, pageProps)
  const storiesResult: LmListStoriesData = await LmStoryblokService.get(
    'cdn/stories',
    params
  )
  // not in use
  delete storiesResult.headers
  storiesResult.data.rels = []
  storiesResult.data.links = []
  if (!process.env.STORYBOOK && !pageProps.insideStoryblok) {
    for (const st of storiesResult.data.stories) {
      const img = st.content.image?.filename || st.content.preview_image
      if (img) {
        const {
          base64,
          img: { width, height }
        } = await getPlaiceholder(getRootImageUrl(img))
        Object.assign(st, {
          content: {
            ...st.content,
            story_data: { base64, width, height }
          }
        })
      }
    }
  }
  return storiesResult
}
