import { createContext, useContext } from 'react'
import { PageStoryblok } from '../../../typings/generated/components-schema'

type AppPageProps = {
  page: PageStoryblok | null
}

export const AppPageContext = createContext<AppPageProps>({ page: null })

export const useAppPage = () => useContext<AppPageProps>(AppPageContext)
