import { LmStoryblokService } from '../../../utils/initial-props/StoryblokService'
import { getListStoriesParams } from '../../../utils/universal/getListStoriesParams'
import { ListStoriesData, LmListStoriesPayload } from '../listWidgetTypes'
import { AppPageProps } from '../../../typings/app'
import { ListStoriesStoryblok } from '../../../typings/generated/components-schema'
import { ISbStoriesParams } from 'storyblok-js-client'

export type FetchListStoriesProps = {
  searchText?: string
  pageProps: AppPageProps
  page: number
  content: ListStoriesStoryblok
  searchCategories: string[]
}

export const fetchListStories = async ({
  searchText,
  pageProps,
  page,
  content,
  searchCategories
}: FetchListStoriesProps): Promise<LmListStoriesPayload> => {
  let pageCategories = [...searchCategories, content.page_categories].filter(
    (i) => i
  )
  const storiesParams: ISbStoriesParams = {
    ...getListStoriesParams(
      {
        ...content,
        page_categories: pageCategories.length ? pageCategories : undefined
      },
      pageProps
    ),
    page,
    ...(searchText && {
      search_term: searchText
    })
  }
  const { data, total } = await LmStoryblokService.getStories(storiesParams)
  return {
    stories: data.stories as ListStoriesData[],
    page: page,
    total: total,
    cv: data.cv
  }
}
