import { AppPageProps } from '../../typings/app'
import { PageStoryblok } from '../../typings/generated/components-schema'
import { NextRouter } from 'next/router'

export type AppContainerProps = {
  content: AppPageProps
  shallowRouter: Pick<
    NextRouter,
    'locale' | 'locales' | 'defaultLocale' | 'asPath'
  >
}
export type AppSeoProps = {
  page?: PageStoryblok | null
  previewImage?: string
}

export type ContentSpaceProps = {
  isBlock?: boolean
}
