import { ListStoriesStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { listStoriesData } from './listStoriesData'
import { getRootImageUrl } from 'src/utils/imageServices'

export const listStoriesDataEnriched = async (
  item: ListStoriesStoryblok,
  pageProps: AppPageProps
) => {
  const storiesResult = await listStoriesData(item, pageProps)
  if (pageProps.insideStoryblok) {
    return storiesResult
  }
  for (const st of storiesResult.data.stories) {
    const img = st.content.image?.filename || st.content.preview_image
    if (img) {
      const { getPlaiceholderCached } = require('./plaiceholderCached')
      const cached = await getPlaiceholderCached(getRootImageUrl(img))
      Object.assign(st, {
        content: {
          ...st.content,
          story_data: { ...cached }
        }
      })
    }
  }
  return storiesResult
}
