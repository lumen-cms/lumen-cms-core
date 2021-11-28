import { createContext, useContext } from 'react'
import { AppApiRequestPayload } from '../../../typings/app'
import { NextRouter } from 'next/router'

export type AppContextProps = Omit<
  AppApiRequestPayload,
  'settings' | 'page' | 'allStories'
> &
  Pick<NextRouter, 'locale' | 'locales' | 'defaultLocale' | 'asPath'> & {
    insideStoryblok?: boolean
    [k: string]: any
  }

const defaultValue: AppContextProps = {
  allCategories: [],
  allStaticContent: [],
  listWidgetData: {},
  insideStoryblok: false,
  locale: 'en',
  defaultLocale: 'en',
  locales: ['en'],
  asPath: ''
}

export const AppContext = createContext<AppContextProps>(defaultValue)
export const useAppContext = () => useContext<AppContextProps>(AppContext)
