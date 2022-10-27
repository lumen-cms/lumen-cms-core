import { GetStaticPropsContext } from 'next'
import { GlobalStoryblok, PageStoryblok } from './generated/components-schema'
import { CategoryComponent, PageComponent } from './generated/schema'
import { EmotionCache } from '@emotion/react'
import { ISbResult, ISbStoryData } from 'storyblok-js-client/types/interfaces'

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
export type AllCategoryData = ISbStoryData<CategoryComponent>[]

export type AppApiRequestPayload = {
  page: ISbResult
  settings: ISbResult
  user?: IClaims
  notFoundLocale?: string | null
  googleFontString?: string
}

export type AppPageProps = Pick<
  AppApiRequestPayload,
  'googleFontString' | 'notFoundLocale'
> &
  PagePropsOptions & {
    page?: PageStoryblok | null
    settings?: GlobalStoryblok | null
    error?: LmErrorProps
    query?: any
    user?: IClaims
    pageNotFound?: boolean
    slug?: string
    emotionCache?: EmotionCache
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
