import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react'
import { useRouter } from 'next/router'
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
  const { isPreview } = useRouter() || {}
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
    // only load inside preview mode
    if (isPreview && typeof window !== 'undefined') {
      // first load the bridge, then initialize the event listeners
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { StoryblokBridge } = window

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (typeof StoryblokBridge !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const storyblokInstance = new StoryblokBridge()

        storyblokInstance.on(['change', 'published', 'unpublished'], () => {
          console.log('published triggered')
          window.location.reload()
        })

        storyblokInstance.on('input', (event: any) => {
          const newContent = {
            ...event?.story.content,
            uuid: event?.story.uuid
          }
          if (
            event?.story.content.component === 'page' &&
            event?.story.uuid === page?.uuid
          ) {
            setPage(newContent)
          }
          if (
            event?.story.content.component === 'global' &&
            event?.story.uuid === settings?.uuid
          ) {
            setSettings(newContent)
          }
        })
      }
    }
    // eslint-disable-next-line
  }, [])

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
