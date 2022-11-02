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
import NextScript from 'next/script'
import { useAppContext } from '@context/AppContext'

const SettingsContext = createContext<GlobalStoryblok>({} as GlobalStoryblok)
const PageContext = createContext<PageStoryblok>({} as PageStoryblok)

declare global {
  interface Window {
    StoryblokBridge: any
  }
}

const SettingsPageProvider: FC<
  React.PropsWithChildren<{
    settings: GlobalStoryblok
    page?: PageStoryblok | null
  }>
> = ({ settings, page, children }) => {
  const { insideStoryblok } = useAppContext()
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

  return (
    <SettingsContext.Provider value={stateSettings}>
      <PageContext.Provider value={statePage as PageStoryblok}>
        {insideStoryblok && (
          <NextScript
            strategy={'lazyOnload'}
            src="//app.storyblok.com/f/storyblok-v2-latest.js"
            onLoad={() => {
              const { StoryblokBridge } = window

              if (typeof StoryblokBridge !== 'undefined') {
                const storyblokInstance = new StoryblokBridge()

                storyblokInstance.on(
                  ['change', 'published', 'unpublished'],
                  () => {
                    console.log('published triggered')
                    window.location.reload()
                  }
                )

                storyblokInstance.on('input', (event: any) => {
                  const newContent = {
                    ...event?.story.content,
                    uuid: event?.story.uuid
                  }
                  if (
                    event?.story.content.component === 'global' &&
                    event?.story.uuid === settings?.uuid
                  ) {
                    setSettings(newContent)
                    return
                  }
                  if (event?.story.uuid === page?.uuid) {
                    setPage(newContent)
                  }
                })
              }
            }}
          />
        )}
        {children}
      </PageContext.Provider>
    </SettingsContext.Provider>
  )
}

export default SettingsPageProvider

export const useSettings = () => useContext(SettingsContext)
export const usePage = () => useContext(PageContext)
