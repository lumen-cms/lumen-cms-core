import { StoriesParams } from 'storyblok-js-client'
import { LmStoryblokService } from '../StoryblokService'

export const listStoriesData = async () => {
  const params: StoriesParams = {
    filter_query: {
      component: {
        in: 'page,event,news'
      }
    }
  }
  const storiesResult = await LmStoryblokService.get('cdn/stories', params)
  return storiesResult.data
}
