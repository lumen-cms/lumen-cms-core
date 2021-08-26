import {
  CategoryBoxStoryblok,
  CategoryStoryblok,
  EventCategoryStoryblok,
  EventStoryblok,
  ListSearchAutocompleteStoryblok,
  ListSearchFieldStoryblok,
  ListStoriesStoryblok,
  ListWidgetStoryblok,
  NewsCategoryStoryblok,
  NewsListStoryblok,
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

type LmPageStoryblok = PageStoryblok & {
  categories?: StoryData<CategoryStoryblok>[]
}
type LmNewsStoryblok = NewsStoryblok & {
  category?: StoryData<NewsCategoryStoryblok>
}

type LmEventStoryblok = EventStoryblok & {
  category?: StoryData<EventCategoryStoryblok>
}

export type ListStoriesData = StoryData<
  LmPageStoryblok | LmNewsStoryblok | LmEventStoryblok
>

export type LmListStoriesPayload = {
  stories: ListStoriesData[]
  cv: number
  rels?: any[]
  links?: {
    name: string
    id: number
    uuid: string
    slug: string
    url: string
    full_slug: string
  }[]
  total: number
  page: number
}

export type LmListStoriesData = {
  data: {
    stories: ListStoriesData[]
    cv: number
    rels?: any[]
    links?: {
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
export type LmNewsListItemProps = {
  content: ListStoriesData
  options: NewsListStoryblok
}

export type LmNewsListProps = {
  items: ListStoriesData[]
  options: NewsListStoryblok
}
