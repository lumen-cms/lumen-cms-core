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

// @ts-ignore
const SettingsContext = createContext<GlobalStoryblok>(null)
// @ts-ignore
const PageContext = createContext<PageStoryblok>(null)
//
const InsideStoryblokContext = createContext<boolean | undefined>(false)

export const SettingsPageProvider: FC<{
  settings: GlobalStoryblok
  page?: PageStoryblok | null
  insideStoryblok?: boolean
}> = ({ insideStoryblok, settings, page, children }) => {
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
    <InsideStoryblokContext.Provider value={insideStoryblok}>
      <SettingsContext.Provider value={stateSettings}>
        <PageContext.Provider value={statePage as PageStoryblok}>
          {children}
        </PageContext.Provider>
      </SettingsContext.Provider>
    </InsideStoryblokContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
export const usePage = () => useContext(PageContext)
export const useInsideStoryblok = () => useContext(InsideStoryblokContext)
