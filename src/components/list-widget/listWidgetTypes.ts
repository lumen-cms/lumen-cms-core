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
  PageStoryblok,
  PaginationStoryblok
} from '../../typings/generated/components-schema'
import { PageComponent } from '../../typings/generated/schema'
import { AllCategoryData } from '../../typings/app'
import { ISbStoryData } from 'storyblok-js-client/types/interfaces'

export type LmListWidgetProps = {
  content: ListWidgetStoryblok & {
    list_widget_data: {
      items: ISbStoryData<PageComponent>[]
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
  categories?: ISbStoryData<CategoryStoryblok>[]
}
type LmNewsStoryblok = NewsStoryblok & {
  category?: ISbStoryData<NewsCategoryStoryblok>
}

type LmEventStoryblok = EventStoryblok & {
  category?: ISbStoryData<EventCategoryStoryblok>
}

type ListStoriesTypes = LmPageStoryblok | LmNewsStoryblok | LmEventStoryblok

export type ListStoriesData = ISbStoryData<ListStoriesTypes>

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

export type LmListStoriesPaginationProps = {
  totalCount: number
  page: number
  options?: PaginationStoryblok
  className?: string
  disabled?: boolean
  onChange: (page: number) => void
  anchorId?: string
}
