import {
  NewsCategoryStoryblok,
  NewsListStoryblok,
  NewsStoryblok
} from '../../typings/generated/components-schema'
import { StoryData } from 'storyblok-js-client'

export type LmNews = NewsStoryblok & {
  category: StoryData<NewsCategoryStoryblok>
}
export type LmNewsProps = {
  content: LmNews
}

export type NewsListProps = {
  content: NewsListStoryblok & {
    news_list_data: StoryData<LmNews>[]
  }
}
