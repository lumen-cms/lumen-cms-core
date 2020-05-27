import { GlobalStoryblok, PageStoryblok } from './generated/components-schema'
import { CategoryComponent, PageComponent, StaticcontainerComponent } from './generated/schema'
import { Story, StoryData } from 'storyblok-js-client'
import { FunctionComponentFactory } from 'react'

type ErrorProps = {
  type: 'not_supported' | 'page_not_found' | 'settings_not_found' | 'server_error',
  status: number,
  url: string
}

export type AppApiRequestPayload = {
  page: Story,
  allStories: StoryData<PageComponent>[],
  settings: Story,
  locale?: string,
  allCategories: StoryData<CategoryComponent>[],
  allStaticContent: StoryData<StaticcontainerComponent>[],
  listWidgetData: { [k: string]: StoryData<PageComponent>[] } | null
}

type SubProps = Pick<AppApiRequestPayload, 'allStaticContent' | 'locale' | 'allCategories' | 'listWidgetData'>

export type AppPageProps = SubProps & {
  page?: PageStoryblok | null
  settings?: GlobalStoryblok | null
  error?: ErrorProps
  query?: any
  insideStoryblok?: boolean
  [k: string]: any
}

export type ComponentRenderFuncProps = {
  content?: any,
  _uid?: string,
  i?: number // iteration in case of array render
  [k: string]: any
}
export type ComponentRenderProps = FunctionComponentFactory<ComponentRenderFuncProps>

