import {
  NewsCategoryStoryblok,
  NewsStoryblok
} from '../../typings/generated/components-schema'
import { ISbStoryData } from 'storyblok-js-client'

export type LmNews = NewsStoryblok & {
  category: ISbStoryData<NewsCategoryStoryblok>
}
export type LmNewsProps = {
  content: LmNews
}
