import {
  CategoryBoxStoryblok,
  EventStoryblok,
  ListSearchAutocompleteStoryblok,
  ListSearchFieldStoryblok,
  ListStoriesStoryblok,
  ListWidgetStoryblok,
  NewsStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'
import { StoryData } from 'storyblok-js-client'
import { PageComponent } from '../../typings/generated/schema'
import { AllCategoryData } from '../../typings/app'

export type LmListWidgetProps = {
  content: ListWidgetStoryblok & {
    list_widget_data: {
      items: StoryData<PageComponent>[]
      total: number
      perPage: number
      cv: number
    }
  }
}
export type LmCategoryBoxProps = {
  content: CategoryBoxStoryblok & {
    category_box_data: AllCategoryData
  }
}
export type LmListSearchAutocompleteProps = {
  content: ListSearchAutocompleteStoryblok
}
export type LmListSearchFieldProps = { content: ListSearchFieldStoryblok }

export type ListStoriesData = StoryData<
  PageStoryblok | NewsStoryblok | EventStoryblok
>

export type LmListStoriesPayload = {
  stories: ListStoriesData[]
  cv: number
  rels: any
  links: any
  total: number
  page: number
}

export type LmListStoriesData = {
  data: {
    stories: ListStoriesData[]
    cv: number
    rels: any[]
    links: {
      name: string
      id: number
      uuid: string
      slug: string
      url: string
      full_slug: string
    }[]
  }
  perPage: number
  total: number
  headers: any
}

export type LmListStoriesProps = {
  content: ListStoriesStoryblok & {
    list_stories_data: LmListStoriesData
  }
}
