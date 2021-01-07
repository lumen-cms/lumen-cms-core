import create from 'zustand'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'

type AppStore = {
  settings: Partial<GlobalStoryblok>
  page: Partial<PageStoryblok>
}

export const useAppStore = create<AppStore>(() => ({
  settings: {},
  page: {}
  // setSettings: (val) =>
  //   set((state) => {
  //     if (state.settings.uuid !== val.uuid) {
  //       return { settings: val }
  //     }
  //   })
}))
