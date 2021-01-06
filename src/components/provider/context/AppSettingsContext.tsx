import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { GlobalStoryblok } from '../../../typings/generated/components-schema'

type AppSettingsProps = {
  settings: GlobalStoryblok
  setSettings: Dispatch<SetStateAction<GlobalStoryblok>>
}
const noop = () => {
  //
}
const defaultSettings: AppSettingsProps = {
  settings: {
    _uid: 'default_settings',
    component: 'global',
    theme_base: 'base'
  },
  setSettings: noop
}

export const AppSettingsContext = createContext<AppSettingsProps>(
  defaultSettings
)

export const useAppSettings = () =>
  useContext<AppSettingsProps>(AppSettingsContext)
