import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'

const SettingsContext = createContext<GlobalStoryblok>({} as GlobalStoryblok)
const PageContext = createContext<PageStoryblok>({} as PageStoryblok)

export const SettingsPageProvider: FC<{
  settings: GlobalStoryblok
  page?: PageStoryblok | null
}> = ({ settings, page, children }) => {
  const [stateSettings, setSettings] = useState(settings)
  const [statePage, setPage] = useState<PageStoryblok | null>(page || null)
  useEffect(() => {
    if (page && statePage?.uuid !== page?.uuid) {
      setPage(page)
    } else if (!page) {
      setPage(null)
    }
  }, [statePage?.uuid, page, setPage])
  useEffect(() => {
    if (settings && stateSettings?.uuid !== settings?.uuid) {
      setSettings(settings)
    }
  }, [settings, stateSettings.uuid, setSettings])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.storyblok) {
      window.storyblok.init()
      window.storyblok.on(['change'], () => {
        console.log('change::save triggered')
        window.location.reload()
      })
      window.storyblok.on(['published', 'unpublished'], () => {
        console.log('published triggered')
        window.location.reload()
      })

      window.storyblok.on('input', (event) => {
        const newContent = { ...event?.story.content, uuid: event?.story.uuid }
        if (
          event?.story.content.component === 'page' &&
          event?.story.uuid === page?.uuid
        ) {
          console.log('input::input content changed')
          const newPage = window.storyblok.addComments(
            newContent,
            event?.story.id
          ) as PageStoryblok
          setPage(newPage)
        }
        if (
          event?.story.content.component === 'global' &&
          event?.story.uuid === settings?.uuid
        ) {
          console.log('input::input settings changed')
          const newSettings = window.storyblok.addComments(
            newContent,
            event?.story.id
          ) as GlobalStoryblok
          setSettings(newSettings)
        }
      })
    }
  }, [page?.uuid, settings?.uuid, setSettings, setPage])
  return (
    <SettingsContext.Provider value={stateSettings}>
      <PageContext.Provider value={statePage as PageStoryblok}>
        {children}
      </PageContext.Provider>
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
export const usePage = () => useContext(PageContext)
