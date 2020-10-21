import { Story, StoryData } from 'storyblok-js-client'
import { GlobalStoryblok, PageStoryblok } from './generated/components-schema'
import {
  CategoryComponent,
  PageComponent,
  StaticcontainerComponent
} from './generated/schema'

export interface IClaims {
  [key: string]: any // just a copy of the IClaim
}

type ErrorProps = {
  type:
    | 'not_supported'
    | 'page_not_found'
    | 'settings_not_found'
    | 'server_error'
  status: number
  url: string
}

export type AppApiRequestPayload = {
  page: Story
  allStories: StoryData<PageComponent>[]
  settings: Story
  locale?: string
  allCategories: StoryData<CategoryComponent>[]
  allStaticContent: StoryData<StaticcontainerComponent>[]
  listWidgetData: { [k: string]: StoryData<PageComponent>[] } | null
  user?: IClaims
}

type SubProps = Pick<
  AppApiRequestPayload,
  'allStaticContent' | 'locale' | 'allCategories' | 'listWidgetData'
>

export type AppPageProps = SubProps & {
  page?: PageStoryblok | null
  settings?: GlobalStoryblok | null
  error?: ErrorProps
  query?: any
  insideStoryblok?: boolean
  user?: IClaims
  [k: string]: any
}

export type ComponentRenderFuncProps = {
  content?: any
  _uid?: string
  i?: number // iteration in case of array render
  [k: string]: any
}
