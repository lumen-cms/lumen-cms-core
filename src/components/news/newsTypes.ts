import {
  NewsCategoryStoryblok,
  NewsStoryblok
} from '../../typings/generated/components-schema'
import { StoryData } from 'storyblok-js-client'

export type LmNews = NewsStoryblok & {
  category: StoryData<NewsCategoryStoryblok>
}
export type LmNewsProps = {
  content: LmNews
}
