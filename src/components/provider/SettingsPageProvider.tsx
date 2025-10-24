import {
  createContext,
  PropsWithChildren,
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

function SettingsPageProvider({
  settings,
  page,
  children
}: PropsWithChildren<{
  settings: GlobalStoryblok
  page?: PageStoryblok | null
}>) {
  const { insideStoryblok } = useAppContext()
  const [stateSettings, setSettings] = useState(settings)
  const [statePage, setPage] = useState<PageStoryblok | null>(page || null)
  // keep page in sync when props change
  useEffect(() => {
    setPage((prev) => {
      if (!page) return null
      if (prev?.uuid === page.uuid) return prev
      return page
    })
  }, [page])
  // keep settings in sync when props change
  useEffect(() => {
    setSettings((prev) => {
      if (!settings) return prev
      if (prev?.uuid === settings.uuid) return prev
      return settings
    })
  }, [settings])

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
                    // window.location.reload()
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
