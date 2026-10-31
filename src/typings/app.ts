import { GetStaticPropsContext } from 'next'
import {
  CategoryStoryblok,
  GlobalStoryblok,
  PageStoryblok
} from './generated/components-schema'
import { CategoryComponent, PageComponent } from './generated/schema'
import { ISbStoryData } from 'storyblok-js-client'
import type { StoryblokResponse } from '../utils/initial-props/storyblokResponse'

export interface IClaims {
  [key: string]: any // just a copy of the IClaim
}

export type LmErrorProps = {
  type:
    | 'not_supported'
    | 'page_not_found'
    | 'settings_not_found'
    | 'server_error'
  status: number
  url: string
}

export type AllStoryData = ISbStoryData<PageComponent>[]
export type AllCategoryData = ISbStoryData<
  Omit<CategoryComponent, 'tag_reference'> & {
    tag_reference?: CategoryStoryblok['tag_reference'] | null
  }
>[]

export type AppApiRequestPayload = {
  page: StoryblokResponse | null
  settings: StoryblokResponse | null
  user?: IClaims
}

export type AppPageProps = PagePropsOptions & {
  page?: PageStoryblok | null
  settings?: GlobalStoryblok | null
  error?: LmErrorProps
  query?: any
  user?: IClaims
  pageNotFound?: boolean
  slug?: string
  needAuth?: boolean
  // [k: string]: any
}

export type ComponentRenderContent =
  import('./storyblok-registry').StoryblokContent
export type ComponentRenderFuncProps<
  C extends ComponentRenderContent = ComponentRenderContent
> = import('./storyblok-registry').DynamicStoryblokProps<C>

export type PagePropsOptions = Pick<
  GetStaticPropsContext,
  'defaultLocale' | 'locale' | 'locales'
> & {
  insideStoryblok?: boolean
}
