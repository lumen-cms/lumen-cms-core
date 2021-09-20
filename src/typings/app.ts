import { Story, StoryData } from 'storyblok-js-client'
import { GetStaticPropsContext } from 'next'
import { GlobalStoryblok, PageStoryblok } from './generated/components-schema'
import { CategoryComponent, PageComponent } from './generated/schema'
import { GoogleFormDataProps } from '../utils/hooks/googleForms/parseHijackedFormData'

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

export type AllStoryData = StoryData<PageComponent>[]
export type AllCategoryData = StoryData<CategoryComponent>[]

export type AppApiRequestPayload = {
  page: Story
  settings: Story
  // locale?: string | null
  formData?: { [k: string]: GoogleFormDataProps } | null
  user?: IClaims
  notFoundLocale?: string | null
  googleFontString?: string
}

export type AppPageProps = Pick<
  AppApiRequestPayload,
  'formData' | 'googleFontString' | 'notFoundLocale'
> &
  PagePropsOptions & {
    page?: PageStoryblok | null
    settings?: GlobalStoryblok | null
    error?: LmErrorProps
    query?: any
    user?: IClaims
    pageNotFound?: boolean
    // [k: string]: any
  }

export type ComponentRenderFuncProps = {
  content?: any
  _uid?: string
  i?: number // iteration in case of array render
  [k: string]: any
}

export type PagePropsOptions = Pick<
  GetStaticPropsContext,
  'defaultLocale' | 'locale' | 'locales'
> & {
  insideStoryblok?: boolean
}
