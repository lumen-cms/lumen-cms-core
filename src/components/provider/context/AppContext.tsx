import type { AllProductsQuery } from '../../../typings/generated/shopify-schema'
import { createContext, useContext } from 'react'
import { AppPageProps } from '../../../typings/app'

export type AppContextProps = Pick<
  AppPageProps,
  'locale' | 'defaultLocale' | 'slug' | 'insideStoryblok' | 'locales'
> & {
  allShopifyProducts?: AllProductsQuery['products']['edges']
  [k: string]: any
}

const defaultValue: AppContextProps = {
  insideStoryblok: false,
  locale: 'en',
  defaultLocale: 'en',
  locales: ['en'],
  slug: ''
}

export const AppContext = createContext<AppContextProps>(defaultValue)
export const useAppContext = () => useContext<AppContextProps>(AppContext)
