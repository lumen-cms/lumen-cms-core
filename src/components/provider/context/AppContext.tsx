import { AppApiRequestPayload, ComponentRenderProps, LinkRenderProps } from '../../../typings/app'
import React, { createContext, useContext } from 'react'

export type AppContextProps =
  Omit<AppApiRequestPayload, 'locale' | 'settings' | 'page' | 'allStories'>
  & {
  insideStoryblok?: boolean
  ComponentRender: ComponentRenderProps
  LinkRender?: LinkRenderProps
  [k: string]: any
}

const defaultValue: AppContextProps = {
  allCategories: [],
  allStaticContent: [],
  listWidgetData: {},
  insideStoryblok: false,
  ComponentRender: (_blok: any) => {
    return (
      <div>needs to be set</div>
    )
  }
}

export const AppContext = createContext<AppContextProps>(defaultValue)
export const useAppContext = () => useContext<AppContextProps>(AppContext)
