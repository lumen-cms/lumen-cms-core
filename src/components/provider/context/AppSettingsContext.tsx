import { createContext, useContext } from 'react'
import { GlobalStoryblok } from '../../../typings/generated/components-schema'

const defaultSettings: GlobalStoryblok = {
  _uid: 'default_settings',
  component: 'global',
  theme_base: 'base'
}

export const AppSettingsContext = createContext<GlobalStoryblok>(
  defaultSettings
)

export const useAppSettings = () =>
  useContext<GlobalStoryblok>(AppSettingsContext)
