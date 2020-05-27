import React, { createContext, FunctionComponent, useContext } from 'react'
import { AppApiRequestPayload, ComponentRenderProps } from '../../typings/app'

export type AppContextProps =
  Omit<AppApiRequestPayload, 'locale' | 'settings' | 'page' | 'allStories'>
  & {
  insideStoryblok?: boolean
  ComponentRender: ComponentRenderProps
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
const AppContext = createContext<AppContextProps>(defaultValue)

const AppProvider: FunctionComponent<{ content: AppContextProps }> = ({ children, content }) => {
  return <AppContext.Provider value={content}>{children}</AppContext.Provider>
}
AppProvider.displayName = 'AppProvider'

export const useAppContext = () => useContext<AppContextProps>(AppContext)

export default AppProvider
