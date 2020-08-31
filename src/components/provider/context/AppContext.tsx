import { createContext, useContext } from 'react'
import { AppApiRequestPayload } from '../../../typings/app'

export type AppContextProps = Omit<AppApiRequestPayload,
  'locale' | 'settings' | 'page' | 'allStories'> & {
  insideStoryblok?: boolean
  [k: string]: any
}

const defaultValue: AppContextProps = {
  allCategories: [],
  allStaticContent: [],
  listWidgetData: {},
  insideStoryblok: false
}

export const AppContext = createContext<AppContextProps>(defaultValue)
export const useAppContext = () => useContext<AppContextProps>(AppContext)
